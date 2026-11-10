// src/data 안의 JSON 파일과 글·프로젝트 머리말이 지켜야 하는 형식입니다.
// 관리 화면(/admin/)이나 GitHub 에서 고친 내용이 이 형식에 맞지 않으면 빌드가 멈추고,
// 사이트는 직전 버전 그대로 남습니다. 어느 파일의 어느 칸인지는 오류 메시지에 나옵니다.

import { z } from 'astro/zod';

// 비워 둔 칸은 '' 나 null 로 저장될 수 있습니다. 공백만 있는 칸까지 모두 '없음'으로 읽습니다.
export const blank = (value: unknown) =>
  value === null || (typeof value === 'string' && value.trim() === '') ? undefined : value;

// 꼭 채워야 하는 글자 칸
export const text = z.string().trim().min(1, '비워 둘 수 없습니다');
// 비워도 되는 글자 칸 (없으면 undefined)
export const optionalText = z.preprocess(blank, z.string().trim().optional());
// 비워도 되는 글자 칸 (없으면 빈 문자열)
const emptyOk = z.preprocess((value) => value ?? '', z.string().trim());
// 줄을 바꿔 적어도 한 문단으로 읽습니다.
const paragraph = text.transform((value) => value.replace(/\s+/g, ' '));

// 비어 있으면 빈 목록으로 읽습니다.
export const listOf = <T extends z.ZodType>(item: T) => z.preprocess((value) => value ?? [], z.array(item));

// 목록 파일은 { "items": [ ... ] } 모양입니다. 맨 바깥이 바로 목록이어도 읽습니다.
// 맨 바깥에 items 말고 다른 이름이 있으면(오타 등) 목록이 통째로 사라지지 않도록 빌드를 멈춥니다.
const itemsFile = <T extends z.ZodType>(item: T) =>
  z
    .preprocess(
      (value) => (Array.isArray(value) ? { items: value } : value),
      z.strictObject(
        { items: listOf(item) },
        {
          error: (issue) =>
            issue.code === 'unrecognized_keys'
              ? `맨 바깥에는 "items" 만 둘 수 있습니다 (잘못된 이름: ${issue.keys.join(', ')})`
              : undefined,
        },
      ),
    )
    .transform((file) => file.items);

// 주소 칸. 'github.com/...' 처럼 앞을 빼고 적으면 사이트 안의 없는 페이지로 가는 링크가 되므로,
// 'https://' 로 시작하는 주소나 '/' 로 시작하는 사이트 안 주소만 받습니다.
const HREF_HINT = "'https://' 로 시작하는 주소나 '/' 로 시작하는 사이트 안 주소를 적어 주세요";
const URL_HINT = "'https://' 로 시작하는 주소를 적어 주세요";
export const href = text.regex(/^(https?:\/\/\S+|\/(?!\/)\S*)$/, HREF_HINT);
const optionalHref = z.preprocess(blank, href.optional());
// 비워도 되는 주소 칸 (없으면 빈 문자열)
const emptyOrHref = z.preprocess((value) => value ?? '', z.string().trim().regex(/^(https?:\/\/\S+|\/(?!\/)\S*)?$/, HREF_HINT));
const emptyOrUrl = z.preprocess((value) => value ?? '', z.string().trim().regex(/^(https?:\/\/\S+)?$/, URL_HINT));
const emptyOrEmail = z.preprocess(
  (value) => value ?? '',
  z.string().trim().regex(/^(\S+@\S+\.\S+)?$/, '이메일 주소를 확인해 주세요'),
);

export const link = z.object({ label: text, href });

export const profileSchema = z.object({
  intro: paragraph,
  about: paragraph,
  bioEn: paragraph,
  // 사진과 CV 는 사이트 안의 파일 주소입니다. 예: '/uploads/cv.pdf'
  photo: emptyOrHref,
  contact: z.preprocess(
    (value) => value ?? {},
    z.object({
      email: emptyOrEmail,
      github: emptyOrUrl,
      linkedin: emptyOrUrl,
      huggingface: emptyOrUrl,
      scholar: emptyOrUrl,
      cv: emptyOrHref,
      cvUpdated: emptyOk,
    }),
  ),
});

const publication = z.object({
  authors: z.array(text).min(1, '저자를 한 명 이상 적어 주세요'),
  title: text,
  venue: text,
  type: optionalText,
  links: listOf(link),
});

const datedItem = z.object({
  // 화면에 그대로 보이는 글자입니다. 예: '2026.06', '2026.03 – 08', '2025.09 –'
  date: text,
  text,
  // 둘째 줄에 작게 보이는 설명 (주최 기관, 과정 이름 등)
  note: optionalText,
  href: optionalHref,
});

const newsItem = z.object({
  date: z.string().regex(/^\d{4}\.(0[1-9]|1[0-2])$/, "'2026.11' 처럼 연도.월 형식으로 적어 주세요"),
  text,
  href: optionalHref,
  example: z.boolean().optional(),
});

const readingItem = z.object({
  title: text,
  authors: text,
  venue: text,
  year: z.coerce.number().int().min(1900),
  href,
  note: optionalText,
  example: z.boolean().optional(),
});

export const publicationsSchema = itemsFile(publication);
export const datedListSchema = itemsFile(datedItem);
export const newsSchema = itemsFile(newsItem);
export const readingSchema = itemsFile(readingItem);

export type Publication = z.output<typeof publication>;
export type DatedItem = z.output<typeof datedItem>;
export type NewsItem = z.output<typeof newsItem>;
export type Reading = z.output<typeof readingItem>;
