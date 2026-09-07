import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Edit3, Check, X, Flame, ShieldCheck, Sparkles, Trophy, Plus, RefreshCw, Smartphone, Layers } from 'lucide-react';
import { DynamicProgressChart } from './DynamicProgressChart';
import { TodayWorkoutCard } from './TodayWorkoutCard';
import { calculateForecastTrajectory } from '../services/coachEngine';

export function RoadmapView({ roadmap, goal, userAssessment }) {
  if (!roadmap) return null;

  const { isSenior, safetyAdvisory, plans } = roadmap;
  const userLevel = userAssessment?.userLevel || { level: 2, levelTitle: '도전자' };

  // 화면 뷰 모드: 'full' (전체 로드맵 & 3안 선택) | 'today' (오늘의 운동 1장)
  const [viewMode, setViewMode] = useState('full');

  // 1안 vs 2안 vs 3안 선택 상태 (기본: 2안 정석 추천)
  const [activePlanId, setActivePlanId] = useState('plan2');
  const basePlan = (plans && plans[activePlanId]) ? plans[activePlanId] : {
    totalWeeks: roadmap.totalWeeks,
    estimatedDaysToTarget: roadmap.estimatedDaysToTarget,
    targetDate: roadmap.targetDate,
    targetGoal: '10km 완주',
    weeksChecklist: []
  };

  // 현재 선택된 주차 (기본 1주차)
  const [selectedWeek, setSelectedWeek] = useState(1);

  // 일일 태스크 완료 체크 상태 관리 (localStorage 영속화)
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('imcoach_completed_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // 사용자가 수정한 커스텀 목표치 저장 (localStorage 영속화)
  const [customTaskTexts, setCustomTaskTexts] = useState(() => {
    try {
      const saved = localStorage.getItem('imcoach_custom_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // 수정 중인 태스크 상태 { taskId, text }
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      try {
        localStorage.setItem('imcoach_completed_tasks', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingText(customTaskTexts[task.id] || task.text);
  };

  const handleSaveEdit = (taskId) => {
    if (editingText.trim()) {
      setCustomTaskTexts(prev => {
        const next = { ...prev, [taskId]: editingText.trim() };
        try {
          localStorage.setItem('imcoach_custom_tasks', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  // 실천율 기반 동적 예측 궤적 계산
  const forecastData = calculateForecastTrajectory(basePlan, completedTasks, customTaskTexts);

  const activeWeekData = basePlan.weeksChecklist?.find(w => w.weekNumber === selectedWeek) || basePlan.weeksChecklist?.[0];

  // 전체 완료율 계산
  const allTaskIds = [];
  basePlan.weeksChecklist?.forEach(w => {
    w.days?.forEach(d => {
      d.tasks?.forEach(t => allTaskIds.push(t.id));
    });
  });
  const completedCount = allTaskIds.filter(id => completedTasks[id]).length;
  const progressPercent = allTaskIds.length > 0 ? Math.round((completedCount / allTaskIds.length) * 100) : 0;

  // 6단계: 주간 달성에 대한 동적 AI 코칭 조언 산출
  const getWeeklyFeedback = () => {
    if (completedCount === 0) {
      return {
        type: 'info',
        title: '🎯 이번 주 운동 시작하기',
        desc: '체크리스트를 완료하면 달성 예측선이 실시간 반영됩니다.',
        color: 'var(--accent-primary)',
        bg: 'rgba(0, 255, 135, 0.08)'
      };
    }
    if (progressPercent >= 75) {
      return {
        type: 'warning_overtrain',
        title: '⚠️ 과훈련(부상) 주의',
        desc: '실천율이 매우 높습니다. 관절 부상 방지를 위해 휴식일과 스트레칭을 병행하세요.',
        color: '#ffb703',
        bg: 'rgba(255, 183, 3, 0.1)'
      };
    }
    if (progressPercent <= 30) {
      return {
        type: 'need_push',
        title: '💪 실천율 보완 필요',
        desc: '운동량이 다소 부족합니다. 가벼운 조깅이나 맨몸 스쿼트부터 다시 시작해보세요.',
        color: '#ff6b6b',
        bg: 'rgba(255, 107, 107, 0.1)'
      };
    }
    return {
      type: 'good',
      title: '👏 안정적인 페이스 유지 중',
      desc: '현재 페이스를 유지하면 목표일에 안전하게 완주 가능합니다.',
      color: 'var(--accent-primary)',
      bg: 'rgba(0, 255, 135, 0.08)'
    };
  };

  const weeklyAdvice = getWeeklyFeedback();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* 🍎 Apple iOS Segmented Control */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(118, 118, 128, 0.24)',
          padding: '3px',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => setViewMode('today')}
            style={{
              padding: '8px 20px',
              borderRadius: '13px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              border: 'none',
              background: viewMode === 'today' ? '#1c1c1e' : 'transparent',
              color: viewMode === 'today' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              boxShadow: viewMode === 'today' ? '0 3px 8px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            오늘의 코칭
          </button>
          <button
            type="button"
            onClick={() => setViewMode('full')}
            style={{
              padding: '8px 20px',
              borderRadius: '13px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              border: 'none',
              background: viewMode === 'full' ? '#1c1c1e' : 'transparent',
              color: viewMode === 'full' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              boxShadow: viewMode === 'full' ? '0 3px 8px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            전체 로드맵
          </button>
        </div>
      </div>

      {/* 📱 1. [오늘의 운동 1장 모드] */}
      {viewMode === 'today' ? (
        <TodayWorkoutCard
          basePlan={basePlan}
          forecastData={forecastData}
          weeklyAdvice={weeklyAdvice}
          completedTasks={completedTasks}
          customTaskTexts={customTaskTexts}
          onToggleTask={toggleTask}
          onStartEdit={handleStartEdit}
          editingTaskId={editingTaskId}
          editingText={editingText}
          setEditingText={setEditingText}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onViewFullRoadmap={() => setViewMode('full')}
        />
      ) : (
        <>
          {/* 1️⃣ [맨 위] 1안, 2안, 3안 가로방향 3개 박스형 배열 */}
          {plans && (
            <div style={{ marginBottom: '16px' }}>
              {/* 3안 가로 3개 박스 그리드 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
              }}>
                {/* 1안 */}
                {plans.plan1 && (
                  <div
                    onClick={() => { setActivePlanId('plan1'); setSelectedWeek(1); }}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 10px',
                      borderRadius: '14px',
                      background: activePlanId === 'plan1' ? 'rgba(100, 210, 255, 0.15)' : 'rgba(28, 28, 30, 0.75)',
                      border: activePlanId === 'plan1' ? '2px solid var(--accent-secondary)' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: activePlanId === 'plan1' ? '0 4px 16px rgba(100, 210, 255, 0.3)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 5px', borderRadius: '5px', background: 'rgba(100, 210, 255, 0.2)', color: 'var(--accent-secondary)' }}>
                          {plans.plan1.totalWeeks}주
                        </span>
                        {activePlanId === 'plan1' && <span style={{ fontSize: '10px', color: 'var(--accent-secondary)', fontWeight: '900' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '900', color: activePlanId === 'plan1' ? 'var(--accent-secondary)' : '#fff', marginBottom: '2px' }}>
                        1안 필승도전
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      단기 속성
                    </div>
                  </div>
                )}

                {/* 2안 (추천) */}
                {plans.plan2 && (
                  <div
                    onClick={() => { setActivePlanId('plan2'); setSelectedWeek(1); }}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 10px',
                      borderRadius: '14px',
                      background: activePlanId === 'plan2' ? 'rgba(48, 209, 88, 0.15)' : 'rgba(28, 28, 30, 0.75)',
                      border: activePlanId === 'plan2' ? '2px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: activePlanId === 'plan2' ? '0 4px 16px rgba(48, 209, 88, 0.3)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 5px', borderRadius: '5px', background: 'rgba(48, 209, 88, 0.2)', color: 'var(--accent-primary)' }}>
                          {plans.plan2.totalWeeks}주 ★
                        </span>
                        {activePlanId === 'plan2' && <span style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: '900' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '900', color: activePlanId === 'plan2' ? 'var(--accent-primary)' : '#fff', marginBottom: '2px' }}>
                        2안 적정기간
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      표준 추천
                    </div>
                  </div>
                )}

                {/* 3안 (초보/라이트) */}
                {plans.plan3 && (
                  <div
                    onClick={() => { setActivePlanId('plan3'); setSelectedWeek(1); }}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 10px',
                      borderRadius: '14px',
                      background: activePlanId === 'plan3' ? 'rgba(255, 183, 3, 0.15)' : 'rgba(28, 28, 30, 0.75)',
                      border: activePlanId === 'plan3' ? '2px solid #ffb703' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: activePlanId === 'plan3' ? '0 4px 16px rgba(255, 183, 3, 0.3)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 5px', borderRadius: '5px', background: 'rgba(255, 183, 3, 0.2)', color: '#ffb703' }}>
                          {plans.plan3.totalWeeks}주
                        </span>
                        {activePlanId === 'plan3' && <span style={{ fontSize: '10px', color: '#ffb703', fontWeight: '900' }}>✓</span>}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '900', color: activePlanId === 'plan3' ? '#ffb703' : '#fff', marginBottom: '2px' }}>
                        3안 초보안심
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      여유 완주
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2️⃣ [그 아래] 페이스 가이드 (1~3안 선택에 따라 자동 변경) */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '16px',
            background: 'rgba(28, 28, 30, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            marginBottom: '16px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: activePlanId === 'plan3' ? '#ffb703' : activePlanId === 'plan1' ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}>
                {activePlanId === 'plan3'
                  ? '🌱 3안 초보안심 페이스'
                  : activePlanId === 'plan1'
                  ? '⚡ 1안 필승도전 페이스'
                  : '🏆 2안 적정기간 표준 페이스'}
              </span>
            </div>

            {/* 3안 초보자 선택 시 */}
            {activePlanId === 'plan3' ? (
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px', background: 'rgba(255, 183, 3, 0.06)', borderRadius: '10px', border: '1px solid rgba(255, 183, 3, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#ffb703' }}>E 조깅</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>8:00~8:45</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>대화 속도</div>
                </div>

                <div style={{ padding: '8px', background: 'rgba(48, 209, 88, 0.06)', borderRadius: '10px', border: '1px solid rgba(48, 209, 88, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-primary)' }}>80:20 걷뛰</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>2분뜀+1분걸음</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>무릎 보호</div>
                </div>

                <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.06)', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#38bdf8' }}>보강 운동</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>주 2회</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>스쿼트</div>
                </div>
              </div>
            ) : activePlanId === 'plan1' ? (
              /* 1안 실전형 선택 시 */
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px', background: 'rgba(100, 210, 255, 0.06)', borderRadius: '10px', border: '1px solid rgba(100, 210, 255, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-secondary)' }}>E 이지런</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis?.vdotZones?.easy?.range || '6:30~7:00'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>회복 조깅</div>
                </div>

                <div style={{ padding: '8px', background: 'rgba(48, 209, 88, 0.06)', borderRadius: '10px', border: '1px solid rgba(48, 209, 88, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-primary)' }}>M 실전속도</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis?.vdotZones?.marathon?.pace || '5:50'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>목표 페이스</div>
                </div>

                <div style={{ padding: '8px', background: 'rgba(255, 107, 107, 0.06)', borderRadius: '10px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#ff6b6b' }}>T 스피드</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis?.vdotZones?.threshold?.pace || '5:30'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>젖산 역치</div>
                </div>
              </div>
            ) : (
              /* 2안 정석형 선택 시 */
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px', background: 'rgba(0, 255, 135, 0.06)', borderRadius: '10px', border: '1px solid rgba(0, 255, 135, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-primary)' }}>E 조깅</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis?.vdotZones?.easy?.range || '7:00~7:30'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>기초 유산소</div>
                </div>

                <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.06)', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#38bdf8' }}>M 완주속도</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis?.vdotZones?.marathon?.pace || '6:00'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>대회 페이스</div>
                </div>

                <div style={{ padding: '8px', background: 'rgba(255, 183, 3, 0.06)', borderRadius: '10px', border: '1px solid rgba(255, 183, 3, 0.2)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#ffb703' }}>T 템포런</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis?.vdotZones?.threshold?.pace || '5:40'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>스피드 지구력</div>
                </div>
              </div>
            )}
          </div>

          {/* 3️⃣ [그 아래] 그래프 및 AI 주간 코칭 조언 */}
          <div style={{ marginBottom: '16px' }}>
            {/* AI 주간 코칭 조언 배너 */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: weeklyAdvice.bg,
              borderRadius: 'var(--radius-md)',
              borderLeft: `4px solid ${weeklyAdvice.color}`,
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: weeklyAdvice.color }}>
                {weeklyAdvice.title}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {weeklyAdvice.desc}
              </span>
            </div>

            {/* 계획 vs 실천 동적 예측 그래프 컴포넌트 */}
            <DynamicProgressChart
              forecastData={forecastData}
              activePlan={basePlan}
              activePlanId={activePlanId}
              allPlans={plans}
            />
          </div>

          {/* 4️⃣ [그 아래] 주차별 세부 일정계획 & 일자별 체크리스트 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '800', marginBottom: '8px' }}>
              📅 주차별 훈련 일정
            </div>

            {/* 주차 선택 탭 버튼 (1주차 ~ N주차) */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              {basePlan.weeksChecklist?.map(w => {
                const isSelected = selectedWeek === w.weekNumber;
                return (
                  <button
                    key={w.weekNumber}
                    onClick={() => setSelectedWeek(w.weekNumber)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', minWidth: '75px', flexShrink: 0 }}
                  >
                    {w.weekNumber}주차
                  </button>
                );
              })}
            </div>
          </div>

          {/* 선택된 주차의 일자별 상세 운동 체크리스트 & 목표치 수정 */}
          {activeWeekData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0, 255, 135, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-primary)' }}>
                  📌 {activeWeekData.title}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {activeWeekData.targetSummary}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeWeekData.days?.map(day => (
                  <div
                    key={day.dayKey}
                    className="card-glass"
                    style={{
                      padding: '16px 20px',
                      backgroundColor: day.isWorkout ? 'rgba(18, 25, 38, 0.85)' : 'rgba(10, 13, 20, 0.6)',
                      borderLeft: day.isWorkout ? '4px solid var(--accent-primary)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: day.isWorkout ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {day.dayName}
                        </span>
                        <span className={`badge ${day.isWorkout ? 'badge-green' : 'badge-purple'}`} style={{ fontSize: '11px' }}>
                          {day.theme}
                        </span>
                      </div>
                    </div>

                    {/* 해당 일자의 세부 운동 항목 체크리스트 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {day.tasks?.map(task => {
                        const isDone = !!completedTasks[task.id];
                        const isEditing = editingTaskId === task.id;
                        const displayTaskText = customTaskTexts[task.id] || task.text;

                        return (
                          <div
                            key={task.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: isDone ? 'rgba(0, 255, 135, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                              border: isDone ? '1px solid rgba(0, 255, 135, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isEditing ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <input
                                  type="text"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="input-field"
                                  style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveEdit(task.id)}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '6px 10px' }}
                                  title="저장"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '6px 10px' }}
                                  title="취소"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div
                                  onClick={() => toggleTask(task.id)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                                >
                                  <span className={`badge ${task.category === '달리기' ? 'badge-cyan' : task.category === '근력' ? 'badge-orange' : 'badge-purple'}`} style={{ fontSize: '10px' }}>
                                    {task.category}
                                  </span>
                                  <span style={{
                                    fontSize: '13px',
                                    fontWeight: isDone ? '700' : '400',
                                    color: isDone ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    textDecoration: isDone ? 'line-through' : 'none'
                                  }}>
                                    {displayTaskText}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  {/* 목표치 수정 버튼 */}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStartEdit(task); }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--text-muted)',
                                      cursor: 'pointer',
                                      padding: '4px',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                    title="목표치 수정"
                                  >
                                    <Edit3 size={14} />
                                  </button>

                                  {/* 완료 체크 아이콘 */}
                                  <div
                                    onClick={() => toggleTask(task.id)}
                                    style={{ color: isDone ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                                  >
                                    {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7️⃣ 목표 달성을 위한 필수 체력 기준 & 단계별 마일스톤 */}
          {roadmap.capabilityAnalysis && (
            <div style={{
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(96, 239, 255, 0.2)',
              marginTop: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                🎯 필수 체력 기준
              </div>

              {/* 필수 조건 4대 지표 그리드 */}
              <div className="grid-4" style={{ gap: '8px' }}>
                <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>필요 페이스</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis.requirements.req1kPace}
                  </div>
                </div>

                <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>완주 시간</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-secondary)', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis.requirements.req10kRecord}
                  </div>
                </div>

                <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>지속 훈련</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-orange)', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis.requirements.reqLSD}
                  </div>
                </div>

                <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>권장 스쿼트</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffb703', marginTop: '2px' }}>
                    {roadmap.capabilityAnalysis.requirements.reqSquat}
                  </div>
                </div>
              </div>

              {/* 🏆 단계별 완주 마일스톤 */}
              {roadmap.capabilityAnalysis.milestoneTimeline && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    🏁 단계별 마일스톤
                  </div>

                  <div className="grid-4" style={{ gap: '8px' }}>
                    {roadmap.capabilityAnalysis.milestoneTimeline.map((ms, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px',
                          borderRadius: '12px',
                          background: idx === 3 ? 'rgba(0, 255, 135, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: idx === 3 ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: idx === 3 ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                              {ms.period}
                            </span>
                            <span style={{
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              background: idx === 3 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                              color: idx === 3 ? '#000' : 'var(--text-muted)',
                              fontWeight: '700'
                            }}>
                              {ms.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {ms.title}
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: idx === 3 ? 'var(--accent-primary)' : '#ffb703', marginBottom: '6px' }}>
                            🎯 {ms.targetMetric}
                          </div>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                          💡 {ms.focus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
    </>
  )}
</div>
  );
}
