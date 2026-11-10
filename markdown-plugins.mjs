// 마크다운 처리기(Sätteri)에 붙이는 작은 플러그인들입니다.
import katex from 'katex';

const renderMath = (tex, displayMode) =>
  katex.renderToString(tex, {
    displayMode,
    // 따로 한 줄에 쓰는 수식도 본문처럼 왼쪽에 맞춥니다.
    fleqn: true,
    throwOnError: false,
    output: 'htmlAndMathml',
  });

// $...$ 와 $$...$$ 수식을 빌드할 때 KaTeX HTML로 바꿉니다. 방문자 브라우저에서는 자바스크립트가 필요 없습니다.
export const katexMath = {
  name: 'katex-math',
  math(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: renderMath(node.value, true) });
  },
  inlineMath(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: renderMath(node.value, false) });
  },
};

// 표를 가로 스크롤 상자로 감쌉니다. 휴대폰에서 표가 화면 밖으로 넘치지 않게 합니다.
export const wrapTables = {
  name: 'wrap-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'], tabIndex: 0, role: 'region', ariaLabel: '표' },
        children: [],
      });
    },
  },
};

// 닫는 따옴표나 괄호 바로 뒤의 조사가 다음 줄로 떨어지지 않게 붙여 둡니다.
// (‘논문’은 → ‘논문’ / 은 처럼 끊기는 것을 막습니다.)
// 'KLUE-NLI', 'GPT-3.5' 같은 이름도 하이픈에서 끊기지 않게 합니다. 코드 안은 건드리지 않습니다.
const WORD_JOINER = '⁠';
const GLUE_PARTICLE = /(['"‘’“”)\]])(?=[가-힣])/g;
const GLUE_HYPHEN = /([A-Za-z0-9])-(?=[A-Za-z0-9])/g;

export const glueParticles = {
  name: 'glue-particles',
  text(node, ctx) {
    const value = node.value.replace(GLUE_PARTICLE, `$1${WORD_JOINER}`).replace(GLUE_HYPHEN, `$1-${WORD_JOINER}`);
    if (value === node.value) return;
    for (let p = ctx.parent(node); p; p = ctx.parent(p)) {
      if (p.type === 'element' && (p.tagName === 'code' || p.tagName === 'pre')) return;
    }
    ctx.replaceNode(node, { type: 'text', value });
  },
};

// 문장 안 수식과 바로 뒤 조사를 한 덩어리로 묶습니다. ($k$보다 → k / 보다 처럼 끊기지 않게)
export const glueMath = {
  name: 'glue-math',
  raw(node, ctx) {
    if (!node.value.startsWith('<span class="katex">')) return;
    const parent = ctx.parent(node);
    const index = ctx.indexOf(node);
    const next = parent && index !== undefined ? parent.children[index + 1] : undefined;
    if (!next || next.type !== 'text') return;
    const particle = /^[가-힣]+/.exec(next.value);
    if (!particle) return;
    ctx.replaceNode(next, { type: 'text', value: next.value.slice(particle[0].length) });
    ctx.replaceNode(node, { type: 'raw', value: `<span class="math-run">${node.value}${particle[0]}</span>` });
  },
};


// 글 안의 그림은 본문 문단 폭(36em = 38.25rem)보다 크게 보이지 않습니다. 브라우저가 화면 폭이 아니라
// 그 폭에 맞는 크기의 파일을 고르게 합니다. 폭을 바꾸면 src/styles/prose.css 의 .prose > p 와 같이 바꿉니다.
// 크기를 여러 개 만들지 않는 그림(다른 사이트의 그림, public 폴더의 그림)은 그대로 둡니다.
const IMAGE_SIZES = '(min-width: 43.25rem) 38.25rem, 100vw';

export const imageSizes = {
  name: 'image-sizes',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      const src = node.properties?.src;
      if (typeof src !== 'string' || /^([a-z][a-z0-9+.-]*:|\/)/i.test(src)) return;
      ctx.setProperty(node, 'sizes', IMAGE_SIZES);
    },
  },
};

// astro.config.mjs 에 base 를 설정했을 때, 글 안의 '/...' 링크와 이미지 주소 앞에도 base 를 붙입니다.
export function prefixBase(base) {
  const prefix = (base ?? '').replace(/\/$/, '');
  return {
    name: 'prefix-base',
    element: {
      filter: ['a', 'img'],
      visit(node, ctx) {
        if (!prefix) return;
        const key = node.tagName === 'a' ? 'href' : 'src';
        const value = node.properties?.[key];
        if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return;
        if (value === prefix || value.startsWith(`${prefix}/`)) return;
        ctx.setProperty(node, key, prefix + value);
      },
    },
  };
}
