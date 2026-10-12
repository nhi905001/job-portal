import React from 'react';
import { Gift, Loader2 } from 'lucide-react';
import OfferStatusBadge from './OfferStatusBadge';
import { formatDate, formatSalary } from '../../../utils/formatters';

export default function OfferTable({ offers, isLoading }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5">Ứng viên nhận Offer</th>
            <th className="px-5 py-3.5">Vị trí ứng tuyển</th>
            <th className="px-5 py-3.5">Mức lương đề xuất</th>
            <th className="px-5 py-3.5">Ngày nhận việc</th>
            <th className="px-5 py-3.5">Hạn phản hồi</th>
            <th className="px-5 py-3.5">Trạng thái Offer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách Offers...</span>
              </td>
            </tr>
          ) : offers.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Gift className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Chưa có Offer nào được gửi</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bấm nút "Tạo & Gửi Offer mới" để gửi lời mời nhận việc cho ứng viên sau phỏng vấn.
                </p>
              </td>
            </tr>
          ) : (
            offers.map((offer) => {
              const candidate = offer.application?.user;
              const job = offer.application?.jobListing;

              return (
                <tr key={offer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900 block">
                      {candidate?.fullName || 'Ứng viên'}
                    </span>
                    <span className="text-slate-500 text-[11px]">{candidate?.email}</span>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-800">
                    {job?.title || 'Vị trí công việc'}
                  </td>

                  <td className="px-5 py-4 font-semibold text-emerald-700">
                    {formatSalary(offer.salary)}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(offer.startDate)}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {formatDate(offer.expiryDate)}
                  </td>

                  <td className="px-5 py-4">
                    <OfferStatusBadge status={offer.status} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
