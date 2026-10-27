import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/scroll/mouse-drag.ts', import.meta.url), 'utf8');
const { attachMouseDrag } = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText).toString('base64')}`);

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
globalThis.getComputedStyle = () => ({ scrollPaddingTop: '0px' });

function setup() {
  const wrapper = new Surface();
  const win = new EventTarget();
  let id = 0;
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
  const { destroy: cleanup, scrollTo } = attachMouseDrag(wrapper);
  const send = (target, type, props = {}) => {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { pointerType: 'mouse', pointerId: 1, button: 0, buttons: 1, detail: 1, clientX: 400, clientY: 400, ...props });
    target.dispatchEvent(event);
    return event;
  };
  const flush = (time = 1000) => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(time));
  };
  const idle = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); };
  return { wrapper, win, send, flush, idle, cleanup, scrollTo };
}

test('mouse drag follows the pointer without native selection scrolling', () => {
  const { wrapper, send, cleanup } = setup();
  send(wrapper, 'pointerdown');
  const move = send(wrapper, 'pointermove', { clientY: 250 });
  assert.equal(wrapper.scrollTop, 250);
  assert.equal(move.defaultPrevented, true);
  assert.ok(wrapper.attributes.has('data-drag-scrolling'));
  cleanup();
  assert.ok(!wrapper.attributes.has('data-drag-scrolling'));
});

test('small clicks, controls and touch gestures keep native behavior', () => {
  const { wrapper, send, cleanup } = setup();
  send(wrapper, 'pointerdown');
  assert.equal(send(wrapper, 'pointermove', { clientY: 398 }).defaultPrevented, false);
  send(wrapper, 'pointerup', { buttons: 0 });
  assert.equal(send(wrapper, 'click').defaultPrevented, false);
  wrapper.interactive = true;
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientY: 200 });
  assert.equal(wrapper.scrollTop, 100);
  wrapper.interactive = false;
  send(wrapper, 'pointerdown', { pointerType: 'touch' });
  send(wrapper, 'pointermove', { pointerType: 'touch', clientY: 200 });
  assert.equal(wrapper.scrollTop, 100);
  cleanup();
});

test('horizontal project dragging uses the vertical scroll timeline', () => {
  const { wrapper, send, cleanup } = setup();
  wrapper.projects = new Surface();
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientX: 200, clientY: 398 });
  assert.equal(wrapper.scrollTop, 220);
  send(wrapper, 'pointerup', { buttons: 0 });
  assert.equal(send(wrapper, 'click').defaultPrevented, true);
  cleanup();
});

test('vertical release keeps the reading position instead of jumping to a distant snap', () => {
  const { wrapper, send, flush, cleanup } = setup();
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 1200 - wrapper.scrollTop });
  wrapper.querySelectorAll = () => [marker];
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientY: 100 });
  send(wrapper, 'pointerup', { buttons: 0 });
  flush(0);
  flush(1200);
  assert.equal(wrapper.scrollTop, 400);
  assert.ok(!wrapper.attributes.has('data-drag-scrolling'));
  cleanup();
});

test('horizontal release aligns within projects without jumping to another section', () => {
  const { wrapper, send, flush, cleanup } = setup();
  const projects = new Surface();
  wrapper.projects = projects;
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop });
  projects.querySelectorAll = () => [marker];
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientX: -200 });
  assert.equal(wrapper.scrollTop, 460);
  send(wrapper, 'pointerup', { buttons: 0 });
  flush(0);
  flush(160);
  assert.ok(wrapper.scrollTop > 460 && wrapper.scrollTop < 600);
  flush(1200);
  assert.equal(wrapper.scrollTop, 600);
  assert.ok(!wrapper.attributes.has('data-drag-scrolling'));
  cleanup();
});

test('wheel interrupts release animation and cleanup removes listeners', () => {
  const { wrapper, send, flush, cleanup } = setup();
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop });
  wrapper.projects = new Surface();
  wrapper.projects.querySelectorAll = () => [marker];
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientX: -200 });
  send(wrapper, 'pointerup', { buttons: 0 });
  send(wrapper, 'wheel');
  flush(300);
  assert.equal(wrapper.scrollTop, 460);
  assert.ok(!wrapper.attributes.has('data-drag-scrolling'));
  cleanup();
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientY: 0 });
  assert.equal(wrapper.scrollTop, 460);
});

test('reduced motion settles immediately and dragging stays within scroll bounds', () => {
  const { wrapper, win, send, cleanup } = setup();
  win.matchMedia = () => ({ matches: true });
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop });
  wrapper.projects = new Surface();
  wrapper.projects.querySelectorAll = () => [marker];
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientX: -200 });
  send(wrapper, 'pointerup');
  assert.equal(wrapper.scrollTop, 600);
  assert.ok(!wrapper.attributes.has('data-drag-scrolling'));
  wrapper.projects = null;
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientY: -10000 });
  assert.equal(wrapper.scrollTop, 2400);
  cleanup();
});


test('vertical release ignores ordinary section snap targets', () => {
  const { wrapper, send, flush, cleanup } = setup();
  const section = new Surface();
  section.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop, height: 600 });
  wrapper.querySelectorAll = (selector) => selector.includes('data-snap-section') ? [section] : [];
  send(wrapper, 'pointerdown');
  send(wrapper, 'pointermove', { clientY: 100 });
  send(wrapper, 'pointerup');
  flush(0);
  flush(200);
  assert.equal(wrapper.scrollTop, 400);
  flush(1200);
  assert.equal(wrapper.scrollTop, 400);
  cleanup();
});

test('wheel settles to a project marker after input and scrolling stop', () => {
  const { wrapper, send, flush, idle, cleanup } = setup();
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop, height: 1 });
  wrapper.querySelectorAll = () => [marker];
  send(wrapper, 'wheel');
  wrapper.scrollTop = 440;
  send(wrapper, 'scroll');
  assert.equal(wrapper.scrollTop, 440);
  idle();
  flush(0);
  flush(200);
  assert.ok(wrapper.scrollTop > 440 && wrapper.scrollTop < 600);
  flush(1200);
  assert.equal(wrapper.scrollTop, 600);
  idle();
  flush(2000);
  assert.equal(wrapper.scrollTop, 600);
  cleanup();
});

test('navigation shares the smooth animation and new input cancels at the current position', () => {
  const { wrapper, scrollTo, send, flush, cleanup } = setup();
  scrollTo(1800);
  assert.equal(wrapper.scrollTop, 100);
  flush(0);
  flush(300);
  assert.ok(wrapper.scrollTop > 100 && wrapper.scrollTop < 1800);
  const interrupted = wrapper.scrollTop;
  send(wrapper, 'wheel');
  flush(1200);
  assert.equal(wrapper.scrollTop, interrupted);
  cleanup();
});

test('wheel scrolling stays free outside the horizontal projects area', () => {
  const { wrapper, send, idle, flush, cleanup } = setup();
  wrapper.scrollTop = 0;
  const first = new Surface();
  const next = new Surface();
  first.getBoundingClientRect = () => ({ top: -wrapper.scrollTop, height: 600 });
  next.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop, height: 600 });
  wrapper.querySelectorAll = (selector) => selector.includes('data-snap-section') ? [first, next] : [];
  send(wrapper, 'wheel', { deltaY: 150 });
  wrapper.scrollTop = 150;
  send(wrapper, 'scroll');
  idle();
  flush(0);
  flush(1200);
  assert.equal(wrapper.scrollTop, 150);
  cleanup();
});

test('touch holds off snapping until the gesture and momentum stop', () => {
  const { wrapper, send, idle, flush, cleanup } = setup();
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop, height: 1 });
  wrapper.querySelectorAll = () => [marker];
  send(wrapper, 'touchstart');
  wrapper.scrollTop = 440;
  send(wrapper, 'scroll');
  idle();
  flush(0);
  flush(1200);
  assert.equal(wrapper.scrollTop, 440);
  send(wrapper, 'touchend');
  idle();
  flush(0);
  flush(1200);
  assert.equal(wrapper.scrollTop, 600);
  cleanup();
});


test('approaching the horizontal entry snaps smoothly to the first card', () => {
  const { wrapper, send, idle, flush, cleanup } = setup();
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop, height: 1 });
  wrapper.querySelectorAll = () => [marker];
  send(wrapper, 'wheel', { deltaY: 150 });
  wrapper.scrollTop = 450;
  send(wrapper, 'scroll');
  idle();
  flush(0);
  flush(1200);
  assert.equal(wrapper.scrollTop, 600);
  cleanup();
});

test('scrolling past the last horizontal card does not pull back or snap to the next section', () => {
  const { wrapper, send, idle, flush, cleanup } = setup();
  const marker = new Surface();
  marker.getBoundingClientRect = () => ({ top: 600 - wrapper.scrollTop, height: 1 });
  const section = new Surface();
  section.getBoundingClientRect = () => ({ top: 1200 - wrapper.scrollTop, height: 600 });
  wrapper.querySelectorAll = (selector) => selector === '[data-projects-snap]' ? [marker] : [section, marker];
  send(wrapper, 'wheel', { deltaY: 150 });
  wrapper.scrollTop = 750;
  send(wrapper, 'scroll');
  idle();
  flush(0);
  flush(1200);
  assert.equal(wrapper.scrollTop, 750);
  cleanup();
});

function setProjectMarkers(wrapper, positions = [600, 1200, 1800]) {
  wrapper.querySelectorAll = () => positions.map(position => {
    const marker = new Surface();
    marker.getBoundingClientRect = () => ({ top: position - wrapper.scrollTop, height: 1 });
    return marker;
  });
}

test('a short wheel gesture animates exactly one complete chapter', () => {
  const { wrapper, send, flush, cleanup } = setup();
  setProjectMarkers(wrapper);
  wrapper.scrollTop = 600;
  const wheel = send(wrapper, 'wheel', { deltaY: 80 });
  assert.equal(wheel.defaultPrevented, true);
  assert.equal(wrapper.scrollTop, 600);
  flush(0);
  flush(300);
  assert.ok(wrapper.scrollTop > 600 && wrapper.scrollTop < 1200);
  send(wrapper, 'wheel', { deltaY: 50 });
  flush(1200);
  assert.equal(wrapper.scrollTop, 1200);
  cleanup();
});

test('trackpad momentum cannot skip chapters or cancel the current transition', () => {
  const { wrapper, send, flush, idle, cleanup } = setup();
  setProjectMarkers(wrapper);
  wrapper.scrollTop = 600;
  send(wrapper, 'wheel', { deltaY: 80 });
  flush(0);
  for (let time = 50; time <= 800; time += 50) {
    assert.equal(send(wrapper, 'wheel', { deltaY: 5 }).defaultPrevented, true);
    flush(time);
  }
  assert.equal(wrapper.scrollTop, 1200);
  idle();
  send(wrapper, 'wheel', { deltaY: 80 });
  flush(1000);
  flush(2200);
  assert.equal(wrapper.scrollTop, 1800);
  cleanup();
});

test('opposite wheel direction reverses smoothly to the previous chapter', () => {
  const { wrapper, send, flush, cleanup } = setup();
  setProjectMarkers(wrapper);
  wrapper.scrollTop = 600;
  send(wrapper, 'wheel', { deltaY: 80 });
  flush(0);
  flush(300);
  const position = wrapper.scrollTop;
  send(wrapper, 'wheel', { deltaY: -80 });
  assert.equal(wrapper.scrollTop, position);
  flush(400);
  flush(1600);
  assert.equal(wrapper.scrollTop, 600);
  cleanup();
});

test('wheel stays native outside projects, at exit boundaries, and during browser zoom', () => {
  const { wrapper, send, cleanup } = setup();
  setProjectMarkers(wrapper);
  wrapper.scrollTop = 0;
  assert.equal(send(wrapper, 'wheel', { deltaY: 80 }).defaultPrevented, false);
  wrapper.scrollTop = 600;
  assert.equal(send(wrapper, 'wheel', { deltaY: -80 }).defaultPrevented, false);
  wrapper.scrollTop = 1800;
  assert.equal(send(wrapper, 'wheel', { deltaY: 80 }).defaultPrevented, false);
  wrapper.scrollTop = 1200;
  assert.equal(send(wrapper, 'wheel', { deltaY: 80, ctrlKey: true }).defaultPrevented, false);
  cleanup();
});
