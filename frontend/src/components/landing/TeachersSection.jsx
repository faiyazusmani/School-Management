import React, { useEffect, useState } from 'react';
import { UserCheck, GraduationCap } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../services/api';

export const TeachersSection = () => {
  const { user } = useAuth();
  const [dbTeachers, setDbTeachers] = useState([]);
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    fetchTeachers();
    const handleStorageChange = () => setProfileVersion((v) => v + 1);
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await apiCall('/teachers');
      if (res && res.success && Array.isArray(res.data)) {
        setDbTeachers(res.data);
      }
    } catch (err) {}
  };

  // Get dynamic registered/logged-in teachers from localStorage
  let savedProfiles = [];
  try {
    const saved = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
    savedProfiles = saved.filter((u) => u.role === 'teacher');
  } catch (e) {}

  // If current logged-in user is a teacher, include them at the top
  const activeUserTeacher = user?.role === 'teacher' ? [
    {
      id: user.id || 'curr_teacher',
      name: user.name || 'Active Teacher',
      role: 'Faculty Educator & Mentor',
      qualification: 'M.Ed. Academic Pedagogy',
      department: 'Academic Faculty',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      subjects: ['Academic Leadership', 'Curriculum Lead'],
      isLoggedIn: true,
    }
  ] : [];

  const schoolTeachers = [
    {
      id: 't_sunil',
      name: 'Sunil Sir',
      role: 'Senior Faculty & Academic Director',
      qualification: 'M.Sc. Mathematics & Pedagogy',
      department: 'Mathematics & Administration',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      subjects: ['Advanced Mathematics', 'Algebra & Geometry'],
      isLoggedIn: false,
    },
    {
      id: 't_ranjeet',
      name: 'Ranjeet Sir',
      role: 'Senior Physics Teacher',
      qualification: 'M.Sc. Physics (Gold Medalist)',
      department: 'Science & Innovation',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      subjects: ['Quantum Physics', 'Thermodynamics'],
      isLoggedIn: false,
    },
    {
      id: 't_priya',
      name: 'Priya Ma\'am',
      role: 'Head of Chemistry Department',
      qualification: 'Ph.D. Organic Chemistry',
      department: 'Chemistry',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      subjects: ['Organic Chemistry', 'Chemical Dynamics'],
      isLoggedIn: false,
    },
    {
      id: 't_vikas',
      name: 'Vikas Sir',
      role: 'Computer Science & AI Lead',
      qualification: 'M.Tech Computer Science & AI',
      department: 'Technology',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      subjects: ['Python Programming', 'AI & Machine Learning'],
      isLoggedIn: false,
    },
    {
      id: 't_neha',
      name: 'Neha Ma\'am',
      role: 'English Literature & Humanities Lead',
      qualification: 'M.A. English Literature',
      department: 'Humanities',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      subjects: ['English Grammar', 'World Literature'],
      isLoggedIn: false,
    },
    {
      id: 't_amit',
      name: 'Amit Sir',
      role: 'Senior Mathematics Instructor',
      qualification: 'M.Sc. Applied Mathematics',
      department: 'Mathematics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      subjects: ['AP Calculus', 'Trigonometry'],
      isLoggedIn: false,
    },
    {
      id: 't_rajesh',
      name: 'Rajesh Sir',
      role: 'Biology & Life Sciences Chair',
      qualification: 'M.Sc. Biotechnology',
      department: 'Biology',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      subjects: ['Genetics', 'Botany & Zoology'],
      isLoggedIn: false,
    },
    {
      id: 't_anita',
      name: 'Anita Ma\'am',
      role: 'History & Social Sciences Head',
      qualification: 'M.A. Modern History',
      department: 'Social Sciences',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      subjects: ['World History', 'Civics & Political Science'],
      isLoggedIn: false,
    },
  ];

  // Combine active logged in user, saved local profiles, DB fetched teachers, and curated school teachers
  const allTeachers = [
    ...activeUserTeacher,
    ...savedProfiles.map((rt) => ({
      id: rt.id || rt.email,
      name: rt.name,
      role: 'Registered Faculty Member',
      qualification: 'M.Sc. Certified Educator',
      department: 'Academic Faculty',
      avatar: rt.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      subjects: ['Subject Specialist'],
      isLoggedIn: user?.email === rt.email,
    })),
    ...dbTeachers.map((dbt) => ({
      id: dbt._id || dbt.id,
      name: dbt.name,
      role: dbt.designation || 'Faculty Teacher',
      qualification: dbt.qualification || 'Certified Faculty',
      department: dbt.department || 'Academic Department',
      avatar: dbt.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      subjects: dbt.subjects || ['Curriculum Teacher'],
      isLoggedIn: user?.email === dbt.email,
    })),
    ...schoolTeachers,
  ].filter((t, index, self) => self.findIndex((x) => x.name?.toLowerCase() === t.name?.toLowerCase()) === index);

  return (
    <section id="teachers" className="py-24 bg-slate-950 dark:bg-slate-950 light:bg-white border-t border-slate-900 dark:border-slate-900 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="default">REGISTERED FACULTY TEACHERS</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 dark:text-white light:text-slate-900 tracking-tight">
            Active School Teachers & Faculty Members
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base">
            Live profiles of teachers who have registered and logged into Shimla International Public School.
          </p>
        </div>

        {allTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allTeachers.map((t, idx) => (
              <Card key={idx} className={`p-5 text-center group relative overflow-hidden transition-all ${t.isLoggedIn ? 'border-2 border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-500/10' : ''}`}>
                {t.isLoggedIn && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
                    <UserCheck className="w-3 h-3" /> Logged In
                  </div>
                )}
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-base font-bold text-slate-100 dark:text-white light:text-slate-900">
                  {t.name}
                </h3>
                <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                  {t.role}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t.qualification}
                </p>
                <div className="flex flex-wrap gap-1 justify-center mt-3 pt-3 border-t border-slate-800/80">
                  {t.subjects?.map((sub, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                      {sub}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Teacher Logged In Yet</h3>
            <p className="text-xs text-slate-400">
              When a teacher registers or logs in with their credentials, their profile card will automatically appear here!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
