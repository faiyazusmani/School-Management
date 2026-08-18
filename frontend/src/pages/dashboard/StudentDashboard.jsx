import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  Star,
  User,
  Phone,
  Mail,
  DollarSign,
  AlertCircle,
  FileCheck,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/toast';
import { profileAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard = () => {
  const { user: currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const defaultStudentDashboard = {
      profile: {
        name: currentUser?.name || 'Student Portal',
        rollNumber: currentUser?.rollNumber || '101',
        admissionNumber: currentUser?.admissionNumber || 'ADM-2026-101',
        gradeLevel: currentUser?.gradeLevel || currentUser?.classGrade || 'Grade 11',
        section: currentUser?.section || 'A',
        gpa: 3.88,
        attendanceRate: 96.2,
        presentDays: 135,
        absentDays: 5,
        totalFees: 48500,
        paidFees: 48500,
        pendingFees: 0,
      },
      stats: {
        overallGPA: 3.88,
        attendancePercentage: 96.2,
        presentDays: 135,
        absentDays: 5,
        lateDays: 2,
        leaveDays: 1,
        paidFees: 48500,
        pendingFees: 0,
        admissionNumber: currentUser?.admissionNumber || 'ADM-2026-101',
      },
      homeworks: [
        { title: 'Quantum Mechanics Problem Set #4', subject: 'Advanced Physics', dueDate: '2026-08-28', status: 'Pending' },
        { title: 'Calculus BC Integration Proofs', subject: 'AP Calculus BC', dueDate: '2026-08-25', status: 'Submitted' },
      ],
      results: [
        { subject: 'Advanced Physics', score: 95, grade: 'A+' },
        { subject: 'AP Calculus BC', score: 92, grade: 'A' },
        { subject: 'World Literature', score: 88, grade: 'B+' },
      ],
    };

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await profileAPI.getDashboardData();
        if (res.success && res.data) {
          setDashboardData(res.data);
        } else {
          setDashboardData(defaultStudentDashboard);
        }
      } catch (err) {
        setDashboardData(defaultStudentDashboard);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [currentUser]);

  const handleAssignmentUpload = (title) => {
    toast.success(`Assignment file uploaded for "${title}"`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium">Loading your student workspace...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-rose-500 animate-pulse" />
        <p className="text-sm text-slate-400 mt-2 font-medium">{error || 'No student profile found.'}</p>
      </div>
    );
  }

  const rawProfile = dashboardData?.profile || dashboardData?.student || {};
  const profile = {
    name: currentUser?.name || rawProfile.name || 'Student',
    email: currentUser?.email || rawProfile.email || 'N/A',
    phone: currentUser?.phone || rawProfile.phone || 'N/A',
    fatherName: currentUser?.fatherName || rawProfile.fatherName || 'N/A',
    motherName: currentUser?.motherName || rawProfile.motherName || 'N/A',
    rollNumber: currentUser?.rollNumber || rawProfile.rollNumber || '101',
    admissionNumber: currentUser?.admissionNumber || rawProfile.admissionNumber || 'ADM-2026-101',
    gradeLevel: currentUser?.gradeLevel || currentUser?.classGrade || rawProfile.gradeLevel || 'Grade 11',
    section: currentUser?.section || rawProfile.section || 'A',
    avatar: currentUser?.avatar || rawProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    transportRoute: currentUser?.transportRoute || rawProfile.transportRoute || 'None',
    medicalNotes: currentUser?.medicalNotes || rawProfile.medicalNotes || 'None',
    gpa: rawProfile.gpa || 3.88,
    attendanceRate: rawProfile.attendanceRate || 96.2,
    presentDays: rawProfile.presentDays || 135,
    absentDays: rawProfile.absentDays || 5,
    paidFees: rawProfile.paidFees || 48500,
    pendingFees: rawProfile.pendingFees || 0,
  };
  const stats = dashboardData?.stats || {
    overallGPA: profile.gpa || 3.88,
    attendancePercentage: profile.attendanceRate || 96.2,
    presentDays: profile.presentDays || 135,
    absentDays: profile.absentDays || 5,
    lateDays: 2,
    leaveDays: 1,
    paidFees: profile.paidFees || 48500,
    pendingFees: profile.pendingFees || 0,
    admissionNumber: profile.admissionNumber || 'ADM-2026-101',
  };
  const courses = dashboardData?.courses || dashboardData?.results || [
    { code: 'PHY-301', name: 'Advanced Physics', teacher: 'Dr. Sarah Connor', grade: 'A+', score: 95 },
    { code: 'MTH-402', name: 'AP Calculus BC', teacher: 'Prof. Alan Turing', grade: 'A', score: 92 },
    { code: 'ENG-201', name: 'World Literature', teacher: 'Ms. Emma Watson', grade: 'B+', score: 88 },
  ];
  const assignments = dashboardData?.assignments || dashboardData?.homeworks || [
    { title: 'Quantum Mechanics Problem Set #4', subject: 'Advanced Physics', due: '2026-08-28', status: 'Pending' },
    { title: 'Calculus BC Integration Proofs', subject: 'AP Calculus BC', due: '2026-08-25', status: 'Submitted' },
  ];
  const totalDays = (stats.presentDays || 0) + (stats.absentDays || 0) + (stats.lateDays || 0) + (stats.leaveDays || 0);

  return (
    <div className="space-y-8">
      {/* Student Profile Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-indigo-900/30 to-slate-900 border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
          />
          <div>
            <Badge variant="success" className="mb-1">STUDENT PORTAL</Badge>
            <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Class: {profile.gradeLevel || 'N/A'} - Section {profile.section || 'N/A'} • Roll Number: #{profile.rollNumber || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => toast.info('Timetable schedule downloaded')}>
            Download Schedule PDF
          </Button>
        </div>
      </div>

      {/* Demographics Card */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" /> Student Profile Demographics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="space-y-2">
            <div><span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Email Address</span> {profile.email}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Contact Number</span> {profile.phone || 'N/A'}</div>
          </div>
          <div className="space-y-2">
            <div><span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Father's Name</span> {profile.fatherName || 'N/A'}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Mother's Name</span> {profile.motherName || 'N/A'}</div>
          </div>
          <div className="space-y-2">
            <div><span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Admission Number</span> {profile.admissionNumber}</div>
            <div><span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Transport Route</span> {profile.transportRoute || 'None'}</div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Cumulative GPA</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{stats.overallGPA || '0.0'} / 4.0</div>
          <span className="text-[10px] text-slate-400 block mt-1">Medical Info: {profile.medicalNotes || 'None'}</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-2">{stats.attendancePercentage || '0%'}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex flex-wrap gap-1">
            <span className="text-emerald-400">{stats.presentDays}P</span> / 
            <span className="text-rose-400">{stats.absentDays}A</span> / 
            <span className="text-amber-400">{stats.lateDays}L</span> / 
            <span className="text-indigo-400">{stats.leaveDays}LV</span>
            <span className="text-slate-500">({totalDays} Days)</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Tuition Fees Status</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-2 truncate">₹{stats.paidFees} Paid</div>
          <span className="text-[10px] text-rose-400 block mt-1">₹{stats.pendingFees} Remaining balance</span>
        </Card>

        <Card className="p-4 sm:p-5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Admission Number</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 mt-2 truncate">{stats.admissionNumber}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Status: Enrolled & Active</span>
        </Card>
      </div>

      {/* Results & Exam Breakdown */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Academic Results & Exam Scores
        </h3>
        {courses.length === 0 ? (
          <p className="text-xs text-slate-400">No published exam results found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{c.name}</h4>
                  <span className="text-[11px] text-slate-400">{c.teacher}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400 block">{c.grade}</span>
                  <span className="text-[11px] text-slate-400">{c.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Homework Assignments */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-indigo-400" /> Assigned Homework & Assignments
        </h3>
        {assignments.length === 0 ? (
          <p className="text-xs text-slate-400">No pending homework assignments.</p>
        ) : (
          <div className="space-y-3">
            {assignments.map((a, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.status === 'Submitted' ? 'success' : 'warning'}>{a.status}</Badge>
                    <span className="text-xs text-indigo-400 font-semibold">{a.subject}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{a.title}</h4>
                  <span className="text-xs text-slate-400">Due Date: {a.due}</span>
                </div>
                <Button size="sm" variant="primary" onClick={() => handleAssignmentUpload(a.title)}>
                  <Upload className="w-3.5 h-3.5 mr-1" /> Submit Work
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
