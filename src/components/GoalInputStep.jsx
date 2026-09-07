import React, { useState } from 'react';
import { PRESET_GOALS, analyzeGoalInput } from '../services/coachEngine';
import { Target, Calendar, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export function GoalInputStep({ onGoalSubmit, initialGoal }) {
  const [selectedPreset, setSelectedPreset] = useState(initialGoal?.presetId || 'marathon_10k_58m');
  const [customGoalText, setCustomGoalText] = useState(initialGoal?.customText || '');
  const [useCustom, setUseCustom] = useState(false);

  const [scheduleMode, setScheduleMode] = useState(initialGoal?.scheduleMode || 'deadline');
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || '2026-10-10');
  const [dailyMinutes, setDailyMinutes] = useState(initialGoal?.dailyMinutes || 35);
  const [daysPerWeek, setDaysPerWeek] = useState(initialGoal?.daysPerWeek || 3);

  const handleSubmit = (e) => {
    e.preventDefault();

    let goalPayload = {};
    if (useCustom && customGoalText.trim()) {
      const analyzed = analyzeGoalInput(customGoalText);
      goalPayload = {
        id: `custom_${Date.now()}`,
        presetId: null,
        title: customGoalText,
        category: analyzed.category,
        detectedTitle: analyzed.detectedTitle,
        testType: analyzed.testType,
        customText: customGoalText,
        scheduleMode,
        targetDate,
        dailyMinutes: Number(dailyMinutes),
        daysPerWeek: Number(daysPerWeek)
      };
    } else {
      const preset = PRESET_GOALS.find(p => p.id === selectedPreset) || PRESET_GOALS[0];
      goalPayload = {
        ...preset,
        presetId: preset.id,
        scheduleMode,
        targetDate,
        dailyMinutes: Number(dailyMinutes),
        daysPerWeek: Number(daysPerWeek)
      };
    }

    onGoalSubmit(goalPayload);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* 간결한 타이틀 */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '30px', marginBottom: '6px' }}>
          운동 목표 <span className="gradient-text">선택</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          도전할 운동과 희망 일정을 골라주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 프리셋 선택 */}
        <div className="grid-2" style={{ marginBottom: '20px' }}>
          {PRESET_GOALS.map((goal) => {
            const isSelected = !useCustom && selectedPreset === goal.id;
            return (
              <div
                key={goal.id}
                onClick={() => {
                  setSelectedPreset(goal.id);
                  setUseCustom(false);
                }}
                className={`choice-card ${isSelected ? 'selected' : ''}`}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span className="badge" style={{ backgroundColor: `${goal.color}20`, color: goal.color }}>
                    {goal.badge}
                  </span>
                  {isSelected && <CheckCircle2 size={18} color="var(--accent-primary)" />}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{goal.title}</h3>
              </div>
            );
          })}
        </div>

        {/* 직접 입력 */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            className="input-glass"
            placeholder="또는 직접 입력 (예: 10km 달리기, 턱걸이 5개...)"
            value={customGoalText}
            onChange={(e) => {
              setCustomGoalText(e.target.value);
              if (e.target.value.trim().length > 0) setUseCustom(true);
            }}
          />
        </div>

        {/* 일정 모드 */}
        <div className="card-glass" style={{ marginBottom: '28px', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setScheduleMode('deadline')}
              className={`btn btn-sm ${scheduleMode === 'deadline' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              <Calendar size={14} /> 목표 날짜 기준
            </button>
            <button
              type="button"
              onClick={() => setScheduleMode('daily_time')}
              className={`btn btn-sm ${scheduleMode === 'daily_time' ? 'btn-cyan' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              <Clock size={14} /> 하루 시간 기준
            </button>
          </div>

          {scheduleMode === 'deadline' ? (
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>목표일</label>
                <input
                  type="date"
                  className="input-glass"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>주당 운동</label>
                <select className="input-glass" value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))}>
                  <option value={3}>주 3회 (권장)</option>
                  <option value={4}>주 4회</option>
                  <option value={5}>주 5회</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>하루 시간</label>
                <select className="input-glass" value={dailyMinutes} onChange={(e) => setDailyMinutes(Number(e.target.value))}>
                  <option value={20}>하루 20분</option>
                  <option value={35}>하루 35분</option>
                  <option value={50}>하루 50분</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>주당 횟수</label>
                <select className="input-glass" value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))}>
                  <option value={3}>주 3회 (권장)</option>
                  <option value={4}>주 4회</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 다음 버튼 */}
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '220px' }}>
            <span>다음: 상태 진단</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
