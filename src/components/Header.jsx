import React from 'react';
import '../styles/Header.css';

export default function Header({ totalResidents, totalGuests, residentCount, cameras, onToggleMobileSidebar }) {
  return (
    <header className="header">
      <button className="mobile-menu-toggle" onClick={onToggleMobileSidebar} aria-label="Mở menu">
        ☰
      </button>

      <div className="header-main">
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Tổng người dùng:</span>
            <span className="stat-value">{totalResidents}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Số khách:</span>
            <span className="stat-value">{totalGuests}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Số người dùng:</span>
            <span className="stat-value">{residentCount}</span>
          </div>
        </div>

        <div className="header-status-chip-group">
          {cameras.map((camera) => (
            <div key={`door-${camera.id}`} className="header-status-chip">
              <span className="header-status-chip-label">{camera.title === 'Camera Vào' ? 'Cửa vào' : 'Cửa ra'}</span>
              <span className={`header-status-chip-value ${camera.doorOpen ? 'open' : 'closed'}`}>
                {camera.doorOpen ? 'Mở' : 'Đóng'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
