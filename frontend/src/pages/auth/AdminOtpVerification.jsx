import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { apiCall } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const AdminOtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();

  const adminEmail = location.state?.email || 'admin@edumanage.com';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter complete 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await apiCall('/auth/verify-otp', 'POST', { email: adminEmail, otp: otpCode });
      if (res.success && res.token && res.user) {
        localStorage.setItem('edumanage_token', res.token);
        localStorage.setItem('edumanage_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        toast.success('OTP verified! Super Admin access granted.');
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'OTP verification failed');
      }
    } catch (err) {
      toast.error(err.message || 'Server error during OTP verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      const res = await apiCall('/auth/resend-otp', 'POST', { email: adminEmail });
      if (res.success) {
        toast.success('New OTP security code sent to your email!');
        setResendCooldown(30);
      } else {
        toast.error(res.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toast.error(err.message || 'Server error during resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </Button>

        <Card className="p-8 border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <Badge variant="purple" className="text-[10px]">2FA ENTERPRISE SECURITY</Badge>
            <h1 className="text-2xl font-black text-white">Super Admin 2FA OTP</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              A 6-digit verification code was sent to <span className="text-indigo-300 font-semibold">{adminEmail}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center font-black text-lg bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              ))}
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
              {loading ? 'Verifying OTP...' : 'Verify & Continue to Dashboard'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs space-y-2">
            <p className="text-slate-400">Didn't receive the OTP code?</p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || resendLoading}
              className={`font-bold inline-flex items-center gap-1.5 transition-colors ${
                resendCooldown > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP Code'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
