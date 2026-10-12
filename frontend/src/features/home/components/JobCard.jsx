import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import Card from '../../../components/common/Card';

export default function JobCard({ job }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (num) =>
      new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num) + ' đ';
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  return (
    <Card className="shadow-none border-slate-200 p-5 flex flex-col justify-between hover:border-slate-400 transition-colors group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {job.jobType?.name || 'Toàn thời gian'}
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-950 transition-colors line-clamp-1">
          <Link to={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{job.company?.name || 'Doanh nghiệp'}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{job.location?.city || 'Toàn quốc'}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">
          Hạn nộp: {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="font-medium text-slate-900 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1"
        >
          <span>Chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
