import React from 'react';
import { FileText, Search, Eye } from 'lucide-react';

export default function ApplicationManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
          Quản lý Đơn Ứng Tuyển
        </h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Duyệt hồ sơ ứng viên nộp theo từng tin tuyển dụng, đưa vào Shortlist hoặc từ chối đơn
        </p>
      </div>

      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#F4EFE6] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9E9587] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên ứng viên hoặc email..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#4A4135] focus:outline-none focus:border-[#F6B779]">
              <option value="">Tất cả trạng thái</option>
              <option value="APPLIED">APPLIED (Mới nộp)</option>
              <option value="SHORTLISTED">SHORTLISTED (Đã chọn)</option>
              <option value="INTERVIEWING">INTERVIEWING (Đang phỏng vấn)</option>
              <option value="OFFERED">OFFERED (Đã gửi offer)</option>
              <option value="REJECTED">REJECTED (Từ chối)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Ứng viên</th>
                <th className="px-5 py-3.5">Vị trí ứng tuyển</th>
                <th className="px-5 py-3.5">Ngày nộp</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A4135]">
              {[
                {
                  id: 1,
                  candidate: 'Nguyễn Văn A',
                  email: 'seeker@gmail.com',
                  job: 'Senior Frontend Developer (React)',
                  date: '10/10/2026',
                  status: 'APPLIED',
                  statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
                },
                {
                  id: 2,
                  candidate: 'Trần Thị B',
                  email: 'tranb@gmail.com',
                  job: 'Senior Frontend Developer (React)',
                  date: '08/10/2026',
                  status: 'SHORTLISTED',
                  statusColor: 'bg-[#F2ECE1] text-[#4A3E31] border-[#E2DACD]',
                },
              ].map((app) => (
                <tr key={app.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-[#1E1E1E] block">{app.candidate}</span>
                    <span className="text-[#8A8073] text-[11px]">{app.email}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-[#1E1E1E]">{app.job}</td>
                  <td className="px-5 py-4 text-[#786F62]">{app.date}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-1.5">
                    <button type="button" className="px-2.5 py-1 text-[#4A4135] bg-[#FAF7F2] hover:bg-white border border-[#E6E0D6] rounded-xl font-medium transition-colors">
                      Xem CV
                    </button>
                    {app.status === 'APPLIED' && (
                      <button type="button" className="px-2.5 py-1 text-[#2C241E] bg-[#F6B779] hover:bg-[#EEA861] rounded-xl font-semibold transition-all shadow-xs">
                        Shortlist
                      </button>
                    )}
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
