import React from 'react';
import { Users, Building2, Lock, Unlock, Loader2 } from 'lucide-react';
import UserRoleBadge from './UserRoleBadge';

export default function UserTable({ users, isLoading, currentUserId, onToggleActive }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5">Họ và tên</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Vai trò (Role)</th>
            <th className="px-5 py-3.5">Doanh nghiệp trực thuộc</th>
            <th className="px-5 py-3.5">Trạng thái</th>
            <th className="px-5 py-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách người dùng...</span>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Không tìm thấy người dùng nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Thử kiểm tra từ khóa hoặc bộ lọc vai trò.</p>
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const isSelf = currentUserId === u.id;
              return (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {u.fullName} {isSelf && <span className="text-[11px] text-slate-400 font-normal">(Bạn)</span>}
                  </td>

                  <td className="px-5 py-4 text-slate-600">{u.email}</td>

                  <td className="px-5 py-4">
                    <UserRoleBadge role={u.role} />
                  </td>

                  <td className="px-5 py-4">
                    {u.company ? (
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.company.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Không có</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border inline-block ${
                        u.active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {u.active ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      disabled={isSelf}
                      onClick={() => onToggleActive(u)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors inline-flex items-center gap-1.5 ${
                        isSelf
                          ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                          : u.active
                          ? 'text-rose-700 bg-white hover:bg-rose-50 border-rose-200'
                          : 'text-emerald-700 bg-white hover:bg-emerald-50 border-emerald-200'
                      }`}
                      title={isSelf ? 'Không thể tự khóa tài khoản của chính mình' : undefined}
                    >
                      {u.active ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{u.active ? 'Khóa' : 'Kích hoạt'}</span>
                    </button>
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
