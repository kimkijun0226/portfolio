import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/scroll/utils.ts', import.meta.url), 'utf8');
const { getSectionScrollTarget } = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText).toString('base64')}`);

test('navigation aligns the first project with the horizontal timeline entry', () => {
  globalThis.getComputedStyle = () => ({ scrollPaddingTop: '72px' });
  const content = {};
  const wrapper = { clientHeight: 720 };
  const section = { parentElement: content, offsetTop: 2000, offsetHeight: 2880 };
  assert.equal(getSectionScrollTarget('projects', section, content, wrapper), 1928);
  assert.equal(getSectionScrollTarget('about', { ...section, offsetTop: 0 }, content, wrapper), 0);
  assert.equal(getSectionScrollTarget('contact', section, content, wrapper), 4160);
});
