import React, { useState, useEffect } from 'react';
import '../styles/ResidentForm.css';

export default function ResidentForm({ resident, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    room: '',
    phone: '',
    licensePlate: '',
    email: '',
  });

  useEffect(() => {
    if (resident) {
      setFormData({
        name: resident.name || '',
        room: resident.room || '',
        phone: resident.phone || '',
        licensePlate: resident.licensePlate || '',
        email: resident.email || '',
      });
    } else {
      setFormData({
        name: '',
        room: '',
        phone: '',
        licensePlate: '',
        email: '',
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
    if (formData.name && formData.room && formData.phone) {
      onSave(formData);
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
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
          {resident?.userId && (
            <div className="form-group form-readonly">
              <label>ID người dùng</label>
              <input type="text" value={resident.userId} readOnly disabled className="input-readonly" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Họ và tên *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="room">Phòng *</label>
            <input
              type="text"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="VD: 101"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Điện thoại *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="VD: 0912345678"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="licensePlate">Biển số xe</label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              placeholder="VD: 51H-123.45"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
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
