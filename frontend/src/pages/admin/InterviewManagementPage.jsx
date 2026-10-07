import React from 'react';
import { Calendar, Plus, Link as LinkIcon } from 'lucide-react';

export default function InterviewManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản lý Lịch Phỏng Vấn & Đánh Giá
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Tạo các khung giờ phỏng vấn (slots), theo dõi lịch ứng viên đã đặt và chấm điểm feedback
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo khung giờ mới</span>
        </button>
      </div>

      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Khung giờ phỏng vấn</th>
              <th className="px-5 py-3.5">Vị trí tuyển dụng</th>
              <th className="px-5 py-3.5">Meeting Link</th>
              <th className="px-5 py-3.5">Ứng viên đặt lịch</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
            <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
              <td className="px-5 py-4 font-semibold text-[#1E1E1E]">
                15:00 - 16:00
                <span className="text-[#8A8073] font-normal block text-[11px]">20/10/2026</span>
              </td>
              <td className="px-5 py-4">Senior Frontend Developer (React)</td>
              <td className="px-5 py-4">
                <a href="https://meet.google.com/abc-def" target="_blank" rel="noreferrer" className="text-[#8C4A08] hover:underline flex items-center gap-1">
                  <span>Google Meet</span>
                  <LinkIcon className="w-3 h-3" />
                </a>
              </td>
              <td className="px-5 py-4">
                <span className="font-semibold text-[#1E1E1E] block">Nguyễn Văn A</span>
                <span className="text-[11px] text-[#8A8073]">seeker@gmail.com</span>
              </td>
              <td className="px-5 py-4 text-right">
                <button type="button" className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-white text-[#2C241E] border border-[#E8E2D6] rounded-xl font-semibold transition-all">
                  Chấm Feedback
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
