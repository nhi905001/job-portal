import React from 'react';
import { MessageSquare, User, Building2, Trash2, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import { formatDate } from '../../../utils/formatters';

export default function ReviewTable({ reviews, companies = [], isLoading, onDeleteClick }) {
  const companyMap = React.useMemo(() => {
    return Object.fromEntries(companies.map((c) => [c.id, c.name]));
  }, [companies]);

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left text-xs bg-white">
        <thead className="bg-white border-b border-slate-200 text-black font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5 text-black font-bold">Người đánh giá</th>
            <th className="px-5 py-3.5 text-black font-bold">Doanh nghiệp</th>
            <th className="px-5 py-3.5 text-black font-bold">Đánh giá</th>
            <th className="px-5 py-3.5 text-black font-bold">Nội dung nhận xét</th>
            <th className="px-5 py-3.5 text-black font-bold">Ngày đăng</th>
            <th className="px-5 py-3.5 text-right text-black font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-900">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách đánh giá...</span>
              </td>
            </tr>
          ) : reviews.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Không tìm thấy đánh giá nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Thử chọn doanh nghiệp khác hoặc kiểm tra lại bộ lọc.</p>
              </td>
            </tr>
          ) : (
            reviews.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{r.reviewerName || r.user?.fullName || 'Ứng viên'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{r.user?.email || 'Ứng viên ẩn danh'}</span>
                </td>

                <td className="px-5 py-4 font-semibold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{companyMap[r.companyId] || r.company?.name || `Công ty #${r.companyId}`}</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <StarRating rating={r.rating} />
                </td>

                <td className="px-5 py-4 max-w-md">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {r.comment || <span className="italic text-slate-400">Không có lời nhận xét</span>}
                  </p>
                </td>

                <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                  {formatDate(r.createdAt)}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDeleteClick(r)}
                    className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1"
                    title="Xóa đánh giá vi phạm"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
