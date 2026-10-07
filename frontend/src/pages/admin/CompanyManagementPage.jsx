import React from 'react';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';

export default function CompanyManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản Lý Công Ty & Địa Điểm
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Thiết lập danh bạ doanh nghiệp, logo, thông tin website và địa điểm chi nhánh
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm doanh nghiệp mới</span>
        </button>
      </div>

      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">Doanh nghiệp</th>
              <th className="px-5 py-3.5">Website</th>
              <th className="px-5 py-3.5">Chi nhánh / Địa điểm</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
            {[
              { id: 1, name: 'FPT Software', website: 'https://fptsoftware.com', locations: 'Hà Nội, TP.HCM, Đà Nẵng' },
              { id: 2, name: 'Viettel Telecom', website: 'https://viettel.vn', locations: 'Hà Nội, TP.HCM' },
            ].map((c) => (
              <tr key={c.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-[#1E1E1E]">{c.name}</td>
                <td className="px-5 py-4">
                  <a href={c.website} target="_blank" rel="noreferrer" className="text-[#8C4A08] hover:underline">
                    {c.website}
                  </a>
                </td>
                <td className="px-5 py-4 text-[#786F62]">{c.locations}</td>
                <td className="px-5 py-4 text-right space-x-2">
                  <button type="button" className="p-1 text-[#8A8073] hover:text-[#1E1E1E] transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1 text-[#8A8073] hover:text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
