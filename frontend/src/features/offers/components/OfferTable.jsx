import React from 'react';
import { Gift, Loader2, Ban } from 'lucide-react';
import OfferStatusBadge from './OfferStatusBadge';
import { formatDate, formatSalary } from '../../../utils/formatters';
import { useAuth } from '../../../context/AuthContext';

export default function OfferTable({ offers, isLoading, onCancelClick }) {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'RECRUITER';

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5">Ứng viên nhận Offer</th>
            <th className="px-5 py-3.5">Vị trí ứng tuyển</th>
            <th className="px-5 py-3.5">Mức lương đề xuất</th>
            <th className="px-5 py-3.5">Ngày nhận việc</th>
            <th className="px-5 py-3.5">Ngày gửi Offer</th>
            <th className="px-5 py-3.5">Trạng thái Offer</th>
            <th className="px-5 py-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách Offers...</span>
              </td>
            </tr>
          ) : offers.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                <Gift className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Chưa có Offer nào được gửi</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bấm nút "Tạo & Gửi Offer mới" để gửi lời mời nhận việc cho ứng viên sau phỏng vấn.
                </p>
              </td>
            </tr>
          ) : (
            offers.map((offer) => {
              const app = offer.jobApplication || offer.application;
              const candidate = app?.candidate || app?.user;
              const job = app?.jobListing;

              return (
                <tr key={offer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900 block">
                      {candidate?.fullName || 'Ứng viên'}
                    </span>
                    <span className="text-slate-500 text-[11px]">{candidate?.email}</span>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-800">
                    <span className="font-semibold text-slate-900 block">{job?.title || 'Vị trí công việc'}</span>
                    {job?.company?.name && (
                      <span className="text-slate-500 text-[11px] block">{job.company.name}</span>
                    )}
                  </td>

                  <td className="px-5 py-4 font-semibold text-emerald-700">
                    {formatSalary(offer.salary)}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(offer.startDate)}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {formatDate(offer.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <OfferStatusBadge status={offer.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    {isRecruiter ? (
                      offer.status === 'PENDING' ? (
                        <button
                          type="button"
                          onClick={() => onCancelClick(offer)}
                          className="px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Hủy thư mời nhận việc"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Hủy Offer</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">—</span>
                      )
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Chỉ xem</span>
                    )}
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
