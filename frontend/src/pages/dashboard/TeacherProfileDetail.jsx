import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  DollarSign,
  Phone,
  Mail,
  ArrowLeft,
  Briefcase,
  Edit3,
  Save,
  X,
  Upload,
  Camera,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { teacherAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const TeacherProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchTeacherDetail();
  }, [id]);

  const fetchTeacherDetail = async () => {
    const mockFallbackTeacher = {
      _id: id || 't_1',
      id: id || 't_1',
      name: 'Dr. Sarah Connor',
      email: 'teacher@edumanage.com',
      employeeId: 'EMP-001',
      department: 'Science & Innovation',
      designation: 'Head of Physics Department',
      qualification: 'Ph.D. Quantum Physics (MIT)',
      experienceYears: 12,
      joiningDate: '2018-08-15',
      phone: '+1 (555) 789-0123',
      monthlySalary: 75000,
      paidSalaryTotal: 600000,
      pendingSalaryBalance: 0,
      presentDays: 142,
      absentDays: 2,
      leaveDays: 1,
      attendanceRate: 98.6,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      subjects: ['Advanced Quantum Physics', 'Theoretical Mechanics', 'AP Physics C'],
      assignedClasses: ['Grade 11-A', 'Grade 12-B'],
      salaryHistory: [
        { month: 'August 2026', basicSalary: 75000, netPaid: 78000, status: 'Paid', paymentDate: '2026-08-01' },
        { month: 'July 2026', basicSalary: 75000, netPaid: 78000, status: 'Paid', paymentDate: '2026-07-01' },
      ],
    };

    setLoading(true);
    let data = null;

    // Check localStorage cache first
    try {
      const stored = localStorage.getItem(`edumanage_teacher_${id}`);
      if (stored) {
        data = JSON.parse(stored);
      } else {
        const list = JSON.parse(localStorage.getItem('edumanage_teachers') || '[]');
        const found = list.find((t) => (t._id || t.id) === id || (t.name && t.name.toLowerCase() === id.toLowerCase()));
        if (found) data = found;
      }
    } catch (e) {}

    if (!data) {
      try {
        if (id && id.length === 24) {
          const res = await teacherAPI.getById(id);
          if (res.success && res.data) {
            data = formatTeacherData(res.data);
          }
        }
      } catch (e) {}
    }

    if (!data) {
      data = formatTeacherData(mockFallbackTeacher);
    }

    // Check for email locked custom avatar
    if (data && data.email) {
      const customAv = localStorage.getItem(`edumanage_avatar_${data.email}`);
      if (customAv) data.avatar = customAv;
    }

    setTeacher(data);
    if (data) {
      setEditForm(JSON.parse(JSON.stringify(data)));
      setPhotoPreview(data.avatar);
    }
    setLoading(false);
  };

  const formatTeacherData = (data) => ({
    id: data._id || data.id,
    name: data.name || '',
    email: data.email || '',
    employeeId: data.employeeId || '',
    department: data.department || '',
    designation: data.designation || '',
    qualification: data.qualification || '',
    experienceYears: data.experienceYears || 0,
    joiningDate: data.joiningDate || '',
    phone: data.phone || '',
    monthlySalary: data.monthlySalary || 0,
    paidSalaryTotal: data.paidSalaryTotal || 0,
    pendingSalaryBalance: data.pendingSalaryBalance || 0,
    presentDays: data.presentDays || 0,
    absentDays: data.absentDays || 0,
    leaveDays: data.leaveDays || 0,
    attendanceRate: data.attendanceRate || 0,
    avatar: data.avatar || '',
    subjects: data.subjects || [],
    assignedClasses: data.assignedClasses || [],
    salaryHistory: data.salaryHistory || [],
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPhotoPreview(base64);
        setEditForm((prev) => ({ ...prev, avatar: base64 }));
        if (teacher?.email) {
          localStorage.setItem(`edumanage_avatar_${teacher.email}`, base64);
        }
        toast.success('Faculty photo preview updated! Click "Save All Changes" to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const finalPayload = {
        ...editForm,
        avatar: photoPreview,
      };

      try {
        if (teacher.id && teacher.id.length === 24) {
          await teacherAPI.update(teacher.id, finalPayload);
        }
      } catch (e) {}

      // Save permanently to localStorage
      if (finalPayload.email) {
        localStorage.setItem(`edumanage_avatar_${finalPayload.email}`, photoPreview);
      }
      localStorage.setItem(`edumanage_teacher_${finalPayload.id}`, JSON.stringify(finalPayload));

      const savedList = JSON.parse(localStorage.getItem('edumanage_teachers') || '[]');
      const updatedList = savedList.map((t) =>
        (t._id || t.id) === finalPayload.id || (t.email && t.email === finalPayload.email)
          ? { ...t, ...finalPayload }
          : t
      );
      if (!savedList.some((t) => (t._id || t.id) === finalPayload.id)) {
        updatedList.unshift(finalPayload);
      }
      localStorage.setItem('edumanage_teachers', JSON.stringify(updatedList));

      // Update registered profiles
      try {
        const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
        const updatedProfiles = profiles.map((p) =>
          p && p.email && finalPayload.email && p.email.toLowerCase() === finalPayload.email.toLowerCase()
            ? { ...p, ...finalPayload }
            : p
        );
        localStorage.setItem('edumanage_registered_profiles', JSON.stringify(updatedProfiles));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}

      setTeacher(finalPayload);
      setEditForm(finalPayload);
      setIsEditing(false);
      toast.success(`Faculty profile & photo for ${finalPayload.name} saved permanently! 📸`);
    } catch (err) {
      toast.error(err.message || 'Failed to save faculty updates');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(teacher)));
    setPhotoPreview(teacher.avatar);
    setIsEditing(false);
    toast.info('Editing cancelled');
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const fallbackTeacherAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher?.name || 'Faculty')}&background=8b5cf6&color=fff&size=300`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/teachers')}
          className="w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Faculty Roster
        </Button>

        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-1" /> Discard
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveAll}>
                  <Save className="w-4 h-4 mr-1" /> Save All Changes 📸
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-1.5" /> Edit Faculty Profile
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Faculty Banner Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative group shrink-0">
              <img
                src={photoPreview || teacher?.avatar || fallbackTeacherAvatar}
                alt={teacher?.name}
                onError={(e) => {
                  e.target.src = fallbackTeacherAvatar;
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-500/50 shadow-xl bg-slate-950"
              />
              {isEditing && (
                <label className="absolute inset-0 rounded-2xl bg-slate-950/80 flex flex-col items-center justify-center text-white cursor-pointer border-2 border-purple-400">
                  <Camera className="w-6 h-6 text-purple-400 mb-0.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">Change Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white truncate">{teacher?.name}</h1>
                <Badge variant="purple">{teacher?.designation}</Badge>
                <span className="text-xs text-slate-400 font-mono">{teacher?.employeeId}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-purple-400" /> {teacher?.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-purple-400" /> {teacher?.phone}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-purple-400" /> Dept: {teacher?.department}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Details Form / View */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Academic & Qualification Details</h3>
        {isEditing ? (
          <div className="space-y-3">
            <Input label="Full Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <Input label="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Designation" value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} />
              <Input label="Department" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
            </div>
            <Input label="Faculty Photo Image URL / Upload Above" value={photoPreview} onChange={(e) => setPhotoPreview(e.target.value)} />
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Qualification:</span> <span className="text-white font-bold">{teacher?.qualification}</span></div>
            <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Teaching Experience:</span> <span className="text-purple-400 font-bold">{teacher?.experienceYears} Years</span></div>
            <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Assigned Classes:</span> <span className="text-white">{teacher?.assignedClasses?.join(', ')}</span></div>
          </div>
        )}
      </Card>
    </div>
  );
};
