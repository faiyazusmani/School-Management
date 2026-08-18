import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';
import { attendanceAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Percent,
  UserCheck,
  Shield,
  Search,
  Check,
  X,
  Plane,
} from 'lucide-react';
import { safeSetItem } from '../../../utils/imageCompressor';

export const AttendanceAnalyticsManagement = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'super_admin';
  const teacherName = user?.name || 'Ahad Usmani';

  const [userTypeTab, setUserTypeTab] = useState(userRole === 'teacher' ? 'teacher' : 'student');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  const [students, setStudents] = useState([]);
  const [studentAttendanceState, setStudentAttendanceState] = useState({});

  const [metrics, setMetrics] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalLeave: 0,
    totalDays: 0,
    attendancePercentage: 0,
  });
  const [monthlyTrend, setMonthlyTrend] = useState([
    { name: 'Jan', Present: 5, Absent: 1, Late: 1 },
    { name: 'Feb', Present: 6, Absent: 0, Late: 2 },
    { name: 'Mar', Present: 7, Absent: 1, Late: 0 },
    { name: 'Aug', Present: 5, Absent: 1, Late: 1 },
  ]);
  const [statusDistribution, setStatusDistribution] = useState([
    { name: 'Present', value: 5, color: '#10B981' },
    { name: 'Absent', value: 1, color: '#EF4444' },
    { name: 'Late', value: 1, color: '#F59E0B' },
    { name: 'Leave', value: 1, color: '#6366F1' },
  ]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  const [markForm, setMarkForm] = useState({
    studentName: 'Sonu',
    rollNumber: '153',
    className: 'Grade 12-B',
    status: 'Present',
    userType: 'student',
    remarks: '',
  });

  const mockStudents = [
    { id: 'st_ankit', _id: 'st_ankit', name: 'Ankit Kumar', email: 'ankit@student.edu', rollNumber: '101', gradeLevel: 'Grade 12', section: 'A', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_aarav', _id: 'st_aarav', name: 'Aarav Sharma', email: 'aarav.sharma@student.edu', rollNumber: '102', gradeLevel: 'Grade 12', section: 'A', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_ananya', _id: 'st_ananya', name: 'Ananya Verma', email: 'ananya.verma@student.edu', rollNumber: '103', gradeLevel: 'Grade 11', section: 'A', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_rohan', _id: 'st_rohan', name: 'Rohan Gupta', email: 'rohan.gupta@student.edu', rollNumber: '104', gradeLevel: 'Grade 11', section: 'B', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_anas', _id: 'st_anas', name: 'Anas Usmani', email: 'anas.usmani@student.edu', rollNumber: '105', gradeLevel: 'Grade 8', section: 'A', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_sonu', _id: 'st_sonu', name: 'Sonu Kumar', email: 'sonu@student.edu', rollNumber: '153', gradeLevel: 'Grade 12', section: 'B', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { id: 'st_lucas', _id: 'st_lucas', name: 'Lucas Rivera', email: 'student@edumanage.com', rollNumber: '108', gradeLevel: 'Grade 11', section: 'A', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
  ];

  useEffect(() => {
    fetchStudentsList();
    fetchAnalytics();
  }, [userTypeTab, userRole]);

  const fetchStudentsList = () => {
    try {
      let savedLocal = [];
      try {
        const parseLocal = JSON.parse(localStorage.getItem('edumanage_students') || '[]');
        if (Array.isArray(parseLocal)) savedLocal = parseLocal;
      } catch (e) {}

      let registeredProfiles = [];
      try {
        const parseReg = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
        if (Array.isArray(parseReg)) {
          registeredProfiles = parseReg.filter(
            (p) => p && typeof p === 'object' && (p.role === 'student' || (p.email && p.email.includes('student')))
          );
        }
      } catch (e) {}

      const combined = [...savedLocal, ...registeredProfiles, ...mockStudents];
      const unique = [];
      const seenEmails = new Set();

      for (const st of combined) {
        if (!st || typeof st !== 'object') continue;
        const nameVal = st.name || st.fullName || 'Student User';
        const emailVal = st.email || `${nameVal.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.edu`;
        const key = emailVal.toLowerCase();

        if (!seenEmails.has(key)) {
          seenEmails.add(key);
          const customAv = localStorage.getItem(`edumanage_avatar_${emailVal}`);
          unique.push({
            ...st,
            name: nameVal,
            email: emailVal,
            rollNumber: st.rollNumber || st.rollNo || '101',
            gradeLevel: st.gradeLevel || st.grade || 'Grade 11',
            section: st.section || 'A',
            id: st.id || st._id || `st_${key.replace(/[^a-z0-9]/g, '')}`,
            _id: st._id || st.id || `st_${key.replace(/[^a-z0-9]/g, '')}`,
            avatar: customAv || st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameVal)}&background=6366f1&color=fff&size=200`,
          });
        }
      }
      setStudents(unique);
    } catch (err) {
      console.error('Error in fetchStudentsList:', err);
      setStudents(mockStudents);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    let logs = [];
    try {
      const parseLogs = JSON.parse(localStorage.getItem('edumanage_attendance_logs') || '[]');
      if (Array.isArray(parseLogs) && parseLogs.length > 0) {
        logs = parseLogs;
      }
    } catch (e) {}

    if (!logs || logs.length === 0) {
      logs = [
        { id: 'att_1', date: '2026-08-18', studentName: 'Ankit Kumar', rollNumber: '101', className: 'Grade 12-A', status: 'Present', markedBy: teacherName },
        { id: 'att_2', date: '2026-08-18', studentName: 'Aarav Sharma', rollNumber: '102', className: 'Grade 12-A', status: 'Present', markedBy: teacherName },
        { id: 'att_3', date: '2026-08-18', studentName: 'Ananya Verma', rollNumber: '103', className: 'Grade 11-A', status: 'Late', markedBy: teacherName },
        { id: 'att_4', date: '2026-08-18', studentName: 'Rohan Gupta', rollNumber: '104', className: 'Grade 11-B', status: 'Leave', markedBy: teacherName },
        { id: 'att_5', date: '2026-08-18', studentName: 'Sonu Kumar', rollNumber: '153', className: 'Grade 12-B', status: 'Absent', markedBy: teacherName },
      ];
      safeSetItem('edumanage_attendance_logs', JSON.stringify(logs));
    }

    // Build current student status map
    const statusMap = {};
    logs.forEach((log) => {
      if (log && log.studentName) {
        statusMap[log.studentName.toLowerCase()] = log.status || 'Present';
      }
    });
    setStudentAttendanceState(statusMap);
    setRecentLogs(logs);

    recalculateMetricsAndCharts(logs);
    setLoading(false);
  };

  const recalculateMetricsAndCharts = (logs) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;

    if (Array.isArray(logs)) {
      logs.forEach((l) => {
        if (!l) return;
        const st = l.status;
        if (st === 'Present') present += 1;
        else if (st === 'Absent') absent += 1;
        else if (st === 'Late') late += 1;
        else if (st === 'Leave') leave += 1;
      });
    }

    const totalLogs = (logs && logs.length) || 1;
    const rate = Number((((present + late) / totalLogs) * 100).toFixed(1));

    setMetrics({
      totalPresent: present,
      totalAbsent: absent,
      totalLate: late,
      totalLeave: leave,
      totalDays: totalLogs,
      attendancePercentage: Math.min(rate, 100),
    });

    setStatusDistribution([
      { name: 'Present', value: present, color: '#10B981' },
      { name: 'Absent', value: absent, color: '#EF4444' },
      { name: 'Late', value: late, color: '#F59E0B' },
      { name: 'Leave', value: leave, color: '#6366F1' },
    ]);

    setMonthlyTrend([
      { name: 'Jan', Present: Math.max(present - 1, 1), Absent: absent, Late: late },
      { name: 'Feb', Present: Math.max(present, 2), Absent: absent, Late: late },
      { name: 'Mar', Present: Math.max(present + 1, 3), Absent: Math.max(absent - 1, 0), Late: late },
      { name: 'Aug', Present: present, Absent: absent, Late: late },
    ]);
  };

  // Instant 1-Click Attendance Marking Handler
  const handleQuickMarkAttendance = async (studentObj, newStatus) => {
    if (!studentObj) return;
    const studentName = studentObj.name || 'Student';
    const rollNumber = studentObj.rollNumber || '101';
    const className = `${studentObj.gradeLevel || 'Grade 11'}-${studentObj.section || 'A'}`;

    try {
      try {
        await attendanceAPI.mark({
          studentName,
          rollNumber,
          className,
          status: newStatus,
          userType: 'student',
          markedBy: teacherName,
        });
      } catch (e) {}

      const newLog = {
        id: `att_${Date.now()}_${Math.floor(Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        studentName,
        rollNumber,
        className,
        status: newStatus,
        markedBy: teacherName,
      };

      const updatedLogs = [
        newLog,
        ...recentLogs.filter((l) => l && l.studentName && l.studentName.toLowerCase() !== studentName.toLowerCase()),
      ];

      setRecentLogs(updatedLogs);
      safeSetItem('edumanage_attendance_logs', JSON.stringify(updatedLogs));

      const updatedMap = {
        ...studentAttendanceState,
        [studentName.toLowerCase()]: newStatus,
      };
      setStudentAttendanceState(updatedMap);

      recalculateMetricsAndCharts(updatedLogs);

      const statusIcons = {
        Present: '✓',
        Absent: '✗',
        Late: '⏱',
        Leave: '✈',
      };
      toast.success(`Attendance for ${studentName} marked as "${statusIcons[newStatus]} ${newStatus}"!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update attendance status');
    }
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    if (!markForm.studentName) {
      toast.error('Please enter student name');
      return;
    }

    try {
      const studentObj = {
        name: markForm.studentName,
        rollNumber: markForm.rollNumber,
        gradeLevel: markForm.className,
        section: '',
      };
      await handleQuickMarkAttendance(studentObj, markForm.status);
      setIsMarkModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to record attendance');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <Badge variant="success">✓ Present</Badge>;
      case 'Absent':
        return <Badge variant="danger">✗ Absent</Badge>;
      case 'Late':
        return <Badge variant="warning">⏱ Late</Badge>;
      case 'Leave':
        return <Badge variant="info">✈ Leave</Badge>;
      default:
        return <Badge variant="neutral">{status || 'Not Marked'}</Badge>;
    }
  };

  const filteredStudents = (students || []).filter((st) => {
    if (!st || !st.name) return false;
    const nameStr = st.name.toLowerCase();
    const rollStr = (st.rollNumber || '').toLowerCase();
    const emailStr = (st.email || '').toLowerCase();
    const query = (searchTerm || '').toLowerCase();

    const matchesSearch = nameStr.includes(query) || rollStr.includes(query) || emailStr.includes(query);
    const matchesGrade = gradeFilter === 'All' || (st.gradeLevel && st.gradeLevel.includes(gradeFilter));
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6 max-w-full min-w-0 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Role Access Scope:
            </span>
            <Badge variant="primary" className="uppercase">
              <Shield className="w-3 h-3 mr-1" />
              {userRole.replace('_', ' ')}
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Attendance Analytics System</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time student attendance marking, live analytics, Recharts distribution & attendance rate computation
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(userRole === 'super_admin' || userRole === 'teacher') && (
            <Button variant="primary" onClick={() => setIsMarkModalOpen(true)}>
              <UserCheck className="w-4 h-4 mr-2" /> Mark Custom Attendance
            </Button>
          )}

          {userRole === 'super_admin' && (
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setUserTypeTab('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  userTypeTab === 'student' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setUserTypeTab('teacher')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  userTypeTab === 'teacher' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Teachers
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Present</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{metrics.totalPresent}</div>
          <span className="text-[10px] text-slate-500">Students attended today</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Absent</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">{metrics.totalAbsent}</div>
          <span className="text-[10px] text-slate-500">Unexcused absences</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Late</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{metrics.totalLate}</div>
          <span className="text-[10px] text-slate-500">Delayed arrivals</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Leave</span>
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">{metrics.totalLeave}</div>
          <span className="text-[10px] text-slate-500">Approved student leaves</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-indigo-950/40 border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300">Attendance Rate</span>
            <Percent className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.attendancePercentage}%</div>
          <span className="text-[10px] text-indigo-300 font-semibold">
            {metrics.attendancePercentage >= 90 ? '🌟 Excellent Standing' : '⚠️ Requires Attention'}
          </span>
        </Card>
      </div>

      {/* 🚀 Interactive Student Roster & Live 1-Click Attendance Panel */}
      <Card className="p-4 sm:p-6 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" /> Student Attendance Marking Panel
            </h2>
            <p className="text-xs text-slate-400">
              Teacher 1-Click Attendance Controls — Mark Present, Absent, Late, or Leave for registered students
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student name or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs rounded-xl pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Grade Filter Dropdown */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="text-xs rounded-xl px-3 py-2 bg-slate-950 border border-slate-800 text-slate-200 outline-none"
            >
              <option value="All">All Grades</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>
        </div>

        {/* Student Roster Marking Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/80">
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-4">Roll #</th>
                <th className="py-3.5 px-4">Class & Section</th>
                <th className="py-3.5 px-4">Current Attendance Status</th>
                <th className="py-3.5 px-4 text-center">Teacher Action (1-Click Mark)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const nameKey = (st.name || '').toLowerCase();
                  const currentStatus = studentAttendanceState[nameKey] || 'Not Marked';

                  return (
                    <tr key={st._id || st.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Student Profile Info */}
                      <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}&background=6366f1&color=fff&size=100`;
                            }}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-950 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block text-sm">{st.name}</span>
                            <span className="text-[11px] text-slate-400 block">{st.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg font-bold">
                          #{st.rollNumber || '101'}
                        </span>
                      </td>

                      {/* Grade & Sec */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="purple">
                          {st.gradeLevel || 'Grade 11'} – {st.section || 'A'}
                        </Badge>
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(currentStatus)}
                      </td>

                      {/* 1-Click Action Buttons for Teacher */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => handleQuickMarkAttendance(st, 'Present')}
                            title="Mark Present"
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" /> Present
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => handleQuickMarkAttendance(st, 'Absent')}
                            title="Mark Absent"
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" /> Absent
                          </button>

                          {/* Late Button */}
                          <button
                            type="button"
                            onClick={() => handleQuickMarkAttendance(st, 'Late')}
                            title="Mark Late"
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" /> Late
                          </button>

                          {/* Leave Button */}
                          <button
                            type="button"
                            onClick={() => handleQuickMarkAttendance(st, 'Leave')}
                            title="Mark Leave"
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border ${
                              currentStatus === 'Leave'
                                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20'
                            }`}
                          >
                            <Plane className="w-3.5 h-3.5" /> Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No matching students found in roster.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visual Analytics Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <Card className="p-6 border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Attendance Trends</h3>
              <p className="text-xs text-slate-400">Historical breakdown across academic terms</p>
            </div>
            <Badge variant="neutral">Year 2026</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <Area type="monotone" dataKey="Present" stroke="#10B981" fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="Absent" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Late" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Status Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Proportion of attendance logs</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-white">{metrics.attendancePercentage}%</span>
              <span className="block text-[10px] text-slate-400 font-semibold">Attendance Rate</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.name}:</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Mark Attendance Modal */}
      <Modal isOpen={isMarkModalOpen} onClose={() => setIsMarkModalOpen(false)} title="Mark Custom Attendance">
        <form onSubmit={handleMarkSubmit} className="space-y-4">
          <Input label="Student Name *" placeholder="e.g. Sonu Kumar" value={markForm.studentName} onChange={(e) => setMarkForm({ ...markForm, studentName: e.target.value })} required />
          <Input label="Roll Number / Employee ID" placeholder="e.g. 153" value={markForm.rollNumber} onChange={(e) => setMarkForm({ ...markForm, rollNumber: e.target.value })} />
          <Input label="Class Name / Department" placeholder="e.g. Grade 12-B" value={markForm.className} onChange={(e) => setMarkForm({ ...markForm, className: e.target.value })} />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Attendance Status *</label>
            <select
              value={markForm.status}
              onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
              className="w-full text-sm rounded-xl p-2.5 bg-slate-900 border border-slate-800 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Present">✓ Present</option>
              <option value="Absent">✗ Absent</option>
              <option value="Late">⏱ Late</option>
              <option value="Leave">✈ Leave</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="neutral" onClick={() => setIsMarkModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Attendance</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
