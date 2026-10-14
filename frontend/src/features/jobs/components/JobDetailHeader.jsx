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
  const companyName = company?.name || 'Doanh nghiệp';

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-card">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Job Board</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <JobStatusBadge status={job.status} />
          {job.jobType && (
            <span className="text-[11px] font-normal px-3 py-0.5 rounded-none bg-indigo-600 text-white border border-indigo-600">
              {job.jobType.name}
            </span>
          )}
          {job.industry && (
            <span className="text-[11px] font-normal px-3 py-0.5 rounded-none bg-amber-600 text-white border border-amber-600">
              {job.industry.name}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>{companyName}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>
              {job.location?.city
                ? `${job.location.city}${job.location.address ? ` — ${job.location.address}` : ''}`
                : (job.companyLocation?.city || 'Toàn quốc')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        {hasApplied ? (
          <div className="px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã nộp đơn ứng tuyển</span>
          </div>
        ) : job.status === 'OPEN' ? (
          <Button variant="primary" size="lg" onClick={onOpenApply} className="px-7 py-3.5 font-bold shadow-xs hover:shadow">
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
