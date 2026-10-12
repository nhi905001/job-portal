import React from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import JobCard from './JobCard';

export default function JobListGrid({ jobs, isLoading, totalElements }) {
  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800 mx-auto mb-2" />
        <span className="text-xs">Đang tìm việc làm phù hợp...</span>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900">Không tìm thấy việc làm phù hợp</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Thử tìm kiếm với từ khóa khác hoặc bỏ bớt các bộ lọc đang chọn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Tìm thấy <strong className="text-slate-900">{totalElements}</strong> việc làm đang mở tuyển
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
