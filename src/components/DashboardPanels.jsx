import React, { useState, useEffect } from 'react';

// Dữ liệu giả lập để hiển thị
const MOCK_IN_PARKING = Array.from({ length: 25 }, (_, i) => ({
  id: `ND-${String(i + 1).padStart(3, '0')}`,
  licensePlate: `59X${(i % 9) + 1}-${10000 + i}`
}));

const MOCK_LOGS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  time: new Date(Date.now() - i * 60000).toLocaleTimeString('vi-VN'),
  action: i % 3 === 0 ? 'Xe vào' : i % 3 === 1 ? 'Xe ra' : 'Cảnh báo',
  detail: `ND-${String((i % 10) + 1).padStart(3, '0')} quét thẻ`
}));


function DataTable({ title, columns, data, itemsPerPage = 5 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ flex: '1 1 300px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: '#0f172a', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </div>
      <div style={{ flex: 1, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '8px 12px', color: '#475569', fontWeight: '600', whiteSpace: 'nowrap' }}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((row, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ padding: '8px 12px', color: '#334155', whiteSpace: 'nowrap' }}>
                    {col.accessor === 'action' ? (
                       <span style={{ 
                         padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                         backgroundColor: row[col.accessor] === 'Xe vào' ? '#dcfce7' : row[col.accessor] === 'Xe ra' ? '#fee2e2' : '#fef9c3',
                         color: row[col.accessor] === 'Xe vào' ? '#166534' : row[col.accessor] === 'Xe ra' ? '#991b1b' : '#854d0e'
                       }}>
                         {row[col.accessor]}
                       </span>
                    ) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} style={{ padding: '16px 12px', textAlign: 'center', color: '#94a3b8' }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fcfcfc', fontSize: '12px' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            style={{ padding: '4px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
          >
            Trước
          </button>
          <span style={{ color: '#64748b', fontWeight: '500' }}>Trang {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            style={{ padding: '4px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#fff', color: currentPage === totalPages ? '#94a3b8' : '#334155', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPanels() {
  const [logs, setLogs] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Logs
      try {
        const response = await fetch('http://localhost:8080/api/access-logs');
        if (response.ok) {
          const data = await response.json();
          const formattedLogs = data.map((log) => {
            const dateObj = new Date(log.createdAt);
            const timeFormatted = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateFormatted = dateObj.toLocaleDateString('vi-VN');
            
            return {
              id: log.logId,
              time: `${timeFormatted} ${dateFormatted}`,
              action: log.direction === 'IN' ? 'Xe vào' : 'Xe ra',
              detail: `${log.residentName || 'Khách'} - ${log.vehiclePlate || log.detectedPlate || 'Không rõ biển số'}`
            };
          });
          setLogs(formattedLogs);
        }
      } catch (err) {
        console.error('Lỗi khi lấy nhật ký hệ thống:', err);
      }

      // Fetch RFID Cards
      try {
        const response = await fetch('http://localhost:8080/api/rfid-cards');
        if (response.ok) {
          const data = await response.json();
          setCards(data);
        }
      } catch (err) {
        console.error('Lỗi khi lấy danh sách thẻ RFID:', err);
      }
    };

    fetchData();
    
    // Auto refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', width: '100%' }}>
      <DataTable 
        title="Đang trong bãi"
        columns={[
          { header: 'ID', accessor: 'id' },
          { header: 'Biển số', accessor: 'licensePlate' }
        ]}
        data={MOCK_IN_PARKING}
      />
      <DataTable 
        title="Nhật ký hệ thống"
        columns={[
          { header: 'Thời gian', accessor: 'time' },
          { header: 'Hành động', accessor: 'action' },
          { header: 'Chi tiết', accessor: 'detail' }
        ]}
        data={logs}
      />
      <DataTable 
        title="Danh sách thẻ RFID"
        columns={[
          { header: 'ID Thẻ', accessor: 'cardId' },
          { header: 'Biển số', accessor: 'licensePlate' }
        ]}
        data={cards}
      />
    </div>
  );
}
