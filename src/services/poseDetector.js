/**
 * MediaPipe Pose 기반 웹캠 실시간 자세 인식 및 각도/카운트 분석 유틸
 */

// 세 점 사이의 2차원/3차원 각도(Degree) 계산
export function calculateAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return Math.round(angle);
}

// MediaPipe 랜드마크 인덱스 상수
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28
};

// 스켈레톤 연결 쌍
export const POSE_CONNECTIONS = [
  [11, 12], // 어깨 연결
  [11, 13], [13, 15], // 왼팔
  [12, 14], [14, 16], // 오른팔
  [11, 23], [12, 24], // 상체 몸통
  [23, 24], // 골반
  [23, 25], [25, 27], // 왼다리
  [24, 26], [26, 28]  // 오른다리
];

// 캔버스에 세련된 네온 스켈레톤 그리기
export function drawPoseResults(ctx, landmarks, width, height, activeExerciseType = 'squat') {
  if (!ctx || !landmarks || landmarks.length === 0) return;

  ctx.clearRect(0, 0, width, height);

  // 1. 관절 연결선 (Skeleton Bones)
  ctx.lineWidth = 4;
  POSE_CONNECTIONS.forEach(([i, j]) => {
    const p1 = landmarks[i];
    const p2 = landmarks[j];

    if (p1 && p2 && (p1.visibility || 1) > 0.4 && (p2.visibility || 1) > 0.4) {
      const gradient = ctx.createLinearGradient(p1.x * width, p1.y * height, p2.x * width, p2.y * height);
      gradient.addColorStop(0, '#00ff87');
      gradient.addColorStop(1, '#60efff');

      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.strokeStyle = gradient;
      ctx.stroke();
    }
  });

  // 2. 관절 포인트 (Joint Circles with Neon Glow)
  landmarks.forEach((p, idx) => {
    if ((p.visibility || 1) > 0.4) {
      const x = p.x * width;
      const y = p.y * height;

      // 외곽 네온 글로우
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 255, 135, 0.4)';
      ctx.fill();

      // 내부 코어 점
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  });

  // 3. 주요 관절 각도 텍스트 오버레이
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
  const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
  const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];

  if (leftHip && leftKnee && leftAnkle) {
    const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const kx = leftKnee.x * width;
    const ky = leftKnee.y * height;

    drawAngleBadge(ctx, `${kneeAngle}°`, kx + 15, ky, kneeAngle < 100 ? '#00ff87' : '#94a3b8');
  }

  if (leftShoulder && leftElbow && leftWrist) {
    const armAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const ex = leftElbow.x * width;
    const ey = leftElbow.y * height;

    drawAngleBadge(ctx, `${armAngle}°`, ex + 15, ey, armAngle < 90 ? '#60efff' : '#94a3b8');
  }
}

function drawAngleBadge(ctx, text, x, y, color) {
  ctx.save();
  ctx.font = 'bold 12px Pretendard, sans-serif';
  const textWidth = ctx.measureText(text).width;
  
  ctx.fillStyle = 'rgba(10, 13, 20, 0.85)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x - 4, y - 12, textWidth + 8, 18, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(text, x, y + 2);
  ctx.restore();
}

/**
 * 자세 분석 및 운동 카운팅 상태 머신
 */
export class WorkoutAnalyzer {
  constructor(exerciseType = 'squat') {
    this.exerciseType = exerciseType;
    this.state = 'UP'; // 'UP' or 'DOWN'
    this.repCount = 0;
    this.feedback = '준비 완료! 카메라 앞에 서주세요.';
    this.accuracyScore = 85;
    this.history = [];
  }

  updatePose(landmarks) {
    if (!landmarks || landmarks.length === 0) return { repCount: this.repCount, feedback: '동작 감지 대기 중...' };

    if (this.exerciseType === 'squat') {
      return this.analyzeSquat(landmarks);
    } else if (this.exerciseType === 'shoulder_raise') {
      return this.analyzeShoulderRaise(landmarks);
    } else if (this.exerciseType === 'pullup' || this.exerciseType === 'pushup') {
      return this.analyzeArmMotion(landmarks);
    } else if (this.exerciseType === 'flexibility') {
      return this.analyzeFlexibility(landmarks);
    } else {
      return this.analyzeGeneral(landmarks);
    }
  }

