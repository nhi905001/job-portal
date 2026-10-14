import React from 'react';

const STATUS_STYLES = {
  OPEN: 'bg-emerald-600 text-white border-emerald-600',
  CLOSED: 'bg-slate-600 text-white border-slate-600',
  DRAFT: 'bg-amber-600 text-white border-amber-600',
};

const STATUS_LABELS = {
  OPEN: 'Đang tuyển (OPEN)',
  CLOSED: 'Đã đóng (CLOSED)',
  DRAFT: 'Bản nháp (DRAFT)',
};

export default function JobStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-600 text-white border-slate-600';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`px-3 py-0.5 rounded-none font-normal text-[11px] border inline-block ${style}`}>
      {label}
    </span>
  );
}
