import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';

export const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mandatory Onboarding Check: New users (e.g. Google OAuth) MUST complete the onboarding form
  const isSuperAdmin = user?.role === 'super_admin' || user?.email?.toLowerCase().includes('admin') || user?.email === 'faiyaz25@navgurukul.org';
  if (user && !isSuperAdmin && !user.onboardingCompleted) {
    return <Navigate to="/register-onboarding" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    const isSuperAdmin = user?.role === 'super_admin' || user?.email?.toLowerCase().includes('admin') || user?.email === 'faiyaz25@navgurukul.org';
    if (user && !isSuperAdmin && !user.onboardingCompleted) {
      return <Navigate to="/register-onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
