---
title: '농지안: 위성 영상과 기상 자료로 돕는 농업재해 손해평가'
summary: 농업재해보험에서 현장 조사 전에 위성 영상과 기상 자료로 피해를 먼저 판독하고 심사 자료를 만드는 플랫폼입니다. 필지 확인부터 리포트 출력까지 작동하는 프로토타입이 있고, 2026년 영천시 공공데이터·AI 활용 창업경진대회 아이디어 기획 최우수상을 받았으며 교육부 학생 창업유망팀 300+에 선발됐습니다.
context: 학생 창업팀
stack: [Google Earth Engine, Sentinel-2, ERA5-Land, VWorld, FarmMap, Expo (React Native)]
links:
  - label: 웹사이트
    href: https://nongjian-web.vercel.app
titleEn: 'Nongjian: Satellite and Weather Data for Crop Disaster Loss Assessment'
summaryEn: A platform for agricultural disaster insurance that reads crop damage from satellite imagery and weather data before field inspections and produces assessment documents. The team has a working prototype from parcel lookup to report output. It won the top prize for idea planning at the 2026 Yeongcheon public data and AI startup competition and was selected for the Ministry of Education's Student Startup 300+ program.
order: 2
---

농업재해보험은 재해가 나면 접수, 현장 확인, 손해평가, 서류 검토가 차례로 이어진다. 재해가 넓게 퍼지면 처리가 길게 밀리고, 넓은 농지의 일부만 표본으로 보고 전체 손해를 추정하며, 언제 누가 조사했는지에 따라 결과가 달라지기도 한다. 농지안은 현장에 가기 전에 공개 위성 영상과 기상 자료로 피해를 먼저 판독하고 심사 자료를 만들어, 현장 조사를 꼭 필요한 곳에 모으려는 서비스다. 현장 조사를 대신하지 않고 돕는 도구로 둔다.

## 만든 것

필지를 고르는 데서 심사 자료를 내는 데까지 한 흐름으로 작동하는 프로토타입이다.

1. 필지 확인: 주소, 지번, 좌표로 필지를 찾고 FarmMap과 VWorld의 필지 정보를 서로 대조해 분석할 농지를 정한다.
2. 자료 수집: Sentinel-2 위성 영상과 ERA5-Land 기상 자료를 API로 자동 수집한다.
3. 피해 판독: NDVI, NDWI 변화량과 영상 분할 모델로 피해 면적과 유형, 신뢰도를 계산한다.
4. 리포트: 판독 결과와 근거를 손해평가 보조용 심사 자료로 출력한다.

농민이 피해를 신고하고 사진을 내는 모바일 앱(Expo, React Native)도 함께 만들고 있다.

## 결과

- 2026년 6월 영천시 공공데이터·AI 활용 창업경진대회 아이디어 기획 최우수상
- 2026년 교육부 학생 창업유망팀 300+ 성장트랙 선발
- 2026년 10월 특허 출원: 위성·기상 관측데이터와의 교차검증을 통한 현장 증빙영상의 신뢰성 평가 시스템 및 방법 (공동 발명)

## 지금 상태

PoC를 함께할 지자체와 보험사, 데이터 협력기관을 찾고 있다.
