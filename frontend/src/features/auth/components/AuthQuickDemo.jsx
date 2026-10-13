import React from 'react';

const DEMO_ACCOUNTS = [
  { label: 'Ứng viên', email: 'seeker@gmail.com', pass: 'Seeker@123' },
  { label: 'Nhà tuyển dụng', email: 'recruiter@fpt.com', pass: 'Recruiter@123' },
  { label: 'Quản trị viên', email: 'admin@jobportal.com', pass: 'Admin@123' },
];

export default function AuthQuickDemo({ onFill }) {
  return (
    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
      <span className="shrink-0 text-[11px] font-medium text-slate-400">Tài khoản mẫu:</span>
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        {DEMO_ACCOUNTS.map((acc) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => onFill(acc.email, acc.pass)}
            className="px-2 py-1 text-[11px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80"
            title={`Nạp tự động: ${acc.email}`}
          >
            {acc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
