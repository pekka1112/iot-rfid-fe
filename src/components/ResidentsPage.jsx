import React, { useState } from 'react';
import ResidentList from './ResidentList';
import ResidentForm from './ResidentForm';
import '../styles/ResidentsPage.css';

const initialResidents = [
  { id: 1, userId: 'ND-001', name: 'Nguyễn Văn A', room: '101', phone: '0912345678', licensePlate: '51H-123.45', email: 'nguyenvana@example.com', createdAt: '01/02/2024' },
  { id: 2, userId: 'ND-002', name: 'Trần Thị B', room: '102', phone: '0923456789', licensePlate: '30A-567.89', email: 'tranthib@example.com', createdAt: '03/04/2024' },
  { id: 3, userId: 'ND-003', name: 'Phạm Văn C', room: '201', phone: '0934567890', licensePlate: '43B-111.22', email: 'phamvanc@example.com', createdAt: '08/05/2024' },
  { id: 4, userId: 'ND-004', name: 'Lê Thị D', room: '202', phone: '0945678901', licensePlate: '59C-999.88', email: 'lethid@example.com', createdAt: '12/06/2024' },
];

export default function ResidentsPage() {
  const [residents, setResidents] = useState(initialResidents);

  const [showForm, setShowForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResident, setSelectedResident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredResidents = residents.filter((resident) => {
    const q = searchTerm.toLowerCase();
    return (
      resident.name.toLowerCase().includes(q) ||
      resident.room.includes(searchTerm) ||
      (resident.userId && resident.userId.toLowerCase().includes(q)) ||
      (resident.licensePlate && resident.licensePlate.toLowerCase().includes(q))
    );
  });

  const handleAddResident = () => {
    setEditingResident(null);
    setShowForm(true);
  };

  const handleEditResident = (resident) => {
    setEditingResident(resident);
    setShowForm(true);
  };

  const handleDeleteResident = (id) => {
    if (confirm('Bạn có chắc muốn xóa cư dân này?')) {
      setResidents(residents.filter((r) => r.id !== id));
      setSelectedResident(null);
    }
  };

  const nextUserId = () => {
    const maxNum = residents.reduce((acc, r) => {
      const m = String(r.userId || '').match(/(\d+)$/);
      return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
    }, 0);
    return `ND-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSaveResident = (residentData) => {
    if (editingResident) {
      setResidents(
        residents.map((r) =>
          r.id === editingResident.id
            ? { ...r, ...residentData, userId: r.userId }
            : r
        )
      );
    } else {
      setResidents([
        ...residents,
        {
          id: Date.now(),
          userId: nextUserId(),
          ...residentData,
          email: residentData.email || '',
          createdAt: new Date().toLocaleDateString('vi-VN'),
        },
      ]);
    }
    setShowForm(false);
    setEditingResident(null);
  };

  const handleViewResidentDetail = (resident) => {
    setSelectedResident(resident);
    setShowDetailModal(true);
  };

  const detailInitial = selectedResident?.name
    ? selectedResident.name.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'
    : '?';

  return (
    <div className="residents-page">
      <div className="residents-toolbar-card">
        <div className="residents-toolbar-top">
          <div className="residents-title-block">
            <h1 className="residents-page-title">Quản lý cư dân</h1>
            <p className="residents-page-subtitle">
              {filteredResidents.length} cư dân
              {searchTerm ? ` (lọc theo tìm kiếm)` : ''}
            </p>
          </div>
          <button type="button" className="btn-add-primary" onClick={handleAddResident}>
            <span className="btn-add-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </span>
            Thêm cư dân mới
          </button>
        </div>

        <div className="residents-toolbar-bottom">
          <div className="search-box-modern">
            <span className="search-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Tìm theo tên, phòng, ID hoặc biển số…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-modern"
            />
          </div>

          <div className="action-buttons-modern">
            <button
              type="button"
              className="btn-toolbar btn-toolbar-edit"
              onClick={() => selectedResident && handleEditResident(selectedResident)}
              disabled={!selectedResident}
            >
              Sửa
            </button>
            <button
              type="button"
              className="btn-toolbar btn-toolbar-delete"
              onClick={() => selectedResident && handleDeleteResident(selectedResident.id)}
              disabled={!selectedResident}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      <div className="residents-table-card">
        <ResidentList
          residents={filteredResidents}
          selectedResident={selectedResident}
          onSelectResident={setSelectedResident}
          onViewDetailResident={handleViewResidentDetail}
        />
      </div>

      {showDetailModal && selectedResident && (
        <div className="resident-detail-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="resident-detail-panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="detail-panel-close" onClick={() => setShowDetailModal(false)} aria-label="Đóng">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="detail-panel-hero">
              <div className="detail-hero-avatar">{detailInitial}</div>
              <div className="detail-hero-text">
                <span className="detail-hero-badge">ID {selectedResident.userId}</span>
                <h2 className="detail-hero-name">{selectedResident.name}</h2>
                <p className="detail-hero-meta">
                  Phòng {selectedResident.room}
                  <span className="detail-hero-dot" aria-hidden>·</span>
                  {selectedResident.phone}
                </p>
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="detail-info-cell">
                <span className="detail-info-label">ID người dùng</span>
                <span className="detail-info-value detail-mono">{selectedResident.userId}</span>
              </div>
              <div className="detail-info-cell">
                <span className="detail-info-label">Biển số xe</span>
                <span className="detail-info-value">
                  <span className="plate-badge">{selectedResident.licensePlate || '—'}</span>
                </span>
              </div>
              <div className="detail-info-cell">
                <span className="detail-info-label">Phòng</span>
                <span className="detail-info-value">{selectedResident.room}</span>
              </div>
              <div className="detail-info-cell">
                <span className="detail-info-label">Điện thoại</span>
                <span className="detail-info-value">{selectedResident.phone}</span>
              </div>
              <div className="detail-info-cell detail-info-wide">
                <span className="detail-info-label">Email</span>
                <span className="detail-info-value">{selectedResident.email || '—'}</span>
              </div>
              <div className="detail-info-cell">
                <span className="detail-info-label">Ngày thêm</span>
                <span className="detail-info-value">{selectedResident.createdAt}</span>
              </div>
            </div>

            <div className="detail-panel-actions">
              <button
                type="button"
                className="detail-btn detail-btn-ghost"
                onClick={() => {
                  handleEditResident(selectedResident);
                  setShowDetailModal(false);
                }}
              >
                Chỉnh sửa hồ sơ
              </button>
              <button
                type="button"
                className="detail-btn detail-btn-danger"
                onClick={() => {
                  handleDeleteResident(selectedResident.id);
                  setShowDetailModal(false);
                }}
              >
                Xóa cư dân
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <ResidentForm
          resident={editingResident}
          onSave={handleSaveResident}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
