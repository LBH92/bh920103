export interface CharacterBackground {
  name: string;
  age: number;
  education: string;
  major: string;
  initialDebt: number; // in 10,000 KRW (만 원)
  initialCash: number;
  specialty: string;
}

export interface Company {
  id: string;
  name: string;
  tier: '대기업' | '스타트업' | '공기업' | '중견기업' | '중소기업' | '외국계' | '자영업';
  category: string;
  baseSalary: number; // in 만 원
  stability: number; // 1 to 5
  welfare: number; // 1 to 5
  stressLevel: number; // 1 to 5
  growthPotential: number; // 1 to 5
  badgeColor: string;
  description: string;
}

export interface JobRole {
  id: string;
  name: string;
  category: '개발/IT' | '기획/마케팅' | '영업/사업' | '재무/경영' | '엔지니어/기술' | '디자인' | '생산/품질';
  bonusSkill: 'skill' | 'reputation' | 'bossTrust' | 'colleagueRelation';
  description: string;
}

export type JobLevel = '신입' | '사원' | '대리' | '과장' | '차장' | '부장' | '임원';

export const JOB_LEVEL_LIST: JobLevel[] = ['신입', '사원', '대리', '과장', '차장', '부장', '임원'];

export const JOB_LEVEL_SALARY_MULTIPLIER: Record<JobLevel, number> = {
  신입: 1.0,
  사원: 1.15,
  대리: 1.35,
  과장: 1.65,
  차장: 2.0,
  부장: 2.4,
  임원: 3.5,
};

export interface PlayerStats {
  skill: number; // 0-100 (업무능력)
  reputation: number; // 0-100 (평판)
  health: number; // 0-100 (건강)
  stress: number; // 0-100 (스트레스)
  bossTrust: number; // 0-100 (상사 신뢰)
  colleagueRelation: number; // 0-100 (동료 관계)
}

export type InvestmentStrategy = 'safe_savings' | 'stock_portfolio' | 'crypto_growth' | 'real_estate_focus';

export interface PlayerAssets {
  cash: number; // 현금 (만 원)
  investments: number; // 가상 주식/코인 투자금 (만 원)
  realEstate: number; // 부동산 자산 평가액 (만 원)
  debt: number; // 부채 (만 원)
  housingTier: '월세 원룸' | '전세 오피스텔' | '수도권 아파트' | '상급지 아파트';
  investmentStrategy: InvestmentStrategy;
}

export interface EventEffect {
  statChanges?: Partial<PlayerStats>;
  cashChange?: number; // 만 원
  investmentsChange?: number;
  debtChange?: number;
  salaryChange?: number; // 연봉 변동 (만 원)
  reputationChange?: number;
}

export interface LifeEventOption {
  text: string;
  description?: string;
  effect: EventEffect;
  probabilitySuccess?: number; // 0 to 1
  successResultText: string;
  failResultText?: string;
  failEffect?: EventEffect;
}

export interface LifeEvent {
  id: string;
  category: 'career' | 'personal' | 'economic' | 'crisis';
  title: string;
  situation: string;
  options: LifeEventOption[];
  minAge?: number;
  maxAge?: number;
  minYear?: number;
  condition?: (stats: PlayerStats, assets: PlayerAssets, level: JobLevel) => boolean;
}

export interface TimelineEntry {
  year: number;
  age: number;
  level: JobLevel;
  companyName: string;
  title: string;
  description: string;
  badge?: string;
  netWorth: number; // 순자산
}

export interface Ending {
  id: string;
  title: string;
  subtitle: string;
  category: 'legend' | 'wealth' | 'peaceful' | 'crisis' | 'special';
  icon: string;
  description: string;
  shareMessage: string;
}

