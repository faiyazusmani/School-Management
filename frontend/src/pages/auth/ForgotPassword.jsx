import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { apiCall } from '../../services/api';
import { toast } from '../../components/ui/toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    const res = await apiCall('/auth/forgotpassword', 'POST', { email });
    setLoading(false);

    if (res.success) {
      setSent(true);
      toast.success('Password reset instructions sent to your email.');
    } else {
      toast.error(res.message || 'Failed to send reset link');
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
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Forgot Password
            </h2>
            <p className="text-xs text-slate-400">
              Enter your registered email address and we'll send a password recovery link.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                Reset instructions sent to <b>{email}</b>. Please check your inbox or spam folder.
              </div>
              <Link to="/reset-password/demo-reset-token">
                <Button variant="outline" className="w-full text-xs">
                  Proceed to Demo Reset Page →
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                icon={Mail}
                placeholder="user@edumanage.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                Send Recovery Instructions
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            <Link to="/login" className="font-semibold text-indigo-400 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500">
        EduManage Pro Account Recovery System
      </div>
    </div>
  );
};
