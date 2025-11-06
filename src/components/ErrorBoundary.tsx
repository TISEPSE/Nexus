import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary Component
 *
 * Catches React errors anywhere in the component tree and displays
 * a fallback UI instead of crashing the entire application.
 *
 * Features:
 * - User-friendly error message
 * - Reload button to recover
 * - Error details in development mode
 * - Automatic error logging
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send to error tracking service (Sentry, LogRocket, etc.)
    // trackError(error, errorInfo);
  }

  handleReload = (): void => {
    // Reset error state and reload the page
    window.location.reload();
  };

  handleReset = (): void => {
    // Reset error state without reloading
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gh-canvas-default flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-gh-canvas-subtle border-2 border-gh-danger-emphasis rounded-lg p-8 shadow-2xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gh-danger-emphasis/10 rounded-full">
                  <svg
                    className="w-16 h-16 text-gh-danger-emphasis"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-gh-fg-default text-center mb-4">
                Oops! Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-gh-fg-muted text-center mb-8 text-lg">
                The application encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-8 bg-gh-canvas-default border border-gh-border-default rounded-lg p-4 overflow-auto max-h-64">
                  <h2 className="text-sm font-semibold text-gh-fg-default mb-2">
                    Error Details:
                  </h2>
                  <pre className="text-xs text-gh-danger-emphasis font-mono whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <h3 className="text-sm font-semibold text-gh-fg-default mt-4 mb-2">
                        Component Stack:
                      </h3>
                      <pre className="text-xs text-gh-fg-muted font-mono whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReload}
                  className="
                    px-6 py-3 rounded-lg
                    bg-gh-accent-emphasis text-white
                    font-semibold text-base
                    hover:bg-gh-accent-emphasis/90
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default
                  "
                >
                  Reload Application
                </button>
                <button
                  onClick={this.handleReset}
                  className="
                    px-6 py-3 rounded-lg
                    bg-gh-canvas-default text-gh-fg-default
                    border border-gh-border-default
                    font-semibold text-base
                    hover:bg-gh-canvas-inset hover:border-gh-accent-fg
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-gh-accent-fg focus:ring-offset-2 focus:ring-offset-gh-canvas-default
                  "
                >
                  Try Again
                </button>
              </div>

              {/* Help Text */}
              <p className="text-center text-sm text-gh-fg-muted mt-8">
                If this problem persists, please{' '}
                <a
                  href="https://github.com/TISEPSE/Nexus/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gh-accent-fg hover:underline"
                >
                  report an issue
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
