import React from 'react';
import Card from '../../../components/common/Card';
import { formatDate } from '../../../utils/formatters';

export default function JobDetailContent({ job }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (num) => new Intl.NumberFormat('vi-VN').format(num) + ' đ';
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  return (
    <Card className="shadow-none border-slate-200 p-6 sm:p-8 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-slate-50/80 border border-slate-100 rounded-2xl text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Mức lương:</span>
          <span className="font-bold text-emerald-700 text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Địa điểm làm việc:</span>
          <span className="font-semibold text-slate-800">
            {job.location?.city
              ? `${job.location.city}${job.location.address ? ` (${job.location.address})` : ''}`
              : (job.companyLocation?.city || 'Toàn quốc')}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Ngày đăng & Hạn nộp:</span>
          <span className="font-semibold text-slate-800">
            {formatDate(job.deadline)}
          </span>
          {job.createdAt && (
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Đăng ngày: {formatDate(job.createdAt)}
            </span>
          )}
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Ngành & Hình thức:</span>
          <span className="font-semibold text-slate-800 block">
            {job.jobType?.name || 'Toàn thời gian'}
          </span>
          <span className="text-[11px] text-slate-500 block">
            {job.industry?.name || 'Chung'}
          </span>
        </div>
      </div>

      {/* Recruiter / Poster Info if available */}
      {job.recruiter?.fullName && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50/60 border border-amber-200/50 rounded-xl text-xs text-amber-900">
          <span className="font-semibold">Phụ trách tuyển dụng:</span>
          <span>{job.recruiter.fullName} ({job.recruiter.email})</span>
        </div>
      )}

      {/* Responsibilities */}
      {job.responsibilities && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mô tả công việc (Responsibilities)</h2>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {job.responsibilities}
          </p>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && (
        <div className="space-y-2 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Yêu cầu ứng viên (Requirements)</h2>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {job.requirements}
          </p>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && (
        <div className="space-y-2 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quyền lợi & Đãi ngộ (Benefits)</h2>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {job.benefits}
          </p>
        </div>
      )}
    </Card>
  );
}
