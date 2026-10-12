import React from 'react';
import { X, Upload, FileText, Send, Loader2 } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function JobApplyModal({
  isOpen,
  jobTitle,
  cvUrl,
  coverLetter,
  isUploadingCV,
  isSubmitting,
  onClose,
  onCVUpload,
  onCoverLetterChange,
  onSubmit,
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
            <div>
              <h3 className="text-base font-bold text-slate-900">Ứng Tuyển Vị Trí</h3>
              <p className="text-xs text-slate-500 mt-0.5">{jobTitle}</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* File CV */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Hồ sơ CV ứng tuyển <span className="text-rose-500">*</span>
              </label>

              {cvUrl ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{cvUrl.split('/').pop()}</span>
                  </div>
                  <label
                    htmlFor="reupload-cv"
                    className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    Đổi file
                    <input id="reupload-cv" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onCVUpload} />
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="apply-cv"
                  className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-slate-50/50"
                >
                  {isUploadingCV ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-800 mb-2" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  )}
                  <span className="text-xs font-medium text-slate-700">Tải lên tệp CV (PDF/DOCX, tối đa 10MB)</span>
                  <input id="apply-cv" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onCVUpload} disabled={isUploadingCV} />
                </label>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Thư ngỏ / Giới thiệu bản thân (Cover letter)
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => onCoverLetterChange(e.target.value)}
                placeholder="Tại sao bạn phù hợp với vị trí này..."
                className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Nộp hồ sơ ngay
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
