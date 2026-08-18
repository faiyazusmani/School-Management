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
  MapPin,
  ArrowLeft,
  CreditCard,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  ShieldAlert,
  Camera,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { IDCardModal } from '../../components/enterprise/IDCardModal';
import { ReportCardModal } from '../../components/enterprise/ReportCardModal';
import { FeeReceiptModal } from '../../components/enterprise/FeeReceiptModal';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';
import { compressImage, safeSetItem } from '../../utils/imageCompressor';

export const StudentProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Modals
  const [showIdCard, setShowIdCard] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const studentCatalog = [
    {
      _id: 'st_ankit',
      id: 'st_ankit',
      name: 'Ankit Kumar',
      email: 'ankit@student.edu',
      rollNumber: '101',
      admissionNumber: 'ADM-2026-101',
      gradeLevel: 'Grade 12',
      section: 'A',
      dob: '2008-04-12',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+91 98765 43210',
      address: '742 Evergreen Terrace, Sector 4',
      status: 'active',
      parentName: 'Rajesh Kumar',
      parentPhone: '+91 98765 43210',
      parentEmail: 'parent.rajesh@gmail.com',
      emergencyContact: '+91 98765 43211',
      gpa: 3.88,
      attendanceRate: 98.8,
      presentDays: 144,
      absentDays: 2,
      lateDays: 1,
      leaveDays: 0,
      totalFees: 48500,
      paidFees: 48500,
      pendingFees: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    },
    {
      _id: 'st_aarav',
      id: 'st_aarav',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@student.edu',
      rollNumber: '102',
      admissionNumber: 'ADM-2026-102',
      gradeLevel: 'Grade 12',
      section: 'A',
      dob: '2008-01-15',
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98123 45678',
      address: '45 Park Avenue, Civil Lines',
      status: 'active',
      parentName: 'Vikram Sharma',
      parentPhone: '+91 98123 45678',
      parentEmail: 'vikram.sharma@gmail.com',
      emergencyContact: '+91 98123 45679',
      gpa: 3.92,
      attendanceRate: 98.2,
      presentDays: 142,
      absentDays: 3,
      lateDays: 1,
      leaveDays: 0,
      totalFees: 48500,
      paidFees: 48500,
      pendingFees: 0,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    },
    {
      _id: 'st_ananya',
      id: 'st_ananya',
      name: 'Ananya Verma',
      email: 'ananya.verma@student.edu',
      rollNumber: '103',
      admissionNumber: 'ADM-2026-103',
      gradeLevel: 'Grade 11',
      section: 'A',
      dob: '2009-06-20',
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+91 98987 65432',
      address: '12 Medical Enclave, West Wing',
      status: 'active',
      parentName: 'Sunil Verma',
      parentPhone: '+91 98987 65432',
      parentEmail: 'sunil.verma@gmail.com',
      emergencyContact: '+91 98987 65433',
      gpa: 3.85,
      attendanceRate: 97.5,
      presentDays: 140,
      absentDays: 4,
      lateDays: 1,
      leaveDays: 0,
      totalFees: 48500,
      paidFees: 48500,
      pendingFees: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    },
    {
      _id: 'st_rohan',
      id: 'st_rohan',
      name: 'Rohan Gupta',
      email: 'rohan.gupta@student.edu',
      rollNumber: '104',
      admissionNumber: 'ADM-2026-104',
      gradeLevel: 'Grade 11',
      section: 'B',
      dob: '2009-03-10',
      gender: 'Male',
      bloodGroup: 'AB+',
      phone: '+91 97111 22233',
      address: '88 Shopping Mall Road, Sector 9',
      status: 'active',
      parentName: 'Sanjay Gupta',
      parentPhone: '+91 97111 22233',
      parentEmail: 'sanjay.gupta@gmail.com',
      emergencyContact: '+91 97111 22234',
      gpa: 3.75,
      attendanceRate: 96.9,
      presentDays: 139,
      absentDays: 5,
      lateDays: 2,
      leaveDays: 0,
      totalFees: 48500,
      paidFees: 30000,
      pendingFees: 18500,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    },
    {
      _id: 'st_anas',
      id: 'st_anas',
      name: 'Anas Usmani',
      email: 'anas.usmani@student.edu',
      rollNumber: '105',
      admissionNumber: 'ADM-2026-105',
      gradeLevel: 'Grade 8',
      section: 'A',
      dob: '2012-09-05',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+91 81141 03889',
      address: 'Navgurukul Academy Campus, Shimla',
      status: 'active',
      parentName: 'Faiyaz Usmani',
      parentPhone: '+91 81141 03889',
      parentEmail: 'faiyaz25@navgurukul.org',
      emergencyContact: '+91 81141 03889',
      gpa: 3.95,
      attendanceRate: 96.2,
      presentDays: 140,
      absentDays: 3,
      lateDays: 1,
      leaveDays: 0,
      totalFees: 48500,
      paidFees: 48500,
      pendingFees: 0,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    },
  ];

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    setLoading(true);
    let data = null;

    // 1. Check direct localStorage key for specific student ID
    try {
      const stored = localStorage.getItem(`edumanage_student_${id}`);
      if (stored) {
        data = JSON.parse(stored);
      } else {
        const list = JSON.parse(localStorage.getItem('edumanage_students') || '[]');
        data = list.find((st) => (st._id || st.id) === id || (st.name && st.name.toLowerCase() === id.toLowerCase()));
      }
    } catch (e) {}

    // 2. Check catalog by ID or name
    if (!data) {
      const foundCatalog = studentCatalog.find(
        (st) => (st.id && st.id === id) || (st._id && st._id === id) || (st.name && st.name.toLowerCase().includes(id.toLowerCase()))
      );
      if (foundCatalog) {
        data = foundCatalog;
      }
    }

    // 3. Check MongoDB API if 24-character ObjectID
    if (!data && id && id.length === 24) {
      try {
        const res = await studentAPI.getById(id);
        if (res.success && res.data) {
          data = formatStudentData(res.data);
        }
      } catch (e) {}
    }

    // 4. Default fallback
    if (!data) {
      data = formatStudentData(studentCatalog[0]);
    }

    // Check for email-locked custom avatar
    if (data && data.email) {
      const customAv = localStorage.getItem(`edumanage_avatar_${data.email}`);
      if (customAv) data.avatar = customAv;
    }

    setStudent(data);
    if (data) {
      setEditForm(JSON.parse(JSON.stringify(data)));
      setPhotoPreview(data.avatar);
    }
    setLoading(false);
  };

  const formatStudentData = (data) => ({
    id: data._id || data.id,
    name: data.name || '',
    email: data.email || '',
    rollNumber: data.rollNumber || '',
    admissionNumber: data.admissionNumber || '',
    gradeLevel: data.gradeLevel || '',
    section: data.section || '',
    dob: data.dob || '',
    gender: data.gender || '',
    bloodGroup: data.bloodGroup || '',
    phone: data.phone || '',
    address: data.address || '',
    transportRoute: data.transportRoute || '',
    admissionDate: data.admissionDate || '',
    status: data.status || 'active',
    parentName: data.parentName || '',
    parentPhone: data.parentPhone || '',
    parentEmail: data.parentEmail || '',
    emergencyContact: data.emergencyContact || '',
    medicalNotes: data.medicalNotes || '',
    studentNotes: data.studentNotes || '',
    gpa: data.gpa || 0,
    attendanceRate: data.attendanceRate || 0,
    presentDays: data.presentDays || 0,
    absentDays: data.absentDays || 0,
    lateDays: data.lateDays || 0,
    leaveDays: data.leaveDays || 0,
    totalFees: data.totalFees || 0,
    paidFees: data.paidFees || 0,
    pendingFees: data.pendingFees || 0,
    avatar: data.avatar || '',
    attendanceLogs: data.attendanceLogs || [],
    examResults: data.examResults || [],
    homework: data.homework || [],
    libraryBooks: data.libraryBooks || [],
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 300, 300, 0.7);
      setPhotoPreview(compressedBase64);
      setEditForm((prev) => ({ ...prev, avatar: compressedBase64 }));
      toast.success('Photo compressed & ready! Click "Save All Changes" to confirm.');
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const totalLogs = editForm.attendanceLogs?.length || 1;
      const presentCount = editForm.attendanceLogs?.filter((l) => l.status === 'Present').length || 0;
      const lateCount = editForm.attendanceLogs?.filter((l) => l.status === 'Late').length || 0;
      const absentCount = editForm.attendanceLogs?.filter((l) => l.status === 'Absent').length || 0;
      const leaveCount = editForm.attendanceLogs?.filter((l) => l.status === 'Leave').length || 0;

      const newAttRate = Number((((presentCount + lateCount) / totalLogs) * 100).toFixed(1));

      const totalF = Number(editForm.totalFees) || 0;
      const paidF = Number(editForm.paidFees) || 0;
      const pendingF = Math.max(totalF - paidF, 0);

      const compressedAvatar = photoPreview ? await compressImage(photoPreview, 300, 300, 0.7) : photoPreview;

      const finalPayload = {
        ...editForm,
        avatar: compressedAvatar,
        attendanceRate: newAttRate,
        presentDays: presentCount,
        absentDays: absentCount,
        lateDays: lateCount,
        leaveDays: leaveCount,
        totalFees: totalF,
        paidFees: paidF,
        pendingFees: pendingF,
      };

      try {
        if (student.id && student.id.length === 24) {
          await studentAPI.update(student.id, finalPayload);
        }
      } catch (e) {}

      // Save safely to localStorage with zero quota error
      if (finalPayload.email) {
        safeSetItem(`edumanage_avatar_${finalPayload.email}`, compressedAvatar);
      }
      safeSetItem(`edumanage_student_${finalPayload.id}`, JSON.stringify(finalPayload));

      const savedList = JSON.parse(localStorage.getItem('edumanage_students') || '[]');
      const updatedList = savedList.map((st) =>
        (st._id || st.id) === finalPayload.id || (st.email && st.email === finalPayload.email)
          ? { ...st, ...finalPayload }
          : st
      );
      if (!savedList.some((st) => (st._id || st.id) === finalPayload.id)) {
        updatedList.unshift(finalPayload);
      }
      safeSetItem('edumanage_students', JSON.stringify(updatedList));

      // Also update in registered profiles
      try {
        const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
        const updatedProfiles = profiles.map((p) =>
          p && p.email && finalPayload.email && p.email.toLowerCase() === finalPayload.email.toLowerCase()
            ? { ...p, ...finalPayload }
            : p
        );
        safeSetItem('edumanage_registered_profiles', JSON.stringify(updatedProfiles));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}

      setStudent(finalPayload);
      setEditForm(finalPayload);
      setPhotoPreview(compressedAvatar);
      setIsEditing(false);
      toast.success(`Student profile and photo for ${finalPayload.name} saved permanently! 📸`);
    } catch (err) {
      toast.error(err.message || 'Failed to save student profile updates');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(student)));
    setPhotoPreview(student.avatar);
    setIsEditing(false);
    toast.info('Editing discarded');
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

  const fallbackStudentAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Student')}&background=6366f1&color=fff&size=300`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/students')}
          className="w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Student Roster
        </Button>

        {isSuperAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
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
              <>
                <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-1.5" /> Edit Student Profile
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowIdCard(true)}>
                  <CreditCard className="w-4 h-4 mr-1.5" /> Print ID Card
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowReportCard(true)}>
                  <FileText className="w-4 h-4 mr-1.5" /> Generate Report Card
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Student Header Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            {/* Student Photo Container */}
            <div className="relative group shrink-0">
              <img
                src={photoPreview || student?.avatar || fallbackStudentAvatar}
                alt={student?.name}
                onError={(e) => {
                  e.target.src = fallbackStudentAvatar;
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl bg-slate-950"
              />
              {isEditing && (
                <label className="absolute inset-0 rounded-2xl bg-slate-950/80 flex flex-col items-center justify-center text-white cursor-pointer border-2 border-indigo-400">
                  <Camera className="w-6 h-6 text-indigo-400 mb-0.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">Change Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white truncate">{student?.name}</h1>
                <Badge variant="purple">{student?.gradeLevel} – Sec {student?.section}</Badge>
                <Badge variant="outline" className="font-mono text-slate-300">Roll #{student?.rollNumber}</Badge>
                <span className="text-xs text-slate-400 font-mono">{student?.admissionNumber}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {student?.email}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-400" /> Parent: {student?.parentName}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {student?.parentPhone}</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Overall GPA</div>
            <div className="text-2xl font-extrabold text-emerald-400">{student?.gpa} / 4.0</div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {['overview', 'academics', 'attendance', 'finance'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Student Demographics</h3>
            {isEditing ? (
              <div className="space-y-3">
                <Input label="Full Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <Input label="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Roll No" value={editForm.rollNumber} onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })} />
                  <Input label="Grade" value={editForm.gradeLevel} onChange={(e) => setEditForm({ ...editForm, gradeLevel: e.target.value })} />
                </div>
                <Input
                  label="Photo Image URL / Upload Above"
                  value={photoPreview}
                  onChange={async (e) => {
                    const val = e.target.value;
                    const compressed = await compressImage(val, 300, 300, 0.7);
                    setPhotoPreview(compressed);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Date of Birth:</span> <span className="text-white font-mono">{student?.dob}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Gender:</span> <span className="text-white">{student?.gender}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Blood Group:</span> <span className="text-emerald-400 font-bold">{student?.bloodGroup}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Address:</span> <span className="text-white text-right">{student?.address}</span></div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Parent & Guardian Contact</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Parent Name:</span> <span className="text-white font-bold">{student?.parentName}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Contact Number:</span> <span className="text-indigo-400 font-mono">{student?.parentPhone}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-400">Emergency Phone:</span> <span className="text-rose-400 font-mono">{student?.emergencyContact}</span></div>
            </div>
          </Card>
        </div>
      )}

      {/* ID Card Modal */}
      {showIdCard && <IDCardModal student={student} isOpen={showIdCard} onClose={() => setShowIdCard(false)} />}
      {/* Report Card Modal */}
      {showReportCard && <ReportCardModal student={student} isOpen={showReportCard} onClose={() => setShowReportCard(false)} />}
    </div>
  );
};
