import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, MapPin, Edit, Trash2, Users, Loader2 } from 'lucide-react';
import JobStatusBadge from './JobStatusBadge';
import { formatDate } from '../../../utils/formatters';

export default function JobTable({ jobs, isLoading, onEditClick, onDeleteClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5">Tiêu đề tin tuyển dụng</th>
            <th className="px-5 py-3.5">Ngành & Loại hình</th>
            <th className="px-5 py-3.5">Địa điểm làm việc</th>
            <th className="px-5 py-3.5">Hạn nộp hồ sơ</th>
            <th className="px-5 py-3.5">Trạng thái</th>
            <th className="px-5 py-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách tin tuyển dụng...</span>
              </td>
            </tr>
          ) : jobs.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Không tìm thấy tin tuyển dụng nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Bấm nút "Tạo tin mới" để bắt đầu đăng tin tuyển dụng.</p>
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-900 block">{job.title}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span>{job.company?.name || 'Doanh nghiệp'}</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="font-medium text-slate-800 block">{job.industry?.name || 'Chung'}</span>
                  <span className="text-[11px] text-slate-500">{job.jobType?.name}</span>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{job.companyLocation?.city || 'Toàn quốc'}</span>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                  {formatDate(job.deadline)}
                </td>

                <td className="px-5 py-4">
                  <JobStatusBadge status={job.status} />
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/jobs/${job.id}/applications`}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="Xem đơn ứng tuyển"
                    >
                      <Users className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEditClick(job)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="Chỉnh sửa tin"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClick(job)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg border border-rose-200"
                      title="Xóa tin tuyển dụng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
