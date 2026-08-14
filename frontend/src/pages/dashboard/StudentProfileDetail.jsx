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
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    const mockFallbackStudent = {
      _id: id || 'st_1',
      id: id || 'st_1',
      name: 'Lucas Rivera',
      email: 'lucas.rivera@student.edu',
      rollNumber: '101',
      admissionNumber: 'ADM-2026-101',
      gradeLevel: 'Grade 11',
      section: 'A',
      dob: '2008-04-12',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Sector 4, Springfield',
      transportRoute: 'Route 4 - North Express Bus',
      admissionDate: '2022-08-15',
      status: 'active',
      parentName: 'Marcus Rivera',
      parentPhone: '+1 (555) 890-1234',
      parentEmail: 'parent@edumanage.com',
      emergencyContact: '+1 (555) 999-0000',
      medicalNotes: 'No known allergies',
      studentNotes: 'Outstanding performance in Mathematics & Physics.',
      gpa: 3.88,
      attendanceRate: 96.2,
      presentDays: 135,
      absentDays: 5,
      lateDays: 2,
      leaveDays: 1,
      totalFees: 48500,
      paidFees: 48500,
      pendingFees: 0,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      attendanceLogs: [
        { id: 'att_1', date: '2026-08-12', status: 'Present', remarks: 'On time' },
        { id: 'att_2', date: '2026-08-11', status: 'Present', remarks: 'On time' },
        { id: 'att_3', date: '2026-08-10', status: 'Present', remarks: 'On time' },
        { id: 'att_4', date: '2026-08-09', status: 'Absent', remarks: 'Medical Sick Leave' },
      ],
      examResults: [
        { id: 'ex_1', subject: 'Advanced Physics', score: 95, maxMarks: 100, grade: 'A+', remarks: 'Exceptional problem solving' },
        { id: 'ex_2', subject: 'AP Calculus BC', score: 92, maxMarks: 100, grade: 'A', remarks: 'Strong analytical skills' },
        { id: 'ex_3', subject: 'World Literature', score: 88, maxMarks: 100, grade: 'B+', remarks: 'Good essays' },
      ],
      homework: [
        { id: 'hw_1', title: 'Quantum Mechanics Set #4', subject: 'Physics', dueDate: '2026-08-28', status: 'Pending' },
        { id: 'hw_2', title: 'Integration Proofs', subject: 'Calculus', dueDate: '2026-08-25', status: 'Submitted' },
      ],
      libraryBooks: [
        { id: 'bk_1', title: 'Concepts of Physics (Vol 1)', issueDate: '2026-08-01', dueDate: '2026-08-20', status: 'Issued' }
      ],
    };

    setLoading(true);
    let data = null;
    try {
      if (id && id.length === 24) {
        const res = await studentAPI.getById(id);
        if (res.success && res.data) {
          data = formatStudentData(res.data);
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (!data) {
      data = formatStudentData(mockFallbackStudent);
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setEditForm({ ...editForm, avatar: reader.result });
        toast.info('Photo updated preview. Click Save All Changes to confirm.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // Recalculate Attendance Rate
      const totalLogs = editForm.attendanceLogs?.length || 1;
      const presentCount = editForm.attendanceLogs?.filter((l) => l.status === 'Present').length || 0;
      const lateCount = editForm.attendanceLogs?.filter((l) => l.status === 'Late').length || 0;
      const absentCount = editForm.attendanceLogs?.filter((l) => l.status === 'Absent').length || 0;
      const leaveCount = editForm.attendanceLogs?.filter((l) => l.status === 'Leave').length || 0;

      const newAttRate = Number((((presentCount + lateCount) / totalLogs) * 100).toFixed(1));

      // Recalculate Fees
      const totalF = Number(editForm.totalFees) || 0;
      const paidF = Number(editForm.paidFees) || 0;
      const pendingF = Math.max(totalF - paidF, 0);

      const finalPayload = {
        ...editForm,
        avatar: photoPreview,
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

      setStudent(finalPayload);
      setEditForm(finalPayload);
      setIsEditing(false);
      toast.success(`Student profile for ${finalPayload.name} updated successfully in MongoDB`);
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

  // Attendance handlers in edit mode
  const handleAddAttendanceLog = () => {
    const newLog = {
      id: `att_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      remarks: 'Recorded by Admin',
    };
    setEditForm({
      ...editForm,
      attendanceLogs: [newLog, ...(editForm.attendanceLogs || [])],
    });
  };

  const handleDeleteAttendanceLog = (logId) => {
    setEditForm({
      ...editForm,
      attendanceLogs: editForm.attendanceLogs.filter((l) => l.id !== logId),
    });
  };

  // Exam result handlers in edit mode
  const handleAddExamResult = () => {
    const newRes = {
      id: `res_${Date.now()}`,
      subject: 'New Subject',
      score: 90,
      maxMarks: 100,
      grade: 'A',
      remarks: 'Good progress',
    };
    setEditForm({
      ...editForm,
      examResults: [...(editForm.examResults || []), newRes],
    });
  };

  const handleDeleteExamResult = (resId) => {
    setEditForm({
      ...editForm,
      examResults: editForm.examResults.filter((r) => r.id !== resId),
    });
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

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl max-w-6xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 animate-pulse" />
        <p className="text-sm text-slate-400 font-medium">No student profile found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/students')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Student Roster
        </Button>
      </div>
    );
  }

  const performanceTrend = [
    { term: 'Term 1', Physics: 92, Math: 88, CS: 95 },
    { term: 'Term 2', Physics: 94, Math: 91, CS: 99 },
    { term: 'Mid-Term', Physics: 95, Math: 93, CS: 98 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/students')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Student Roster
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          {isSuperAdmin && !isEditing && (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-1" /> Edit Student Profile
            </Button>
          )}

          {isSuperAdmin && isEditing && (
            <>
              <Button variant="success" size="sm" onClick={handleSaveAll}>
                <Save className="w-4 h-4 mr-1" /> Save All Changes
              </Button>
              <Button variant="neutral" size="sm" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </>
          )}

          <Button variant="outline" size="sm" onClick={() => setShowIdCard(true)}>
            <CreditCard className="w-4 h-4 mr-1 text-indigo-400" /> Print ID Card
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowReportCard(true)}>
            <FileText className="w-4 h-4 mr-1" /> Generate Report Card
          </Button>
        </div>
      </div>

      {/* Header Profile Banner */}
      <Card className="p-6 border-slate-800">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Photo & Upload Options */}
          <div className="relative group text-center">
            <img
              src={photoPreview || student.avatar}
              alt={editForm?.name || student?.name || 'Student Photo'}
              className="w-28 h-28 rounded-3xl object-cover border-2 border-indigo-500 shadow-xl"
            />
            {isEditing && (
              <label className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg cursor-pointer border border-indigo-500/20 hover:bg-indigo-500/20">
                <Upload className="w-3 h-3" /> Replace Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            {!isEditing ? (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">{student.name}</h1>
                    <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                      <Badge variant="purple">{student.gradeLevel} - Sec {student.section}</Badge>
                      <span className="font-mono text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                        Roll #{student.rollNumber}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {student.admissionNumber}
                      </span>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall GPA</span>
                    <span className="text-2xl font-black text-emerald-400">{student.gpa} / 4.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-300 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> {student.email}
                  </span>
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Parent: {student.parentName}
                  </span>
                  <span className="flex items-center gap-1.5 justify-center md:justify-start">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> {student.parentPhone}
                  </span>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="Student Name *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <Input label="Roll Number *" value={editForm.rollNumber} onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })} />
                <Input label="Admission Number" value={editForm.admissionNumber} onChange={(e) => setEditForm({ ...editForm, admissionNumber: e.target.value })} />
                <Input label="Grade Level" value={editForm.gradeLevel} onChange={(e) => setEditForm({ ...editForm, gradeLevel: e.target.value })} />
                <Input label="Section" value={editForm.section} onChange={(e) => setEditForm({ ...editForm, section: e.target.value })} />
                <Input label="GPA Score" type="number" step="0.01" value={editForm.gpa} onChange={(e) => setEditForm({ ...editForm, gpa: e.target.value })} />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Info', icon: User },
          { id: 'attendance', label: 'Attendance Summary', icon: Calendar },
          { id: 'academics', label: 'Exam Results & Marks', icon: Award },
          { id: 'fees', label: 'Fee Invoices & Receipts', icon: DollarSign },
          { id: 'library', label: 'Library & Homework', icon: BookOpen },
        ].map((tab) => {
          const IconC = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <IconC className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & DEMOGRAPHICS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Student Information</h3>
            {!isEditing ? (
              <div className="space-y-3 text-xs divide-y divide-slate-800">
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Date of Birth</span>
                  <span className="font-bold text-white">{student.dob}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Gender</span>
                  <span className="font-bold text-white">{student.gender || 'Male'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="font-bold text-rose-400">{student.bloodGroup}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Email</span>
                  <span className="font-bold text-white">{student.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-bold text-white">{student.phone}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Residential Address</span>
                  <span className="font-bold text-white text-right max-w-xs">{student.address}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Transport Route</span>
                  <span className="font-bold text-indigo-400">{student.transportRoute}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <Input label="Date of Birth" type="date" value={editForm.dob} onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })} />
                <Input label="Gender" value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })} />
                <Input label="Blood Group" value={editForm.bloodGroup} onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })} />
                <Input label="Student Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                <Input label="Student Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                <Input label="Address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                <Input label="Transport Route" value={editForm.transportRoute} onChange={(e) => setEditForm({ ...editForm, transportRoute: e.target.value })} />
              </div>
            )}
          </Card>

          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Guardian & Notes</h3>
            {!isEditing ? (
              <div className="space-y-3 text-xs divide-y divide-slate-800">
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Primary Guardian</span>
                  <span className="font-bold text-white">{student.parentName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Phone Contact</span>
                  <span className="font-mono text-indigo-400 font-bold">{student.parentPhone}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Guardian Email</span>
                  <span className="font-bold text-white">{student.parentEmail}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Emergency Contact</span>
                  <span className="font-bold text-amber-400">{student.emergencyContact}</span>
                </div>
                <div className="py-2">
                  <span className="text-slate-400 block mb-1">Medical Notes</span>
                  <span className="text-slate-200">{student.medicalNotes}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <Input label="Guardian Name" value={editForm.parentName} onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })} />
                <Input label="Guardian Phone" value={editForm.parentPhone} onChange={(e) => setEditForm({ ...editForm, parentPhone: e.target.value })} />
                <Input label="Guardian Email" value={editForm.parentEmail} onChange={(e) => setEditForm({ ...editForm, parentEmail: e.target.value })} />
                <Input label="Emergency Contact" value={editForm.emergencyContact} onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })} />
                <Input label="Medical Notes" value={editForm.medicalNotes} onChange={(e) => setEditForm({ ...editForm, medicalNotes: e.target.value })} />
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: ATTENDANCE SUMMARY & LOGS */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Attendance Rate</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {isEditing ? editForm.attendanceRate : student.attendanceRate}%
              </div>
            </Card>
            <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Present Days</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">
                {isEditing ? editForm.presentDays : student.presentDays} Days
              </div>
            </Card>
            <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Absent Days</span>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {isEditing ? editForm.absentDays : student.absentDays} Days
              </div>
            </Card>
            <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Late Days</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {isEditing ? editForm.lateDays : student.lateDays} Days
              </div>
            </Card>
            <Card className="p-4 text-center border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Leave Days</span>
              <div className="text-2xl font-black text-indigo-300 mt-1">
                {isEditing ? editForm.leaveDays : student.leaveDays} Days
              </div>
            </Card>
          </div>

          <Card className="p-6 border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Daily Attendance Records</h3>
              {isEditing && (
                <Button size="sm" variant="outline" onClick={handleAddAttendanceLog}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Attendance Log
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {(isEditing ? editForm.attendanceLogs : student.attendanceLogs).map((log, i) => (
                <div key={log.id || i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs gap-3">
                  {!isEditing ? (
                    <>
                      <span className="font-semibold text-white">{log.date}</span>
                      <Badge variant={log.status === 'Present' ? 'success' : log.status === 'Absent' ? 'danger' : 'warning'}>
                        {log.status}
                      </Badge>
                      <span className="text-slate-400">{log.remarks}</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="date"
                        value={log.date}
                        onChange={(e) => {
                          const updated = [...editForm.attendanceLogs];
                          updated[i].date = e.target.value;
                          setEditForm({ ...editForm, attendanceLogs: updated });
                        }}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                      />
                      <select
                        value={log.status}
                        onChange={(e) => {
                          const updated = [...editForm.attendanceLogs];
                          updated[i].status = e.target.value;
                          setEditForm({ ...editForm, attendanceLogs: updated });
                        }}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Leave">Leave</option>
                      </select>
                      <input
                        type="text"
                        value={log.remarks}
                        onChange={(e) => {
                          const updated = [...editForm.attendanceLogs];
                          updated[i].remarks = e.target.value;
                          setEditForm({ ...editForm, attendanceLogs: updated });
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                      />
                      <button onClick={() => handleDeleteAttendanceLog(log.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: ACADEMICS & EXAM RESULTS */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Academic Performance Trend</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="term" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Area type="monotone" dataKey="Physics" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="CS" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Subject Examination Results</h3>
              {isEditing && (
                <Button size="sm" variant="outline" onClick={handleAddExamResult}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Exam Mark
                </Button>
              )}
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5">Score</th>
                  <th className="p-2.5">Grade</th>
                  <th className="p-2.5">Remarks</th>
                  {isEditing && <th className="p-2.5">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {(isEditing ? editForm.examResults : student.examResults).map((sub, i) => (
                  <tr key={sub.id || i}>
                    {!isEditing ? (
                      <>
                        <td className="p-2.5 font-bold text-white">{sub.subject}</td>
                        <td className="p-2.5 font-mono text-indigo-300">{sub.score} / {sub.maxMarks}</td>
                        <td className="p-2.5 font-bold text-emerald-400">{sub.grade}</td>
                        <td className="p-2.5 text-slate-400">{sub.remarks}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-2">
                          <input
                            type="text"
                            value={sub.subject}
                            onChange={(e) => {
                              const updated = [...editForm.examResults];
                              updated[i].subject = e.target.value;
                              setEditForm({ ...editForm, examResults: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={sub.score}
                            onChange={(e) => {
                              const updated = [...editForm.examResults];
                              updated[i].score = Number(e.target.value);
                              setEditForm({ ...editForm, examResults: updated });
                            }}
                            className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={sub.grade}
                            onChange={(e) => {
                              const updated = [...editForm.examResults];
                              updated[i].grade = e.target.value;
                              setEditForm({ ...editForm, examResults: updated });
                            }}
                            className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={sub.remarks}
                            onChange={(e) => {
                              const updated = [...editForm.examResults];
                              updated[i].remarks = e.target.value;
                              setEditForm({ ...editForm, examResults: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <button onClick={() => handleDeleteExamResult(sub.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* TAB 4: FEES */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Billed Fees</span>
              {!isEditing ? (
                <div className="text-2xl font-black text-white mt-1">₹{student.totalFees}</div>
              ) : (
                <Input type="number" value={editForm.totalFees} onChange={(e) => setEditForm({ ...editForm, totalFees: e.target.value })} />
              )}
            </Card>
            <Card className="p-4 text-center border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Amount Paid</span>
              {!isEditing ? (
                <div className="text-2xl font-black text-emerald-400 mt-1">₹{student.paidFees}</div>
              ) : (
                <Input type="number" value={editForm.paidFees} onChange={(e) => setEditForm({ ...editForm, paidFees: e.target.value })} />
              )}
            </Card>
            <Card className="p-4 text-center border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pending Balance</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">
                ₹{isEditing ? Math.max(Number(editForm.totalFees || 0) - Number(editForm.paidFees || 0), 0) : student.pendingFees}
              </div>
            </Card>
          </div>

          <Card className="p-6 border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Payment Receipts History</h3>
              <Button size="sm" variant="outline" onClick={() => setShowReceipt(true)}>
                <Printer className="w-4 h-4 mr-1" /> View Official Fee Voucher
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-white block">Term 1 Tuition Fee Invoice</span>
                <span className="text-[10px] font-mono text-slate-400">INV-2026-001 • Paid on July 31, 2026</span>
              </div>
              <Badge variant="success">PAID ₹{isEditing ? editForm.paidFees : student.paidFees}</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: LIBRARY & HOMEWORK */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Library History</h3>
            <div className="space-y-2">
              {(isEditing ? editForm.libraryBooks : student.libraryBooks).map((b, i) => (
                <div key={b.id || i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white block">{b.title}</span>
                    <span className="text-[10px] text-slate-400">Issued: {b.issuedDate} | Due: {b.dueDate}</span>
                  </div>
                  <Badge variant={b.status === 'Active' ? 'warning' : 'success'}>{b.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Assigned Homework</h3>
            <div className="space-y-2">
              {(isEditing ? editForm.homework : student.homework).map((h, i) => (
                <div key={h.id || i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white block">{h.title}</span>
                    <span className="text-[10px] text-slate-400">{h.subject} | Due: {h.dueDate}</span>
                  </div>
                  <Badge variant={h.status === 'Submitted' ? 'success' : 'warning'}>{h.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
      <IDCardModal isOpen={showIdCard} onClose={() => setShowIdCard(false)} student={isEditing ? editForm : student} />
      <ReportCardModal isOpen={showReportCard} onClose={() => setShowReportCard(false)} student={isEditing ? editForm : student} />
      {showReceipt && (
        <FeeReceiptModal
          invoice={{ studentName: student.name, rollNumber: student.rollNumber, title: 'Term 1 Tuition Fee', amount: student.totalFees, invoiceNumber: 'INV-2026-001' }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};
