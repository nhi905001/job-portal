import React from 'react';

export default function ApplicationFilterBar({
  selectedJobId,
  statusFilter,
  jobOptions,
  totalElements,
  onJobFilterChange,
  onStatusFilterChange,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        {/* Lọc theo tin */}
        <select
          value={selectedJobId}
          onChange={(e) => onJobFilterChange(e.target.value)}
          className="w-full sm:w-72 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="">Tất cả tin tuyển dụng</option>
          {jobOptions.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        {/* Lọc theo trạng thái */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="APPLIED">Chờ duyệt (APPLIED)</option>
          <option value="SHORTLISTED">Đã vào Shortlist</option>
          <option value="INTERVIEWING">Đang phỏng vấn</option>
          <option value="OFFERED">Đã gửi Offer</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
      </div>

      <div className="text-xs text-slate-500 self-start sm:self-auto font-normal">
        Tổng số: <span className="font-semibold text-slate-900">{totalElements}</span> đơn ứng tuyển
      </div>
    </div>
  );
}
