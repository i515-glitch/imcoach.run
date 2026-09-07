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

export function App() {
  const [step, setStep] = useState('goal_detail'); // 'goal_detail' | 'assessment' | 'roadmap'
  const [selectedSport, setSelectedSport] = useState('running');
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
        setStep('roadmap');
      }
    } catch (e) {
      console.warn('초기 로컬 데이터 복원 건너뜀:', e);
      setStep('goal_detail');
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
            setStep('roadmap');
          }
        } catch (e) {
          console.warn('클라우드 동기화 건너뜀:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 1단계: 목표 입력 완료 ➔ 3안 맞춤 로드맵 즉시 생성 및 로드맵 화면으로 직행!
  const handleGoalSubmit = (goalData) => {
    setActiveGoal(goalData);
    const defaultAssessment = { userLevel: 'beginner', answers: {} };
    setAssessment(defaultAssessment);

    const generatedRoadmap = generateTrainingRoadmap({
      goal: goalData,
      userLevel: 'beginner',
      scheduleMode: goalData.scheduleMode || 'deadline',
      targetDate: goalData.targetDate,
      dailyMinutes: goalData.dailyMinutes || 35,
      daysPerWeek: goalData.daysPerWeek || 3,
      surveyAnswers: {}
    });

    setRoadmap(generatedRoadmap);
    const fullData = {
      goal: goalData,
      assessment: defaultAssessment,
      roadmap: generatedRoadmap
    };
    saveUserData(fullData);
    if (user) {
      saveUserPlanToCloud(user.uid, fullData);
    }
    setStep('roadmap');
  };

  // 초기화 (새 목표 설정)
  const handleReset = () => {
    clearUserData();
    setActiveGoal(null);
    setAssessment(null);
    setRoadmap(null);
    setStep('goal_detail');
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
      {/* 상단 네비게이션 */}
      <Navbar
        currentStep={step}
        setStep={setStep}
        activeGoal={activeGoal}
        onReset={handleReset}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 메인 콘텐츠 영역 */}
      <main style={{ flex: 1 }}>
        {/* 1단계: 마라톤 목표 설정 (글로벌 미니멀) */}
        {step === 'goal_detail' && (
          <GoalDetailStep
            sportCategory="running"
            onGoalSubmit={handleGoalSubmit}
            initialGoal={activeGoal}
          />
        )}

        {/* 2단계: 현재 운동능력 체크 */}
        {step === 'assessment' && (
          <AssessmentStep
            goal={activeGoal || { category: 'running' }}
            onCompleteAssessment={handleCompleteAssessment}
            onBack={() => setStep('goal_detail')}
          />
        )}

        {/* 4~6단계: 3안 제시, 체크리스트 & 목표수정, 계획 vs 실천 동적 그래프, 주간 코칭 조언 */}
        {step === 'roadmap' && roadmap && (
          <RoadmapView
            roadmap={roadmap}
            goal={activeGoal}
            userAssessment={assessment}
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
