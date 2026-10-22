import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/animation/frame-clock.ts', import.meta.url), 'utf8');
const { createFrameClock } = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText).toString('base64')}`);

test('background renders about 60 times a second on a 144 Hz display', () => {
  const sample = createFrameClock();
  const deltas = [];
  for (let frame = 0; frame < 144; frame++) {
    const delta = sample(frame * 1000 / 144);
    if (delta !== null) deltas.push(delta);
  }
  assert.ok(deltas.length >= 59 && deltas.length <= 61);
  assert.ok(Math.abs(deltas.reduce((sum, delta) => sum + delta, 0) - 1) < 0.03);
});

test('60 Hz displays retain smooth updates and elapsed time controls speed', () => {
  const sample = createFrameClock();
  for (let frame = 0; frame < 60; frame++) {
    const delta = sample(frame * 1000 / 60);
    assert.ok(delta !== null);
    assert.ok(Math.abs(delta - 1 / 60) < 0.001);
  }
});

test('hidden tabs pause and resume without a large animation jump', () => {
  const sample = createFrameClock();
  sample(0);
  assert.equal(sample(5000, true), null);
  assert.equal(sample(10000), 1 / 60);
  assert.ok(sample(12000) <= 0.05);
});
