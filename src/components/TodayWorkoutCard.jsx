import React, { useState } from 'react';
import { CheckCircle2, Circle, Edit3, Check, X, Flame, Trophy, Calendar, Sparkles, ChevronRight, TrendingUp, Scale, Clock } from 'lucide-react';

export function TodayWorkoutCard({
  basePlan,
  forecastData,
  weeklyAdvice,
  completedTasks,
  customTaskTexts,
  onToggleTask,
  onStartEdit,
  editingTaskId,
  editingText,
  setEditingText,
  onSaveEdit,
  onCancelEdit,
  onViewFullRoadmap
}) {
  const [chartTab, setChartTab] = useState('time'); // 'time' | 'weight'

  // 오늘 요일 계산 (0: 일, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토)
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const todayIdx = new Date().getDay();
  const todayName = dayNames[todayIdx];

  // 1주차의 오늘 요일 운동 찾기 (없으면 첫번째 운동일)
  const week1 = basePlan?.weeksChecklist?.[0];
  let todayDayData = week1?.days?.find(d => d.dayName === todayName);
  if (!todayDayData && week1?.days) {
    todayDayData = week1.days.find(d => d.tasks && d.tasks.length > 0) || week1.days[0];
  }

  const tasks = todayDayData?.tasks || [];
  const completedTodayCount = tasks.filter(t => completedTasks[t.id]).length;
  const isAllDone = tasks.length > 0 && completedTodayCount === tasks.length;
  const todayProgress = tasks.length > 0 ? Math.round((completedTodayCount / tasks.length) * 100) : 0;

  const todayDateStr = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  // 차트 데이터 (컴팩트 SVG 렌더링)
  const graphPoints = forecastData?.graphPoints || [];
  const weightGraphPoints = forecastData?.weightGraphPoints || [];
  const hasWeight = forecastData?.includeWeightGoal && weightGraphPoints.length > 0;

  // 컴팩트 차트 좌표 (viewBox: 0 0 420 140)
  const padL = 35;
  const padR = 20;
  const padT = 15;
  const padB = 25;
  const cWidth = 420 - padL - padR;
  const cHeight = 140 - padT - padB;

  const minY = 55;
  const maxY = 85;
  const getX = (idx, total) => padL + (idx / Math.max(1, total - 1)) * cWidth;
  const getYTime = (t) => padT + ((maxY - Math.max(minY, Math.min(maxY, t))) / (maxY - minY)) * cHeight;

  const minW = Math.floor(Math.min(forecastData?.targetWeight || 70, forecastData?.predictedFinalWeight || 70) - 2);
  const maxW = Math.ceil(Math.max(forecastData?.startWeight || 75, 80) + 2);
  const getYWeight = (w) => padT + ((maxW - Math.max(minW, Math.min(maxW, w))) / (maxW - minW)) * cHeight;

  // 시간선 경로
  const plannedTimePath = graphPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, graphPoints.length)} ${getYTime(pt.plannedTime)}`).join(' ');
  const actualTimePoints = graphPoints.filter(pt => pt.actualTime !== null);
  const actualTimePath = actualTimePoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, graphPoints.length)} ${getYTime(pt.actualTime)}`).join(' ');
  const forecastTimePoints = graphPoints.filter(pt => pt.week >= (forecastData?.currentActiveWeek > 1 ? forecastData.currentActiveWeek - 1 : 0));
  const forecastTimePath = forecastTimePoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, graphPoints.length)} ${getYTime(pt.forecastTime)}`).join(' ');

  // 체중선 경로
  let plannedWeightPath = '';
  let actualWeightPath = '';
  let forecastWeightPath = '';
  if (hasWeight) {
    plannedWeightPath = weightGraphPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, weightGraphPoints.length)} ${getYWeight(pt.plannedWeight)}`).join(' ');
    const actualWPoints = weightGraphPoints.filter(pt => pt.actualWeight !== null);
    actualWeightPath = actualWPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, weightGraphPoints.length)} ${getYWeight(pt.actualWeight)}`).join(' ');
    const forecastWPoints = weightGraphPoints.filter(pt => pt.week >= (forecastData?.currentActiveWeek > 1 ? forecastData.currentActiveWeek - 1 : 0));
    forecastWeightPath = forecastWPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, weightGraphPoints.length)} ${getYWeight(pt.forecastWeight)}`).join(' ');
  }

  const statusColor = forecastData?.forecastStatus === 'ahead' ? '#60efff' : forecastData?.forecastStatus === 'behind' ? '#ff6b6b' : 'var(--accent-primary)';

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* 🍎 Apple Fitness Style Inset Container */}
      <div style={{
        padding: '20px 18px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
        background: 'rgba(28, 28, 30, 0.95)',
        backdropFilter: 'blur(20px)'
      }}>

        {/* ======================================================== */}
        {/* 1️⃣ [맨 위] 오늘의 코칭 (Apple Summary Card) */}
        {/* ======================================================== */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '18px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: weeklyAdvice?.color || 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                DAILY COACHING
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{todayDateStr}</span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
            {weeklyAdvice?.title}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: '1.4' }}>
            {weeklyAdvice?.desc}
          </p>
        </div>

        {/* ======================================================== */}
        {/* 2️⃣ [중간] 목표 달성 동적 예측 그래프 (Apple Health Chart) */}
        {/* ======================================================== */}
        <div style={{
          padding: '14px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '14px'
        }}>
          {/* 차트 헤더 & 탭 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                목표 예측 궤적
              </span>
            </div>

            {hasWeight && (
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setChartTab('time')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: chartTab === 'time' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: chartTab === 'time' ? '#000' : 'var(--text-muted)',
                    border: 'none'
                  }}
                >
                  완주시간
                </button>
                <button
                  type="button"
                  onClick={() => setChartTab('weight')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: chartTab === 'weight' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: chartTab === 'weight' ? '#000' : 'var(--text-muted)',
                    border: 'none'
                  }}
                >
                  체중 감량
                </button>
              </div>
            )}
          </div>

          {/* 컴팩트 SVG 차트 */}
          <svg viewBox="0 0 420 140" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* 그리드 */}
            {(chartTab === 'time' ? [80, 70, 60] : [75, 72, 70]).map(val => (
              <g key={val}>
                <line
                  x1={padL}
                  y1={chartTab === 'time' ? getYTime(val) : getYWeight(val)}
                  x2={420 - padR}
                  y2={chartTab === 'time' ? getYTime(val) : getYWeight(val)}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="3,3"
                />
                <text
                  x={padL - 4}
                  y={(chartTab === 'time' ? getYTime(val) : getYWeight(val)) + 3}
                  fill="var(--text-muted)"
                  fontSize="9"
                  textAnchor="end"
                >
                  {val}{chartTab === 'time' ? '분' : 'kg'}
                </text>
              </g>
            ))}

            {/* X축 레이블 */}
            {graphPoints.map((pt, i) => (
              <text
                key={i}
                x={getX(i, graphPoints.length)}
                y={140 - 6}
                fill={i === (forecastData?.currentActiveWeek || 1) ? 'var(--accent-primary)' : 'var(--text-muted)'}
                fontSize="9"
                fontWeight={i === (forecastData?.currentActiveWeek || 1) ? '800' : '400'}
                textAnchor="middle"
              >
                {pt.label}
              </text>
            ))}

            {chartTab === 'time' ? (
              <>
                <path d={plannedTimePath} fill="none" stroke="rgba(96, 239, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
                {forecastTimePath && <path d={forecastTimePath} fill="none" stroke={statusColor} strokeWidth="2" strokeDasharray="3,3" />}
                {actualTimePath && <path d={actualTimePath} fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" />}
              </>
            ) : (
              <>
                <path d={plannedWeightPath} fill="none" stroke="rgba(96, 239, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
                {forecastWeightPath && <path d={forecastWeightPath} fill="none" stroke={statusColor} strokeWidth="2" strokeDasharray="3,3" />}
                {actualWeightPath && <path d={actualWeightPath} fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" />}
              </>
            )}
          </svg>

          {/* 실시간 예측 요약 바 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {chartTab === 'time' ? '예상 완주 시간' : '예상 최종 체중'}
            </span>
            <span style={{ fontWeight: '800', color: statusColor }}>
              {chartTab === 'time' ? `${forecastData?.predictedFinishMin || 60}분 (${forecastData?.predictedFinishPace || '6:00/km'})` : `${forecastData?.predictedFinalWeight || 70} kg`}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3️⃣ [아래] 오늘의 운동 체크리스트 */}
        {/* ======================================================== */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={15} color="var(--accent-primary)" />
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                오늘의 운동
              </span>
              <span className="badge badge-green" style={{ fontSize: '10px', padding: '2px 6px' }}>
                {todayDayData?.dayName || todayName}
              </span>
            </div>

            <span style={{ fontSize: '12px', fontWeight: '700', color: isAllDone ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
              {completedTodayCount} / {tasks.length} 완료 ({todayProgress}%)
            </span>
          </div>

          {/* 체크리스트 항목들 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.map((task) => {
              const isCompleted = !!completedTasks[task.id];
              const isEditing = editingTaskId === task.id;
              const displayText = customTaskTexts[task.id] || task.text;

              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: isCompleted ? 'rgba(0, 255, 135, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: isCompleted ? '1px solid rgba(0, 255, 135, 0.3)' : '1px solid var(--border-glass)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* 체크박스 & 운동명 */}
                  <div
                    onClick={() => !isEditing && onToggleTask(task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flex: 1,
                      cursor: isEditing ? 'default' : 'pointer'
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: isCompleted ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Circle size={20} />}
                    </button>

                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                        <input
                          type="text"
                          className="input-glass"
                          style={{ padding: '4px 8px', fontSize: '13px', width: '100%' }}
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => onSaveEdit(task.id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <Check size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <span style={{
                        fontSize: '13px',
                        fontWeight: isCompleted ? '500' : '600',
                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isCompleted ? 'line-through' : 'none'
                      }}>
                        {displayText}
                      </span>
                    )}
                  </div>

                  {/* ✏️ 수정 버튼 */}
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => onStartEdit(task)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        opacity: 0.6
                      }}
                      title="목표치 수정"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 100% 완료 배너 */}
        {isAllDone && (
          <div style={{
            padding: '12px',
            background: 'rgba(0, 255, 135, 0.12)',
            borderRadius: '12px',
            border: '1px solid var(--accent-primary)',
            textAlign: 'center',
            marginBottom: '14px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-primary)' }}>
              🎉 오늘 운동 완료!
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              예측 궤적에 실시간 반영되었습니다.
            </div>
          </div>
        )}

        {/* 📖 공식 레퍼런스 코칭 가이드 안내 배지 */}
        <div style={{
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '10px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          fontSize: '10px',
          color: 'var(--text-muted)'
        }}>
          <span>📖 코칭 기준: 잭 대니얼스 VDOT 5대 페이스 & 피칭어 4단계 주기화</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>공식 표준</span>
        </div>

        {/* 하단: 전체 로드맵 & 3안 스케줄 보기 버튼 */}
        <button
          type="button"
          onClick={onViewFullRoadmap}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '14px',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🗺️ 전체 3안 로드맵 & 상세 스케줄 보기</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
