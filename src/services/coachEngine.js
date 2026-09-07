/**
 * imcoach AI 코칭 및 맞춤형 훈련 스케줄 생성 엔진
 * - 사용자 실제 현재 수치(Baseline) 기반 동적 점진적 과부하(Adaptive Progression) 알고리즘
 */

export const PRESET_GOALS = [
  {
    id: 'marathon_10k_58m',
    category: 'running',
    title: '🏃 10km 달리기 완주 & 페이스 단축',
    badge: '달리기 / 심폐 지구력',
    description: '현재 달리기 수준에 맞춰 부상 없이 10km를 안전하게 완주하고 목표 페이스로 빌드업하는 프로그램입니다.',
    icon: 'Timer',
    targetMetric: '10km 완주',
    unit: '분',
    testType: 'cardio_step',
    defaultDurationWeeks: 6,
    estimatedTotalHours: 24,
    color: '#00ff87'
  },
  {
    id: 'strength_lower_core',
    category: 'strength',
    title: '🏋️ 하체 & 코어 근력 강화 (스쿼트·다리들기·복근)',
    badge: '근력 / 하체 & 코어',
    description: '달리기와 일상에 필수적인 스쿼트, 레그레이즈, 플랭크 기초 근력을 점진적으로 완성하는 프로그램입니다.',
    icon: 'Flame',
    targetMetric: '스쿼트 30회 + 플랭크 60초',
    unit: '회',
    testType: 'squat_hip_mobility',
    defaultDurationWeeks: 6,
    estimatedTotalHours: 20,
    color: '#60efff'
  }
];

// 목표 분석 및 카테고리 매핑 (달리기 vs 근력운동 2가지 섹션 집중)
export function analyzeGoalInput(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('근력') || lower.includes('스쿼트') || lower.includes('다리') || lower.includes('복근') || lower.includes('플랭크') || lower.includes('턱걸이') || lower.includes('풀업') || lower.includes('웨이트')) {
    return {
      category: 'strength',
      detectedTitle: '하체 & 코어 근력 강화 플랜',
      testType: 'squat_hip_mobility',
      baseDifficulty: 3,
      unit: '회'
    };
  }

  // 기본은 달리기(러닝)
  return {
    category: 'running',
    detectedTitle: '10km 달리기 기록 달성 플랜',
    testType: 'cardio_step',
    baseDifficulty: 3,
    unit: '분'
  };
}

export const GOAL_SPECIFIC_SURVEYS = {
  running: {
    title: '🏃 기초 체력 진단',
    questions: [
      {
        id: 'user_age_group',
        question: '1. 연령대',
        options: [
          { label: '50대+', value: '50s', score: 10 },
          { label: '40대', value: '40s', score: 15 },
          { label: '20~30대', value: '2030s', score: 20 }
        ]
      },
      {
        id: 'run_current_pace',
        question: '2. 1km 달리기 속도',
        options: [
          { label: '8분 30초+', value: '8:45', paceSec: 525, score: 5 },
          { label: '8분대', value: '8:05', paceSec: 485, score: 12 },
          { label: '7분대', value: '7:20', paceSec: 440, score: 20 },
          { label: '6분대', value: '6:30', paceSec: 390, score: 30 },
          { label: '5분대 이하', value: '5:40', paceSec: 340, score: 40 }
        ]
      },
      {
        id: 'run_distance',
        question: '3. 최장 달리기 거리',
        options: [
          { label: '1km 미만', value: 1.0, score: 5 },
          { label: '2~3km', value: 2.5, score: 15 },
          { label: '4~6km', value: 5.0, score: 25 },
          { label: '7km 이상', value: 8.0, score: 35 }
        ]
      },
      {
        id: 'squat_current_reps',
        question: '4. 스쿼트 1세트',
        options: [
          { label: '8개 미만', value: 6, score: 5 },
          { label: '10~15개', value: 12, score: 15 },
          { label: '20~25개', value: 20, score: 25 },
          { label: '30개 이상', value: 30, score: 35 }
        ]
      },
      {
        id: 'legraise_current_reps',
        question: '5. 레그레이즈(복근)',
        options: [
          { label: '6회 미만', value: 5, score: 5 },
          { label: '10~12회', value: 10, score: 15 },
          { label: '15~20회', value: 18, score: 25 }
        ]
      },
      {
        id: 'plank_seconds',
        question: '6. 코어 플랭크',
        options: [
          { label: '15초 미만', value: 15, score: 5 },
          { label: '20~40초', value: 30, score: 15 },
          { label: '60초 이상', value: 60, score: 25 }
        ]
      },
      {
        id: 'run_injury',
        question: '7. 관절 통증 여부',
        options: [
          { label: '전혀 없음', value: 'none', score: 15 },
          { label: '가끔 뻐근함', value: 'knee', score: 10 },
          { label: '통증 있음', value: 'shin', score: 5 }
        ]
      }
    ]
  },
  strength: {
    title: '🏋️ 근력 & 기초 체력 정밀 진단',
    questions: [
      {
        id: 'user_age_group',
        question: '1. 연령대',
        options: [
          { label: '50대 이상', value: '50s', score: 10 },
          { label: '40대', value: '40s', score: 15 },
          { label: '20 ~ 30대', value: '2030s', score: 20 }
        ]
      },
      {
        id: 'squat_current_reps',
        question: '2. 스쿼트 1세트 가능 개수',
        options: [
          { label: '8개 미만', value: 6, score: 5 },
          { label: '10 ~ 15개', value: 12, score: 15 },
          { label: '20 ~ 25개', value: 20, score: 25 },
          { label: '30개 이상', value: 30, score: 35 }
        ]
      },
      {
        id: 'legraise_current_reps',
        question: '3. 다리들기(레그레이즈) 가능 횟수',
        options: [
          { label: '6회 미만', value: 5, score: 5 },
          { label: '10 ~ 15회', value: 12, score: 15 },
          { label: '20회 이상', value: 20, score: 25 }
        ]
      },
      {
        id: 'plank_seconds',
        question: '4. 플랭크 버티기 시간',
        options: [
          { label: '15초 미만', value: 15, score: 5 },
          { label: '25 ~ 45초', value: 35, score: 15 },
          { label: '60초 이상', value: 60, score: 25 }
        ]
      },
      {
        id: 'run_distance',
        question: '5. 가벼운 조깅 가능 거리',
        options: [
          { label: '1km 미만', value: 1.0, score: 5 },
          { label: '2 ~ 3km', value: 2.5, score: 15 },
          { label: '5km 이상', value: 5.0, score: 25 }
        ]
      },
      {
        id: 'joint_pain',
        question: '6. 관절 통증 여부',
        options: [
          { label: '전혀 없음', value: 'none', score: 15 },
          { label: '가끔 무릎/허리 뻐근함', value: 'stiff', score: 10 },
          { label: '통증 있음', value: 'pain', score: 5 }
        ]
      }
    ]
  }
};

// 종합 진단 점수 및 Baseline 추출
export function calculateUserLevel(answers, cameraTestScore = null) {
  let surveyScore = 0;
  
  if (answers.surveyScores && Array.isArray(answers.surveyScores)) {
    surveyScore = answers.surveyScores.reduce((acc, cur) => acc + (Number(cur) || 0), 0);
  } else {
    surveyScore = 40;
  }

  let combinedScore = surveyScore;
  if (cameraTestScore !== null && cameraTestScore !== undefined) {
    combinedScore = (surveyScore * 0.70) + (cameraTestScore * 0.30);
  }

  let level = 1;
  let levelTitle = '입문자 (Beginner)';
  let strengthSummary = '기초 체력 및 가동성 형성 단계';

  if (combinedScore >= 90) {
    level = 5;
    levelTitle = '마스터 후보 (Master Ready)';
    strengthSummary = '최고 수준의 기초 체력을 갖추었습니다. 스퍼트 훈련을 진행합니다.';
  } else if (combinedScore >= 70) {
    level = 4;
    levelTitle = '상급자 (Advanced)';
    strengthSummary = '탄탄한 기본기를 바탕으로 기술 및 페이스 안정화 훈련에 집중합니다.';
  } else if (combinedScore >= 45) {
    level = 3;
    levelTitle = '중급 도전자 (Intermediate)';
    strengthSummary = '기초 동작을 무리 없이 수행할 수 있는 수준입니다. 점진적 과부하 훈련으로 발전시킵니다.';
  } else if (combinedScore >= 25) {
    level = 2;
    levelTitle = '성장 도전자 (Challenger)';
    strengthSummary = '신경계를 깨우고 기초 근지구력을 다지는 안전한 맞춤 점증 드릴이 필요합니다.';
  } else {
    level = 1;
    levelTitle = '입문자 (Beginner)';
    strengthSummary = '현재 상태에 딱 맞춘 기초 단계부터 시작하여 부상 없이 안전하게 체력을 올립니다.';
  }

  return { level, levelTitle, strengthSummary, combinedScore: Math.round(combinedScore), surveyAnswers: answers.surveyAnswers };
}

