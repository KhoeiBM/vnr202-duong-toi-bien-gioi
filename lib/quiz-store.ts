import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

export interface QuizResult {
  id: string;
  mode: 'practice' | 'exam';
  total: number;
  correct: number;
  pct: number;
  seconds: number | null;
  createdAt: number;
}

const LS_HISTORY = 'dtb-quiz-history';
const LS_BEST = 'dtb-quiz-best';
const MAX_HISTORY = 100;

export function loadLocalHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    const arr = raw ? (JSON.parse(raw) as QuizResult[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function computeBest(history: QuizResult[]): number | null {
  const exams = history.filter((r) => r.mode === 'exam');
  if (!exams.length) return null;
  return Math.max(...exams.map((r) => r.pct));
}

export function loadBestLocal(): number | null {
  try {
    const v = Number(localStorage.getItem(LS_BEST));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

export function makeResult(input: {
  mode: 'practice' | 'exam';
  total: number;
  correct: number;
  pct: number;
  seconds: number | null;
}): QuizResult {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, createdAt: Date.now(), ...input };
}

function persistLocal(history: QuizResult[]) {
  try {
    localStorage.setItem(LS_HISTORY, JSON.stringify(history.slice(0, MAX_HISTORY)));
    const best = computeBest(history);
    localStorage.setItem(LS_BEST, best === null ? '' : String(best));
  } catch {
    /* localStorage đầy/không khả dụng */
  }
  window.dispatchEvent(new CustomEvent('dtb-history-updated'));
}

/** Lưu kết quả: luôn lưu máy; nếu đã đăng nhập thì ghi thêm lên Firestore. */
export async function saveQuizResult(
  result: QuizResult,
  uid: string | null
): Promise<'saved' | 'local-only' | 'cloud-error'> {
  const history = [result, ...loadLocalHistory()].slice(0, MAX_HISTORY);
  persistLocal(history);
  if (!uid) return 'local-only';
  try {
    await setDoc(doc(db, 'users', uid, 'quiz_results', result.id), {
      ...result,
      syncedAt: Date.now(),
    });
    return 'saved';
  } catch {
    return 'cloud-error';
  }
}

/**
 * Đồng bộ hai chiều khi đăng nhập: hợp nhất (union theo id) lịch sử máy + đám mây,
 * đẩy phần thiếu lên cloud, lưu phần thiếu về máy.
 */
export async function syncHistory(
  uid: string
): Promise<{ merged: QuizResult[]; pushed: number }> {
  const local = loadLocalHistory();
  let cloud: QuizResult[] = [];
  let pushable = true;
  try {
    const snap = await getDocs(query(collection(db, 'users', uid, 'quiz_results')));
    cloud = snap.docs.map((d) => d.data() as QuizResult);
  } catch {
    pushable = false;
  }

  const map = new Map<string, QuizResult>();
  for (const r of [...cloud, ...local]) if (r && r.id) map.set(r.id, r);
  const merged = [...map.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, MAX_HISTORY);

  let pushed = 0;
  if (pushable) {
    const cloudIds = new Set(cloud.map((c) => c.id));
    const toPush = local.filter((r) => !cloudIds.has(r.id));
    if (toPush.length) {
      try {
        const batch = writeBatch(db);
        for (const r of toPush) batch.set(doc(db, 'users', uid, 'quiz_results', r.id), r);
        await batch.commit();
        pushed = toPush.length;
      } catch {
        /* rules chặn ghi — dữ liệu vẫn còn trên máy */
      }
    }
  }

  persistLocal(merged);
  return { merged, pushed };
}

/** Xóa lịch sử làm bài (máy + cloud nếu đăng nhập). */
export async function clearHistory(uid: string | null): Promise<void> {
  persistLocal([]);
  if (!uid) return;
  try {
    const snap = await getDocs(query(collection(db, 'users', uid, 'quiz_results')));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch {
    /* bỏ qua */
  }
}

/** Xóa toàn bộ dữ liệu Firestore của user (dùng khi xóa tài khoản). */
export async function deleteAllUserData(uid: string): Promise<void> {
  try {
    const snap = await getDocs(query(collection(db, 'users', uid, 'quiz_results')));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(db, 'users', uid));
    await batch.commit();
  } catch {
    /* bỏ qua */
  }
}

/** Ghi/upsert hồ sơ người dùng. */
export async function upsertProfile(
  uid: string,
  email: string | null,
  displayName: string | null
): Promise<void> {
  try {
    await setDoc(
      doc(db, 'users', uid),
      { email: email ?? '', displayName: displayName ?? '', updatedAt: Date.now() },
      { merge: true }
    );
  } catch {
    /* bỏ qua */
  }
}
