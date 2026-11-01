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
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getNotes() {
  const notes = await getCollection('notes', visible);
  assertNoExamples(notes.filter((n) => n.data.example).map((n) => `notes/${n.id}`));
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// '2026.03 – 2026.06' 에서 끝나는 해를 꺼냅니다.
export function projectYear(period = ''): string {
  const years = period.match(/\d{4}/g);
  return years ? years[years.length - 1] : '';
}

function monthIndex(date: string): number {
  const m = /^(\d{4})\.(\d{2})$/.exec(date);
  if (!m) throw new Error(`site.ts 소식 날짜는 'YYYY.MM' 형식으로 써 주세요: '${date}'`);
  return Number(m[1]) * 12 + Number(m[2]) - 1;
}

// 최근 12개월 안의 소식만 최신순으로 최대 4개. 2개보다 적으면 섹션을 숨기도록 빈 배열을 돌려줍니다.
export function recentNews(items: NewsItem[], now: Date): NewsItem[] {
  const nowMonth = now.getUTCFullYear() * 12 + now.getUTCMonth();
  const recent = items
    .filter((item) => nowMonth - monthIndex(item.date) < 12)
    .sort((a, b) => monthIndex(b.date) - monthIndex(a.date))
    .slice(0, 4);
  return recent.length >= 2 ? recent : [];
}
