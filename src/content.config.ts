import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 프로젝트: src/content/projects 안의 .md 파일 하나가 프로젝트 하나입니다.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // 목록에 보이는 한두 문장. 무엇을 했고 결과가 어땠는지 숫자 하나를 넣으면 좋습니다.
    summary: z.string(),
    // 예: '2026.03 – 2026.06'. 시작 시기를 모르면 비워 둡니다(목록에 연도가 나오지 않습니다).
    period: z.string().optional(),
    // 어떤 맥락이었는지. 예: '개인 프로젝트', '자연어처리 수업 (2026년 1학기)', '○○ 연구실'
    context: z.string(),
    // 팀이었다면 인원과 맡은 부분. 혼자 했다면 비워 둡니다.
    team: z.string().optional(),
    // 사용한 도구. 상세 페이지에만 보입니다.
    stack: z.array(z.string()).default([]),
    // 코드, 보고서, 데모 링크. 실제로 열리는 것만 넣으세요.
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    // English 페이지에 보일 제목과 한 줄 설명. 없으면 English 페이지에서 빠집니다.
    titleEn: z.string().optional(),
    summaryEn: z.string().optional(),
    // 숫자가 작을수록 위에 보입니다.
    order: z.number().default(100),
    draft: z.boolean().default(false),
    example: z.boolean().default(false),
  }),
});

// 글: src/content/notes 안의 .md 파일 하나가 글 하나입니다.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    // 'YYYY-MM-DD' 처럼 날짜만 씁니다. 시간을 붙이면 하루 어긋나 보일 수 있습니다.
    date: z.coerce.date(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    example: z.boolean().default(false),
  }),
});

export const collections = { projects, notes };
