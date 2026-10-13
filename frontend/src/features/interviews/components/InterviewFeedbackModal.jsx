import React from 'react';
import { X, Star, Send, Loader2 } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function InterviewFeedbackModal({
  isOpen,
  slot,
  existingFeedback,
  feedbackScore,
  feedbackComment,
  isLoadingFeedback,
  isSubmitting,
  onClose,
  onScoreChange,
  onCommentChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Đánh Giá Sau Phỏng Vấn</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ứng viên: {slot?.jobApplication?.candidate?.fullName || slot?.application?.user?.fullName || 'Ứng viên'}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoadingFeedback ? (
            <div className="py-12 text-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
              <span className="text-xs">Đang tải nhận xét trước đó...</span>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Điểm đánh giá ứng viên (Thang điểm 1 - 10) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={feedbackScore}
                    onChange={(e) => onScoreChange(Number(e.target.value))}
                    className="flex-1 cursor-pointer accent-slate-900"
                  />
                  <span className="text-sm font-bold px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-900 min-w-10 text-center">
                    {feedbackScore}/10
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nhận xét & Đánh giá năng lực chuyên môn <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackComment}
                  onChange={(e) => onCommentChange(e.target.value)}
                  placeholder="Ghi nhận điểm mạnh, điểm yếu và mức độ phù hợp với văn hóa..."
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
                  {existingFeedback ? 'Cập nhật đánh giá' : 'Lưu đánh giá'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
