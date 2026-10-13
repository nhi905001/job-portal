import React, { useState } from 'react';

export default function Input({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  endAdornment,
  allowTogglePassword = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password' || (allowTogglePassword && type === 'password');
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 mb-1.5 select-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border rounded-lg placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-900 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
              : 'border-slate-300 hover:border-slate-400 focus:border-slate-900'
          } ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''} ${
            isPasswordField || endAdornment ? 'pr-12' : ''
          }`}
          {...props}
        />

        {allowTogglePassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-normal text-slate-500 hover:text-slate-800 focus:outline-none select-none px-1 py-0.5"
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        )}

        {!allowTogglePassword && endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {endAdornment}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-normal pl-0.5">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 pl-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
