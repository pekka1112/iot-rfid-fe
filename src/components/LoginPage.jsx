import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(username, password, rememberMe);
      if (!success) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-brand-panel">
          <img
            src="background/bg-3.jpg"
            alt=""
            className="login-brand-bg"
          />
          <div className="login-brand-overlay" />
          <div className="login-brand-content">
            <p className="login-brand-kicker">IoT · RFID</p>
            <h2 className="login-brand-title">Quản lý tòa nhà thông minh</h2>
            <p className="login-brand-text">Ra vào an toàn, đồng bộ dữ liệu theo thời gian thực</p>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-title">Đăng nhập</h1>
              <p className="login-subtitle">Hệ thống quản lý RFID</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  className="login-input"
                  autoComplete="username"
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="login-input"
                  autoComplete="current-password"
                />
              </div>

              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <p className="login-remember-hint">
                Khi bật, phiên đăng nhập được lưu trên trình duyệt; chỉ mất khi bạn đăng xuất.
              </p>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-submit" disabled={isLoading}>
                {isLoading && <span className="login-spinner" aria-hidden />}
                <span>{isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}</span>
              </button>
            </form>

            <p className="login-footnote">
              Hệ thống quản lý ra vào cư dân với công nghệ RFID
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
