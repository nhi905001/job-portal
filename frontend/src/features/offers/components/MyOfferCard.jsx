import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, DollarSign, Calendar, Check, X } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import OfferStatusBadge from './OfferStatusBadge';
import { formatSalary, formatDate } from '../../../utils/formatters';

export default function MyOfferCard({ offer, onRespond }) {
  const job = offer.application?.jobListing;
  const company = job?.company;
  const isPending = offer.status === 'PENDING';

  return (
    <Card className="shadow-none border-slate-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Mã Offer #{offer.id}
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            <Link to={`/jobs/${job?.id}`} className="hover:underline">
              {job?.title || 'Vị trí công việc'}
            </Link>
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-800">{company?.name || 'Doanh nghiệp'}</span>
          </div>
        </div>

        <OfferStatusBadge status={offer.status} />
      </div>

      {/* Offer Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Mức lương chính thức:</span>
          <span className="font-bold text-emerald-700 text-sm">{formatSalary(offer.salary)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Ngày bắt đầu làm việc:</span>
          <span className="font-semibold text-slate-800">{formatDate(offer.startDate)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Hạn chót phản hồi:</span>
          <span className="font-semibold text-slate-800">{formatDate(offer.expiryDate)}</span>
        </div>
      </div>

      {/* Notes */}
      {offer.notes && (
        <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs text-slate-700">
          <span className="font-semibold text-amber-900 block mb-0.5">Lời nhắn từ Nhà tuyển dụng:</span>
          <p className="italic">{offer.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      {isPending && (
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRespond(offer, false)}
            leftIcon={<X className="w-3.5 h-3.5 text-rose-500" />}
          >
            Từ chối Offer
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRespond(offer, true)}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Chấp nhận Offer
          </Button>
        </div>
      )}
    </Card>
  );
}
