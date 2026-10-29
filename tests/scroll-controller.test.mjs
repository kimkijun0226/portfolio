import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const source = readFileSync(new URL('../lib/scroll/controller.ts', import.meta.url), 'utf8');
class FakeLenis {
  constructor(options) { this.options = options; this.wrapper = options.wrapper; this.targetScroll = this.wrapper.scrollTop; this.animatedScroll = this.targetScroll; this.isScrolling = false; this.callbacks = []; this.wrapper.engine = this; }
  on(_event, callback) { this.callbacks.push(callback); return () => {}; }
  scrollTo(top, options = {}) {
    this.targetScroll = top;
    this.pending = null;
    if (options.immediate) {
      this.wrapper.scrollTop = this.animatedScroll = top; this.isScrolling = false;
      this.callbacks.forEach(callback => callback()); options.onComplete?.();
    } else {
      this.pending = { from: this.wrapper.scrollTop, to: top, start: null, onComplete: options.onComplete };
      this.isScrolling = 'smooth';
    }
  }
  raf(time) {
    if (!this.pending) return;
    const pending = this.pending;
    pending.start ??= time - 16;
    const progress = Math.min(1, (time - pending.start) / 500);
    this.wrapper.scrollTop = this.animatedScroll = pending.from + (pending.to - pending.from) * progress;
    this.callbacks.forEach(callback => callback());
    if (progress === 1) { this.pending = null; this.isScrolling = false; pending.onComplete?.(); }
  }
  resize() { this.targetScroll = this.animatedScroll = this.wrapper.scrollTop; }
  destroy() { this.destroyed = true; }
}
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const controllerModule = { exports: {} };
vm.runInThisContext(`(function(require, exports) { ${compiled} })`)(name => {
  if (name === 'lenis') return { default: FakeLenis };
  if (name === './frame') return { flushScrollFrame() {} };
  throw new Error(`Unexpected import: ${name}`);
}, controllerModule.exports);
const { attachScrollController } = controllerModule.exports;

class Surface extends EventTarget {
  scrollTop = 100;
  scrollHeight = 3000;
  clientHeight = 600;
  clientWidth = 1000;
  offsetWidth = 1000;
  offsetHeight = 1800;
  attributes = new Set();
  interactive = false;
  projects = null;
  closest(selector) {
    return selector === '#projects' ? this.projects : this.interactive ? this : null;
  }
  getBoundingClientRect() { return { top: 0, left: 0, width: 1000 }; }
  querySelectorAll() { return []; }
  setAttribute(name) { this.attributes.add(name); }
  removeAttribute(name) { this.attributes.delete(name); }
  setPointerCapture() {}
  releasePointerCapture() {}
  hasPointerCapture() { return true; }
}

globalThis.Element = Surface;
globalThis.ResizeObserver = class { observe() {} disconnect() {} };
globalThis.getComputedStyle = () => ({ scrollPaddingTop: '0px' });

function setup() {
  const wrapper = new Surface();
  const win = new EventTarget();
  let id = 0;
  let eventTime = 0;
  let flushedTime = 0;
  const frames = new Map();
  const timers = new Map();
  Object.assign(win, {
    requestAnimationFrame(callback) { frames.set(++id, callback); return id; },
    cancelAnimationFrame(key) { frames.delete(key); },
    setTimeout(callback) { timers.set(++id, callback); return id; },
    clearTimeout(key) { timers.delete(key); },
    getSelection() { return null; },
    matchMedia() { return { matches: false }; },
  });
  globalThis.window = win;
  const { destroy: cleanup, scrollTo } = attachScrollController(wrapper);
  const send = (target, type, props = {}) => {
    const { at = eventTime + 250, ...fields } = props;
    eventTime = at;
    const event = new Event(type, { cancelable: true });
    Object.defineProperty(event, 'timeStamp', { value: at });
    Object.assign(event, { pointerType: 'mouse', pointerId: 1, button: 0, buttons: 1, detail: 1, clientX: 400, clientY: 400, ...fields });
    target.dispatchEvent(event);
    return event;
  };
  const flush = (time = 1000) => {
    eventTime = Math.max(eventTime, time);
    if (time < flushedTime) flushedTime = time;
    for (let current = flushedTime; current <= time; current += 16) {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(current));
    }
    flushedTime = time;
  };
  const idle = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); };
  return { wrapper, win, send, flush, idle, cleanup, scrollTo };
}

