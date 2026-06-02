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
        <h2 className="history-log-heading">Nhật ký chi tiết ra vào nhà xe trong ngày : {data[0]?.dateFormatted || data[0]?.date}</h2>
        <p className="history-log-meta">{data.length} sự kiện</p>
      </div>
      <div className="history-table-wrap">
        <table className="history-table-modern">
          <thead>
            <tr>
              <th>Cư dân</th>
              <th>Biển số xe</th>
              <th>Hành động</th>
              <th>Xác thực</th>
              <th>Giờ</th>
              <th>Ngày</th>
              <th>Camera</th>
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
                  <td>
                    <span className="history-door-pill" style={{ fontWeight: 600 }}>{item.vehiclePlate || '—'}</span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
                      {item.duplicateCount > 0 && (
                        <span
                          title="Các bản ghi trùng trong 60 giây đã được gộp"
                          style={{
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#e2e8f0',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Gộp +{item.duplicateCount}
                        </span>
                      )}
                    </span>
                  </td>
                  <td style={{ fontSize: '1.2rem', letterSpacing: '4px' }}>
                    {item.faceMatch ? <span title="Khớp khuôn mặt">🧑</span> : ''}
                    {item.plateMatch ? <span title="Khớp biển số">🚗</span> : ''}
                    {!item.faceMatch && !item.plateMatch ? <span title="Không xác thực">—</span> : ''}
                  </td>
                  <td className="history-td-mono">{item.time}</td>
                  <td className="history-td-mono">{item.dateFormatted || item.date}</td>
                  <td>
                    <span className="history-door-pill">{item.door}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="history-no-data">
                  Không có dữ liệu phù hợp - Hôm nay chưa có sự kiện ra vào nào hoặc dữ liệu chưa được cập nhật.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
