import React from 'react';

export const Card = ({ children, className = '', hover = true, glass = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-300 
        ${glass ? 'glass-panel' : 'bg-slate-900/80 border-slate-800/80 dark:bg-slate-900/90 dark:border-slate-800 light:bg-white light:border-slate-200/80 light:shadow-sm'} 
        ${hover ? 'hover:border-slate-700/80 hover:shadow-xl dark:hover:border-slate-700 light:hover:shadow-md hover:-translate-y-0.5' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 pb-4 border-b border-slate-800/60 dark:border-slate-800 light:border-slate-100 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`pt-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`pt-4 mt-4 border-t border-slate-800/60 dark:border-slate-800 light:border-slate-100 flex items-center justify-between ${className}`}>
    {children}
  </div>
);
