import React from 'react';
import { Calendar, Clock, Video, Star, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';

export default function InterviewSlotTable({
  slots,
  isLoading,
  onFeedbackClick,
  onDeleteClick,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
          <tr>
            <th className="px-5 py-3.5">Vị trí tuyển dụng</th>
            <th className="px-5 py-3.5">Thời gian phỏng vấn</th>
            <th className="px-5 py-3.5">Link phòng họp (Online)</th>
            <th className="px-5 py-3.5">Ứng viên đã đặt</th>
            <th className="px-5 py-3.5">Trạng thái khung giờ</th>
            <th className="px-5 py-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-slate-800 mx-auto mb-2" />
                <span>Đang tải danh sách khung giờ phỏng vấn...</span>
              </td>
            </tr>
          ) : slots.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-slate-800">Chưa có khung giờ phỏng vấn nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Bấm nút "Tạo khung giờ mới" để mở lịch cho ứng viên.</p>
              </td>
            </tr>
          ) : (
            slots.map((slot) => {
              const bookedApp = slot.application;
              const candidate = bookedApp?.user;
              const isBooked = !!bookedApp;

              return (
                <tr key={slot.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {slot.jobListing?.title || 'Vị trí công việc'}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-800 block">
                      {formatDate(slot.startTime)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(slot.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(slot.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {slot.meetingLink ? (
                      <a
                        href={slot.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                      >
                        <Video className="w-3.5 h-3.5 text-slate-500" />
                        <span>Vào phòng</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Trực tiếp / Chưa có</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {candidate ? (
                      <div>
                        <span className="font-semibold text-slate-900 block">{candidate.fullName}</span>
                        <span className="text-slate-500 text-[11px]">{candidate.email}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Chưa có ứng viên</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border inline-block ${
                        isBooked
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {isBooked ? 'Đã được đặt' : 'Đang còn trống'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isBooked && (
                        <button
                          type="button"
                          onClick={() => onFeedbackClick(slot)}
                          className="px-2 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 inline-flex items-center gap-1 font-medium"
                          title="Đánh giá sau phỏng vấn"
                        >
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>Đánh giá</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteClick(slot)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg border border-rose-200"
                        title="Xóa khung giờ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
