import React, { useState } from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Zap, ArrowUpRight, ArrowDownRight, Clock, Scale } from 'lucide-react';

export function DynamicProgressChart({ forecastData, activePlan }) {
  const [activeTab, setActiveTab] = useState('time'); // 'time' | 'weight'

  if (!forecastData || !forecastData.graphPoints || forecastData.graphPoints.length === 0) {
    return null;
  }

  const {
    overallRate,
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
    predictedFinalWeight,
    weightGraphPoints
  } = forecastData;

  // 차트 좌표 계산 (SVG viewBox: 0 0 640 220)
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = 640 - paddingLeft - paddingRight;
  const chartHeight = 220 - paddingTop - paddingBottom;

  // 1) 시간 차트 Y축 범위 (85분 ~ 55분)
  const minY = 55;
  const maxY = 85;

  const getX = (index, totalLen) => paddingLeft + (index / (totalLen - 1)) * chartWidth;
  const getYTime = (timeMin) => {
    const clamped = Math.max(minY, Math.min(maxY, timeMin));
    return paddingTop + ((maxY - clamped) / (maxY - minY)) * chartHeight;
  };

  // 2) 체중 차트 Y축 범위 (목표 체중 - 2kg ~ 시작 체중 + 2kg)
  const minW = Math.floor(Math.min(targetWeight || 70, predictedFinalWeight || 70) - 2);
  const maxW = Math.ceil(Math.max(startWeight || 75, 80) + 2);

  const getYWeight = (w) => {
    const clamped = Math.max(minW, Math.min(maxW, w));
    return paddingTop + ((maxW - clamped) / (maxW - minW)) * chartHeight;
  };

  // 시간 그래프 경로
  const plannedPath = graphPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, graphPoints.length)} ${getYTime(pt.plannedTime)}`).join(' ');
  const actualPoints = graphPoints.filter(pt => pt.actualTime !== null);
  const actualPath = actualPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, graphPoints.length)} ${getYTime(pt.actualTime)}`).join(' ');
  const forecastPointsList = graphPoints.filter(pt => pt.week >= (currentActiveWeek > 1 ? currentActiveWeek - 1 : 0));
  const forecastPath = forecastPointsList.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, graphPoints.length)} ${getYTime(pt.forecastTime)}`).join(' ');

  // 체중 그래프 경로 (체중 연동 시)
  const hasWeight = includeWeightGoal && weightGraphPoints && weightGraphPoints.length > 0;
  let plannedWeightPath = '';
  let actualWeightPath = '';
  let forecastWeightPath = '';

  if (hasWeight) {
    plannedWeightPath = weightGraphPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, weightGraphPoints.length)} ${getYWeight(pt.plannedWeight)}`).join(' ');
    const actualWPoints = weightGraphPoints.filter(pt => pt.actualWeight !== null);
    actualWeightPath = actualWPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, weightGraphPoints.length)} ${getYWeight(pt.actualWeight)}`).join(' ');
    const forecastWPointsList = weightGraphPoints.filter(pt => pt.week >= (currentActiveWeek > 1 ? currentActiveWeek - 1 : 0));
    forecastWeightPath = forecastWPointsList.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week, weightGraphPoints.length)} ${getYWeight(pt.forecastWeight)}`).join(' ');
  }

  // 상태별 색상 및 텍스트
  let statusColor = 'var(--accent-primary)';
  let statusBg = 'rgba(0, 255, 135, 0.1)';
  let statusTitle = '계획대로 순항 중';
  let statusDesc = activeTab === 'time'
    ? `현재 페이스 유지 시 ${predictedFinishMin}분 완주 예상`
    : `현재 페이스 유지 시 최종 ${predictedFinalWeight}kg 달성 예상`;

  if (forecastStatus === 'ahead') {
    statusColor = '#60efff';
    statusBg = 'rgba(96, 239, 255, 0.12)';
    statusTitle = '🔥 초과 달성 중';
    statusDesc = activeTab === 'time'
      ? `완주 시간 ${predictedFinishMin}분 (${predictedFinishPace})으로 단축 예상`
      : `초과 감량 예상: 최종 ${predictedFinalWeight}kg`;
  } else if (forecastStatus === 'behind') {
    statusColor = '#ff6b6b';
    statusBg = 'rgba(255, 107, 107, 0.12)';
    statusTitle = '⚠️ 실천 지연 주의';
    statusDesc = activeTab === 'time'
      ? `완주 시간 ${predictedFinishMin}분으로 지연 예상`
      : `감량 지연 예상: 최종 ${predictedFinalWeight}kg`;
  }

  // 체중 눈금 생성 (minW ~ maxW 간격)
  const weightStep = Math.max(1, Math.round((maxW - minW) / 4));
  const weightTicks = [];
  for (let w = minW; w <= maxW; w += weightStep) {
    weightTicks.push(w);
  }

  return (
    <div className="card-glass" style={{ padding: '20px', marginBottom: '20px' }}>
      {/* 탭 전환 버튼 (체중 목표가 설정된 경우 노출) */}
      {hasWeight && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('time')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'time' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'time' ? '#000' : 'var(--text-secondary)',
              border: activeTab === 'time' ? 'none' : '1px solid var(--border-glass)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🏃 완주 시간 & 페이스 궤적</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weight')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'weight' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'weight' ? '#000' : 'var(--text-secondary)',
              border: activeTab === 'weight' ? 'none' : '1px solid var(--border-glass)',
              transition: 'all 0.2s ease'
            }}
          >
            <Scale size={13} />
            <span>⚖️ 체중 감량 궤적 ({startWeight}kg ➔ {targetWeight}kg)</span>
          </button>
        </div>
      )}

      {/* 1. 상단 예측 요약 대시보드 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: '800' }}>
              {activeTab === 'time' ? '📊 계획 vs 실천 완주시간 예측선' : '⚖️ 체중 감량 예측 & 실천 궤적'}
            </span>
            <span className="badge" style={{ backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusColor}40`, fontSize: '11px' }}>
              {statusTitle}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{statusDesc}</p>
        </div>

        {/* 3대 핵심 예측 수치 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'time' ? (
            <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AI 예측 10km 완주</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: statusColor }}>
                {predictedFinishMin}분
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{predictedFinishPace}</div>
            </div>
          ) : (
            <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AI 예측 최종 체중</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: statusColor }}>
                {predictedFinalWeight} kg
              </div>
              <div style={{ fontSize: '10px', color: 'var(--accent-primary)' }}>목표 {targetWeight}kg (-{(startWeight - targetWeight).toFixed(1)}kg)</div>
            </div>
          )}

          <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>목표 달성 확률</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: achievementProbability >= 80 ? 'var(--accent-primary)' : achievementProbability >= 60 ? '#ffb703' : '#ff6b6b' }}>
              {achievementProbability}%
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>실천율 {overallRate}%</div>
          </div>
        </div>
      </div>

      {/* 2. SVG 그래프 영역 */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox="0 0 640 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={statusColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {activeTab === 'time' ? (
            /* [시간 그래프 렌더링] */
            <>
              {[80, 75, 70, 65, 60].map(val => (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={getYTime(val)}
                    x2={640 - paddingRight}
                    y2={getYTime(val)}
                    stroke="rgba(255, 255, 255, 0.07)"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={getYTime(val) + 4}
                    fill="var(--text-muted)"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {val}분
                  </text>
                </g>
              ))}

              {graphPoints.map((pt, i) => (
                <text
                  key={i}
                  x={getX(i, graphPoints.length)}
                  y={220 - 10}
                  fill={i === currentActiveWeek ? 'var(--accent-primary)' : 'var(--text-muted)'}
                  fontSize="10"
                  fontWeight={i === currentActiveWeek ? '800' : '400'}
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              ))}

              <path d={plannedPath} fill="none" stroke="rgba(96, 239, 255, 0.45)" strokeWidth="2" strokeDasharray="5,5" />
              {forecastPath && <path d={forecastPath} fill="none" stroke={statusColor} strokeWidth="2.5" strokeDasharray="4,3" filter="url(#glowEffect)" />}
              {actualPath && <path d={actualPath} fill="none" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" />}

              {graphPoints.map((pt, i) => {
                const hasActual = pt.actualTime !== null;
                const x = getX(i, graphPoints.length);
                const y = hasActual ? getYTime(pt.actualTime) : getYTime(pt.forecastTime);

                return (
                  <g key={i}>
                    <circle cx={x} cy={getYTime(pt.plannedTime)} r="3" fill="rgba(96, 239, 255, 0.6)" />
                    <circle cx={x} cy={y} r={i === currentActiveWeek ? "6" : "4"} fill={hasActual ? 'var(--accent-primary)' : statusColor} stroke="#0a0d14" strokeWidth="2" />
                    {i === currentActiveWeek && (
                      <circle cx={x} cy={y} r="9" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
                    )}
                  </g>
                );
              })}
            </>
          ) : (
            /* [체중 감량 그래프 렌더링] */
            <>
              {weightTicks.map(val => (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={getYWeight(val)}
                    x2={640 - paddingRight}
                    y2={getYWeight(val)}
                    stroke="rgba(255, 255, 255, 0.07)"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={getYWeight(val) + 4}
                    fill="var(--text-muted)"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {val}kg
                  </text>
                </g>
              ))}

              {weightGraphPoints.map((pt, i) => (
                <text
                  key={i}
                  x={getX(i, weightGraphPoints.length)}
                  y={220 - 10}
                  fill={i === currentActiveWeek ? 'var(--accent-primary)' : 'var(--text-muted)'}
                  fontSize="10"
                  fontWeight={i === currentActiveWeek ? '800' : '400'}
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              ))}

              <path d={plannedWeightPath} fill="none" stroke="rgba(96, 239, 255, 0.45)" strokeWidth="2" strokeDasharray="5,5" />
              {forecastWeightPath && <path d={forecastWeightPath} fill="none" stroke={statusColor} strokeWidth="2.5" strokeDasharray="4,3" filter="url(#glowEffect)" />}
              {actualWeightPath && <path d={actualWeightPath} fill="none" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" />}

              {weightGraphPoints.map((pt, i) => {
                const hasActual = pt.actualWeight !== null;
                const x = getX(i, weightGraphPoints.length);
                const y = hasActual ? getYWeight(pt.actualWeight) : getYWeight(pt.forecastWeight);

                return (
                  <g key={i}>
                    <circle cx={x} cy={getYWeight(pt.plannedWeight)} r="3" fill="rgba(96, 239, 255, 0.6)" />
                    <circle cx={x} cy={y} r={i === currentActiveWeek ? "6" : "4"} fill={hasActual ? 'var(--accent-primary)' : statusColor} stroke="#0a0d14" strokeWidth="2" />
                    {i === currentActiveWeek && (
                      <circle cx={x} cy={y} r="9" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
                    )}
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* 3. 차트 범례 & 가이드 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '12px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '2px', backgroundColor: 'rgba(96, 239, 255, 0.7)', display: 'inline-block' }} />
          <span>목표 계획선</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '3px', backgroundColor: 'var(--accent-primary)', display: 'inline-block' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>현재 실천선</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '2px', borderBottom: `2px dashed ${statusColor}`, display: 'inline-block' }} />
          <span style={{ color: statusColor, fontWeight: '700' }}>AI 동적 예측 궤적</span>
        </div>
      </div>
    </div>
  );
}
