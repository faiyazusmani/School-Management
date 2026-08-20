import React, { useEffect, useState } from 'react';
import {
  Users,
  GraduationCap,
  School,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
  Bell,
  Search,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { TopStudentsWidget } from '../../components/enterprise/TopStudentsWidget';
import { apiCall } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';

export const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [localUsers, setLocalUsers] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    const res = await apiCall('/dashboard/data', 'GET', null, token);
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  // Synchronize registered & currently logged-in users from localStorage into Dashboard feed
  useEffect(() => {
    const syncUsers = () => {
      let savedProfiles = [];
      try {
        savedProfiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
      } catch (e) {}

      const currentUserObj = user ? [user] : [];
      const allRegistered = [...currentUserObj, ...savedProfiles];

      const formatted = allRegistered.map((u, idx) => {
        let formattedRole = 'Student';
        if (u.role === 'super_admin' || u.email?.includes('admin')) formattedRole = 'Super Admin';
        else if (u.role === 'teacher' || u.email?.includes('teacher')) formattedRole = 'Teacher';
        else if (u.role === 'parent' || u.email?.includes('parent')) formattedRole = 'Parent';

        return {
          id: u.id || u._id || u.email || `reg_u_${idx}`,
          name: u.name || u.email?.split('@')[0] || 'Registered User',
          role: formattedRole,
          email: u.email || 'user@edumanage.com',
          date: u.date || new Date().toISOString().split('T')[0],
          status: 'Active',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        };
      });

      const unique = formatted.filter(
        (u, index, self) => u && u.email && self.findIndex((x) => x && x.email && x.email.toLowerCase() === u.email.toLowerCase()) === index
      );

      setLocalUsers(unique);
    };

    syncUsers();
    window.addEventListener('storage', syncUsers);
    return () => window.removeEventListener('storage', syncUsers);
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalStudents: 1450,
    totalTeachers: 98,
    totalParents: 1200,
    activeClasses: 42,
    monthlyRevenue: 128400,
    systemUptime: '99.98%',
  };

  const chartData = data?.enrollmentTrend || [
    { month: 'Jan', students: 1200, revenue: 95000 },
    { month: 'Feb', students: 1250, revenue: 102000 },
    { month: 'Mar', students: 1310, revenue: 110000 },
    { month: 'Apr', students: 1380, revenue: 118000 },
    { month: 'May', students: 1420, revenue: 124000 },
    { month: 'Jun', students: 1450, revenue: 128400 },
  ];

  const recentUsers = [
    ...localUsers,
    ...(data?.recentUsers || [
      { id: 'm_1', name: 'Dr. Sarah Connor', role: 'Teacher', email: 'sarah.c@edumanage.com', date: '2026-08-01', status: 'Active' },
      { id: 'm_2', name: 'Alex Rivera', role: 'Student', email: 'alex.r@student.edu', date: '2026-08-02', status: 'Active' },
      { id: 'm_3', name: 'Michael Vance', role: 'Parent', email: 'vance.m@gmail.com', date: '2026-08-03', status: 'Pending' },
      { id: 'm_4', name: 'Elena Rostova', role: 'Teacher', email: 'elena.r@edumanage.com', date: '2026-08-04', status: 'Active' },
    ]),
  ]
    .filter(
      (u, index, self) => u && u.email && self.findIndex((x) => x && x.email && x.email.toLowerCase() === u.email.toLowerCase()) === index
    )
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.role.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 max-w-full">
      {/* Welcome Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="min-w-0">
          <Badge variant="purple" className="mb-2 text-[10px]">SUPER ADMIN CONTROL PANEL</Badge>
          <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            Institutional Analytics & Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring across 1,450 enrolled students, 98 faculty staff, and multi-branch operations.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="primary" onClick={() => toast.success('Exporting monthly compliance PDF summary...')}>
            Export Summary PDF
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-2 sm:mt-3">{stats.totalStudents}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.4% from last term</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Roster</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-2 sm:mt-3">{stats.totalTeachers}</div>
          <div className="text-xs text-slate-400 mt-1">98 Active Faculty Members</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Active Classes</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-2 sm:mt-3">{stats.activeClasses}</div>
          <div className="text-xs text-emerald-400 mt-1">✓ Active Grade Sections</div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-2 sm:mt-3">${stats.monthlyRevenue.toLocaleString()}</div>
          <div className="text-xs text-amber-400 mt-1">Fee Collections</div>
        </Card>
      </div>

      {/* Main Grid: Enrollment Trend + Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-base text-white">Enrollment & Revenue Trend</CardTitle>
            <CardDescription className="text-xs text-slate-400">Monthly student onboarding vs fee collections</CardDescription>
          </CardHeader>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-base text-white">Institutional Notices</CardTitle>
            <CardDescription className="text-xs text-slate-400">Recent announcements</CardDescription>
          </CardHeader>

          <div className="space-y-3">
            {[
              { title: 'Annual Sports Day Registration Open', date: 'Aug 04', category: 'Event' },
              { title: 'Parent-Teacher Conference Schedule', date: 'Aug 02', category: 'Academic' },
              { title: 'System Security Patch v2.5 Applied', date: 'Jul 30', category: 'Security' },
            ].map((n, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" className="text-[9px]">{n.category}</Badge>
                  <span className="text-[10px] text-slate-500">{n.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200">{n.title}</h4>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Students Widget */}
      <TopStudentsWidget />

      {/* User Management Table - Dynamic Active User Feed */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Active Logged-In Users & Accounts Feed</h3>
            <p className="text-xs text-slate-400">Real-time user logins across Student, Teacher, Parent & Admin portals</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, role, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs rounded-xl pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">User Account Name</th>
                <th className="py-3 px-4">Portal Role</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Date Logged In</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {recentUsers.length > 0 ? (
                recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap flex items-center gap-2">
                      <img
                        src={localStorage.getItem(`edumanage_avatar_${u.email}`) || u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=100`}
                        alt={u.name}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=100`;
                        }}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700 bg-slate-950"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          u.role === 'Super Admin'
                            ? 'purple'
                            : u.role === 'Teacher'
                            ? 'indigo'
                            : u.role === 'Student'
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono whitespace-nowrap">{u.email}</td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{u.date}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> {u.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No active user accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
