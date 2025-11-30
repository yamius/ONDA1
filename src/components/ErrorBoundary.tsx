import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ONDA Error]:', error, errorInfo);
    this.setState({ errorInfo });
    
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };
    
    try {
      const logs = JSON.parse(localStorage.getItem('onda_error_logs') || '[]');
      logs.push(errorLog);
      if (logs.length > 10) logs.shift();
      localStorage.setItem('onda_error_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  }

  private copyLogs = () => {
    const logs = localStorage.getItem('onda_error_logs') || '[]';
    const fullReport = `
ONDA Error Report
=================
Time: ${new Date().toISOString()}
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}

Component Stack:
${this.state.errorInfo?.componentStack}

Previous Logs:
${logs}
    `.trim();
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullReport);
      alert('Error report copied to clipboard!');
    } else {
      console.log(fullReport);
      alert('Check console for error report');
    }
  };

  private reload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#111827',
          color: '#fff',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#ef4444' }}>
              Something went wrong
            </h1>
            
            <div style={{
              backgroundColor: '#1f2937',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <p style={{ color: '#fbbf24', marginBottom: '8px' }}>
                <strong>Error:</strong>
              </p>
              <code style={{ 
                display: 'block', 
                whiteSpace: 'pre-wrap', 
                fontSize: '12px',
                color: '#f87171',
                wordBreak: 'break-word',
              }}>
                {this.state.error?.message}
              </code>
            </div>

            {this.state.error?.stack && (
              <details style={{ marginBottom: '16px' }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  color: '#9ca3af',
                  marginBottom: '8px',
                }}>
                  Stack trace
                </summary>
                <pre style={{
                  backgroundColor: '#1f2937',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  overflow: 'auto',
                  maxHeight: '200px',
                  color: '#9ca3af',
                }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={this.reload}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Reload App
              </button>
              
              <button
                onClick={this.copyLogs}
                style={{
                  backgroundColor: '#4b5563',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Copy Error Report
              </button>
            </div>

            <p style={{ 
              marginTop: '24px', 
              color: '#6b7280', 
              fontSize: '12px',
            }}>
              Please send the error report to developers for debugging.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
