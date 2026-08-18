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
  Eye,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { GlobalSearchModal } from '../../components/enterprise/GlobalSearchModal';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../components/ui/toast';

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewingNotification, setViewingNotification] = useState(null);

  // Default seed notifications list
  const defaultNotifs = [
    {
      id: 'notif_default_1',
      title: 'Annual Sports Meet 2026 Schedule',
      content: 'Registration is now open for all grades (Nursery to 12th). Check the sports portal for event timings and trial rules.',
      category: 'Sports & Event',
      targetAudience: 'all',
      date: '2026-08-18',
      read: false,
    },
    {
      id: 'notif_default_2',
      title: 'Mid-Term Board Grade Publishing',
      content: 'Gradebooks updated for Grade 11-A and Grade 10 Board Batch. Verify subject marks under Exams & Results.',
      category: 'Academic',
      targetAudience: 'all',
      date: '2026-08-17',
      read: false,
    },
  ];

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('edumanage_notifications');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('edumanage_notifications', JSON.stringify(defaultNotifs));
      return defaultNotifs;
    } catch (e) {
      return defaultNotifs;
    }
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Listen to real-time notice published events
  useEffect(() => {
    const syncNotifications = () => {
      try {
        const saved = localStorage.getItem('edumanage_notifications');
        if (saved) {
          setNotifications(JSON.parse(saved));
        }
      } catch (e) {}
    };

    syncNotifications();
    window.addEventListener('notice_published', syncNotifications);
    window.addEventListener('storage', syncNotifications);
    return () => {
      window.removeEventListener('notice_published', syncNotifications);
      window.removeEventListener('storage', syncNotifications);
    };
  }, []);

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

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('edumanage_notifications', JSON.stringify(updated));
    toast.success('All notifications marked as read.');
  };

  const handleDeleteNotification = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('edumanage_notifications', JSON.stringify(updated));
    toast.success('Notification removed');
  };

  const handleViewNotification = (notif) => {
    setViewingNotification(notif);
    // Mark this specific notification as read
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('edumanage_notifications', JSON.stringify(updated));
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          { name: 'Student Fee', icon: DollarSign, path: '/dashboard/fees' },
          { name: 'Teacher Salary', icon: DollarSign, path: '/dashboard/salary' },
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
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800/80">
            <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className={`min-w-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
                <div className="font-extrabold text-white text-base tracking-tight truncate">EduManage PRO</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">Academic OS</div>
              </div>
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile navigation"
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 sm:p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={`truncate ${collapsed ? 'lg:hidden' : 'block'}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Badge */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover border border-indigo-500/30 shrink-0"
              />
              <div className={`min-w-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
                <div className="text-xs font-bold text-slate-100 truncate">
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
                className="relative p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
                  </>
                )}
              </button>

              {/* Real-time Notifications Bell Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3 z-50 max-w-[calc(100vw-1.5rem)]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Notifications Bulletin</span>
                      {unreadCount > 0 && (
                        <Badge variant="purple" className="text-[9px] px-1.5 py-0.2">
                          {unreadCount} New
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  </div>

                  <div className="space-y-2 text-xs max-h-80 overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-xl border transition-all ${
                            !n.read
                              ? 'bg-indigo-500/10 border-indigo-500/30'
                              : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-100 text-xs line-clamp-1">{n.title}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.content}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant="purple" className="text-[9px]">{n.category || 'Announcement'}</Badge>
                                <span className="text-[9px] text-slate-500">{n.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {/* 👁️ View Notification Button */}
                              <button
                                onClick={() => handleViewNotification(n)}
                                title="View Full Notice Details"
                                className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* 🗑️ Delete Notification Button */}
                              <button
                                onClick={(e) => handleDeleteNotification(n.id, e)}
                                title="Delete Notification"
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-slate-500 text-xs">
                        No notifications found.
                      </div>
                    )}
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

      {/* 👁️ VIEW FULL NOTICE NOTIFICATION DETAIL MODAL */}
      <Modal isOpen={!!viewingNotification} onClose={() => setViewingNotification(null)} title="Official Notice Announcement">
        {viewingNotification && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="purple">{viewingNotification.category || 'General Announcement'}</Badge>
              <span className="text-xs text-slate-400 font-mono">{viewingNotification.date}</span>
            </div>

            <h2 className="text-lg font-bold text-white">{viewingNotification.title}</h2>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs text-slate-200">
              <p className="leading-relaxed whitespace-pre-wrap">{viewingNotification.content}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>Target Audience: <b className="text-indigo-400 uppercase">{viewingNotification.targetAudience || 'ALL'}</b></span>
                <span>Sender: <b className="text-white">Super Admin Office</b></span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewingNotification(null)}>
                Close Notice
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enterprise Global Command Palette Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};