function setProjectMarkers(wrapper, positions = [600, 1200, 1800]) {
  const section = new Surface();
  section.previousElementSibling = new Surface();
  section.previousElementSibling.getBoundingClientRect = () => ({ top: -wrapper.scrollTop, height: 600 });
  section.nextElementSibling = new Surface();
  section.nextElementSibling.getBoundingClientRect = () => ({ top: 2400 - wrapper.scrollTop });
  wrapper.querySelectorAll = selector => selector === "[data-projects-snap]" ? positions.map(position => {
    const marker = new Surface();
    marker.projects = section;
    marker.getBoundingClientRect = () => ({ top: position - wrapper.scrollTop, height: 1 });
    return marker;
  }) : [];
}

function complete(flush, start = 0) { flush(start); flush(start + 1000); flush(start + 2000); }

function nativeWheel(wrapper, send, delta, at) {
  const event = send(wrapper, 'wheel', { deltaY: delta, at });
  if (!event.defaultPrevented) wrapper.scrollTop = Math.max(0, Math.min(wrapper.scrollHeight - wrapper.clientHeight, wrapper.scrollTop + delta));
  send(wrapper, 'scroll', { at });
}

for (const top of [100, 450, 1808, 2200, 2400]) {
  test(`ordinary position ${top} is never pulled into a project or another section`, () => {
    const { wrapper, send, flush, idle, cleanup } = setup();
    setProjectMarkers(wrapper); wrapper.scrollTop = top;
    send(wrapper, 'scroll'); idle(); complete(flush);
    assert.equal(wrapper.scrollTop, top);
    cleanup();
  });
}

for (const [delta, expected] of [[8, 600], [100, 600], [239, 600], [240, 1200], [6000, 1200]]) {
  test(`wheel ${delta} advances only after 40 percent of a project`, () => {
    const { wrapper, send, idle, flush, cleanup } = setup();
    setProjectMarkers(wrapper); wrapper.scrollTop = 600;
    nativeWheel(wrapper, send, delta, 0);
    if (delta < 240) assert.equal(wrapper.engine.targetScroll, 600 + delta);
    idle(); complete(flush);
    assert.equal(wrapper.scrollTop, expected);
    cleanup();
  });
}

for (const [start, delta] of [[600, -8], [1800, 8], [100, 80]]) {
  test(`section boundary ${start} follows the wheel without snapping to a section top`, () => {
    const { wrapper, send, idle, flush, cleanup } = setup();
    setProjectMarkers(wrapper); wrapper.scrollTop = start;
    nativeWheel(wrapper, send, delta, 0);
    complete(flush);
    assert.equal(wrapper.scrollTop, start + delta);
    idle(); complete(flush);
    // Entry may align the Projects card, but must never jump to a surrounding section top.
    assert.ok(Math.abs(wrapper.scrollTop - (start + delta)) <= 20);
    cleanup();
  });
}

