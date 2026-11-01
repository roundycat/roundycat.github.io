// astro.config.mjs 에 base 를 설정해도 내부 링크가 깨지지 않게 앞에 붙여 줍니다.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return base + path;
}
