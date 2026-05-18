import React from 'react';
import '../styles/ResidentList.css';

function nameInitial(name) {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1][0].toUpperCase();
}

export default function ResidentList({ residents, selectedResident, onSelectResident, onViewDetailResident, onEditResident, onDeleteResident }) {
  return (
    <div className="resident-list-modern">
      <div className="resident-list-header-row">
        <h2 className="resident-list-heading">Danh sách người dùng</h2>
      </div>
      <div className="resident-table-wrap">
        <table className="residents-table-modern">
          <thead>
            <tr>
              <th className="th-checkbox"><input type="checkbox" /></th>
              <th className="th-id">ID</th>
              <th className="th-name">Người dùng</th>
              <th>Điện thoại</th>
              <th>Biển số xe</th>
              <th>Trạng thái</th>
              <th className="th-action">Tùy chỉnh</th>
            </tr>
          </thead>
          <tbody>
            {residents.length > 0 ? (
              residents.map((resident) => (
                <tr
                  key={resident.id}
                  className={`resident-row-modern ${selectedResident?.id === resident.id ? 'is-selected' : ''}`}
                  onClick={() => onSelectResident(resident)}
                >
                  <td className="td-checkbox">
                    <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="td-user-id">
                    <span className="user-id-pill">{resident.id}</span>
                  </td>
                  <td className="td-resident">
                    <span className="resident-avatar-sm" aria-hidden>
                      {nameInitial(resident.name)}
                    </span>
                    <span className="resident-name-block">
                      <span className="resident-name-text">{resident.name}</span>
                      <span className="resident-name-sub">Người dùng</span>
                    </span>
                  </td>
                  <td className="td-phone">{resident.phone}</td>
                  <td>
                    <span className="plate-pill">{resident.licensePlate || '—'}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${resident.status === 'active' ? 'active' : 'inactive'}`}>
                      {resident.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="td-action">
                    <button
                      type="button"
                      className="action-icon-btn view"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectResident(resident);
                        if (typeof onViewDetailResident === 'function') onViewDetailResident(resident);
                      }}
                      title="Chi tiết"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof onEditResident === 'function') onEditResident(resident);
                      }}
                      title="Sửa"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof onDeleteResident === 'function') onDeleteResident(resident.id);
                      }}
                      title="Xóa"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="no-data-modern">
                  Không có người dùng phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
