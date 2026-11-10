// 사이트에 들어가는 개인 정보는 이 폴더의 JSON 파일에 있습니다.
// 관리 화면(https://roundycat.github.io/admin/)의 '첫 화면' 메뉴에서 고치면 이 파일들이 바뀝니다.
//
//   profile.json       첫 문단, 둘째 문단, 영어 소개, 사진, 연락처
//   publications.json  논문 및 발표
//   awards.json        수상
//   activities.json    활동
//   news.json          소식
//   reading.json       읽고 있는 논문
//
// 형식은 schema.ts 에 있고, 형식에 맞지 않으면 빌드가 멈춥니다.

import { z } from 'astro/zod';
import activitiesJson from './activities.json';
import awardsJson from './awards.json';
import newsJson from './news.json';
import profileJson from './profile.json';
import publicationsJson from './publications.json';
import readingJson from './reading.json';
import { datedListSchema, newsSchema, profileSchema, publicationsSchema, readingSchema } from './schema';

function load<S extends z.ZodType>(file: string, schema: S, raw: unknown): z.output<S> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(`src/data/${file} 내용이 형식에 맞지 않습니다.\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const site = {
  // 이름은 페이지 제목과 논문 저자 굵게 표시에 쓰여서 코드에 둡니다.
  name: '정하민',
  nameEn: 'Hamin Jeoung',
  // 깃 기록이 없을 때 '마지막 수정' 날짜로 씁니다.
  updated: '2026-11-10',
  ...load('profile.json', profileSchema, profileJson),
};

// 논문 및 발표. 파일에 적힌 순서대로 보입니다.
export const publications = load('publications.json', publicationsSchema, publicationsJson);
// 수상과 활동. 파일에 적힌 순서대로 보입니다. 새 항목은 맨 위에 넣습니다.
export const awards = load('awards.json', datedListSchema, awardsJson);
export const activities = load('activities.json', datedListSchema, activitiesJson);
// 소식. 최근 12개월 안의 것만 최대 4개까지 보입니다.
export const news = load('news.json', newsSchema, newsJson);
// 읽고 있는 논문. 위에서부터 3개까지 보입니다.
export const reading = load('reading.json', readingSchema, readingJson);

export type { DatedItem, NewsItem, Publication, Reading } from './schema';
