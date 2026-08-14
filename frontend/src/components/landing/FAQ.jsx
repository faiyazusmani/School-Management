import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What roles are supported in EduManage Pro?',
      a: 'EduManage Pro provides out-of-the-box role-based portals for 4 distinct user types: Super Admin, Teacher, Student, and Parent. Each role comes with custom dashboard metrics and fine-grained authorization.',
    },
    {
      q: 'How does authentication & security work?',
      a: 'All authentication uses industry-standard JSON Web Tokens (JWT) paired with bcrypt password hashing, HTTP authorization headers, and protected client/server middleware.',
    },
    {
      q: 'Can teachers record daily attendance and grade assignments?',
      a: 'Yes! The Teacher portal features single-click attendance entry, weighted grade calculations, assignment posting, and automatic parent notification alerts.',
    },
    {
      q: 'How do parents stay updated on tuition fees and child performance?',
      a: 'Parents get dedicated portal access to switch between enrolled siblings, monitor attendance percentage, review report cards, and check tuition payment invoice status.',
    },
    {
      q: 'Is dark mode supported across the platform?',
      a: 'Yes, EduManage Pro features a persistent Dark / Light mode toggle powered by custom CSS design tokens that smoothly transition all landing sections and dashboards.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border-t border-slate-900 dark:border-slate-900 light:border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge variant="default">FREQUENTLY ASKED QUESTIONS</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 dark:text-white light:text-slate-900 tracking-tight">
            Everything You Need To Know
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base">
            Have questions about implementation, security, or roles? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={idx}
                className="p-5 cursor-pointer border-slate-800/80 transition-all"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-slate-100 dark:text-white light:text-slate-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
