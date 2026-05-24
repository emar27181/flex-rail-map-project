import React from 'react';
import { translateUI } from '../utils/translation';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  language?: 'japanese' | 'english';
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const lang = this.props.language ?? 'japanese';
      return (
        <div style={{
          padding: '20px',
          border: '1px solid #f44336',
          borderRadius: '8px',
          backgroundColor: '#ffebee',
          margin: '20px'
        }}>
          <h3 style={{ color: '#f44336', margin: '0 0 10px 0' }}>{translateUI('mapErrorTitle', lang)}</h3>
          <p style={{ margin: '0 0 10px 0' }}>{translateUI('mapErrorMessage', lang)}</p>
          {this.state.error && (
            <details style={{ fontSize: '12px', color: '#666' }}>
              <summary>{translateUI('errorDetails', lang)}</summary>
              <pre>{this.state.error.toString()}</pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {translateUI('reloadButton', lang)}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;