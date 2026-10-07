import React from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';

export default function CategoryManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
          Quản Lý Ngành Nghề & Loại Công Việc
        </h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Cấu hình danh mục ngành nghề (Industries) và hình thức làm việc (Job Types)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industries */}
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3">
            <h2 className="text-sm font-bold text-[#1E1E1E]">Danh mục Ngành nghề (Industries)</h2>
            <button type="button" className="text-xs font-semibold text-[#8C4A08] hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Thêm ngành
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {['Công nghệ thông tin', 'Tài chính - Ngân hàng', 'Marketing / Truyền thông', 'Nhân sự'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4D9]">
                <span className="font-medium text-[#1E1E1E]">{name}</span>
                <button type="button" className="text-[#8A8073] hover:text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Job Types */}
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3">
            <h2 className="text-sm font-bold text-[#1E1E1E]">Loại hình Công việc (Job Types)</h2>
            <button type="button" className="text-xs font-semibold text-[#8C4A08] hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Thêm loại
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {['Toàn thời gian (Full-time)', 'Bán thời gian (Part-time)', 'Làm việc từ xa (Remote)', 'Thực tập sinh (Internship)'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4D9]">
                <span className="font-medium text-[#1E1E1E]">{name}</span>
                <button type="button" className="text-[#8A8073] hover:text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
