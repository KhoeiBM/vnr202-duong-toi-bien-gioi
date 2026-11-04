'use client';

import { useCallback, useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import { mapAuthError, useAuth } from '@/lib/auth-context';
import {
  clearHistory,
  computeBest,
  loadLocalHistory,
  syncHistory,
  type QuizResult,
} from '@/lib/quiz-store';

const MODE_LABEL: Record<string, string> = {
  practice: 'Luyện tập',
  exam: 'Thi thử',
};

function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function AccountMenu() {
  const { user, loading, signOut, removeAccount, lastSyncPushed } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(() => setHistory(loadLocalHistory()), []);

  useEffect(() => {
    const open = () => setAuthOpen(true);
    const update = () => refresh();
    window.addEventListener('dtb-open-auth', open);
    window.addEventListener('dtb-history-updated', update);
    return () => {
      window.removeEventListener('dtb-open-auth', open);
      window.removeEventListener('dtb-history-updated', update);
    };
  }, [refresh]);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  if (loading) return <span className="nav-auth nav-auth--ghost">…</span>;

  if (!user) {
    return (
      <>
        <button className="nav-auth" onClick={() => setAuthOpen(true)}>
          Đăng nhập
        </button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  const best = computeBest(history);
  const label = user.displayName || user.email || 'Tài khoản';

  const doSignOut = async () => {
    setMenuOpen(false);
    setHistoryOpen(false);
    await signOut();
  };

  const doClear = async () => {
    if (!window.confirm('Xóa toàn bộ lịch sử làm bài trên tài khoản và máy này?')) return;
    await clearHistory(user.uid);
    refresh();
    setNote('Đã xóa lịch sử làm bài.');
  };

  const doDelete = async () => {
    if (
      !window.confirm(
        'XÓA TÀI KHOẢN? Toàn bộ tài khoản và thành tích trên máy chủ sẽ bị xóa vĩnh viễn.'
      )
    )
      return;
    try {
      await removeAccount();
      setMenuOpen(false);
      setHistoryOpen(false);
    } catch (err) {
      setError(mapAuthError(err));
    }
  };

  return (
    <>
      <div className="account-wrap">
        <button
          className="nav-auth nav-auth--user"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
        >
          <span className="account-avatar">{(label[0] || '?').toUpperCase()}</span>
          <span className="account-name">{label}</span>
        </button>

        {menuOpen && (
          <>
            <div className="account-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="account-panel">
              <div className="account-email">{user.email}</div>
              <button
                className="account-item"
                onClick={() => {
                  setMenuOpen(false);
                  setHistoryOpen(true);
                  refresh();
                }}
              >
                📊 Lịch sử làm bài
              </button>
              <button className="account-item" onClick={doSignOut}>
                ⇥ Đăng xuất
              </button>
              <button className="account-item account-item--danger" onClick={doDelete}>
                🗑 Xóa tài khoản & dữ liệu
              </button>
            </div>
          </>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {historyOpen && (
        <div className="auth-overlay" onClick={() => setHistoryOpen(false)} role="presentation">
          <div
            className="auth-modal auth-modal--wide"
            role="dialog"
            aria-modal="true"
            aria-label="Lịch sử làm bài"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="auth-close" onClick={() => setHistoryOpen(false)} aria-label="Đóng">
              ✕
            </button>
            <h3 className="auth-title">Lịch sử làm bài</h3>
            <p className="auth-sub">
              {history.length} bài đã làm · Kỷ lục thi thử:{' '}
              <strong className="text-gold">{best !== null ? `${best}%` : 'chưa có'}</strong>
              {lastSyncPushed ? ` · Đã đồng bộ ${lastSyncPushed} bài từ máy này lên tài khoản` : ''}
            </p>

            <div className="history-list">
              {history.length === 0 && (
                <p className="auth-note">Chưa có bài làm nào — hãy bắt đầu với mục Trắc nghiệm!</p>
              )}
              {history.slice(0, 20).map((r) => (
                <div key={r.id} className="history-row">
                  <span className={`quiz-tag ${r.mode === 'exam' ? '' : 'history-tag--soft'}`}>
                    {MODE_LABEL[r.mode] ?? r.mode}
                  </span>
                  <span className="history-main">
                    {r.correct}/{r.total} đúng · <strong>{r.pct}%</strong>
                  </span>
                  <span className="history-date">{fmtDate(r.createdAt)}</span>
                </div>
              ))}
            </div>

            {error && <p className="auth-error">⚠️ {error}</p>}
            {note && <p className="auth-info">✓ {note}</p>}

            <div className="auth-tabs" style={{ marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={() => setHistoryOpen(false)}>
                Đóng
              </button>
              <button className="btn btn-ghost" onClick={doClear}>
                Xóa lịch sử
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
