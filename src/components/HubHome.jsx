import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight, Zap, Sparkles, TrendingUp, Activity, CheckCircle2, Search, Compass } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'sports', label: '스포츠 & 피트니스' },
  { id: 'music', label: '음악 & 악기' },
  { id: 'life', label: '라이프 & 테크' }
];

const SERVICES = [
  {
    id: 'run',
    category: 'sports',
    icon: '🏃',
    title: 'RUN',
    sub: '러닝 & 마라톤',
    desc: '10K · 하프 · 풀코스 목표 완주 시간 역산 AI 코치',
    tags: ['3안 로드맵', '실시간 예측선', '1일 1장 체크리스트'],
    status: 'LIVE',
    statusBg: 'rgba(48, 209, 88, 0.15)',
    statusColor: '#30d158',
    cardBorder: 'rgba(48, 209, 88, 0.4)',
    accentGradient: 'linear-gradient(135deg, rgba(48, 209, 88, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
    btnBg: 'var(--accent-primary)',
    btnColor: '#000000',
    btnText: '러닝 코칭 입장하기',
    isLive: true
  },
  {
    id: 'fit',
    category: 'sports',
    icon: '💪',
    title: 'FIT',
    sub: '헬스 & 맨몸운동',
    desc: '턱걸이 10개 · 체지방 감량 · 3대 운동 점진적 과부하 루틴',
    tags: ['1RM 분할 설계', '체성분 변화 예측', '홈트 & 헬스'],
    status: 'NEXT LAUNCH',
    statusBg: 'rgba(56, 189, 248, 0.15)',
    statusColor: '#38bdf8',
    cardBorder: 'rgba(56, 189, 248, 0.3)',
    accentGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.06) 100%)',
    btnBg: 'rgba(255, 255, 255, 0.06)',
    btnColor: '#38bdf8',
    btnText: '다음 주 오픈 예정',
    isLive: false
  },
  {
    id: 'board',
    category: 'sports',
    icon: '🛹',
    title: 'BOARD',
    sub: '스케이트 & 스노우보드',
    desc: '스케이트보드 알리(Ollie) · 스노우보드 카빙 턴 트릭 정복',
    tags: ['기술 마디 분할', '자세 밸런스', '영상 피드백'],
    status: 'SCHEDULED',
    statusBg: 'rgba(245, 158, 11, 0.15)',
    statusColor: '#f59e0b',
    cardBorder: 'rgba(245, 158, 11, 0.25)',
    accentGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
    btnBg: 'rgba(255, 255, 255, 0.06)',
    btnColor: 'var(--text-muted)',
    btnText: '출시 준비 중',
    isLive: false
  },
  {
    id: 'drum',
    category: 'music',
    icon: '🥁',
    title: 'DRUM',
    sub: '드럼 비트 트레이닝',
    desc: '목표 BPM 8비트 · 16비트 완곡 비트 메트로놈 역산 트레이닝',
    tags: ['BPM 역산 속도', '마디별 분할 코칭', '스트로크 루틴'],
    status: 'SCHEDULED',
    statusBg: 'rgba(244, 63, 94, 0.15)',
    statusColor: '#f43f5e',
    cardBorder: 'rgba(244, 63, 94, 0.25)',
    accentGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
    btnBg: 'rgba(255, 255, 255, 0.06)',
    btnColor: 'var(--text-muted)',
    btnText: '출시 준비 중',
    isLive: false
  },
  {
    id: 'guitar',
    category: 'music',
    icon: '🎸',
    title: 'GUITAR',
    sub: '통기타 & 일렉',
    desc: '코드 체인지 마스터 & 16비트 스트로크 완곡 4주 코칭',
    tags: ['코드 전환 역산', '스트로크 리듬', '인기곡 악보'],
    status: 'SCHEDULED',
    statusBg: 'rgba(168, 85, 247, 0.15)',
    statusColor: '#a855f7',
    cardBorder: 'rgba(168, 85, 247, 0.25)',
    accentGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
    btnBg: 'rgba(255, 255, 255, 0.06)',
    btnColor: 'var(--text-muted)',
    btnText: '출시 준비 중',
    isLive: false
  },
  {
    id: 'kfood',
    category: 'life',
    icon: '🍲',
    title: 'K-FOOD',
    sub: '한식 쿠킹 마스터',
    desc: '외국인 친구도 반하는 K-요리 황금 레시피 4주 완성 코칭',
    tags: ['양념 황금비율', '단계별 레시피 역산', '한상차림 완성'],
    status: 'SCHEDULED',
    statusBg: 'rgba(234, 179, 8, 0.15)',
    statusColor: '#eab308',
    cardBorder: 'rgba(234, 179, 8, 0.25)',
    accentGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)',
    btnBg: 'rgba(255, 255, 255, 0.06)',
    btnColor: 'var(--text-muted)',
    btnText: '출시 준비 중',
    isLive: false
  }
];

