/**
 * imcoach 로컬 영속성 스토리지 관리자
 */

const STORAGE_KEY_GOAL = 'imcoach_active_goal';
const STORAGE_KEY_ASSESSMENT = 'imcoach_assessment';
const STORAGE_KEY_ROADMAP = 'imcoach_roadmap';
const STORAGE_KEY_HISTORY = 'imcoach_workout_history';

export function saveUserData(data) {
  try {
    if (data.goal) localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(data.goal));
    if (data.assessment) localStorage.setItem(STORAGE_KEY_ASSESSMENT, JSON.stringify(data.assessment));
    if (data.roadmap) localStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(data.roadmap));
    if (data.history) localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(data.history));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function loadUserData() {
  try {
    const goal = localStorage.getItem(STORAGE_KEY_GOAL);
    const assessment = localStorage.getItem(STORAGE_KEY_ASSESSMENT);
    const roadmap = localStorage.getItem(STORAGE_KEY_ROADMAP);
    const history = localStorage.getItem(STORAGE_KEY_HISTORY);

    return {
      goal: goal ? JSON.parse(goal) : null,
      assessment: assessment ? JSON.parse(assessment) : null,
      roadmap: roadmap ? JSON.parse(roadmap) : null,
      history: history ? JSON.parse(history) : []
    };
  } catch (e) {
    console.error('Failed to load from localStorage', e);
    return { goal: null, assessment: null, roadmap: null, history: [] };
  }
}

export function clearUserData() {
  localStorage.removeItem(STORAGE_KEY_GOAL);
  localStorage.removeItem(STORAGE_KEY_ASSESSMENT);
  localStorage.removeItem(STORAGE_KEY_ROADMAP);
  localStorage.removeItem(STORAGE_KEY_HISTORY);
}