// 1. Data Pools: Companies
export const COMPANY_POOL: Company[] = [
  {
    id: 'c1',
    name: '삼전전자',
    tier: '대기업',
    category: '반도체/전자',
    baseSalary: 5400,
    stability: 5,
    welfare: 5,
    stressLevel: 4,
    growthPotential: 4,
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: '대한민국 1등 대기업. 최고 수준의 초봉과 PS(성과급), 든든한 복지와 치열한 승진 경쟁.',
  },
  {
    id: 'c2',
    name: '현대모빌리티',
    tier: '대기업',
    category: '완성차/모빌리티',
    baseSalary: 5200,
    stability: 5,
    welfare: 5,
    stressLevel: 3,
    growthPotential: 4,
    badgeColor: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    description: '글로벌 모빌리티 선도 대기업. 높은 고용 안정성과 강력한 노조, 안정적인 연봉 상승.',
  },
  {
    id: 'c3',
    name: '토스파이낸스',
    tier: '스타트업',
    category: '핀테크 유니콘',
    baseSalary: 4800,
    stability: 3,
    welfare: 4,
    stressLevel: 5,
    growthPotential: 5,
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    description: '금융 혁신 유니콘 스타트업. 파격적인 스톡옵션과 빠른 승진, 극강의 업무 몰입도.',
  },
  {
    id: 'c4',
    name: '당근랩스',
    tier: '스타트업',
    category: '지역 커뮤니티 플랫폼',
    baseSalary: 4500,
    stability: 3,
    welfare: 4,
    stressLevel: 4,
    growthPotential: 5,
    badgeColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    description: '국민 플랫폼 스타트업. 자율적인 근무 문화와 수평적인 조직, 개인 성장 극대화.',
  },
  {
    id: 'c5',
    name: '한국전력에너지',
    tier: '공기업',
    category: '에너지/공공',
    baseSalary: 4100,
    stability: 5,
    welfare: 5,
    stressLevel: 2,
    growthPotential: 2,
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    description: '정년 60세가 철저히 보장되는 신의 직장. 야근 없는 워라밸과 평화로운 근무 환경.',
  },
  {
    id: 'c6',
    name: '인천국제공항공사',
    tier: '공기업',
    category: '교통/항공',
    baseSalary: 4400,
    stability: 5,
    welfare: 5,
    stressLevel: 2,
    growthPotential: 3,
    badgeColor: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    description: '취준생 선호도 1위 공기업. 영종도의 쾌적한 캠퍼스와 든든한 연금 혜택.',
  },
  {
    id: 'c7',
    name: '오뚜기식품',
    tier: '중견기업',
    category: '식품/소비재',
    baseSalary: 3800,
    stability: 4,
    welfare: 4,
    stressLevel: 3,
    growthPotential: 3,
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    description: '국민의 사랑을 받는 갓뚜기. 비정규직 없는 탄탄한 기업 윤리와 따뜻한 기업 문화.',
  },
  {
    id: 'c8',
    name: '한샘리빙테크',
    tier: '중견기업',
    category: '가구/인테리어',
    baseSalary: 3700,
    stability: 4,
    welfare: 3,
    stressLevel: 4,
    growthPotential: 3,
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    description: '인테리어 선도 중견기업. 영업과 현장 중심의 실행력과 실적 기반 보상.',
  },
  {
    id: 'c9',
    name: '가온소프트',
    tier: '중소기업',
    category: 'SI/솔루션 개발',
    baseSalary: 3200,
    stability: 3,
    welfare: 2,
    stressLevel: 4,
    growthPotential: 4,
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    description: '실무를 빠르게 배우는 IT 중소기업. 기획부터 배포까지 풀사이클 경험, 빠른 이직 발판.',
  },
  {
    id: 'c10',
    name: '구글코리아',
    tier: '외국계',
    category: '글로벌 테크',
    baseSalary: 5500,
    stability: 4,
    welfare: 5,
    stressLevel: 3,
    growthPotential: 5,
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    description: '꿈의 직장 글로벌 빅테크 지사. 세 끼 무료 뷔페, 수평적 호칭 문화와 글로벌 이동 기회.',
  },
  {
    id: 'c11',
    name: '부모님 치킨 프랜차이즈',
    tier: '자영업',
    category: '외식업',
    baseSalary: 3000,
    stability: 2,
    welfare: 1,
    stressLevel: 4,
    growthPotential: 4,
    badgeColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    description: '가업을 이어받은 자영업의 길. 출퇴근 시간은 내 마음이지만 하루 12시간 튀김기와의 사투.',
  },
];

// 2. Job Roles
export const JOB_ROLES: JobRole[] = [
  {
    id: 'j1',
    name: '풀스택 개발자',
    category: '개발/IT',
    bonusSkill: 'skill',
    description: '코드 한 줄로 서비스를 살리고 죽이는 핵심 엔지니어. 야근과 기술 스터디가 일상.',
  },
  {
    id: 'j2',
    name: '서비스 기획자 (PM)',
    category: '기획/마케팅',
    bonusSkill: 'colleagueRelation',
    description: '개발자와 비즈니스 사이를 조율하는 조율사. 회의와 문서 작성이 주특기.',
  },
  {
    id: 'j3',
    name: 'B2B 영업/사업개발',
    category: '영업/사업',
    bonusSkill: 'reputation',
    description: '실적으로 말하는 최전방 공격수. 술자리 접대와 협상 테이블의 지배자.',
  },
  {
    id: 'j4',
    name: '재무/회계 매니저',
    category: '재무/경영',
    bonusSkill: 'bossTrust',
    description: '회사의 곳간을 지키는 깐깐한 살림꾼. 단 1원의 오차도 용납하지 않는 꼼꼼함.',
  },
  {
    id: 'j5',
    name: 'R&D 연구원',
    category: '엔지니어/기술',
    bonusSkill: 'skill',
    description: '미래 기술 특허를 개발하는 브레인. 논문과 실험실이 익숙한 연구형 인재.',
  },
  {
    id: 'j6',
    name: 'UI/UX 디자이너',
    category: '디자인',
    bonusSkill: 'skill',
    description: '사용자 경험과 심미성을 극대화하는 비주얼 마스터. 픽셀 단위의 집착.',
  },
  {
    id: 'j7',
    name: '공정/품질관리 기사',
    category: '생산/품질',
    bonusSkill: 'bossTrust',
    description: '현장의 불량률 제로를 책임지는 현장 사령관. 안전과 표준이 최우선.',
  },
];

