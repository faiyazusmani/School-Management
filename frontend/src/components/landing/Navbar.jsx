import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { GraduationCap, Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../ui/toast';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, logout, googleAuthLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        let googleUser = {};
        try {
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          googleUser = await userInfoRes.json();
        } catch (err) {}

        const payload = {
          token: tokenResponse.access_token,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          sub: googleUser.sub,
        };

        const result = await googleAuthLogin(payload);
        if (result.success) {
          toast.success(`Welcome back, ${result.user?.name || 'User'}!`);
          if (result.isNewUser) {
            navigate('/register-onboarding');
          } else {
            navigate('/dashboard');
          }
        } else {
          toast.error(result.message || 'Google authentication failed');
        }
      } catch (error) {
        toast.error('Google Sign-In failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-In was cancelled or failed.');
      setGoogleLoading(false);
    },
  });

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Statistics', href: '#statistics' },
    { name: 'Teachers', href: '#teachers' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl dark:bg-slate-950/80 dark:border-slate-800 light:bg-white/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-purple-200 bg-clip-text text-transparent dark:from-white dark:to-indigo-200 light:from-slate-900 light:to-indigo-800">
              EduManage <span className="text-indigo-500 font-extrabold">PRO</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-400 -mt-1">
              School SaaS Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-indigo-400 dark:text-slate-300 dark:hover:text-indigo-400 light:text-slate-600 light:hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              {/* User Profile Badge Card with Integrated Logout */}
              <button
                onClick={() => {
                  logout();
                  toast.info('Logged out successfully');
                  navigate('/login', { replace: true });
                }}
                title="Click user profile to Logout"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 cursor-pointer group transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-500 group-hover:border-rose-500 transition-colors"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block max-w-[120px] truncate group-hover:text-rose-300 transition-colors">{user.name}</span>
                  <span className="text-[9px] uppercase font-semibold text-indigo-400 block -mt-0.5 group-hover:text-rose-400 transition-colors">{user.role?.replace('_', ' ')}</span>
                </div>
                <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 ml-1 transition-colors" />
              </button>

              <Link to="/dashboard">
                <Button size="sm" variant="primary" className="text-xs font-bold">
                  Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGoogleLogin()}
                disabled={googleLoading}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-indigo-400/30"
              >
                <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{googleLoading ? 'Connecting...' : 'Google Login'}</span>
              </button>
              <Link to="/login">
                <Button size="sm" variant="outline" className="text-xs font-bold">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-6 space-y-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-indigo-400 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    toast.info('Logged out successfully');
                    navigate('/login', { replace: true });
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-500 group-hover:border-rose-500 transition-colors"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block group-hover:text-rose-300 transition-colors">{user.name}</span>
                      <span className="text-[10px] uppercase font-semibold text-indigo-400 block group-hover:text-rose-400 transition-colors">{user.role?.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
                </button>

                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" variant="primary">
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleGoogleLogin(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  <User className="w-4 h-4" /> Google Login
                </button>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Sign In to Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
