import React, { useState } from 'react';
import '../styles/SearchPage.css';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // Sample data - có thể thay bằng API call
  const allData = [
    { id: 1, type: 'resident', name: 'Nguyễn Văn A', room: '101', description: 'Cư dân phòng 101' },
    { id: 2, type: 'resident', name: 'Trần Thị B', room: '102', description: 'Cư dân phòng 102' },
    { id: 3, type: 'resident', name: 'Phạm Văn C', room: '201', description: 'Cư dân phòng 201' },
    { id: 4, type: 'history', name: 'Vào tòa nhà', description: 'Nguyễn Văn A vào tòa nhà lúc 08:30' },
    { id: 5, type: 'history', name: 'Ra tòa nhà', description: 'Trần Thị B ra tòa nhà lúc 17:45' },
    { id: 6, type: 'room', name: 'Phòng 101', description: 'Tòa A - Lầu 1' },
    { id: 7, type: 'room', name: 'Phòng 102', description: 'Tòa A - Lầu 1' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);

    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = allData.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );

    setSearchResults(results);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'resident':
        return '👤';
      case 'history':
        return '📋';
      case 'room':
        return '🏠';
      default:
        return '📌';
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      resident: { text: 'Người dùng', color: '#27ae60' },
      history: { text: 'Lịch Sử', color: '#3498db' },
      room: { text: 'Phòng', color: '#e74c3c' },
    };
    return badges[type] || { text: 'Khác', color: '#999' };
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1>Tìm kiếm hệ thống</h1>
          <p>Cư dân, lịch sử, phòng và thông tin khác</p>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên cư dân, phòng, hoặc thông tin cần tìm..."
              className="search-input"
              autoFocus
            />
            <button type="submit" className="btn-search">
              Tìm
            </button>
          </div>
        </form>

        {searched && (
          <div className="search-stats">
            {searchTerm ? (
              <p>Tìm thấy <strong>{searchResults.length}</strong> kết quả cho "<strong>{searchTerm}</strong>"</p>
            ) : (
              <p className="no-search">Vui lòng nhập từ khóa để tìm kiếm</p>
            )}
          </div>
        )}
      </div>

      <div className="search-results-container">
        {searched && searchResults.length > 0 ? (
          <div className="search-results">
            {searchResults.map((result) => (
              <div key={result.id} className="result-card">
                <div className="result-header">
                  <span className="result-icon">{getTypeIcon(result.type)}</span>
                  <div className="result-title">
                    <h3 className="result-name">{result.name}</h3>
                    <span 
                      className="result-type-badge"
                      style={{ backgroundColor: getTypeBadge(result.type).color }}
                    >
                      {getTypeBadge(result.type).text}
                    </span>
                  </div>
                </div>
                <p className="result-description">{result.description}</p>
              </div>
            ))}
          </div>
        ) : searched && searchTerm.trim() ? (
          <div className="no-results">
            <p>❌ Không tìm thấy kết quả nào</p>
            <small>Thử tìm kiếm với từ khóa khác</small>
          </div>
        ) : (
          <div className="initial-state">
            <p>👈 Nhập từ khóa vào thanh tìm kiếm ở trên</p>
          </div>
        )}
      </div>
    </div>
  );
}
