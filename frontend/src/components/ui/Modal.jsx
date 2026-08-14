import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 truncate pr-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal window"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="pt-3 sm:pt-4 overflow-y-auto min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
};
