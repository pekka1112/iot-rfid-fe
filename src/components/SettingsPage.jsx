import { useState } from 'react';
import '../styles/SettingsPage.css';

export default function SettingsPage() {
  const [autoSync, setAutoSync] = useState(false);
  const [rfidMode, setRfidMode] = useState('normal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sendStatus, setSendStatus] = useState('');

  const handleSendData = () => {
    setSendStatus('Đang gửi dữ liệu máy RFID về máy...');
    setTimeout(() => {
      setSendStatus('Đã gửi dữ liệu máy RFID về máy thành công.');
    }, 1200);
  };

  const modeLabel =
    rfidMode === 'normal' ? 'Bình thường' : rfidMode === 'fast' ? 'Tốc độ cao' : 'Tiết kiệm năng lượng';

  return (
    <div className="settings-page">
      <div className="settings-toolbar-card">
        <div className="settings-title-block">
          <h1 className="settings-page-title">Cài đặt hệ thống</h1>
          <p className="settings-page-subtitle">
            Thiết lập RFID, thông báo và đồng bộ dữ liệu với thiết bị
          </p>
        </div>
      </div>

      <div className="settings-panels">
        <section className="settings-panel-card">
          <div className="settings-panel-head">
            <h2 className="settings-panel-title">Cài đặt chung</h2>
            <p className="settings-panel-desc">Tùy chọn hoạt động đầu đọc và thông báo</p>
          </div>

          <div className="settings-panel-body">
            <div className="settings-row">
              <div className="settings-row-text">
                <span className="settings-row-label">Tự động đồng bộ RFID</span>
                <span className="settings-row-hint">Đồng bộ định kỳ với máy chủ</span>
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
                <span className="settings-row-label">Thông báo</span>
                <span className="settings-row-hint">Email khi có sự kiện quan trọng</span>
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
                <span className="settings-row-hint">Cân bằng tốc độ và tiêu thụ</span>
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
            <button type="button" className="btn-settings-sync" onClick={handleSendData}>
              <span className="btn-settings-sync-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </span>
              Đẩy dữ liệu máy RFID về máy
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
    </div>
  );
}
