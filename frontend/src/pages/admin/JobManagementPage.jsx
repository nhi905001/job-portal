import React, { useState } from 'react';
import { Briefcase, Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function JobManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản lý Tin Tuyển Dụng
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Đăng mới, chỉnh sửa, theo dõi trạng thái và hạn nộp của các vị trí tuyển dụng
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tin tuyển dụng mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EFE9DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9E9587] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề tin..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="w-full sm:w-auto px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#4A4135] focus:outline-none focus:border-[#F6B779]">
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">Đang tuyển (OPEN)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Tiêu đề tin</th>
                <th className="px-5 py-3.5">Loại việc / Ngành</th>
                <th className="px-5 py-3.5">Mức lương (VND)</th>
                <th className="px-5 py-3.5">Hạn nộp</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A4135]">
              {[
                {
                  id: 1,
                  title: 'Senior Frontend Developer (React)',
                  type: 'Full-time',
                  industry: 'CNTT',
                  salary: '25M - 35M',
                  deadline: '30/11/2026',
                  status: 'OPEN',
                },
                {
                  id: 2,
                  title: 'Chuyên viên Tuyển dụng Doanh nghiệp',
                  type: 'Full-time',
                  industry: 'Nhân sự',
                  salary: '15M - 20M',
                  deadline: '25/11/2026',
                  status: 'OPEN',
                },
              ].map((job) => (
                <tr key={job.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#1E1E1E]">{job.title}</td>
                  <td className="px-5 py-4">
                    <span className="text-[#4A4135]">{job.type}</span> • <span className="text-[#8A8073]">{job.industry}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-emerald-800">{job.salary}</td>
                  <td className="px-5 py-4 text-[#786F62]">{job.deadline}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button type="button" className="p-1 text-[#8A8073] hover:text-[#1E1E1E] transition-colors" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 text-[#8A8073] hover:text-rose-600 transition-colors" title="Xóa tin">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
