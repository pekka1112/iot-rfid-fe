import React from 'react';
import '../styles/CameraCard.css';

export default function CameraCard({ title, isActive, doorOpen, currentUser, onOpen, onClose }) {
  const handleOpen = () => {
    onOpen?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  const isActiveUser = isActive && currentUser;
  const avatarLetter = currentUser?.name?.split(' ').slice(-1)[0]?.[0] ?? '?';

  return (
    <div className="camera-card">
      <div className={`camera-display ${isActive ? 'active' : 'inactive'}`}>
        <div className="camera-heading">
          <p className="camera-title">{title}</p>
          <span className={`camera-status ${isActive ? 'online' : 'offline'}`}>
            {isActive ? 'Đang hoạt động' : 'Tắt'}
          </span>
        </div>

        <div className="camera-preview">
          <div className="camera-preview-badge">{isActive ? 'LIVE' : 'OFF'}</div>
        </div>
      </div>

      <div className="camera-user-panel">
        <div className="camera-user-header">
          <div className="avatar-circle">{avatarLetter}</div>
          <div>
            <p className="user-name">
              {isActiveUser ? currentUser.name : 'Chưa có thông tin'}
            </p>
            <p className="user-type">
              {isActiveUser ? currentUser.type : 'Không có dữ liệu'}
            </p>
          </div>
        </div>

        <div className="user-info-grid">
          {isActiveUser ? (
            <>
              <div className="info-item">
                <span className="info-label">Phòng</span>
                <span className="info-value">{currentUser.room}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Trạng thái</span>
                <span className="info-value">{currentUser.status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Thời gian</span>
                <span className="info-value">{currentUser.detectedAt}</span>
              </div>
            </>
          ) : (
            <div className="info-item info-empty">
              Không có dữ liệu người dùng để hiển thị
            </div>
          )}
        </div>
      </div>

      <div className="camera-controls">
        <button type="button" className="btn-door btn-door-open" onClick={handleOpen}>
          <span className="btn-door-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </span>
          Mở cửa
        </button>
        <button type="button" className="btn-door btn-door-shut" onClick={handleClose}>
          <span className="btn-door-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          Đóng cửa
        </button>
      </div>
    </div>
  );
}
