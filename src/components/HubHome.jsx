import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';

// 현재 실제 서비스 및 바로 다음 제작 예정 서비스만 깔끔하게 등록
const SERVICES = [
  {
    id: 'run',
    path: '/run',
    icon: '🏃',
    title: 'Run',
    sub: '러닝 & 마라톤',
    desc: '10K · 하프 · 풀코스 역산 완주',
    badge: 'LIVE',
    badgeColor: '#30d158',
    glowColor: 'rgba(48, 209, 88, 0.25)',
    isLive: true
  },
  {
    id: 'fit',
    path: '/fit',
    icon: '💪',
    title: 'Fit',
    sub: '헬스 & 맨몸운동',
    desc: '턱걸이 10개 · 체지방 감량 · 3대 운동',
    badge: 'COMING NEXT',
    badgeColor: '#64d2ff',
    glowColor: 'rgba(100, 210, 255, 0.2)',
    isLive: false
  }
];

export function HubHome({ onSelectService }) {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px 60px', animation: 'fadeIn 0.25s ease' }}>
      {/* 1. 상단 미니멀 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '6px' }}>
          목표를 현실로 만드는 <span className="gradient-text">imcoach</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '700' }}>
          도전할 분야를 선택하세요
        </p>
      </div>

      {/* 2. 실제 서비스 중심의 깔끔한 카드 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {SERVICES.map((item) => (
          <div
            key={item.id}
            onClick={() => item.isLive && onSelectService(item.id)}
            style={{
              padding: '24px 20px',
              borderRadius: '24px',
              background: item.isLive ? 'rgba(28, 28, 30, 0.95)' : 'rgba(20, 20, 22, 0.65)',
              border: item.isLive ? '1.5px solid rgba(48, 209, 88, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              cursor: item.isLive ? 'pointer' : 'default',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: item.isLive ? `0 12px 32px ${item.glowColor}` : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '210px'
            }}
          >
            {/* 상단: 아이콘 + 뱃지 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                {item.icon}
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: '900',
                padding: '4px 9px',
                borderRadius: '9999px',
                background: item.isLive ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: item.badgeColor,
                border: `1px solid ${item.badgeColor}40`,
                letterSpacing: '0.04em'
              }}>
                {item.badge}
              </span>
            </div>

            {/* 중간: 타이틀 + 1줄 설명 */}
            <div style={{ margin: '14px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '800' }}>
                  {item.sub}
                </span>
              </div>
              <div style={{ fontSize: '13.5px', color: '#e5e5ea', fontWeight: '700' }}>
                {item.desc}
              </div>
            </div>

            {/* 하단: 액션 버튼 */}
            <div>
              {item.isLive ? (
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'var(--accent-primary)',
                    color: '#000000',
                    fontSize: '15px',
                    fontWeight: '900',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 16px rgba(48, 209, 88, 0.4)'
                  }}
                >
                  <span>코칭 시작하기</span>
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              ) : (
                <div style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '800',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  다음 주 오픈 예정
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
