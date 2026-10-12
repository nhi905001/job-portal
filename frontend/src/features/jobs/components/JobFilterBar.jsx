import React from 'react';
import { Search } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function JobFilterBar({
  keyword,
  statusFilter,
  totalElements,
  onKeywordChange,
  onStatusChange,
  onSearchSubmit,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <form onSubmit={onSearchSubmit} className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto flex-1">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Tìm theo tiêu đề tin..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="OPEN">Đang tuyển (OPEN)</option>
          <option value="CLOSED">Đã đóng (CLOSED)</option>
          <option value="DRAFT">Bản nháp (DRAFT)</option>
        </select>

        <Button type="submit" variant="outline" size="sm">
          Tìm kiếm
        </Button>
      </form>

      <div className="text-xs text-slate-500 self-start sm:self-auto font-normal">
        Tổng số: <span className="font-semibold text-slate-900">{totalElements}</span> tin đăng
      </div>
    </div>
  );
}
