import React from 'react';
import { Building2, MapPin, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import Pagination from '../../../components/common/Pagination';

export default function LocationTable({
  locations,
  companies,
  isLoading,
  selectedCompanyId,
  keyword,
  page,
  totalPages,
  totalElements,
  onCompanyFilterChange,
  onKeywordChange,
  onSearchSubmit,
  onPageChange,
  onOpenEdit,
  onDelete,
}) {
  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedCompanyId}
            onChange={(e) => onCompanyFilterChange(e.target.value)}
            className="w-full sm:w-60 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-800 cursor-pointer"
          >
            <option value="">Tất cả doanh nghiệp</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm thành phố hoặc địa chỉ..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={onSearchSubmit}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-left text-xs bg-white">
            <thead className="bg-white border-b border-slate-200 text-black font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5 text-black font-bold">Doanh nghiệp trực thuộc</th>
                <th className="px-5 py-3.5 text-black font-bold">Thành phố / Tỉnh</th>
                <th className="px-5 py-3.5 text-black font-bold">Địa chỉ chi tiết</th>
                <th className="px-5 py-3.5 text-right text-black font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-900">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-700 mx-auto mb-2" />
                    <span>Đang tải danh sách địa điểm...</span>
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-xs text-slate-800">Chưa có địa điểm nào</p>
                    <p className="text-[11px] mt-0.5">Nhấn "Thêm địa điểm chi nhánh" để bắt đầu tạo.</p>
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span>{loc.company?.name || 'Doanh nghiệp'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-xs text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                        {loc.city}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{loc.address}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEdit(loc)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(loc)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-slate-100">
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={10} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}
