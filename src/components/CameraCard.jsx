import React, { useState, useEffect, useRef } from 'react';
import '../styles/CameraCard.css';

export default function CameraCard({ title, isActive, doorOpen, currentUser, onOpen, onClose }) {
  const handleOpen = () => {
    onOpen?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  const saveLog = async () => {

  const response = await fetch(
    "http://localhost:8080/api/access-logs/save",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
    );

    const data = await response.json();

    console.log(data);

    setCurrentUser({
      name: data.residentName,
      vehiclePlate: data.detectedPlate,
      isVerified: data.isCorrectFaceAndPlate,
      direction: data.direction,
      detectedAt: data.timestamp,
      failReason: data.failReason,
      dbPlates: data.dbPlates
    });
  };

  const isActiveUser = isActive && currentUser;
  // Lấy chữ cái đầu của tên
  const avatarLetter = currentUser?.name
    ? currentUser.name.trim().split(' ').pop()?.[0]?.toUpperCase() ?? '?'
    : '?';
  // Hướng di chuyển
  const dirLabel = currentUser?.direction === 'IN' ? 'Xe vào' : currentUser?.direction === 'OUT' ? 'Xe ra' : '';
  const isVerified = currentUser?.isVerified === true;

  // Cấu hình Camera
  const IP_CAMERA = "192.168.1.108";
  const CAM_USER = "admin";
  const CAM_PASS = "Abc123456";
  
  // Trạng thái timestamp để cập nhật ảnh (tạo hiệu ứng video giả)
  const [timestamp, setTimestamp] = useState(Date.now());
  const [reloadToken, setReloadToken] = useState(Date.now());
  const imgRef = useRef(null);

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
  // Sử dụng video feed từ máy chủ Python ở localhost:8000 làm nguồn chính (kèm theo reloadToken để ép tải lại)
  const cameraImageUrl = `http://localhost:8000/video_feed?reload=${reloadToken}`;

  const handleReload = () => {
    const freshToken = Date.now();
    setReloadToken(freshToken);
    
    if (imgRef.current) {
      imgRef.current.style.display = 'block';
      delete imgRef.current.dataset.triedLocalFeed;
      delete imgRef.current.dataset.triedQueryCredentials;
      delete imgRef.current.dataset.triedGeneric;
      delete imgRef.current.dataset.triedBackendProxy;
      
      // Cập nhật trực tiếp đường dẫn với token mới nhất để ép tải lại tức thì
      imgRef.current.src = `http://localhost:8000/video_feed?reload=${freshToken}`;
    }

    const parent = imgRef.current?.parentElement;
    if (parent) {
      const errorBox = parent.querySelector('.camera-error-hud');
      if (errorBox) {
        errorBox.style.display = 'none';
      }
    }
  };

  return (
    <div className="camera-card">
      <div className={`camera-display ${isActive ? 'active' : 'inactive'}`} style={{ padding: '5px' }}>
        <div className="camera-preview" style={{ position: 'relative', overflow: 'hidden', width: '100%', margin: 0 }}>
          {/* Overlay góc trên bên trái: Tên camera thu nhỏ kèm chấm xanh/xám thể hiện trạng thái hoạt động */}
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <span style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isActive ? '#10b981' : '#64748b',
              boxShadow: isActive ? '0 0 8px #10b981' : 'none',
              transition: 'all 0.3s ease'
            }} />
            {title}
          </div>

          {/* Overlay góc trên bên phải: Nhãn LIVE / OFF */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 54,
            zIndex: 10,
            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
            color: isActive ? '#10b981' : '#94a3b8',
            border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(100, 116, 139, 0.25)'}`,
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '0.06em',
            backdropFilter: 'blur(4px)'
          }}>
            {isActive ? 'LIVE' : 'OFF'}
          </div>

          <div
            title={doorOpen ? 'Cửa mở' : 'Cửa đóng'}
            style={{
              position: 'absolute',
              top: 44,
              right: 12,
              zIndex: 10,
              width: '32px',
              height: '32px',
              backgroundColor: doorOpen ? 'rgba(16, 185, 129, 0.16)' : 'rgba(239, 68, 68, 0.12)',
              color: doorOpen ? '#10b981' : '#f43f5e',
              border: `1px solid ${doorOpen ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {doorOpen ? (
                <>
                  <path d="M3 21V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14" />
                  <path d="M7 21V11h6" />
                  <path d="M15 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                </>
              ) : (
                <>
                  <path d="M3 7V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2" />
                  <path d="M7 21V7h10v14" />
                  <path d="M12 16h2" />
                </>
              )}
            </svg>
          </div>

          {/* Nút tải lại nổi ở góc trên bên phải (cạnh nhãn LIVE) */}
          {isActive && (
            <button
              type="button"
              onClick={handleReload}
              title="Tải lại luồng camera"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>
          )}

          {isActive ? (
            <>
              <img 
                ref={imgRef}
                src={cameraImageUrl} 
                alt="Camera Feed"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  if (!e.target.dataset.triedLocalFeed) {
                    // Thử nghiệm 1: Trực tiếp lấy snapshot từ Camera Dahua (nếu đã đăng nhập ở tab khác)
                    e.target.dataset.triedLocalFeed = true;
                    e.target.src = `http://${IP_CAMERA}/cgi-bin/snapshot.cgi?timestamp=${timestamp}`;
                  } else if (!e.target.dataset.triedQueryCredentials) {
                    // Thử nghiệm 2: Gửi thông tin đăng nhập qua Query Params (không bị Chrome chặn)
                    e.target.dataset.triedQueryCredentials = true;
                    e.target.src = `http://${IP_CAMERA}/cgi-bin/snapshot.cgi?count=1&usr=${CAM_USER}&pwd=${CAM_PASS}&ts=${timestamp}`;
                  } else if (!e.target.dataset.triedGeneric) {
                    // Thử nghiệm 3: endpoint snapshot generic Dahua
                    e.target.dataset.triedGeneric = true;
                    e.target.src = `http://${IP_CAMERA}/snapshot.cgi?user=${CAM_USER}&pwd=${CAM_PASS}&t=${timestamp}`;
                  } else if (!e.target.dataset.triedBackendProxy) {
                    // Thử nghiệm 4: Proxy qua Spring Boot ở cổng 8080
                    e.target.dataset.triedBackendProxy = true;
                    const activeCamId = title.toLowerCase().includes('vào') ? 1 : 2;
                    e.target.src = `http://localhost:8080/api/camera/snapshot?camId=${activeCamId}&t=${timestamp}`;
                  } else {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const errorBox = parent.querySelector('.camera-error-hud');
                    if (errorBox) errorBox.style.display = 'flex';
                  }
                }}
              />
              <div className="camera-error-hud" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                color: '#ef4444',
                gap: '8px',
                zIndex: 3,
                textAlign: 'center',
                padding: '10px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span style={{ fontWeight: '700', fontSize: '13px', letterSpacing: '0.5px' }}>LỖI KẾT NỐI CAMERA FEED</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Đang thử lại các giao thức qua {IP_CAMERA}...</span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="camera-user-panel">
        <div className="camera-user-header">
          {/* Avatar */}
          <div className="avatar-circle" style={{
            background: isVerified
              ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
          }}>
            {isActiveUser ? avatarLetter : '?'}
          </div>
          <div style={{ flex: 1 }}>
            <p className="user-name">
              {isActiveUser ? currentUser.name : 'Chưa có thông tin'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              {isActiveUser && dirLabel && (
                <span style={{
                  fontSize: '11px', fontWeight: '700',
                  color: currentUser.direction === 'IN' ? '#059669' : '#3b82f6',
                  backgroundColor: currentUser.direction === 'IN' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                  border: `1px solid ${currentUser.direction === 'IN' ? 'rgba(16,185,129,0.25)' : 'rgba(59,130,246,0.25)'}`,
                  padding: '2px 8px', borderRadius: '999px'
                }}>
                  {dirLabel}
                </span>
              )}
              {isActiveUser && isVerified && (
                <span style={{
                  fontSize: '11px', fontWeight: '700',
                  color: '#059669',
                  backgroundColor: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  padding: '2px 8px', borderRadius: '999px',
                  display: 'flex', alignItems: 'center', gap: '3px'
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Xác thực
                </span>
              )}
              {!isActiveUser && (
                <p className="user-type" style={{ margin: 0 }}>Không có dữ liệu</p>
              )}
            </div>
          </div>
        </div>

        <div className="user-info-grid">
          {isActiveUser ? (
            <>
              {/* Biển số xe */}
              <div className="info-item" style={{ gridColumn: currentUser.vehiclePlate ? 'auto' : '1 / -1' }}>
                <span className="info-label">Biển số xe</span>
                <span className="info-value" style={{
                  fontFamily: currentUser.vehiclePlate ? 'monospace' : 'inherit',
                  letterSpacing: currentUser.vehiclePlate ? '1px' : 'normal',
                  fontWeight: '700',
                  color: currentUser.vehiclePlate ? '#0f172a' : '#94a3b8'
                }}>
                  {currentUser.vehiclePlate || '—'}
                </span>
              </div>
              {/* Trạng thái */}
              <div className="info-item">
                <span className="info-label">Trạng thái</span>
                <span className="info-value" style={{ color: isVerified ? '#059669' : '#0f172a' }}>
                  {currentUser.status || '—'}
                </span>
              </div>
              {/* Thời gian */}
              <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                <span className="info-label">Thời gian phát hiện</span>
                <span className="info-value">{currentUser.detectedAt || '—'}</span>
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
