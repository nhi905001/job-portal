import React from 'react';

const STATUS_MAP = {
  APPLIED: {
    label: 'Đã nộp đơn',
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  SHORTLISTED: {
    label: 'Đã vào Shortlist',
    className: 'bg-sky-50 text-sky-800 border-sky-200/80',
  },
  INTERVIEWING: {
    label: 'Đang phỏng vấn',
    className: 'bg-purple-50 text-purple-800 border-purple-200/80',
  },
  OFFERED: {
    label: 'Đã nhận Offer',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  },
  REJECTED: {
    label: 'Không phù hợp',
    className: 'bg-rose-50 text-rose-800 border-rose-200/80',
  },
};

export default function ApplicationStatusBadge({ status }) {
  const meta = STATUS_MAP[status] || {
    label: status || 'Không rõ',
    className: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border inline-block ${meta.className}`}>
      {meta.label}
    </span>
  );
}
