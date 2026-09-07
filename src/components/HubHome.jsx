import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight, Zap, Flame, ShieldCheck, Sparkles, TrendingUp, Filter } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '🔥 전체 ALL' },
  { id: 'sports', label: '🏃 스포츠' },
  { id: 'music', label: '🎵 음악 & 악기' },
  { id: 'life', label: '💡 라이프 & 테크' }
];

const PRODUCTS = [
  {
    id: 'run',
    category: 'sports',
    path: '/run',
    icon: '🏃',
    title: 'imcoach Run',
    domain: 'imcoach.run',
    tagline: '10K · 하프 · 풀코스 완주 시간 역산 AI 코칭',
    features: ['1·2·3안 로드맵', '실시간 동적 예측선', '1일 1장 체크리스트'],
    status: 'LIVE',
    statusColor: '#30d158',
    stats: 'v2.4 배포 완료',
    accentColor: '#30d158',
    glow: 'rgba(48, 209, 88, 0.25)',
    isLive: true
  },
  {
    id: 'fit',
    category: 'sports',
    path: '/fit',
    icon: '💪',
    title: 'imcoach Fit',
    domain: 'imcoach.co/fit',
    tagline: '턱걸이 10개 · 체지방 감량 · 3대 운동 점진적 과부하',
    features: ['1RM 역산 분할 루틴', '체성분 변화 예측', '홈트 & 헬스'],
    status: 'NEXT LAUNCH',
    statusColor: '#64d2ff',
    stats: '개발 진행 중',
    accentColor: '#64d2ff',
    glow: 'rgba(100, 210, 255, 0.2)',
    isLive: false
  },
  {
    id: 'board',
    category: 'sports',
    path: '/board',
    icon: '🛹',
    title: 'imcoach Board',
    domain: 'imcoach.co/board',
    tagline: '스케이트보드 알리 · 스노우보드 카빙 턴 트릭 정복',
    features: ['기술 단계별 마디 분할', '자세 밸런스 체크', '영상 피드백'],
    status: 'SCHEDULED',
    statusColor: '#ff9f0a',
    stats: '출시 예정',
    accentColor: '#ff9f0a',
    glow: 'rgba(255, 159, 10, 0.2)',
    isLive: false
  },
  {
    id: 'drum',
    category: 'music',
    path: '/drum',
    icon: '🥁',
    title: 'imcoach Drum',
    domain: 'imcoach.co/drum',
    tagline: '목표 BPM 8비트 · 16비트 완곡 비트 트레이닝',
    features: ['메트로놈 속도 역산', '마디별 분할 코칭', '스트로크 루틴'],
    status: 'SCHEDULED',
    statusColor: '#ff375f',
    stats: '출시 예정',
    accentColor: '#ff375f',
    glow: 'rgba(255, 55, 95, 0.2)',
    isLive: false
  },
  {
    id: 'guitar',
    category: 'music',
    path: '/guitar',
    icon: '🎸',
    title: 'imcoach Guitar',
    domain: 'imcoach.co/guitar',
    tagline: '코드 체인지 마스터 & 핑거스타일 완곡 코칭',
    features: ['코드 운지 전환 역산', '스트로크 리듬 훈련', '인기곡 악보'],
    status: 'SCHEDULED',
    statusColor: '#bf5af2',
    stats: '출시 예정',
    accentColor: '#bf5af2',
    glow: 'rgba(191, 90, 242, 0.2)',
    isLive: false
  },
  {
    id: 'kfood',
    category: 'life',
    path: '/kfood',
    icon: '🍲',
    title: 'imcoach K-Food',
    domain: 'imcoach.co/kfood',
    tagline: '글로벌 한식 요리 마스터 4주 완성 코칭',
    features: ['양념 황금비율', '단계별 레시피 역산', '한상차림 완성'],
    status: 'SCHEDULED',
    statusColor: '#ffd60a',
    stats: '출시 예정',
    accentColor: '#ffd60a',
    glow: 'rgba(255, 214, 10, 0.2)',
    isLive: false
  }
];

export function HubHome({ onSelectService }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = PRODUCTS.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '10px 16px 60px', animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. Acquire / Product Hunt 스타일 상단 히어로 뱃지 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 14px',
          borderRadius: '9999px',
          background: 'rgba(48, 209, 88, 0.12)',
          border: '1px solid rgba(48, 209, 88, 0.3)',
          color: 'var(--accent-primary)',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} />
          <span>목표달성 AI 역산 코칭 플랫폼</span>
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '900',
          letterSpacing: '-0.035em',
          color: '#ffffff',
          lineHeight: 1.15,
          marginBottom: '8px'
        }}>
          imcoach<span style={{ color: 'var(--accent-primary)' }}>.co</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '700' }}>
          목표를 정하면, AI가 오늘 할 일로 역산해 드립니다
        </p>
      </div>

      {/* 2. Acquire 스타일 카테고리 필터 탭 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        {CATEGORIES.map(cat => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '12px',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Product Hunt / Acquire 스타일 제품 리스트 카드 (수평 덱 카드) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredProducts.map((p) => {
          return (
            <div
              key={p.id}
              onClick={() => p.isLive && onSelectService(p.id)}
              style={{
                padding: '16px 20px',
                borderRadius: '20px',
                background: p.isLive ? 'rgba(28, 28, 30, 0.92)' : 'rgba(18, 18, 20, 0.7)',
                border: p.isLive ? '1.5px solid rgba(48, 209, 88, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                cursor: p.isLive ? 'pointer' : 'default',
                transition: 'all 0.18s ease',
                boxShadow: p.isLive ? `0 8px 24px ${p.glow}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              {/* 좌측: 아이콘 + 서비스 정보 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 300px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${p.accentColor}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0
                }}>
                  {p.icon}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>
                      {p.title}
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '900',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: p.isLive ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: p.statusColor,
                      border: `1px solid ${p.statusColor}40`
                    }}>
                      {p.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#e5e5ea', fontWeight: '700', marginBottom: '6px' }}>
                    {p.tagline}
                  </div>

                  {/* 마이크로 태그 칩 */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {p.features.map((f, fIdx) => (
                      <span key={fIdx} style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--text-secondary)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '6px'
                      }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측: 상태 뱃지 & 실행 버튼 (Product Hunt Launch Style) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {p.isLive ? (
                  <button
                    type="button"
                    style={{
                      padding: '11px 20px',
                      borderRadius: '12px',
                      background: 'var(--accent-primary)',
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: '900',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(48, 209, 88, 0.4)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>실행하기</span>
                    <ChevronRight size={16} strokeWidth={3} />
                  </button>
                ) : (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: 'var(--text-muted)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    whiteSpace: 'nowrap'
                  }}>
                    {p.stats}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. 하단 미니멀 플랫폼 통계 바 */}
      <div style={{
        marginTop: '24px',
        padding: '14px 18px',
        borderRadius: '16px',
        background: 'rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>엔진 타입</div>
          <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '900', marginTop: '2px' }}>AI 목표 역산 설계</div>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>플랫폼 도메인</div>
          <div style={{ fontSize: '14px', color: 'var(--accent-primary)', fontWeight: '900', marginTop: '2px' }}>imcoach.co</div>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>출시 주기</div>
          <div style={{ fontSize: '14px', color: '#64d2ff', fontWeight: '900', marginTop: '2px' }}>매주 1개 신규 런칭</div>
        </div>
      </div>
    </div>
  );
}
