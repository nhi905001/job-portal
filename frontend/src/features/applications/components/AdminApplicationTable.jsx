import React from 'react';
import { FileText, Eye, CheckSquare, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import fileService from '../../../services/fileService';
import { formatDate } from '../../../utils/formatters';

export default function AdminApplicationTable({
  applications,
  isLoading,
  onViewProfile,
  onShortlist,
  onReject,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5">Ứng viên nộp đơn</th>
            <th className="px-5 py-3.5">Vị trí ứng tuyển</th>
            <th className="px-5 py-3.5">Hồ sơ CV</th>
            <th className="px-5 py-3.5">Ngày nộp</th>
            <th className="px-5 py-3.5">Trạng thái</th>
            <th className="px-5 py-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách đơn ứng tuyển...</span>
              </td>
            </tr>
          ) : applications.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Không tìm thấy đơn ứng tuyển nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Thử chọn tin tuyển dụng khác hoặc kiểm tra lại bộ lọc.</p>
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-900 block">{app.user?.fullName || 'Ứng viên'}</span>
                  <span className="text-slate-500 text-[11px]">{app.user?.email}</span>
                </td>

                <td className="px-5 py-4 font-medium text-slate-800">
                  {app.jobListing?.title || 'Vị trí'}
                </td>

                <td className="px-5 py-4">
                  {app.cvUrl ? (
                    <a
                      href={fileService.getFullFileUrl(app.cvUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Xem CV</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Không đính kèm</span>
                  )}
                </td>

                <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                  {formatDate(app.createdAt)}
                </td>

                <td className="px-5 py-4">
                  <ApplicationStatusBadge status={app.status} />
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewProfile(app)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="Xem hồ sơ chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {app.status === 'APPLIED' && (
                      <button
                        type="button"
                        onClick={() => onShortlist(app)}
                        className="px-2 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 inline-flex items-center gap-1 font-medium"
                        title="Đưa vào Shortlist"
                      >
                        <CheckSquare className="w-3 h-3 text-emerald-600" />
                        <span>Shortlist</span>
                      </button>
                    )}
                    {app.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => onReject(app)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg border border-rose-200"
                        title="Từ chối đơn"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
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
