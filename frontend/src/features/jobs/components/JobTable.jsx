import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, MapPin, Edit, Trash2, Users, Loader2, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import JobStatusBadge from './JobStatusBadge';
import { formatDate } from '../../../utils/formatters';

export default function JobTable({ jobs = [], isLoading, onEditClick, onDeleteClick }) {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-4">Tiêu đề tin tuyển dụng</th>
            <th className="px-5 py-4">Ngành & Loại hình</th>
            <th className="px-5 py-4">Địa điểm làm việc</th>
            <th className="px-5 py-4">Mức lương</th>
            <th className="px-5 py-4">Ngày đăng & Hạn nộp</th>
            <th className="px-5 py-4">Trạng thái</th>
            <th className="px-5 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                <Loader2 className="w-7 h-7 animate-spin text-amber-500 mx-auto mb-2" />
                <span className="font-medium text-xs">Đang tải danh sách tin tuyển dụng...</span>
              </td>
            </tr>
          ) : jobs.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto mb-2.5">
                  <Briefcase className="w-6 h-6 text-amber-600" />
                </div>
                <p className="font-bold text-xs text-slate-900">Không tìm thấy tin tuyển dụng nào</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Bấm nút "Tạo tin tuyển dụng mới" để bắt đầu đăng tin.</p>
              </td>
            </tr>
          ) : (
            jobs.map((job) => {
              const companyName = job.company?.name || 'Doanh nghiệp';
              const locationCity = job.location?.city || job.companyLocation?.city || 'Toàn quốc';
              const locationAddress = job.location?.address;

              return (
                <tr key={job.id} className="hover:bg-amber-50/20 transition-colors group">
                  {/* Title & Company & Recruiter */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 border shadow-2xs ${getCompanyBg(
                          companyName
                        )}`}
                      >
                        {companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-bold text-slate-900 group-hover:text-amber-800 transition-colors block truncate hover:underline"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-700 truncate">{companyName}</span>
                          {job.recruiter?.fullName && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-400 truncate">Đăng bởi: {job.recruiter.fullName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Industry & JobType */}
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-800 block text-xs">
                      {job.industry?.name || 'Chung'}
                    </span>
                    <span className="inline-block mt-0.5 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {job.jobType?.name || 'Toàn thời gian'}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 text-slate-600 max-w-xs">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-xs text-slate-800 block">{locationCity}</span>
                        {locationAddress && (
                          <span className="text-[11px] text-slate-400 line-clamp-1">{locationAddress}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Salary */}
                  <td className="px-5 py-4">
                    <span className="font-bold text-emerald-700 text-xs whitespace-nowrap block">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </td>

                  {/* Deadline & CreatedAt */}
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">
                    <span className="font-medium text-slate-800 block">
                      Hạn: {formatDate(job.deadline)}
                    </span>
                    {job.createdAt && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Tạo: {formatDate(job.createdAt)}
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4">
                    <JobStatusBadge status={job.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/applications?jobListingId=${job.id}`}
                        className="p-2 text-slate-600 hover:text-amber-900 hover:bg-amber-50 rounded-xl border border-slate-200 hover:border-amber-200 transition-colors"
                        title="Xem hồ sơ ứng viên nộp vào tin này"
                      >
                        <Users className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/jobs/${job.id}`}
                        target="_blank"
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                        title="Xem trang chi tiết công khai"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEditClick(job)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title="Chỉnh sửa tin tuyển dụng"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(job)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl border border-rose-200/80 transition-colors cursor-pointer"
                        title="Xóa tin tuyển dụng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
