import React from 'react';
import { Filter } from 'lucide-react';

export default function ReviewFilterBar({
  companies,
  selectedCompanyId,
  selectedRating,
  totalElements,
  onCompanyChange,
  onRatingChange,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />

        {/* Lọc theo doanh nghiệp */}
        <select
          value={selectedCompanyId}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="">Tất cả doanh nghiệp</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Lọc theo số sao */}
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="">Tất cả mức sao</option>
          <option value="5">5 sao (Tuyệt vời)</option>
          <option value="4">4 sao (Tốt)</option>
          <option value="3">3 sao (Bình thường)</option>
          <option value="2">2 sao (Kém)</option>
          <option value="1">1 sao (Rất tệ)</option>
        </select>
      </div>

      <div className="text-xs text-slate-500 self-start sm:self-auto font-normal">
        Tổng số: <span className="font-semibold text-slate-900">{totalElements}</span> đánh giá
      </div>
    </div>
  );
}
