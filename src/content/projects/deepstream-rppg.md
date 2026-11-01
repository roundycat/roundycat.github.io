---
title: TS-CAN rPPG 모델을 DeepStream에 올리기
summary: 얼굴 영상에서 맥파(BVP)를 추정하는 공개 rPPG 모델 TS-CAN을 ONNX로 바꾸는 스크립트와, NVIDIA DeepStream이 검출한 사람 영역의 최근 10프레임을 이 모델에 넣으려는 앱을 담은 해커톤 코드입니다. 모델 코드와 학습 스크립트, 학습된 가중치, 예제 데이터는 공개 저장소 ubicomplab/deep-rppg-android에서 가져왔습니다.
period: '2025.11'
context: '해커톤 코드 (AI Hackathon 2025 Nvidia Yonsei)'
stack: [Python, TensorFlow, tf2onnx, ONNX Runtime, NVIDIA DeepStream, GStreamer, OpenCV]
links:
  - label: 코드
    href: https://github.com/roundycat/nividia_code_YSA
titleEn: Porting the TS-CAN rPPG Model to NVIDIA DeepStream
summaryEn: Hackathon code with a script that converts TS-CAN, a public rPPG model that estimates the blood volume pulse from face video, to ONNX, and an NVIDIA DeepStream app meant to feed the model the 10 most recent crops of detected people. The model code, training script, trained weights and sample data come from the public repository ubicomplab/deep-rppg-android.
order: 6
---

얼굴 영상에서 비접촉으로 맥파(BVP)를 추정하는 rPPG 모델을 NVIDIA DeepStream 파이프라인에서 돌리려는 코드다. AI Hackathon 2025 Nvidia Yonsei 때 올렸다.

## 가져온 것

모델은 TS-CAN이다(Liu 외, "Multi-Task Temporal Shift Attention Networks for On-Device Contactless Vitals Measurement", NeurIPS 2020, [arXiv:2006.03790](https://arxiv.org/abs/2006.03790)). 모델 정의(model.py), 학습된 가중치(cv_0_epoch48_model.hdf5), 개인화 학습 스크립트(train_txt.py), 예제 데이터 11개(data/SelfCali_C00~C10.mat, 실제 촬영 영상이 아니라 무작위 값)는 공개 저장소 ubicomplab/deep-rppg-android의 파일이고, model.py에 출처 머리말을 단 것 말고는 원본과 같다. model.py의 바탕은 논문 1저자가 MIT 라이선스로 공개한 MTTS-CAN 코드라 그 라이선스 전문도 함께 두었다. DeepStream 설정(pgie_config.txt)은 NVIDIA deepstream_python_apps의 예제 설정에서 모델 경로를 바꾸고 몇 항목을 뺀 것이다.

## 만든 것

이 저장소에서 새로 쓴 코드는 세 스크립트다.

1. 모델 변환(1_export.py): TS-CAN에 학습된 가중치를 불러와 tf2onnx로 ONNX(opset 13) 파일을 만든다. 가중치를 읽지 못하면 경고만 내고 무작위 가중치로 만든다.
2. 추론 엔진(2_inference.py): ONNX Runtime을 CUDA 우선으로 연다. 객체 ID마다 36×36으로 줄인 최근 10프레임을 모아 프레임 차분과 원시 프레임 시퀀스를 넣고, 출력의 첫 값을 돌려준다.
3. DeepStream 앱(3_app.py): DeepStream 샘플 모델인 ResNet10 검출기(nvinfer)가 사람을 찾으면, 화면 표시 단계(nvdsosd) 앞의 probe가 그 상자를 잘라 추론 엔진에 넘긴다. 결과는 심박수로 바꾸지 않고 Signal 값으로 상자 위에 띄운다. 입력은 영상 파일이나 RTSP 주소다.

## 한계

저장소에 ONNX 파일, 실행 화면, 측정 결과가 없어 실행 여부와 정확도, 속도는 알 수 없다.

- 저장소는 해커톤 당시 그대로라, 모듈 이름과 실행 인자, 데이터 경로를 손보지 않으면 앱과 학습 스크립트가 돌아가지 않는다.
- 1_export.py와 2_inference.py는 (1, 10, 36, 36, 3) 입력을 쓰지만, TS-CAN은 10프레임을 배치 축에 펼친 (36, 36, 3) 입력을 받는다.
- 2_inference.py에는 원본 저장소의 전처리 가운데 프레임 차이를 두 프레임의 합으로 나누는 단계와 원시 프레임 표준화가 없다.
- 사람 상자를 통째로 잘라 얼굴보다 넓은 영역이 들어간다. 추적기가 없어 모든 객체가 같은 ID를 받으므로, 여러 사람이 잡히면 한 버퍼에 프레임이 섞인다.
