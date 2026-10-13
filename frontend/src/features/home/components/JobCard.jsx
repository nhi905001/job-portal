import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import fileService from '../../../services/fileService';

export default function JobCard({ job }) {
  const [logoError, setLogoError] = useState(false);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (num) => {
      if (num >= 1000000) {
        const val = num / 1000000;
        return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + ' tr';
      }
      return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
    };
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Mới đăng';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Hôm nay';
    if (days === 1) return '1 ngày trước';
    if (days < 30) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getCompanyBg = (name = '') => {
    const charCode = name.charCodeAt(0) || 0;
    const variants = [
      'bg-amber-100 text-amber-900 border-amber-200/80',
      'bg-indigo-100 text-indigo-900 border-indigo-200/80',
      'bg-purple-100 text-purple-900 border-purple-200/80',
      'bg-emerald-100 text-emerald-900 border-emerald-200/80',
      'bg-sky-100 text-sky-900 border-sky-200/80',
    ];
    return variants[charCode % variants.length];
  };

  const companyName = job.company?.name || 'Doanh nghiệp';
  const locationCity = job.location?.city || job.companyLocation?.city || 'Toàn quốc';
  const jobTypeName = job.jobType?.name || 'Toàn thời gian';
  const industryName = job.industry?.name || 'Công nghệ';
  const hasLogo = Boolean(job.company?.logoUrl && !logoError);

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="relative group bg-white rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-0.5 block text-left"
    >
      {/* Left + Middle Content */}
      <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
        {/* Company Logo Square Box: 56px (w-14 h-14) to 64px (sm:w-16 sm:h-16) */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-extrabold text-lg sm:text-xl shrink-0 border overflow-hidden transition-transform group-hover:scale-105 shadow-2xs ${
            hasLogo
              ? 'bg-white border-slate-200/80 p-1.5'
              : getCompanyBg(companyName)
          }`}
        >
          {hasLogo ? (
            <img
              src={fileService.getFullFileUrl(job.company.logoUrl)}
              alt={companyName}
              className="w-full h-full object-contain rounded-xl"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span>{companyName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* Job Details */}
        <div className="min-w-0">
          {/* Title Row + Badge Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-700 transition-colors leading-tight truncate">
              {job.title}
            </h3>

            {/* Tags (Remote / JobType / Industry) */}
            <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {jobTypeName}
            </span>

            {industryName && (
              <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70">
                {industryName}
              </span>
            )}
          </div>

          {/* Company Name & Location line */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
            <span className="text-slate-700 font-semibold truncate">{companyName}</span>
            <span className="text-slate-300">—</span>
            <span className="text-slate-500 truncate">{locationCity}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Salary & Date */}
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
        <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
          {formatSalary(job.salaryMin, job.salaryMax)}
        </div>
        <div className="text-xs text-slate-400 font-medium mt-0.5">
          {formatTimeAgo(job.createdAt)}
        </div>
      </div>
    </Link>
  );
}
