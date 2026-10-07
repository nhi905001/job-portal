import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let icon = <Info className="w-4 h-4 text-sky-600 shrink-0" />;
          let border = 'border-sky-200/80 bg-white text-sky-900';

          if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
            border = 'border-emerald-200/80 bg-white text-emerald-950';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
            border = 'border-rose-200/80 bg-white text-rose-950';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-lg flex items-start gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 ${border}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 leading-relaxed">{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export default ToastContext;
