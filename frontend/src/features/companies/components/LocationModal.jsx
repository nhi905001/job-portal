import React from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

export default function LocationModal({
  isOpen,
  isEditing,
  isSaving,
  companies,
  companyId,
  city,
  address,
  onClose,
  onCompanyIdChange,
  onCityChange,
  onAddressChange,
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
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{isEditing ? 'Chỉnh Sửa Địa Điểm' : 'Thêm Địa Điểm Chi Nhánh'}</h3>
                <p className="text-[11px] text-slate-500">Địa chỉ văn phòng làm việc của doanh nghiệp</p>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={isSaving} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Doanh nghiệp <span className="text-rose-500">*</span>
              </label>
              <select
                value={companyId}
                onChange={(e) => onCompanyIdChange(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800 cursor-pointer"
              >
                <option value="">-- Chọn doanh nghiệp --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Thành phố / Tỉnh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Địa chỉ chi tiết <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tòa nhà FPT Cầu Giấy, Số 10 Phạm Văn Bạch..."
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
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
                {isSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Đang lưu...</span></> : <span>{isEditing ? 'Lưu thay đổi' : 'Thêm địa điểm'}</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
