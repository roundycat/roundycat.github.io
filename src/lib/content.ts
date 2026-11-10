import { getCollection } from 'astro:content';
import type { NewsItem } from '../data/site';

// draft: true 인 항목은 개발 서버에서만 보입니다.
const visible = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

// 배포용 빌드에서 예시가 남아 있으면 멈춥니다. (npm run build 앞의 검사를 건너뛰고 astro build 를 바로 실행해도 걸리게 합니다.)
const allowExamples = process.env.ALLOW_EXAMPLES === '1';

export function assertNoExamples(labels: string[]) {
  if (!import.meta.env.PROD || allowExamples || labels.length === 0) return;
  throw new Error(
    `아직 예시 내용이 남아 있습니다: ${labels.join(', ')}\n` +
      '본인 내용으로 바꾸고 example: true 를 지우세요. 예시가 남은 채로 빌드하려면 ALLOW_EXAMPLES=1 을 붙이세요.',
  );
}

export async function getProjects() {
  const projects = await getCollection('projects', visible);
  assertNoExamples(projects.filter((p) => p.data.example).map((p) => `projects/${p.id}`));
  return projects.sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

// 최신 글이 앞에 옵니다. 같은 날 쓴 글은 파일 이름 순서로 두어 빌드할 때마다 순서가 바뀌지 않게 합니다.
export async function getNotes() {
  const notes = await getCollection('notes', visible);
  assertNoExamples(notes.filter((n) => n.data.example).map((n) => `notes/${n.id}`));
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

// 사이트 안에 실제로 있는 페이지 주소. 손으로 적은 내부 링크 검사와 sitemap 에 같이 씁니다.
// 글이 하나도 없는 동안에는 /notes/ 를 넣지 않습니다(그 페이지는 검색에서 빼 둡니다).
export async function sitePaths(): Promise<string[]> {
  const [projects, notes] = await Promise.all([getProjects(), getNotes()]);
  return [
    '/',
    '/projects/',
    ...projects.map((p) => `/projects/${p.id}/`),
    ...(notes.length > 0 ? ['/notes/', ...notes.map((n) => `/notes/${n.id}/`)] : []),
    '/en/',
  ];
}

// '2026.03 – 2026.06' 에서 끝나는 해를 꺼냅니다.
export function projectYear(period = ''): string {
  const years = period.match(/\d{4}/g);
  return years ? years[years.length - 1] : '';
}

function monthIndex(date: string): number {
  const m = /^(\d{4})\.(0[1-9]|1[0-2])$/.exec(date);
  if (!m) throw new Error(`소식(src/data/news.json) 날짜는 '2026.11' 처럼 연도.월 형식으로 써 주세요: '${date}'`);
  return Number(m[1]) * 12 + Number(m[2]) - 1;
}

// 최근 12개월 안의 소식만 최신순으로 최대 4개. 기준은 빌드하는 날(한국 시간)의 달입니다.
export function recentNews(items: NewsItem[], now: Date): NewsItem[] {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const nowMonth = kst.getUTCFullYear() * 12 + kst.getUTCMonth();
  return items
    .filter((item) => nowMonth - monthIndex(item.date) < 12)
    .sort((a, b) => monthIndex(b.date) - monthIndex(a.date))
    .slice(0, 4);
}
