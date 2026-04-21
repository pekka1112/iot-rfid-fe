import React from 'react';
import '../styles/WarningBox.css';

export default function WarningBox({ message }) {
  return (
    <div className="warning-box">
      <span className="warning-icon">⚠️</span>
      <p className="warning-text">{message}</p>
    </div>
  );
}
