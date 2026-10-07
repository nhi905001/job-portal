import React from 'react';
import { Users, UserPlus } from 'lucide-react';

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản Lý Người Dùng & Phân Quyền
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Tạo tài khoản nhà tuyển dụng (Recruiter), phân quyền và khóa/mở khóa tài khoản người dùng
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tạo tài khoản Recruiter</span>
        </button>
      </div>

      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Họ và tên</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Vai trò (Role)</th>
              <th className="px-5 py-3.5">Doanh nghiệp gắn kèm</th>
              <th className="px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 text-right">Khóa / Mở</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
            {[
              { id: 1, name: 'Quản trị viên', email: 'admin@jobportal.com', role: 'ADMIN', company: '—', active: true },
              { id: 2, name: 'FPT Recruiter', email: 'recruiter@fpt.com', role: 'RECRUITER', company: 'FPT Software', active: true },
              { id: 3, name: 'Ứng viên Tìm việc', email: 'seeker@gmail.com', role: 'JOB_SEEKER', company: '—', active: true },
            ].map((u) => (
              <tr key={u.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-[#1E1E1E]">{u.name}</td>
                <td className="px-5 py-4 text-[#786F62]">{u.email}</td>
                <td className="px-5 py-4">
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D6] text-[#4A3E31]">
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium text-[#1E1E1E]">{u.company}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Hoạt động
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {u.role !== 'ADMIN' && (
                    <button type="button" className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors">
                      Khóa tài khoản
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
