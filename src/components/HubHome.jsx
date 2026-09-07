import React from 'react';
import { ArrowUpRight, ChevronRight, Zap, Sparkles, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';

export function HubHome({ onSelectService }) {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px 16px 60px', animation: 'fadeIn 0.25s ease' }}>
      
      {/* 1. 상단 히어로 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
          marginBottom: '14px'
        }}>
          <Sparkles size={14} />
          <span>AI GOAL-DRIVEN COACHING PLATFORM</span>
        </div>

        <h1 style={{
          fontSize: '34px',
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

      {/* 2. 🔥 [메인 피처드 스포트라이트 카드] - imcoach Run (LIVE) */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent-primary)', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block', boxShadow: '0 0 10px var(--accent-primary)' }} />
          <span>FEATURED LIVE SERVICE</span>
        </div>

        <div
          onClick={() => onSelectService('run')}
          style={{
            padding: '28px 24px',
            borderRadius: '26px',
            background: 'linear-gradient(145deg, rgba(28, 28, 30, 0.95) 0%, rgba(18, 30, 24, 0.95) 100%)',
            border: '2px solid rgba(48, 209, 88, 0.5)',
            boxShadow: '0 16px 40px rgba(48, 209, 88, 0.18)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 0 24px rgba(48, 209, 88, 0.4)'
              }}>
                🏃
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff' }}>imcoach Run</span>
                  <span style={{ fontSize: '11px', fontWeight: '900', padding: '3px 8px', borderRadius: '6px', background: 'rgba(48, 209, 88, 0.2)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}>
                    LIVE
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#e5e5ea', fontWeight: '800' }}>
                  10K · 하프 · 풀코스 목표 완주 시간 역산 AI 코치
                </div>
              </div>
            </div>

            {/* 코스 뱃지 칩스 */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['3k 걷뛰', '10K', '하프', '풀코스'].map((d, i) => (
                <span key={i} style={{ padding: '4px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '11.5px', fontWeight: '800', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* 3대 핵심 프리뷰 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '800' }}>맞춤 플랜</div>
              <div style={{ fontSize: '15px', color: 'var(--accent-primary)', fontWeight: '900', marginTop: '2px' }}>1·2·3안 로드맵</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '800' }}>실시간 예측</div>
              <div style={{ fontSize: '15px', color: '#64d2ff', fontWeight: '900', marginTop: '2px' }}>동적 달성 곡선</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '800' }}>매일의 관제탑</div>
              <div style={{ fontSize: '15px', color: '#ffd60a', fontWeight: '900', marginTop: '2px' }}>1일 1장 체크리스트</div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <button
            type="button"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--accent-primary)',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '900',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(48, 209, 88, 0.45)'
            }}
          >
            <span>지금 러닝 코칭 시작하기</span>
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* 3. 🚀 [다음 출시 파이프라인 그리드] - Fit, Board, Drum, Guitar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>UPCOMING COACHING SERVICES</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
          
          {/* Fit */}
          <div style={{
            padding: '20px 18px',
            borderRadius: '20px',
            background: 'rgba(28, 28, 30, 0.75)',
            border: '1.5px solid rgba(100, 210, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '28px' }}>💪</span>
                <span style={{ fontSize: '10.5px', fontWeight: '900', padding: '3px 7px', borderRadius: '6px', background: 'rgba(100, 210, 255, 0.2)', color: '#64d2ff', border: '1px solid #64d2ff40' }}>
                  NEXT LAUNCH
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>imcoach Fit</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', lineHeight: 1.35 }}>
                턱걸이 10개 · 체지방 감량 · 3대 운동 점진적 과부하 루틴
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: '#64d2ff', fontSize: '12px', fontWeight: '800', textAlign: 'center' }}>
              다음 주 오픈 예정
            </div>
          </div>

          {/* Board */}
          <div style={{
            padding: '20px 18px',
            borderRadius: '20px',
            background: 'rgba(28, 28, 30, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '28px' }}>🛹</span>
                <span style={{ fontSize: '10.5px', fontWeight: '900', padding: '3px 7px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)' }}>
                  SCHEDULED
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>imcoach Board</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', lineHeight: 1.35 }}>
                스케이트보드 알리 · 스노우보드 카빙 턴 트릭 완성
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textAlign: 'center' }}>
              출시 예정
            </div>
          </div>

          {/* Drum */}
          <div style={{
            padding: '20px 18px',
            borderRadius: '20px',
            background: 'rgba(28, 28, 30, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '28px' }}>🥁</span>
                <span style={{ fontSize: '10.5px', fontWeight: '900', padding: '3px 7px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)' }}>
                  SCHEDULED
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>imcoach Drum</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', lineHeight: 1.35 }}>
                목표 BPM 8비트 · 16비트 완곡 비트 트레이닝
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textAlign: 'center' }}>
              출시 예정
            </div>
          </div>

          {/* Guitar */}
          <div style={{
            padding: '20px 18px',
            borderRadius: '20px',
            background: 'rgba(28, 28, 30, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '28px' }}>🎸</span>
                <span style={{ fontSize: '10.5px', fontWeight: '900', padding: '3px 7px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)' }}>
                  SCHEDULED
                </span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>imcoach Guitar</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', lineHeight: 1.35 }}>
                코드 체인지 속도 향상 & 16비트 스트로크 완곡 코칭
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '800', textAlign: 'center' }}>
              출시 예정
            </div>
          </div>

        </div>
      </div>

      {/* 4. 하단 미니멀 플랫폼 통계 바 */}
      <div style={{
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
