import React, { forwardRef } from 'react';

export const Input = forwardRef(
  ({ label, error, helperText, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full text-sm rounded-xl transition-colors duration-200 outline-none focus:ring-2 focus:ring-indigo-500/80 
              ${
                Icon ? 'pl-10' : 'pl-4'
              } pr-4 py-2.5 bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 
              dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-100 
              light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder-slate-400 
              ${error ? 'border-rose-500 focus:ring-rose-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
