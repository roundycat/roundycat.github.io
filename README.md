# 정하민 홈페이지

자연어처리를 공부하는 학생의 개인 홈페이지입니다. [Astro](https://astro.build)로 만든 정적 사이트이고, 글과 프로젝트는 마크다운 파일로 씁니다.

## 실행하기

Node.js 22.23 이상(24 권장)이 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:4321 을 열면 됩니다. 파일을 고치면 바로 반영됩니다.

## 예시 표시와 빌드 검사

처음에 넣어 두었던 예시 내용은 모두 실제 내용으로 바꾸거나 지웠습니다.
나중에 자리만 잡아 둘 항목에 `example: true` 를 붙이면 개발 서버에서 점선으로 된 `예시` 표시가 보이고, 그 항목이 남아 있는 동안 `npm run build` 가 멈추며 어느 파일의 몇 번째 줄인지 알려 줍니다. 없는 경력이나 지어낸 숫자가 실수로 배포되지 않게 하려는 장치입니다.

비어 있는 목록(글, 소식, 읽고 있는 논문)은 화면에서 섹션째 숨겨집니다. 글이 하나도 없으면 위쪽 메뉴의 '글'도 숨겨집니다.

## 어디를 고치면 되나

| 바꾸고 싶은 것 | 파일 |
| --- | --- |
| 첫 문단, 학년과 졸업 예정, 연락처, 사진, 영어 소개 | `src/data/site.ts` |
| 논문 및 발표, 소식, 읽고 있는 논문 | `src/data/site.ts` |
| 프로젝트 | `src/content/projects/*.md` |
| 글 | `src/content/notes/*.md` |
| CV PDF, 사진 파일 | `public/` 폴더에 넣고 `site.ts` 에 경로 적기 |
| 색, 글꼴 크기 | `src/styles/global.css` 맨 위 `:root` |

### 첫 문단 표기법

`site.ts` 의 `intro` 에서 두 가지 표시를 쓸 수 있습니다.

```text
[정하민]{PS}입니다. [연세대학교]{OG} 소프트웨어학부에서 ...
한의사 국가시험으로 언어 모델을 평가하는 [벤치마크](/projects/meridian/) 논문을 ...
```

- `[글자]{PS}`, `[글자]{OG}`: 개체명 인식 도구처럼 형광펜과 태그를 붙입니다. 태그는 KLUE 개체명 태그(PS 인명, OG 기관)를 따릅니다. 조사는 괄호 밖에 두세요.
- `[글자](/주소/)`: 링크입니다.

### 프로젝트 추가

`src/content/projects/` 에 `.md` 파일을 하나 만듭니다. 파일 이름이 주소가 됩니다. (`my-project.md` → `/projects/my-project/`)

```markdown
---
title: 프로젝트 제목
summary: 무엇을 했고 결과가 어땠는지 한두 문장. 숫자가 하나 있으면 좋습니다.
period: 2026.03 – 2026.06   # 시작 시기를 모르면 이 줄을 지웁니다 (목록에 연도가 안 나옴)
context: 자연어처리 수업 (2026년 1학기)
team: 4인 팀, 평가 코드 담당   # 혼자 했다면 이 줄을 지웁니다
stack: [PyTorch, Hugging Face Transformers]
links:
  - label: 코드
    href: https://github.com/...
order: 1   # 작을수록 위에 보입니다
---

본문은 한다체로 씁니다. 결과 표가 있다면 맨 위에 두는 게 좋습니다.
```

### 글 추가

`src/content/notes/` 에 `.md` 파일을 만듭니다. 파일 이름이 주소가 됩니다. (`lora-rank.md` → `/notes/lora-rank/`) 링크를 나눌 때 깔끔하도록 영문 소문자와 하이픈으로 짓는 것을 권합니다.
첫 글을 올리면 위쪽 메뉴와 첫 화면에 '글'이 나타납니다.

```markdown
---
title: 글 제목
date: 2026-11-02
description: 검색 결과에 보일 한 문장
---
```

- 날짜는 `2026-11-02` 처럼 날짜만 씁니다. 시간을 붙이면 하루 어긋나 보일 수 있습니다.
- 수식: `$W = W_0 + BA$` (문장 안), `$$ ... $$` (따로 한 줄)
- 코드: 세 개의 백틱(```) 뒤에 `python` 처럼 언어 이름을 적습니다.
- 그림: `src/content/notes/images/` 에 넣고 `![그림 설명](./images/파일이름.png)` 처럼 씁니다. 빌드할 때 크기를 알아서 줄여 줍니다.
- 아직 공개하기 싫은 글은 `draft: true` 를 넣으면 개발 서버에서만 보입니다.
- 배포한 뒤에는 컴퓨터에서 실행하지 않고 GitHub 웹사이트에서도 글을 올릴 수 있습니다. 저장소의 `src/content/notes/` 폴더에서 Add file > Create new file 로 글을 쓰고 Commit 하면, 몇 분 뒤 사이트에 올라갑니다. 그림은 `src/content/notes/images/` 에서 Add file > Upload files 로 올립니다.

## 배포하기 (GitHub Pages)

1. GitHub 에 `<아이디>.github.io` 라는 이름으로 새 저장소를 만듭니다.
2. `astro.config.mjs` 맨 위의 `const site` 를 `'https://<아이디>.github.io'` 로 바꿉니다.
   (example.github.io 로 남아 있으면 빌드가 멈춥니다.)
   저장소 이름이 `<아이디>.github.io` 가 아니라면 `const base` 에 `'/<저장소 이름>'` 을 적습니다.
3. 이 폴더를 그 저장소에 push 합니다.
   ```bash
   git init
   git add .
   git commit -m "첫 배포"
   git branch -M main
   git remote add origin https://github.com/<아이디>/<아이디>.github.io.git
   git push -u origin main
   ```
4. 저장소 Settings > Pages > Build and deployment > Source 를 **GitHub Actions** 로 바꿉니다.

그다음부터는 main 에 push 할 때마다 `.github/workflows/deploy.yml` 이 자동으로 빌드하고 배포합니다.
페이지 아래 '마지막 수정' 날짜는 마지막 커밋 날짜를 씁니다.

## 명령어

| 명령어 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 (http://localhost:4321) |
| `npm run build` | `dist/` 에 배포용 파일 만들기 (예시가 남아 있으면 멈춤) |
| `ALLOW_EXAMPLES=1 npm run build` | 예시가 남아 있어도 빌드 |
| `npm run preview` | 만든 배포용 파일을 로컬에서 미리 보기 |
