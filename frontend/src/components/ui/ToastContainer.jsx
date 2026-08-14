import React, { useEffect, useState } from 'react';
import { subscribeToast } from './toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToast((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        removeToast(newToast.id);
      }, 4000);
    });
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30 bg-slate-900/90 text-slate-100 dark:bg-slate-900/95 dark:text-slate-100 light:bg-white light:text-slate-900',
          error: 'border-rose-500/30 bg-slate-900/90 text-slate-100 dark:bg-slate-900/95 dark:text-slate-100 light:bg-white light:text-slate-900',
          info: 'border-indigo-500/30 bg-slate-900/90 text-slate-100 dark:bg-slate-900/95 dark:text-slate-100 light:bg-white light:text-slate-900',
          warning: 'border-amber-500/30 bg-slate-900/90 text-slate-100 dark:bg-slate-900/95 dark:text-slate-100 light:bg-white light:text-slate-900',
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${borders[t.type]}`}
          >
            <div className="flex items-center gap-3">
              {icons[t.type]}
              <span className="text-sm font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
