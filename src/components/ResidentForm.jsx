import React, { useState, useEffect } from 'react';
import '../styles/ResidentForm.css';

export default function ResidentForm({ resident, onSave, onClose }) {
  const [formData, setFormData] = useState({
    residentId: '',
    fullName: '',
    phone: '',
    birthYear: '',
    status: 'active',
  });

  useEffect(() => {
    if (resident) {
      setFormData({
        residentId: resident.id || '',
        fullName: resident.name || '',
        phone: resident.phone || '',
        birthYear: resident.birthYear || '',
        status: resident.status || 'active',
      });
    } else {
      setFormData({
        residentId: '',
        fullName: '',
        phone: '',
        birthYear: '',
        status: 'active',
      });
    }
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

  return (
    <div className="resident-form-overlay" onClick={onClose}>
      <div className="resident-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="resident-form-modal-head">
          <h2>{resident ? 'Chỉnh sửa cư dân' : 'Thêm cư dân mới'}</h2>
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
              <label htmlFor="residentId">ID người dùng *</label>
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Họ và tên *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại *</label>
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
          </div>

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
