import React from 'react';
import { X, Save, Building2, MapPin, Layers, Briefcase, Calendar, DollarSign, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export default function JobFormModal({
  isOpen,
  isEditing,
  formData,
  industries = [],
  jobTypes = [],
  locations = [],
  companies = [],
  user,
  isSaving,
  isLoadingDetail = false,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  const isAdmin = user?.role === 'ADMIN';

  // Filter locations according to selected company
  const effectiveCompanyId = isAdmin ? formData.companyId : user?.company?.id;
  const availableLocations = effectiveCompanyId
    ? locations.filter((loc) => !loc.company?.id || String(loc.company.id) === String(effectiveCompanyId))
    : locations;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {isEditing ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Tạo Tin Tuyển Dụng Mới'}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                  {isEditing ? 'Cập nhật' : 'Đăng tin'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Điền đầy đủ thông tin vị trí tuyển dụng, chính sách lương và yêu cầu năng lực theo đúng chuẩn hệ thống
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoadingDetail ? (
            <div className="py-16 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">Đang tải toàn bộ dữ liệu mô tả tin tuyển dụng...</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Job Title */}
              <Input
                id="title"
                name="title"
                label="Tiêu đề tin tuyển dụng"
                required
                placeholder="VD: Senior React Frontend Developer / Chuyên Viên Backend Java"
                value={formData.title}
                onChange={(e) => onChange('title', e.target.value)}
              />

              {/* Company Selection (Only for ADMIN) */}
              {isAdmin && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Doanh nghiệp tuyển dụng (Company) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.companyId}
                    onChange={(e) => onChange('companyId', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="">-- Chọn doanh nghiệp tuyển dụng --</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    * Quyền Admin: Chọn doanh nghiệp trước để hệ thống lọc các chi nhánh làm việc tương ứng.
                  </p>
                </div>
              )}

              {/* Industry, JobType, Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Industry */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ngành nghề <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.industryId}
                    onChange={(e) => onChange('industryId', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="">Chọn ngành...</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Loại hình làm việc <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.jobTypeId}
                    onChange={(e) => onChange('jobTypeId', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="">Chọn loại hình...</option>
                    {jobTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Địa điểm làm việc <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.locationId}
                    onChange={(e) => onChange('locationId', e.target.value)}
                    disabled={isAdmin && !formData.companyId}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {isAdmin && !formData.companyId ? 'Hãy chọn doanh nghiệp trước' : 'Chọn địa điểm...'}
                    </option>
                    {availableLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city} — {loc.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Salary & Deadline & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  label="Lương tối thiểu (VND)"
                  placeholder="VD: 15000000"
                  value={formData.salaryMin}
                  onChange={(e) => onChange('salaryMin', e.target.value)}
                />

                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  label="Lương tối đa (VND)"
                  placeholder="VD: 30000000"
                  value={formData.salaryMax}
                  onChange={(e) => onChange('salaryMax', e.target.value)}
                />

                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  label="Hạn nộp hồ sơ"
                  required
                  value={formData.deadline}
                  onChange={(e) => onChange('deadline', e.target.value)}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Trạng thái tin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => onChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="OPEN">🟢 Đang tuyển (OPEN)</option>
                    <option value="DRAFT">🟡 Bản nháp (DRAFT)</option>
                    <option value="CLOSED">⚪ Đã đóng (CLOSED)</option>
                  </select>
                </div>
              </div>

              {/* Description Details: Responsibilities & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Trách nhiệm công việc (Responsibilities) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.responsibilities}
                    onChange={(e) => onChange('responsibilities', e.target.value)}
                    placeholder="Mô tả chi tiết các đầu việc chính mà ứng viên sẽ đảm nhận hàng ngày..."
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Yêu cầu ứng viên (Requirements) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => onChange('requirements', e.target.value)}
                    placeholder="Kỹ năng chuyên môn, số năm kinh nghiệm, bằng cấp, tinh thần làm việc..."
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 leading-relaxed"
                  />
                </div>
              </div>

              {/* Benefits (Phúc lợi & Đãi ngộ) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Quyền lợi & Đãi ngộ (Benefits)
                </label>
                <textarea
                  rows={3}
                  value={formData.benefits}
                  onChange={(e) => onChange('benefits', e.target.value)}
                  placeholder="Thưởng tháng 13, bảo hiểm sức khỏe nâng cao, du lịch hằng năm, lộ trình thăng tiến rõ ràng..."
                  className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 leading-relaxed"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-3.5 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                  className="font-bold shadow-xs"
                >
                  {isEditing ? 'Cập nhật tin tuyển dụng' : 'Đăng tin tuyển dụng'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
