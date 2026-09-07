import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SportSelectStep } from './components/SportSelectStep';
import { GoalDetailStep } from './components/GoalDetailStep';
import { AssessmentStep } from './components/AssessmentStep';
import { RoadmapView } from './components/RoadmapView';
import { AuthModal } from './components/AuthModal';
import { generateTrainingRoadmap } from './services/coachEngine';
import { saveUserData, loadUserData, clearUserData } from './services/storage';
import { subscribeAuth, logoutUser, saveUserPlanToCloud, loadUserPlanFromCloud } from './services/firebase';

const getDefaultGoal = () => ({
  category: 'running',
  title: '10km 1시간 00분 미만 완주',
  badge: '10km 러닝',
  targetMetric: '10km (페이스 6:00/km)',
  scheduleMode: 'deadline',
  targetDate: '2026-10-18',
  distanceKm: 10,
  hours: 1,
  minutes: 0,
  targetTimeMin: 60,
  targetPace: '6:00',
  daysPerWeek: 3,
  dailyMinutes: 35
});

export function App() {
  // 3대 핵심 탭: 'goal' (목표설정) | 'roadmap' (훈련로드맵) | 'coaching' (실전코칭받기)
  const [step, setStep] = useState('coaching'); 
  const [activePlanId, setActivePlanId] = useState('plan2');
  const [activeGoal, setActiveGoal] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  // Firebase 사용자 인증 상태
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 초기 로드 시 저장된 데이터 복원 및 Firebase Auth 리스너
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') {
      clearUserData();
      window.history.replaceState({}, document.title, window.location.pathname);
      setStep('goal');
      return;
    }

    try {
      const saved = loadUserData();
      if (saved && saved.goal) {
        setActiveGoal(saved.goal);
        const assessmentData = saved.assessment || { userLevel: 'beginner', answers: {} };
        setAssessment(assessmentData);
        
        const freshRoadmap = generateTrainingRoadmap({
          goal: saved.goal,
          userLevel: assessmentData.userLevel || 'beginner',
          scheduleMode: saved.goal.scheduleMode || 'deadline',
          targetDate: saved.goal.targetDate,
          dailyMinutes: saved.goal.dailyMinutes || 35,
          daysPerWeek: saved.goal.daysPerWeek || 3,
          surveyAnswers: assessmentData.answers || {}
        });
        setRoadmap(freshRoadmap);
        saveUserData({ ...saved, assessment: assessmentData, roadmap: freshRoadmap });
        setStep('coaching');
      } else {
        // 기본 목표 생성으로 즉시 탐색 가능하도록 설정
        const defGoal = getDefaultGoal();
        const defAssessment = { userLevel: 'beginner', answers: {} };
        const freshRoadmap = generateTrainingRoadmap({
          goal: defGoal,
          userLevel: 'beginner',
          scheduleMode: 'deadline',
          targetDate: defGoal.targetDate,
          dailyMinutes: 35,
          daysPerWeek: 3,
          surveyAnswers: {}
        });
        setActiveGoal(defGoal);
        setAssessment(defAssessment);
        setRoadmap(freshRoadmap);
        setStep('goal');
      }
    } catch (e) {
      console.warn('초기 로컬 데이터 복원 건너뜀:', e);
      setStep('goal');
    }

    // Firebase Auth 구독
    const unsubscribe = subscribeAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const cloudData = await loadUserPlanFromCloud(currentUser.uid);
          if (cloudData && cloudData.goal) {
            setActiveGoal(cloudData.goal);
            const assessmentData = cloudData.assessment || { userLevel: 'beginner', answers: {} };
            setAssessment(assessmentData);
            const freshRoadmap = generateTrainingRoadmap({
              goal: cloudData.goal,
              userLevel: assessmentData.userLevel || 'beginner',
              scheduleMode: cloudData.goal.scheduleMode || 'deadline',
              targetDate: cloudData.goal.targetDate,
              dailyMinutes: cloudData.goal.dailyMinutes || 35,
              daysPerWeek: cloudData.goal.daysPerWeek || 3,
              surveyAnswers: assessmentData.answers || {}
            });
            setRoadmap(freshRoadmap);
            saveUserData({ ...cloudData, assessment: assessmentData, roadmap: freshRoadmap });
            setStep('coaching');
          }
        } catch (e) {
          console.warn('클라우드 동기화 건너뜀:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 탭 전환 핸들러
  const handleTabSwitch = (targetTab) => {
    if ((targetTab === 'roadmap' || targetTab === 'coaching') && (!activeGoal || !roadmap)) {
      const defGoal = getDefaultGoal();
      const defAssessment = { userLevel: 'beginner', answers: {} };
      const freshRoadmap = generateTrainingRoadmap({
        goal: defGoal,
        userLevel: 'beginner',
        scheduleMode: 'deadline',
        targetDate: defGoal.targetDate,
        dailyMinutes: 35,
        daysPerWeek: 3,
        surveyAnswers: {}
      });
      setActiveGoal(defGoal);
      setAssessment(defAssessment);
      setRoadmap(freshRoadmap);
      saveUserData({ goal: defGoal, assessment: defAssessment, roadmap: freshRoadmap });
    }
    setStep(targetTab);
  };

  // 1단계: 목표 입력 완료 ➔ 체력 진단 설문 단계로 이동!
  const handleGoalSubmit = (goalData) => {
    setActiveGoal(goalData);
    setStep('assessment');
  };

  // 2단계: 체력 설문 완료 ➔ 3안 맞춤 로드맵 생성 및 실전코칭 화면으로 이동!
  const handleCompleteAssessment = (assessmentData) => {
    setAssessment(assessmentData);
    const targetGoal = activeGoal || getDefaultGoal();

    const generatedRoadmap = generateTrainingRoadmap({
      goal: targetGoal,
      userLevel: assessmentData.userLevel || 'beginner',
      scheduleMode: targetGoal.scheduleMode || 'deadline',
      targetDate: targetGoal.targetDate,
      dailyMinutes: targetGoal.dailyMinutes || 35,
      daysPerWeek: targetGoal.daysPerWeek || 3,
      surveyAnswers: assessmentData.surveyAnswers || {}
    });

    setRoadmap(generatedRoadmap);
    const fullData = {
      goal: targetGoal,
      assessment: assessmentData,
      roadmap: generatedRoadmap
    };
    saveUserData(fullData);
    if (user) {
      saveUserPlanToCloud(user.uid, fullData);
    }
    setStep('coaching'); // 설문 완료 후 실전 코칭 탭으로 이동!
  };

  // 초기화 (새 목표 설정)
  const handleReset = () => {
    clearUserData();
    setActiveGoal(null);
    setAssessment(null);
    setRoadmap(null);
    setStep('goal');
  };

  // 로그아웃
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  // 인증 성공 후 동기화
  const handleAuthSuccess = async (authUser) => {
    setUser(authUser);
    const currentData = { goal: activeGoal, assessment, roadmap };
    if (activeGoal) {
      await saveUserPlanToCloud(authUser.uid, currentData);
    }
  };

  return (
    <div className="app-container">
      {/* 상단 네비게이션 헤더 */}
      <Navbar
        currentStep={step}
        setStep={handleTabSwitch}
        activeGoal={activeGoal}
        onReset={handleReset}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 🏃‍♂️ 3대 핵심 내비게이션 탭: 목표설정 | 훈련로드맵 | 실전코칭받기 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(118, 118, 128, 0.24)',
          padding: '4px',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '3px'
        }}>
          <button
            type="button"
            onClick={() => handleTabSwitch('goal')}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              border: 'none',
              background: step === 'goal' ? '#1c1c1e' : 'transparent',
              color: step === 'goal' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              boxShadow: step === 'goal' ? '0 3px 8px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🎯 목표설정</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('roadmap')}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              border: 'none',
              background: step === 'roadmap' ? '#1c1c1e' : 'transparent',
              color: step === 'roadmap' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              boxShadow: step === 'roadmap' ? '0 3px 8px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🗺️ 훈련로드맵</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('coaching')}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              border: 'none',
              background: step === 'coaching' ? '#1c1c1e' : 'transparent',
              color: step === 'coaching' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              boxShadow: step === 'coaching' ? '0 3px 8px rgba(0,0,0,0.4)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚡ 실전코칭받기</span>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main style={{ flex: 1 }}>
        {/* 1️⃣ 🎯 목표설정 탭 & 체력 수준 설문 */}
        {step === 'goal' && (
          <GoalDetailStep
            sportCategory="running"
            onGoalSubmit={handleGoalSubmit}
            initialGoal={activeGoal}
          />
        )}

        {step === 'assessment' && (
          <AssessmentStep
            goal={activeGoal}
            onCompleteAssessment={handleCompleteAssessment}
            onBack={() => setStep('goal')}
          />
        )}

        {/* 2️⃣ 🗺️ 훈련로드맵 탭 */}
        {step === 'roadmap' && roadmap && (
          <RoadmapView
            roadmap={roadmap}
            goal={activeGoal}
            userAssessment={assessment}
            viewMode="roadmap"
            onNavigate={handleTabSwitch}
            activePlanId={activePlanId}
            setActivePlanId={setActivePlanId}
          />
        )}

        {/* 3️⃣ ⚡ 실전코칭받기 탭 */}
        {step === 'coaching' && roadmap && (
          <RoadmapView
            roadmap={roadmap}
            goal={activeGoal}
            userAssessment={assessment}
            viewMode="coaching"
            onNavigate={handleTabSwitch}
            activePlanId={activePlanId}
            setActivePlanId={setActivePlanId}
          />
        )}
      </main>

      {/* 🔐 Firebase 로그인 & 회원가입 모달 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentPlanData={{ goal: activeGoal, assessment, roadmap }}
      />

      {/* 하단 푸터 */}
      <footer style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <p>© 2026 imcoach.run - AI Precision Running Coach</p>
      </footer>
    </div>
  );
}

export default App;
