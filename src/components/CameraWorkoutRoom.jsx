import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Play, Pause, RotateCcw, CheckCircle2, Flame, Award, Volume2, ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { drawPoseResults, WorkoutAnalyzer } from '../services/poseDetector';

export function CameraWorkoutRoom({ goal, roadmap, onBackToRoadmap, onWorkoutFinished }) {
  const [isActive, setIsActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const totalSets = 4;
  const targetRepsPerSet = goal?.category === 'pullup' ? 5 : goal?.category === 'running' ? 10 : 8;

  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState('시작 버튼을 누르면 AI 코치가 자세를 추적합니다.');
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(45);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analyzerRef = useRef(null);
  const poseModelRef = useRef(null);
  const animationFrameRef = useRef(null);
  const restIntervalRef = useRef(null);

  useEffect(() => {
    const exType = goal?.category === 'pullup' ? 'pullup' :
                   goal?.category === 'flexibility' ? 'flexibility' : 'squat';
    analyzerRef.current = new WorkoutAnalyzer(exType);

    return () => {
      stopCamera();
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [goal]);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      if (window.Pose) {
        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(onPoseResults);
        poseModelRef.current = pose;

        const processFrame = async () => {
          if (videoRef.current && videoRef.current.readyState >= 2 && poseModelRef.current) {
            try {
              await poseModelRef.current.send({ image: videoRef.current });
            } catch (e) {}
          }
          animationFrameRef.current = requestAnimationFrame(processFrame);
        };
        processFrame();
      }

      setCameraActive(true);
      setIsActive(true);
      setFeedback('자세 인식 시작! 카메라 앞에서 힘차게 시작하세요!');
    } catch (e) {
      console.error('Camera fail', e);
      setFeedback('카메라를 켤 수 없어 수동 카운트 모드로 전환합니다.');
      setIsActive(true);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const onPoseResults = (results) => {
    if (!canvasRef.current || isResting || workoutComplete) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    if (results.poseLandmarks) {
      drawPoseResults(ctx, results.poseLandmarks, width, height, analyzerRef.current?.exerciseType);

      if (analyzerRef.current) {
        const res = analyzerRef.current.updatePose(results.poseLandmarks);
        if (res) {
          setFeedback(res.feedback);
          setReps(res.repCount);

          if (res.repCount >= targetRepsPerSet) {
            handleSetComplete();
          }
        }
      }
    }
  };

  const handleSetComplete = () => {
    if (currentSet < totalSets) {
      setIsResting(true);
      setRestTimer(45);
      setFeedback(`🎉 ${currentSet}세트 완료! 45초간 호흡을 가다듬으며 휴식하세요.`);
      
      if (analyzerRef.current) {
        analyzerRef.current.repCount = 0;
      }
      setReps(0);

      restIntervalRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            clearInterval(restIntervalRef.current);
            setIsResting(false);
            setCurrentSet((s) => s + 1);
            setFeedback(`🔥 ${currentSet + 1}세트 시작! 준비되셨나요?`);
            return 45;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // 모든 세트 완료!
      setWorkoutComplete(true);
      setFeedback('🏆 오늘의 모든 훈련 세트를 완벽하게 달성하셨습니다!');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onWorkoutFinished) {
        onWorkoutFinished({ date: new Date().toISOString(), completedSets: totalSets });
      }
    }
  };

  const handleManualAddRep = () => {
    const nextReps = reps + 1;
    setReps(nextReps);
    if (analyzerRef.current) analyzerRef.current.repCount = nextReps;
    if (nextReps >= targetRepsPerSet) {
      handleSetComplete();
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* 상단 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBackToRoadmap} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>로드맵으로 돌아가기</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-green">LIVE AI COACH</span>
          <span style={{ fontSize: '14px', fontWeight: '700' }}>
            세트 {currentSet} / {totalSets}
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* 1. 웹캠 & 비전 스켈레톤 디스플레이 */}
        <div className="card-glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            backgroundColor: '#070a10',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-card)'
          }}>
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
                display: cameraActive ? 'block' : 'none'
              }}
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: 'scaleX(-1)',
                display: cameraActive ? 'block' : 'none',
                pointerEvents: 'none'
              }}
            />

            {!cameraActive && (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Camera size={48} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>AI 스마트 웹캠 코칭</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  카메라를 켜면 실시간으로 관절 각도를 측정하고 카운트합니다.
                </p>
                <button onClick={startCamera} className="btn btn-primary btn-sm">
                  <Camera size={15} />
                  <span>카메라 켜기</span>
                </button>
              </div>
            )}

            {/* 휴식 중 오버레이 */}
            {isResting && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(10, 13, 20, 0.88)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}>
                <div style={{ fontSize: '16px', color: 'var(--accent-secondary)', fontWeight: '700', marginBottom: '8px' }}>
                  세트 휴식 시간 🍃
                </div>
                <div style={{ fontSize: '56px', fontWeight: '900', color: 'var(--accent-primary)' }}>
                  {restTimer}s
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  깊은 호흡을 하며 다음 세트를 준비하세요
                </p>
              </div>
            )}
          </div>

          {/* 하단 피드백 박스 */}
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={18} color="var(--accent-secondary)" style={{ flexShrink: 0 }} />
            <span>{feedback}</span>
          </div>
        </div>

        {/* 2. 트레이닝 카운터 & 세트 진행 대시보드 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 큰 렙 카운터 카드 */}
          <div className="card-glass" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
              CURRENT REPS
            </div>
            <div style={{ fontSize: '72px', fontWeight: '900', lineHeight: '1', color: 'var(--accent-primary)', marginBottom: '12px' }}>
              {reps} <span style={{ fontSize: '28px', color: 'var(--text-muted)', fontWeight: '400' }}>/ {targetRepsPerSet}</span>
            </div>

            {/* 세트 프로그레스 바 */}
            <div className="progress-bar-container" style={{ height: '10px', marginBottom: '16px' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(100, (reps / targetRepsPerSet) * 100)}%` }}
              />
            </div>

            {/* 수동 카운트 버튼 (카메라 미사용 시 편리) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={handleManualAddRep}
                disabled={isResting || workoutComplete}
                className="btn btn-secondary btn-sm"
              >
                + 1회 직접 카운트
              </button>
            </div>
          </div>

          {/* 세트 현황 카드 */}
          <div className="card-glass">
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="var(--accent-orange)" /> 세트 진행 현황
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalSets}, 1fr)`, gap: '10px' }}>
              {Array.from({ length: totalSets }).map((_, idx) => {
                const setNum = idx + 1;
                const isDone = setNum < currentSet || workoutComplete;
                const isCurrent = setNum === currentSet && !workoutComplete;

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isDone ? 'rgba(0, 255, 135, 0.15)' : isCurrent ? 'rgba(96, 239, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: isDone ? '1px solid var(--accent-primary)' : isCurrent ? '1px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Set {setNum}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isDone ? 'var(--accent-primary)' : isCurrent ? 'var(--accent-secondary)' : 'var(--text-muted)' }}>
                      {isDone ? '완료 ✓' : isCurrent ? '진행 중' : `${targetRepsPerSet}회`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 완료 시 축하 카드 */}
          {workoutComplete && (
            <div className="card-glass" style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 135, 0.2) 0%, rgba(96, 239, 255, 0.1) 100%)',
              borderColor: 'var(--accent-primary)',
              textAlign: 'center',
              padding: '24px'
            }}>
              <Trophy size={40} color="var(--accent-primary)" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
                오늘의 미션 완료! 🚀
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                목표를 향해 한 걸음 더 전진했습니다. 로컬 스트릭에 오늘 운동이 기록되었습니다!
              </p>
              <button onClick={onBackToRoadmap} className="btn btn-primary btn-sm">
                로드맵 확인하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