// ----------------------------------------------------
// 잭 대니얼스 공식 VDOT 5대 페이스 트레이닝 존 & 마라톤 계산기
// (Jack Daniels' Running Formula & Pete Pfitzinger Advanced Marathoning)
// ----------------------------------------------------

export const MARATHON_DISTANCES = [
  { id: 'slow', label: '슬로우조깅 (Zone 2 / 걷뛰)', km: 3.0 },
  { id: '5k', label: '5km (입문 스피드)', km: 5.0 },
  { id: '10k', label: '10km (단거리 레이스)', km: 10.0 },
  { id: 'half', label: '하프 마라톤 (21.1km)', km: 21.0975 },
  { id: 'full', label: '풀코스 마라톤 (42.2km)', km: 42.195 }
];

export const MARATHON_PRESETS_BY_DISTANCE = {
  3.0: [
    { label: '15분', shortLabel: '15분', subLabel: '5:00', distanceKm: 3.0, hours: 0, minutes: 15, pace: '5:00' },
    { label: '20분', shortLabel: '20분', subLabel: '6:40', distanceKm: 3.0, hours: 0, minutes: 20, pace: '6:40' },
    { label: '25분', shortLabel: '25분', subLabel: '8:20', distanceKm: 3.0, hours: 0, minutes: 25, pace: '8:20' },
    { label: '30분', shortLabel: '30분', subLabel: '10:00', distanceKm: 3.0, hours: 0, minutes: 30, pace: '10:00', isDefault: true },
    { label: '완주만', shortLabel: '완주만', subLabel: '11:40', distanceKm: 3.0, hours: 0, minutes: 35, pace: '11:40' }
  ],
  5.0: [
    { label: '20분', shortLabel: '20분', subLabel: '4:00', distanceKm: 5.0, hours: 0, minutes: 20, pace: '4:00' },
    { label: '25분', shortLabel: '25분', subLabel: '5:00', distanceKm: 5.0, hours: 0, minutes: 25, pace: '5:00' },
    { label: '30분', shortLabel: '30분', subLabel: '6:00', distanceKm: 5.0, hours: 0, minutes: 30, pace: '6:00' },
    { label: '35분', shortLabel: '35분', subLabel: '7:00', distanceKm: 5.0, hours: 0, minutes: 35, pace: '7:00', isDefault: true },
    { label: '완주만', shortLabel: '완주만', subLabel: '9:00', distanceKm: 5.0, hours: 0, minutes: 45, pace: '9:00' }
  ],
  10.0: [
    { label: '40분', shortLabel: '40분', subLabel: '4:00', distanceKm: 10.0, hours: 0, minutes: 40, pace: '4:00' },
    { label: '50분', shortLabel: '50분', subLabel: '5:00', distanceKm: 10.0, hours: 0, minutes: 50, pace: '5:00' },
    { label: '60분', shortLabel: '60분', subLabel: '6:00', distanceKm: 10.0, hours: 1, minutes: 0, pace: '6:00', isDefault: true },
    { label: '70분', shortLabel: '70분', subLabel: '7:00', distanceKm: 10.0, hours: 1, minutes: 10, pace: '7:00' },
    { label: '완주만', shortLabel: '완주만', subLabel: '8:30', distanceKm: 10.0, hours: 1, minutes: 25, pace: '8:30' }
  ],
  21.0975: [
    { label: '1시간 30분', shortLabel: '1시간30분', subLabel: '4:16', distanceKm: 21.0975, hours: 1, minutes: 30, pace: '4:16' },
    { label: '1시간 45분', shortLabel: '1시간45분', subLabel: '4:58', distanceKm: 21.0975, hours: 1, minutes: 45, pace: '4:58' },
    { label: '2시간', shortLabel: '2시간', subLabel: '5:41', distanceKm: 21.0975, hours: 2, minutes: 0, pace: '5:41' },
    { label: '2시간 30분', shortLabel: '2시간30분', subLabel: '7:06', distanceKm: 21.0975, hours: 2, minutes: 30, pace: '7:06', isDefault: true },
    { label: '완주만', shortLabel: '완주만', subLabel: '8:03', distanceKm: 21.0975, hours: 2, minutes: 50, pace: '8:03' }
  ],
  42.195: [
    { label: '서브3', shortLabel: '서브3', subLabel: '4:15', distanceKm: 42.195, hours: 3, minutes: 0, pace: '4:15' },
    { label: '3시간 30분', shortLabel: '3시간30분', subLabel: '4:58', distanceKm: 42.195, hours: 3, minutes: 30, pace: '4:58' },
    { label: '4시간', shortLabel: '4시간', subLabel: '5:41', distanceKm: 42.195, hours: 4, minutes: 0, pace: '5:41' },
    { label: '4시간 반', shortLabel: '4시간반', subLabel: '6:23', distanceKm: 42.195, hours: 4, minutes: 30, pace: '6:23', isDefault: true },
    { label: '완주만', shortLabel: '완주만', subLabel: '7:49', distanceKm: 42.195, hours: 5, minutes: 30, pace: '7:49' }
  ]
};

export const MARATHON_PRESETS = MARATHON_PRESETS_BY_DISTANCE[10.0];

export function getPresetsForDistance(km) {
  const roundedKm = Number(km);
  if (roundedKm <= 3.5) return MARATHON_PRESETS_BY_DISTANCE[3.0];
  if (roundedKm <= 6) return MARATHON_PRESETS_BY_DISTANCE[5.0];
  if (roundedKm <= 15) return MARATHON_PRESETS_BY_DISTANCE[10.0];
  if (roundedKm <= 25) return MARATHON_PRESETS_BY_DISTANCE[21.0975];
  return MARATHON_PRESETS_BY_DISTANCE[42.195];
}

