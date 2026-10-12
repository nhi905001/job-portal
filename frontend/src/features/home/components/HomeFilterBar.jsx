import React from 'react';
import { Filter, X } from 'lucide-react';

export default function HomeFilterBar({
  selectedIndustry,
  selectedJobType,
  sortOption,
  industries,
  jobTypes,
  onIndustryChange,
  onJobTypeChange,
  onSortChange,
  onReset,
}) {
  const hasFilter = selectedIndustry || selectedJobType || sortOption !== 'createdAt_desc';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />

        {/* Ngành nghề */}
        <select
          value={selectedIndustry}
          onChange={(e) => onIndustryChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="">Tất cả ngành nghề</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name}
            </option>
          ))}
        </select>

        {/* Loại hình */}
        <select
          value={selectedJobType}
          onChange={(e) => onJobTypeChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="">Tất cả loại hình</option>
          {jobTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Sắp xếp */}
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="createdAt_desc">Mới nhất trước</option>
          <option value="createdAt_asc">Cũ nhất trước</option>
          <option value="salaryMax_desc">Lương cao nhất</option>
        </select>
      </div>

      {hasFilter && (
        <button
          type="button"
          onClick={onReset}
          className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
        >
          <X className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      )}
    </div>
  );
}
