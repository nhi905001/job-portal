import React from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import JobCard from './JobCard';

export default function JobListGrid({ jobs = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Đang tìm kiếm cơ hội việc làm...</p>
        <p className="text-xs text-slate-400 mt-1">Hệ thống đang tải dữ liệu danh sách việc làm mới nhất.</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-slate-200/90 rounded-2xl p-8 max-w-xl mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
          <Briefcase className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Không tìm thấy việc làm phù hợp</h3>
        <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
          Hãy thử tìm kiếm với từ khóa khác, chọn "Anywhere" hoặc bỏ bớt các tiêu chí lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-3.5">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
