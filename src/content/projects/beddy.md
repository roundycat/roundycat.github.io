---
title: 'Beddy 2.0: 입원한 아이의 AI 친구에 더한 안전 장치'
summary: 다른 팀이 해커톤에서 만든 장기입원 아동용 AI 친구 앱 Beddy 위에서, 위기 신호 판정을 5단계로 다시 만들고 보호자 글 유출 검사와 만 14세 미만 보호자 동의 같은 아동 안전 장치를 더한 v2입니다. AI로 합성한 평가 문장에서 일상 대화의 보호자 오경보율을 8.2%에서 3.5%로 낮추고, 보호자 글 유출 탐지율을 0%에서 72.0%로 올렸습니다.
period: '2026.10'
context: 2026 AI 라이프 솔루션 챌린지 출품작 (산업통상부)
team: 3인 팀 (팀 YSA, 대표)
stack: [Next.js, TypeScript, Claude API, Amazon Bedrock, Render, Vitest]
links:
  - label: 코드
    href: https://github.com/roundycat/buddy
titleEn: 'Beddy 2.0: Safety Layers for an AI Companion for Hospitalized Children'
summaryEn: Beddy is an AI companion app for children in long-term hospital care, first built by another team at a hackathon. Our v2 replaces its crisis check with a five-level one and adds other child-safety layers, including a leak check on text sent to guardians and guardian consent for children under 14. On synthetic test sentences, the guardian false-alarm rate on everyday messages fell from 8.2% to 3.5%, and leak detection rose from 0% to 72.0%.
order: 4
---

Beddy는 오래 입원한 아이가 AI 친구와 대화하고, 보호자는 대화 원문 대신 요약만 받는 웹앱이다. v1은 2026년 8월 강원 LRS 공유대학 AWS 해커톤에서 다른 팀(5조 각양각색)이 만들어 MIT 라이선스로 공개했다. 페르소나 대화, 새벽 미션 에이전트, 보호자용 RAG는 v1에 있던 것이다. 팀 YSA는 그 위에 아동 안전 장치를 더해 2026 AI 라이프 솔루션 챌린지에 냈다. v1 팀원 한 명도 YSA에 함께했다.

## v2에서 더한 것

- 위기 신호: v1의 정규식 26개, 3단계 판정을 5단계(없음, 관찰, 위험, 긴급, 보호) 규칙 계층으로 바꿨다. 보호는 학대나 폭력에 노출된 신호다. 초성이나 숫자를 끼운 표기도 알아보고, 과장이나 게임 이야기, 부정문은 오경보가 되지 않게 거른다. 애매한 문장은 LLM이 다시 판정하되 단계를 올리기만 한다.
- 학대 노출: 누군가에게 맞거나 위협받았다는 말에는 보호자 자동 알림 대신 간호사, 병원 사회복지, 112, 1388을 안내한다. 그 대화와 이후 72시간의 대화는 보호자 요약의 재료에서 뺀다.
- 응답 필터: AI가 쓴 글을 화면에 내보내기 전에 문장마다 검사한다. 개인정보는 가리고, 약 복용 지시나 위험한 방법 표현, "나만 믿어" 같은 독점이나 비밀 강요 문장은 다른 문장으로 바꾼다.
- 동의와 공유: 만 14세 미만은 보호자 계정이 동의해야 AI와 기록 기능이 열리고, 동의를 철회하면 기록을 지운다. 아이가 보호자와 나눌 범주를 고르고, 보호자에게 가는 글에 아이 원문이나 제3자 실명, 병실 호수가 섞였는지 검사한다.

## 결과

v1과 v2를 같은 평가 문장으로 쟀다. 평가 문장은 AI로 합성했고, v2는 규칙 계층만 쟀다.

- 일상 문장 170개: 보호자 오경보율 8.2%(14건)에서 3.5%(6건)
- 보호자 글 150개(유출 75, 정상 75): 유출 탐지율 0%에서 72.0%, 정상 글 오탐률 0%에서 4.0%

## 한계

위기 문장 감지율은 규칙을 만들 때 쓴 문장으로만 쟀고 공개한 독립 평가셋이 없어 싣지 않았다. 실서비스에서는 LLM 재판정이 단계를 올릴 수 있어 오경보율이 위 값보다 높을 수 있다. 아이가 비밀이라고 한 내용을 바꿔 말하면 유출 검사가 20%만 잡는다. 평가 문장은 실제 아이의 대화가 아니며, 법정대리인 본인 확인 절차는 시제품에 없다.
