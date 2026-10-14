import React from 'react';
import { Building2, Search, Edit, Trash2, Globe, ExternalLink, Loader2 } from 'lucide-react';
import fileService from '../../../services/fileService';
import Pagination from '../../../components/common/Pagination';

export default function CompanyTable({
  companies,
  isLoading,
  keyword,
  page,
  totalPages,
  totalElements,
  onKeywordChange,
  onSearchSubmit,
  onPageChange,
  onOpenEdit,
  onDelete,
  onViewLocations,
}) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
        <form onSubmit={onSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên công ty..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-left text-xs bg-white">
            <thead className="bg-white border-b border-slate-200 text-black font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5 text-black font-bold">Logo</th>
                <th className="px-5 py-3.5 text-black font-bold">Doanh nghiệp</th>
                <th className="px-5 py-3.5 text-black font-bold">Website chính thức</th>
                <th className="px-5 py-3.5 text-black font-bold">Giới thiệu vắn tắt</th>
                <th className="px-5 py-3.5 text-right text-black font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-900">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-700 mx-auto mb-2" />
                    <span>Đang tải danh sách doanh nghiệp...</span>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-xs text-slate-800">Chưa có doanh nghiệp nào</p>
                    <p className="text-[11px] mt-0.5">Nhấn "Thêm doanh nghiệp mới" để bắt đầu thiết lập.</p>
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {c.logoUrl ? (
                          <img
                            src={fileService.getFullFileUrl(c.logoUrl)}
                            alt={c.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-sm text-slate-900 block">{c.name}</span>
                      <span className="text-[11px] text-slate-400">Mã: #{c.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      {c.website ? (
                        <a
                          href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-slate-900 hover:underline font-medium"
                        >
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.website}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-xs truncate">{c.description || 'Chưa có mô tả'}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewLocations(c)}
                          className="px-2.5 py-1 text-[11px] text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                          Chi nhánh
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEdit(c)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(c)}
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
