import React from 'react';
import { Send, DollarSign } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export default function OfferForm({
  interviewingApps,
  isSubmitting,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Chọn đơn ứng tuyển */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Chọn ứng viên nhận Offer <span className="text-rose-500">*</span>
        </label>
        <select
          required
          value={formData.applicationId}
          onChange={(e) => onChange('applicationId', e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        >
          {interviewingApps.map((app) => (
            <option key={app.id} value={app.id}>
              {app.candidate?.fullName || app.user?.fullName || 'Ứng viên'} ({app.candidate?.email || app.user?.email || '—'}) — {app.jobListing?.title}
            </option>
          ))}
        </select>
      </div>

      {/* Mức lương */}
      <Input
        id="salary"
        name="salary"
        type="number"
        min="1000000"
        label="Mức lương khởi điểm (VND / tháng)"
        required
        placeholder="Ví dụ: 25000000"
        value={formData.salary}
        onChange={(e) => onChange('salary', e.target.value)}
        endAdornment={<DollarSign className="w-4 h-4 text-slate-400" />}
      />

      {/* Ngày bắt đầu & Hạn phản hồi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          id="startDate"
          name="startDate"
          type="date"
          label="Ngày bắt đầu làm việc"
          required
          value={formData.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
        />

        <Input
          id="expiryDate"
          name="expiryDate"
          type="date"
          label="Hạn phản hồi Offer"
          value={formData.expiryDate}
          onChange={(e) => onChange('expiryDate', e.target.value)}
        />
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Ghi chú / Lời nhắn ứng viên
        </label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Chào mừng bạn gia nhập công ty!..."
          className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Nút hành động */}
      <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          Gửi Offer
        </Button>
      </div>
    </form>
  );
}
