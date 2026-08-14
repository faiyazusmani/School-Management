import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 focus:ring-indigo-500 border border-indigo-500/30',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 dark:bg-slate-800 dark:hover:bg-slate-700 light:bg-slate-100 light:hover:bg-slate-200 light:text-slate-900 light:border-slate-300',
    outline:
      'border border-slate-700 hover:bg-slate-800/60 text-slate-200 dark:border-slate-700 dark:text-slate-200 light:border-slate-300 light:text-slate-700 light:hover:bg-slate-100',
    ghost:
      'hover:bg-slate-800/50 text-slate-300 hover:text-white dark:hover:bg-slate-800/60 light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-900',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 focus:ring-rose-500',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
