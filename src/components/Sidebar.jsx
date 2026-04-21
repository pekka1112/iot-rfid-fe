import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Sidebar.css';

function NavIcon({ children }) {
  return (
    <span className="menu-icon" aria-hidden>
      {children}
    </span>
  );
}

export default function Sidebar({ activeMenu, onMenuChange, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const handleAvatarClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleViewProfile = () => {
    handleMenuChange('profile');
    setShowUserMenu(false);
  };

  const handleLogoClick = () => {
    onMenuChange('search');
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
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuChange = (menu) => {
    onMenuChange(menu);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <button type="button" className="logo-btn" onClick={handleLogoClick} title="Tìm kiếm">
            <img src="logo-building.svg" alt="" className="logo-image" />
          </button>
          <span className="brand-title">IoT RFID</span>
        </div>

        <div className="user-info-wrapper" ref={menuRef}>
          <button type="button" className="user-info" onClick={handleAvatarClick}>
            <img src={user?.avatar} alt="" className="user-avatar" />
            <span className="user-name">{user?.username ?? '—'}</span>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <button type="button" className="user-menu-item" onClick={handleViewProfile}>
                Hồ sơ
              </button>
              <button type="button" className="user-menu-item logout" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        <nav className="menu" aria-label="Điều hướng chính">
          <button
            type="button"
            className={`menu-item ${activeMenu === 'menu' ? 'active' : ''}`}
            onClick={() => handleMenuChange('menu')}
          >
            <NavIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </NavIcon>
            <span className="menu-label">Tổng quan</span>
          </button>
          <button
            type="button"
            className={`menu-item ${activeMenu === 'resident' ? 'active' : ''}`}
            onClick={() => handleMenuChange('resident')}
          >
            <NavIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </NavIcon>
            <span className="menu-label">Người dùng</span>
          </button>
          <button
            type="button"
            className={`menu-item ${activeMenu === 'camera' ? 'active' : ''}`}
            onClick={() => handleMenuChange('camera')}
          >
            <NavIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </NavIcon>
            <span className="menu-label">Camera</span>
          </button>
          <button
            type="button"
            className={`menu-item ${activeMenu === 'history' ? 'active' : ''}`}
            onClick={() => handleMenuChange('history')}
          >
            <NavIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </NavIcon>
            <span className="menu-label">Lịch sử</span>
          </button>
          <button
            type="button"
            className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => handleMenuChange('settings')}
          >
            <NavIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </NavIcon>
            <span className="menu-label">Cài đặt</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
