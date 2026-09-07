import React from 'react';
import { ArrowRight, Flame, Trophy } from 'lucide-react';

export function SportSelectStep({ onSelectSport }) {
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(0, 255, 135, 0.1)', borderRadius: '20px', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
          STEP 1. 종목 선택
        </div>
        <h1 style={{ fontSize: '30px', marginBottom: '8px' }}>
          도전할 운동 종목을 <span className="gradient-text">선택</span>하세요
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          달리기 또는 하체·코어 근력 중 목표를 선택해주세요.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '20px', marginBottom: '32px' }}>
        {/* 1. 달리기 (러닝) */}
        <div
          onClick={() => onSelectSport('running')}
          className="card-glass choice-card"
          style={{
            padding: '28px 24px',
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(0, 255, 135, 0.15)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ fontSize: '32px' }}>🏃</span>
          </div>
          <span className="badge badge-green" style={{ marginBottom: '8px' }}>심폐 & 지구력</span>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>달리기</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            10km 완주 및 목표 페이스 달성 프로그램
          </p>
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <span>달리기 선택</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 2. 근력운동 (하체 & 코어) */}
        <div
          onClick={() => onSelectSport('strength')}
          className="card-glass choice-card"
          style={{
            padding: '28px 24px',
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(96, 239, 255, 0.15)',
            color: 'var(--accent-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ fontSize: '32px' }}>🏋️</span>
          </div>
          <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>하체 & 코어 파워</span>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>근력운동</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            스쿼트, 다리들기, 플랭크 기초 근력 강화 프로그램
          </p>
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-cyan btn-sm" style={{ width: '100%' }}>
              <span>근력운동 선택</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
