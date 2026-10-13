import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Check, RotateCcw } from 'lucide-react';

export default function HomeFilterBar({
  selectedIndustry,
  selectedJobType,
  sortOption,
  industries = [],
  jobTypes = [],
  totalElements = 0,
  onIndustryChange,
  onJobTypeChange,
  onSortChange,
  onReset,
}) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const activeCount = (selectedIndustry ? 1 : 0) + (selectedJobType ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Result Counter & Sorting Bar (Exact layout from the reference mockup!) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
        {/* Left: We've found 523 jobs! */}
        <div className="text-slate-600 text-sm font-medium">
          We've found{' '}
          <strong className="text-amber-500 font-extrabold text-base">
            {totalElements}
          </strong>{' '}
          jobs!
        </div>

        {/* Right: Filter toggle button + Sort by Date */}
        <div className="flex items-center gap-3">
          {/* Filter button with count badge */}
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              filterDrawerOpen || activeCount > 0
                ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs'
                : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${filterDrawerOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort By Dropdown: Sort by: Date ▾ */}
          <div className="relative inline-flex items-center bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-slate-400 font-medium mr-1.5 text-xs">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="createdAt_desc">Date (Mới nhất)</option>
              <option value="createdAt_asc">Date (Cũ nhất)</option>
              <option value="salaryMax_desc">Salary (Lương cao nhất)</option>
            </select>
            <div className="pointer-events-none text-slate-400 text-xs -ml-3">▾</div>
          </div>
        </div>
      </div>

      {/* Expandable Advanced Filter Panel */}
      {filterDrawerOpen && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-sm text-slate-900">Bộ lọc chi tiết</span>
            </div>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-slate-500 hover:text-amber-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại tất cả</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ngành nghề */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ngành nghề tuyển dụng
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => onIndustryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">Tất cả ngành nghề</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Loại hình việc làm */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hình thức làm việc
              </label>
              <select
                value={selectedJobType}
                onChange={(e) => onJobTypeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">Tất cả loại hình (Full time, Part time...)</option>
                {jobTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
