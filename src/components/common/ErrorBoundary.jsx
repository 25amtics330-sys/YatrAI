import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-danger/10 flex items-center justify-center">
              <AlertTriangle size={40} className="text-danger" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold text-text">
                Oops! Something went wrong
              </h2>
              <p className="text-muted text-sm">
                We hit a bump in the road. Don't worry, your travel plans are safe!
              </p>
            </div>
            {this.state.error && (
              <div className="bg-surface rounded-card p-4 text-left">
                <p className="text-xs text-danger font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-bg rounded-button font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2.5 bg-surface text-text rounded-button font-medium text-sm border border-border hover:bg-surface-2 transition-colors"
              >
                <Home size={16} />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
