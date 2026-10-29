import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../hooks/useScrollEndClamp.ts', import.meta.url), 'utf8');

test('project sticky viewport leaves room for the header and updates on resize', () => {
  const effects = [];
  const frames = [];
  const sticky = { style: {} };
  let padding = 72;
  const wrapper = { clientHeight: 800, scrollHeight: 4000, scrollTop: 0 };
  let resize;
  const hookModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, {
    exports: hookModule.exports,
    require(name) {
      if (name === 'react') return { useEffect: callback => effects.push(callback) };
      if (name === '@/lib/scroll/utils') return { getScrollPaddingTop: () => padding };
      throw new Error(`Unexpected import: ${name}`);
    },
    document: { querySelector: () => sticky, getElementById: () => null },
    window: {
      addEventListener() {}, removeEventListener() {}, cancelAnimationFrame() {},
      requestAnimationFrame(callback) { frames.push(callback); return frames.length; },
    },
    ResizeObserver: class {
      constructor(callback) { resize = callback; }
      observe() {} disconnect() {}
    },
  });
  hookModule.exports.useScrollEndClamp({ current: wrapper }, { current: {} });
  const cleanup = effects[0]();
  frames.shift()();
  assert.equal(sticky.style.height, '728px');
  wrapper.clientHeight = 600;
  padding = 80;
  resize();
  frames.shift()();
  assert.equal(sticky.style.height, '520px');
  cleanup();
  assert.equal(sticky.style.height, '');
});

test('project section ends its sticky interval exactly at the final card, without header-sized dead space', () => {
  const layoutEffects = [];
  const hookModule = { exports: {} };
  let padding = 72;
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../hooks/useProjectsHorizontalScroll.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, {
    exports: hookModule.exports,
    require(name) {
      if (name === 'react') return {
        useState: () => [0, () => {}], useRef: () => ({ current: 0 }),
        useLayoutEffect: callback => layoutEffects.push(callback), useEffect() {},
      };
      if (name === '@/lib/scroll/utils') return { getScrollPaddingTop: () => padding };
      if (name === '@/lib/scroll/frame') return {};
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  for (const [height, header, count, expected] of [[800, 72, 4, '3128px'], [600, 80, 4, '2320px'], [800, 72, 1, '728px']]) {
    padding = header;
    const section = { style: {} };
    hookModule.exports.useProjectsHorizontalScroll({ current: section }, {}, {}, { current: { clientHeight: height } }, {}, count);
    layoutEffects.shift()();
    assert.equal(section.style.height, expected);
  }
});
