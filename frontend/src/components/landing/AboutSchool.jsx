import React from 'react';
import { Target, Compass, Award, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AboutSchool = () => {
  const values = [
    { title: 'Academic Excellence', desc: 'Fostering intellectual curiosity and high standards across all STEM and humanities disciplines.', icon: Target },
    { title: 'Digital Innovation', desc: 'Equipping educators and students with state-of-the-art technological tools.', icon: Compass },
    { title: 'Uncompromising Integrity', desc: 'Upholding strict data privacy, role authorization, and ethical governance.', icon: Shield },
    { title: 'Community & Empathy', desc: 'Bridging parents, teachers, and students through continuous transparent dialogue.', icon: HeartHandshake },
  ];

  return (
    <section id="about" className="py-24 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border-t border-slate-900 dark:border-slate-900 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Text */}
          <div className="space-y-6">
            <Badge variant="success">ABOUT SCHOLARHUB ACADEMY</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 dark:text-white light:text-slate-900 tracking-tight leading-tight">
              Shaping Tomorrow's Leaders Through Technology & Excellence
            </h2>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base leading-relaxed">
              Founded with the commitment to elevate educational standards, EduManage Pro serves as the foundational operating system for world-class academies. We connect over 450+ partner schools with digital tools that simplify administrative complexity.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Fully Accredited Global Curriculum Support',
                'ISO 27001 Certified Student Data Protection',
                '24/7 Priority Support for School Administrators',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Core Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <Card key={i} className="p-6 border-slate-800/80 bg-slate-900/80">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 dark:text-white light:text-slate-900 mb-1">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
