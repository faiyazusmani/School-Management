import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { GraduationCap, Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleAuthLogin } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  const handleGoogleCredentialSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const res = await googleAuthLogin({
        idToken: credentialResponse.credential,
        credential: credentialResponse.credential,
        role: formData.role || 'student',
      });

      if (res.success) {
        toast.success(`Welcome, ${res.user.name}! Registered via Google.`);
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'Google registration failed');
      }
    } catch (err) {
      toast.error('Google registration error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const triggerGoogleLoginFallback = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        let googleUser = {};
        try {
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          googleUser = await userInfoRes.json();
        } catch (e) {}

        const googleEmail = (googleUser && googleUser.email) || `google_${Date.now()}@edumanage.com`;
        const googleName = (googleUser && googleUser.name) || 'Google User';
        const googleAvatar = (googleUser && googleUser.picture) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
        const googleId = (googleUser && googleUser.sub) || `g_${Date.now()}`;

        const result = await googleAuthLogin({
          googleId,
          email: googleEmail,
          name: googleName,
          avatar: googleAvatar,
          role: formData.role || 'student',
        });

        if (result.success) {
          toast.success(`Welcome, ${result.user.name}! Registered via Google.`);
          navigate('/dashboard');
        } else {
          toast.error(result.message || 'Google authentication failed');
        }
      } catch (err) {
        toast.error('Google registration fallback failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign In was canceled or encountered an error.');
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-slate-100 dark:text-white light:text-slate-900">
            EduManage <span className="text-indigo-500">PRO</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full mx-auto my-6 sm:my-10">
        <Card className="p-4 sm:p-8 shadow-2xl border-slate-800">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100 dark:text-white light:text-slate-900">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-400">
              Register as Super Admin, Teacher, Student, or Parent
            </p>
          </div>

          {/* Google OAuth Register Button */}
          <div className="mb-5 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleCredentialSuccess}
              onError={() => triggerGoogleLoginFallback()}
              theme="filled_blue"
              shape="pill"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 absolute">
              or register with email
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name *"
              icon={User}
              placeholder="e.g. Dr. Sarah Connor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email Address *"
              type="email"
              icon={Mail}
              placeholder="sarah@edumanage.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password *"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Mobile Phone"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Account Role Preset</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full text-xs rounded-xl px-3 py-2 bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="student">🎓 Student</option>
                <option value="teacher">👩‍🏫 Teacher</option>
                <option value="parent">👨‍👩‍👧 Parent</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Sign Up for Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
              Sign In Instead
            </Link>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500">
        EduManage Pro SaaS v2.5 — Role Based Access Control
      </div>
    </div>
  );
};
