import React from 'react';
import { Gift, Building2, Calendar, DollarSign, Check, X } from 'lucide-react';

export default function MyOffersPage() {
  const mockOffers = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer (React)',
      company: 'FPT Software',
      salary: '32.000.000 VND / tháng',
      startDate: '01/11/2026',
      status: 'PENDING',
      statusLabel: 'Chờ phản hồi',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-[#EFE9DF] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">Thư mời nhận việc (Offers)</h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Xem xét các lời mời làm việc chính thức từ nhà tuyển dụng và phản hồi kịp thời
        </p>
      </div>

      <div className="space-y-4">
        {mockOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4EFE6] pb-4 mb-4">
              <div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${offer.statusColor}`}>
                  {offer.statusLabel}
                </span>
                <h3 className="text-lg font-bold text-[#1E1E1E] mt-2">{offer.jobTitle}</h3>
                <p className="text-xs text-[#786F62] flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-[#A89E90]" />
                  <span>{offer.company}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Chấp nhận Offer</span>
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Từ chối</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[#8A8073] block">Mức lương đề xuất:</span>
                  <span className="font-bold text-[#1E1E1E]">{offer.salary}</span>
                </div>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[#8A8073] block">Ngày bắt đầu làm việc:</span>
                  <span className="font-bold text-[#1E1E1E]">{offer.startDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
