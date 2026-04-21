import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    setFormData({
      username: user.username || '',
      email: user.email || '',
      avatar: user.avatar || '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewAvatar(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAvatarChange = () => {
    if (previewAvatar) {
      updateProfile({
        username: user?.username,
        email: user?.email,
        avatar: previewAvatar,
      });
      setFormData((prev) => ({ ...prev, avatar: previewAvatar }));
      setShowAvatarModal(false);
      setPreviewAvatar('');
      setMessage('Cập nhật ảnh đại diện thành công');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCancelAvatarChange = () => {
    setShowAvatarModal(false);
    setPreviewAvatar('');
  };

  const handleSave = () => {
    if (!formData.username || formData.username.length < 3) {
      setMessage('Tên phải ít nhất 3 ký tự');
      return;
    }

    updateProfile({
      username: formData.username,
      email: formData.email,
      avatar: formData.avatar,
    });

    setEditMode(false);
    setMessage('Đã lưu thay đổi hồ sơ');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-toolbar-card">
        <div className="profile-toolbar-inner">
          <div>
            <h1 className="profile-page-title">Hồ sơ cá nhân</h1>
            <p className="profile-page-subtitle">Thông tin tài khoản và ảnh đại diện</p>
          </div>
          <button type="button" className="profile-btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="profile-layout-card">
        <aside className="profile-aside">
          <div className="profile-avatar-wrap">
            <img
              src={formData.avatar}
              alt=""
              className="profile-avatar-lg"
            />
            {editMode && (
              <label className="profile-avatar-fab">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="profile-file-input"
                />
                <span className="profile-fab-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </span>
              </label>
            )}
          </div>
          <p className="profile-avatar-label">Ảnh đại diện</p>
          <button type="button" className="profile-btn-change-photo" onClick={() => setShowAvatarModal(true)}>
            Đổi ảnh đại diện
          </button>
          {user?.role && (
            <span className="profile-role-badge">{user.role}</span>
          )}
        </aside>

        <div className="profile-main">
          {message && (
            <div className={`profile-toast ${message.includes('thành công') || message.includes('Đã lưu') ? 'is-success' : 'is-error'}`}>
              {message}
            </div>
          )}

          {editMode ? (
            <div className="profile-edit">
              <h2 className="profile-section-title">Chỉnh sửa thông tin</h2>
              <div className="profile-field">
                <label htmlFor="pf-username">Tên đăng nhập</label>
                <input
                  type="text"
                  id="pf-username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-field">
                <label htmlFor="pf-email">Email</label>
                <input
                  type="email"
                  id="pf-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                />
              </div>
              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="profile-btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      username: user?.username || '',
                      email: user?.email || '',
                      avatar: user?.avatar || '',
                    });
                    setMessage('');
                  }}
                >
                  Hủy
                </button>
                <button type="button" className="profile-btn-primary" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-view">
              <h2 className="profile-section-title">Thông tin tài khoản</h2>
              <dl className="profile-dl">
                <div className="profile-dl-row">
                  <dt>Tên đăng nhập</dt>
                  <dd>{formData.username}</dd>
                </div>
                <div className="profile-dl-row">
                  <dt>Email</dt>
                  <dd>{formData.email || '—'}</dd>
                </div>
                <div className="profile-dl-row">
                  <dt>Ngày tạo tài khoản</dt>
                  <dd>{user?.createdAt || '—'}</dd>
                </div>
              </dl>
              <button type="button" className="profile-btn-primary profile-btn-full" onClick={() => setEditMode(true)}>
                Chỉnh sửa hồ sơ
              </button>
            </div>
          )}
        </div>
      </div>

      {showAvatarModal && (
        <div className="profile-modal-overlay" onClick={handleCancelAvatarChange}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-head">
              <h2>Đổi ảnh đại diện</h2>
              <button type="button" className="profile-modal-close" onClick={handleCancelAvatarChange} aria-label="Đóng">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="profile-modal-body">
              <div className="profile-preview-box">
                {previewAvatar ? (
                  <>
                    <img src={previewAvatar} alt="" className="profile-preview-img" />
                    <p className="profile-preview-caption">Ảnh xem trước</p>
                  </>
                ) : (
                  <div className="profile-upload-placeholder">
                    <span className="profile-upload-icon" aria-hidden>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </span>
                    <p>Chọn ảnh để xem trước</p>
                  </div>
                )}
              </div>
              <label className="profile-file-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQuickAvatarChange}
                  className="profile-file-input"
                />
                <span className="profile-file-btn">Chọn ảnh từ máy</span>
              </label>
            </div>
            <div className="profile-modal-foot">
              <button type="button" className="profile-btn-secondary" onClick={handleCancelAvatarChange}>
                Hủy
              </button>
              <button
                type="button"
                className="profile-btn-primary"
                onClick={handleConfirmAvatarChange}
                disabled={!previewAvatar}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
