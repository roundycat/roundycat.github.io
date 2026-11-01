import { url } from './url';

// site.ts 의 intro 문자열에 쓰는 작은 표기법을 HTML로 바꿉니다.
//   [글자]{PS}, [글자]{OG}  ->  형광펜 주석 (바로 뒤 조사까지 한 덩어리로 묶어 줄이 바뀌어도 떨어지지 않게 합니다)
//   [글자](/주소/)          ->  링크
const TOKEN = /\[([^\]]+)\]\{(PS|OG)\}([가-힣]*)|\[([^\]]+)\]\(([^)\s]+)\)/g;

const LABELS = {
  PS: '인명',
  OG: '기관',
} as const;

function escape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderInline(source: string): string {
  let html = '';
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    const [whole, entity, tag, particle, linkText, href] = match;
    html += escape(source.slice(last, match.index));
    if (entity) {
      const label = tag as keyof typeof LABELS;
      html +=
        `<span class="ent-run"><span class="ent ent--${label.toLowerCase()}" data-label="${label}" ` +
        `title="${LABELS[label]} (KLUE 개체명 태그 ${label})">${escape(entity)}</span>${escape(particle)}</span>`;
    } else {
      html += `<a href="${escape(url(href))}">${escape(linkText)}</a>`;
    }
    last = match.index + whole.length;
  }
  return html + escape(source.slice(last));
}

// 검색 결과나 메신저 미리보기에 쓸 순수한 문장
export function plainText(source: string): string {
  return source.replace(TOKEN, (_whole, entity, _tag, particle, linkText) =>
    entity ? entity + particle : linkText,
  );
}

// intro 안의 사이트 내부 링크 ('/...') 목록. 없는 페이지를 가리키는지 확인할 때 씁니다.
export function internalLinks(source: string): string[] {
  return [...source.matchAll(TOKEN)].map((m) => m[5]).filter((href) => href?.startsWith('/'));
}
