import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ShieldCheck, Save, Camera } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';

export const ProfileManagement = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Faiyaz Usmani',
    email: user?.email || 'faiyaz25@navgurukul.org',
    phone: user?.phone || '8114103889',
    schoolName: 'Shimla International Public School',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success('Account profile updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPass.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordData.newPass !== passwordData.confirmPass) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password security credentials updated');
    setPasswordData({ current: '', newPass: '', confirmPass: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Top Banner */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-xl"
            />
            <div className="absolute inset-0 rounded-full bg-slate-950/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{user?.name || 'Alexander Wright'}</h2>
              <Badge variant="purple">{user?.role?.replace('_', ' ').toUpperCase()}</Badge>
            </div>
            <p className="text-xs text-slate-400">{user?.email || 'admin@edumanage.com'}</p>
            <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Security Verified Account
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile & Security Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-bold text-white mb-4">Personal Details</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              icon={Phone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="School / Institution Name"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            />
            <Button type="submit" variant="primary" size="sm" className="w-full">
              <Save className="w-4 h-4 mr-1" /> Save Profile Details
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold text-white mb-4">Security Credentials</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              icon={Lock}
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
            />
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              value={passwordData.newPass}
              onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              value={passwordData.confirmPass}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPass: e.target.value })}
            />
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Update Security Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
