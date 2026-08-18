import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, BookOpen, DollarSign, Bell, ArrowRight, Command, UserCheck, ShieldCheck, User } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [searchDatabase, setSearchDatabase] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    // Load registered & active logged-in users from localStorage & runtime context
    let profiles = [];
    try {
      profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
    } catch (e) {}

    // Ensure current active logged-in user is present
    if (user && !profiles.some((p) => p.email === user.email)) {
      profiles.unshift({
        id: user.id || 'usr_current',
        name: user.name,
        email: user.email,
        role: user.role || 'super_admin',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Active Now',
      });
    }

    // Map registered users into searchable items
    const userSearchItems = profiles.map((p) => {
      const roleLabel = p.role === 'student' ? 'Student' : p.role === 'teacher' ? 'Teacher' : p.role === 'parent' ? 'Parent' : 'Super Admin';
      const targetRoute = p.role === 'student' ? '/dashboard/students' : p.role === 'teacher' ? '/dashboard/teachers' : p.role === 'parent' ? '/dashboard/parents' : '/dashboard';
      return {
        id: p.id || p.email,
        title: p.name,
        subtitle: `${p.email} • ${roleLabel}`,
        category: roleLabel,
        route: targetRoute,
        isUser: true,
        role: p.role,
        status: p.status || 'Active Logged-In User 🟢',
      };
    });

    // Default seed students, teachers, parents to ensure deep search coverage
    const defaultPeople = [
      { id: 'p_1', title: 'Alexander Wright', subtitle: 'admin@edumanage.com • Super Admin', category: 'Super Admin', route: '/dashboard', isUser: true, status: 'Active Now 🟢' },
      { id: 'p_2', title: 'Dr. Sarah Connor', subtitle: 'sarah.connor@edumanage.com • Head of Science', category: 'Teacher', route: '/dashboard/teachers', isUser: true, status: 'Active Now 🟢' },
      { id: 'p_3', title: 'Aarav Sharma', subtitle: 'aarav.sharma@edumanage.com • Grade 11-A Roll #101', category: 'Student', route: '/dashboard/students', isUser: true, status: 'Active Now 🟢' },
      { id: 'p_4', title: 'Owais Usmani', subtitle: 'owais.usmani@edumanage.com • Grade 11-A Roll #191', category: 'Student', route: '/dashboard/students', isUser: true, status: 'Active Now 🟢' },
      { id: 'p_5', title: 'Ankit', subtitle: 'ankit@edumanage.com • Grade 11-A Roll #78', category: 'Student', route: '/dashboard/students', isUser: true, status: 'Active Now 🟢' },
      { id: 'p_6', title: 'Vicky', subtitle: 'vicky@edumanage.com • Grade 11-A Roll #100', category: 'Student', route: '/dashboard/students', isUser: true, status: 'Active Now 🟢' },
      { id: 'p_7', title: 'Marcus Rivera', subtitle: 'marcus.rivera@edumanage.com • Parent of Lucas & Sophia', category: 'Parent', route: '/dashboard/parents', isUser: true, status: 'Active Now 🟢' },
    ];

    // Combine user profiles without duplicates
    const allUsersCombined = [...userSearchItems, ...defaultPeople];
    const uniqueUsers = allUsersCombined.filter(
      (u, idx, self) => u.title && self.findIndex((x) => x.title.toLowerCase() === u.title.toLowerCase()) === idx
    );

    // Standard platform routes & modules
    const systemModules = [
      { id: 'm_1', title: 'Institutional Notice Board', subtitle: 'Publish school announcements & bulletins', category: 'Module', route: '/dashboard/notices' },
      { id: 'm_2', title: 'Examination & Gradebook Catalog', subtitle: 'View exam schedules and student marks', category: 'Module', route: '/dashboard/exams' },
      { id: 'm_3', title: 'Student Fee Management', subtitle: 'Process 12-month tuition & ledger statements', category: 'Module', route: '/dashboard/fees' },
      { id: 'm_4', title: 'Teacher Salary & Payroll', subtitle: 'Manage faculty disburments & salary slips', category: 'Module', route: '/dashboard/salary' },
      { id: 'm_5', title: 'Classes & 8-Bell Timetable Schedule', subtitle: 'View Nursery to 12th timetable (9:00 AM - 3:30 PM)', category: 'Module', route: '/dashboard/classes' },
      { id: 'm_6', title: 'Subjects & Academic Catalog', subtitle: '21+ Academic subjects across Science & Commerce', category: 'Module', route: '/dashboard/subjects' },
    ];

    setSearchDatabase([...uniqueUsers, ...systemModules]);
  }, [isOpen, user]);

  const results = query
    ? searchDatabase.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchDatabase.slice(0, 6);

  const handleSelect = (route) => {
    navigate(route);
    onClose();
    setQuery('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950/40">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type any name (Student, Teacher, Parent, Admin)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">ESC</kbd>
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-3 space-y-1.5 max-h-96 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>{query ? `Search Results (${results.length})` : 'Active Users & Quick System Shortcuts'}</span>
            {query && <span className="text-indigo-400 font-normal text-[10px]">Real-Time User Query</span>}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No student, teacher, or parent found matching <b>"{query}"</b>.</p>
              <p className="text-[11px] text-slate-500">Try searching by name, role, email, or subject.</p>
            </div>
          ) : (
            results.map((res) => (
              <div
                key={res.id}
                onClick={() => handleSelect(res.route)}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-indigo-600/20 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                    res.isUser
                      ? res.role === 'teacher'
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                        : res.role === 'student'
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : res.role === 'parent'
                        ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {res.isUser ? <User className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 truncate">
                        {res.title}
                      </span>
                      <Badge
                        variant={
                          res.category === 'Student'
                            ? 'success'
                            : res.category === 'Teacher'
                            ? 'purple'
                            : res.category === 'Parent'
                            ? 'warning'
                            : 'indigo'
                        }
                        className="text-[9px] py-0 px-1.5"
                      >
                        {res.category}
                      </Badge>
                      {res.isUser && (
                        <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Logged-In Dashboard
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{res.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-400 shrink-0 ml-2">
                  <span>View</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> Live User & Role Search Active
          </span>
          <span>EduManage OS v2.5</span>
        </div>
      </div>
    </div>
  );
};
