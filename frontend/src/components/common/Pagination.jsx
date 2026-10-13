import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Component Phân Trang chuẩn Spring Data (0-based page index)
 * @param {number} page - Trang hiện tại (bắt đầu từ 0)
 * @param {number} totalPages - Tổng số trang
 * @param {number} totalElements - Tổng số bản ghi
 * @param {number} size - Số phần tử trên 1 trang
 * @param {Function} onPageChange - Callback khi đổi trang (newPage: 0-indexed)
 */
export default function Pagination({
  page = 0,
  totalPages = 1,
  totalElements = 0,
  size = 10,
  onPageChange,
}) {
  if (totalPages <= 1 && totalElements <= size) return null;

  const currentPage = page + 1; // Hiển thị cho người dùng 1-indexed

  // Tạo dải số trang cần hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const startRecord = totalElements === 0 ? 0 : page * size + 1;
  const endRecord = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 text-xs text-[#786F62]">
      {/* Thông tin số lượng */}
      <div>
        Hiển thị <span className="font-semibold text-[#1E1E1E]">{startRecord}</span> -{' '}
        <span className="font-semibold text-[#1E1E1E]">{endRecord}</span> trên tổng số{' '}
        <span className="font-semibold text-[#1E1E1E]">{totalElements}</span> kết quả
      </div>

      {/* Các nút điều hướng */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Trang đầu"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p - 1)}
                className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs border border-amber-300'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Trang cuối"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
