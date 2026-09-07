import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

// Firebase 설정 (환경변수 지원 및 안전한 기본 설정)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForImcoachMarathonApp",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "imcoach-run.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "imcoach-run",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "imcoach-run.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Firebase 초기화 (중복 방지)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/**
 * 구글 1초 간편 로그인
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.warn("Google login notice/fallback:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 이메일/비밀번호 회원가입
 */
export async function registerWithEmail(email, password, displayName = '') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 이메일/비밀번호 로그인
 */
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 로그아웃
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 유저 인증 상태 변경 리스너
 */
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * ☁️ 유저의 러닝 플랜 & 체크리스트를 Firestore 클라우드에 영구 저장
 */
export async function saveUserPlanToCloud(userId, planData) {
  if (!userId) return { success: false, error: 'No user ID' };
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...planData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn("Cloud save note (offline/demo fallback enabled):", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ☁️ Firestore 클라우드에서 유저의 러닝 플랜 & 기록 로드
 */
export async function loadUserPlanFromCloud(userId) {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.warn("Cloud load note:", error.message);
    return null;
  }
}
