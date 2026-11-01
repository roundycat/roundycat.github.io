// 처음에 넣어 둔 예시 내용이 남아 있으면 빌드를 멈춥니다.
// 없는 경력이나 지어낸 숫자가 실수로 배포되지 않게 하려는 장치입니다.
// 예시가 남은 채로 빌드해 보고 싶다면: ALLOW_EXAMPLES=1 npm run build

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.env.ALLOW_EXAMPLES === '1') process.exit(0);

const root = fileURLToPath(new URL('..', import.meta.url));
const found = [];
const EXAMPLE = /^\s*['"]?example['"]?\s*:\s*true\b/im;
const DRAFT = /^\s*['"]?draft['"]?\s*:\s*true\b/im;

const read = (path) => readFileSync(path, 'utf8').replace(/^﻿/, '');

function walk(dir, onFile) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, onFile);
    else onFile(path);
  }
}

// 글과 프로젝트: 머리말(frontmatter)에 example: true 가 있는 파일. 공개하지 않는 draft 는 건너뜁니다.
walk(join(root, 'src/content'), (path) => {
  if (!/\.mdx?$/.test(path)) return;
  const frontmatter = read(path).match(/^\s*---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatter && EXAMPLE.test(frontmatter[1]) && !DRAFT.test(frontmatter[1])) {
    found.push(relative(root, path));
  }
});

// src/data 안의 파일: example: true 가 적힌 줄 (주석은 제외)
walk(join(root, 'src/data'), (path) => {
  read(path)
    .split('\n')
    .forEach((line, i) => {
      if (/^\s*\/\//.test(line)) return;
      if (/['"]?\bexample['"]?\s*:\s*true\b/i.test(line)) found.push(`${relative(root, path)} ${i + 1}번째 줄`);
    });
});

// 배포 주소가 아직 예시 주소인 경우
if (/const site = ['"]https?:\/\/example\.github\.io/.test(read(join(root, 'astro.config.mjs')))) {
  found.push('astro.config.mjs 의 site (아직 example.github.io)');
}

if (found.length > 0) {
  console.error('\n아직 예시 내용이 남아 있어서 빌드를 멈췄습니다.');
  console.error('아래 항목을 본인 내용으로 바꾸고 `example: true` 를 지우세요. 쓰지 않을 예시는 통째로 지워도 됩니다.\n');
  for (const item of found) console.error(`  - ${item}`);
  console.error('\n예시가 남은 채로 빌드해 보려면: ALLOW_EXAMPLES=1 npm run build\n');
  process.exit(1);
}
