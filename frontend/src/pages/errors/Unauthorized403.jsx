import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Unauthorized403 = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <span className="text-sm font-extrabold uppercase tracking-widest text-amber-400">
        Error 403 Access Denied
      </span>

      <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">
        Permission Unauthorized
      </h1>

      <p className="text-sm sm:text-base text-slate-400 max-w-md mt-3 mb-8">
        Your current role (<b>{user?.role?.replace('_', ' ') || 'Guest'}</b>) does not have sufficient RBAC privileges to access this portal route.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/dashboard">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
