import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/30 dark:bg-slate-900/40 light:bg-slate-50/50 my-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 ring-1 ring-indigo-500/20">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