// 3. Education Backgrounds
export const EDUCATION_LIST = [
  { name: '고등학교 졸업', weight: 1, startAge: 24, initialCash: 800, initialDebt: 0, skillBonus: 10, repBonus: -5 },
  { name: '전문대학 졸업', weight: 2, startAge: 25, initialCash: 400, initialDebt: 1200, skillBonus: 5, repBonus: 0 },
  { name: '지방 4년제 대학교', weight: 4, startAge: 26, initialCash: 300, initialDebt: 2400, skillBonus: 0, repBonus: 0 },
  { name: '수도권 주요 대학교', weight: 4, startAge: 26, initialCash: 400, initialDebt: 2800, skillBonus: 5, repBonus: 10 },
  { name: 'SKY 명문 대학교', weight: 2, startAge: 27, initialCash: 600, initialDebt: 3200, skillBonus: 15, repBonus: 20 },
  { name: '해외 명문 대학교', weight: 1, startAge: 27, initialCash: 1200, initialDebt: 4500, skillBonus: 15, repBonus: 25 },
];

export const MAJOR_LIST = [
  '컴퓨터공학과',
  '경영학부',
  '전자전기공학과',
  '기계공학부',
  '시각디자인학과',
  '경제학과',
  '신소재공학과',
  '국어국문학과',
  '산업공학과',
  '화학공학과',
];

export const KOREAN_FIRST_NAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권'];
export const KOREAN_GIVEN_NAMES = ['도현', '민준', '서연', '지훈', '수아', '현우', '예은', '준서', '하은', '재원', '소율', '시우', '지아', '태윤', '유진'];

export function generateRandomCharacter(): CharacterBackground {
  const familyName = KOREAN_FIRST_NAMES[Math.floor(Math.random() * KOREAN_FIRST_NAMES.length)];
  const givenName = KOREAN_GIVEN_NAMES[Math.floor(Math.random() * KOREAN_GIVEN_NAMES.length)];
  const edu = EDUCATION_LIST[Math.floor(Math.random() * EDUCATION_LIST.length)];
  const major = MAJOR_LIST[Math.floor(Math.random() * MAJOR_LIST.length)];

  const specialties = [
    '빠른 업무 습득력',
    '뛰어난 사내 친화력',
    '강철 멘탈 & 인내심',
    '날카로운 숫자 감각',
    '창의적인 기획력',
    '끈기 있는 야근 체력',
  ];

  return {
    name: `${familyName}${givenName}`,
    age: edu.startAge,
    education: edu.name,
    major,
    initialDebt: edu.initialDebt,
    initialCash: edu.initialCash,
    specialty: specialties[Math.floor(Math.random() * specialties.length)],
  };
}

