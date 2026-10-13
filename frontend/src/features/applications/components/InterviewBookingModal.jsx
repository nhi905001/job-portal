import React from 'react';
import { X, Calendar, Clock, Video, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function InterviewBookingModal({
  isOpen,
  onClose,
  selectedApp,
  slots,
  isLoadingSlots,
  isBookingSlot,
  onBookSlot,
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
              <h3 className="text-base font-bold text-slate-900">Chọn Khung Giờ Phỏng Vấn</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vị trí: {selectedApp?.jobListing?.title}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoadingSlots ? (
            <div className="py-10 text-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
              <span className="text-xs">Đang tìm các khung giờ trống...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">Hiện chưa có khung giờ phỏng vấn khả dụng</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Nhà tuyển dụng sẽ sớm cập nhật thêm lịch mới. Vui lòng quay lại sau!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(slot.startTime).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(slot.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(slot.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isBookingSlot}
                    onClick={() => onBookSlot(slot.id)}
                  >
                    Chọn lịch này
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
