import React, { Component } from 'react';
import { ServerCrash, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught Exception in React Tree:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <ServerCrash className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Application Exception</h2>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
            Something went wrong rendering this component. The error has been logged automatically.
          </p>
          <Button variant="primary" size="sm" onClick={this.handleReload}>
            <RefreshCw className="w-4 h-4 mr-1" /> Reload Component
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
