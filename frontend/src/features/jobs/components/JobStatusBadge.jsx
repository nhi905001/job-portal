import React from 'react';

const STATUS_STYLES = {
  OPEN: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
  DRAFT: 'bg-amber-50 text-amber-800 border-amber-200/80',
};

const STATUS_LABELS = {
  OPEN: 'Đang tuyển (OPEN)',
  CLOSED: 'Đã đóng (CLOSED)',
  DRAFT: 'Bản nháp (DRAFT)',
};

export default function JobStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border inline-block ${style}`}>
      {label}
    </span>
  );
}
