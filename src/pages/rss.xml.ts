// 글 목록을 RSS 로 내보냅니다. (/rss.xml)
// 본문 전체가 아니라 제목, 한 줄 설명, 링크만 넣습니다. 수식과 그림은 피드 리더에서 깨지기 쉬워서입니다.
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { getNotes } from '../lib/content';
import { url } from '../lib/url';

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(context: APIContext) {
  if (!context.site) throw new Error('astro.config.mjs 에 site 주소가 있어야 RSS 를 만들 수 있습니다.');
  const absolute = (path: string) => new URL(url(path), context.site).href;
  const notes = await getNotes();

  const items = notes.map((note) => {
    const link = absolute(`/notes/${note.id}/`);
    return [
      '    <item>',
      `      <title>${escape(note.data.title)}</title>`,
      `      <link>${escape(link)}</link>`,
      `      <guid isPermaLink="true">${escape(link)}</guid>`,
      `      <pubDate>${note.data.date.toUTCString()}</pubDate>`,
      ...(note.data.description ? [`      <description>${escape(note.data.description)}</description>`] : []),
      '    </item>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escape(`${site.name} 글`)}</title>`,
    `    <link>${escape(absolute('/notes/'))}</link>`,
    `    <description>${escape(`${site.name} (${site.nameEn}) 홈페이지에 올린 글`)}</description>`,
    '    <language>ko</language>',
    `    <atom:link href="${escape(absolute('/rss.xml'))}" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
