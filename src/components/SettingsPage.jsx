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
  const [showAddForm, setShowAddForm] = useState(false);
  const [backupFormName, setBackupFormName] = useState('');
  const [backupFormAvatar, setBackupFormAvatar] = useState('');
  const [editingBackupId, setEditingBackupId] = useState(null);

  const [showRfidUsers, setShowRfidUsers] = useState(false);
  const [rfidUsersData, setRfidUsersData] = useState([]);

  const fetchBackupData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/rfid-users-backups');
      const data = await response.json();
      setBackupData(data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu backup:', err);
    }
  };

  const handleViewRfidUsers = async () => {
    try {
      setSendStatus('Đang tải danh sách user từ máy RFID...');
      const response = await fetch('http://localhost:8080/api/users/all');
      const data = await response.json();
      setRfidUsersData(data);
      setShowRfidUsers(true);
      setSendStatus('');
    } catch (err) {
      console.error(err);
      setSendStatus('Lỗi khi tải danh sách từ máy RFID.');
    }
  };

  const handleDeleteRfidUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này khỏi máy RFID?")) return;
    try {
      setSendStatus('Đang xóa user khỏi máy RFID...');
      await fetch(`http://localhost:8000/delete-user/${id}`, { method: 'DELETE' });
      
      // Refresh list
      const response = await fetch('http://localhost:8080/api/users/all');
      const data = await response.json();
      setRfidUsersData(data);
      setSendStatus('Đã xóa thành công.');
    } catch (error) {
      console.error('Lỗi xóa user trên máy RFID:', error);
      setSendStatus('Lỗi khi xóa user.');
      alert('Lỗi khi xóa.');
    }
  };

  const handleViewBackup = async () => {
    try {
      setSendStatus('Đang tải dữ liệu backup...');
      await fetchBackupData();
      setShowBackup(true);
      setSendStatus('');
    } catch (err) {
      console.error(err);
      setSendStatus('Lỗi khi tải dữ liệu backup.');
    }
  };

  const handleSaveBackup = async () => {
    if (!backupFormName) {
      alert("Vui lòng nhập họ và tên");
      return;
    }
    const payload = { name: backupFormName, imagePath: backupFormAvatar };
    try {
      const url = editingBackupId 
        ? `http://localhost:8080/api/rfid-users-backups/${editingBackupId}` 
        : 'http://localhost:8080/api/rfid-users-backups';
        
      await fetch(url, {
        method: editingBackupId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await fetchBackupData();
      
      // Reset form
      setShowAddForm(false);
      setBackupFormName('');
      setBackupFormAvatar('');
      setEditingBackupId(null);
    } catch (error) {
      console.error('Lỗi lưu backup:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu.');
    }
  };

  const handleDeleteBackup = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dữ liệu này?")) return;
    try {
      await fetch(`http://localhost:8080/api/rfid-users-backups/${id}`, { method: 'DELETE' });
      await fetchBackupData();
    } catch (error) {
      console.error('Lỗi xóa backup:', error);
      alert('Lỗi khi xóa.');
    }
  };

  const handleEditBackupClick = (user) => {
    setEditingBackupId(user.id);
    setBackupFormName(user.name || '');
    setBackupFormAvatar(user.imagePath || '');
    setShowAddForm(true);
  };

  const handlePushDataToRFID = async () => {
    setSendStatus('Đang kết nối và đẩy dữ liệu lên máy RFID...');
    try {
      // Thay đổi đường dẫn API bên dưới cho phù hợp với backend Spring Boot của bạn
      const response = await axios.post('http://localhost:8000/sync-users', { // Gọi thẳng Server Python để Sync Dữ liệu
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

            <div className="settings-row" style={{ borderBottom: 'none', paddingTop: '16px', marginTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <div className="settings-row-text">
                <span className="settings-row-label">Danh sách người dùng trên thiết bị FaceId</span>
              </div>
              <button 
                type="button" 
                title="Xem danh sách User trên máy RFID"
                onClick={handleViewRfidUsers} 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  width: '42px', height: '42px', 
                  backgroundColor: '#e0e7ff', color: '#4f46e5', 
                  border: 'none', borderRadius: '10px', 
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 4px rgba(79, 70, 229, 0.1)'
                }} 
                onMouseOver={(e) => { 
                  e.currentTarget.style.backgroundColor = '#4f46e5'; 
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(79, 70, 229, 0.2)';
                }} 
                onMouseOut={(e) => { 
                  e.currentTarget.style.backgroundColor = '#e0e7ff'; 
                  e.currentTarget.style.color = '#4f46e5';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.1)';
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section className="settings-panel-card settings-panel-sync">
          <div className="settings-panel-head">
            <h2 className="settings-panel-title">Đồng bộ dữ liệu</h2>
            <p className="settings-panel-desc">Đẩy dữ liệu từ website lên máy</p>
          </div>

          <div className="settings-panel-body">
            <button type="button" className="btn-settings-sync" onClick={handlePushDataToRFID}>
              <span className="btn-settings-sync-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </span>
              Đẩy dữ liệu về máy
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
        <div className="backup-overlay" onClick={() => setShowBackup(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000 }}>
          <div className="backup-modal" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* Header */}
            <div className="backup-modal-head" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginRight: '10px' }}>Danh sách UserBackup Server</h2>
                
                <button type="button" title="Load file backup từ máy tính" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Load file
                </button>

                <button type="button" title="Tải file backup về máy" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Tải về
                </button>

                <button type="button" onClick={() => {
                  if (!showAddForm) {
                    setEditingBackupId(null);
                    setBackupFormName('');
                    setBackupFormAvatar('');
                  }
                  setShowAddForm(!showAddForm);
                }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s', fontSize: '0.85rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Thêm mới
                </button>
              </div>
              <button className="backup-close-btn" onClick={() => setShowBackup(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>
                ✕
              </button>
            </div>

            {/* Form Thêm (Inline) */}
            {showAddForm && (
              <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Họ và tên</label>
                  <input type="text" value={backupFormName} onChange={(e) => setBackupFormName(e.target.value)} placeholder="Nhập tên..." style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Đường dẫn ảnh</label>
                  <input type="text" value={backupFormAvatar} onChange={(e) => setBackupFormAvatar(e.target.value)} placeholder="URL ảnh (VD: /assets/avatar.jpg)..." style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }} />
                </div>
                <button type="button" onClick={handleSaveBackup} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', height: '37px', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}>Lưu</button>
                <button type="button" onClick={() => { setShowAddForm(false); setEditingBackupId(null); setBackupFormName(''); setBackupFormAvatar(''); }} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', height: '37px', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>Hủy</button>
              </div>
            )}

            {/* Body (DataTable) */}
            <div className="backup-modal-body" style={{ padding: '0', overflowY: 'auto', flex: 1 }}>
              <table className="backup-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>ID</th>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Họ và tên</th>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Hình ảnh (Đường dẫn)</th>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {backupData.map((user) => {
                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 24px', fontWeight: '500', color: '#334155' }}>{user.id}</td>
                        <td style={{ padding: '12px 24px', color: '#0f172a', fontWeight: '500' }}>{user.name}</td>
                        <td style={{ padding: '12px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={user.imagePath || "https://github.com/shadcn.png"} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.imagePath}>
                              {user.imagePath || '/assets/default-avatar.png'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button title="Sửa" onClick={() => handleEditBackupClick(user)} style={{ padding: '6px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                            </button>
                            <button title="Xóa" onClick={() => handleDeleteBackup(user.id)} style={{ padding: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {backupData.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showRfidUsers && (
        <div className="backup-overlay" onClick={() => setShowRfidUsers(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000 }}>
          <div className="backup-modal" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* Header */}
            <div className="backup-modal-head" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#0f172a' }}>Danh sách User trên máy RFID</h2>
              </div>
              <button className="backup-close-btn" onClick={() => setShowRfidUsers(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>
                ✕
              </button>
            </div>

            {/* Body (DataTable) */}
            <div className="backup-modal-body" style={{ padding: '0', overflowY: 'auto', flex: 1 }}>
              <table className="backup-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>ID</th>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Họ và tên</th>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Hình ảnh (Đường dẫn)</th>
                    <th style={{ padding: '12px 24px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {rfidUsersData.map((user) => {
                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 24px', fontWeight: '500', color: '#334155' }}>{user.id}</td>
                        <td style={{ padding: '12px 24px', color: '#0f172a', fontWeight: '500' }}>{user.name}</td>
                        <td style={{ padding: '12px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={user.base64 ? `data:image/jpeg;base64,${user.base64}` : "https://github.com/shadcn.png"} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {user.base64 ? '<base64 image data>' : '/assets/default-avatar.png'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button title="Xóa" onClick={() => handleDeleteRfidUser(user.id)} style={{ padding: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {rfidUsersData.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Không có dữ liệu</td>
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
