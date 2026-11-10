// 검색 엔진에 sitemap 위치를 알려 줍니다. (/robots.txt)
import type { APIContext } from 'astro';
import { url } from '../lib/url';

export function GET(context: APIContext) {
  if (!context.site) throw new Error('astro.config.mjs 에 site 주소가 있어야 robots.txt 를 만들 수 있습니다.');
  const sitemap = new URL(url('/sitemap.xml'), context.site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
