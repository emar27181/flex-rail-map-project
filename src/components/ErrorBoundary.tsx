import React from 'react';
import { translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import { SEMANTIC, NEUTRAL } from '../constants/ui';
import Button from './ui/atoms/Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  language?: Language;
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
          border: `1px solid ${SEMANTIC.arrival}`,
          borderRadius: '8px',
          backgroundColor: '#ffebee',
          margin: '20px'
        }}>
          <h3 style={{ color: SEMANTIC.arrival, margin: '0 0 10px 0' }}>{translateUI('mapErrorTitle', lang)}</h3>
          <p style={{ margin: '0 0 10px 0' }}>{translateUI('mapErrorMessage', lang)}</p>
          {this.state.error && (
            <details style={{ fontSize: '12px', color: '#666' }}>
              <summary>{translateUI('errorDetails', lang)}</summary>
              <pre>{this.state.error.toString()}</pre>
            </details>
          )}
          <Button theme="light" variant="danger" size="md" onClick={() => window.location.reload()}>
            {translateUI('reloadButton', lang)}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;