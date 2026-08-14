import React, { useEffect, useState } from 'react';
import { Trophy, UserCheck, GraduationCap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../services/api';

export const Testimonials = () => {
  const { user } = useAuth();
  const [dbStudents, setDbStudents] = useState([]);
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    fetchStudents();
    const handleStorageChange = () => setProfileVersion((v) => v + 1);
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await apiCall('/students');
      if (res && res.success && Array.isArray(res.data)) {
        setDbStudents(res.data);
      }
    } catch (err) {}
  };

  // Get dynamic registered/logged-in student and parent profiles from localStorage
  let savedProfiles = [];
  try {
    const saved = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
    savedProfiles = saved.filter((u) => u.role === 'student' || u.role === 'parent');
  } catch (e) {}

  // Active logged-in user profile if student or parent
  const activeUserProfile = user && (user.role === 'student' || user.role === 'parent') ? [
    {
      id: user.id || 'curr_user_topper',
      name: user.name || 'Active User',
      role: user.role === 'student' ? 'Active Student Topper (Grade 11)' : 'Logged In Parent Community',
      score: user.role === 'student' ? 'GPA 3.96 / Honor Roll' : 'Active Verified Parent',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      comment: user.role === 'student' 
        ? 'Active enrolled student enjoying seamless learning management, assignment submissions, and attendance tracking on EduManage Pro.'
        : 'Proud parent actively monitoring academic progress and school notices in real-time through EduManage Pro.',
      badge: user.role === 'student' ? 'HONOR ROLL TOPPER' : 'VERIFIED PARENT',
      isLoggedIn: true,
    }
  ] : [];

  const schoolToppers = [
    {
      id: 'st_top_1',
      name: 'Aarav Sharma',
      role: 'Grade 12 Science Topper',
      score: 'GPA 4.00 / 99.8% Score',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'Top state ranker in Physics & Mathematics. EduManage Pro keeps my study schedules and test prep organized!',
      badge: 'STATE RANK 1 TOPPER',
      isLoggedIn: false,
    },
    {
      id: 'st_top_2',
      name: 'Ananya Verma',
      role: 'Grade 11 Mathematics Champion',
      score: 'GPA 3.98 / 99.4% Score',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment: 'Olympiad Gold Medalist in AP Calculus. Instant grade statements and timetable tracking make study effortless!',
      badge: 'MATH OLYMPIAD WINNER',
      isLoggedIn: false,
    },
    {
      id: 'st_top_3',
      name: 'Rohan Gupta',
      role: 'Grade 11 Computer Science Lead',
      score: 'GPA 3.96 / 99.0% Score',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      comment: 'Full Stack Development and AI Systems project leader at Shimla International Public School.',
      badge: 'CODE CHAMPION',
      isLoggedIn: false,
    },
    {
      id: 'st_top_4',
      name: 'Sneha Reddy',
      role: 'Grade 10 Honor Roll Scholar',
      score: 'GPA 3.95 / 98.8% Score',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      comment: 'Top scorer in English Literature & Environmental Sciences.',
      badge: 'HONOR ROLL SCHOLAR',
      isLoggedIn: false,
    },
  ];

  // Combine active logged in user, saved local profiles, DB fetched students, and school toppers
  const allToppers = [
    ...activeUserProfile,
    ...savedProfiles.map((rp) => ({
      id: rp.id || rp.email,
      name: rp.name,
      role: rp.role === 'student' ? 'Registered Student Topper' : 'Registered Parent Member',
      score: rp.role === 'student' ? 'GPA 3.95 / Top Percentile' : 'Parent Community Member',
      avatar: rp.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      comment: `Registered ${rp.role} actively participating in Shimla International Public School academic community.`,
      badge: rp.role === 'student' ? 'STUDENT TOPPER' : 'PARENT MEMBER',
      isLoggedIn: user?.email === rp.email,
    })),
    ...dbStudents.map((dbs) => ({
      id: dbs._id || dbs.id,
      name: dbs.name,
      role: `Student (${dbs.grade || dbs.className || 'Grade 11-A'})`,
      score: dbs.gpa ? `GPA ${dbs.gpa} / Honor Roll` : 'GPA 3.92 / Top Achiever',
      avatar: dbs.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      comment: `Enrolled student at Shimla International Public School actively achieving academic excellence.`,
      badge: 'STUDENT TOPPER',
      isLoggedIn: user?.email === dbs.email,
    })),
    ...schoolToppers,
  ].filter((t, index, self) => self.findIndex((x) => x.name?.toLowerCase() === t.name?.toLowerCase()) === index);

  return (
    <section className="py-24 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border-t border-slate-900 dark:border-slate-900 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="warning">ACADEMIC TOPPERS & HONOR ROLL</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 dark:text-white light:text-slate-900 tracking-tight">
            Active Registered Students & School Toppers
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base">
            Live profiles of students and parents who have registered and logged into Shimla International Public School.
          </p>
        </div>

        {allToppers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allToppers.map((item, i) => (
              <Card key={i} className={`p-6 relative flex flex-col justify-between transition-all ${item.isLoggedIn ? 'border-2 border-amber-500 bg-amber-950/20 shadow-xl shadow-amber-500/10' : ''}`}>
                <Trophy className="w-8 h-8 text-amber-400/20 absolute top-4 right-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {item.badge}
                    </span>
                    {item.isLoggedIn && (
                      <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        <UserCheck className="w-3 h-3" /> Logged In
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 mt-6">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 shadow-md"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-amber-400">
                      {item.role}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.score}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Student Logged In Yet</h3>
            <p className="text-xs text-slate-400">
              When a student or parent registers or logs in with their credentials, their profile card will automatically appear here!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
