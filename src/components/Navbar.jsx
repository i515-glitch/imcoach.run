import React from 'react';
import { RotateCcw, Cloud, User, LogOut, CheckCircle2, Zap } from 'lucide-react';

export function Navbar({ currentStep, setStep, activeGoal, onReset, user, onOpenAuth, onLogout }) {
  return (
    <header style={{
      padding: '16px 0',
      marginBottom: '20px',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      {/* 🏃 글로벌 미니멀 로고 */}
      <div 
        onClick={() => setStep(activeGoal ? 'coaching' : 'goal')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '11px',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(48, 209, 88, 0.35)'
        }}>
          {/* 🏃 Dynamic Runner Vector Icon */}
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#000000" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="16" cy="4" r="2" fill="#000000" />
            <path d="M7 21l3-6 4 2 2-6-5-3-3 2" />
            <path d="M6 9l3 2 4-2" />
            <path d="M16 13l3 4 2-1" />
          </svg>
        </div>
        <div>
          <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>
            imcoach<span style={{ color: 'var(--accent-primary)' }}>.run</span>
          </span>
        </div>
      </div>

      {/* 우측: 클라우드 로그인 & 리셋 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '20px',
              background: 'rgba(48, 209, 88, 0.12)',
              border: '1px solid rgba(48, 209, 88, 0.3)',
              fontSize: '11px',
              color: 'var(--accent-primary)',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={13} />
              <span>{user.displayName || user.email?.split('@')[0] || '러너'}</span>
            </div>
            <button
              onClick={onLogout}
              title="로그아웃"
              style={{
                padding: '6px 8px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              padding: '7px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}
          >
            <Cloud size={13} color="var(--accent-primary)" />
            <span>기록 저장</span>
          </button>
        )}

        {activeGoal && (
          <button
            onClick={onReset}
            title="새 목표 설정"
            style={{
              padding: '7px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </header>
  );
}