  analyzeShoulderRaise(landmarks) {
    const hip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const shoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const wrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];

    if (!hip || !shoulder || !wrist) return { repCount: this.repCount, feedback: this.feedback };

    const angle = calculateAngle(hip, shoulder, wrist);

    if (angle > 150) {
      if (this.state === 'DOWN') {
        this.state = 'UP';
        this.repCount += 1;
        this.feedback = `✨ 완벽한 가동성입니다! 만세 유지 후 천천히 내리세요 (${this.repCount}회)`;
        this.accuracyScore = Math.min(100, this.accuracyScore + 3);
      }
    } else if (angle < 90) {
      if (this.state === 'UP') {
        this.state = 'DOWN';
        this.feedback = '👍 좋습니다. 다시 양팔을 위로 만세 뻗어주세요.';
      }
    }

    return {
      repCount: this.repCount,
      feedback: this.feedback,
      currentAngle: angle,
      state: this.state,
      score: this.accuracyScore
    };
  }

  analyzeSquat(landmarks) {
    const hip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const knee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const ankle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

    if (!hip || !knee || !ankle) return { repCount: this.repCount, feedback: this.feedback };

    const angle = calculateAngle(hip, knee, ankle);

    if (angle < 95) {
      if (this.state === 'UP') {
        this.state = 'DOWN';
        this.feedback = '✨ 훌륭한 깊이입니다! 그대로 힘차게 올라오세요!';
      }
    } else if (angle > 160) {
      if (this.state === 'DOWN') {
        this.state = 'UP';
        this.repCount += 1;
        this.feedback = `🔥 완벽한 1회 완료! (${this.repCount}회)`;
        this.accuracyScore = Math.min(100, this.accuracyScore + 2);
      }
    }

    return {
      repCount: this.repCount,
      feedback: this.feedback,
      currentAngle: angle,
      state: this.state,
      score: this.accuracyScore
    };
  }

  analyzeArmMotion(landmarks) {
    const shoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const elbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const wrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];

    if (!shoulder || !elbow || !wrist) return { repCount: this.repCount, feedback: this.feedback };

    const angle = calculateAngle(shoulder, elbow, wrist);

    if (angle < 80) {
      if (this.state === 'UP') {
        this.state = 'DOWN';
        this.feedback = '👍 최대 수축! 광배근/가슴에 집중하세요!';
      }
    } else if (angle > 155) {
      if (this.state === 'DOWN') {
        this.state = 'UP';
        this.repCount += 1;
        this.feedback = `💪 깔끔한 반복! (${this.repCount}회)`;
      }
    }

    return {
      repCount: this.repCount,
      feedback: this.feedback,
      currentAngle: angle,
      state: this.state,
      score: this.accuracyScore
    };
  }

  analyzeFlexibility(landmarks) {
    const lAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];
    const lHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];

    if (lAnkle && rAnkle && lHip && rHip) {
      const legSpan = Math.abs(lAnkle.x - rAnkle.x);
      const angle = Math.min(180, Math.round(legSpan * 200));
      this.feedback = angle > 140 ? '🌟 뛰어난 유연성입니다! 호흡을 뱉으며 유지하세요.' : '차분하게 골반 정렬을 유지하며 이완하세요.';
      return {
        repCount: 1,
        feedback: this.feedback,
        currentAngle: angle,
        score: Math.min(100, Math.round(angle * 0.55))
      };
    }

    return { repCount: 0, feedback: '전신이 나오도록 위치를 조정해주세요.' };
  }

  analyzeGeneral(landmarks) {
    return {
      repCount: this.repCount,
      feedback: '자세를 안정적으로 유지하고 있습니다.',
      score: 85
    };
  }
}
