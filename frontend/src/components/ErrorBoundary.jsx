import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    const isDev =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    const payload = {
      error: error.message,
      stack: isDev ? error.stack : undefined,
      componentStack: isDev ? errorInfo.componentStack : undefined,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      source: "react-error-boundary",
    };

    console.error("[ErrorBoundary]", error.message);
    if (isDev) {
      console.error(error.stack);
      console.error("Component stack:", errorInfo.componentStack);
    }

    fetch("/api/errors/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      const isDev =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
          <div className="glass-panel max-w-xl w-full rounded-2xl border border-white/10 p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <svg
                className="h-7 w-7 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h1 className="font-display text-xl font-semibold text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {isDev && this.state.error && (
              <div className="mt-4">
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-2">
                  <p className="text-sm font-medium text-red-300 mb-1">Error</p>
                  <p className="text-red-200 font-mono text-xs whitespace-pre-wrap">
                    {this.state.error.message}
                  </p>
                </div>
                {this.state.error.stack && (
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <p className="text-sm font-medium text-gray-300 mb-1">Stack Trace</p>
                    <pre className="text-gray-400 text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo && (
                  <div className="mt-2 rounded-lg bg-white/5 border border-white/10 p-3">
                    <p className="text-sm font-medium text-gray-300 mb-1">Component Stack</p>
                    <pre className="text-gray-400 text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-accent/20 border border-accent/30 px-5 py-2.5 text-sm font-medium text-accent hover:bg-accent/30 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
