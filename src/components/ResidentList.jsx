import React from 'react';
import '../styles/ResidentList.css';

function nameInitial(name) {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1][0].toUpperCase();
}

export default function ResidentList({ residents, selectedResident, onSelectResident, onViewDetailResident }) {
  return (
    <div className="resident-list-modern">
      <div className="resident-list-header-row">
        <h2 className="resident-list-heading">Danh sách cư dân</h2>
      </div>
      <div className="resident-table-wrap">
        <table className="residents-table-modern">
          <thead>
            <tr>
              <th className="th-id">ID người dùng</th>
              <th className="th-name">Cư dân</th>
              <th>Phòng</th>
              <th>Điện thoại</th>
              <th>Biển số xe</th>
              <th className="th-action" />
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
                  <td className="td-user-id">
                    <span className="user-id-pill">{resident.userId}</span>
                  </td>
                  <td className="td-resident">
                    <span className="resident-avatar-sm" aria-hidden>
                      {nameInitial(resident.name)}
                    </span>
                    <span className="resident-name-block">
                      <span className="resident-name-text">{resident.name}</span>
                      <span className="resident-name-sub">Cư dân</span>
                    </span>
                  </td>
                  <td>{resident.room}</td>
                  <td className="td-phone">{resident.phone}</td>
                  <td>
                    <span className="plate-pill">{resident.licensePlate || '—'}</span>
                  </td>
                  <td className="td-action">
                    <button
                      type="button"
                      className="btn-view-profile"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectResident(resident);
                        onViewDetailResident?.(resident);
                      }}
                    >
                      <span className="btn-view-profile-icon" aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="no-data-modern">
                  Không có cư dân phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
