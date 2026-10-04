import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AERIS Application Error Caught by Boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#131B23',
          color: '#E9F1F7',
          padding: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#1C2530',
            border: '1px solid rgba(231, 223, 198, 0.15)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 20px 30px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
                AERIS Delhi Telemetry Safeguard
              </h2>
            </div>

            <p style={{ color: '#E7DFC6', opacity: 0.85, fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              A client-side render discrepancy was caught and intercepted. Your local state has been preserved.
            </p>

            {this.state.error && (
              <div style={{
                backgroundColor: '#131B23',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#f87171',
                marginBottom: '20px',
                overflowX: 'auto',
                border: '1px solid rgba(239, 68, 68, 0.4)'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#2274A5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9px',
                  padding: '10px 18px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                🔄 Reload Application
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: 'transparent',
                  color: '#E7DFC6',
                  border: '1px solid rgba(129, 108, 97, 0.6)',
                  borderRadius: '9px',
                  padding: '10px 18px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
