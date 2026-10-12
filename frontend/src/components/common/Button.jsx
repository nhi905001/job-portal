import React from 'react';

const VARIANTS = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border-slate-900',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border-slate-200',
  outline: 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border-slate-300',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border-transparent',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border-rose-600',
  accent: 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 border-amber-500 font-medium',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-5 py-3 text-base rounded-lg',
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-normal transition-colors border focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const widthClass = isFullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>Đang xử lý...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </span>
      )}
    </button>
  );
}
