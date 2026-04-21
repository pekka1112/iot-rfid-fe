import React from 'react';
import '../styles/HistoryLog.css';

function nameInitial(name) {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1][0].toUpperCase();
}

export default function HistoryLog({ data }) {
  return (
    <div className="history-log-modern">
      <div className="history-log-header">
        <h2 className="history-log-heading">Nhật ký chi tiết</h2>
        <p className="history-log-meta">{data.length} sự kiện</p>
      </div>
      <div className="history-table-wrap">
        <table className="history-table-modern">
          <thead>
            <tr>
              <th>Cư dân</th>
              <th>Phòng</th>
              <th>Hành động</th>
              <th>Giờ</th>
              <th>Ngày</th>
              <th>Cửa</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="history-td-name">
                    <span className="history-avatar-sm" aria-hidden>
                      {nameInitial(item.name)}
                    </span>
                    <span className="history-name-text">{item.name}</span>
                  </td>
                  <td>{item.room}</td>
                  <td>
                    <span
                      className={`history-action-pill ${
                        item.action === 'Vào'
                          ? 'history-action-in'
                          : item.action === 'Ra'
                            ? 'history-action-out'
                            : 'history-action-other'
                      }`}
                    >
                      {item.action}
                    </span>
                  </td>
                  <td className="history-td-mono">{item.time}</td>
                  <td className="history-td-mono">{item.date}</td>
                  <td>
                    <span className="history-door-pill">{item.door}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="history-no-data">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
