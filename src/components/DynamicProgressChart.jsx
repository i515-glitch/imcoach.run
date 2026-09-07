import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Zap, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export function DynamicProgressChart({ forecastData, activePlan, activePlanId = 'plan2', allPlans = {} }) {
  if (!forecastData) {
    return null;
  }

  const {
    overallRate = 0,
    forecastStatus = 'on_track',
    targetTimeMin = 60,
    predictedFinishMin = 60,
    predictedFinishPace = '6:00 / km',
    achievementProbability = 85,
    currentActiveWeek = 1,
    graphPoints = []
  } = forecastData;

  // 1안, 2안, 3안 정보 추출 및 가장 긴 3안 기준 총 주차 산출
  const p1 = allPlans?.plan1;
  const p2 = allPlans?.plan2;
  const p3 = allPlans?.plan3;

  const w1 = p1?.totalWeeks || 6;
  const w2 = p2?.totalWeeks || 12;
  const w3 = p3?.totalWeeks || 16;
  const maxWeeks = Math.max(w1, w2, w3, 16);

  // 차트 좌표 계산 (SVG viewBox: 0 0 680 245)
  const paddingLeft = 54;
  const paddingRight = 32;
  const paddingTop = 32;
  const paddingBottom = 36;

  const chartWidth = 680 - paddingLeft - paddingRight;
  const chartHeight = 245 - paddingTop - paddingBottom;

  // X축 좌표 변환 함수 (0주 ~ maxWeeks)
  const getX = (week) => paddingLeft + (week / maxWeeks) * chartWidth;

  // Y축 범위 계산 (시간: 완주 시간 단축 그래프)
  // 1안, 2안, 3안 모두 시작 시간(tStart, 느림)에서 목표 완주 시간(targetTimeMin, 빠름)으로 우하향 단축됩니다.
  const t1 = targetTimeMin;
  const t2 = targetTimeMin;
  const t3 = targetTimeMin;
  const tStart = graphPoints[0]?.plannedTime || targetTimeMin + 25;

  const minY = Math.max(10, Math.min(targetTimeMin, predictedFinishMin) - 5);
  const maxY = Math.max(tStart + 5, targetTimeMin + 30);

  const getYTime = (timeMin) => {
    const clamped = Math.max(minY, Math.min(maxY, timeMin));
    return paddingTop + ((maxY - clamped) / (maxY - minY)) * chartHeight;
  };

  // 1안, 2안, 3안 3가지 계획 곡선 생성 (모두 우하향 시간 단축 곡선)
  // 1안: 6주 단기 집중 단축 (가파른 하향)
  const plan1Points = [];
  for (let w = 0; w <= w1; w++) {
    const val = tStart - (tStart - t1) * (w / w1);
    plan1Points.push({ week: w, time: val });
  }
  const plan1Path = plan1Points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week)} ${getYTime(pt.time)}`).join(' ');

  // 2안: 12주 표준 주기화 단축 (적정 하향)
  const plan2Points = [];
  for (let w = 0; w <= w2; w++) {
    const val = tStart - (tStart - t2) * (w / w2);
    plan2Points.push({ week: w, time: val });
  }
  const plan2Path = plan2Points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week)} ${getYTime(pt.time)}`).join(' ');

  // 3안: 16주 가장 여유롭고 안전한 점진적 단축 (완만한 하향)
  const plan3Points = [];
  for (let w = 0; w <= w3; w++) {
    const val = tStart - (tStart - t3) * (w / w3);
    plan3Points.push({ week: w, time: val });
  }
  const plan3Path = plan3Points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week)} ${getYTime(pt.time)}`).join(' ');

  // 선택된 안의 실제 실행선 & 예측선 포개어 생성 (Overlay)
  const activePlanWeeks = activePlanId === 'plan1' ? w1 : activePlanId === 'plan3' ? w3 : w2;

  // 실제 실행된 포인트 (0주부터 currentActiveWeek까지)
  const actualPoints = graphPoints.filter(pt => pt.actualTime !== null && pt.week <= activePlanWeeks);
  const actualPath = actualPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week)} ${getYTime(pt.actualTime)}`).join(' ');

  // 앞으로의 AI 동적 예측선 (currentActiveWeek부터 activePlanWeeks까지 우하향)
  const forecastPoints = [];
  const startWeekForForecast = Math.max(0, currentActiveWeek - 1);
  const startValForForecast = graphPoints[startWeekForForecast]?.actualTime || tStart;
  for (let w = startWeekForForecast; w <= activePlanWeeks; w++) {
    const ratio = (w - startWeekForForecast) / Math.max(1, activePlanWeeks - startWeekForForecast);
    const fTime = startValForForecast - (startValForForecast - predictedFinishMin) * ratio;
    forecastPoints.push({ week: w, time: fTime });
  }
  const forecastPath = forecastPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.week)} ${getYTime(pt.time)}`).join(' ');

  // 상태별 색상 및 텍스트
  let statusColor = 'var(--accent-primary)';
  let statusBg = 'rgba(0, 255, 135, 0.1)';
  let statusTitle = '순항 중';

  if (forecastStatus === 'ahead') {
    statusColor = '#60efff';
    statusBg = 'rgba(96, 239, 255, 0.12)';
    statusTitle = '초과 달성';
  } else if (forecastStatus === 'behind') {
    statusColor = '#ff6b6b';
    statusBg = 'rgba(255, 107, 107, 0.12)';
    statusTitle = '지연 주의';
  }

  // Y축 시간 눈금 (5개)
  const timeStep = Math.max(5, Math.round((maxY - minY) / 4));
  const timeTicks = [];
  for (let t = minY + 5; t <= maxY; t += timeStep) {
    timeTicks.push(t);
  }

  return (
    <div className="card-glass" style={{ padding: '16px', marginBottom: '16px' }}>
      {/* 1. 상단 예측 요약 대시보드 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
            📊 1·2·3안 전체 로드맵 & 실행 예측
          </span>
          <span className="badge" style={{ backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusColor}40`, fontSize: '11px', fontWeight: '800' }}>
            {statusTitle}
          </span>
        </div>

        {/* 2대 핵심 예측 수치 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.45)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>예상 완주</div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: statusColor, marginTop: '1px' }}>
              {predictedFinishMin}분
            </div>
          </div>

          <div style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.45)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>달성 확률</div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: achievementProbability >= 80 ? 'var(--accent-primary)' : achievementProbability >= 60 ? '#ffb703' : '#ff6b6b', marginTop: '1px' }}>
              {achievementProbability}%
            </div>
          </div>
        </div>
      </div>

      {/* 2. SVG 통합 다이나믹 로드맵 그래프 (1·2·3안 전체 기간 칸수 & 3선 + 실행 오버레이) */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox="0 0 680 245" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={statusColor} floodOpacity="0.8" />
            </filter>
            <filter id="glowWhite" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* 1) Y축 가로 눈금선 & 라벨 (글자 크기 및 가독성 대폭 향상) */}
          {timeTicks.map(val => (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={getYTime(val)}
                x2={680 - paddingRight}
                y2={getYTime(val)}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="3,3"
              />
              <text
                x={paddingLeft - 8}
                y={getYTime(val) + 4}
                fill="rgba(255, 255, 255, 0.8)"
                fontSize="11.5"
                fontWeight="700"
                textAnchor="end"
              >
                {val}분
              </text>
            </g>
          ))}

          {/* 2) X축 전체 기간 칸수(0주 ~ maxWeeks) 세로 눈금선 및 주차 라벨 (글자 크기 확대) */}
          {Array.from({ length: maxWeeks + 1 }, (_, i) => i).map(w => {
            const x = getX(w);
            const isMilestone = w === w1 || w === w2 || w === w3;
            return (
              <g key={w}>
                {/* 배경 세로 격자선 (모든 기간 칸수) */}
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartHeight}
                  stroke={isMilestone ? 'transparent' : 'rgba(255, 255, 255, 0.06)'}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                {/* X축 주차 텍스트 */}
                <text
                  x={x}
                  y={245 - 10}
                  fill={w === currentActiveWeek ? 'var(--accent-primary)' : isMilestone ? '#ffffff' : 'rgba(255, 255, 255, 0.75)'}
                  fontSize="11"
                  fontWeight={w === currentActiveWeek || isMilestone ? '900' : '600'}
                  textAnchor="middle"
                >
                  {w === 0 ? '시작' : `${w}주`}
                </text>
              </g>
            );
          })}

          {/* 3) 1안, 2안, 3안 기간 구분선 & 상단 뱃지 (글자 크기 및 가독성 개선) */}
          {/* 1안 구분선 (w1주) */}
          <line
            x1={getX(w1)}
            y1={paddingTop - 8}
            x2={getX(w1)}
            y2={paddingTop + chartHeight}
            stroke="#64d2ff"
            strokeWidth="1.5"
            strokeDasharray="4,3"
            opacity="0.85"
          />
          <rect
            x={getX(w1) - 32}
            y={paddingTop - 27}
            width="64"
            height="18"
            rx="5"
            fill="rgba(100, 210, 255, 0.25)"
            stroke="#64d2ff"
            strokeWidth="1.2"
          />
          <text
            x={getX(w1)}
            y={paddingTop - 14}
            fill="#64d2ff"
            fontSize="10.5"
            fontWeight="900"
            textAnchor="middle"
          >
            1안({w1}주)
          </text>

          {/* 2안 구분선 (w2주) */}
          <line
            x1={getX(w2)}
            y1={paddingTop - 8}
            x2={getX(w2)}
            y2={paddingTop + chartHeight}
            stroke="#00ff87"
            strokeWidth="1.5"
            strokeDasharray="4,3"
            opacity="0.85"
          />
          <rect
            x={getX(w2) - 35}
            y={paddingTop - 27}
            width="70"
            height="18"
            rx="5"
            fill="rgba(0, 255, 135, 0.25)"
            stroke="#00ff87"
            strokeWidth="1.2"
          />
          <text
            x={getX(w2)}
            y={paddingTop - 14}
            fill="#00ff87"
            fontSize="10.5"
            fontWeight="900"
            textAnchor="middle"
          >
            2안({w2}주)★
          </text>

          {/* 3안 구분선 (w3주) */}
          <line
            x1={getX(w3)}
            y1={paddingTop - 8}
            x2={getX(w3)}
            y2={paddingTop + chartHeight}
            stroke="#ffb703"
            strokeWidth="1.5"
            strokeDasharray="4,3"
            opacity="0.85"
          />
          <rect
            x={getX(w3) - 32}
            y={paddingTop - 27}
            width="64"
            height="18"
            rx="5"
            fill="rgba(255, 183, 3, 0.25)"
            stroke="#ffb703"
            strokeWidth="1.2"
          />
          <text
            x={getX(w3)}
            y={paddingTop - 14}
            fill="#ffb703"
            fontSize="10.5"
            fontWeight="900"
            textAnchor="middle"
          >
            3안({w3}주)
          </text>

          {/* 4) 3가지 계획선 동시 렌더링 */}
          {/* 3안 계획선 (0 ~ w3주) */}
          <path
            d={plan3Path}
            fill="none"
            stroke="#ffb703"
            strokeWidth={activePlanId === 'plan3' ? '2.5' : '1.5'}
            strokeDasharray="5,4"
            opacity={activePlanId === 'plan3' ? '1' : '0.45'}
          />
          <circle cx={getX(w3)} cy={getYTime(t3)} r="3.5" fill="#ffb703" />

          {/* 2안 계획선 (0 ~ w2주) */}
          <path
            d={plan2Path}
            fill="none"
            stroke="#00ff87"
            strokeWidth={activePlanId === 'plan2' ? '2.5' : '1.5'}
            strokeDasharray="5,4"
            opacity={activePlanId === 'plan2' ? '1' : '0.45'}
          />
          <circle cx={getX(w2)} cy={getYTime(t2)} r="3.5" fill="#00ff87" />

          {/* 1안 계획선 (0 ~ w1주) */}
          <path
            d={plan1Path}
            fill="none"
            stroke="#64d2ff"
            strokeWidth={activePlanId === 'plan1' ? '2.5' : '1.5'}
            strokeDasharray="5,4"
            opacity={activePlanId === 'plan1' ? '1' : '0.45'}
          />
          <circle cx={getX(w1)} cy={getYTime(t1)} r="3.5" fill="#64d2ff" />

          {/* 5) 선택한 안의 실제 실행선 & 예측선 포개어 렌더링 (Overlay) */}
          {/* 예측 궤적 점선 (현재 활성 주차 ~ 해당 안의 종료주차) */}
          {forecastPath && (
            <path
              d={forecastPath}
              fill="none"
              stroke={statusColor}
              strokeWidth="2.8"
              strokeDasharray="4,3"
              filter="url(#glowEffect)"
            />
          )}

          {/* 실제 실천 실선 (0주 ~ 현재 활성 주차) */}
          {actualPath && (
            <path
              d={actualPath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glowWhite)"
            />
          )}

          {/* 현재 진행 주차 강조 펄스 포인트 */}
          {actualPoints.map((pt, i) => (
            <circle
              key={i}
              cx={getX(pt.week)}
              cy={getYTime(pt.actualTime)}
              r="4"
              fill="#ffffff"
              stroke="#0a0d14"
              strokeWidth="2"
            />
          ))}

          {/* 현재 기준 위치 펄스 마커 */}
          <g>
            <circle
              cx={getX(currentActiveWeek)}
              cy={getYTime(graphPoints[currentActiveWeek]?.forecastTime || graphPoints[currentActiveWeek]?.plannedTime || tStart)}
              r="7"
              fill={statusColor}
              opacity="0.9"
            />
            <circle
              cx={getX(currentActiveWeek)}
              cy={getYTime(graphPoints[currentActiveWeek]?.forecastTime || graphPoints[currentActiveWeek]?.plannedTime || tStart)}
              r="11"
              fill="none"
              stroke={statusColor}
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.7"
            />
          </g>
        </svg>
      </div>

      {/* 3. 통합 범례 & 안내 바 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        flexWrap: 'wrap',
        fontSize: '12px'
      }}>
        {/* 1안 범례 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: activePlanId === 'plan1' ? 1 : 0.65 }}>
          <span style={{ width: '14px', height: '2px', borderBottom: '2.5px dashed #64d2ff', display: 'inline-block' }} />
          <span style={{ color: '#64d2ff', fontWeight: '800' }}>1안({w1}주)</span>
        </div>

        {/* 2안 범례 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: activePlanId === 'plan2' ? 1 : 0.65 }}>
          <span style={{ width: '14px', height: '2px', borderBottom: '2.5px dashed #00ff87', display: 'inline-block' }} />
          <span style={{ color: '#00ff87', fontWeight: '800' }}>2안({w2}주)★</span>
        </div>

        {/* 3안 범례 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: activePlanId === 'plan3' ? 1 : 0.65 }}>
          <span style={{ width: '14px', height: '2px', borderBottom: '2.5px dashed #ffb703', display: 'inline-block' }} />
          <span style={{ color: '#ffb703', fontWeight: '800' }}>3안({w3}주)</span>
        </div>

        {/* 포개진 실행 & 예측 범례 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '8px' }}>
          <span style={{ width: '12px', height: '3.5px', backgroundColor: '#ffffff', display: 'inline-block', borderRadius: '2px' }} />
          <span style={{ color: '#ffffff', fontWeight: '800' }}>선택한 {activePlanId === 'plan1' ? '1안' : activePlanId === 'plan3' ? '3안' : '2안'} 실행포개짐</span>
        </div>
      </div>
    </div>
  );
}
