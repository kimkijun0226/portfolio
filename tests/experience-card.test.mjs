import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import ts from 'typescript';

const cardModule = { exports: {} };
const source = readFileSync(new URL('../components/experience/ExperienceCard.tsx', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText, { exports: cardModule.exports, require: createRequire(import.meta.url) });

const project = {
  title: '대량 문자 발송 플랫폼 앱', category: '앱 개발', color: '#60a5fa',
  role: 'Frontend Developer', summary: '프로젝트 소개', highlights: [], techStack: ['React Native'],
};

test('React Native project identifies its framework and both mobile platforms beside its title', () => {
  const markup = renderToStaticMarkup(createElement(cardModule.exports.ExperienceCard, { project }));
  const header = markup.match(/<header[^>]*>([\s\S]*?)<\/header>/)[1];
  assert.match(header, /React Native/);
  assert.match(header, /iOS · Android/);
  assert.match(header, /· React Native · iOS · Android/);
  assert.doesNotMatch(header, /<svg/);
});

test('web projects retain their existing title without a mobile badge', () => {
  const markup = renderToStaticMarkup(createElement(cardModule.exports.ExperienceCard, {
    project: { ...project, techStack: ['React', 'TypeScript'] },
  }));
  assert.doesNotMatch(markup, /React Native|iOS · Android/);
});