export function assignInitialCompany(eduName: string): { company: Company; role: JobRole } {
  // Weighted probability based on education
  let weights: number[];
  if (eduName.includes('SKY') || eduName.includes('해외')) {
    // High chance of 대기업 / 외국계 / 스타트업
    weights = [35, 25, 20, 10, 5, 2, 3, 3, 2, 20, 1];
  } else if (eduName.includes('수도권')) {
    weights = [20, 20, 25, 15, 10, 8, 10, 8, 8, 8, 2];
  } else if (eduName.includes('지방 4년제')) {
    weights = [8, 10, 15, 15, 15, 10, 15, 12, 18, 2, 4];
  } else {
    weights = [3, 4, 10, 12, 8, 5, 15, 15, 25, 1, 8];
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let randomVal = Math.random() * totalWeight;
  let chosenCompany = COMPANY_POOL[0];
  for (let i = 0; i < COMPANY_POOL.length; i++) {
    if (randomVal < weights[i]) {
      chosenCompany = COMPANY_POOL[i];
      break;
    }
    randomVal -= weights[i];
  }

  const chosenRole = JOB_ROLES[Math.floor(Math.random() * JOB_ROLES.length)];
  return { company: chosenCompany, role: chosenRole };
}

// 4. Life Events Pool (Over 25+ detailed events)
export const LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'ev_crisis_server',
    category: 'career',
    title: '새벽 2시 대규모 서비스 장애',
    situation: '핵심 배포 이후 메인 시스템이 다운되어 난리가 났다. 당직도 아닌데 단체 카톡방에 불이 났다.',
    options: [
      {
        text: '택시 타고 즉시 본사로 달려가 밤샘 트러블슈팅',
        description: '체력과 스트레스를 깎고, 상사 신뢰와 평판을 극대화한다.',
        effect: {
          statChanges: { stress: 15, health: -10, bossTrust: 20, reputation: 15, skill: 5 },
          cashChange: 15, // 야근수당
        },
        probabilitySuccess: 0.85,
        successResultText: '원인을 찾아 새벽 5시에 정상 복구 완료! 본부장의 극찬을 받았다.',
        failResultText: '원인 파악에 실패해 외주 업체를 불렀다. 피곤하기만 했다.',
      },
      {
        text: '카톡 알림을 무음으로 해두고 푹 잔다',
        description: '건강을 지키고 스트레스를 피하지만 사내 평판이 하락할 수 있다.',
        effect: {
          statChanges: { stress: -5, health: 5, bossTrust: -15, reputation: -10 },
        },
        probabilitySuccess: 1,
        successResultText: '다음 날 아침 이미 상황은 수습되었다. 다만 팀장의 눈총이 따갑다.',
      },
    ],
  },
  {
    id: 'ev_headhunter',
    category: 'career',
    title: '링크드인으로 찾아온 비밀 헤드헌터 제안',
    situation: '경쟁사에서 현재 받는 연봉보다 20% 인상과 직급 승진을 제시하며 은밀한 이직 면접을 제안했다.',
    options: [
      {
        text: '휴가를 내고 비밀 면접에 응시한다',
        description: '성공 시 연봉이 대폭 오르고 승진하지만, 실패 시 현재 회사에서 소문이 날 수 있다.',
        effect: {
          statChanges: { stress: 10, reputation: 5 },
          salaryChange: 1200,
        },
        probabilitySuccess: 0.7,
        successResultText: '면접 합격! 파격적인 조건으로 연봉이 1,200만 원 인상되었다.',
        failResultText: '최종 면접에서 아쉽게 탈락했다. 비밀 면접 본 게 팀장 귀에 들어가 관계가 어색해졌다.',
        failEffect: { statChanges: { bossTrust: -15, stress: 10 } },
      },
      {
        text: '현재 회사에서의 성장에 집중하며 정중히 거절한다',
        description: '조직에 대한 충성도를 높이고 동료들과의 유대를 다진다.',
        effect: {
          statChanges: { bossTrust: 10, colleagueRelation: 10, stress: -5 },
        },
        probabilitySuccess: 1,
        successResultText: '회사에 충성을 다하기로 했다. 상사가 나의 의리를 높게 평가했다.',
      },
    ],
  },
  {
    id: 'ev_housing_lottery',
    category: 'economic',
    title: '수도권 신도시 특별공급 청약 기회',
    situation: '경쟁률 40:1의 유망 신도시 신축 아파트 청약 접수일이다. 계약금 및 대출을 감당할지 결정해야 한다.',
    options: [
      {
        text: '영끌 대출을 각오하고 청약에 과감히 도전한다',
        description: '당첨 시 순자산이 퀀텀 점프하지만, 막대한 부채가 생긴다.',
        effect: {
          debtChange: 25000, // 2억 5천 대출
          statChanges: { stress: 20 },
        },
        probabilitySuccess: 0.55,
        successResultText: '기적처럼 청약 당첨! 입주권 프리미엄이 붙으며 수도권 자가 보유자가 되었다.',
        failResultText: '아쉽게 청약에서 떨어졌다. 청약 통장 점수만 날렸다.',
        failEffect: { statChanges: { stress: 5 } },
      },
      {
        text: '무리한 대출은 위험하다. 지금은 현금을 모은다',
        description: '안전하게 자산을 지키며 스트레스를 받지 않는다.',
        effect: {
          statChanges: { stress: -5, health: 5 },
          cashChange: 200,
        },
        probabilitySuccess: 1,
        successResultText: '현금 비중을 유지하며 시장 상황을 더 지켜보기로 했다.',
      },
    ],
  },
  {
    id: 'ev_crypto_surge',
    category: 'economic',
    title: '가상자산 광풍과 직장 동료들의 코인 단톡방',
    situation: '동료가 어떤 코인으로 3억을 벌어 퇴사한다는 소문이 돌며 온 사무실이 코인 이야기로 시끄럽다.',
    options: [
      {
        text: '나도 질 수 없다! 비상금 1,000만 원 풀매수',
        description: '대박 아니면 쪽박. 엄청난 변동성에 노출된다.',
        effect: {
          cashChange: -1000,
          investmentsChange: 2500, // +150% 대박
          statChanges: { stress: 15 },
        },
        probabilitySuccess: 0.45,
        successResultText: '상승장 탑승 성공! 원금이 2.5배로 불어나며 큰 수익을 거두었다.',
        failResultText: '매수하자마자 하락장 폭락! 원금의 60%가 증발했다.',
        failEffect: { cashChange: -1000, investmentsChange: 400, statChanges: { stress: 25 } },
      },
      {
        text: '변동성에 휘둘리지 않고 본업과 주식 분산투자에 집중한다',
        description: '멘탈을 지키며 업무에 전념한다.',
        effect: {
          statChanges: { skill: 5, reputation: 5, stress: -5 },
        },
        probabilitySuccess: 1,
        successResultText: '코인 시장이 곧 폭락했다. 물리지 않고 본업을 지킨 현명한 선택이었다.',
      },
    ],
  },
  {
    id: 'ev_burnout_holiday',
    category: 'personal',
    title: '극심한 번아웃과 2주간의 안식 휴가 찬스',
    situation: '매일 아침 눈뜰 때마다 가슴이 답답하다. 이번 프로젝트가 끝나고 장기 연차를 쓸 기회가 생겼다.',
    options: [
      {
        text: '눈치 보지 않고 2주 동안 해외여행을 떠난다',
        description: '경비가 들지만 건강과 스트레스가 완전히 리셋된다.',
        effect: {
          cashChange: -400,
          statChanges: { stress: -35, health: 25, colleagueRelation: -5 },
        },
        probabilitySuccess: 1,
        successResultText: '발리 해변에서 푹 쉬며 잃어버렸던 삶의 활력을 되찾았다!',
      },
      {
        text: '연차를 아끼고 보너스로 환급받는다',
        description: '돈은 모이지만 피로가 계속 누적된다.',
        effect: {
          cashChange: 150,
          statChanges: { stress: 15, health: -10 },
        },
        probabilitySuccess: 1,
        successResultText: '연차 수당은 들어왔지만 만성 피로가 어깨를 짓누른다.',
      },
    ],
  },
  {
    id: 'ev_boss_dinner',
    category: 'career',
    title: '임원 주관 금요일 밤 3차 회식 강요',
    situation: '금요일 밤 10시, 2차가 끝났는데 본부장이 "오늘 밤 새자"며 3차 노래방을 외친다.',
    options: [
      {
        text: '마이크를 잡고 탬버린을 흔들며 분위기 메이커를 자처한다',
        description: '다음 날 간 건강은 포기하지만, 임원의 확실한 눈도장을 찍는다.',
        effect: {
          statChanges: { bossTrust: 25, health: -15, stress: 10, reputation: 5 },
        },
        probabilitySuccess: 0.9,
        successResultText: '임원의 애창곡 듀엣 성공! 다음 주부터 인사 평가에서 특혜를 약속받았다.',
        failResultText: '과음으로 다음 날 출근 지각 사고를 쳤다.',
        failEffect: { statChanges: { reputation: -10, health: -20 } },
      },
      {
        text: '가족 핑계를 대고 정중하게 도망친다',
        description: '건강과 주말을 지키지만 상사의 서운함을 감수해야 한다.',
        effect: {
          statChanges: { health: 10, stress: -10, bossTrust: -10 },
        },
        probabilitySuccess: 1,
        successResultText: '지하철 막차를 타고 귀가해 주말을 온전히 휴식으로 보냈다.',
      },
    ],
  },
  {
    id: 'ev_startup_founding',
    category: 'career',
    title: '대학 동기의 초기 스타트업 공동창업 제안',
    situation: '실리콘밸리 엑셀러레이터 출신 친구가 AI 플랫폼 창업을 함께하자며 스톡옵션 15%와 초기 이사직을 제안했다.',
    options: [
      {
        text: '과감하게 사표를 던지고 스타트업에 합류한다',
        description: '안정적인 직장을 떠나 유니콘 창업의 길로 뛰어든다. (리스크 극상)',
        effect: {
          statChanges: { skill: 20, stress: 25 },
        },
        probabilitySuccess: 0.4,
        successResultText: '시리즈 A 100억 투자 유치 성공! 기업가치가 폭등하며 스톡옵션 대박이 터졌다.',
        failResultText: '1년 만에 시드 머니가 바닥났다. 월급도 밀려 다시 구직 시장으로 나왔다.',
        failEffect: { cashChange: -1500, statChanges: { stress: 30, health: -15 } },
      },
      {
        text: '친구는 응원하되, 나는 안정적인 직장을 유지한다',
        description: '현재의 커리어 트랙을 지키며 리스크를 회피한다.',
        effect: {
          statChanges: { stress: -5, colleagueRelation: 5 },
        },
        probabilitySuccess: 1,
        successResultText: '직장에서의 안정적인 성장을 택했다. 마음 편히 매달 월급을 받는다.',
      },
    ],
  },
  {
    id: 'ev_patent_award',
    category: 'career',
    title: '사내 직무발명 특허 출원과 직무 포상금',
    situation: '지난 반년간 연구개발한 독자적인 비즈니스 로직이 사내 우수 발명으로 선정되었다.',
    options: [
      {
        text: '회사 명의로 특허 등록하고 포상금과 인사 가점을 받는다',
        description: '확실한 연봉 인상과 사내 평판 급상승.',
        effect: {
          cashChange: 500,
          statChanges: { reputation: 25, skill: 15, bossTrust: 15 },
          salaryChange: 400,
        },
        probabilitySuccess: 1,
        successResultText: '사내 기술대상 수상! 전사 공지에 내 이름이 대문짝만하게 실렸다.',
      },
    ],
  },
  {
    id: 'ev_colleague_conflict',
    category: 'career',
    title: '내 성과를 가로채려는 얌체 선배와의 갈등',
    situation: '내가 밤새워 작성한 제안서에 자기 이름을 1저자로 올려 임원 보고를 하려는 선배가 있다.',
    options: [
      {
        text: '모든 수정 히스토리와 메일을 첨부해 임원에게 직접 소명한다',
        description: '정의를 구현하지만 선배와의 사내 관계는 파탄 난다.',
        effect: {
          statChanges: { reputation: 15, colleagueRelation: -20, stress: 15 },
        },
        probabilitySuccess: 0.8,
        successResultText: '임원이 진실을 확인하고 나를 단독 PM으로 임명했다. 선배는 좌천되었다.',
        failResultText: '임원이 "사내에서 분란 일으키지 말라"며 양비론으로 넘겼다.',
        failEffect: { statChanges: { reputation: -10, bossTrust: -15 } },
      },
      {
        text: '이번엔 양보하고, 다음엔 선배 몰래 독자 채널을 뚫는다',
        description: '갈등을 피하고 조용히 다음 기회를 노린다.',
        effect: {
          statChanges: { stress: 15, colleagueRelation: 5 },
        },
        probabilitySuccess: 1,
        successResultText: '속은 쓰리지만 다음 프로젝트에서는 완벽한 보안을 유지하기로 했다.',
      },
    ],
  },
  {
    id: 'ev_marriage_talk',
    category: 'personal',
    title: '인생의 중대사, 결혼과 신혼집 마련 고민',
    situation: '연인과 진지하게 결혼을 논의 중이다. 양가 인사와 예식, 신혼집 전세 자금을 마련해야 한다.',
    options: [
      {
        text: '스몰 웨딩과 실속 있는 전세로 알뜰하게 시작한다',
        description: '지출을 최소화하고 스트레스를 낮춘다.',
        effect: {
          cashChange: -3000,
          statChanges: { health: 10, stress: -10, reputation: 10 },
        },
        probabilitySuccess: 1,
        successResultText: '마음 맞는 반려자와 함께 평온하고 안정된 가정을 꾸렸다.',
      },
      {
        text: '호텔 예식과 무리한 대출로 강남권 신혼집을 계약한다',
        description: '화려함과 사회적 체면을 얻지만 큰 빚을 진다.',
        effect: {
          cashChange: -6000,
          debtChange: 15000,
          statChanges: { reputation: 25, stress: 25 },
        },
        probabilitySuccess: 1,
        successResultText: '주변의 엄청난 부러움을 샀지만, 매달 대출 원리금 갚느라 허리가 휜다.',
      },
    ],
  },
  {
    id: 'ev_restructuring_crisis',
    category: 'crisis',
    title: '전사적 구조조정과 희망퇴직 권고',
    situation: '글로벌 경기 침체로 본사에서 대규모 인력 감축을 선언했다. 연봉 2년 치 위로금을 제시하며 희망퇴직 신청을 받는다.',
    options: [
      {
        text: '위로금을 챙겨 명예퇴직하고 재취업/창업을 모색한다',
        description: '일시불 목돈을 확보하지만 당분간 무직 상태가 된다.',
        effect: {
          cashChange: 8000,
          statChanges: { stress: -20, health: 15, bossTrust: -20 },
        },
        probabilitySuccess: 0.8,
        successResultText: '위로금 8,000만 원을 수령하고 퇴사! 그동안 지쳤던 몸과 마음을 추스른다.',
        failResultText: '퇴직금 정산 과정에서 갈등이 있었지만 무사히 수령했다.',
      },
      {
        text: '절대 나갈 수 없다! 악착같이 버텨 사내에 잔류한다',
        description: '자리는 지키지만 남은 동료들의 몫까지 격무를 감당해야 한다.',
        effect: {
          statChanges: { stress: 25, health: -10, bossTrust: 15, skill: 10 },
        },
        probabilitySuccess: 1,
        successResultText: '살아남았다! 인원 감축 후 팀의 핵심 기둥으로 자리 잡았다.',
      },
    ],
  },
  {
    id: 'ev_overseas_expat',
    category: 'career',
    title: '미국 실리콘밸리 지사 주재원 파견 기회',
    situation: '해외 법인 확장 프로젝트로 2년간 미국 주재원으로 나갈 직원을 선발한다. 체재비 지원과 연봉 30% 할증이 붙는다.',
    options: [
      {
        text: '주재원에 전격 지원해 글로벌 커리어를 쌓는다',
        description: '영어를 극복해야 하지만 커리어 퀀텀 점프의 기회.',
        effect: {
          salaryChange: 1800,
          statChanges: { skill: 25, reputation: 20, stress: 15 },
        },
        probabilitySuccess: 0.75,
        successResultText: '주재원 최종 합격! 캘리포니아 법인에서 글로벌 프로젝트를 리드하게 되었다.',
        failResultText: '아쉽게 영어 인터뷰에서 밀려 고배를 마셨다.',
        failEffect: { statChanges: { stress: 5 } },
      },
      {
        text: '한국에 남아 가족과 현재 생활에 집중한다',
        description: '익숙하고 편안한 국내 본사에서 안정적으로 일한다.',
        effect: {
          statChanges: { stress: -10, colleagueRelation: 10 },
        },
        probabilitySuccess: 1,
        successResultText: '국내 본사에서 든든하게 중심을 지키며 가족과 화목한 시간을 보냈다.',
      },
    ],
  },
  {
    id: 'ev_side_hustle',
    category: 'economic',
    title: '퇴근 후 시작한 IT 부업과 유튜브 강의 대박',
    situation: '주말과 퇴근 후 틈틈이 운영한 직무 팁 블로그와 유튜브 채널이 알고리즘을 타고 폭발적인 인기를 끌기 시작했다.',
    options: [
      {
        text: '부업에 본격적인 투자와 유료 클래스를 개설한다',
        description: '야근 피로는 늘어나지만 제2의 현금 파이프라인이 열린다.',
        effect: {
          cashChange: 2500,
          investmentsChange: 1500,
          statChanges: { stress: 15, health: -10, skill: 10 },
        },
        probabilitySuccess: 0.85,
        successResultText: '월 부수입 500만 원 돌파! 회사 월급 이상의 현금 파이프라인을 구축했다.',
        failResultText: '강의 플랫폼 수수료와 악플로 스트레스만 받았다.',
        failEffect: { cashChange: 500, statChanges: { stress: 15 } },
      },
      {
        text: '겸업 금지 조항이 신경 쓰인다. 취미 수준으로만 즐긴다',
        description: '위험을 피하고 마음 편히 지낸다.',
        effect: {
          statChanges: { stress: -5, reputation: 5 },
        },
        probabilitySuccess: 1,
        successResultText: '소소한 취미로 남겨두어 직장 생활에 아무런 지장을 주지 않았다.',
      },
    ],
  },
  {
    id: 'ev_ethics_whistleblower',
    category: 'crisis',
    title: '팀장의 납품 업체 리베이트 횡령 발견',
    situation: '예산 결산 검토 중 직속 팀장이 특정 협력업체로부터 수천만 원 상당의 뇌물을 받아온 명백한 증거를 발견했다.',
    options: [
      {
        text: '사내 감사팀에 증거를 제출하고 내부 고발한다',
        description: '정의롭지만 사내 정치적 후폭풍에 노출될 수 있다.',
        effect: {
          statChanges: { reputation: 30, bossTrust: -30, stress: 20 },
        },
        probabilitySuccess: 0.9,
        successResultText: '감사 결과 팀장이 해임되고 준법 표창을 받았다! 사내 영웅으로 떠올랐다.',
        failResultText: '팀장이 감사팀 윗선과 친분이 있어 오히려 보복성 인사이동을 당할 뻔했다.',
        failEffect: { statChanges: { reputation: -15, stress: 25 } },
      },
      {
        text: '못 본 척 눈감고 조용히 내 업무만 한다',
        description: '위험을 피하지만 양심의 가책을 느낀다.',
        effect: {
          statChanges: { stress: 10, colleagueRelation: -5 },
        },
        probabilitySuccess: 1,
        successResultText: '아무 일 없었다는 듯 조용히 넘어갔다. 뒷맛은 씁쓸하다.',
      },
    ],
  },
];

