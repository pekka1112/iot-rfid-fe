import React, { useState } from 'react';
import '../styles/TestPanel.css';
import {
  mockVerifiedUser,
  mockIntruderAlert
} from '../utils/mockData';

export default function TestPanel({ onTestData, onClearData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const scenarios = [
    {
      id: 'verified-in',
      label: '✅ Người Xác Thực (Vào)',
      description: 'Hiển thị thông tin người dùng xác thực',
      action: () => onTestData('verified-in', { camera: 1, currentUser: mockVerifiedUser })
    },
    {
      id: 'unverified-plate',
      label: '❌ Người Lạ - Biển Số Không Khớp',
      description: 'Phát hiện biển số không khớp khuôn mặt',
      action: () => onTestData('unverified-plate', { camera: 1, currentUser: null, alert: mockIntruderAlert })
    },
    {
      id: 'unverified-face',
      label: '❌ Người Lạ - Khuôn Mặt Không Khớp',
      description: 'Phát hiện khuôn mặt không khớp biển số',
      action: () => onTestData('unverified-face', { camera: 2, currentUser: mockUnverifiedFace, alert: { ...mockIntruderAlert, camId: 2, directionText: 'Ra' } })
    },
    {
      id: 'verified-out',
      label: '✅ Người Xác Thực (Ra)',
      description: 'Hiển thị thông tin người dùng xác thực - chiều ra',
      action: () => onTestData('verified-out', { camera: 2, currentUser: { ...mockVerifiedUser, direction: 'OUT' } })
    },
    {
      id: 'clear',
      label: '🗑️ Clear Tất Cả',
      description: 'Xóa dữ liệu test',
      action: () => {
        onClearData();
        setIsExpanded(false);
      },
      danger: true
    }
  ];

  return (
    <div className={`test-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded ? (
        <button
          className="test-panel-toggle"
          onClick={() => setIsExpanded(true)}
          title="Mở Test Panel"
        >
          <span className="test-icon">🧪</span>
          <span className="test-label">TEST MODE</span>
        </button>
      ) : (
        <div className="test-panel-content">
          <div className="test-panel-header">
            <h3>🧪 Test Panel - Simulate User Data</h3>
            <button
              className="test-close-btn"
              onClick={() => setIsExpanded(false)}
              title="Đóng Test Panel"
            >
              ✕
            </button>
          </div>

          <div className="test-info">
            <p>Chọn scenario để test các chức năng mà không cần dữ liệu thực từ backend</p>
          </div>

          <div className="test-scenarios">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={`scenario-btn ${scenario.danger ? 'danger' : ''}`}
                onClick={scenario.action}
                title={scenario.description}
              >
                <span className="scenario-label">{scenario.label}</span>
                <span className="scenario-desc">{scenario.description}</span>
              </button>
            ))}
          </div>

          <div className="test-legend">
            <div className="legend-item">
              <span className="legend-icon verified">✓</span>
              <span>Verified: Người dùng hợp lệ, hiển thị CurrentUserInfo</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon unverified">!</span>
              <span>Unverified: Người lạ, hiển thị IntruderAlert</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon">🎬</span>
              <span>Mỗi click sẽ trigger UI mà không gọi API</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
