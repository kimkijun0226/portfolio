import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

test('Lenis updates subscribers in the current frame and native scroll does not duplicate work', () => {
  const frames = new Map();
  let id = 0;
  const root = new EventTarget();
  Object.assign(root, { scrollTop: 0, setAttribute() {}, removeAttribute() {} });
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/scroll/frame.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports: module.exports,
    window: {
      requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
      cancelAnimationFrame: key => frames.delete(key),
      setTimeout: () => ++id, clearTimeout() {},
    },
  });
  let updates = 0;
  const unsubscribe = module.exports.subscribeScrollFrame(root, () => updates++);
  root.scrollTop = 100;
  root.dispatchEvent(new Event('scroll'));
  assert.equal(frames.size, 1);
  module.exports.flushScrollFrame(root);
  assert.equal(updates, 1);
  assert.equal(frames.size, 0);
  root.dispatchEvent(new Event('scroll'));
  module.exports.flushScrollFrame(root);
  assert.equal(updates, 1);
  assert.equal(frames.size, 0);
  root.scrollTop = 120;
  module.exports.flushScrollFrame(root);
  assert.equal(updates, 2);
  unsubscribe();
});
