import React from 'react';

const STATUS_MAP = {
  APPLIED: {
    label: 'Đã nộp đơn',
    className: 'bg-amber-600 text-white border-amber-600',
  },
  SHORTLISTED: {
    label: 'Đã vào Shortlist',
    className: 'bg-sky-600 text-white border-sky-600',
  },
  INTERVIEWING: {
    label: 'Đang phỏng vấn',
    className: 'bg-purple-600 text-white border-purple-600',
  },
  OFFERED: {
    label: 'Đã nhận Offer',
    className: 'bg-emerald-600 text-white border-emerald-600',
  },
  REJECTED: {
    label: 'Không phù hợp',
    className: 'bg-rose-600 text-white border-rose-600',
  },
};

export default function ApplicationStatusBadge({ status }) {
  const meta = STATUS_MAP[status] || {
    label: status || 'Không rõ',
    className: 'bg-slate-600 text-white border-slate-600',
  };

  return (
    <span className={`px-3 py-0.5 rounded-none font-normal text-[11px] border inline-block ${meta.className}`}>
      {meta.label}
    </span>
  );
}
