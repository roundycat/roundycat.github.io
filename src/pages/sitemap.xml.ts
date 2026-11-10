// 검색 엔진에 알려 줄 페이지 목록입니다. (/sitemap.xml)
// 목록은 src/lib/content.ts 의 sitePaths 에서 옵니다. 새 종류의 페이지를 만들면 거기에 더합니다.
import type { APIContext } from 'astro';
import { sitePaths } from '../lib/content';
import { url } from '../lib/url';

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(context: APIContext) {
  if (!context.site) throw new Error('astro.config.mjs 에 site 주소가 있어야 sitemap 을 만들 수 있습니다.');
  const paths = await sitePaths();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${escape(new URL(url(path), context.site).href)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
