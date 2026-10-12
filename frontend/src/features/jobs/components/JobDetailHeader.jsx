import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import JobStatusBadge from './JobStatusBadge';

export default function JobDetailHeader({
  job,
  company,
  hasApplied,
  onOpenApply,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách việc làm</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <JobStatusBadge status={job.status} />
          {job.jobType && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {job.jobType.name}
            </span>
          )}
          {job.industry && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {job.industry.name}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{company?.name || 'Doanh nghiệp'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{job.companyLocation?.city || 'Toàn quốc'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        {hasApplied ? (
          <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã nộp đơn ứng tuyển</span>
          </div>
        ) : job.status === 'OPEN' ? (
          <Button variant="primary" size="lg" onClick={onOpenApply} className="px-6 py-3">
            Ứng tuyển ngay
          </Button>
        ) : (
          <Button variant="outline" size="md" disabled className="cursor-not-allowed">
            Tin tuyển dụng đã đóng
          </Button>
        )}
      </div>
    </div>
  );
}
