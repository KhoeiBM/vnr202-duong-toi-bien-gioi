'use client';

import { useState, type FormEvent } from 'react';
import { mapAuthError, useAuth } from '@/lib/auth-context';

type Mode = 'login' | 'signup';

export default function AuthModal({
  open,
  onClose,
  initialMode = 'login',
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}) {
  const { signIn, signUp, signInGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setInfo('');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (mode === 'signup' && password !== confirm) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') await signIn(email, password);
      else await signUp(email, password, name);
      onClose();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError('');
    setInfo('');
    setBusy(true);
    try {
      await signInGoogle();
      onClose();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    setError('');
    if (!email.trim()) {
      setError('Hãy nhập email của bạn vào ô bên trên trước.');
      return;
    }
    try {
      await resetPassword(email);
      setInfo('Đã gửi email đặt lại mật khẩu (nếu email tồn tại trong hệ thống).');
    } catch (err) {
      setError(mapAuthError(err));
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose} role="presentation">
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose} aria-label="Đóng">
          ✕
        </button>

        <h3 className="auth-title">{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</h3>
        <p className="auth-sub">
          Lưu thành tích quiz và dùng đồng bộ trên nhiều thiết bị.
        </p>

        <div className="auth-tabs">
          <button
            className={`quiz-chip ${mode === 'login' ? 'is-active' : ''}`}
            onClick={() => switchMode('login')}
            type="button"
          >
            Đăng nhập
          </button>
          <button
            className={`quiz-chip ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Tên hiển thị (không bắt buộc)</label>
              <input
                id="auth-name"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                autoComplete="nickname"
              />
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@email.com"
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Mật khẩu</label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-confirm">Nhập lại mật khẩu</label>
              <input
                id="auth-confirm"
                className="auth-input"
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <p className="auth-error">⚠️ {error}</p>}
          {info && <p className="auth-info">✓ {info}</p>}

          <button className="btn btn-primary auth-submit" type="submit" disabled={busy}>
            {busy ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <button className="auth-google" onClick={google} type="button" disabled={busy}>
          <span className="g-icon">G</span> Tiếp tục với Google
        </button>

        {mode === 'login' && (
          <button className="auth-forgot" onClick={forgot} type="button">
            Quên mật khẩu?
          </button>
        )}

        <p className="auth-note">
          Dữ liệu thành tích được lưu trên Firebase của dự án; mỗi tài khoản chỉ xem được dữ liệu
          của mình.
        </p>
      </div>
    </div>
  );
}