// 잭 대니얼스 VDOT 5대 페이스 존 계산 함수
// 기준 페이스(M페이스 또는 목표 페이스)로부터 E, M, T, I, R 페이스를 과학적으로 산출
export function calculateVDOTZones(marathonPaceSec) {
  const mSec = marathonPaceSec || 360; // 기본 6:00

  // 1) E (Easy / 이지런 & 회복주 & LSD): M페이스 + 45~65초 (심폐 지구력 기초, 부상 방지)
  const eSecMin = mSec + 45;
  const eSecMax = mSec + 65;

  // 2) M (Marathon / 마라톤 페이스): 대회 목표 실전 페이스
  const mPaceSec = mSec;

  // 3) T (Threshold / 젖산역치 템포런): M페이스 - 18~24초 (젖산 축적 억제, 20~40분 지속주)
  const tSec = Math.max(160, mSec - 20);

  // 4) I (Interval / VO2max 인터벌): M페이스 - 38~48초 (최대산소섭취량 확장, 800m~1km 반복)
  const iSec = Math.max(140, mSec - 42);

  // 5) R (Repetition / 스피드 & 러닝이코노미): M페이스 - 60~75초 (200m~400m 질주)
  const rSec = Math.max(120, mSec - 65);

  const formatPace = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? '0' : ''}${s}`;
  };

  return {
    easy: {
      name: 'E (Easy / 이지 조깅 & LSD)',
      range: `${formatPace(eSecMin)} ~ ${formatPace(eSecMax)} / km`,
      sec: eSecMin,
      purpose: '심폐 모세혈관 확장, 유산소 기초 체력 & 부상 방지 회복주',
      hrZone: '최대심박 65~78% (대화 가능한 편안한 강도)'
    },
    marathon: {
      name: 'M (Marathon / 마라톤 레이스 페이스)',
      pace: `${formatPace(mPaceSec)} / km`,
      sec: mPaceSec,
      purpose: '대회 실전 감각, 글리코겐 절약 및 페이스 배분 훈련',
      hrZone: '최대심박 80~88% (대회 지속 가능 강도)'
    },
    threshold: {
      name: 'T (Threshold / 젖산역치 템포런)',
      pace: `${formatPace(tSec)} / km`,
      sec: tSec,
      purpose: '젖산 역치점 상향, 젖산 제거 능력 및 심폐 한계 돌파',
      hrZone: '최대심박 88~92% (기분 좋은 고통, 20~40분 지속)'
    },
    interval: {
      name: 'I (Interval / VO2max 인터벌)',
      pace: `${formatPace(iSec)} / km`,
      sec: iSec,
      purpose: '최대산소섭취량(VO2max) 극대화, 800m~1000m 반복 주파',
      hrZone: '최대심박 95~100% (고강도 전력 질주 후 불완전 휴식)'
    },
    repetition: {
      name: 'R (Repetition / 러닝 이코노미 질주)',
      pace: `${formatPace(rSec)} / km`,
      sec: rSec,
      purpose: '러닝 폼 및 착지 효율 개선, 신경근 협응력 질주 (200~400m)',
      hrZone: '무산소 전력 질주 (완전 휴식 병행)'
    }
  };
}

// 거리 & 총 시간(초) 기반 1km당 페이스 계산
export function calculatePaceFromTime(distanceKm, totalSeconds) {
  if (!distanceKm || distanceKm <= 0 || !totalSeconds || totalSeconds <= 0) return { paceStr: '0:00', paceSec: 0 };
  const paceSec = Math.round(totalSeconds / distanceKm);
  const pMin = Math.floor(paceSec / 60);
  const pSec = paceSec % 60;
  return {
    paceStr: `${pMin}:${pSec < 10 ? '0' : ''}${pSec}`,
    paceSec
  };
}

// 거리 & 페이스(초) 기반 총 완주 시간 계산
export function calculateTimeFromPace(distanceKm, paceSec) {
  if (!distanceKm || distanceKm <= 0 || !paceSec || paceSec <= 0) return { hours: 0, minutes: 0, seconds: 0, totalSec: 0, timeStr: '0분' };
  const totalSec = Math.round(distanceKm * paceSec);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  
  let timeStr = '';
  if (hours > 0) timeStr += `${hours}시간 `;
  timeStr += `${minutes}분`;
  if (seconds > 0) timeStr += ` ${seconds}초`;

  return { hours, minutes, seconds, totalSec, timeStr };
}

// 생체역학적 세계 신기록 & 물리적 한계 가드레일 검증
export function validateMarathonSafety(distanceKm, totalSeconds) {
  if (!distanceKm || !totalSeconds) return { isValid: true };

  // 풀코스(42.195km) 검증
  if (distanceKm >= 40) {
    if (totalSeconds < 7200) { // 2시간 00분 미만
      return {
        isValid: false,
        errorType: 'impossible_world_record',
        message: '🛑 풀코스(42.195km) 2시간 미만은 인류 한계를 넘어서는 비현실적 목표입니다. (세계 신기록: 2시간 00분 35초)'
      };
    }
    if (totalSeconds < 7800) { // 2시간 10분 미만
      return {
        isValid: false,
        errorType: 'extreme_elite_limit',
        message: '⚠️ 풀코스 2시간 10분 미만은 올림픽 국가대표 최상위권 영역입니다. 일반 마스터즈 최고 목표로 [서브 2.5 (2시간 29분)]을 권장합니다.'
      };
    }
  }

  // 10km 검증
  if (distanceKm >= 9.5 && distanceKm <= 10.5) {
    if (totalSeconds < 1620) { // 27분 미만
      return {
        isValid: false,
        errorType: 'impossible_world_record',
        message: '🛑 10km 27분 미만은 세계 신기록(26분 24초)에 근접하는 수치로 입력이 불가합니다.'
      };
    }
  }

  // 5km 검증
  if (distanceKm >= 4.5 && distanceKm <= 5.5) {
    if (totalSeconds < 780) { // 13분 미만
      return {
        isValid: false,
        errorType: 'impossible_world_record',
        message: '🛑 5km 13분 미만은 세계 신기록(12분 35초) 영역입니다.'
      };
    }
  }

  return { isValid: true };
}

// 목표 달성을 위해 갖춰야 할 필수 운동능력(Capability Gap) 역산 엔진
export function calculateRequiredCapabilities(goal, userSurveyAnswers = {}) {
  const distanceKm = Number(goal.distanceKm || 10);
  const targetPaceStr = goal.targetPace || '6:00';
  const targetTimeMin = Number(goal.targetTimeMin || 60);

  // 현재 사용자 능력 추출
  const currentPaceSec = userSurveyAnswers.run_current_pace?.paceSec || 485; // 기본 8분 05초
  const currentMaxDist = userSurveyAnswers.run_distance?.value || 2.5; // 기본 2.5km
  const currentSquat = userSurveyAnswers.squat_current_reps?.value || 12; // 기본 12개
  const currentPlank = userSurveyAnswers.plank_seconds?.value || 30; // 기본 30초

  // 목표 페이스(초) 계산
  const parts = targetPaceStr.split(':');
  const targetPaceSec = (parseInt(parts[0], 10) * 60) + (parseInt(parts[1] || '0', 10));

  // 필요 운동능력 계산 (목표 스피드 & 지구력에 따른 역산)
  const isFullCourse = distanceKm >= 40;
  const isSub3 = isFullCourse && targetPaceSec <= 255; // 4:15 이하
  const isSub25 = isFullCourse && targetPaceSec <= 213; // 3:33 이하
  const isElite10k = !isFullCourse && targetPaceSec <= 210; // 3:30 이하 (10km 35분 미만)

  let req1kPace = `${Math.floor((targetPaceSec - 25) / 60)}:${(targetPaceSec - 25) % 60 < 10 ? '0' : ''}${(targetPaceSec - 25) % 60}`;
  let req10kRecord = isFullCourse ? (isSub3 ? '38분 미만 (3:48 페이스)' : isSub25 ? '32분 미만 (3:12 페이스)' : '48분 미만') : `${targetTimeMin}분 완주`;
  let reqLSD = isFullCourse ? (isSub3 ? '30~35km (4분 30초 페이스 유지)' : '25~30km 지속 완주') : '7~8km 지속주';
  let reqSquat = isSub25 ? '70회 이상' : isSub3 ? '50회 이상' : isElite10k ? '40회 이상' : '25회 이상';
  let reqPlank = isSub3 ? '90초 이상' : '60초 이상';
  let reqWeeklyMileage = isSub25 ? '주당 100~130 km' : isSub3 ? '주당 70~90 km' : isFullCourse ? '주당 40~60 km' : '주당 20~30 km';
  let reqBuildUpWeeks = isSub3 ? (currentPaceSec >= 420 ? 36 : 24) : (currentPaceSec - targetPaceSec > 100 ? 16 : 8);

  const isCurrentCapable = (currentPaceSec <= targetPaceSec + 20) && (currentMaxDist >= (isFullCourse ? 25 : distanceKm * 0.7));

  // 목표 거리에 맞춤화된 단계별 마일스톤 생성
  let milestoneTimeline = [];

  if (distanceKm <= 3.5) {
    // 3km 슬로우조깅
    milestoneTimeline = [
      { step: 1, period: '1~2주차', title: '걷뛰 1.5km 적응', targetMetric: '1.5km 지속', focus: '올바른 착지 자세 & 호흡법', status: '기초 적응' },
      { step: 2, period: '3~4주차', title: '2.5km 지속 달리기', targetMetric: '2.5km 완주', focus: '무릎 충격 없는 부드러운 조깅', status: '거리 확장' },
      { step: 3, period: '5~6주차', title: '3km 완주 도전', targetMetric: `3km ${targetTimeMin}분 (${targetPaceStr}/km)`, focus: '3km 목표 완주 성공', status: '목표 달성' }
    ];
  } else if (distanceKm <= 6.0) {
    // 5km
    milestoneTimeline = [
      { step: 1, period: '1~2주차', title: '3km 안정 완주', targetMetric: '3km 지속주', focus: '기초 심폐 지구력 형성', status: '기초 적응' },
      { step: 2, period: '3~4주차', title: '4km 거리 적응', targetMetric: '4km 지속주', focus: '일정한 템포 페이스 유지', status: '거리 확장' },
      { step: 3, period: '5~6주차', title: '5km 목표 달성', targetMetric: `5km ${targetTimeMin}분 (${targetPaceStr}/km)`, focus: '5km 완벽 완주 성공', status: '목표 달성' }
    ];
  } else if (distanceKm <= 15.0) {
    // 10km (단독 목표)
    milestoneTimeline = [
      { step: 1, period: '1~3주차', title: '5km 베이스 빌드업', targetMetric: '5km 30분 내외', focus: '기초 유산소 & 하체 보강', status: '기초 다지기' },
      { step: 2, period: '4~6주차', title: '7km 템포런 적응', targetMetric: '7km 지속주', focus: '젖산 역치 스피드 지구력', status: '스피드 향상' },
      { step: 3, period: '7~8주차', title: '9km 거리 확장 (LSD)', targetMetric: '9km 장거리 완주', focus: '장거리 지속력 & 코어 안정', status: '장거리 적응' },
      { step: 4, period: `${reqBuildUpWeeks}주차`, title: '10km 목표 완주', targetMetric: `10km ${targetTimeMin}분 (${targetPaceStr}/km)`, focus: '대회 실전 페이스 완주 성공!', status: '목표 달성' }
    ];
  } else if (distanceKm <= 25.0) {
    // 하프 마라톤
    milestoneTimeline = [
      { step: 1, period: '1~4주차', title: '10km 안정 완주', targetMetric: '10km 주파', focus: '기초 유산소 지구력', status: '기초 다지기' },
      { step: 2, period: '5~8주차', title: '15km 중장거리 LSD', targetMetric: '15km 지속주', focus: '중장거리 페이스 배분', status: '거리 확장' },
      { step: 3, period: '9~12주차', title: '18km 실전 시뮬레이션', targetMetric: '18km 빌드업', focus: '에너지 보충 & 피로 극복', status: '실전 대비' },
      { step: 4, period: `${reqBuildUpWeeks}주차`, title: '21.1km 하프 완주', targetMetric: `하프 ${targetTimeMin}분 (${targetPaceStr}/km)`, focus: '하프 피니셔 등극!', status: '목표 달성' }
    ];
  } else {
    // 풀코스 마라톤
    milestoneTimeline = [
      { step: 1, period: '1단계 (12주차)', title: '10km 베이스 구축', targetMetric: '10km 안정 완주', focus: '기초 유산소 & 관절 보강', status: '기초 다지기' },
      { step: 2, period: '2단계 (24주차)', title: '21.1km 하프 주파', targetMetric: '하프 마라톤 완주', focus: '15~18km LSD 적응', status: '중거리 돌파' },
      { step: 3, period: '3단계 (36주차)', title: '30km LSD 장거리 벽 돌파', targetMetric: '30km 장거리 지속', focus: '30km 사점 극복 & 카보로딩', status: '장거리 완성' },
      { step: 4, period: '4단계 (48주차)', title: '42.195km 풀코스 완주', targetMetric: `풀코스 ${Math.floor(targetTimeMin / 60)}시간 ${targetTimeMin % 60}분`, focus: '마라톤 피니셔 등극!', status: '목표 달성' }
    ];
  }

  // 잭 대니얼스 VDOT 5대 트레이닝 존 산출
  const vdotZones = calculateVDOTZones(targetPaceSec);
  const currentVdotZones = calculateVDOTZones(currentPaceSec);

  return {
    isCurrentCapable,
    targetPaceStr,
    currentPaceStr: `${Math.floor(currentPaceSec / 60)}:${currentPaceSec % 60 < 10 ? '0' : ''}${currentPaceSec % 60}`,
    gapSec: currentPaceSec - targetPaceSec,
    milestoneTimeline,
    vdotZones,
    currentVdotZones,
    requirements: {
      req1kPace: `${req1kPace} / km`,
      req10kRecord,
      reqLSD,
      reqSquat,
      reqPlank,
      reqWeeklyMileage,
      reqBuildUpWeeks: `${reqBuildUpWeeks}주`
    },
    advisoryText: isCurrentCapable
      ? '현재 체력으로 무리 없이 달성 가능한 목표입니다.'
      : `목표 달성을 위해 단계별(${reqBuildUpWeeks}주)로 주행 거리와 페이스를 체계적으로 빌드업합니다.`
  };
}

// 스케줄 및 동적 적응형(Adaptive) 로드맵 생성 엔진
export function generateTrainingRoadmap({
  goal,
  userLevel,
  scheduleMode,
  targetDate,
  dailyMinutes,
  daysPerWeek
}) {
  const category = goal.category === 'strength' ? 'strength' : 'running';
  const level = userLevel.level || 1;
  const surveyAnswers = userLevel.surveyAnswers || {};
  
  // 50대 이상 여부 확인
  const isSenior = surveyAnswers.user_age_group === 0;

  let totalWeeks = 6;
  let dailyTime = dailyMinutes || 35;
  let weeklyFrequency = isSenior ? Math.min(3, daysPerWeek || 3) : (daysPerWeek || 3);
  let estimatedDaysToTarget = 42;

  let safetyAdvisory = null;

  // 필요 운동능력 역산 분석 수행
  const capabilityAnalysis = calculateRequiredCapabilities(goal, surveyAnswers);

  // 1. 기간 및 시간 계산
  if (scheduleMode === 'deadline' && targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.max(7, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const remainingWeeks = Math.max(1, Math.round(diffDays / 7));
    
    totalWeeks = remainingWeeks;
    estimatedDaysToTarget = diffDays;
    dailyTime = isSenior ? 30 : Math.min(65, Math.max(25, Math.round(dailyTime)));

    const currentPaceSeconds = 485;
    const achievableSecReduction = Math.min(80, remainingWeeks * 9); 
    const predictedPaceSec = Math.max(348, currentPaceSeconds - achievableSecReduction);
    const pMin = Math.floor(predictedPaceSec / 60);
    const pSec = predictedPaceSec % 60;
    const predictedTotalMin = Math.round((predictedPaceSec * 10) / 60);

    const isUnrealisticShort = remainingWeeks < 12 && isSenior;

    safetyAdvisory = {
      type: isUnrealisticShort ? 'realistic_prediction' : 'normal',
      title: isUnrealisticShort ? '🎯 D-Day 안전 최대 단축 목표 제시' : '🛡️ 맞춤 페이싱 안내',
      message: isUnrealisticShort
        ? `남은 ${remainingWeeks}주 동안 무리 없이 달성 가능한 1안 안전 목표는 [10km ${predictedTotalMin}분 완주 (페이스 ${pMin}분 ${pSec}초/km)]입니다.`
        : `남은 ${remainingWeeks}주 동안 점진적으로 페이스를 빌드업합니다.`,
      predictedPace: `${pMin}:${pSec < 10 ? '0' : ''}${pSec} / km`,
      predictedTotalTime: `${predictedTotalMin}분`,
      remainingWeeks
    };
  }

  const targetDistKm = Number(goal.distanceKm) || 10;
  let distTitle = `${targetDistKm}km`;
  if (targetDistKm <= 3.5) distTitle = '슬로우조깅';
  else if (targetDistKm >= 40) distTitle = '풀코스';
  else if (targetDistKm >= 20) distTitle = '하프 마라톤';
  else if (targetDistKm >= 4.5 && targetDistKm <= 5.5) distTitle = '5km';

  const timeLabel = `${goal.hours > 0 ? `${goal.hours}시간 ` : ''}${goal.minutes > 0 ? `${goal.minutes}분 ` : (goal.hours > 0 ? '' : '60분')}`.trim();

  // 1안 (D-Day 단기 속성 필승도전 플랜: D-Day 주차 기준, 예: 6주)
  const challengeWeeks = totalWeeks;
  const challengeDays = estimatedDaysToTarget;
  const challengePhases = createAdaptivePhases(category, level, challengeWeeks, dailyTime, surveyAnswers, isSenior, false, targetDistKm, goal);

  // 2안 (적정기간 표준 주기화 플랜: 12주 / 시니어 14주)
  const moderateWeeksNeeded = Math.max(challengeWeeks, isSenior ? 14 : 12);
  const moderateDaysNeeded = moderateWeeksNeeded * 7;
  const moderatePhases = createAdaptivePhases(category, level, moderateWeeksNeeded, dailyTime, surveyAnswers, isSenior, true, targetDistKm, goal);

  // 3안 (초보 안심 여유완주 플랜: 가장 긴 16주 / 시니어 20주로 부상 없이 점진적 빌드업)
  const comfortWeeksNeeded = Math.max(moderateWeeksNeeded + 4, isSenior ? 20 : 16);
  const comfortDaysNeeded = comfortWeeksNeeded * 7;
  const comfortPhases = createAdaptivePhases(category, level, comfortWeeksNeeded, 25, surveyAnswers, true, false, targetDistKm, goal);

  const weightProps = {
    includeWeightGoal: goal.includeWeightGoal || false,
    currentWeight: goal.currentWeight || 75,
    targetWeight: goal.targetWeight || 70
  };

  const plan1 = {
    id: 'plan1',
    name: '1안: 필승도전 플랜',
    badge: `${challengeWeeks}주 필승도전`,
    totalWeeks: challengeWeeks,
    estimatedDaysToTarget: challengeDays,
    targetDate: scheduleMode === 'deadline' ? targetDate : getFutureDateString(challengeDays),
    targetGoal: safetyAdvisory?.predictedTotalTime ? `${distTitle} ${safetyAdvisory.predictedTotalTime} 완주 (${safetyAdvisory.predictedPace})` : `${distTitle} ${timeLabel} D-Day 필승 완주`,
    phases: challengePhases,
    weeklySchedule: createWeeklyScheduleTemplate(category, weeklyFrequency, dailyTime, isSenior),
    weeksChecklist: generateDetailedWeeklyChecklists(category, challengeWeeks, isSenior, false, surveyAnswers),
    ...weightProps
  };

  const plan2 = {
    id: 'plan2',
    name: '2안: 적정기간 완성 플랜',
    badge: `${moderateWeeksNeeded}주 적정기간 ★`,
    totalWeeks: moderateWeeksNeeded,
    estimatedDaysToTarget: moderateDaysNeeded,
    targetDate: getFutureDateString(moderateDaysNeeded),
    targetGoal: `${distTitle} ${timeLabel} 안정 완주 (표준 주기화)`,
    phases: moderatePhases,
    weeklySchedule: createWeeklyScheduleTemplate(category, weeklyFrequency, dailyTime, isSenior),
    weeksChecklist: generateDetailedWeeklyChecklists(category, moderateWeeksNeeded, isSenior, true, surveyAnswers),
    ...weightProps
  };

  const plan3 = {
    id: 'plan3',
    name: '3안: 초보안심 여유완주 플랜',
    badge: `${comfortWeeksNeeded}주 여유완주`,
    totalWeeks: comfortWeeksNeeded,
    estimatedDaysToTarget: comfortDaysNeeded,
    targetDate: getFutureDateString(comfortDaysNeeded),
    targetGoal: `${distTitle} 안전 완주 (초보자 무릎 관절 보호 슬로우 조깅)`,
    phases: comfortPhases,
    weeklySchedule: createWeeklyScheduleTemplate(category, 2, 25, true),
    weeksChecklist: generateDetailedWeeklyChecklists(category, comfortWeeksNeeded, true, false, surveyAnswers),
    ...weightProps
  };

  return {
    category,
    scheduleMode,
    totalWeeks,
    dailyTime,
    weeklyFrequency,
    estimatedDaysToTarget,
    isSenior,
    safetyAdvisory,
    capabilityAnalysis,
    targetDate: scheduleMode === 'deadline' ? targetDate : getFutureDateString(estimatedDaysToTarget),
    phases: moderatePhases,
    weeklySchedule: createWeeklyScheduleTemplate(category, weeklyFrequency, dailyTime, isSenior),
    coachAdvice: getCoachAdvice(category, level, scheduleMode, isSenior),
    plans: { plan1, plan2, plan3 }
  };
}

// 실천율 및 완료 데이터 기반 동적 예측 궤적(Forecast Trajectory) 계산 함수
export function calculateForecastTrajectory(plan, completedTasks = {}, customOverrides = {}, workoutLogs = {}) {
  if (!plan || !plan.weeksChecklist) {
    return {
      completionRate: 0,
      forecastStatus: 'on_track',
      predictedFinishMin: 72,
      predictedFinishPace: '7:12 / km',
      predictedDate: plan?.targetDate || '2026-10-18',
      achievementProbability: 85,
      graphData: []
    };
  }

  const totalWeeks = plan.totalWeeks || 6;
  const initialTimeMin = 80; // 기준 시작 완주 시간 (약 8분 페이스)
  
  let targetTimeMin = 72;
  const match = plan.targetGoal?.match(/(\d+)분/);
  if (match) targetTimeMin = parseInt(match[1], 10);
  else if (plan.id === 'plan2') targetTimeMin = 60;

  let totalTasks = 0;
  let totalCompleted = 0;
  const weekStats = [];
  const weekLoggedPaces = {}; // week -> avg pace sec per km

  plan.weeksChecklist.forEach(w => {
    let wTasks = 0;
    let wDone = 0;
    let wLoggedSecs = 0;
    let wLoggedCount = 0;

    w.days?.forEach(d => {
      d.tasks?.forEach(t => {
        wTasks++;
        if (completedTasks[t.id] || workoutLogs[t.id]) wDone++;

        if (workoutLogs[t.id]) {
          const log = workoutLogs[t.id];
          if (log.distanceKm > 0 && log.totalSeconds > 0) {
            const secPerKm = log.totalSeconds / log.distanceKm;
            wLoggedSecs += secPerKm;
            wLoggedCount++;
          }
        }
      });
    });

    totalTasks += wTasks;
    totalCompleted += wDone;

    if (wLoggedCount > 0) {
      weekLoggedPaces[w.weekNumber] = Math.round(wLoggedSecs / wLoggedCount);
    }

    weekStats.push({
      weekNumber: w.weekNumber,
      total: wTasks,
      done: wDone,
      rate: wTasks > 0 ? (wDone / wTasks) : 0
    });
  });

  const overallRate = totalTasks > 0 ? (totalCompleted / totalTasks) : 0;
  
  let currentActiveWeek = 1;
  for (let i = 0; i < weekStats.length; i++) {
    if (weekStats[i].done > 0) {
      currentActiveWeek = i + 1;
    }
  }

  let paceFactor = 1.0;
  let forecastStatus = 'on_track'; // 'ahead' | 'on_track' | 'behind'
  let achievementProbability = 85;

  if (totalCompleted === 0) {
    paceFactor = 1.0;
    forecastStatus = 'on_track';
    achievementProbability = 80;
  } else if (overallRate >= 0.75 || (weekStats[0] && weekStats[0].rate >= 0.8)) {
    paceFactor = 1.15;
    forecastStatus = 'ahead';
    achievementProbability = Math.min(98, 88 + Math.round(overallRate * 10));
  } else if (overallRate <= 0.35) {
    paceFactor = 0.75;
    forecastStatus = 'behind';
    achievementProbability = Math.max(35, 75 - Math.round((0.5 - overallRate) * 70));
  }

  let predictedFinishMin = targetTimeMin;
  if (forecastStatus === 'ahead') {
    predictedFinishMin = Math.max(58, targetTimeMin - Math.round((targetTimeMin - 58) * 0.35 * overallRate + 2));
  } else if (forecastStatus === 'behind') {
    predictedFinishMin = Math.min(85, targetTimeMin + Math.round((85 - targetTimeMin) * 0.45 * (1 - overallRate)));
  }

  const predSecPerKm = Math.round((predictedFinishMin * 60) / 10);
  const pMin = Math.floor(predSecPerKm / 60);
  const pSec = predSecPerKm % 60;
  const predictedFinishPace = `${pMin}:${pSec < 10 ? '0' : ''}${pSec} / km`;

  const graphPoints = [];
  graphPoints.push({
    week: 0,
    label: '시작 (0주)',
    plannedTime: initialTimeMin,
    actualTime: initialTimeMin,
    forecastTime: initialTimeMin
  });

  for (let w = 1; w <= totalWeeks; w++) {
    const ratio = w / totalWeeks;
    const planned = Math.round(initialTimeMin - (initialTimeMin - targetTimeMin) * ratio);

    let actual = null;
    if (w <= currentActiveWeek && totalCompleted > 0) {
      if (weekLoggedPaces[w]) {
        // 실제 기록된 페이스 기반 완주 환산 시간 (10km 기준 분)
        actual = Math.round((weekLoggedPaces[w] * 10) / 60);
      } else {
        const pastRate = weekStats.slice(0, w).reduce((acc, cur) => acc + cur.done, 0) / 
                         Math.max(1, weekStats.slice(0, w).reduce((acc, cur) => acc + cur.total, 0));
        if (pastRate >= 0.7) {
          actual = Math.round(initialTimeMin - (initialTimeMin - targetTimeMin) * ratio * 1.12);
        } else if (pastRate <= 0.3) {
          actual = Math.round(initialTimeMin - (initialTimeMin - targetTimeMin) * ratio * 0.55);
        } else {
          actual = planned;
        }
      }
    }

    let forecast = planned;
    if (w >= currentActiveWeek) {
      const remainingRatio = (w - currentActiveWeek) / Math.max(1, totalWeeks - currentActiveWeek);
      const startForecast = actual !== null ? actual : planned;
      forecast = Math.round(startForecast - (startForecast - predictedFinishMin) * remainingRatio);
    } else {
      forecast = actual;
    }

    graphPoints.push({
      week: w,
      label: `${w}주차`,
      plannedTime: planned,
      actualTime: actual,
      forecastTime: forecast
    });
  }

  // 체중 감량 연동 궤적 계산
  const includeWeightGoal = plan.includeWeightGoal || false;
  const startWeight = plan.currentWeight || 75;
  const targetWeight = plan.targetWeight || 70;
  const weightGraphPoints = [];

  if (includeWeightGoal) {
    weightGraphPoints.push({
      week: 0,
      label: '시작 (0주)',
      plannedWeight: startWeight,
      actualWeight: startWeight,
      forecastWeight: startWeight
    });

    const totalWeightLoss = startWeight - targetWeight;
    let predictedFinalWeight = targetWeight;
    if (forecastStatus === 'ahead') {
      predictedFinalWeight = Number((targetWeight - totalWeightLoss * 0.15).toFixed(1));
    } else if (forecastStatus === 'behind') {
      predictedFinalWeight = Number((targetWeight + totalWeightLoss * 0.45 * (1 - overallRate)).toFixed(1));
    }

    for (let w = 1; w <= totalWeeks; w++) {
      const ratio = w / totalWeeks;
      const plannedW = Number((startWeight - totalWeightLoss * ratio).toFixed(1));

      let actualW = null;
      if (w <= currentActiveWeek && totalCompleted > 0) {
        const pastRate = weekStats.slice(0, w).reduce((acc, cur) => acc + cur.done, 0) /
                         Math.max(1, weekStats.slice(0, w).reduce((acc, cur) => acc + cur.total, 0));
        if (pastRate >= 0.7) {
          actualW = Number((startWeight - totalWeightLoss * ratio * 1.15).toFixed(1));
        } else if (pastRate <= 0.3) {
          actualW = Number((startWeight - totalWeightLoss * ratio * 0.4).toFixed(1));
        } else {
          actualW = plannedW;
        }
      }

      let forecastW = plannedW;
      if (w >= currentActiveWeek) {
        const remainingRatio = (w - currentActiveWeek) / Math.max(1, totalWeeks - currentActiveWeek);
        const startForecastW = actualW !== null ? actualW : plannedW;
        forecastW = Number((startForecastW - (startForecastW - predictedFinalWeight) * remainingRatio).toFixed(1));
      } else {
        forecastW = actualW;
      }

      weightGraphPoints.push({
        week: w,
        label: `${w}주차`,
        plannedWeight: plannedW,
        actualWeight: actualW,
        forecastWeight: forecastW
      });
    }
  }

  let extraWeeksNeeded = 0;
  if (forecastStatus === 'behind') {
    extraWeeksNeeded = Math.round((predictedFinishMin - targetTimeMin) / 2);
  }

  return {
    overallRate: Math.round(overallRate * 100),
    forecastStatus,
    targetTimeMin,
    predictedFinishMin,
    predictedFinishPace,
    extraWeeksNeeded,
    achievementProbability,
    currentActiveWeek,
    graphPoints,
    includeWeightGoal,
    startWeight,
    targetWeight,
    predictedFinalWeight: includeWeightGoal ? (weightGraphPoints[weightGraphPoints.length - 1]?.forecastWeight || targetWeight) : null,
    weightGraphPoints
  };
}

// 6주~16주간의 주차별/일자별 상세 운동 체크리스트 생성기 (사용자 실측 baseline 연동)
function generateDetailedWeeklyChecklists(category, totalWeeks, isSenior, isMaster, surveyAnswers = {}) {
  const weeksList = [];
  const daysOfWeek = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  // 사용자 설문 기반 시작 기준값 추출
  const distOptMap = [1.0, 2.5, 5.0, 8.0];
  const userStartDist = distOptMap[surveyAnswers.run_distance] || 2.5;

  // 2) 달리기 시작 페이스 (초)
  const paceOptMap = [525, 485, 440, 390, 340]; // 8:45, 8:05, 7:20, 6:30, 5:40
  const userStartPaceSec = paceOptMap[surveyAnswers.run_current_pace] || 485;

  // 3) 스쿼트 시작 개수 (설문값: 6개, 12개, 20개, 30개)
  const squatOptMap = [8, 12, 20, 30];
  const userStartSquat = squatOptMap[surveyAnswers.squat_current_reps] || 12;

  // 4) 다리들기 시작 개수 (설문값: 5개, 10개, 18개)
  const legOptMap = [6, 10, 18];
  const userStartLegRaise = legOptMap[surveyAnswers.legraise_current_reps] || 10;

  // 5) 플랭크 시작 초 (설문값: 15초, 30초, 60초)
  const plankOptMap = [15, 30, 60];
  const userStartPlank = plankOptMap[surveyAnswers.plank_seconds] || 25;

  for (let w = 1; w <= totalWeeks; w++) {
    const progressRatio = w / totalWeeks;
    
    // 달리기 거리 점증 (사용자 시작 거리 ~ 10.0km)
    let distKm = Math.min(10.0, userStartDist + progressRatio * (10.0 - userStartDist)).toFixed(1);
    if (distKm < 2.0) distKm = 2.0;

    // 페이스 점증 (사용자 시작 페이스 -> 목표 페이스)
    const targetEndPaceSec = isMaster ? 350 : (isSenior ? 432 : 360); // 5:50 or 7:12
    const currentPaceSec = Math.round(userStartPaceSec - progressRatio * (userStartPaceSec - targetEndPaceSec));
    const pMin = Math.floor(currentPaceSec / 60);
    const pSec = currentPaceSec % 60;
    const paceStr = `${pMin}:${pSec < 10 ? '0' : ''}${pSec} / km`;

    // 근력 운동 점증 (사용자 현재 실측치 기반)
    const squatReps = Math.min(30, Math.round(userStartSquat + progressRatio * (userStartSquat * 0.7)));
    const legRaiseReps = Math.min(25, Math.round(userStartLegRaise + progressRatio * (userStartLegRaise * 0.6)));
    const plankSec = Math.min(60, Math.round(userStartPlank + progressRatio * 25));

    const daysData = daysOfWeek.map((dayName, dIdx) => {
      const isWorkout = (dIdx === 0 || dIdx === 2 || dIdx === 5); // 월, 수, 토
      const dayKey = `w${w}_d${dIdx}`;

      if (isWorkout) {
        if (dIdx === 0) {
          // 월요일: 조깅 + 하체
          return {
            dayKey,
            dayName,
            isWorkout: true,
            theme: '🏃 조깅 & 하체 보강',
            tasks: [
              { id: `${dayKey}_t1`, category: '달리기', text: `이지 조깅 ${distKm}km (${paceStr}/km)`, isDone: false },
              { id: `${dayKey}_t2`, category: '근력', text: `스쿼트 ${squatReps}회 x 3세트`, isDone: false },
              { id: `${dayKey}_t3`, category: '근력', text: `카프레이즈 ${legRaiseReps + 5}회 x 3세트`, isDone: false },
              { id: `${dayKey}_t4`, category: '복근', text: `코어 플랭크 ${plankSec}초 x 3세트`, isDone: false },
              { id: `${dayKey}_t5`, category: '회복', text: `폼롤러 스트레칭 10분`, isDone: false }
            ]
          };
        } else if (dIdx === 2) {
          // 수요일: 템포런 & 코어
          const midDist = Math.max(2.0, (distKm * 0.8)).toFixed(1);
          return {
            dayKey,
            dayName,
            isWorkout: true,
            theme: '⚡ 템포런 & 코어',
            tasks: [
              { id: `${dayKey}_t1`, category: '달리기', text: `템포런 ${midDist}km 지속주`, isDone: false },
              { id: `${dayKey}_t2`, category: '근력', text: `와이드 스쿼트 ${squatReps}회 x 3세트`, isDone: false },
              { id: `${dayKey}_t3`, category: '근력', text: `레그레이즈 ${legRaiseReps}회 x 3세트`, isDone: false },
              { id: `${dayKey}_t4`, category: '복근', text: `버드독 ${Math.min(12, squatReps)}회 x 3세트`, isDone: false },
              { id: `${dayKey}_t5`, category: '회복', text: `고관절 스트레칭 10분`, isDone: false }
            ]
          };
        } else {
          // 토요일: 장거리 LSD
          return {
            dayKey,
            dayName,
            isWorkout: true,
            theme: '🏆 주말 장거리 LSD',
            tasks: [
              { id: `${dayKey}_t1`, category: '달리기', text: `장거리 LSD ${distKm}km 완주`, isDone: false },
              { id: `${dayKey}_t2`, category: '근력', text: `런지 ${Math.max(6, legRaiseReps - 2)}회 x 3세트`, isDone: false },
              { id: `${dayKey}_t3`, category: '근력', text: `덩키킥 ${legRaiseReps}회 x 3세트`, isDone: false },
              { id: `${dayKey}_t4`, category: '복근', text: `사이드 플랭크 좌우 25초 x 3세트`, isDone: false },
              { id: `${dayKey}_t5`, category: '회복', text: `발바닥 & 종아리 마사지 10분`, isDone: false }
            ]
          };
        }
      } else {
        // 휴식일
        return {
          dayKey,
          dayName,
          isWorkout: false,
          theme: '🌿 관절 회복 & 휴식',
          tasks: [
            { id: `${dayKey}_t1`, category: '회복', text: '가벼운 산책 20분 또는 폼롤러', isDone: false },
            { id: `${dayKey}_t2`, category: '영양', text: '충분한 수면 (7시간 이상)', isDone: false }
          ]
        };
      }
    });

    weeksList.push({
      weekNumber: w,
      title: `${w}주차 트레이닝`,
      targetSummary: `${distKm}km 달리기 (${paceStr}) + 하체/코어 보강`,
      days: daysData
    });
  }

  return weeksList;
}

function getFutureDateString(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// 사용자 실제 수치(Pace, Reps, Flexibility) 및 연령대 맞춤형 동적 Phase 생성
// [레퍼런스: Jack Daniels' Running Formula & Pete Pfitzinger Advanced Marathoning]
function createAdaptivePhases(category, level, totalWeeks, dailyMinutes, surveyAnswers, isSenior = false, isMasterFullGoal = false, targetDistKm = 10, goal = {}) {
  const phase1Weeks = Math.max(1, Math.round(totalWeeks * 0.25));
  const phase2Weeks = Math.max(1, Math.round(totalWeeks * 0.35));
  const phase3Weeks = Math.max(1, Math.round(totalWeeks * 0.25));
  const phase4Weeks = Math.max(1, totalWeeks - (phase1Weeks + phase2Weeks + phase3Weeks));

  const p1End = phase1Weeks;
  const p2End = phase1Weeks + phase2Weeks;
  const p3End = phase1Weeks + phase2Weeks + phase3Weeks;

  const targetPaceStr = goal?.targetPace || '6:00';

  // 1. 하프 마라톤 (21.0975km)
  if (targetDistKm >= 20 && targetDistKm <= 25) {
    return [
      {
        phase: 1,
        title: `Phase 1: [기초 유산소 & 관절 적응] Aerobic Base (E페이스 7:30~8:00)`,
        weeks: `1 ~ ${p1End}주차`,
        focus: '하프 도전을 위한 기초 심폐 지구력과 무릎/발목 충격 흡수 근력 빌드업',
        keyWorkouts: [
          'E페이스 편안한 조깅 5~7km (대화 가능한 존)',
          '하체 스쿼트 20회 & 카프레이즈 3세트',
          '달리기 전후 10분 고관절 모빌리티 및 폼롤러'
        ],
        targetGoal: '무릎 부담 없이 7km 지속 완주'
      },
      {
        phase: 2,
        title: `Phase 2: [거리 확장 & 미디엄 롱런] Distance Progression (E~M페이스 6:40~7:10)`,
        weeks: `${p1End + 1} ~ ${p2End}주차`,
        focus: '10km 이상 거리 감각 적응 및 일정한 케이던스(175~180spm) 유지',
        keyWorkouts: [
          '주중 미디엄 런 8~10km',
          '주말 롱런 12~14km (천천히 완주)',
          '코어 플랭크 60초 & 런지 15회 3세트'
        ],
        targetGoal: '12km 지속 주파 & 안정적인 에너지 안배'
      },
      {
        phase: 3,
        title: `Phase 3: [하프 실전 LSD & 템포] Half LSD & Tempo (M페이스 ${targetPaceStr})`,
        weeks: `${p2End + 1} ~ ${p3End}주차`,
        focus: '16~18km LSD 롱런과 목표 페이스 지속주로 하프 완주 능력 완성',
        keyWorkouts: [
          '주말 핵심 롱런(LSD) 16~18km',
          `목표 페이스(${targetPaceStr}) 7km 템포런`,
          '하프 에너지젤 섭취 & 수분 보충 시뮬레이션'
        ],
        targetGoal: '16km LSD 완주 및 젖산 역치 스피드 체득'
      },
      {
        phase: 4,
        title: `Phase 4: [테이퍼링 & 하프 완주] Tapering & Half Finish`,
        weeks: `${p3End + 1} ~ ${totalWeeks}주차`,
        focus: '훈련량 40% 감축으로 다리 피로 회복 및 네거티브 스플릿 완주 전략',
        keyWorkouts: [
          `하프 마라톤(21.1km) 실전 완주 (${targetPaceStr}/km)`,
          'E페이스 가벼운 회복 조깅 4km',
          '카보로딩 및 대회 당일 페이스 배분'
        ],
        targetGoal: `하프 마라톤(21.1km) 완벽 완주 성공!`
      }
    ];
  }

  // 2. 풀코스 마라톤 (42.195km)
  if (targetDistKm >= 40) {
    return [
      {
        phase: 1,
        title: `Phase 1: [기초 유산소 & 장거리 베이스] Base Building (E페이스 7:30~8:00)`,
        weeks: `1 ~ ${p1End}주차`,
        focus: '풀코스를 견디는 심폐 모세혈관 확장과 하체 지지 근력 구축',
        keyWorkouts: [
          'E페이스 조깅 8~10km',
          '하체 스쿼트 25회 & 둔근 브릿지 3세트',
          '주말 15km 기초 롱런'
        ],
        targetGoal: '부상 없는 15km 롱런 안정 주파'
      },
      {
        phase: 2,
        title: `Phase 2: [거리 확장 & 20km 돌파] Mileage Building (M페이스 빌드업)`,
        weeks: `${p1End + 1} ~ ${p2End}주차`,
        focus: '하프 이상 거리 적응 및 지방 대사 효율 극대화',
        keyWorkouts: [
          '주말 핵심 롱런 20~25km (LSD)',
          `M페이스(${targetPaceStr}) 10km 지속주`,
          '에너지젤 보충 타이밍 체득'
        ],
        targetGoal: '25km LSD 완주 및 페이스 안정화'
      },
      {
        phase: 3,
        title: `Phase 3: [30km LSD & 피크 훈련] Peak LSD Simulation`,
        weeks: `${p2End + 1} ~ ${p3End}주차`,
        focus: '30~32km 장거리 시뮬레이션으로 마의 35km 벽 극복 훈련',
        keyWorkouts: [
          '최고 마일리지 롱런 30~32km LSD',
          '글리코겐 고갈 적응 훈련',
          '하체 보강 및 장거리 회복 루틴'
        ],
        targetGoal: '30km 장거리 시뮬레이션 성공'
      },
      {
        phase: 4,
        title: `Phase 4: [3주 테이퍼링 & 풀코스 완주] Peak Race Execution`,
        weeks: `${p3End + 1} ~ ${totalWeeks}주차`,
        focus: '훈련량 단계적 감축(60%->40%)으로 최상의 컨디션 피킹',
        keyWorkouts: [
          `풀코스(42.195km) 실전 완주 (${targetPaceStr}/km)`,
          'E페이스 가벼운 회복 조깅 4km',
          '철저한 카보로딩 & 대회 당일 페이스 전략'
        ],
        targetGoal: `풀코스 마라톤(42.195km) 영광의 완주 달성!`
      }
    ];
  }

  // 3. 슬로우조깅 & 3km
  if (targetDistKm <= 3.5) {
    return [
      {
        phase: 1,
        title: `Phase 1: [걷뛰 인터벌 & 관절 적응] Walk-Run Interval`,
        weeks: `1 ~ ${p1End}주차`,
        focus: '숨차지 않는 편안한 걷기-조깅 1:1 인터벌로 무릎/발목 적응',
        keyWorkouts: ['걷기 2분 + 슬로우조깅 2분 x 5회 (총 20분)', '종아리 스트레칭 & 발바닥 릴리즈'],
        targetGoal: '통증 없이 20분 걷뛰 완료'
      },
      {
        phase: 2,
        title: `Phase 2: [슬로우 조깅 지속] 2km Continuous Run`,
        weeks: `${p1End + 1} ~ ${p2End}주차`,
        focus: '심박수 Zone 2(110~130bpm)를 유지하며 쉬지 않고 15~20분 달리기',
        keyWorkouts: ['슬로우 조깅 2km (대화 가능한 페이스)', '맨몸 스쿼트 15회 x 2세트'],
        targetGoal: '2km 쉬지 않고 완주'
      },
      {
        phase: 3,
        title: `Phase 3: [3km 지속 완주] 3km Aerobic Jogging`,
        weeks: `${p2End + 1} ~ ${p3End}주차`,
        focus: '일정한 보폭과 가벼운 발구름으로 3km 완주 체력 형성',
        keyWorkouts: ['슬로우 조깅 3km 지속주', '코어 플랭크 30초 & 스트레칭'],
        targetGoal: '3km 25~30분 안정 주파'
      },
      {
        phase: 4,
        title: `Phase 4: [건강한 러닝 습관 완성] Habit & Mastery`,
        weeks: `${p3End + 1} ~ ${totalWeeks}주차`,
        focus: '피로감 없는 지속 가능한 평생 달리기 습관 완성',
        keyWorkouts: ['3km 기분 좋은 슬로우 조깅', '충분한 수면과 영양 섭취'],
        targetGoal: '3km 슬로우 조깅 마스터 달성!'
      }
    ];
  }

  // 4. 5km
  if (targetDistKm <= 6) {
    return [
      {
        phase: 1,
        title: `Phase 1: [기초 유산소 & 2.5km 적응] Base Building`,
        weeks: `1 ~ ${p1End}주차`,
        focus: '편안한 유산소 조깅으로 심폐 베이스 및 하체 근육 활성화',
        keyWorkouts: ['E페이스 조깅 2.5km', '하체 스쿼트 15회 3세트', '고관절 스트레칭'],
        targetGoal: '부상 없이 2.5km 지속 완주'
      },
      {
        phase: 2,
        title: `Phase 2: [거리 확장 & 3.5km] Distance Building`,
        weeks: `${p1End + 1} ~ ${p2End}주차`,
        focus: '케이던스 175spm 유지 및 3.5km 안정적 주파',
        keyWorkouts: ['지속주 3.5km', '코어 플랭크 & 사이드 레그레이즈'],
        targetGoal: '3.5km 편안한 페이스 주파'
      },
      {
        phase: 3,
        title: `Phase 3: [5km 실전 페이스 & 템포] 5km Tempo`,
        weeks: `${p2End + 1} ~ ${p3End}주차`,
        focus: `목표 페이스(${targetPaceStr}) 적응 및 4km 지속 훈련`,
        keyWorkouts: [`5km 목표 페이스 3.5km 템포런`, '주말 5km 천천히 완주'],
        targetGoal: '4.5km 안정 주파'
      },
      {
        phase: 4,
        title: `Phase 4: [5km 완벽 돌파] 5km Race Day`,
        weeks: `${p3End + 1} ~ ${totalWeeks}주차`,
        focus: '컨디션 조절 및 5km 목표 기록 완주',
        keyWorkouts: [`5km 실전 완주 (${targetPaceStr})`, '회복 조깅 2km & 스트레칭'],
        targetGoal: `5km 목표 완주 성공!`
      }
    ];
  }

  // 5. 기본: 10km
  return [
    {
      phase: 1,
      title: `Phase 1: [기초 유산소 적응] Base Building & 무릎 보호 (E페이스 8:00~8:30)`,
      weeks: `1 ~ ${p1End}주차`,
      focus: '심박수 135bpm 이하의 편안한 E페이스 조깅 + 종아리/발목 충격흡수 강화',
      keyWorkouts: [
        'E페이스(Easy Run) 편안한 조깅 3~4km (대화 가능한 페이스)',
        '카프 레이즈 & 둔근 브릿지 (무릎 충격 흡수 근육 강화)',
        '달리기 전후 10분 폼롤러 및 발바닥 릴리즈'
      ],
      targetGoal: '무릎 통증 없이 4km 지속 완주'
    },
    {
      phase: 2,
      title: `Phase 2: [거리 확장 & 미디엄런] Distance Progression (E~M페이스 7:00~7:30)`,
      weeks: `${p1End + 1} ~ ${p2End}주차`,
      focus: '일정한 케이던스(175~180spm)로 6km 거리 적응 및 안정적 페이싱',
      keyWorkouts: [
        '지속주 6km (권장 페이스: 7:00 / km)',
        '하체 스쿼트 & 사이드 레그레이즈',
        '코어 플랭크 & 전신 스트레칭'
      ],
      targetGoal: '6km 안정 주파'
    },
    {
      phase: 3,
      title: `Phase 3: [젖산역치 & 스피드 빌드업] Threshold Tempo (T페이스 6:30~6:50)`,
      weeks: `${p2End + 1} ~ ${p3End}주차`,
      focus: 'T페이스 템포런으로 피로 누적 억제 및 러닝 이코노미 자세 유지',
      keyWorkouts: [
        'T페이스 지속 템포런 7~8km',
        '짧은 가속주 50m x 4회 (신경근 활성화 드릴)',
        '주말 8km 천천히 오래 달리기 (LSD)'
      ],
      targetGoal: '8km 안정 주파 및 관절 컨디션 100% 유지'
    },
    {
      phase: 4,
      title: `Phase 4: [D-Day 테이퍼링 & 완주] Race Execution (목표: ${targetPaceStr})`,
      weeks: `${p3End + 1} ~ ${totalWeeks}주차`,
      focus: `남은 ${totalWeeks}주 동안 무리 없이 달성 가능한 10km 완주`,
      keyWorkouts: [
        `실전 10km 완주 시뮬레이션 (목표 페이스: ${targetPaceStr})`,
        'E페이스 가벼운 회복 조깅 3km & 충분한 수면',
        '대회 당일 네거티브 스플릿 완주 전략'
      ],
      targetGoal: `10km 완주 (${targetPaceStr}/km) 성공!`
    }
  ];
}

function createWeeklyScheduleTemplate(category, weeklyFrequency, dailyMinutes, isSenior = false) {
  const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  const schedule = [];

  let workoutDays = [0, 2, 5];
  if (!isSenior) {
    if (weeklyFrequency === 4) workoutDays = [0, 2, 4, 5];
    else if (weeklyFrequency === 5) workoutDays = [0, 1, 3, 4, 5];
  }

  days.forEach((dayName, idx) => {
    const isWorkout = workoutDays.includes(idx);
    schedule.push({
      day: dayName,
      isWorkout,
      title: isWorkout ? getDayWorkoutTitle(category, idx, isSenior) : (isSenior ? '🌿 관절 회복 및 폼롤러 스트레칭' : '휴식 및 폼롤러 회복 🍃'),
      duration: isWorkout ? `${dailyMinutes}분` : '15분 힐링 스트레칭',
      intensity: isWorkout ? (isSenior ? 'Moderate' : (idx % 2 === 0 ? 'High' : 'Moderate')) : 'Rest'
    });
  });

  return schedule;
}

function getDayWorkoutTitle(category, dayIdx, isSenior = false) {
  const list = ['[달리기] 존2 유산소 조깅 & 스쿼트', '[보강] 심폐 지속 & 코어 다리들기', '[메인] 주말 지속 완주 & 둔근 강화'];
  return list[dayIdx % list.length];
}

function getCoachAdvice(category, level, mode, isSenior = false) {
  if (isSenior) {
    return '🛡️ [50대 AI 코칭 조언] 50대 운동의 핵심은 "지속 가능성"과 "부상 방지"입니다. 무리하게 기록을 쫓기보다 기초 근력(스쿼트, 다리들기, 플랭크)을 탄탄히 다지며 심박수가 편안한 상태에서 달리는 것이 가장 빠르고 현명한 길입니다.';
  }

  return '💡 운동의 성패는 "나의 현재 진짜 기초 체력"에서 출발하는 데 있습니다. 달리기와 함께 하체·코어 보강 운동을 병행해야 부상 없이 목표를 완주할 수 있습니다.';
}
