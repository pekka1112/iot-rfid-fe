import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

export default function Header({ onToggleMobileSidebar, onMenuChange, notifications = [], onClearNotifications, fireAlert = false, onToggleDashboard, isDashboardVisible = false  , onToggleChat, isChatOpen = false}) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFirePopup, setShowFirePopup] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const fireRef = useRef(null);

  // Tự động bật popup nếu có cảnh báo cháy từ backend
  useEffect(() => {
    if (fireAlert) {
      setShowFirePopup(true);
    }
  }, [fireAlert]);

  const handleAvatarClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleMenuClick = (menu) => {
    onMenuChange(menu);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (fireRef.current && !fireRef.current.contains(event.target)) {
        setShowFirePopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">

      <div className="header-left" >
        <button className="mobile-menu-toggle" onClick={onToggleMobileSidebar} aria-label="Mở menu">
          ☰
        </button>
        <div className="search-bar">
          {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Gõ để tìm kiếm ..." /> */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
  {/* Icon box */}
  <div style={{ position: 'relative', width: '0px', height: '36px', flexShrink: 0 }}>
    {/* <div style={{
      width: '36px', height: '36px', borderRadius: '8px',
      background: 'linear-gradient(135deg, #534AB7, #1D9E75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    </div> */}
    <div style={{
      position: 'absolute', top: '-3px', right: '-3px',
      width: '10px', height: '10px', borderRadius: '50%',
      background: '#1D9E75', border: '2px solid white'
    }}/>
  </div>

  {/* Text logo + dòng chữ */}
  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
    <span style={{
      fontSize: '18px', fontWeight: 500, letterSpacing: '0.5px',
      background: 'linear-gradient(90deg, #534AB7, #1D9E75)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      SmartPark - AIOT
    </span>
    <span style={{
      fontSize: '11px', fontWeight: 500,
      letterSpacing: '4px', textTransform: 'uppercase',
      background: 'linear-gradient(90deg, #7F77DD, #1D9E75)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      Hệ thống gửi xe thông minh
    </span>
  </div>
</div>
        </div>
      </div>

      <div className="header-right">
        
        <div className="header-actions">
          <button className="action-btn theme-toggle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>

          <div className="notification-wrapper" ref={notifRef} style={{ position: 'relative' }}>
            <button className="action-btn notification-btn" onClick={handleNotificationClick}>
              {notifications.length > 0 && <span className="dot"></span>}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Thông báo ({notifications.length})</h3>
                  {notifications.length > 0 && (
                    <button className="clear-notif-btn" onClick={onClearNotifications}>
                      Xóa tất cả
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="empty-notif">Không có thông báo mới</div>
                ) : (
                  <ul className="notification-list">
                    {notifications.map((notif) => (
                      <li key={notif.id} className="notification-item">
                        <div className={`notif-icon ${notif.type}`}>
                          {notif.type === 'open' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M10 12v.01" /><path d="M14 4h4a2 2 0 0 1 2 2v14" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M14 12v.01" />
                            </svg>
                          )}
                        </div>
                        <div className="notif-content">
                          <p className="notif-message">{notif.message}</p>
                          <p className="notif-time">{notif.timestamp}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
            {/* CHUÔNG CẢNH BÁO CHÁY THEO CẢM BIẾN */}
           <div className="fire-alert" ref={fireRef} style={{ position: 'relative' }}>
            <button 
              className={`action-btn notification-btn ${fireAlert ? 'blinking-fire' : ''}`} 
              onClick={() => setShowFirePopup(!showFirePopup)}
              style={fireAlert ? { animation: 'pulse-red 1.5s infinite', border: '1px solid red' } : { border: '1px solid #ef4444' }}
              title="Cảnh báo cháy"
            >
              {fireAlert && <span className="dot" style={{ backgroundColor: '#ff0000', boxShadow: '0 0 8px red' }}></span>}
              {/* Flame icon (Icon ngọn lửa) viền đỏ */}
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            </button>
            {showFirePopup && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  padding: '40px 36px',
                  maxWidth: '450px',
                  width: '90%',
                  boxShadow: '0 20px 60px rgba(239, 68, 68, 0.3), 0 0 80px rgba(0, 0, 0, 0.4)',
                  border: '3px solid #ef4444',
                  textAlign: 'center',
                  animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{
                      margin: 0,
                      fontSize: '22px',
                      fontWeight: '900',
                      color: '#ef4444',
                      letterSpacing: '0.5px'
                    }}>⚠️ CẢNH BÁO CHÁY!</h2>
                    <button
                      onClick={() => setShowFirePopup(false)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '28px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '0',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{
                    margin: '20px 0',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2c0 0-4.5 4.5-4.5 8.5C7.5 14.5 12 22 12 22s4.5-7.5 4.5-11.5C16.5 6.5 12 2 12 2z"/>
                    </svg>
                  </div>

                  {fireAlert ? (
                    <>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        color: '#ef4444',
                        margin: '16px 0 12px',
                        letterSpacing: '0.3px'
                      }}>Hệ thống phát hiện tín hiệu cháy!</p>
                      <p style={{
                        fontSize: '14px',
                        color: '#7f1d1d',
                        lineHeight: '1.6',
                        margin: '0 0 24px'
                      }}>Vui lòng sơ tán khỏi tòa nhà và gọi <strong>114</strong> ngay lập tức.</p>
                    </>
                  ) : (
                    <>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        color: '#10b981',
                        margin: '16px 0 12px'
                      }}>Hệ thống an toàn</p>
                      <p style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '0'
                      }}>Không phát hiện tín hiệu cháy.</p>
                    </>
                  )}

                  <button
                    onClick={() => setShowFirePopup(false)}
                    style={{
                      marginTop: '24px',
                      padding: '12px 32px',
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      letterSpacing: '0.3px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                  >
                    Đã hiểu
                  </button>
                </div>

                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  @keyframes scaleIn {
                    from {
                      opacity: 0;
                      transform: scale(0.9);
                    }
                    to {
                      opacity: 1;
                      transform: scale(1);
                    }
                  }
                  @keyframes pulse-red {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                  }
                `}</style>
              </div>
            )}
          </div>

          <button 
            className={`action-btn dashboard-toggle-btn ${isDashboardVisible ? 'active' : ''}`}
            onClick={onToggleDashboard}
            title={isDashboardVisible ? 'Ẩn thông tin' : 'Hiển thị thông tin'}
            aria-label={isDashboardVisible ? 'Ẩn thông tin' : 'Hiển thị thông tin'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>

         <button
            type="button"
            className={`action-btn message-btn ${isChatOpen ? 'active' : ''}`}
            onClick={onToggleChat}
            title="Trợ lý AI"
            aria-label={isChatOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
          >

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <div className="user-profile" ref={menuRef}>
          <button className="user-profile-btn" onClick={handleAvatarClick}>
            <div className="user-profile-info">
              <span className="user-name">{user?.username ?? 'Thomas Anree'}</span>
              <span className="user-role">Admin System</span>
            </div>
            <img src={user?.avatar ?? "https://github.com/shadcn.png"} alt="" className="user-avatar" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <button onClick={() => handleMenuClick('profile')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Hồ sơ cá nhân
              </button>
              <button onClick={() => handleMenuClick('contacts')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                   <polyline points="22,6 12,13 2,6" />
                </svg>
                Hộp thư
              </button>
              <button onClick={() => handleMenuClick('settings')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Cài đặt tài khoản
              </button>
              <div className="divider"></div>
              <button onClick={handleLogout} className="logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