// 5. Diverse Endings Pool (15 Endings)
export const ENDINGS_POOL: Ending[] = [
  {
    id: 'end_ceo',
    title: '대기업 대표이사(CEO) 등극',
    subtitle: '신입사원에서 시작해 재계의 정점에 선 전설적인 샐러리맨 신화',
    category: 'legend',
    icon: 'Crown',
    description: '탁월한 역량과 불굴의 생존력으로 임원을 넘어 그룹 대표이사에 올랐습니다. 당신의 자서전이 베스트셀러에 오르고 수많은 직장인들의 롤모델이 되었습니다.',
    shareMessage: '신입사원에서 대기업 대표이사(CEO)까지 등극! 직장인 인생 시뮬레이션 클리어!',
  },
  {
    id: 'end_fire',
    title: '조기 은퇴 파이어(FIRE)족 달성',
    subtitle: '순자산 20억 달성! 40대에 명예롭게 은퇴한 금융의 승리자',
    category: 'wealth',
    icon: 'Palmtree',
    description: '철저한 절약과 영리한 투자로 40대에 경제적 자유를 완성했습니다. 월요일 아침 알람 없이 눈을 뜨며 세계 일주를 즐기는 진정한 인생의 승리자입니다.',
    shareMessage: '순자산 20억 돌파로 40대 파이어(FIRE)족 조기 은퇴 달성!',
  },
  {
    id: 'end_retirement',
    title: '명예로운 60세 정년퇴직',
    subtitle: '30여 년간 비바람을 견뎌내고 당당하게 완주한 참된 직장인',
    category: 'peaceful',
    icon: 'Award',
    description: '수많은 위기와 구조조정 속에서도 흔들림 없이 가정을 지키고 정년을 맞이했습니다. 든든한 국민연금과 퇴직금, 그리고 존경하는 동료들의 박수 속에 은퇴합니다.',
    shareMessage: '30년 근속! 명예로운 60세 정년퇴직으로 당당히 완주했습니다.',
  },
  {
    id: 'end_unicorn',
    title: '유니콘 스타트업 창업 성공 신화',
    subtitle: '사표 던지고 창업한 회사가 기업가치 1조 원 유니콘으로!',
    category: 'legend',
    icon: 'Rocket',
    description: '남들이 가지 않은 험난한 길을 걸어 유니콘 기업을 일궈냈습니다. 나스닥 상장과 대규모 엑시트로 수백억 자산가가 되었습니다.',
    shareMessage: '유니콘 스타트업 창업 성공! 수백억 자산가 등극!',
  },
  {
    id: 'end_super_ant',
    title: '여의도 슈퍼개미 등극',
    subtitle: '월급은 거들 뿐! 주식과 투자로 순자산 30억 돌파',
    category: 'wealth',
    icon: 'TrendingUp',
    description: '회사는 4대 보험과 신용대출을 위한 수단이었을 뿐. 철저한 종목 분석과 복리의 마법으로 여의도 증권가에서도 주목하는 슈퍼개미가 되었습니다.',
    shareMessage: '월급쟁이에서 여의도 슈퍼개미 등극! 투자 순자산 30억 돌파!',
  },
  {
    id: 'end_burnout',
    title: '만성 번아웃 중도 퇴사',
    subtitle: '몸과 마음의 한계에 도달해 회사를 떠난 휴식의 시간',
    category: 'crisis',
    icon: 'ZapOff',
    description: '끊임없는 야근과 실적 압박으로 스트레스 수치 100%에 도달했습니다. 비록 커리어는 멈췄지만, 생명과 영혼을 지키기 위한 용기 있는 멈춤이었습니다.',
    shareMessage: '만성 번아웃으로 퇴사했습니다. 이제는 푹 쉴 시간입니다.',
  },
  {
    id: 'end_health_crisis',
    title: '건강 악화 강제 요양',
    subtitle: '일만 하다가 몸을 망친 현대인의 안타까운 자화상',
    category: 'crisis',
    icon: 'HeartCrack',
    description: '연봉과 승진에 매달리다 건강을 잃었습니다. 병원 침대에 누워 "건강을 잃으면 모든 것을 잃는다"는 진리를 뼈저리게 깨닫고 요양을 시작합니다.',
    shareMessage: '건강 악화로 강제 은퇴... 돈보다 건강이 먼저입니다.',
  },
  {
    id: 'end_bankruptcy',
    title: '영끌 투자 실패 파산',
    subtitle: '무리한 레버리지와 투자 실패로 빚더미에 앉은 비운의 결말',
    category: 'crisis',
    icon: 'AlertTriangle',
    description: '한 방을 노린 무리한 대출과 투자 실패로 부채가 자산을 압도했습니다. 월급의 전부가 이자로 빠져나가는 신용회복위원회의 길을 걷게 되었습니다.',
    shareMessage: '무리한 영끌 투자로 파산... 분산투자의 중요성을 배웠습니다.',
  },
  {
    id: 'end_chicken',
    title: '자영업 치킨집 사장님',
    subtitle: '퇴직금으로 오픈한 동네 1등 치킨집! 기름 냄새 속 소소한 행복',
    category: 'peaceful',
    icon: 'Store',
    description: '직장 생활을 정리하고 치킨 프랜차이즈를 오픈했습니다. 상사 잔소리 없이 내 가게를 운영하며 배달의민족 맛집 랭킹 1위를 차지했습니다.',
    shareMessage: '회사 탈출 후 치킨집 사장님으로 제2의 인생 시작!',
  },
  {
    id: 'end_job_hopper',
    title: '연봉 퀀텀 점프 글로벌 프로 이직러',
    subtitle: '5번의 이직 끝에 실리콘밸리 본사로! 커리어 패스의 승리자',
    category: 'wealth',
    icon: 'Compass',
    description: '한 회사에 얽매이지 않고 실력 하나로 몸값을 올렸습니다. 국내외 유수 기업을 거치며 독보적인 전문성과 높은 연봉을 거머쥐었습니다.',
    shareMessage: '5번의 이직 끝에 글로벌 테크 본사 입성! 프로 이직러의 승리!',
  },
  {
    id: 'end_peaceful_worker',
    title: '평온한 만년 과장의 지혜',
    subtitle: '승진 경쟁은 사양합니다! 워라밸과 가정을 지킨 현명한 삶',
    category: 'peaceful',
    icon: 'Coffee',
    description: '부장, 임원 승진을 위해 영혼을 갈아넣는 대신 정시 퇴근과 취미 생활을 택했습니다. 큰 부자는 아니지만 가장 행복한 가정을 꾸렸습니다.',
    shareMessage: '워라밸 100%! 스트레스 없이 행복한 직장 생활을 완주했습니다.',
  },
  {
    id: 'end_civil_god',
    title: '공기업 철밥통 종신',
    subtitle: '칼퇴와 안정성의 끝판왕! 호봉제 연봉과 평온한 노후',
    category: 'peaceful',
    icon: 'ShieldCheck',
    description: '사기업 동기들이 구조조정에 떨 때, 호봉이 매년 따박따박 오르는 공기업에서 무사고로 완주했습니다. 대한민국 최고의 철밥통입니다.',
    shareMessage: '공기업 무사고 30년 완주! 철밥통 신화를 달성했습니다.',
  },
];

