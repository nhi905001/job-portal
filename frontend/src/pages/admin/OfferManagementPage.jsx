import React from 'react';
import { Gift } from 'lucide-react';

export default function OfferManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản lý Thư Mời Nhận Việc (Offers)
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Gửi Offer cho ứng viên sau phỏng vấn và theo dõi quyết định chấp nhận hoặc từ chối
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Ứng viên nhận Offer</th>
              <th className="px-5 py-3.5">Vị trí</th>
              <th className="px-5 py-3.5">Mức lương đề xuất</th>
              <th className="px-5 py-3.5">Ngày bắt đầu</th>
              <th className="px-5 py-3.5">Trạng thái Offer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
            <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
              <td className="px-5 py-4 font-semibold text-[#1E1E1E]">
                Nguyễn Văn A
                <span className="text-[#8A8073] font-normal block text-[11px]">seeker@gmail.com</span>
              </td>
              <td className="px-5 py-4">Senior Frontend Developer (React)</td>
              <td className="px-5 py-4 font-semibold text-emerald-800">32.000.000 VND</td>
              <td className="px-5 py-4 text-[#786F62]">01/11/2026</td>
              <td className="px-5 py-4">
                <span className="px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                  PENDING (Chờ phản hồi)
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
