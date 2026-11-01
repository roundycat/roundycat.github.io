// 사이트에 들어가는 개인 정보는 전부 이 파일에서 고칩니다.
//
// `example: true` 가 붙은 항목은 처음에 넣어 둔 예시입니다.
// 본인 내용으로 바꾼 뒤 그 `example: true` 를 지우세요. 쓰지 않을 항목은 통째로 지워도 됩니다.
// 개발 서버(npm run dev)에서는 예시 항목 옆에 '예시' 표시가 보이고,
// 예시가 하나라도 남아 있으면 npm run build 가 멈춥니다. 없는 경력이 실수로 배포되지 않게 하려는 장치입니다.

export const site = {
  name: '정하민',
  nameEn: 'Hamin Jeoung',

  // 첫 문단입니다. 두 가지 표시를 쓸 수 있습니다.
  //   [글자]{PS}  [글자]{OG}   형광펜 주석. KLUE 개체명 태그(PS: 인명, OG: 기관)를 따릅니다.
  //   [글자](/주소/)            링크
  // 조사는 괄호 밖에 두세요. 예: [정하민]{PS}입니다
  intro:
    '[정하민]{PS}입니다. [연세대학교 미래캠퍼스]{OG} 소프트웨어학부에서 자연어처리를 공부합니다. 요즘은 공동 저자들과 함께, 한의사 국가시험으로 언어 모델을 평가하는 [벤치마크](/projects/meridian/) 논문을 다듬고 있습니다.',

  // 두 번째 문단입니다. 학년, 졸업 예정 시기, 연구실(있다면), 찾고 있는 자리를 짧게 적으세요.
  about:
    '4학년입니다. 2025년 9월부터 한국연구재단 지원 연구과제 「환자유래 건강데이터 기반 노화 질환 조기 예측을 위한 수리 기반 인공지능 알고리즘 개발」에 연구원으로 참여하고 있습니다.',

  // 비워 두면 화면에 나오지 않습니다.
  contact: {
    email: 'roundykitten@yonsei.ac.kr',
    github: 'https://github.com/roundycat',
    linkedin: 'https://www.linkedin.com/in/haminjeoung/',
    huggingface: '', // 예: 'https://huggingface.co/your-id'
    scholar: '', // 예: 'https://scholar.google.com/citations?user=...'
    cv: '', // public 폴더에 cv.pdf 를 넣고 '/cv.pdf'
    cvUpdated: '', // 예: '2026.10'
  },

  // 사진은 선택입니다. public 폴더에 넣고 '/photo.jpg' 처럼 적으세요. 세로 3:4 비율이 잘 맞습니다.
  photo: '',

  // English 페이지(/en/)에 들어가는 소개입니다.
  bioEn:
    'I study natural language processing in the Department of Software at Yonsei University Mirae Campus, where I am a fourth-year student. With three co-authors, I built a benchmark that evaluates language models on the Korean Medicine licensing examination, and we are revising the paper. Since September 2025 I have been a research assistant on a National Research Foundation of Korea project on AI for early prediction of aging-related diseases.',

  // 깃 기록이 없을 때 '마지막 수정' 날짜로 씁니다.
  updated: '2026-11-01',
};

// 논문 및 발표. 하나라도 있으면 첫 문단 바로 아래에 나옵니다.
// 게재가 확정된 것만 넣으세요. 본인 이름(name, nameEn)은 굵게 표시됩니다.
export const publications: Publication[] = [
  {
    authors: ['정하민', '박준모'],
    title: '산업 생태계 고도화를 위한 AI 기반 기술 활용 방안 연구',
    venue: '융합신호처리학회논문지 26권 2호, 80–85쪽, 2025',
    type: '학술지 논문, 제1저자',
    links: [{ label: 'DOI', href: 'https://doi.org/10.23087/jkicsp.2025.26.2.005' }],
  },
  {
    authors: ['정하민', '최유경', '박준모'],
    title: '인공지능 기반 정보 보안 방어 시스템 구축의 필요성에 관한 연구',
    venue: '한국인공지능융합기술학회 2024 춘계학술대회',
    type: '발표, 우수 발표 논문상',
  },
];

