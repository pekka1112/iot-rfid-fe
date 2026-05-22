import React, { useState, useEffect } from 'react';

export default function CameraPage({ cameras = [], onOpen, onClose }) {
  const [activeCamId, setActiveCamId] = useState(1);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [reloadToken, setReloadToken] = useState(Date.now());

  const currentCam = cameras.find((c) => c.id === activeCamId) || {
    id: activeCamId,
    title: activeCamId === 1 ? 'Camera Vào' : 'Camera Ra',
    isActive: true,
    doorOpen: false,
    currentUser: null,
  };

  const entryCam = cameras.find((c) => c.id === 1) || { title: 'Camera Vào', doorOpen: false };
  const exitCam = cameras.find((c) => c.id === 2) || { title: 'Camera Ra', doorOpen: false };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cấu hình Camera tương tự Dashboard
  const IP_CAMERA = "192.168.1.108";
  const CAM_USER = "admin";
  const CAM_PASS = "Abc123456";

  // Sử dụng video feed từ máy chủ Python ở localhost:8000 làm nguồn chính (thêm reload query parameter để ép trình duyệt tải lại)
  const cameraImageUrl = `http://localhost:8000/video_feed?reload=${reloadToken}`;

  const handleReload = () => {
    setReloadToken(Date.now());
    // Khôi phục lại hiển thị của thẻ ảnh và reset các flag lỗi
    const imgEl = document.getElementById('camera-main-stream');
    if (imgEl) {
      imgEl.style.display = 'block';
      delete imgEl.dataset.triedLocalFeed;
      delete imgEl.dataset.triedQueryCredentials;
      delete imgEl.dataset.triedGeneric;
      delete imgEl.dataset.triedBackendProxy;
    }
    const errorBox = document.getElementById('camera-main-error');
    if (errorBox) {
      errorBox.style.display = 'none';
    }
  };

  const handleOpen = () => {
    onOpen?.(currentCam.id);
  };

  const handleClose = () => {
    onClose?.(currentCam.id);
  };

  return (
    <div className="camera-page-container" style={{
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative'
    }}>
      {/* CSS Styles cho Hoạt ảnh */}
      <style>{`
        @keyframes pulse-live {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @keyframes grid-pulse {
          0% { opacity: 0.02; }
          50% { opacity: 0.06; }
          100% { opacity: 0.02; }
        }
        .live-dot-animate {
          animation: pulse-live 1.8s infinite ease-in-out;
        }
        .grid-pulse-animate {
          animation: grid-pulse 4s infinite ease-in-out;
        }
        .corner-line {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #10b981;
          border-style: solid;
          z-index: 5;
        }
        .hud-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 4px;
        }
        .hud-btn.active {
          background-color: #10b981;
          color: #0f172a;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }
        .hud-btn.inactive {
          background-color: transparent;
          color: #94a3b8;
        }
        .hud-btn.inactive:hover {
          color: #f8fafc;
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Header Giám Sát */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '12px'
      }}>
       
      </div>

      {/* Camera Viewport Chiếm 100% không gian */}
      <div style={{
        flex: 1,
        backgroundColor: '#020617',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9)',
        minHeight: '520px'
      }}>
        {/* HUD Overlay - Góc giám sát */}
        <div className="corner-line" style={{ top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 }} />
        <div className="corner-line" style={{ top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 }} />
        <div className="corner-line" style={{ bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 }} />
        <div className="corner-line" style={{ bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 }} />

        {/* Lưới kỹ thuật số */}
        <div className="grid-pulse-animate" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          backgroundSize: '35px 35px',
          backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
          zIndex: 1
        }} />

        {/* HUD Top bar overlay */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          {/* Trạng thái LIVE & Tên Camera */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'none' }}>
            <span style={{
              backgroundColor: 'rgba(239, 68, 68, 0.85)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '900',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              letterSpacing: '1px'
            }} className="live-dot-animate">
              <span style={{ width: '5px', height: '5px', backgroundColor: '#fff', borderRadius: '50%' }} />
              LIVE
            </span>
            <span style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              fontFamily: 'monospace',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8fafc'
            }}>
              {currentCam.title.toUpperCase()}
            </span>
          </div>

          {/* Small door status chips in top-right */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', pointerEvents: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(15, 23, 42, 0.78)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              padding: '4px 6px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#f8fafc'
            }}>
              <span style={{ color: entryCam.doorOpen ? '#10b981' : '#f43f5e' }}>C.VÀO</span>
              <span style={{ color: entryCam.doorOpen ? '#10b981' : '#f43f5e', fontWeight: '900' }}>{entryCam.doorOpen ? 'MỞ' : 'ĐÓNG'}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(15, 23, 42, 0.78)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              padding: '4px 6px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: '700',
              color: '#f8fafc'
            }}>
              <span style={{ color: exitCam.doorOpen ? '#10b981' : '#f43f5e' }}>C.RA</span>
              <span style={{ color: exitCam.doorOpen ? '#10b981' : '#f43f5e', fontWeight: '900' }}>{exitCam.doorOpen ? 'MỞ' : 'ĐÓNG'}</span>
            </div>
          </div>

          {/* CHUYỂN CAMERA TRỰC TIẾP TRÊN MÀN HÌNH (floating) */}
          <div style={{
            display: 'flex',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '3px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            alignItems: 'center'
          }}>
            <button
              type="button"
              className={`hud-btn ${activeCamId === 1 ? 'active' : 'inactive'}`}
              onClick={() => setActiveCamId(1)}
            >
              CỔNG VÀO
            </button>
            <button
              type="button"
              className={`hud-btn ${activeCamId === 2 ? 'active' : 'inactive'}`}
              onClick={() => setActiveCamId(2)}
            >
              CỔNG RA
            </button>
            <button
              type="button"
              className="hud-btn inactive"
              onClick={handleReload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                marginLeft: '4px',
                paddingLeft: '8px',
                borderRadius: '0 4px 4px 0'
              }}
              title="Tải lại luồng camera"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transition: 'transform 0.3s' }}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              LÀM MỚI
            </button>
          </div>
        </div>

        {/* Luồng hình ảnh thực tế */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {currentCam.isActive ? (
            <img
              id="camera-main-stream"
              src={cameraImageUrl}
              alt="Live Surveillance Feed"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                if (!e.target.dataset.triedLocalFeed) {
                  // Thử nghiệm 1: Trực tiếp lấy snapshot từ Camera Dahua (nếu đã đăng nhập ở tab khác)
                  e.target.dataset.triedLocalFeed = true;
                  e.target.src = `http://${IP_CAMERA}/cgi-bin/snapshot.cgi?timestamp=${timestamp}`;
                } else if (!e.target.dataset.triedQueryCredentials) {
                  // Thử nghiệm 2: Gửi thông tin qua Query Params thay vì ở Hostname authority (Không bị Chrome chặn)
                  e.target.dataset.triedQueryCredentials = true;
                  e.target.src = `http://${IP_CAMERA}/cgi-bin/snapshot.cgi?count=1&usr=${CAM_USER}&pwd=${CAM_PASS}&ts=${timestamp}`;
                } else if (!e.target.dataset.triedGeneric) {
                  // Thử nghiệm 3: endpoint snapshot generic Dahua
                  e.target.dataset.triedGeneric = true;
                  e.target.src = `http://${IP_CAMERA}/snapshot.cgi?user=${CAM_USER}&pwd=${CAM_PASS}&t=${timestamp}`;
                } else if (!e.target.dataset.triedBackendProxy) {
                  // Thử nghiệm 4: Proxy qua Backend Spring Boot ở cổng 8080
                  e.target.dataset.triedBackendProxy = true;
                  e.target.src = `http://localhost:8080/api/camera/snapshot?camId=${activeCamId}&t=${timestamp}`;
                } else {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  const errorBox = parent.querySelector('.camera-error-hud');
                  if (errorBox) errorBox.style.display = 'flex';
                }
              }}
            />
          ) : (
            <div style={{ color: '#64748b', fontSize: '18px', fontWeight: '600' }}>CAMERA CHƯA BẬT</div>
          )}

          {/* Bảng báo lỗi */}
          <div id="camera-main-error" className="camera-error-hud" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(2, 6, 23, 0.95)',
            color: '#ef4444',
            gap: '8px',
            zIndex: 3
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span style={{ fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }}>LỖI KẾT NỐI CAMERA FEED</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Đang tự động thử lại các giao thức qua {IP_CAMERA}...</span>
          </div>

          {/* ĐIỀU KHIỂN RƠ LE GẮN TRÊN MÀN HÌNH (FLOATING WIDGET) */}
          <div style={{
            position: 'absolute',
            bottom: '55px',
            right: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 10,
            minWidth: '220px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>
                CỔNG:
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                color: currentCam.doorOpen ? '#10b981' : '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: currentCam.doorOpen ? '#10b981' : '#f43f5e' }} className="live-dot-animate" />
                {currentCam.doorOpen ? 'MỞ (OPEN)' : 'ĐÓNG (CLOSED)'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={handleOpen}
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                MỞ CỬA
              </button>

              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: 1,
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                ĐÓNG CỬA
              </button>
            </div>
          </div>
        </div>

        {/* Footer Monitor Bar */}
        <div style={{
          backgroundColor: '#0b0f19',
          padding: '10px 16px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10px',
          color: '#64748b',
          fontFamily: 'monospace',
          zIndex: 10
        }}>
          <div>RESOL: 1920x1080 (1080P) | FORMAT: MJPEG</div>
          <div>FPS: 25.0 fps | BITRATE: 2048 Kbps | IP: {IP_CAMERA}</div>
          <div>CLOCK: {new Date().toLocaleTimeString('vi-VN')}</div>
        </div>
      </div>
    </div>
  );
}
