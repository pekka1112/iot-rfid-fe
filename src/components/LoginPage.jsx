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

  // xử lí khi user ấn login BUTTON
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Chưa nhập Username / Password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const success = login(username, password, rememberMe);
      if (!success) {
        setError('Username / Password không chính xác');
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
        </div>

        <div className="login-form-panel">
          <div className="login-card">
            <div className="login-card-header">
              <p className="login-title">Hệ thống quản lý RFID</p>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
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
                <span>Nhớ tài khoản này</span>
              </label>
              {error && <div className="login-error">{error}</div>}
              <button type="submit" className="login-submit" disabled={isLoading}>
                {isLoading && <span className="login-spinner" aria-hidden />}
                <span>{isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}</span>
              </button>
            </form>

            <p className="login-footnote">
              * Hệ thống quản lý ra vào cư dân với công nghệ IoT · RFID  <br />
              Quản lý tòa nhà thông minh <br />
              Ra vào an toàn, đồng bộ dữ liệu theo thời gian thực
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
