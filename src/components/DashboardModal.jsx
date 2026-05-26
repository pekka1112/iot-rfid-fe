import React from 'react';
import '../styles/DashboardModal.css';
import DashboardPanels from './DashboardPanels';

export default function DashboardModal({ 
  isOpen, 
  onClose, 
  logs, 
  cards, 
  cameras, 
  totalResidents, 
  totalGuests, 
  totalIn, 
  totalOut,
  isOnHomePage = false 
}) {
  if (!isOpen && !isOnHomePage) {
    return null;
  }

  if (isOnHomePage) {
    // On home page, render as inline container (not modal)
    return (
      <div className="dashboard-panels-inline">
        <DashboardPanels 
          logs={logs} 
          cards={cards} 
          cameras={cameras}
          totalResidents={totalResidents}
          totalGuests={totalGuests}
          totalIn={totalIn}
          totalOut={totalOut}
        />
      </div>
    );
  }

  // On other pages, render as modal popup
  return (
    <>
      {/* Backdrop */}
      <div className="dashboard-modal-backdrop" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="dashboard-modal-container">
        <div className="dashboard-modal-header">
          <h2>Thông Tin Hệ Thống</h2>
          <button 
            className="dashboard-modal-close" 
            onClick={onClose}
            aria-label="Đóng modal"
          >
            ✕
          </button>
        </div>
        
        <div className="dashboard-modal-content">
          <DashboardPanels 
            logs={logs} 
            cards={cards} 
            cameras={cameras}
            totalResidents={totalResidents}
            totalGuests={totalGuests}
            totalIn={totalIn}
            totalOut={totalOut}
          />
        </div>
      </div>
    </>
  );
}
