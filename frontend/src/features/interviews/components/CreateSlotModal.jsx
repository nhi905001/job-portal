import React from 'react';
import { X, Calendar } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export default function CreateSlotModal({
  isOpen,
  jobOptions,
  formData,
  isSubmitting,
  onClose,
  onChange,
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
              <h3 className="text-base font-bold text-slate-900">Tạo Khung Giờ Phỏng Vấn Mới</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mở lịch phỏng vấn để ứng viên tự chọn</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Vị trí tuyển dụng <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.jobListingId}
                onChange={(e) => onChange('jobListingId', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-900"
              >
                <option value="">Chọn vị trí...</option>
                {jobOptions.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                label="Giờ bắt đầu"
                required
                value={formData.startTime}
                onChange={(e) => onChange('startTime', e.target.value)}
              />

              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                label="Giờ kết thúc"
                required
                value={formData.endTime}
                onChange={(e) => onChange('endTime', e.target.value)}
              />
            </div>

            <Input
              id="meetingLink"
              name="meetingLink"
              type="url"
              label="Đường link họp (Google Meet / Zoom)"
              placeholder="https://meet.google.com/..."
              value={formData.meetingLink}
              onChange={(e) => onChange('meetingLink', e.target.value)}
            />

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Calendar className="w-3.5 h-3.5" />}
              >
                Tạo khung giờ
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
