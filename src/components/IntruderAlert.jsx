import React, { useState, useEffect } from 'react';
import '../styles/IntruderAlert.css';

export default function IntruderAlert({ alert, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!alert) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    // Tự động đóng cảnh báo sau 8 giây nếu không đóng thủ công
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [alert]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!alert || !isVisible) {
    return null;
  }

  const directionEmoji = alert.directionText === 'Vào' ? '↗️' : '↙️';

  return (
    <div className="intruder-alert-overlay" onClick={handleClose}>
      <div className="intruder-alert-container" onClick={(e) => e.stopPropagation()}>
        {/* Animated warning icon */}
        <div className="warning-icon-container">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2 className="alert-title">⚠️ PHÁT HIỆN NGƯỜI LẠ</h2>

        <div className="alert-content">
          <p className="alert-message">Có người không được xác thực cố gắng vào khu vực hạn chế!</p>

          <div className="alert-details">
            <div className="detail-row">
              <span className="detail-label">Chiều:</span>
              <span className="detail-value direction">
                {directionEmoji} {alert.directionText === 'Vào' ? 'Vào' : 'Ra'} (Camera {alert.directionText})
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Biển số phát hiện:</span>
              <span className="detail-value plate">{alert.detectedPlate || 'Không rõ'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Thời gian:</span>
              <span className="detail-value">{alert.time || '—'}</span>
            </div>

            {alert.logId && (
              <div className="detail-row">
                <span className="detail-label">Log ID:</span>
                <span className="detail-value log-id">{alert.logId}</span>
              </div>
            )}
          </div>

          <div className="alert-actions">
            <button className="btn-action btn-acknowledge" onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Đã biết
            </button>
            <button className="btn-action btn-details" onClick={() => window.location.href = '#history'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <path d="M12 1v6m0 6v6" />
                <path d="M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24" />
                <path d="M1 12h6m6 0h6" />
                <path d="M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24" />
              </svg>
              Chi tiết
            </button>
          </div>
        </div>

        <button className="btn-close" onClick={handleClose} title="Đóng cảnh báo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Pulsing border effect */}
        <div className="alert-pulse" />
      </div>
    </div>
  );
}
