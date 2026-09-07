import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, CheckCircle2, Trash2, Zap, Heart, Sparkles } from 'lucide-react';
import { calculatePaceFromTime } from '../services/coachEngine';

export function WorkoutLogModal({
  isOpen,
  onClose,
  task,
  initialLog,
  onSaveLog,
  onDeleteLog
}) {
  if (!isOpen || !task) return null;

  // 기본 거리 추출 (태스크 텍스트에서 5km, 10km 등 추출 시도)
  const extractDefaultDistance = (text) => {
    const match = text?.match(/(\d+(\.\d+)?)\s*km/i);
    return match ? parseFloat(match[1]) : 5.0;
  };

  const defaultDist = extractDefaultDistance(task.text);

  const [distanceKm, setDistanceKm] = useState(initialLog?.distanceKm || defaultDist);
  const [minutes, setMinutes] = useState(initialLog?.minutes !== undefined ? initialLog.minutes : 30);
  const [seconds, setSeconds] = useState(initialLog?.seconds !== undefined ? initialLog.seconds : 0);
  const [feeling, setFeeling] = useState(initialLog?.feeling || 'good'); // 'easy' | 'good' | 'hard'
  const [memo, setMemo] = useState(initialLog?.memo || '');
  const [calculatedPace, setCalculatedPace] = useState('6:00 / km');

  // 거리나 시간 변경 시 실시간 페이스 계산
  useEffect(() => {
    const dist = parseFloat(distanceKm);
    const totalSec = (parseInt(minutes || 0) * 60) + parseInt(seconds || 0);

    if (dist > 0 && totalSec > 0) {
      const { paceStr } = calculatePaceFromTime(dist, totalSec);
      setCalculatedPace(`${paceStr} / km`);
    } else {
      setCalculatedPace('-:-- / km');
    }
  }, [distanceKm, minutes, seconds]);

  const handleSave = (e) => {
    e.preventDefault();
    const dist = parseFloat(distanceKm);
    const min = parseInt(minutes || 0);
    const sec = parseInt(seconds || 0);
    const totalSec = (min * 60) + sec;

    if (!dist || dist <= 0) {
      alert('달린 거리를 입력해주세요.');
      return;
    }
    if (totalSec <= 0) {
      alert('걸린 시간을 입력해주세요.');
      return;
    }

    const { paceStr } = calculatePaceFromTime(dist, totalSec);

    const logData = {
      taskId: task.id,
      taskText: task.text,
      distanceKm: dist,
      minutes: min,
      seconds: sec,
      totalSeconds: totalSec,
      pace: paceStr,
      feeling,
      memo: memo.trim(),
      loggedAt: new Date().toISOString()
    };

    onSaveLog(task.id, logData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('기록을 삭제하시겠습니까?')) {
      onDeleteLog(task.id);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(28, 28, 30, 0.98)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          width: '100%',
          maxWidth: '440px',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={18} color="#000000" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff' }}>
                ⏱️ 실전 훈련 기록
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                실제 달린 기록을 입력하세요
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 훈련 태스크 요약 뱃지 */}
        <div style={{ padding: '12px 20px 0 20px' }}>
          <div style={{
            padding: '10px 14px',
            background: 'rgba(0, 255, 135, 0.08)',
            borderRadius: '12px',
            borderLeft: '3px solid var(--accent-primary)',
            fontSize: '13px',
            fontWeight: '700',
            color: '#ffffff'
          }}>
            🎯 {task.text}
          </div>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSave} style={{ padding: '16px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 1. 달린 거리 & 걸린 시간 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '10px' }}>
            {/* 거리 */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                달린 거리 (km)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="100"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="input-glass"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    fontWeight: '900',
                    color: '#ffffff',
                    background: 'rgba(0, 0, 0, 0.45)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  required
                />
                <span style={{ position: 'absolute', right: '12px', top: '14px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                  km
                </span>
              </div>
            </div>

            {/* 시간 */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                걸린 시간
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="number"
                    min="0"
                    max="600"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="input-glass"
                    style={{
                      width: '100%',
                      padding: '12px 10px',
                      fontSize: '16px',
                      fontWeight: '900',
                      color: '#ffffff',
                      background: 'rgba(0, 0, 0, 0.45)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}
                    required
                  />
                  <span style={{ position: 'absolute', right: '6px', top: '14px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    분
                  </span>
                </div>

                <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-muted)' }}>:</span>

                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="input-glass"
                    style={{
                      width: '100%',
                      padding: '12px 10px',
                      fontSize: '16px',
                      fontWeight: '900',
                      color: '#ffffff',
                      background: 'rgba(0, 0, 0, 0.45)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}
                    required
                  />
                  <span style={{ position: 'absolute', right: '6px', top: '14px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    초
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 자동 계산된 실시간 평균 페이스 하이라이트 박스 */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(48, 209, 88, 0.1)',
            borderRadius: '14px',
            border: '1px solid rgba(48, 209, 88, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-primary)' }}>
                실제 평균 페이스
              </span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
              {calculatedPace}
            </span>
          </div>

          {/* 3. 체감 강도 (3버튼) */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              오늘의 체감 난이도
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setFeeling('easy')}
                style={{
                  padding: '9px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: 'none',
                  background: feeling === 'easy' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: feeling === 'easy' ? '#38bdf8' : 'var(--text-muted)',
                  boxShadow: feeling === 'easy' ? '0 0 12px rgba(56, 189, 248, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                😊 편안함
              </button>
              <button
                type="button"
                onClick={() => setFeeling('good')}
                style={{
                  padding: '9px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: 'none',
                  background: feeling === 'good' ? 'rgba(48, 209, 88, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: feeling === 'good' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  boxShadow: feeling === 'good' ? '0 0 12px rgba(48, 209, 88, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                ⚡ 딱 적당함
              </button>
              <button
                type="button"
                onClick={() => setFeeling('hard')}
                style={{
                  padding: '9px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: 'none',
                  background: feeling === 'hard' ? 'rgba(255, 107, 107, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: feeling === 'hard' ? '#ff6b6b' : 'var(--text-muted)',
                  boxShadow: feeling === 'hard' ? '0 0 12px rgba(255, 107, 107, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                🔥 숨참/빡셈
              </button>
            </div>
          </div>

          {/* 4. 한 줄 메모 (선택) */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              러닝 한 줄 메모 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 후반 2km 페이스 올림, 무릎 가벼움"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="input-glass"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
            />
          </div>

          {/* 하단 버튼 영역 */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            {initialLog && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: 'rgba(255, 107, 107, 0.12)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="기록 삭제"
              >
                <Trash2 size={16} />
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '13px',
                fontSize: '15px',
                fontWeight: '900',
                borderRadius: '14px',
                boxShadow: '0 0 20px rgba(48, 209, 88, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={18} />
              <span>{initialLog ? '기록 수정 완료' : '훈련 기록 저장'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
