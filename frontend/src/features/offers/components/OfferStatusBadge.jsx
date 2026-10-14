import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ phản hồi',
    className: 'bg-amber-600 text-white border-amber-600',
    icon: <Clock className="w-3.5 h-3.5 text-white shrink-0" />,
  },
  ACCEPTED: {
    label: 'Đã chấp nhận',
    className: 'bg-emerald-600 text-white border-emerald-600',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />,
  },
  REJECTED: {
    label: 'Đã từ chối',
    className: 'bg-rose-600 text-white border-rose-600',
    icon: <XCircle className="w-3.5 h-3.5 text-white shrink-0" />,
  },
  EXPIRED: {
    label: 'Đã hết hạn',
    className: 'bg-slate-500 text-white border-slate-500',
    icon: <AlertCircle className="w-3.5 h-3.5 text-white shrink-0" />,
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'bg-slate-600 text-white border-slate-600',
    icon: <XCircle className="w-3.5 h-3.5 text-white shrink-0" />,
  },
};

export default function OfferStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Không rõ',
    className: 'bg-slate-600 text-white border-slate-600',
    icon: null,
  };

  return (
    <span
      className={`px-3 py-0.5 rounded-none font-normal text-[11px] border inline-flex items-center gap-1.5 ${config.className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
