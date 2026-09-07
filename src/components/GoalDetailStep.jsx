import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Zap, Flame, Shield, Sparkles, ChevronRight } from 'lucide-react';
import {
  MARATHON_DISTANCES,
  getPresetsForDistance,
  calculatePaceFromTime,
  calculateTimeFromPace,
  validateMarathonSafety
} from '../services/coachEngine';

export function GoalDetailStep({ onGoalSubmit, initialGoal }) {
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || '2026-10-18');
  const [distanceKm, setDistanceKm] = useState(initialGoal?.distanceKm || 10.0);
  const [hours, setHours] = useState(initialGoal?.hours !== undefined ? initialGoal.hours : 0);
  const [minutes, setMinutes] = useState(initialGoal?.minutes !== undefined ? initialGoal.minutes : 50);
  
  const [targetPace, setTargetPace] = useState(initialGoal?.targetPace || '5:00');
  const [daysPerWeek, setDaysPerWeek] = useState(initialGoal?.daysPerWeek || 3);
  const [safetyError, setSafetyError] = useState(null);

  // 현재 거리에 맞는 4대 원클릭 프리셋
  const currentPresets = getPresetsForDistance(distanceKm);

  // 거리 변경 핸들러 (거리 변경 시 해당 거리의 2번째 대표 프리셋으로 자동 추천 세팅)
  const handleDistanceChange = (km) => {
    setDistanceKm(km);
    const newPresets = getPresetsForDistance(km);
    if (newPresets && newPresets.length > 0) {
      const defaultPreset = newPresets[1] || newPresets[0];
      setHours(defaultPreset.hours);
      setMinutes(defaultPreset.minutes);
      setTargetPace(defaultPreset.pace);
    }
  };

  // 시간 변경 시 페이스 자동 계산 & 안전 가드레일 검증
  useEffect(() => {
    const totalSec = (Number(hours) * 3600) + (Number(minutes) * 60);
    
    // 1) 안전 가드레일 검증
    const validation = validateMarathonSafety(Number(distanceKm), totalSec);
    if (!validation.isValid) {
      setSafetyError(validation.message);
    } else {
      setSafetyError(null);
    }

    // 2) 페이스 자동 계산
    const { paceStr } = calculatePaceFromTime(Number(distanceKm), totalSec);
    setTargetPace(paceStr);
  }, [distanceKm, hours, minutes]);

  // 빠른 프리셋 적용
  const handleApplyPreset = (preset) => {
    setDistanceKm(preset.distanceKm);
    setHours(preset.hours);
    setMinutes(preset.minutes);
    setTargetPace(preset.pace);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (safetyError) {
      alert(safetyError);
      return;
    }

    const totalSeconds = (Number(hours) * 3600) + (Number(minutes) * 60);
    const targetTimeMin = Math.round(totalSeconds / 60);

    let distTitle = `${distanceKm}km`;
    let distBadge = `${distanceKm}km 러닝`;
    if (distanceKm <= 3.5) {
      distTitle = '슬로우조깅 (Zone 2 걷뛰 3km)';
      distBadge = '슬로우조깅 / 80:20';
    } else if (distanceKm >= 42) {
      distTitle = '풀코스 마라톤 (42.195km)';
      distBadge = '풀코스 마라톤';
    } else if (distanceKm >= 21) {
      distTitle = '하프 마라톤 (21.1km)';
      distBadge = '하프 마라톤';
    }

    const timeLabel = `${hours > 0 ? `${hours}시간 ` : ''}${minutes > 0 ? `${minutes}분 ` : ''}`.trim();
    const payload = {
      category: 'running',
      title: `${distTitle} ${timeLabel} 미만 완주`,
      badge: distBadge,
      targetMetric: `${distTitle} (페이스 ${targetPace}/km)`,
      scheduleMode: 'deadline',
      targetDate,
      distanceKm: Number(distanceKm),
      hours: Number(hours),
      minutes: Number(minutes),
      targetTimeMin,
      targetPace,
      daysPerWeek: Number(daysPerWeek),
      dailyMinutes: 35
    };

    onGoalSubmit(payload);
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* 🍎 iOS 스타일 헤더 (Large Title) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          background: 'rgba(0, 255, 135, 0.12)',
          borderRadius: '9999px',
          color: 'var(--accent-primary)',
          fontSize: '11px',
          fontWeight: '800',
          marginBottom: '6px'
        }}>
          <span>STEP 1</span>
          <span>•</span>
          <span>TARGET SETUP</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.03em', color: '#ffffff' }}>
          마라톤 목표 설정
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          도전할 마라톤 거리와 목표 시간을 선택하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 🍎 iOS Inset Grouped Card 1: 목표 거리 & 원클릭 프리셋 (One-Click Target) */}
        <div style={{
          background: 'rgba(28, 28, 30, 0.85)',
          borderRadius: '20px',
          padding: '18px 16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          marginBottom: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          {/* 거리 탭 (Segmented Control) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              1. 목표 거리 선택
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              원하는 코스를 탭하세요
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '4px',
            borderRadius: '14px',
            gap: '4px',
            marginBottom: '14px'
          }}>
            {MARATHON_DISTANCES.map(d => {
              const isSelected = distanceKm === d.km;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDistanceChange(d.km)}
                  style={{
                    padding: '9px 2px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: isSelected ? 'var(--accent-primary)' : 'transparent',
                    color: isSelected ? '#000000' : 'var(--text-secondary)',
                    border: 'none',
                    boxShadow: isSelected ? '0 2px 10px rgba(48, 209, 88, 0.35)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div>{d.id === 'slow' ? '🌱SLOW' : d.id.toUpperCase()}</div>
                  <div style={{ fontSize: '9px', opacity: isSelected ? 0.9 : 0.6, fontWeight: '700', marginTop: '1px' }}>
                    {d.id === 'slow' ? '3k 걷뛰' : `${d.km}k`}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 원클릭 맞춤 프리셋 버튼 4종 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={14} color="var(--accent-orange)" />
              <span>2. 원클릭 목표 선택 (추천 프리셋)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {currentPresets.map((preset, idx) => {
              const isMatch = Number(hours) === Number(preset.hours) && Number(minutes) === Number(preset.minutes);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    background: isMatch ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: isMatch ? 'var(--accent-primary)' : 'var(--text-primary)',
                    border: isMatch ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.07)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isMatch ? '0 0 12px rgba(48, 209, 88, 0.2)' : 'none'
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🍎 iOS Inset Grouped Card 2: 세부 시간 미세조정 & 요구 페이스 (Fine Tuning) */}
        <div style={{
          background: 'rgba(28, 28, 30, 0.85)',
          borderRadius: '20px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          marginBottom: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              3. 세부 시간 미세조정 & 요구 페이스
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              직접 분 단위 수정 가능
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', alignItems: 'center' }}>
            {/* 시간 / 분 스텝 인풋 */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                ⏱️ 목표 시간 (Target Time)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    className="input-glass"
                    style={{ width: '54px', textAlign: 'center', fontSize: '18px', fontWeight: '900', padding: '6px 2px', borderRadius: '10px' }}
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>h</span>
                </div>

                <span style={{ fontWeight: '900', color: 'var(--text-muted)' }}>:</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="input-glass"
                    style={{ width: '54px', textAlign: 'center', fontSize: '18px', fontWeight: '900', padding: '6px 2px', borderRadius: '10px' }}
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>m 미만</span>
                </div>
              </div>
            </div>

            {/* Apple Activity 스타일 페이스 메트릭 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.45)',
              borderRadius: '14px',
              padding: '10px 14px',
              border: '1px solid rgba(48, 209, 88, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
                REQUIRED PACE
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em', lineHeight: '1.1', marginTop: '2px' }}>
                {targetPace}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>/ km</div>
            </div>
          </div>
        </div>

        {/* 🍎 iOS Inset Grouped Card 4: D-Day & 빈도 */}
        <div style={{
          background: 'rgba(28, 28, 30, 0.85)',
          borderRadius: '20px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          marginBottom: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                📅 목표 완료 날짜 (D-Day)
              </label>
              <input
                type="date"
                className="input-glass"
                style={{ padding: '8px 10px', fontSize: '12px', fontWeight: '700', borderRadius: '10px' }}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                ⚡ 주당 운동 빈도
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[3, 4, 5].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setDaysPerWeek(cnt)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      background: daysPerWeek === cnt ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: daysPerWeek === cnt ? '#38bdf8' : 'var(--text-secondary)',
                      border: daysPerWeek === cnt ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    주 {cnt}회
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 안전 가드레일 에러 */}
          {safetyError && (
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 69, 58, 0.15)',
              border: '1px solid #ff453a',
              fontSize: '12px',
              color: '#ff453a',
              fontWeight: '700'
            }}>
              {safetyError}
            </div>
          )}
        </div>

        {/* 🍎 iOS Main Action Button (Capsule Button) */}
        <button
          type="submit"
          disabled={!!safetyError}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '9999px',
            fontSize: '16px',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            background: 'var(--accent-primary)',
            color: '#000000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 20px rgba(0, 255, 135, 0.4)',
            cursor: safetyError ? 'not-allowed' : 'pointer',
            opacity: safetyError ? 0.4 : 1,
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span>AI 역산 진단 & 플랜 생성하기</span>
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </form>
    </div>
  );
}
