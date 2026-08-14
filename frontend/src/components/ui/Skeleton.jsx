import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-800/60 dark:bg-slate-800/80 light:bg-slate-200 ${className}`}
      {...props}
    />
  );
};
