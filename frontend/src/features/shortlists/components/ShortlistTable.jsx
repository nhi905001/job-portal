import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, FileText, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import fileService from '../../../services/fileService';
import { formatDate } from '../../../utils/formatters';
import { useAuth } from '../../../context/AuthContext';

export default function ShortlistTable({ shortlists, isLoading, onDeleteClick }) {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'RECRUITER';
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left text-xs bg-white">
        <thead className="bg-white border-b border-slate-200 text-black font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5 text-black font-bold">Ứng viên</th>
            <th className="px-5 py-3.5 text-black font-bold">Vị trí ứng tuyển</th>
            <th className="px-5 py-3.5 text-black font-bold">Ghi chú tuyển dụng</th>
            <th className="px-5 py-3.5 text-black font-bold">CV đính kèm</th>
            <th className="px-5 py-3.5 text-black font-bold">Ngày đưa vào</th>
            <th className="px-5 py-3.5 text-right text-black font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-900">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách Shortlist...</span>
              </td>
            </tr>
          ) : shortlists.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <CheckSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Chưa có ứng viên nào trong Shortlist</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Vào mục "Đơn ứng tuyển" và bấm nút Shortlist để thêm ứng viên phù hợp vào đây.
                </p>
              </td>
            </tr>
          ) : (
            shortlists.map((item) => {
              const app = item.jobApplication || item.application;
              const candidate = app?.candidate || app?.user;
              const job = app?.jobListing;

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900 block">
                      {candidate?.fullName || 'Ứng viên'}
                    </span>
                    <span className="text-slate-500 text-[11px]">{candidate?.email}</span>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-800">
                    <Link
                      to={`/jobs/${job?.id}`}
                      target="_blank"
                      className="hover:underline hover:text-slate-950 transition-colors font-semibold block"
                    >
                      {job?.title || 'Vị trí công việc'}
                    </Link>
                    {job?.company?.name && (
                      <span className="text-slate-500 text-[11px] block">{job.company.name}</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-600 max-w-xs">
                    <p className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs line-clamp-2">
                      {item.note || 'Không có ghi chú'}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {app?.resumeUrl || app?.cvUrl ? (
                      <a
                        href={fileService.getFullFileUrl(app.resumeUrl || app.cvUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Mở CV</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Không có CV</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {isRecruiter ? (
                      <button
                        type="button"
                        onClick={() => onDeleteClick(item)}
                        className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1"
                        title="Xóa khỏi Shortlist"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Chỉ xem</span>
                    )}
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
