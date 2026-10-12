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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Mức lương:</span>
          <span className="font-bold text-emerald-700 text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Địa điểm làm việc:</span>
          <span className="font-semibold text-slate-800">{job.companyLocation?.city || 'Toàn quốc'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Hạn nộp hồ sơ:</span>
          <span className="font-semibold text-slate-800">{formatDate(job.deadline)}</span>
        </div>
      </div>

      {/* Responsibilities */}
      {job.responsibilities && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mô tả công việc</h2>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {job.responsibilities}
          </p>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && (
        <div className="space-y-2 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Yêu cầu ứng viên</h2>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {job.requirements}
          </p>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && (
        <div className="space-y-2 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quyền lợi & Đãi ngộ</h2>
          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {job.benefits}
          </p>
        </div>
      )}
    </Card>
  );
}
