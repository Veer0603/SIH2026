import React from 'react';
import { useApp } from '../context/useApp';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '380px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let border = 'var(--border-dark)';
        let bg = 'var(--bg-panel)';
        let color = 'var(--text-main)';
        let icon = 'ℹ️';

        if (toast.type === 'alert') {
          border = 'var(--aqi-unhealthy-border)';
          bg = 'var(--aqi-unhealthy-bg)';
          color = 'var(--aqi-unhealthy-text)';
          icon = '🚨';
        } else if (toast.type === 'success') {
          border = 'var(--aqi-good-border)';
          bg = 'var(--aqi-good-bg)';
          color = 'var(--aqi-good-text)';
          icon = '✓';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: bg,
              color: color,
              border: `2px solid ${border}`,
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              animation: 'slideInRight 0.2s ease forwards'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{icon}</span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: 'var(--text-muted)',
                lineHeight: 1
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
