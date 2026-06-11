import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/FireAlertModal.css';

const FALLBACK_IMAGE = '/firefighter-alert.png';

export default function FireAlertModal({ isOpen, isAlert, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isAlert) onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, isAlert, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fire-alert-overlay ${isAlert ? 'fire-alert-overlay--danger' : 'fire-alert-overlay--safe'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fire-alert-title"
      onClick={isAlert ? undefined : onClose}
    >
      <div
        className={`fire-alert-modal ${isAlert ? 'fire-alert-modal--danger' : 'fire-alert-modal--safe'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isAlert && (
          <>
            <div className="fire-alert-flames" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </div>
            <div className="fire-alert-scanline" aria-hidden="true" />
          </>
        )}

        <button
          type="button"
          className="fire-alert-close"
          onClick={onClose}
          aria-label="Đóng cảnh báo"
        >
          ✕
        </button>

        <div className="fire-alert-badge-row">
          <span className={`fire-alert-badge ${isAlert ? 'danger' : 'safe'}`}>
            {isAlert ? 'Khẩn cấp' : 'An toàn'}
          </span>
          <span className="fire-alert-time">
            {new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>

        <h2 id="fire-alert-title" className={`fire-alert-title ${isAlert ? 'danger' : 'safe'}`}>
          {isAlert ? 'CẢNH BÁO CHÁY' : 'Hệ thống an toàn'}
        </h2>

        <div className="fire-alert-visual">
          {isAlert ? (
            <div className="fire-alert-gif-wrap">
              <img
                src="/firefighter-alert.gif"
                alt="Lực lượng cứu hỏa đang hỗ trợ"
                className="fire-alert-gif fire-alert-gif--animated"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallback) {
                    e.currentTarget.dataset.fallback = '1';
                    e.currentTarget.src = FALLBACK_IMAGE;
                    return;
                  }
                  e.currentTarget.onerror = null;
                }}
              />
              <div className="fire-alert-gif-caption">Lực lượng PCCC đã được thông báo</div>
            </div>
          ) : (
            <div className="fire-alert-safe-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              </svg>
            </div>
          )}
        </div>

        {isAlert ? (
          <>
            <p className="fire-alert-headline">
              Phát hiện tín hiệu khói / cháy tại khu vực giám sát!
            </p>

            <ul className="fire-alert-steps">
              <li>Báo ngay cho bảo vệ hoặc quản lý tòa nhà</li>
            </ul>

            {/* <div className="fire-alert-hotline">
              <span className="fire-alert-hotline-label">Gọi khẩn cấp</span>
              <a href="tel:114" className="fire-alert-hotline-number">114</a>
            </div> */}
          </>
        ) : (
          <>
            <p className="fire-alert-headline safe">Không phát hiện tín hiệu cháy</p>
            <p className="fire-alert-desc safe">
              Cảm biến khói đang hoạt động bình thường. Hệ thống sẽ tự động cảnh báo khi có nguy hiểm.
            </p>
          </>
        )}

        <div className="fire-alert-actions">
          {isAlert && (
            <a href="tel:114" className="fire-alert-btn fire-alert-btn--call">
              Gọi 114 ngay
            </a>
          )}
          <button
            type="button"
            className={`fire-alert-btn ${isAlert ? 'fire-alert-btn--ack' : 'fire-alert-btn--safe'}`}
            onClick={onClose}
          >
            {isAlert ? 'Tôi đã nắm thông tin' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
