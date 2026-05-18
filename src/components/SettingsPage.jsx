import { useState } from 'react';
import axios from 'axios';
import '../styles/SettingsPage.css';

export default function SettingsPage() {
  const [autoSync, setAutoSync] = useState(false);
  const [rfidMode, setRfidMode] = useState('normal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sendStatus, setSendStatus] = useState('');
  const [showBackup, setShowBackup] = useState(false);
  const [backupData, setBackupData] = useState([]);

  const handleViewBackup = async () => {
    try {
      setSendStatus('Đang tải dữ liệu backup...');
      const response = await fetch('http://localhost:8080/api/residents');
      const data = await response.json();
      setBackupData(data);
      setShowBackup(true);
      setSendStatus('');
    } catch (err) {
      console.error(err);
      setSendStatus('Lỗi khi tải dữ liệu backup.');
    }
  };

  const handlePushDataToRFID = async () => {
    setSendStatus('Đang kết nối và đẩy dữ liệu lên máy RFID...');
    try {
      // Thay đổi đường dẫn API bên dưới cho phù hợp với backend Spring Boot của bạn
      const response = await axios.post('http://localhost:8080/api/rfid/push', {
        action: 'push_data',
        timestamp: new Date().toISOString()
      });
      if (response.status === 200) {
        setSendStatus('Đã đẩy dữ liệu lên máy RFID thành công.');
      } else {
        setSendStatus('Có lỗi xảy ra khi đẩy dữ liệu.');
      }
    } catch (error) {
      console.error('Lỗi khi đẩy dữ liệu lên RFID:', error);
      setSendStatus('Lỗi kết nối đến máy chủ Spring Boot (localhost:8080).');
    }
  };

  const modeLabel =
    rfidMode === 'normal' ? 'Bình thường' : rfidMode === 'fast' ? 'Tốc độ cao' : 'Tiết kiệm năng lượng';

  return (
    <div className="settings-page">
      <div className="settings-toolbar-card">
        <div className="settings-title-block">
          <h1 className="settings-page-title">Cài đặt hệ thống</h1>
        </div>
      </div>

      <div className="settings-panels">
        <section className="settings-panel-card">
          <div className="settings-panel-head">
            <h2 className="settings-panel-title">Cài đặt chung</h2>
          </div>

          <div className="settings-panel-body">
            <div className="settings-row">
              <div className="settings-row-text">
                <span className="settings-row-label">Tự động đồng bộ RFID</span>
              </div>
              <label className="toggle-switch-modern">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={() => setAutoSync((v) => !v)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-row">
              <div className="settings-row-text">
                <span className="settings-row-label">Thông báo Emai</span>
              </div>
              <label className="toggle-switch-modern">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled((v) => !v)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-row">
              <div className="settings-row-text">
                <span className="settings-row-label">Chế độ RFID</span>
              </div>
              <select
                className="settings-select"
                value={rfidMode}
                onChange={(e) => setRfidMode(e.target.value)}
              >
                <option value="normal">Bình thường</option>
                <option value="fast">Tốc độ cao</option>
                <option value="energy">Tiết kiệm năng lượng</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-panel-card settings-panel-sync">
          <div className="settings-panel-head">
            <h2 className="settings-panel-title">Đồng bộ RFID</h2>
            <p className="settings-panel-desc">Đẩy dữ liệu từ đầu đọc RFID về máy chủ</p>
          </div>

          <div className="settings-panel-body">
            <button type="button" className="btn-settings-sync" onClick={handlePushDataToRFID}>
              <span className="btn-settings-sync-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </span>
              Đẩy dữ liệu về máy RFID
            </button>

            <button type="button" className="btn-settings-sync" onClick={handleViewBackup} style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
              <span className="btn-settings-sync-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M21 9H3" />
                  <path d="M9 21V9" />
                </svg>
              </span>
              Xem dữ liệu backup
            </button>

            {sendStatus && <p className="settings-send-status">{sendStatus}</p>}
            <div className="settings-summary-grid">
              <div className="settings-summary-item">
                <span className="settings-summary-label">Trạng thái đồng bộ</span>
                <span className="settings-summary-value">{autoSync ? 'Tự động' : 'Thủ công'}</span>
              </div>
              <div className="settings-summary-item">
                <span className="settings-summary-label">Chế độ RFID</span>
                <span className="settings-summary-value">{modeLabel}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      {showBackup && (
        <div className="backup-overlay" onClick={() => setShowBackup(false)}>
          <div className="backup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="backup-modal-head">
              <h2>Dữ liệu Backup</h2>
              <button className="backup-close-btn" onClick={() => setShowBackup(false)}>
                ✕
              </button>
            </div>
            <div className="backup-modal-body">
              <table className="backup-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {backupData.map((user) => {
                    const avatarLetter = user.fullName?.trim().split(/\s+/).pop()?.[0]?.toUpperCase() || '?';
                    return (
                      <tr key={user.residentId}>
                        <td>
                          <div className="backup-avatar">{avatarLetter}</div>
                        </td>
                        <td>{user.residentId}</td>
                        <td>{user.fullName}</td>
                      </tr>
                    );
                  })}
                  {backupData.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