test('small inputs accumulate until the project threshold is reached', () => {
  const { wrapper, send, idle, flush, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 600;
  for (let i = 0; i < 23; i++) nativeWheel(wrapper, send, 10, i * 20);
  assert.equal(wrapper.engine.targetScroll, 830);
  nativeWheel(wrapper, send, 10, 470);
  idle(); complete(flush);
  assert.equal(wrapper.scrollTop, 1200);
  cleanup();
});

test('completed transitions accept the next input without an idle gap', () => {
  const { wrapper, send, flush, cleanup } = setup();
  wrapper.scrollHeight = 4200;
  setProjectMarkers(wrapper, [600, 1200, 1800, 2400]); wrapper.scrollTop = 600;
  for (const [start, destination] of [[0, 1200], [1000, 1800], [2000, 2400]]) {
    for (let i = 0; i < 8; i++) nativeWheel(wrapper, send, 6000, start + i * 15);
    flush(start); flush(start + 100);
    assert.ok(wrapper.scrollTop < destination);
    flush(start + 900);
    assert.equal(wrapper.scrollTop, destination);
  }
  cleanup();
});

test('reversing a small input returns toward the starting card', () => {
  const { wrapper, send, idle, flush, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 1200;
  nativeWheel(wrapper, send, 100, 0); nativeWheel(wrapper, send, -80, 30);
  assert.equal(wrapper.engine.targetScroll, 1220);
  idle(); complete(flush);
  assert.equal(wrapper.scrollTop, 1200);
  cleanup();
});

for (const [dx, expected] of [[-390, 600], [-600, 1200], [-1600, 1800]]) {
  test(`horizontal drag ${dx} settles on its nearest card`, () => {
    const { wrapper, send, flush, cleanup } = setup();
    setProjectMarkers(wrapper); wrapper.scrollTop = 600;
    wrapper.projects = wrapper.querySelectorAll('[data-projects-snap]')[0].projects;
    send(wrapper, 'pointerdown'); send(wrapper, 'pointermove', { clientX: 400 + dx });
    send(wrapper, 'pointerup'); complete(flush);
    assert.equal(wrapper.scrollTop, expected);
    cleanup();
  });
}

test('vertical drag stays free and interactive clicks remain usable after cancellation', () => {
  const { wrapper, send, flush, cleanup } = setup();
  send(wrapper, 'pointerdown'); send(wrapper, 'pointermove', { clientY: 250 });
  assert.equal(wrapper.scrollTop, 250);
  send(wrapper, 'pointercancel'); complete(flush);
  wrapper.interactive = true; send(wrapper, 'pointerdown'); send(wrapper, 'pointerup');
  assert.equal(send(wrapper, 'click').defaultPrevented, false);
  assert.equal(wrapper.scrollTop, 250);
  cleanup();
});

test('touch and scrollbar motion settle only after their owners release them', () => {
  const { wrapper, win, send, idle, flush, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 600;
  send(wrapper, 'touchstart'); wrapper.scrollTop = 950; send(wrapper, 'scroll'); idle(); complete(flush);
  assert.equal(wrapper.scrollTop, 950);
  send(wrapper, 'touchend'); idle(); complete(flush, 1200); assert.equal(wrapper.scrollTop, 1200);
  wrapper.clientWidth = 980;
  send(wrapper, 'pointerdown', { clientX: 990 }); wrapper.scrollTop = 1600; send(wrapper, 'scroll');
  idle(); complete(flush, 2400); assert.equal(wrapper.scrollTop, 1600);
  send(win, 'pointerup'); idle(); complete(flush, 3600); assert.equal(wrapper.scrollTop, 1800);
  cleanup();
});

test('keyboard and wheel interrupt navigation without replaying old movement', () => {
  const { wrapper, send, win, flush, scrollTo, cleanup } = setup();
  scrollTo(1800); flush(0); flush(100);
  const top = wrapper.scrollTop;
  send(win, 'keydown', { key: 'PageDown' }); complete(flush, 200);
  assert.equal(wrapper.scrollTop, top);
  scrollTo(1800); flush(1300); flush(1400);
  nativeWheel(wrapper, send, 50, 1410);
  const requested = wrapper.engine.targetScroll; complete(flush, 1500);
  assert.equal(wrapper.scrollTop, requested);
  cleanup();
});

test('reduced motion settles directly and cleanup removes all pending movement', () => {
  const { wrapper, win, send, idle, flush, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 950;
  win.matchMedia = () => ({ matches: true }); send(wrapper, 'scroll'); idle();
  assert.equal(wrapper.scrollTop, 1200);
  win.matchMedia = () => ({ matches: false }); wrapper.scrollTop = 1500;
  send(wrapper, 'scroll'); idle(); flush(0); cleanup();
  const stopped = wrapper.scrollTop; complete(flush, 200);
  assert.equal(wrapper.scrollTop, stopped);
});

test('zoom, zero input and dialog controls do not hijack native scrolling', () => {
  const { wrapper, send, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 600;
  assert.equal(send(wrapper, 'wheel', { deltaY: 80, ctrlKey: true }).defaultPrevented, false);
  assert.equal(send(wrapper, 'wheel', { deltaY: 0, deltaX: 0 }).defaultPrevented, false);
  wrapper.interactive = true;
  assert.equal(send(wrapper, 'wheel', { deltaY: 80 }).defaultPrevented, false);
  cleanup();
});

test('non-cancelable native wheel input still interrupts an idle snap', () => {
  const { wrapper, send, idle, flush, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 950;
  send(wrapper, 'scroll'); idle(); flush(0); flush(20);
  const event = new Event('wheel', { cancelable: false });
  Object.assign(event, { deltaY: 80, deltaX: 0, deltaMode: 0, ctrlKey: false });
  wrapper.dispatchEvent(event);
  wrapper.scrollTop += 80;
  const nativePosition = wrapper.scrollTop;
  complete(flush, 60);
  assert.equal(wrapper.scrollTop, nativePosition);
  cleanup();
});

for (const [start, delta, expected] of [[600, 5000, 1200], [1200, 5000, 1800], [1800, -5000, 1200], [2400, -5000, 1800]]) {
  test(`strong wheel burst at ${start} moves only one project toward ${delta}`, () => {
    const { wrapper, send, idle, flush, cleanup } = setup();
    wrapper.scrollHeight = 4200;
    setProjectMarkers(wrapper, [600, 1200, 1800, 2400]);
    wrapper.scrollTop = start;
    for (let i = 0; i < 12; i++) nativeWheel(wrapper, send, delta, i * 30);
    idle(); complete(flush, 1000);
    assert.equal(wrapper.scrollTop, expected);
    nativeWheel(wrapper, send, -Math.sign(delta) * 5000, 2200);
    idle(); complete(flush, 2400);
    assert.equal(wrapper.scrollTop, start);
    cleanup();
  });
}

test('non-cancelable momentum cannot knock an active chapter animation off its target', () => {
  const { wrapper, send, flush, idle, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 600;
  nativeWheel(wrapper, send, 300, 0); flush(0); flush(100);
  const before = wrapper.scrollTop;
  const event = new Event('wheel', { cancelable: false });
  Object.assign(event, { deltaY: 6000, deltaX: 0, deltaMode: 0 });
  wrapper.dispatchEvent(event);
  wrapper.scrollTop = 2400; send(wrapper, 'scroll');
  assert.equal(wrapper.scrollTop, before);
  idle(); complete(flush, 200);
  assert.equal(wrapper.scrollTop, 1200);
  cleanup();
});


test('wheel preview is interpolated by Lenis instead of writing a jump', () => {
  const { wrapper, send, flush, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 600;
  nativeWheel(wrapper, send, 100, 0);
  assert.equal(wrapper.scrollTop, 600);
  assert.equal(wrapper.engine.targetScroll, 700);
  flush(0); flush(100);
  assert.ok(wrapper.scrollTop > 600 && wrapper.scrollTop < 700);
  cleanup(); assert.equal(wrapper.engine.destroyed, true);
});

test('normal wheel and project entry use the same Lenis instance', () => {
  const { wrapper, send, flush, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 500;
  nativeWheel(wrapper, send, 200, 0);
  assert.equal(wrapper.scrollTop, 500);
  assert.equal(wrapper.engine.targetScroll, 600);
  complete(flush);
  assert.equal(wrapper.scrollTop, 600);
  cleanup();
});

test('project geometry is not measured for each wheel event', () => {
  const { wrapper, send, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 600;
  let reads = 0;
  const query = wrapper.querySelectorAll;
  wrapper.querySelectorAll = selector => { reads++; return query(selector); };
  for (let i = 0; i < 20; i++) nativeWheel(wrapper, send, 5, i * 10);
  assert.ok(reads <= 2, `repeated DOM queries: ${reads}`);
  cleanup();
});

test('reduced motion keeps a strong burst to one adjacent project', () => {
  const { wrapper, win, send, idle, cleanup } = setup();
  setProjectMarkers(wrapper); wrapper.scrollTop = 600;
  win.matchMedia = () => ({ matches: true });
  for (let i = 0; i < 5; i++) nativeWheel(wrapper, send, 6000, i * 20);
  assert.equal(wrapper.scrollTop, 1200);
  idle();
  nativeWheel(wrapper, send, 6000, 200);
  assert.equal(wrapper.scrollTop, 1800);
  cleanup();
});
