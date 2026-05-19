import React, { useState, useEffect } from 'react';
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

  // Cấu hình Camera
  const IP_CAMERA = "192.168.1.108";
  const CAM_USER = "admin";
  const CAM_PASS = "Abc123456";
  
  // Trạng thái timestamp để cập nhật ảnh (tạo hiệu ứng video giả)
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    let interval;
    if (isActive) {
      // Làm mới ảnh mỗi 1 giây (1000ms) khi camera đang bật
      interval = setInterval(() => {
        setTimestamp(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // URL hiển thị ảnh từ camera. 
  // Đối với một số dòng camera phổ biến (Dahua, Kbvision...), URL snapshot có dạng:
  // http://admin:pass@ip/cgi-bin/snapshot.cgi
  // Hoặc luồng MJPEG: http://admin:pass@ip/cgi-bin/mjpg/video.cgi?subtype=1
  // *Lưu ý: Nếu trình duyệt chặn format http://user:pass@ip, bạn có thể cần cấu hình backend proxy.
  const cameraImageUrl = `http://${CAM_USER}:${CAM_PASS}@${IP_CAMERA}/cgi-bin/snapshot.cgi?timestamp=${timestamp}`;

  return (
    <div className="camera-card">
      <div className={`camera-display ${isActive ? 'active' : 'inactive'}`}>
        <div className="camera-heading">
          <p className="camera-title">{title}</p>
          <span className={`camera-status ${isActive ? 'online' : 'offline'}`}>
            {isActive ? 'Đang hoạt động' : 'Tắt'}
          </span>
        </div>

        <div className="camera-preview" style={{ position: 'relative', overflow: 'hidden' }}>
          {isActive ? (
            <img 
              src={cameraImageUrl} 
              alt="Camera Feed"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Thử dự phòng với Hikvision nếu Dahua lỗi
                if (!e.target.dataset.triedHikvision) {
                  e.target.dataset.triedHikvision = true;
                  e.target.src = `http://${CAM_USER}:${CAM_PASS}@${IP_CAMERA}/ISAPI/Streaming/channels/101/picture?timestamp=${timestamp}`;
                } else if (!e.target.dataset.triedGeneric) {
                  e.target.dataset.triedGeneric = true;
                  e.target.src = `http://${IP_CAMERA}/snapshot.cgi?user=${CAM_USER}&pwd=${CAM_PASS}&t=${timestamp}`;
                }
              }}
            />
          ) : null}
          <div className="camera-preview-badge" style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
            {isActive ? 'LIVE' : 'OFF'}
          </div>
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
