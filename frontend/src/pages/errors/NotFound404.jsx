import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFound404 = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 ring-1 ring-indigo-500/30 animate-bounce">
        <AlertCircle className="w-10 h-10" />
      </div>

      <span className="text-sm font-extrabold uppercase tracking-widest text-indigo-400">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-6xl font-black text-white mt-2 tracking-tight">
        Page Not Found
      </h1>

      <p className="text-sm sm:text-base text-slate-400 max-w-md mt-3 mb-8">
        The classroom or page you are looking for has been moved, renamed, or does not exist on EduManage Pro.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/">
          <Button variant="outline" size="md">
            <ArrowLeft className="w-4 h-4 mr-1" /> Landing Page
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-1" /> Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
