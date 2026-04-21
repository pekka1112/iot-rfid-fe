import React, { useState } from 'react';
import HistoryLog from './HistoryLog';
import '../styles/HistoryPage.css';

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('date');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const [historyData] = useState([
    { id: 1, name: 'Nguyễn Văn A', room: '101', action: 'Vào', time: '08:30', date: '2026-03-30', door: 'Cửa chính' },
    { id: 2, name: 'Trần Thị B', room: '102', action: 'Ra', time: '08:45', date: '2026-03-30', door: 'Cửa phụ' },
    { id: 3, name: 'Phạm Văn C', room: '201', action: 'Vào', time: '09:10', date: '2026-03-30', door: 'Cửa chính' },
    { id: 4, name: 'Lê Thị D', room: '202', action: 'Ra', time: '09:30', date: '2026-03-30', door: 'Cửa chính' },
    { id: 5, name: 'Nguyễn Văn A', room: '101', action: 'Ra', time: '17:45', date: '2026-03-30', door: 'Cửa chính' },
    { id: 6, name: 'Trần Thị B', room: '102', action: 'Vào', time: '18:00', date: '2026-03-30', door: 'Cửa phụ' },
    { id: 7, name: 'Phạm Văn C', room: '201', action: 'Ra', time: '18:15', date: '2026-03-30', door: 'Cửa chính' },
    { id: 8, name: 'Visitor Guest', room: 'Khách', action: 'Vào', time: '19:00', date: '2026-03-30', door: 'Cửa chính' },
  ]);

  const filteredData = () => {
    if (activeTab === 'date') {
      return historyData.filter((item) => item.date === selectedDate);
    }
    return historyData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.room.includes(searchTerm)
    );
  };

  const rows = filteredData();

  const handleExport = () => {
    alert('Xuất dữ liệu được triển khai');
  };

  return (
    <div className="history-page">
      <div className="history-toolbar-card">
        <div className="history-toolbar-top">
          <div className="history-title-block">
            <h1 className="history-page-title">Lịch sử ra vào</h1>
            <p className="history-page-subtitle">Nhật ký qua cửa theo ngày hoặc tìm theo tên, phòng</p>
          </div>
        </div>

        <div className="history-segments" role="tablist" aria-label="Chế độ xem lịch sử">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'date'}
            className={`history-segment ${activeTab === 'date' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('date')}
          >
            Lọc theo ngày
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'search'}
            className={`history-segment ${activeTab === 'search' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Tìm kiếm
          </button>
        </div>

        <div className="history-toolbar-bottom">
          {activeTab === 'date' && (
            <>
              <div className="history-date-field">
                <label htmlFor="history-date">Ngày</label>
                <input
                  type="date"
                  id="history-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="history-date-input"
                />
              </div>
              <span className="history-result-pill">
                <strong>{rows.length}</strong> bản ghi
              </span>
            </>
          )}

          {activeTab === 'search' && (
            <>
              <div className="history-search-box">
                <span className="history-search-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Tìm theo tên hoặc phòng…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="history-search-input"
                />
              </div>
              <span className="history-result-pill">
                <strong>{rows.length}</strong> kết quả
              </span>
            </>
          )}

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

      <div className="history-table-card">
        <HistoryLog data={rows} />
      </div>
    </div>
  );
}