export function determineEnding(
  stats: PlayerStats,
  assets: PlayerAssets,
  level: JobLevel,
  age: number,
  company: Company,
  jobHopCount: number
): Ending {
  const netWorth = assets.cash + assets.investments + assets.realEstate - assets.debt;

  // 1. Extreme Crisis Endings
  if (stats.stress >= 100) return ENDINGS_POOL.find(e => e.id === 'end_burnout')!;
  if (stats.health <= 10) return ENDINGS_POOL.find(e => e.id === 'end_health_crisis')!;
  if (netWorth < -10000) return ENDINGS_POOL.find(e => e.id === 'end_bankruptcy')!;

  // 2. Wealth / FIRE Endings
  if (age <= 48 && netWorth >= 200000) {
    // 20억+ before age 48
    return ENDINGS_POOL.find(e => e.id === 'end_fire')!;
  }
  if (assets.investments >= 300000) {
    // 30억+ in investments
    return ENDINGS_POOL.find(e => e.id === 'end_super_ant')!;
  }

  // 3. Career Legend Endings
  if (level === '임원' && stats.reputation >= 85 && stats.skill >= 80) {
    return ENDINGS_POOL.find(e => e.id === 'end_ceo')!;
  }
  if (company.tier === '스타트업' && netWorth >= 100000 && stats.skill >= 80) {
    return ENDINGS_POOL.find(e => e.id === 'end_unicorn')!;
  }
  if (jobHopCount >= 4 && netWorth >= 80000) {
    return ENDINGS_POOL.find(e => e.id === 'end_job_hopper')!;
  }
  if (company.tier === '공기업' && age >= 58) {
    return ENDINGS_POOL.find(e => e.id === 'end_civil_god')!;
  }

  // 4. Age 60+ Retirement
  if (age >= 60) {
    if (netWorth >= 100000) {
      return ENDINGS_POOL.find(e => e.id === 'end_retirement')!;
    }
    return ENDINGS_POOL.find(e => e.id === 'end_peaceful_worker')!;
  }

  // 5. Default peaceful worker / chicken shop
  if (company.tier === '자영업' || netWorth < 10000) {
    return ENDINGS_POOL.find(e => e.id === 'end_chicken')!;
  }
  return ENDINGS_POOL.find(e => e.id === 'end_peaceful_worker')!;
}
