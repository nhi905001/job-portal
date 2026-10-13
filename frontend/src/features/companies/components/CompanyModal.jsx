import React from 'react';
import { Building2, Upload, Loader2, X } from 'lucide-react';
import fileService from '../../../services/fileService';

export default function CompanyModal({
  isOpen,
  isEditing,
  isSaving,
  name,
  website,
  description,
  logoUrl,
  isUploadingLogo,
  onClose,
  onNameChange,
  onWebsiteChange,
  onDescriptionChange,
  onUploadLogo,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => !isSaving && onClose()} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{isEditing ? 'Chỉnh Sửa Doanh Nghiệp' : 'Thêm Doanh Nghiệp Mới'}</h3>
                <p className="text-[11px] text-slate-500">Thông tin hồ sơ công ty và nhận diện thương hiệu</p>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={isSaving} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Logo doanh nghiệp</label>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {logoUrl ? (
                    <img src={fileService.getFullFileUrl(logoUrl)} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                    {isUploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploadingLogo ? 'Đang tải lên...' : 'Tải ảnh logo lên'}</span>
                    <input type="file" accept="image/*" onChange={onUploadLogo} disabled={isUploadingLogo} className="hidden" />
                  </label>
                  <p className="text-[11px] text-slate-400">Định dạng JPG, PNG hoặc WEBP (tối đa 5MB)</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tên doanh nghiệp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={150}
                placeholder="Ví dụ: FPT Software, Viettel Telecom..."
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Website chính thức</label>
              <input
                type="text"
                placeholder="https://fptsoftware.com"
                value={website}
                onChange={(e) => onWebsiteChange(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mô tả giới thiệu công ty</label>
              <textarea
                rows={3}
                placeholder="Giới thiệu tầm nhìn, quy mô doanh nghiệp..."
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Đang lưu...</span></> : <span>{isEditing ? 'Lưu thay đổi' : 'Thêm doanh nghiệp'}</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
