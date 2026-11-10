import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { blank, link, listOf, optionalText, text } from './data/schema';

// 관리 화면(/admin/)의 입력 칸은 public/admin/config.yml 에 있습니다. 여기 항목을 바꾸면 그 파일도 같이 바꿉니다.
// 비워 둔 칸이 '' 나 null 로 저장돼도 '없음'으로 읽도록 optionalText 를 씁니다.

// 켜고 끄는 칸. 적지 않았으면 꺼진 것으로 봅니다.
const flag = z.preprocess((value) => value ?? false, z.boolean());

// 글 날짜는 한국 시간 기준의 '날짜'만 남깁니다. 시간대(+09:00, Z)가 붙은 시각은 한국 날짜로 바꾸고,
// 시간대 없이 따옴표로 적은 '2026-11-10 21:30' 은 적힌 날짜 그대로 읽습니다.
// 따옴표 없이 시간까지 적을 때는 +09:00 을 붙입니다. 비어 있거나 날짜가 아니면 빌드가 멈춥니다.
const KST = 9 * 60 * 60 * 1000;
const DATE_HINT = "날짜는 '2026-11-10' 처럼 적어 주세요";
const day = z
  .preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const s = value.trim();
      return /^\d{4}-\d{2}-\d{2}/.test(s) && !/(Z|[+-]\d{2}:?\d{2})$/i.test(s) ? s.slice(0, 10) : s;
    },
    z.union([z.date(), z.string().min(1, DATE_HINT)], { error: DATE_HINT }).pipe(z.coerce.date({ error: DATE_HINT })),
  )
  .transform((date) => new Date(new Date(date.getTime() + KST).toISOString().slice(0, 10)));

// 배포용 빌드에서는 초안을 읽지 않은 것으로 합니다. 초안에 넣은 그림이 사이트에 올라가거나,
// 초안의 그림 이름이 틀려서 배포가 멈추는 일을 막습니다. 개발 서버에서는 초안도 그대로 보입니다.
const publishedOnly = (loader: Loader): Loader => ({
  ...loader,
  async load(context) {
    await loader.load(context);
    if (!import.meta.env.PROD) return;
    for (const [id, entry] of context.store.entries()) {
      if (entry.data.draft === true) context.store.delete(id);
    }
  },
});

// 프로젝트: src/content/projects 안의 .md 파일 하나가 프로젝트 하나입니다.
const projects = defineCollection({
  loader: publishedOnly(glob({ pattern: '**/*.md', base: './src/content/projects' })),
  schema: z.object({
    title: text,
    // 목록에 보이는 한두 문장. 무엇을 했고 결과가 어땠는지 숫자 하나를 넣으면 좋습니다.
    summary: text,
    // 예: '2026.03 – 2026.06'. 시작 시기를 모르면 비워 둡니다(목록에 연도가 나오지 않습니다).
    period: optionalText,
    // 어떤 맥락이었는지. 예: '개인 프로젝트', '자연어처리 수업 (2026년 1학기)', '○○ 연구실'
    context: text,
    // 팀이었다면 인원과 맡은 부분. 혼자 했다면 비워 둡니다.
    team: optionalText,
    // 사용한 도구. 상세 페이지에만 보입니다.
    stack: listOf(text),
    // 코드, 보고서, 데모 링크. 실제로 열리는 것만 넣으세요.
    links: listOf(link),
    // English 페이지에 보일 제목과 한 줄 설명. 없으면 English 페이지에서 빠집니다.
    titleEn: optionalText,
    summaryEn: optionalText,
    // 숫자가 작을수록 위에 보입니다.
    order: z.preprocess(blank, z.coerce.number().default(100)),
    draft: flag,
    example: flag,
  }),
});

// 글: src/content/notes 안의 .md 파일 하나가 글 하나입니다.
const notes = defineCollection({
  loader: publishedOnly(glob({ pattern: '**/*.md', base: './src/content/notes' })),
  schema: z.object({
    title: text,
    // 'YYYY-MM-DD' 처럼 날짜만 씁니다.
    date: day,
    // 글 목록, 검색 결과, 링크 미리보기, RSS 에 보이는 한 문장
    description: optionalText,
    draft: flag,
    example: flag,
  }),
});

export const collections = { projects, notes };
