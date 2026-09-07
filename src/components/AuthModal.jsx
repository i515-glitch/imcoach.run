import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../services/firebase';

export function AuthModal({ isOpen, onClose, onAuthSuccess, currentPlanData }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 구글 1초 간편 로그인
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg('로그인되었습니다! 기록이 클라우드에 동기화됩니다.');
      setTimeout(() => {
        onAuthSuccess(result.user);
        onClose();
      }, 700);
    } else {
      setErrorMsg(result.error || '구글 로그인 중 문제가 발생했습니다.');
    }
  };

  // 이메일 로그인 / 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    let result;

    if (mode === 'register') {
      result = await registerWithEmail(email, password, name);
    } else {
      result = await loginWithEmail(email, password);
    }

    setIsLoading(false);

    if (result.success) {
      setSuccessMsg(mode === 'register' ? '회원가입이 완료되었습니다! 환영합니다.' : '로그인되었습니다!');
      setTimeout(() => {
        onAuthSuccess(result.user);
        onClose();
      }, 700);
    } else {
      let friendlyError = result.error;
      if (result.error?.includes('email-already-in-use')) {
        friendlyError = '이미 가입된 이메일 주소입니다. 로그인해주세요.';
      } else if (result.error?.includes('wrong-password') || result.error?.includes('user-not-found') || result.error?.includes('invalid-credential')) {
        friendlyError = '이메일 또는 비밀번호가 일치하지 않습니다.';
      } else if (result.error?.includes('invalid-email')) {
        friendlyError = '올바른 이메일 형식을 입력해주세요.';
      }
      setErrorMsg(friendlyError);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#1c1c1e',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
        padding: '24px',
        position: 'relative',
        color: '#ffffff'
      }}>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={16} />
        </button>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 0 20px rgba(48, 209, 88, 0.3)'
          }}>
            {/* 🏃 Dynamic Runner Vector Icon */}
            <svg 
              width="26" 
              height="26" 
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
          <h2 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.02em', color: '#ffffff' }}>
            {mode === 'login' ? 'imcoach 로그인' : '간편 회원가입'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            내 러닝 목표와 훈련 기록을 클라우드에 안전하게 보관하세요.
          </p>
        </div>

        {/* 🔴 구글 1초 간편 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '14px',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            fontSize: '14px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            marginBottom: '16px',
            transition: 'all 0.15s ease'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google 계정으로 1초 로그인</span>
        </button>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }}></div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>또는 이메일로 계속</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }}></div>
        </div>

        {/* 이메일 로그인/가입 폼 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mode === 'register' && (
            <div>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="이름 또는 닉네임"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-glass"
                  style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          <div>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-glass"
                style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="비밀번호 (6자리 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-glass"
                style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 69, 58, 0.15)',
              border: '1px solid #ff453a',
              fontSize: '11px',
              color: '#ff453a',
              fontWeight: '700'
            }}>
              {errorMsg}
            </div>
          )}

          {/* 성공 메시지 */}
          {successMsg && (
            <div style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(48, 209, 88, 0.15)',
              border: '1px solid var(--accent-primary)',
              fontSize: '11px',
              color: 'var(--accent-primary)',
              fontWeight: '700'
            }}>
              {successMsg}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '14px',
              background: 'var(--accent-primary)',
              color: '#000000',
              border: 'none',
              fontSize: '14px',
              fontWeight: '900',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(48, 209, 88, 0.35)',
              marginTop: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            {isLoading ? '처리 중...' : mode === 'login' ? '로그인' : '무료 회원가입'}
          </button>
        </form>

        {/* 하단 모드 전환 */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <span>
              아직 계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
              >
                회원가입
              </button>
            </span>
          ) : (
            <span>
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
              >
                로그인
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
