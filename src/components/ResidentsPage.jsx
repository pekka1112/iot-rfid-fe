import React, { useState, useEffect } from 'react';
import ResidentList from './ResidentList';
import ResidentForm from './ResidentForm';
import '../styles/ResidentsPage.css';

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResident, setSelectedResident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchResidents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/residents');
      const data = await response.json();
      const formattedData = data.map(r => {
        let createdAtStr = '—';
        let rawDateStr = '';
        if (r.createdAt) {
          const dateObj = new Date(r.createdAt);
          if (!isNaN(dateObj.getTime())) {
            createdAtStr = dateObj.toLocaleDateString('vi-VN');
            rawDateStr = dateObj.toISOString().split('T')[0];
          }
        }
        return {
          id: r.residentId,
          userId: `ND-${String(r.residentId || '').padStart(3, '0')}`,
          name: r.fullName,
          room: '—',
          phone: r.phone,
          licensePlate: '—',
          email: '—',
          createdAt: createdAtStr,
          rawDate: rawDateStr,
          status: r.status,
          birthYear: r.birthYear
        };
      });
      setResidents(formattedData);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const filteredResidents = residents.filter((resident) => {
    const q = searchTerm.toLowerCase();
    return (
      resident.name.toLowerCase().includes(q) ||
      (resident.id && String(resident.id).toLowerCase().includes(q)) ||
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

  const handleDeleteResident = async (id) => {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/residents/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Xóa dữ liệu thất bại từ Server');
        }
        await fetchResidents();
        setSelectedResident(null);
      } catch (err) {
        console.error('Lỗi khi xóa cư dân:', err);
        alert('Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại.');
      }
    }
  };

  const handleSaveResident = async (residentData) => {
    try {
      const payload = {
        residentId: residentData.residentId ? parseInt(residentData.residentId, 10) : null,
        fullName: residentData.fullName,
        phone: residentData.phone,
        birthYear: residentData.birthYear ? parseInt(residentData.birthYear, 10) : null,
        status: residentData.status || 'active'
      };

      let response;
      if (editingResident) {
        response = await fetch(`http://localhost:8080/api/residents/${editingResident.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('http://localhost:8080/api/residents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Lưu dữ liệu thất bại từ Server');
      }
      
      await fetchResidents();
      setShowForm(false);
      setEditingResident(null);
    } catch (err) {
      console.error('Lỗi khi lưu cư dân:', err);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.');
    }
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
        <div className="residents-toolbar-inner">
          <div className="residents-title-block">
            <h1 className="residents-page-title">Quản lý người dùng</h1>
            <p className="residents-page-subtitle">
              {filteredResidents.length} người dùng
              {searchTerm ? ` (lọc theo tìm kiếm)` : ''}
            </p>
          </div>

          <div className="residents-actions-block">
            <div className="search-box-modern">
              <span className="search-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Tìm theo tên, ID hoặc biển số…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-modern"
              />
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
              Thêm mới
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
          onEditResident={handleEditResident}
          onDeleteResident={handleDeleteResident}
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
                <span className="detail-hero-badge">ID {selectedResident.id}</span>
                <h2 className="detail-hero-name">{selectedResident.name}</h2>
                <p className="detail-hero-meta">
                  {selectedResident.phone}
                </p>
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="detail-info-cell">
                <span className="detail-info-label">ID người dùng</span>
                <span className="detail-info-value detail-mono">{selectedResident.id}</span>
              </div>
              <div className="detail-info-cell">
                <span className="detail-info-label">Biển số xe</span>
                <span className="detail-info-value">
                  <span className="plate-badge">{selectedResident.licensePlate || '—'}</span>
                </span>
              </div>
              <div className="detail-info-cell">
                <span className="detail-info-label">Điện thoại</span>
                <span className="detail-info-value">{selectedResident.phone}</span>
              </div>
              <div className="detail-info-cell">
                <span className="detail-info-label">Ngày thêm</span>
                <span className="detail-info-value">{selectedResident.createdAt}</span>
              </div>
              <div className="detail-info-cell detail-info-wide">
                <span className="detail-info-label">Email</span>
                <span className="detail-info-value">{selectedResident.email || '—'}</span>
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
                Xóa người dùng
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
