import React from 'react';
import { X, User, Phone, Mail, FileText, ExternalLink, Loader2 } from 'lucide-react';
import fileService from '../../../services/fileService';

export default function CandidateProfileModal({
  isOpen,
  app,
  profile,
  isLoading,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-900">Chi Tiết Hồ Sơ Ứng Viên</h3>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
              <span className="text-xs">Đang tải thông tin hồ sơ...</span>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 pb-3 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {profile?.avatarUrl ? (
                    <img
                      src={fileService.getFullFileUrl(profile.avatarUrl)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{app?.user?.fullName}</h4>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app?.user?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Tóm tắt bản thân:</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed italic">
                  {profile?.summary || 'Chưa cập nhật giới thiệu bản thân.'}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Thư ứng tuyển (Cover Letter):</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                  {app?.coverLetter || 'Không có thư ứng tuyển kèm theo.'}
                </p>
              </div>

              {app?.cvUrl && (
                <div className="pt-2">
                  <a
                    href={fileService.getFullFileUrl(app.cvUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Mở tệp CV đính kèm</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
