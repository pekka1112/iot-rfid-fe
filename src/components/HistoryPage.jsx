import React, { useState, useEffect } from 'react';
import HistoryLog from './HistoryLog';
import '../styles/HistoryPage.css';

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const collapseWindowMs = 60 * 1000;
        const plateOf = (log) => (log?.vehiclePlate || log?.detectedPlate || '').trim();
        const platePresent = (log) => Boolean(plateOf(log));
        const isVerifiedStrict = (log) => {
          const okByAggregate = log?.isCorrectFaceAndPlate === true;
          const okByFlags = log?.faceMatch === true && log?.plateMatch === true;
          return platePresent(log) && (okByAggregate || okByFlags);
        };

        const response = await fetch('http://localhost:8080/api/access-logs');
        const data = await response.json();

        const sorted = [...(data || [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const candidates = sorted
          .filter(isVerifiedStrict)
          .map((log) => {
            const dateObj = new Date(log.createdAt);
            const filterDate = dateObj.toISOString().split('T')[0];
            const dateFormatted = dateObj.toLocaleDateString('vi-VN');
            const timeFormatted = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return {
              id: log.logId,
              createdAtMs: dateObj.getTime(),
              name: log.residentName || 'Khách',
              room: '—',
              action: log.direction === 'IN' ? 'Vào' : 'Ra',
              time: timeFormatted,
              date: filterDate,
              dateFormatted,
              door: log.cameraName || '—',
              vehiclePlate: plateOf(log) || undefined,
              faceMatch: log.faceMatch,
              plateMatch: log.plateMatch,
              duplicateCount: 0,
              collapsedIds: [],
            };
          });

        const byKey = new Map();
        const collapsed = [];
        for (const row of candidates) {
          const key = [
            row.action || '',
            row.vehiclePlate || '',
            row.name || '',
            row.door || '',
          ].join('|');

          const existingIdx = byKey.get(key);
          if (existingIdx === undefined) {
            byKey.set(key, collapsed.length);
            collapsed.push(row);
            continue;
          }

          const existing = collapsed[existingIdx];
          if (existing && (existing.createdAtMs - row.createdAtMs) <= collapseWindowMs) {
            existing.duplicateCount += 1;
            existing.collapsedIds.push(row.id);
          } else {
            byKey.set(key, collapsed.length);
            collapsed.push(row);
          }
        }

        setHistoryData(collapsed);
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử:', err);
      }
    };
    fetchLogs();
  }, []);

  const filteredData = () => {
    return historyData.filter((item) => {
      const matchDate = selectedDate ? item.date === selectedDate : true;
      const q = searchTerm.toLowerCase();
      const matchSearch = q ? (
        item.name.toLowerCase().includes(q) ||
        (item.room && item.room.toLowerCase().includes(q)) ||
        (item.vehiclePlate && item.vehiclePlate.toLowerCase().includes(q))
      ) : true;
      return matchDate && matchSearch;
    });
  };

  const rows = filteredData();

  const handleExport = () => {
    alert('Xuất dữ liệu được triển khai');
  };

  return (
    <div className="history-page">
      <div className="history-toolbar-card">
        <div className="history-toolbar-inner">
          <div className="history-title-block">
            <p className="history-page-subtitle">Nhật ký qua cửa theo ngày hoặc tìm theo tên</p>
          </div>

          <div className="history-actions-block">
            
            <div className="history-date-field" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input
                type="date"
                id="history-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="history-date-input"
              />
            </div>

            <div className="history-search-box" style={{ marginLeft: '0px' }}>
              <span className="history-search-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Tìm tên, biển số..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="history-search-input"
              />
            </div>

            <span className="history-result-pill">
              <strong>{rows.length}</strong> kết quả
            </span>

            <button type="button" className="btn-history-export" onClick={handleExport}>
              <span className="btn-history-export-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      <div className="history-table-card">
        <HistoryLog data={rows} />
      </div>
    </div>
  );
}
