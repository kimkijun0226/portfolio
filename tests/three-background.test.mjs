import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function compile(path) {
  return ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}

test('particles and ribbon keep rendering during scroll and clean up their resources', async () => {
  const frames = new Map();
  const effects = [];
  const renderers = [];
  let id = 0;
  let refIndex = 0;
  let scrolling = false;
  const wrap = { style: {} };
  const ribbon = {
    style: {}, offsetWidth: 1280, offsetHeight: 720,
    appendChild(node) { node.parentNode = this; },
    removeChild(node) { node.parentNode = null; },
  };
  const refs = [wrap, {}, ribbon];
  class Object3D {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.position = {};
      this.rotation = { y: 0 };
      this.scale = { set() {} };
      this.color = { set() {} };
      this.uniforms = geometry?.uniforms;
    }
    add() {}
    lookAt() {}
    updateProjectionMatrix() {}
    setAttribute() {}
    set() {}
    dispose() { this.disposed = true; }
  }
  class Renderer extends Object3D {
    constructor() { super(); this.domElement = {}; this.renders = 0; renderers.push(this); }
    setPixelRatio(value) { this.pixelRatio = value; }
    setSize() {}
    render() { this.renders++; }
  }
  const three = Object.fromEntries(['Scene', 'Fog', 'PerspectiveCamera', 'BufferGeometry',
    'Float32BufferAttribute', 'PointsMaterial', 'Points', 'ShaderMaterial', 'Color', 'Mesh',
    'PlaneGeometry'].map(name => [name, Object3D]));
  three.WebGLRenderer = Renderer;
  const win = {
    innerWidth: 1280, innerHeight: 720, devicePixelRatio: 2,
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame(callback) { frames.set(++id, callback); return id; },
    cancelAnimationFrame(key) { frames.delete(key); },
    addEventListener() {}, removeEventListener() {},
  };
  const clockModule = { exports: {} };
  vm.runInNewContext(compile('../lib/animation/frame-clock.ts'), { exports: clockModule.exports });
  const backgroundModule = { exports: {} };
  vm.runInNewContext(compile('../components/effects/ThreeBackground.tsx'), {
    exports: backgroundModule.exports,
    require(name) {
      if (name === 'react') return {
        useRef(value) { return { current: refIndex < 3 ? refs[refIndex++] : value }; },
        useEffect(callback) { effects.push(callback); },
      };
      if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null };
      if (name === 'three') return three;
      if (name === '@/lib/animation/frame-clock') return clockModule.exports;
      if (name === '@/lib/scroll/frame') return { getScrollFrameIsScrolling: () => scrolling };
      throw new Error(`Unexpected import: ${name}`);
    },
    window: win, document: { hidden: false, documentElement: { dataset: {} }, addEventListener() {}, removeEventListener() {} },
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: win.requestAnimationFrame,
  });
  backgroundModule.exports.ThreeBackground({});
  const cleanups = effects.map(effect => effect());
  await new Promise(setImmediate);
  const tick = time => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(time));
  };
  tick(0);
  const beforeScroll = renderers.map(renderer => renderer.renders);
  scrolling = true;
  for (let frame = 1; frame <= 60; frame++) tick(frame * 1000 / 60);
  assert.equal(renderers.length, 2);
  renderers.forEach((renderer, index) => {
    assert.ok(renderer.renders - beforeScroll[index] >= 59);
    assert.equal(renderer.pixelRatio, 1);
  });
  cleanups.forEach(cleanup => cleanup?.());
  assert.equal(frames.size, 0);
  assert.ok(renderers.every(renderer => renderer.disposed));
});
