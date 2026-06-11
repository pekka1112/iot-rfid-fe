import React, { useState, useEffect } from 'react';
import '../styles/HistoryPage.css'; 

export default function RfidCardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rfidData, setRfidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({ cardUid: '', plateNumber: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRfidCards();
  }, []);

  const fetchRfidCards = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/rfid-cards');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Data from API:', data);
        // Use direction from API response, or default to 'Ra' if not provided
        const dataWithDirection = data.map(card => ({
          ...card,
          direction: card.direction || 'Ra'
        }));
        setRfidData(dataWithDirection);
      } else {
        setRfidData([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu thẻ RFID:', err);
      setRfidData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setModalMode('create');
    setFormData({ cardUid: '', plateNumber: '' });
    setEditingCard(null);
    setShowModal(true);
  };

  const handleEditClick = (card) => {
    setModalMode('edit');
    setEditingCard(card);
    setFormData({ cardUid: card.cardUid, plateNumber: card.plateNumber });
    setShowModal(true);
  };

  const handleDeleteClick = async (card) => {
    if (!confirm(`Xác nhận xóa thẻ RFID: ${card.cardUid}?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/rfid-cards/${card.rfidId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Xóa thẻ RFID thành công');
        setRfidData(rfidData.filter(c => c.rfidId !== card.rfidId));
      } else {
        alert('Lỗi khi xóa thẻ RFID');
      }
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      alert('Lỗi khi xóa thẻ RFID');
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.cardUid.trim() || !formData.plateNumber.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);

    try {
      if (modalMode === 'create') {
        // Create new RFID card
        const response = await fetch('http://localhost:8080/api/rfid-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const newCard = await response.json();
          alert('Tạo thẻ RFID thành công');
          setRfidData([...rfidData, { ...newCard, direction: newCard.direction || 'Ra' }]);
          setShowModal(false);
        } else {
          alert('Lỗi khi tạo thẻ RFID');
        }
      } else if (modalMode === 'edit') {
        // Update existing RFID card
        const response = await fetch(`http://localhost:8080/api/rfid-cards/${editingCard.rfidId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Cập nhật thẻ RFID thành công');
          setRfidData(rfidData.map(c =>
            c.rfidId === editingCard.rfidId
              ? { ...c, cardUid: formData.cardUid, plateNumber: formData.plateNumber }
              : c
          ));
          setShowModal(false);
        } else {
          alert('Lỗi khi cập nhật thẻ RFID');
        }
      }
    } catch (err) {
      console.error('Lỗi khi gửi form:', err);
      alert('Lỗi khi xử lý yêu cầu');
    } finally {
      setSubmitting(false);
    }
  };

 const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
   }).format(new Date(dateString));
  };

  const filteredData = rfidData.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      (item.cardUid && item.cardUid.toLowerCase().includes(q)) ||
      (item.plateNumber && item.plateNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="history-page">
      <div className="history-toolbar-card">
        <div className="history-toolbar-inner">
          <div className="history-title-block">
            <h1 className="history-page-title">Quản lý thẻ RFID</h1>
            <p className="history-page-subtitle">
              ( Danh sách thẻ RFID quét qua hệ thống )
            </p>
          </div>
          
          <div className="history-actions-block">
            <div className="history-search-box" style={{ margin: 0 }}>
              <span className="history-search-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Tìm theo ID thẻ, biển số..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="history-search-input"
              />
            </div>
            <button 
              type="button" 
              className="btn-export-primary" 
              onClick={handleCreateClick}
              style={{
                backgroundColor: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span className="btn-export-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
              Tạo thẻ
            </button>
            <button type="button" className="btn-export-primary" onClick={() => alert('Đang xuất dữ liệu')}>
              <span className="btn-export-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              Xuất dữ liệu
            </button>
          </div>
        </div>
      </div>

      <div className="history-content-card">
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID Thẻ</th>
                <th>Biển số xe</th>
                <th style={{ textAlign: 'center' }}>Thời gian thẻ được tạo</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Hành động thẻ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Đang tải dữ liệu...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state-cell" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Không có dữ liệu thẻ RFID
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={row.rfidId || index}>
                    <td>
                      <span className="detail-mono" style={{ fontWeight: 600, color: '#334155' }}>{row.cardUid}</span>
                    </td>
                    <td>
                      {row.plateNumber ? <span className="plate-badge" style={{ display: 'inline-block', padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 700, fontSize: '13px' }}>{row.plateNumber}</span> : '—'}
                    </td>
                    <td style={{ fontWeight: 600, color: '#475569', textAlign: 'center' }}>{formatDateTime(row.createdAt) || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-badge ${row.direction === 'Vào' ? 'status-in' : row.direction === 'Ra' ? 'status-out' : ''}`} style={{ 
                        display: 'inline-block', 
                        padding: '6px 14px', 
                        borderRadius: '8px', 
                        fontSize: '13px', 
                        fontWeight: 700,
                        backgroundColor: row.direction === 'Vào' ? '#dcfce7' : row.direction === 'Ra' ? '#fee2e2' : '#f1f5f9',
                        color: row.direction === 'Vào' ? '#16a34a' : row.direction === 'Ra' ? '#dc2626' : '#64748b',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        Xe đang trong bãi
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditClick(row)}
                          title="Sửa"
                          style={{
                            padding: '6px 8px',
                            backgroundColor: 'transparent',
                            color: '#64748b',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.color = '#0f172a';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(row)}
                          title="Xóa"
                          style={{
                            padding: '6px 8px',
                            backgroundColor: 'transparent',
                            color: '#64748b',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{
              margin: '0 0 12px',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a',
              textAlign: 'left'
            }}>
              {modalMode === 'create' ? 'Tạo thẻ RFID thủ công' : 'Sửa thẻ RFID có ID: ' + editingCard.cardUid}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: '600',
                color: '#334155',
                marginBottom: '8px',
                textAlign: 'left'
              }}>
                ID Thẻ RFID
              </label>
              <input
                type="text"
                value={formData.cardUid}
                onChange={(e) => setFormData({ ...formData, cardUid: e.target.value })}
                placeholder="Nhập ID thẻ..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: '600',
                color: '#334155',
                marginBottom: '8px',
                textAlign: 'left'
              }}>
                Biển số xe (Plate Number)
              </label>
              <input
                type="text"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                placeholder="Nhập biển số xe..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                Hủy
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={submitting}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#059669')}
                onMouseOut={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#10b981')}
              >
                {submitting ? 'Đang xử lý...' : (modalMode === 'create' ? 'Tạo thẻ' : 'Cập nhật')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
