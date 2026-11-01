---
title: MediaPipe와 DTW로 만든 한국 수어 단어 인식 데모
summary: MediaPipe로 뽑은 손과 얼굴 랜드마크를 프레임마다 102차원 피처로 바꾸고, 단어별 프로토타입과의 DTW 거리로 한국 수어 단어를 고르는 웹캠 데모입니다. 곰, 공사장, 공원, 공장, 놀이터의 프로토타입을 단어마다 AI Hub 수어 영상 한 개로 만들었고(공원과 놀이터는 같은 영상), 따로 떼어 둔 평가 기록은 없습니다.
period: '2025.08'
context: 발표용 데모 프로젝트
stack: [Python, MediaPipe, OpenCV, NumPy, Streamlit, streamlit-webrtc, OpenAI API]
links:
  - label: 코드
    href: https://github.com/roundycat/ksl-10word-suite
titleEn: Korean Sign Language Word Recognition with MediaPipe and DTW
summaryEn: A webcam demo that turns MediaPipe hand and face landmarks into a 102-dimensional feature per frame and picks a Korean Sign Language word by DTW distance to per-word prototypes. Each of the five words (bear, construction site, park, factory, playground) has prototypes from a single AI Hub sign video. Park and playground ended up with identical landmarks, and there is no held-out evaluation.
order: 5
---

적은 영상으로 수어 단어를 알아보려고, 손 모양에 더해 손이 얼굴의 어디쯤 있는지를 피처로 넣었다. 저장소 이름은 10단어지만 데이터와 모델은 다섯 단어다. 학습 영상은 AI Hub의 수어 영상이다.

## 만든 것

- 데이터 변환: 영상을 MediaPipe Hands와 Face Detection으로 읽어 프레임마다 손 21개 점과 얼굴 6개 점을 JSONL로 저장한다.
- 피처: 손 좌표는 손목 기준으로 크기와 손바닥 방향을 맞춘다. 얼굴 쪽은 코를 원점, 눈 사이 거리를 단위로 삼아 손가락 끝과 입, 귀 사이 거리와 손목 위치 등 손마다 8개 값을 잰다. 프레임당 102차원이고, 동작 하나를 32프레임으로 보간한다.
- 분류: 속도 바꾸기, 코 중심 회전, 좌표 잡음으로 시퀀스를 늘려 단어마다 프로토타입 3개를 고른다. Sakoe-Chiba 밴드를 건 DTW로 가장 가까운 단어를 고르되, 거리가 단어별 임계(Q75 + 1.5×IQR)를 넘거나 1위와 2위의 차가 단어별 기준보다 작으면 거절한다.
- 데모: Streamlit 웹캠 화면에서 손 움직임으로 동작 구간을 자르고, 같은 단어가 두 번 연달아 받아들여지면 음성으로 읽는다. OpenAI API를 쓰는 선택 기능으로 확정한 단어를 짧은 문장으로 다듬고, 거절된 동작에는 촬영 점검 목록을 보여 준다.

지문자 ㄱ을 규칙으로 판정하는 별도 스크립트도 있다.

## 한계

- 단어마다 영상이 하나이고 수어 제공자도 한 명이다. 정확도는 증강한 학습 데이터로만 쟀고, 따로 떼어 둔 평가는 없다.
- 공원과 놀이터는 파일 이름은 다르지만 내용이 같은 영상으로 학습해 랜드마크가 프레임까지 똑같고, 모델이 두 단어를 가를 근거가 없다.
- 변환한 영상에서 손이 잡힌 프레임은 단어에 따라 30%에서 71%다.
- 변환 스크립트는 영상을 좌우로 뒤집지만 데모는 웹캠 프레임을 그대로 써서, 실시간 입력과 학습 데이터의 좌우가 반대다.
- 저장소는 발표 당시 그대로라, 일부 실행 경로와 README 명령은 손봐야 돌아간다.
