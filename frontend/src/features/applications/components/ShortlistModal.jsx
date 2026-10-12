import React from 'react';
import { X, CheckSquare } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function ShortlistModal({
  isOpen,
  app,
  note,
  isSubmitting,
  onClose,
  onNoteChange,
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
              <h3 className="text-base font-bold text-slate-900">Đưa Vào Danh Sách Shortlist</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ứng viên: {app?.user?.fullName}</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Ghi chú đánh giá sơ bộ <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Nhận xét ngắn về hồ sơ ứng viên..."
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
                leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
              >
                Xác nhận Shortlist
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
