import React from 'react';
import { School, GraduationCap, Server, CheckCircle2, Star } from 'lucide-react';

export const Statistics = () => {
  const stats = [
    { label: 'Partner Schools', value: '450+', icon: School, color: 'text-indigo-400' },
    { label: 'Active Students', value: '250,000+', icon: GraduationCap, color: 'text-purple-400' },
    { label: 'System SLA Uptime', value: '99.98%', icon: Server, color: 'text-emerald-400' },
    { label: 'Satisfaction Rating', value: '4.95 / 5.0', icon: Star, color: 'text-amber-400' },
  ];

  return (
    <section id="statistics" className="scroll-mt-24 py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:to-slate-950 light:from-indigo-900 light:to-slate-900 text-white">
      <div id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((st, i) => {
            const IconComp = st.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                  <IconComp className={`w-6 h-6 ${st.color}`} />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
