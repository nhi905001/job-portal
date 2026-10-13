import React from 'react';
import { X, UserPlus } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export default function CreateUserModal({
  isOpen,
  onClose,
  companies,
  formData,
  isSubmitting,
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
          className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Thêm Người Dùng Mới</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tạo tài khoản nhà tuyển dụng hoặc ứng viên</p>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              id="fullName"
              name="fullName"
              label="Họ và tên"
              required
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Địa chỉ Email"
              required
              placeholder="user@company.com"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mật khẩu khởi tạo"
              required
              allowTogglePassword
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
            />

            {/* Vai trò */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Vai trò (Role) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => onChange('role', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-900"
              >
                <option value="RECRUITER">Nhà tuyển dụng (RECRUITER)</option>
                <option value="JOB_SEEKER">Ứng viên tìm việc (JOB_SEEKER)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
            </div>

            {/* Công ty trực thuộc */}
            {formData.role === 'RECRUITER' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Doanh nghiệp trực thuộc <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.companyId}
                  onChange={(e) => onChange('companyId', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="">Chọn doanh nghiệp...</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                Tạo tài khoản
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
