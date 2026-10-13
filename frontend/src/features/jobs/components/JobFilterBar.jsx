import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function JobFilterBar({
  keyword,
  statusFilter,
  industryFilter = '',
  jobTypeFilter = '',
  companyFilter = '',
  industries = [],
  jobTypes = [],
  companies = [],
  isAdmin = false,
  totalElements = 0,
  onKeywordChange,
  onStatusChange,
  onIndustryChange,
  onJobTypeChange,
  onCompanyChange,
  onSearchSubmit,
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <form onSubmit={onSearchSubmit} className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Tìm theo tiêu đề tin tuyển dụng..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Company Filter (Admin Only) */}
        {isAdmin && companies.length > 0 && (
          <div className="relative">
            <select
              value={companyFilter}
              onChange={(e) => onCompanyChange?.(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white cursor-pointer font-medium"
            >
              <option value="">Tất cả doanh nghiệp</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Industry Filter */}
        {industries.length > 0 && (
          <div className="relative">
            <select
              value={industryFilter}
              onChange={(e) => onIndustryChange?.(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white cursor-pointer font-medium"
            >
              <option value="">Tất cả ngành nghề</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* JobType Filter */}
        {jobTypes.length > 0 && (
          <div className="relative">
            <select
              value={jobTypeFilter}
              onChange={(e) => onJobTypeChange?.(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white cursor-pointer font-medium"
            >
              <option value="">Tất cả hình thức</option>
              {jobTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer font-medium"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">🟢 Đang tuyển (OPEN)</option>
            <option value="DRAFT">🟡 Bản nháp (DRAFT)</option>
            <option value="CLOSED">⚪ Đã đóng (CLOSED)</option>
          </select>
        </div>

        <Button type="submit" variant="primary" size="sm" className="font-bold">
          Lọc
        </Button>

        {onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-500 hover:text-slate-800"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Đặt lại
          </Button>
        )}
      </form>

      {/* Counter */}
      <div className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
        <span>
          Đang hiển thị tổng cộng:{' '}
          <strong className="text-amber-600 font-extrabold text-sm ml-0.5">
            {totalElements}
          </strong>{' '}
          tin tuyển dụng
        </span>
      </div>
    </div>
  );
}
