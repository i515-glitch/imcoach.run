import React, { useState } from 'react';
import { ChevronRight, Sparkles, Activity, ArrowLeft } from 'lucide-react';
import { calculateUserLevel, GOAL_SPECIFIC_SURVEYS } from '../services/coachEngine';

export function AssessmentStep({ goal, onCompleteAssessment, onBack }) {
  const category = goal?.category === 'strength' ? 'strength' : 'running';
  const surveyConfig = GOAL_SPECIFIC_SURVEYS[category] || GOAL_SPECIFIC_SURVEYS.running;

  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const initial = {};
    if (surveyConfig && surveyConfig.questions) {
      surveyConfig.questions.forEach((q) => {
        initial[q.id] = 0;
      });
    }
    return initial;
  });

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinishSurvey = () => {
    const questions = surveyConfig?.questions || [];
    const surveyScores = questions.map(q => {
      const selectedOptIdx = selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : 0;
      return q.options[selectedOptIdx]?.score || 10;
    });

    const calculatedLevel = calculateUserLevel({ surveyScores, surveyAnswers: selectedAnswers }, null);

    onCompleteAssessment({
      surveyAnswers: selectedAnswers,
      cameraTested: false,
      cameraScore: null,
      userLevel: calculatedLevel
    });
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', animation: 'fadeIn 0.25s ease' }}>
      {/* 🍎 iOS Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px',
          background: 'rgba(56, 189, 248, 0.12)',
          borderRadius: '9999px',
          color: 'var(--accent-secondary)',
          fontSize: '11px',
          fontWeight: '800',
          marginBottom: '6px'
        }}>
          <span>STEP 2</span>
          <span>•</span>
          <span>FITNESS CHECK</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.03em', color: '#ffffff' }}>
          현재 체력 & 러닝 수준 체크
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          현재 체력을 바탕으로 잭 대니얼스 VDOT 페이스를 과학적으로 계산합니다.
        </p>
      </div>

      {/* 🍎 iOS Inset Grouped Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
        {surveyConfig?.questions?.map((q, qIdx) => (
          <div
            key={q.id}
            style={{
              background: 'rgba(28, 28, 30, 0.85)',
              borderRadius: '18px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>
              {qIdx + 1}. {q.question}
            </div>

            {/* Apple Segmented Grid Options */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(q.options.length, 3)}, 1fr)`, gap: '6px' }}>
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[q.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(q.id, optIdx)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: isSelected ? '800' : '600',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#000000' : 'var(--text-secondary)',
                      border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
                      boxShadow: isSelected ? '0 2px 10px rgba(0, 255, 135, 0.3)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 🍎 iOS Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '16px 20px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '700',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer'
            }}
          >
            이전
          </button>
        )}

        <button
          type="button"
          onClick={handleFinishSurvey}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '9999px',
            fontSize: '16px',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            background: 'var(--accent-primary)',
            color: '#000000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 20px rgba(0, 255, 135, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span>나만의 마라톤 로드맵 생성</span>
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
