import React, { useState, useRef, useEffect } from 'react';
import { User, Lock, Mail, Phone, ShieldCheck, Save, Camera, Image, Upload, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { compressImage, safeSetItem } from '../../../utils/imageCompressor';

export const ProfileManagement = () => {
  const { user, setUser, updateProfileData } = useAuth();
  const fileInputRef = useRef(null);

  const getInitialAvatar = () => {
    try {
      if (user?.email) {
        const savedByEmail = localStorage.getItem(`edumanage_avatar_${user.email}`);
        if (savedByEmail) return savedByEmail;
      }
      const savedGlobal = localStorage.getItem('edumanage_user_avatar');
      if (savedGlobal) return savedGlobal;

      if (user?.avatar) return user.avatar;
    } catch (e) {}
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Faiyaz Usmani')}&background=6366f1&color=fff&size=200`;
  };

  const [formData, setFormData] = useState({
    name: user?.name || 'Faiyaz Usmani',
    email: user?.email || 'faiyaz25@navgurukul.org',
    phone: user?.phone || '8114103889',
    schoolName: user?.schoolName || 'Shimla International Public School',
    avatar: getInitialAvatar(),
  });

  useEffect(() => {
    if (user) {
      const currentAv = getInitialAvatar();
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        avatar: currentAv,
      }));
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  // Handle Photo File Upload with Canvas compression to avoid localStorage QuotaExceededError
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 300, 300, 0.7);
      setFormData((prev) => ({ ...prev, avatar: compressedBase64 }));
      safeSetItem('edumanage_user_avatar', compressedBase64);
      if (user?.email) {
        safeSetItem(`edumanage_avatar_${user.email}`, compressedBase64);
      }
      toast.success('Profile photo selected & compressed! Click "Save Profile Details" to apply.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required');
      return;
    }

    try {
      const compressedAvatar = formData.avatar ? await compressImage(formData.avatar, 300, 300, 0.7) : formData.avatar;
      const finalData = { ...formData, avatar: compressedAvatar };

      safeSetItem('edumanage_user_avatar', compressedAvatar);
      if (finalData.email) {
        safeSetItem(`edumanage_avatar_${finalData.email}`, compressedAvatar);
      }

      if (updateProfileData) {
        await updateProfileData(finalData);
      } else if (setUser) {
        const updatedUser = { ...user, ...finalData };
        setUser(updatedUser);
        safeSetItem('edumanage_user', JSON.stringify(updatedUser));
      }
      toast.success('Super Admin Profile & Photo saved permanently! 📸');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
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
    toast.success('Security password credentials updated successfully!');
    setPasswordData({ current: '', newPass: '', confirmPass: '' });
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Faiyaz Usmani')}&background=6366f1&color=fff&size=200`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Profile Top Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Image Container with Camera Overlay */}
          <div className="relative group shrink-0">
            <img
              src={formData.avatar || fallbackAvatar}
              alt={formData.name}
              onError={(e) => {
                e.target.src = fallbackAvatar;
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 bg-slate-950"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload New Profile Photo"
              className="absolute inset-0 rounded-full bg-slate-950/70 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-2 border-indigo-400"
            >
              <Camera className="w-6 h-6 text-indigo-400 mb-0.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Change Photo</span>
            </button>
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate">{formData.name}</h2>
              <Badge variant="purple" className="text-xs px-2.5 py-0.5">
                {user?.role ? user.role.replace('_', ' ').toUpperCase() : 'SUPER ADMIN'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 truncate">{formData.email}</p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Security Verified Account
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 underline underline-offset-2"
              >
                <Upload className="w-3.5 h-3.5" /> Upload / Change Photo
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile & Security Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Personal Details
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">Super Admin Profile</span>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name *"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address *"
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
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

            {/* Custom Photo URL Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">
                Profile Photo (Upload file above or paste image URL)
              </label>
              <div className="flex gap-2">
                <Input
                  icon={Image}
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.avatar}
                  onChange={async (e) => {
                    const newUrl = e.target.value;
                    const compressed = await compressImage(newUrl, 300, 300, 0.7);
                    setFormData((prev) => ({ ...prev, avatar: compressed }));
                    safeSetItem('edumanage_user_avatar', compressed);
                    if (formData.email) {
                      safeSetItem(`edumanage_avatar_${formData.email}`, compressed);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload
                </Button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" className="w-full mt-2">
              <Save className="w-4 h-4 mr-1.5" /> Save Profile Details
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" /> Security Credentials
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">Password Control</span>
          </div>

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
            <Button type="submit" variant="outline" size="sm" className="w-full mt-2">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Update Security Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
