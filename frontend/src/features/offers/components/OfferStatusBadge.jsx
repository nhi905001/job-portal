import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ phản hồi',
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
    icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
  },
  ACCEPTED: {
    label: 'Đã chấp nhận',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
  },
  REJECTED: {
    label: 'Đã từ chối',
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
  },
  EXPIRED: {
    label: 'Đã hết hạn',
    className: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
  },
};

export default function OfferStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Không rõ',
    className: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: null,
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border inline-flex items-center gap-1.5 ${config.className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