// 수상. 최신순으로 적습니다. 날짜는 'YYYY.MM', note 에는 주최나 수여 기관을 적습니다.
// 팀 수상은 팀명만 적고 다른 팀원 이름은 넣지 않았습니다.
export const awards: DatedItem[] = [
  {
    date: '2026.06',
    text: '영천시 공공데이터·AI 활용 창업경진대회 아이디어 기획 최우수상 (팀 농지안)',
    note: '영천시',
  },
  { date: '2026.05', text: 'AI Hack Camp 2026 해커톤 장려상', note: '국립중앙과학관' },
  { date: '2025.09', text: '동북권 ICT NEXT FRONTIER 해커톤 최우수상 (팀 YSA)', note: '강릉과학산업진흥원' },
  { date: '2025.09', text: '글로벌 AI 인재양성 챌린지 최우수상 (팀 IRIS)', note: '강원정보문화산업진흥원' },
  {
    date: '2025.08',
    text: 'HIRA CDS 빅데이터 분석 전문가 경진대회 특별상 (팀 YSA)',
    note: '건강보험심사평가원 주최, 연세대학교 미래캠퍼스 주관',
  },
  { date: '2025.04', text: '인공지능융합기술 대상 신진 연구자 부문', note: '인공지능융합기술대상 집행위원회' },
  {
    date: '2025.01',
    text: '2024학년도 디지털헬스케어 창업 아이디어 스테이지-IR 경진대회 최우수상 (팀 IRIS)',
    note: '강원지역혁신플랫폼 디지털헬스케어사업단',
  },
  {
    date: '2024.11',
    text: 'ICT이노베이션스퀘어 AI 해커톤 대상, 모의크라우드펀딩 1등 (팀 IRIS)',
    note: '강원특별자치도, AWS Korea',
  },
  { date: '2024.05', text: '춘계학술대회 우수 발표 논문상', note: '한국인공지능융합기술학회' },
];

// 활동. 시작한 때가 최근인 것부터 적습니다. 기간은 '2026.03 – 08', 진행 중이면 '2025.09 –' 처럼 씁니다.
export const activities: DatedItem[] = [
  {
    date: '2026.10',
    text: '특허 출원: 위성·기상 관측데이터와의 교차검증을 통한 현장 증빙영상의 신뢰성 평가 시스템 및 방법',
    note: '공동 발명',
  },
  { date: '2026', text: '교육부 학생 창업유망팀 300+ 최종 선발 (팀 농지안)', note: '성장트랙' },
  {
    date: '2026.07',
    text: '스탠퍼드 Next Asia Policy Lab 2주 강의 시리즈 「Emerging Challenges in Contemporary Asia」 수료',
  },
  { date: '2026.03 – 08', text: '플라톤 아카데미 넥스트 플러스(PAN+) 장학생', note: '재단법인 지관' },
  {
    date: '2025.09 –',
    text: '한국연구재단 연구과제 연구원',
    note: '환자유래 건강데이터 기반 노화 질환 조기 예측을 위한 수리 기반 인공지능 알고리즘 개발',
  },
  { date: '2025.07', text: '(주)엠투코리아 현장실습', note: '1개월' },
  {
    date: '2025.02',
    text: '연세창업전략학회(YSA) 32기 AI·빅데이터 팀장 임명',
    note: 'ALTAIR Engineering, DUCPIC과 공동으로 수행한 개인 취향 맞춤 여행지 추천 AI 개발 프로젝트',
  },
  {
    date: '2025.01 – 02',
    text: 'LG Aimers 6기 수료',
    note: 'Data Intelligence 과정, 해커톤 주제: 난임 환자 대상 임신 성공 여부 예측',
  },
];

// 소식. 최근 12개월 안의 것만 최대 4개까지 보이고, 2개보다 적으면 섹션이 숨겨집니다.
// 날짜는 'YYYY.MM' 형식, 문장은 명사형으로 짧게 씁니다.
// 글이나 프로젝트 목록에 이미 있는 것은 소식에 다시 쓰지 않습니다.
// 예: { date: '2026.11', text: '○○ 학회 포스터 발표', href: '/projects/meridian/' },
export const news: NewsItem[] = [];

// 읽고 있는 논문. 위에서부터 3개까지 보입니다.
// 메모는 감상보다 궁금한 점이나 걸리는 점을 한두 문장으로 적으면 좋습니다.
// 예: { title: '논문 제목', authors: 'Kim et al.', venue: 'ACL', year: 2026, href: 'https://arxiv.org/abs/...', note: '궁금한 점 한두 문장' },
export const reading: Reading[] = [];

export type Publication = {
  authors: string[];
  title: string;
  venue: string;
  type?: string;
  links?: { label: string; href: string }[];
};

export type NewsItem = {
  date: string;
  text: string;
  href?: string;
  example?: boolean;
};

export type DatedItem = {
  date: string;
  text: string;
  // 둘째 줄에 작게 보이는 설명 (주최 기관, 과정 이름 등)
  note?: string;
  href?: string;
};

export type Reading = {
  title: string;
  authors: string;
  venue: string;
  year: number;
  href: string;
  note?: string;
  example?: boolean;
};