export function HubHome({ onSelectService }) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = SERVICES.filter(s => {
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  return (
    <div style={{
      maxWidth: '920px',
      margin: '0 auto',
      padding: '20px 16px 80px',
      animation: 'fadeIn 0.25s ease'
    }}>
      
      {/* 🌟 1. 글로벌 메인 포털 히어로 (딥 네이비 & 인디고 그라데이션) */}
      <div style={{
        position: 'relative',
        padding: '40px 24px 36px',
        borderRadius: '30px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.9) 70%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        textAlign: 'center',
        marginBottom: '32px',
        overflow: 'hidden'
      }}>
        {/* 배경 은은한 빛 효과 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '150px',
          background: 'rgba(56, 189, 248, 0.25)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* 상단 뱃지 */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '800',
          letterSpacing: '0.04em',
          marginBottom: '16px'
        }}>
          <Sparkles size={14} color="#38bdf8" />
          <span>UNIVERSAL GOAL-DRIVEN AI ENGINE</span>
        </div>

        {/* 메인 헤드라인 */}
        <h1 style={{
          fontSize: '38px',
          fontWeight: '900',
          letterSpacing: '-0.04em',
          lineHeight: '1.2',
          marginBottom: '10px'
        }}>
          모든 목표를 현실로 만드는{' '}
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            imcoach.co
          </span>
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#cbd5e1',
          fontWeight: '600',
          maxWidth: '520px',
          margin: '0 auto 24px'
        }}>
          도전하고 싶은 분야의 목표를 입력하면, AI가 오늘 실천할 일로 즉시 역산해 드립니다.
        </p>

        {/* 카테고리 필터 필 바 */}
        <div style={{
          display: 'inline-flex',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '5px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          {CATEGORIES.map(cat => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #818cf8' : 'none',
                  background: isSelected ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  boxShadow: isSelected ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🚀 2. 버티컬 서비스 그리드 (각 서비스마다 고유 테마 컬러 & 독립 디자인) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px',
        marginBottom: '36px'
      }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => item.isLive && onSelectService(item.id)}
            style={{
              padding: '24px 22px',
              borderRadius: '24px',
              background: item.accentGradient,
              border: `1.5px solid ${item.cardBorder}`,
              boxShadow: item.isLive ? '0 12px 30px rgba(48, 209, 88, 0.15)' : '0 8px 20px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(20px)',
              cursor: item.isLive ? 'pointer' : 'default',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
              position: 'relative'
            }}
          >
            {/* 카드 상단: 아이콘 + 뱃지 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                  {item.icon}
                </div>

                <span style={{
                  fontSize: '11px',
                  fontWeight: '900',
                  padding: '4px 9px',
                  borderRadius: '9999px',
                  background: item.statusBg,
                  color: item.statusColor,
                  border: `1px solid ${item.statusColor}40`,
                  letterSpacing: '0.04em'
                }}>
                  {item.status}
                </span>
              </div>

              {/* 서비스명 + 설명 */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700' }}>
                    {item.sub}
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', color: '#e2e8f0', fontWeight: '700', lineHeight: 1.35 }}>
                  {item.desc}
                </div>
              </div>

              {/* 태그 칩스 */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {item.tags.map((t, idx) => (
                  <span key={idx} style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#94a3b8',
                    background: 'rgba(0, 0, 0, 0.35)',
                    padding: '3px 7px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    • {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 카드 하단 액션 버튼 */}
            <div>
              {item.isLive ? (
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '14px',
                    background: item.btnBg,
                    color: item.btnColor,
                    fontSize: '15px',
                    fontWeight: '900',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 16px rgba(48, 209, 88, 0.35)'
                  }}
                >
                  <span>{item.btnText}</span>
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              ) : (
                <div style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '14px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: item.btnColor,
                  fontSize: '13px',
                  fontWeight: '800',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {item.btnText}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 💎 3. 하단 플랫폼 작동 원리 3-Step 스트립 */}
      <div style={{
        padding: '24px 20px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎯</div>
          <div style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff' }}>1. 최종 목표 설정</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', marginTop: '2px' }}>목표 날짜와 기록/곡 입력</div>
        </div>
        <div>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>🗺️</div>
          <div style={{ fontSize: '14px', fontWeight: '900', color: '#818cf8' }}>2. AI 3안 역산 로드맵</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', marginTop: '2px' }}>단기·표준·안심 코스 생성</div>
        </div>
        <div>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
          <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--accent-primary)' }}>3. 오늘 1장 코칭</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', marginTop: '2px' }}>체크 시 달성 예측 실시간 반영</div>
        </div>
      </div>

    </div>
  );
}
