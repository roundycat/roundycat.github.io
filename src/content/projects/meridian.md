---
title: 한의사 국가시험으로 언어 모델 평가하기
summary: 4인 공동 연구로 한의사 국가시험 4개년 기출 1,138문항을 모아 언어 모델을 평가하는 벤치마크와 검색용 지식 자원을 만들었습니다. 검색 없이 풀게 했을 때 공개 모델 9개의 평균 정답률은 36.00%였고, 평가한 공개 모델은 모두 합격선인 총점 60%에 못 미쳤습니다.
context: 연구 프로젝트
team: 4인 공동 저자
titleEn: Evaluating Language Models on the Korean Medicine Licensing Examination
summaryEn: As a team of four authors, we built a benchmark of 1,138 questions from four years of the Korean Medicine licensing examination, along with retrieval resources. Nine open models averaged 36.00% without retrieval, and none of the open models we evaluated reached the 60% overall score required to pass.
order: 1
---

한의사 국가시험의 합격 기준은 총점 60%와 과목별 40%다. 검색 없이 풀게 했을 때 공개 모델 9개의 평균 정답률은 36.00%였고, 평가한 공개 모델 가운데 합격선을 넘은 것은 없었다.

## 만든 것

- 한의사 국가시험 2022~2025년 기출 1,138문항
- 평가 방식: 모델이 한국어 문항을 직접 영어로 번역한 뒤 원문과 번역을 함께 보고 답한다. 세 번 답하게 해 다수결로 답을 정한다.
- dense 검색 색인: 처방 기록 3,094건과 용어 9,074건, 모두 12,168건
- 지식 그래프: 처방의 구성 관계 25,565개, 적응증 관계 8,858개. 필드 단위 자동 대조로 모두 원래 기록과 일치함을 확인했다.
- 진료지침 58종을 15,677개 조각으로 나눈 별도 색인

## 한계

- 지식 그래프는 원래 기록과 일치하는지만 확인했고, 한의사의 검증은 아직 받지 않았다.
- 2025년 문항을 포함해, 모델의 사전학습 데이터에 문항이 들어갔을 가능성을 완전히 배제하지 못했다.
- 검색 증강의 효과는 이 페이지에 싣지 않았다.
