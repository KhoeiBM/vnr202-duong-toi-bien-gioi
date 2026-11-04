'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';
import { deleteAllUserData, syncHistory, upsertProfile } from './quiz-store';

export function mapAuthError(err: unknown): string {
  const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'Email hoặc mật khẩu không đúng.';
  if (code.includes('email-already-in-use')) return 'Email đã được sử dụng. Hãy đăng nhập.';
  if (code.includes('weak-password')) return 'Mật khẩu cần ít nhất 6 ký tự.';
  if (code.includes('invalid-email')) return 'Địa chỉ email không hợp lệ.';
  if (code.includes('popup-closed-by-user')) return 'Cửa sổ Google đã bị đóng trước khi hoàn tất.';
  if (code.includes('network-request-failed')) return 'Lỗi mạng — kiểm tra kết nối rồi thử lại.';
  if (code.includes('requires-recent-login'))
    return 'Vì lý do bảo mật, hãy đăng xuất rồi đăng nhập lại trước khi xóa tài khoản.';
  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  lastSyncPushed: number | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  removeAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSyncPushed, setLastSyncPushed] = useState<number | null>(null);
  const syncedUid = useRef<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u && syncedUid.current !== u.uid) {
        syncedUid.current = u.uid;
        void upsertProfile(u.uid, u.email, u.displayName);
        void syncHistory(u.uid).then(({ pushed }) => setLastSyncPushed(pushed));
      }
      if (!u) {
        syncedUid.current = null;
        setLastSyncPushed(null);
      }
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName.trim()) await updateProfile(cred.user, { displayName: displayName.trim() });
    await upsertProfile(cred.user.uid, cred.user.email, displayName.trim() || null);
  }, []);

  const signInGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const removeAccount = useCallback(async () => {
    const u = auth.currentUser;
    if (!u) return;
    await deleteAllUserData(u.uid);
    await deleteUser(u);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        lastSyncPushed,
        signIn,
        signUp,
        signInGoogle,
        signOut,
        resetPassword,
        removeAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}
