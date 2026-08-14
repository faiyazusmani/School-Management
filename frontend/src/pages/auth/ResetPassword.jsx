import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GraduationCap, Lock, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { apiCall } from '../../services/api';
import { toast } from '../../components/ui/toast';

export const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await apiCall(`/auth/resetpassword/${token}`, 'PUT', { password });
    setLoading(false);

    if (res.success) {
      toast.success('Password updated successfully! Please log in.');
      navigate('/login');
    } else {
      toast.error(res.message || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6 text-slate-100">
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white">
            EduManage <span className="text-indigo-500">PRO</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full mx-auto my-12">
        <Card className="p-8 shadow-2xl border-slate-800">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Set New Password
            </h2>
            <p className="text-xs text-slate-400">
              Create a new secure password for your account
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Update Password & Sign In
            </Button>
          </form>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500">
        EduManage Pro Security System
      </div>
    </div>
  );
};
