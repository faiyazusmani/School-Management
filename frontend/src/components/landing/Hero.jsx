import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Zap, Award, CheckCircle2, Play, Users, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export const Hero = () => {
  const [activeTab, setActiveTab] = useState('super_admin');
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const rolePreviews = {
    super_admin: {
      title: 'Super Admin Control Center',
      stats: [
        { label: 'Total Students', value: '1,450' },
        { label: 'Faculty Staff', value: '98' },
        { label: 'Monthly Revenue', value: '$128,400' },
        { label: 'System Health', value: '99.98%' },
      ],
      description: 'Complete centralized command over multi-branch school operations, finances, faculty roles, and compliance reporting.',
    },
    teacher: {
      title: 'Teacher Academic Dashboard',
      stats: [
        { label: 'Assigned Classes', value: '4' },
        { label: 'Students Taught', value: '142' },
        { label: 'Pending Grades', value: '18' },
        { label: 'Avg Class Score', value: '91.2%' },
      ],
      description: 'Streamlined grading rubrics, automated digital attendance, lesson plan sharing, and real-time student progress tracking.',
    },
    student: {
      title: 'Student Learning Hub',
      stats: [
        { label: 'Cumulative GPA', value: '3.88' },
        { label: 'Attendance Rate', value: '96.2%' },
        { label: 'Credits Earned', value: '24' },
        { label: 'Assignments Due', value: '3' },
      ],
      description: 'Interactive class timetable, assignment submissions, digital gradebooks, exam schedules, and direct teacher query portal.',
    },
    parent: {
      title: 'Parent Observer Portal',
      stats: [
        { label: 'Enrolled Children', value: '2' },
        { label: 'Tuition Fee Status', value: 'Clear' },
        { label: 'Avg Attendance', value: '97.4%' },
        { label: 'Teacher Notices', value: '2 Unread' },
      ],
      description: 'Full transparency into child performance, daily attendance logs, instant fee statements, and direct teacher messaging.',
    },
  };

  const handleLaunchRole = (role) => {
    switchDemoRole(role);
    navigate('/dashboard');
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-slate-950 dark:bg-slate-950 light:bg-slate-50">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300">
              Next-Gen School SaaS v2.5 Released
            </span>
            <Badge variant="success" className="text-[10px]">PRODUCTION READY</Badge>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-100 dark:text-white light:text-slate-900">
            Empower Your School With{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligent Management
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-normal">
            EduManage Pro unifies Super Admins, Teachers, Students, and Parents into a seamless, high-performance web platform with automated grading, real-time attendance, and role-based intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => handleLaunchRole('super_admin')}
              className="shadow-indigo-600/30 hover:scale-105 transition-transform"
            >
              Explore Super Admin Demo <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <a href="#features">
              <Button size="lg" variant="outline">
                View Features
              </Button>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Role-Based Access (RBAC)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>JWT + bcrypt Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dark & Light Themes</span>
            </div>
          </div>
        </div>

        {/* Interactive Dashboard SaaS Preview Frame */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          {/* Role Tabs */}
          <div className="flex justify-center mb-4 gap-2 overflow-x-auto p-1 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-xl mx-auto">
            {Object.keys(rolePreviews).map((r) => (
              <button
                key={r}
                onClick={() => setActiveTab(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === r
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Mock Glassmorphism Interface Frame */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl glow-purple dark:bg-slate-900/90 light:bg-white light:border-slate-200">
            {/* Top Bar Mock Controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 light:border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-500">
                  https://app.edumanagepro.com/dashboard/{activeTab}
                </span>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 dark:text-white light:text-slate-900">
                    {rolePreviews[activeTab].title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {rolePreviews[activeTab].description}
                  </p>
                </div>
                <Badge variant="purple">LIVE INTERACTIVE PREVIEW</Badge>
              </div>

              {/* Stats Grid Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {rolePreviews[activeTab].stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 dark:bg-slate-950/80 light:bg-slate-50 light:border-slate-200"
                  >
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {st.label}
                    </span>
                    <span className="text-xl font-extrabold text-indigo-400 mt-1 block">
                      {st.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
