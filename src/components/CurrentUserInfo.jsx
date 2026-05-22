import React from 'react';
import '../styles/CurrentUserInfo.css';

export default function CurrentUserInfo({ currentUser }) {
  if (!currentUser) {
    return null;
  }

  const isVerified = currentUser.isVerified === true;
  const directionLabel = currentUser.direction === 'IN' ? 'Vào' : currentUser.direction === 'OUT' ? 'Ra' : '';

  // Lấy chữ cái đầu tên
  const avatarLetter = currentUser.name
    ? currentUser.name.trim().split(' ').pop()?.[0]?.toUpperCase() ?? '?'
    : '?';

  return (
    <div className={`current-user-info ${isVerified ? 'verified' : 'unverified'}`}>
      <div className="user-info-header">
        <div className="avatar" style={{ backgroundColor: isVerified ? '#10b981' : '#ef4444' }}>
          {avatarLetter}
        </div>
        <div className="user-details-main">
          <h3 className="user-name">{currentUser.name || 'Không rõ'}</h3>
          <div className="user-meta">
            <span className={`badge ${isVerified ? 'verified' : 'unverified'}`}>
              {isVerified ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Xác thực
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Người lạ
                </>
              )}
            </span>
            {directionLabel && (
              <span className="direction-badge">
                {directionLabel === 'Vào' ? '🚗↗️' : '🚗↙️'} {directionLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="user-info-body">
        <div className="info-row">
          <span className="info-label">Biển số xe:</span>
          <span className="info-value plate">
            {currentUser.vehiclePlate || '—'}
          </span>
        </div>

        {currentUser.room && (
          <div className="info-row">
            <span className="info-label">Phòng/Căn hộ:</span>
            <span className="info-value">{currentUser.room}</span>
          </div>
        )}

        <div className="info-row">
          <span className="info-label">Thời gian:</span>
          <span className="info-value">{currentUser.detectedAt || '—'}</span>
        </div>

        {!isVerified && currentUser.failReason && (
          <div className="fail-reason">
            <span className="reason-icon">⚠️</span>
            <span className="reason-text">{currentUser.failReason}</span>
          </div>
        )}

        {!isVerified && currentUser.dbPlates && currentUser.dbPlates.length > 0 && (
          <div className="db-plates">
            <span className="db-label">Biển số trong CSDL:</span>
            <div className="plates-list">
              {currentUser.dbPlates.map((plate, index) => (
                <span key={index} className="plate-tag">{plate}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
