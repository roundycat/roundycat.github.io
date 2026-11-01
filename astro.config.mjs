// @ts-check
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import { glueMath, glueParticles, katexMath, prefixBase, wrapTables } from './markdown-plugins.mjs';

// 배포 주소입니다. 아직 example.github.io 로 남아 있으면 npm run build 가 멈춥니다.
// GitHub Pages 사용자 사이트라면 'https://<아이디>.github.io' 처럼 씁니다.
const site = 'https://roundycat.github.io';

// 저장소 이름이 <아이디>.github.io 가 아니라면 '/<저장소 이름>' 을 적습니다. 아니면 그대로 둡니다.
const base = undefined;

export default defineConfig({
  site,
  base,
  markdown: {
    processor: satteri({
      features: {
        math: true,
        // 한국어에서 '…' 를 ‘…’ 로 바꾸다가 방향이 뒤집히는 일이 있어서 따옴표 자동 변환만 끕니다.
        smartPunctuation: { quotes: false },
      },
      mdastPlugins: [katexMath],
      hastPlugins: [wrapTables, glueParticles, glueMath, prefixBase(base)],
    }),
    shikiConfig: {
      // 코드 색은 사이트 색(src/styles/prose.css 의 --astro-code-*)을 따릅니다.
      theme: 'css-variables',
    },
  },
});
