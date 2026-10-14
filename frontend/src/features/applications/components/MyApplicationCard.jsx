import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calendar, Clock, FileText, ExternalLink, Trash2, Video, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import fileService from '../../../services/fileService';
import interviewService from '../../../services/interviewService';
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

  const [bookedSlot, setBookedSlot] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (app.status === 'INTERVIEWING' || app.status === 'OFFERED') {
      interviewService.getSlotByApplication(app.id)
        .then((data) => {
          if (isMounted) setBookedSlot(data);
        })
        .catch(() => {
          // Chưa có slot hoặc lỗi thì bỏ qua
        });
    } else {
      setBookedSlot(null);
    }
    return () => {
      isMounted = false;
    };
  }, [app.id, app.status]);

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

      {/* Gợi ý quy trình khi đơn mới ở trạng thái APPLIED */}
      {app.status === 'APPLIED' && (
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Hồ sơ đang chờ Nhà tuyển dụng xem xét. Khi hồ sơ được duyệt (<strong>Shortlist</strong>), chức năng chọn khung giờ phỏng vấn sẽ mở để bạn đặt lịch.
          </span>
        </div>
      )}

      {/* Thông báo chọn lịch nếu đã SHORTLISTED */}
      {canBookInterview && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-amber-800">
            <span className="font-semibold block text-amber-900">
              Hồ sơ của bạn đã được duyệt vào vòng phỏng vấn!
            </span>
            <span className="text-[11px] text-amber-700">
              Vui lòng chọn khung giờ phỏng vấn phù hợp trong các slot còn trống của nhà tuyển dụng.
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onScheduleClick(app)}
            leftIcon={<Video className="w-3.5 h-3.5" />}
            className="shrink-0"
          >
            Chọn lịch ngay
          </Button>
        </div>
      )}

      {/* Thông tin lịch phỏng vấn đã chốt nếu đang INTERVIEWING / OFFERED */}
      {bookedSlot && (
        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>
                Lịch phỏng vấn: {formatDate(bookedSlot.startTime)} ({new Date(bookedSlot.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(bookedSlot.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-none flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              Đã xác nhận lịch
            </span>
          </div>
          {bookedSlot.meetingLink && (
            <div className="pt-1 flex items-center gap-2">
              <a
                href={bookedSlot.meetingLink.startsWith('http') ? bookedSlot.meetingLink : `https://${bookedSlot.meetingLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors shadow-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Vào phòng phỏng vấn trực tuyến</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          )}
        </div>
      )}

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
      {canWithdraw && (
        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWithdrawClick(app)}
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Rút đơn ứng tuyển
          </Button>
        </div>
      )}
    </Card>
  );
}
