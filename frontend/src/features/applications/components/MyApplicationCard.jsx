import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calendar, FileText, ExternalLink, Trash2, Video } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import fileService from '../../../services/fileService';
import { formatDate } from '../../../utils/formatters';

export default function MyApplicationCard({
  app,
  onWithdrawClick,
  onScheduleClick,
}) {
  const job = app.jobListing;
  const company = job?.company;
  const canWithdraw = app.status === 'APPLIED';
  const canBookInterview = app.status === 'SHORTLISTED';

  return (
    <Card className="shadow-none border-slate-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            Mã đơn #{app.id}
          </span>
          <h2 className="text-base font-bold text-slate-900">
            <Link to={`/jobs/${job?.id}`} className="hover:underline">
              {job?.title || 'Vị trí công việc'}
            </Link>
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-800">{company?.name || 'Doanh nghiệp'}</span>
          </div>
        </div>

        <ApplicationStatusBadge status={app.status} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Ngày nộp đơn:</span>
          <span className="font-medium text-slate-800">{formatDate(app.appliedAt || app.createdAt)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">CV đã đính kèm:</span>
          {app.resumeUrl || app.cvUrl ? (
            <a
              href={fileService.getFullFileUrl(app.resumeUrl || app.cvUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-900 font-semibold hover:underline"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Xem tệp CV</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          ) : (
            <span className="text-slate-400 italic">Không có</span>
          )}
        </div>
      </div>

      {/* Cover Letter */}
      {app.coverLetter && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
          <span className="font-medium text-slate-900 block mb-0.5">Thư giới thiệu:</span>
          <p className="line-clamp-2 italic">{app.coverLetter}</p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
        {canWithdraw && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWithdrawClick(app)}
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Rút đơn ứng tuyển
          </Button>
        )}

        {canBookInterview && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onScheduleClick(app)}
            leftIcon={<Video className="w-3.5 h-3.5" />}
          >
            Chọn lịch phỏng vấn
          </Button>
        )}
      </div>
    </Card>
  );
}
