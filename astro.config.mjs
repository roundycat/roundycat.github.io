// @ts-check
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import { glueMath, glueParticles, imageSizes, katexMath, prefixBase, wrapTables } from './markdown-plugins.mjs';

// 배포 주소입니다. 아직 example.github.io 로 남아 있으면 npm run build 가 멈춥니다.
// GitHub Pages 사용자 사이트라면 'https://<아이디>.github.io' 처럼 씁니다.
const site = 'https://roundycat.github.io';

// 저장소 이름이 <아이디>.github.io 가 아니라면 '/<저장소 이름>' 을 적습니다. 아니면 그대로 둡니다.
const base = undefined;

export default defineConfig({
  site,
  base,
  image: {
    // 글에 넣은 그림을 여러 크기로 만들어 두고, 브라우저가 본문 폭에 맞는 것을 골라 받게 합니다.
    // (어느 크기를 고를지는 markdown-plugins.mjs 의 imageSizes 가 알려 줍니다.)
    layout: 'constrained',
    // 화면 폭에 따라 골라 쓸 크기들입니다. 원본보다 큰 크기는 만들지 않습니다.
    breakpoints: [640, 960, 1280, 1920],
  },
  markdown: {
    processor: satteri({
      features: {
        math: true,
        // 각주 구역의 제목과 돌아가기 링크 이름을 한국어로 씁니다.
        gfm: { footnotes: { label: '각주', backLabel: '본문 {reference}번 각주 자리로 돌아가기' } },
        // 한국어에서 '…' 를 ‘…’ 로 바꾸다가 방향이 뒤집히는 일이 있어서 따옴표 자동 변환만 끕니다.
        smartPunctuation: { quotes: false },
      },
      mdastPlugins: [katexMath],
      hastPlugins: [wrapTables, glueParticles, glueMath, imageSizes, prefixBase(base)],
    }),
    shikiConfig: {
      // 코드 색은 사이트 색(src/styles/prose.css 의 --astro-code-*)을 따릅니다.
      theme: 'css-variables',
    },
  },
});
