import React, { useState, useEffect } from 'react';
import '../styles/ResidentForm.css';

export default function ResidentForm({ resident, onSave, onClose, onRefresh }) {

  const [formData, setFormData] = useState({
    residentId: '',
    fullName: '',
    phone: '',
    birthYear: '',
    status: 'active',
    licensePlate: '',
  });

  // Danh sách biển số xe (chỉ dùng khi edit)
  const [vehicles, setVehicles] = useState([]);
  // Index đang sửa (-1 = không sửa)
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editingValue, setEditingValue] = useState('');
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [residents, setResidents] = useState([]);
  useEffect(() => {
    if (resident) {
      setFormData({
        residentId: resident.id || '',
        fullName: resident.name || '',
        phone: resident.phone || '',
        birthYear: resident.birthYear || '',
        status: resident.status || 'active',
        licensePlate: '',
      });
      // Lấy danh sách biển số từ resident.vehicles
      const vList = (resident.vehicles || []).map(v => v.licensePlate).filter(Boolean);
      setVehicles(vList);
    } else {
      setFormData({
        residentId: '',
        fullName: '',
        phone: '',
        birthYear: '',
        status: 'active',
        licensePlate: '',
      });
      setVehicles([]);
    }
    setEditingIdx(-1);
    setEditingValue('');
  }, [resident]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.phone) {
      onSave(formData);
    } else {
      alert('Vui lòng điền đầy đủ họ tên và số điện thoại');
    }
  };

  // ====== XÓA BIỂN SỐ ======
  const handleDeletePlate = async (plate, idx) => {
    if (!confirm(`Bạn có chắc muốn xóa biển số "${plate}"?`)) return;
    setVehicleLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/vehicles/plate/${encodeURIComponent(plate)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Xóa thất bại');
      // Cập nhật ngay local state trong form
      setVehicles(prev => prev.filter((_, i) => i !== idx));
      if (editingIdx === idx) setEditingIdx(-1);
      // Refresh bảng chính ở parent
      onRefresh?.();
    } catch (err) {
      alert('Có lỗi khi xóa biển số. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setVehicleLoading(false);
    }
  };

  // ====== BẮT ĐẦU SỬA BIỂN SỐ ======
  const handleStartEdit = (plate, idx) => {
    setEditingIdx(idx);
    setEditingValue(plate);
  };

  // ====== HỦY SỬA ======
  const handleCancelEdit = () => {
    setEditingIdx(-1);
    setEditingValue('');
  };

  // ====== LƯU SỬA BIỂN SỐ ======
  const handleSavePlate = async (oldPlate, idx) => {
    const newPlate = editingValue.trim();
    if (!newPlate) {
      alert('Biển số không được để trống');
      return;
    }
    if (newPlate === oldPlate) {
      handleCancelEdit();
      return;
    }
    setVehicleLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/vehicles/plate/${encodeURIComponent(oldPlate)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber: newPlate }),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      // Cập nhật ngay local state trong form
      setVehicles(prev => prev.map((p, i) => (i === idx ? newPlate : p)));
      setEditingIdx(-1);
      setEditingValue('');
      // Refresh bảng chính ở parent
      onRefresh?.();
    } catch (err) {
      alert('Có lỗi khi cập nhật biển số. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setVehicleLoading(false);
    }
  };

  return (
    <div className="resident-form-overlay" onClick={onClose}>
      <div className="resident-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="resident-form-modal-head">
          <h2>{resident ? 'Chỉnh sửa cư dân' : 'Thêm cư dân mới : '}</h2>
          <button type="button" className="resident-form-close" onClick={onClose} aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="resident-form-body">
          <div className="form-grid-2col">
            <div className="form-group">
              <label htmlFor="residentId">ID* (Bắt buộc)</label>
              <input
                type="number"
                id="residentId"
                name="residentId"
                value={formData.residentId}
                onChange={handleChange}
                placeholder="Nhập ID (VD: 10)"
                required
                readOnly={!!resident}
                className={resident ? 'input-readonly' : ''}
                style={{border : '1px dashed red'}}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Họ và tên* (Bắt buộc)</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                style={{border : '1px dashed red'}}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="VD: 0901234567"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthYear">Năm sinh</label>
              <input
                type="number"
                id="birthYear"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                placeholder="VD: 2002"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Trạng thái</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select-modern"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm khóa</option>
              </select>
            </div>

            {/* Chỉ hiện input biển số khi THÊM MỚI */}
            {!resident && (
              <div className="form-group">
                <label htmlFor="licensePlate">Biển số xe (chỉ thêm 1 biển ban đầu)</label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="VD: 48F122345"
                />
              </div>
            )}
          </div>

          {/* ====== BẢNG BIỂN SỐ XE (chỉ hiện khi EDIT) ====== */}
          {resident && (
            <div className="vehicle-table-section">
              <div className="vehicle-table-header">
                <span className="vehicle-table-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h4l3 6v3h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  Danh sách biển số xe
                </span>
                <span className="vehicle-count-badge">{vehicles.length}</span>
              </div>

              {vehicles.length === 0 ? (
                <div className="vehicle-empty">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h4l3 6v3h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <span>Chưa có biển số xe nào</span>
                </div>
              ) : (
                <div className="vehicle-mini-table-wrap">
                  <table className="vehicle-mini-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Biển số xe</th>
                        <th style={{ width: 80, textAlign: 'center' }}>Lệnh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((plate, idx) => (
                        <tr key={idx} className={editingIdx === idx ? 'vehicle-row-editing' : ''}>
                          <td className="vehicle-row-num">{idx + 1}</td>
                          <td>
                            {editingIdx === idx ? (
                              <input
                                className="vehicle-edit-input"
                                type="text"
                                value={editingValue}
                                autoFocus
                                onChange={e => setEditingValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleSavePlate(plate, idx);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                disabled={vehicleLoading}
                              />
                            ) : (
                              <span className="vehicle-plate-badge">{plate}</span>
                            )}
                          </td>
                          <td>
                            {editingIdx === idx ? (
                              <div className="vehicle-action-btns">
                                {/* Nút lưu */}
                                <button
                                  type="button"
                                  className="vehicle-btn vehicle-btn-save"
                                  title="Lưu"
                                  onClick={() => handleSavePlate(plate, idx)}
                                  disabled={vehicleLoading}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                </button>
                                {/* Nút hủy */}
                                <button
                                  type="button"
                                  className="vehicle-btn vehicle-btn-cancel"
                                  title="Hủy"
                                  onClick={handleCancelEdit}
                                  disabled={vehicleLoading}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <div className="vehicle-action-btns">
                                {/* Nút sửa */}
                                <button
                                  type="button"
                                  className="vehicle-btn vehicle-btn-edit"
                                  title="Sửa biển số"
                                  onClick={() => handleStartEdit(plate, idx)}
                                  disabled={vehicleLoading || editingIdx !== -1}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                </button>
                                {/* Nút xóa */}
                                <button
                                  type="button"
                                  className="vehicle-btn vehicle-btn-delete"
                                  title="Xóa biển số"
                                  onClick={() => handleDeletePlate(plate, idx)}
                                  disabled={vehicleLoading || editingIdx !== -1}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6"/>
                                    <path d="M14 11v6"/>
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="resident-form-actions">
            <button type="button" className="btn-form-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-form-save">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
