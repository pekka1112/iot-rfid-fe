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
            <p className="residents-page-subtitle">
              Số người dùng:{' '}
              <span style={{ fontSize: '1.5em', color: '#ef4444', fontWeight: '700' }}>
                {filteredResidents.length}
              </span>
              {searchTerm ? ` ( thay đổi theo tìm kiếm )` : ''}
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
              Thêm
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
        <div className="resident-detail-overlay" onClick={() => setShowDetailModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000 }}>
          <div className="resident-detail-panel" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '550px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>
            
            {/* Header Modal */}
            <div className="detail-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 30px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '500', color: '#0f172a' }}>Chi tiết người dùng</h2>
              <button type="button" onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content Body: Thông tin (trái) - Hình ảnh (phải) */}
            <div className="detail-modal-body" style={{ display: 'flex', padding: '24px', gap: '24px' }}>
              {/* Bên trái: Thông tin (chiếm phần lớn không gian) */}
              <div className="detail-info-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Họ và tên</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{selectedResident.name}</span>
                </div>
                
                {/* Khung bao quanh 4 thông tin */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Điện thoại</span>
                    <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '600' }}>{selectedResident.phone}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Biển số xe</span>
                    {selectedResident.licensePlate ? (
                      <span className="plate-badge" style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a' }}>
                        {selectedResident.licensePlate}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>ID Người dùng</span>
                    <span className="detail-mono" style={{ fontFamily: 'monospace', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>
                      {selectedResident.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Ngày thêm</span>
                    <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}>{selectedResident.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Bên phải: Hình đại diện */}
              <div className="detail-avatar-right" style={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid #f1f5f9', paddingLeft: '24px', justifyContent: 'center' }}>
                {/* Avatar to hơn và có position relative để gắn badge */}
                <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '16px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}>
                    {detailInitial}
                  </div>
                  
                  {/* Trạng thái ở góc trên bên trái */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: selectedResident.status === 'active' ? '#10b981' : '#ef4444', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} title={selectedResident.status === 'active' ? 'Đang hoạt động' : 'Bị khóa'}>
                    {selectedResident.status === 'active' ? (
                      <span style={{ width: '12px', height: '12px', backgroundColor: '#fff', borderRadius: '50%' }}></span>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    )}
                  </div>
                </div>
                
                <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '700' }}>
                  ID {selectedResident.id}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="detail-modal-footer" style={{ padding: '16px 24px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => {
                  handleEditResident(selectedResident);
                  setShowDetailModal(false);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              >
                Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteResident(selectedResident.id);
                  setShowDetailModal(false);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', fontSize: '0.9rem' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Xóa
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
