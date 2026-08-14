import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { DataTable } from '../../../components/ui/DataTable';
import { useAuth } from '../../../context/AuthContext';
import { attendanceAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Percent,
  PlusCircle,
  UserCheck,
  Shield,
} from 'lucide-react';

export const AttendanceAnalyticsManagement = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'super_admin';

  const [userTypeTab, setUserTypeTab] = useState(userRole === 'teacher' ? 'teacher' : 'student');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalLeave: 0,
    totalDays: 0,
    attendancePercentage: 0,
  });
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  const [markForm, setMarkForm] = useState({
    studentName: '',
    rollNumber: '',
    className: 'Grade 11-A',
    status: 'Present',
    userType: 'student',
    remarks: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [userTypeTab, userRole]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await attendanceAPI.getAnalytics({ userType: userTypeTab });
      if (res.success) {
        if (res.metrics) setMetrics(res.metrics);
        if (res.charts?.monthlyTrend) setMonthlyTrend(res.charts.monthlyTrend);
        if (res.charts?.statusDistribution) setStatusDistribution(res.charts.statusDistribution);
        if (res.recentLogs) setRecentLogs(res.recentLogs);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load attendance analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    if (!markForm.studentName) {
      toast.error('Please enter name');
      return;
    }

    try {
      const res = await attendanceAPI.mark(markForm);
      toast.success(res.message || 'Attendance recorded successfully');
      setIsMarkModalOpen(false);
      fetchAnalytics();
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
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const logColumns = [
    { header: 'Date', accessor: (row) => new Date(row.date || Date.now()).toLocaleDateString() },
    { header: 'Name', accessor: 'studentName' },
    { header: 'Class / Dept', accessor: 'className' },
    { header: 'Status', accessor: (row) => getStatusBadge(row.status) },
    { header: 'Marked By', accessor: 'markedBy' },
  ];

  return (
    <div className="space-y-6">
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
            Automated attendance percentage computation, MongoDB aggregations & Recharts analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(userRole === 'super_admin' || userRole === 'teacher') && (
            <Button variant="primary" onClick={() => setIsMarkModalOpen(true)}>
              <UserCheck className="w-4 h-4 mr-2" /> Mark Attendance
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
          <span className="text-[10px] text-slate-500">Days attended</span>
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
          <span className="text-[10px] text-slate-500">Approved leaves</span>
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
              <span className="block text-[10px] text-slate-400">Score</span>
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

      {/* Recent Attendance Logs Table */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">Recent Attendance Records</h3>
        <DataTable columns={logColumns} data={recentLogs} loading={loading} searchPlaceholder="Search attendance logs..." />
      </Card>

      {/* Mark Attendance Modal */}
      <Modal isOpen={isMarkModalOpen} onClose={() => setIsMarkModalOpen(false)} title="Mark Daily Attendance">
        <form onSubmit={handleMarkSubmit} className="space-y-4">
          <Input label="Name *" placeholder="e.g. Alex Rivera" value={markForm.studentName} onChange={(e) => setMarkForm({ ...markForm, studentName: e.target.value })} required />
          <Input label="Roll Number / Employee ID" placeholder="e.g. 101" value={markForm.rollNumber} onChange={(e) => setMarkForm({ ...markForm, rollNumber: e.target.value })} />
          <Input label="Class Name / Department" placeholder="e.g. Grade 11-A" value={markForm.className} onChange={(e) => setMarkForm({ ...markForm, className: e.target.value })} />

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
