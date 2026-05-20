import React, { useState, useEffect, useRef } from 'react';

const TOTAL_SLOTS = 36;
function ParkingGrid({ logs, cards }) {
  const [tooltip, setTooltip] = useState(null);
  const tooltipRef = useRef(null);


  const getOccupiedPlates = () => {
    // Bước 1: replay log IN/OUT để tính xe đang trong bãi
    const fromLogs = new Set();
    if (logs && logs.length > 0) {
      [...logs].reverse().forEach(log => {
        const plate = log.vehiclePlate;
        if (!plate) return;
        if (log.action === 'Xe vào') fromLogs.add(plate);
        else if (log.action === 'Xe ra') fromLogs.delete(plate);
      });
    }

    // Bước 2: lấy biển số từ thẻ RFID, thêm vào nếu chưa có trong logs
    const fromCards = new Set();
    if (cards && cards.length > 0) {
      cards.forEach(c => {
        if (c.plateNumber && !fromLogs.has(c.plateNumber)) {
          fromCards.add(c.plateNumber);
        }
      });
    }

    // Kết hợp: xe từ log ưu tiên, xe từ thẻ RFID bổ sung thêm
    return [...fromLogs, ...fromCards];
  };

  const occupiedPlates = getOccupiedPlates();

  return (
    <div style={{
      flex: '0 0 auto',
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Đang trong bãi
        </span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#1D9E75' }}></span>
            Có xe
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}></span>
            Trống
          </span>
          <span style={{ fontWeight: '600', color: '#0f172a' }}>
            {occupiedPlates.length} / {TOTAL_SLOTS} chỗ
          </span>
        </div>
      </div>

      <div style={{ padding: '12px 16px', position: 'relative' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
            const plate = occupiedPlates[i] || null;
            return (
              <div
                key={i}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  border: plate ? 'none' : '1px solid #e2e8f0',
                  backgroundColor: plate ? '#1D9E75' : '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: plate ? '#04342C' : '#94a3b8',
                  cursor: plate ? 'pointer' : 'default',
                  position: 'relative',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!plate) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const parentRect = e.currentTarget.closest('.parking-grid-wrap').getBoundingClientRect();
                  setTooltip({
                    plate,
                    top: rect.top - parentRect.top - 36,
                    left: rect.left - parentRect.left + rect.width / 2,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {tooltip && (
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              top: tooltip.top,
              left: tooltip.left,
              transform: 'translateX(-50%)',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {tooltip.plate}
          </div>
        )}
      </div>
    </div>
  );
}

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
              <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
            style={{ padding: '4px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Trước
          </button>
          <span style={{ color: '#64748b', fontWeight: '500' }}>Trang {currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            style={{ padding: '4px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#fff', color: currentPage === totalPages ? '#94a3b8' : '#334155', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPanels({ logs = [], cards = [] }) {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', width: '100%' }}>
      <div className="parking-grid-wrap" style={{ position: 'relative' }}>
        <ParkingGrid logs={logs} cards={cards} />
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
            { header: 'ID Thẻ', accessor: 'cardUid' },
            { header: 'Biển số', accessor: 'plateNumber' }
          ]}
          data={cards}
        />
      </div>
    </div>
  );
}