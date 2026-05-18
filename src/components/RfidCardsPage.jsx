import React, { useState, useEffect } from 'react';
import '../styles/HistoryPage.css'; 

export default function RfidCardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rfidData, setRfidData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRfidCards = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rfid-cards');
        if (response.ok) {
          const data = await response.json();
          // Transform if needed
          setRfidData(data);
        } else {
          setRfidData([
            { id: 1, cardId: 'RFID-1001', licensePlate: '29A-12345', time: '08:30:15', direction: 'Vào' },
            { id: 2, cardId: 'RFID-1002', licensePlate: '30E-67890', time: '09:15:22', direction: 'Ra' },
            { id: 3, cardId: 'RFID-1003', licensePlate: '29C-11223', time: '10:05:40', direction: 'Vào' },
          ]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu thẻ RFID:', err);
        setRfidData([
          { id: 1, cardId: 'RFID-1001', licensePlate: '29A-12345', time: '08:30:15', direction: 'Vào' },
          { id: 2, cardId: 'RFID-1002', licensePlate: '30E-67890', time: '09:15:22', direction: 'Ra' },
          { id: 3, cardId: 'RFID-1003', licensePlate: '29C-11223', time: '10:05:40', direction: 'Vào' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRfidCards();
  }, []);

  const filteredData = rfidData.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      (item.cardId && item.cardId.toLowerCase().includes(q)) ||
      (item.licensePlate && item.licensePlate.toLowerCase().includes(q))
    );
  });

  return (
    <div className="history-page">
      <div className="history-toolbar-card">
        <div className="history-toolbar-inner">
          <div className="history-title-block">
            <h1 className="history-page-title">Quản lý thẻ RFID</h1>
            <p className="history-page-subtitle">
              Danh sách thẻ RFID quét qua hệ thống
            </p>
          </div>
          
          <div className="history-actions-block">
            <div className="search-box-modern" style={{ margin: 0 }}>
              <span className="search-icon" aria-hidden>
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
                className="search-input-modern"
              />
            </div>
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
                <th>Thời gian (Time)</th>
                <th>Chiều xe</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Đang tải dữ liệu...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state-cell" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Không có dữ liệu thẻ RFID
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={row.id || index}>
                    <td>
                      <span className="detail-mono" style={{ fontWeight: 600, color: '#334155' }}>{row.cardId}</span>
                    </td>
                    <td>
                      {row.licensePlate ? <span className="plate-badge" style={{ display: 'inline-block', padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 700, fontSize: '13px' }}>{row.licensePlate}</span> : '—'}
                    </td>
                    <td style={{ fontWeight: 500, color: '#475569' }}>{row.time || '—'}</td>
                    <td>
                      <span className={`status-badge ${row.direction === 'Vào' ? 'status-in' : row.direction === 'Ra' ? 'status-out' : ''}`} style={{ 
                        display: 'inline-block', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '12px', 
                        fontWeight: 600,
                        backgroundColor: row.direction === 'Vào' ? '#dcfce7' : row.direction === 'Ra' ? '#fee2e2' : '#f1f5f9',
                        color: row.direction === 'Vào' ? '#16a34a' : row.direction === 'Ra' ? '#dc2626' : '#64748b'
                      }}>
                        {row.direction || '—'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
