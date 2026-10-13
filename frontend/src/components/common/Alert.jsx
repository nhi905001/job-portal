import React from 'react';

const ALERT_STYLES = {
  error: 'bg-rose-50 border-rose-200 text-rose-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
};

export default function Alert({
  type = 'info',
  message,
  children,
  onClose,
  className = '',
}) {
  const content = message || children;
  if (!content) return null;

  const styleClass = ALERT_STYLES[type] || ALERT_STYLES.info;

  return (
    <div
      role="alert"
      className={`p-3.5 border rounded-lg text-xs leading-relaxed flex items-start justify-between gap-3 ${styleClass} ${className}`}
    >
      <div className="flex-1">{content}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity p-0.5"
          aria-label="Đóng thông báo"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
