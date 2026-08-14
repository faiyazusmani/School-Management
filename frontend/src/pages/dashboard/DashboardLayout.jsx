import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Award,
  Bell,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  DollarSign,
  MessageSquare,
  Settings,
  Command,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { GlobalSearchModal } from '../../components/enterprise/GlobalSearchModal';
import { toast } from '../../components/ui/toast';

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Keyboard shortcut Ctrl+K / Cmd+K for command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar drawer is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const roleColors = {
    super_admin: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    teacher: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    student: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    parent: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  // Sidebar navigation items based on active role
  const getNavItems = () => {
    const role = user?.role || 'super_admin';
    switch (role) {
      case 'super_admin':
        return [
          { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'Student Management', icon: Users, path: '/dashboard/students' },
          { name: 'Teacher Management', icon: Users, path: '/dashboard/teachers' },
          { name: 'Parent Management', icon: Users, path: '/dashboard/parents' },
          { name: 'Classes & Sections', icon: BookOpen, path: '/dashboard/classes' },
          { name: 'Subjects Catalog', icon: BookOpen, path: '/dashboard/subjects' },
          { name: 'Notice Board', icon: Bell, path: '/dashboard/notices' },
          { name: 'Exams & Results', icon: Award, path: '/dashboard/exams' },
          { name: 'Tuition Fee Invoices', icon: DollarSign, path: '/dashboard/fees' },
          { name: 'Faculty Salary & Payroll', icon: DollarSign, path: '/dashboard/salary' },
          { name: 'Library Catalog', icon: BookOpen, path: '/dashboard/library' },
          { name: 'Bus Transport', icon: Calendar, path: '/dashboard/transport' },
          { name: 'Admissions Pipeline', icon: UserCheck, path: '/dashboard/admissions' },
          { name: 'Calendar Events', icon: Calendar, path: '/dashboard/calendar' },
          { name: 'Profile Settings', icon: Settings, path: '/dashboard/profile' },
        ];
      case 'teacher':
        return [
          { name: 'Teacher Portal', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'Student Roster', icon: Users, path: '/dashboard/students' },
          { name: 'Class Timetable', icon: Calendar, path: '/dashboard/timetable' },
          { name: 'Mark Attendance', icon: UserCheck, path: '/dashboard/attendance' },
          { name: 'Gradebook & Exams', icon: Award, path: '/dashboard/exams' },
          { name: 'Notice Board', icon: Bell, path: '/dashboard/notices' },
          { name: 'My Profile', icon: Settings, path: '/dashboard/profile' },
        ];
      case 'student':
        return [
          { name: 'Student Portal', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'My Subjects', icon: BookOpen, path: '/dashboard/subjects' },
          { name: 'Assignments Due', icon: Calendar, path: '/dashboard/assignments' },
          { name: 'Grade History', icon: Award, path: '/dashboard/exams' },
          { name: 'Library Search', icon: BookOpen, path: '/dashboard/library' },
          { name: 'Fee Statements', icon: DollarSign, path: '/dashboard/fees' },
          { name: 'My Profile', icon: Settings, path: '/dashboard/profile' },
        ];
      case 'parent':
        return [
          { name: 'Parent Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { name: 'Child Performance', icon: Award, path: '/dashboard/exams' },
          { name: 'Tuition Fees', icon: DollarSign, path: '/dashboard/fees' },
          { name: 'Teacher Chat', icon: MessageSquare, path: '/dashboard/messages' },
          { name: 'My Profile', icon: Settings, path: '/dashboard/profile' },
        ];
      default:
        return [{ name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 light:bg-slate-50 flex flex-col lg:flex-row transition-colors overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop Fixed / Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-xl transition-all duration-300 dark:bg-slate-900/95 dark:border-slate-800 light:bg-white light:border-slate-200 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } w-72 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Sidebar Header */}
        <div className="h-16 sm:h-20 flex items-center justify-between px-4 border-b border-slate-800/80 dark:border-slate-800 light:border-slate-200 shrink-0">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className={`truncate ${collapsed ? 'lg:hidden' : 'block'}`}>
              <span className="text-sm sm:text-base font-extrabold text-white dark:text-white light:text-slate-900 block leading-tight">
                EduManage <span className="text-indigo-400">PRO</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar navigation"
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-900'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className={`truncate ${collapsed ? 'lg:hidden' : 'block'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-slate-800/80 dark:border-slate-800 light:border-slate-200 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={user?.name || 'User Profile'}
                className="w-9 h-9 rounded-full object-cover border border-indigo-500/30 shrink-0"
              />
              <div className={`min-w-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
                <div className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900 truncate">
                  {user?.name || 'Alexander Wright'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'admin@edumanage.com'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Log out of system"
              className={`p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 ${
                collapsed ? 'lg:hidden' : 'block'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        } pl-0`}
      >
        {/* Header Bar */}
        <header className="h-16 sm:h-20 sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between gap-2 dark:bg-slate-950/90 dark:border-slate-800 light:bg-white/90 light:border-slate-200">
          {/* Left Header Section: Hamburger Toggle for Mobile + Search Command Palette */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop / Tablet Command Palette Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search system resources"
              className="hidden sm:flex items-center justify-between max-w-xs md:max-w-md w-full text-xs rounded-xl px-3 py-2 bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Search everywhere...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800 hidden md:flex items-center gap-0.5 shrink-0">
                <Command className="w-3 h-3" /> K
              </kbd>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Open search modal"
              className="sm:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              <Search className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border truncate max-w-[110px] sm:max-w-none ${
                roleColors[user?.role || 'super_admin']
              }`}
            >
              {user?.role?.replace('_', ' ')}
            </span>

            <ThemeToggle />

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="View system notifications"
                className="relative p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3 z-50 max-w-[calc(100vw-2rem)]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <span className="text-[10px] text-indigo-400 font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="font-semibold text-slate-200">Annual Sports Meet Schedule</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Registration now open for all grades.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="font-semibold text-slate-200">Mid-Term Grade Publishing</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Gradebooks updated for Grade 11-A.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto min-w-0 max-w-full">
          <Outlet />
        </main>
      </div>

      {/* Enterprise Global Command Palette Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};
