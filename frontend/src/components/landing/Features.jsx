import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const Features = () => {
  const [filter, setFilter] = useState('all');

  const featuresList = [
    {
      id: 1,
      category: 'admin',
      title: 'Role-Based Access Control (RBAC)',
      description: 'Strict, fine-grained access permissions for Super Admins, Teachers, Students, and Parents backed by JWT tokens and bcrypt encryption.',
      icon: ShieldCheck,
      color: 'text-indigo-400',
    },
    {
      id: 2,
      category: 'academic',
      title: 'Automated Grading & Gradebooks',
      description: 'Instant calculation of GPAs, weighted test scores, report card generation, and real-time grade publishing for students.',
      icon: Award,
      color: 'text-emerald-400',
    },
    {
      id: 3,
      category: 'attendance',
      title: 'Real-Time Digital Attendance',
      description: 'One-click daily classroom attendance marking with automated absence alert notifications sent straight to parent portals.',
      icon: Calendar,
      color: 'text-purple-400',
    },
    {
      id: 4,
      category: 'finance',
      title: 'Fee Management & Invoicing',
      description: 'Automate tuition collection, fee breakdowns, invoice history, payment status tracking, and automated overdue reminders.',
      icon: DollarSign,
      color: 'text-amber-400',
    },
    {
      id: 5,
      category: 'analytics',
      title: 'AI Academic Analytics',
      description: 'Visual performance metrics (Recharts) identifying student learning trends, attendance drop-offs, and class averages.',
      icon: TrendingUp,
      color: 'text-sky-400',
    },
    {
      id: 6,
      category: 'communication',
      title: 'Parent-Teacher Communication',
      description: 'Direct messaging channels, digital notice boards, event schedules, and emergency alert dispatches.',
      icon: MessageSquare,
      color: 'text-pink-400',
    },
  ];

  const filteredFeatures =
    filter === 'all'
      ? featuresList
      : featuresList.filter((f) => f.category === filter);

  return (
    <section id="features" className="py-24 bg-slate-950 dark:bg-slate-950 light:bg-white border-t border-slate-900 dark:border-slate-900 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="purple">PLATFORM CAPABILITIES</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 dark:text-white light:text-slate-900 tracking-tight">
            Engineered For Modern Educational Institutions
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base">
            Replace fragmented spreadsheets and legacy software with a single unified, secure cloud environment.
          </p>
        </div>

        {/* Feature Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8 mb-12">
          {['all', 'admin', 'academic', 'attendance', 'finance', 'analytics'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 dark:bg-slate-900 dark:text-slate-400 light:bg-slate-100 light:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => {
            const IconComp = feat.icon;
            return (
              <Card key={feat.id} className="group relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComp className={`w-6 h-6 ${feat.color}`} />
                </div>
                <CardTitle className="mb-2 text-base font-bold">
                  {feat.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {feat.description}
                </CardDescription>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
