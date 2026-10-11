import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function ShortlistManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
          Danh Sách Shortlist (Ứng Viên Rút Gọn)
        </h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Các ứng viên đã vượt qua vòng lọc hồ sơ ban đầu và sẵn sàng bước vào vòng phỏng vấn
        </p>
      </div>

      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Ứng viên</th>
              <th className="px-5 py-3.5">Vị trí</th>
              <th className="px-5 py-3.5">Ghi chú tuyển dụng</th>
              <th className="px-5 py-3.5">Ngày đưa vào</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
            <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
              <td className="px-5 py-4 font-semibold text-[#1E1E1E]">
                Trần Thị B
                <span className="text-[#8A8073] font-normal block text-[11px]">tranb@gmail.com</span>
              </td>
              <td className="px-5 py-4">Senior Frontend Developer (React)</td>
              <td className="px-5 py-4 text-[#786F62]">CV tốt, kinh nghiệm 4 năm React & Next.js</td>
              <td className="px-5 py-4 text-[#8A8073]">08/10/2026</td>
              <td className="px-5 py-4 text-right">
                <button type="button" className="text-rose-600 hover:text-rose-800 font-medium transition-colors">
                  Xóa khỏi Shortlist
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
