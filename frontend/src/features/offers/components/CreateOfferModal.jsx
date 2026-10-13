import React from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../../components/common/Button';
import OfferForm from './OfferForm';

export default function CreateOfferModal({
  isOpen,
  onClose,
  interviewingApps,
  isLoadingApps,
  isSubmitting,
  formData,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tạo Thư Mời Nhận Việc (Offer)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Gửi đề xuất mức lương và thời gian làm việc</p>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          {isLoadingApps ? (
            <div className="py-10 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-slate-800 mb-2" />
              <span className="text-xs">Đang tìm ứng viên đủ điều kiện nhận Offer...</span>
            </div>
          ) : interviewingApps.length === 0 ? (
            <div className="py-8 px-4 text-center text-slate-600 bg-slate-50 rounded-xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Chưa có ứng viên đủ điều kiện nhận Offer
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                Theo quy trình hệ thống, ứng viên cần được Shortlist hoặc đang tham gia Phỏng vấn mới có thể nhận Offer.
              </p>
              <Button variant="outline" size="sm" onClick={onClose} className="mt-4">
                Đóng lại
              </Button>
            </div>
          ) : (
            <OfferForm
              interviewingApps={interviewingApps}
              isSubmitting={isSubmitting}
              formData={formData}
              onChange={onChange}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
