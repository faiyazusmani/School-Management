import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 light:bg-indigo-50 light:text-indigo-700 light:border-indigo-200',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 light:bg-amber-50 light:text-amber-700 light:border-amber-200',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20 light:bg-rose-50 light:text-rose-700 light:border-rose-200',
    outline: 'bg-transparent text-slate-400 border-slate-700 light:text-slate-600 light:border-slate-300',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 light:bg-purple-50 light:text-purple-700 light:border-purple-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
