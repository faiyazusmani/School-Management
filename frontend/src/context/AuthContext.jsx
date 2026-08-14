import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('edumanage_user');
      if (!savedUser || savedUser === 'undefined' || savedUser === 'null') return null;
      return JSON.parse(savedUser);
    } catch (e) {
      localStorage.removeItem('edumanage_user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('edumanage_token');
    return savedToken && savedToken !== 'undefined' ? savedToken : null;
  });

  const [loading, setLoading] = useState(false);

  // Automatically synchronize user state to localStorage
  useEffect(() => {
    if (user && user.name) {
      localStorage.setItem('edumanage_user', JSON.stringify(user));
      try {
        const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
        const existingIdx = profiles.findIndex((p) => p && p.email && user.email && p.email.toLowerCase() === user.email.toLowerCase());
        if (existingIdx !== -1) {
          profiles[existingIdx] = { ...profiles[existingIdx], ...user };
          localStorage.setItem('edumanage_registered_profiles', JSON.stringify(profiles));
        } else {
          localStorage.setItem('edumanage_registered_profiles', JSON.stringify([user, ...profiles]));
        }
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}
    } else {
      localStorage.removeItem('edumanage_user');
    }
  }, [user]);

  // Automatically synchronize token state to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('edumanage_token', token);
    } else {
      localStorage.removeItem('edumanage_token');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await apiCall('/auth/me', 'GET', null, token);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('edumanage_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Failed to verify token with server, maintaining cached user session');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rolePreset = null) => {
    setLoading(true);
    try {
      const res = await apiCall('/auth/login', 'POST', { email, password, rolePreset });
      if (res.requireOtp) {
        return { requireOtp: true, email: res.email || email };
      }
      if (res.success && res.user && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('edumanage_token', res.token);
        localStorage.setItem('edumanage_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await apiCall('/auth/register', 'POST', userData);
      if (res.success && res.user && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('edumanage_token', res.token);
        localStorage.setItem('edumanage_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Server error' };
    } finally {
      setLoading(false);
    }
  };

  const googleAuthLogin = async (googlePayload) => {
    setLoading(true);
    try {
      const res = await apiCall('/auth/google', 'POST', googlePayload);
      if (res.success && res.user && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('edumanage_token', res.token);
        localStorage.setItem('edumanage_user', JSON.stringify(res.user));
        return { success: true, isNewUser: res.isNewUser || false, user: res.user, token: res.token };
      }
      return { success: false, message: res.message || 'Google authentication failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Server error during Google auth' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('edumanage_token');
    localStorage.removeItem('edumanage_user');
  };

  // Helper for direct demo role switching in UI
  const switchDemoRole = (role) => {
    const roleNames = {
      super_admin: 'Alexander Wright (Super Admin)',
      teacher: 'Dr. Sarah Connor (Faculty)',
      student: 'Lucas Rivera (Student)',
      parent: 'Marcus Rivera (Parent)',
    };
    const roleAvatars = {
      super_admin: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      teacher: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      student: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      parent: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    };
    const mockUser = {
      id: `demo_${role}`,
      name: roleNames[role] || 'Demo User',
      email: `${role}@edumanage.com`,
      role,
      avatar: roleAvatars[role] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      status: 'active',
    };
    const mockToken = `demo_token_${role}_${Date.now()}`;
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('edumanage_user', JSON.stringify(mockUser));
    localStorage.setItem('edumanage_token', mockToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        login,
        register,
        googleAuthLogin,
        logout,
        switchDemoRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
