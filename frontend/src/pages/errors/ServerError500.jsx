import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash, RefreshCw, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ServerError500 = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
        <ServerCrash className="w-10 h-10" />
      </div>

      <span className="text-sm font-extrabold uppercase tracking-widest text-rose-400">
        Error 500
      </span>

      <h1 className="text-4xl sm:text-6xl font-black text-white mt-2 tracking-tight">
        Internal Server Exception
      </h1>

      <p className="text-sm sm:text-base text-slate-400 max-w-md mt-3 mb-8">
        An unexpected server error occurred while processing your request. Our technical team has been notified.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="outline" size="md" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh Page
        </Button>
        <Link to="/dashboard">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-1" /> Return to Safety
          </Button>
        </Link>
      </div>
    </div>
  );
};
