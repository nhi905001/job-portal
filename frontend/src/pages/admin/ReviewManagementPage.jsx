import React from 'react';
import { MessageSquare, Star, Trash2 } from 'lucide-react';

export default function ReviewManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
          Kiểm Duyệt Đánh Giá Công Ty (Reviews)
        </h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Xem xét và xóa các đánh giá có nội dung vi phạm tiêu chuẩn cộng đồng hoặc không phù hợp
        </p>
      </div>

      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Người đánh giá</th>
              <th className="px-5 py-3.5">Công ty</th>
              <th className="px-5 py-3.5">Số sao</th>
              <th className="px-5 py-3.5">Nội dung nhận xét</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
            <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
              <td className="px-5 py-4 font-semibold text-[#1E1E1E]">Ẩn danh Ứng viên</td>
              <td className="px-5 py-4 font-medium text-[#1E1E1E]">FPT Software</td>
              <td className="px-5 py-4 text-[#F6B779] font-bold">5 / 5 ★</td>
              <td className="px-5 py-4 text-[#786F62] max-w-sm truncate">
                Môi trường làm việc năng động, đồng nghiệp thân thiện và hỗ trợ nhiệt tình.
              </td>
              <td className="px-5 py-4 text-right">
                <button type="button" className="text-rose-600 hover:text-rose-800 font-medium transition-colors">
                  Xóa đánh giá
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
