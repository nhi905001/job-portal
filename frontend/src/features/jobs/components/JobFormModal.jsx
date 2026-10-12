import React from 'react';
import { X, Save } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export default function JobFormModal({
  isOpen, isEditing, formData, industries, jobTypes, locations, isSaving, onClose, onChange, onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{isEditing ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Tạo Tin Tuyển Dụng Mới'}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Điền thông tin mô tả chi tiết cơ hội việc làm</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <Input
              id="title"
              name="title"
              label="Tiêu đề tin tuyển dụng"
              required
              placeholder="VD: Senior React Frontend Developer"
              value={formData.title}
              onChange={(e) => onChange('title', e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Ngành nghề <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={formData.industryId}
                  onChange={(e) => onChange('industryId', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="">Chọn ngành...</option>
                  {industries.map((ind) => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Loại hình làm việc <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={formData.jobTypeId}
                  onChange={(e) => onChange('jobTypeId', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="">Chọn loại hình...</option>
                  {jobTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Địa điểm làm việc <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={formData.companyLocationId}
                  onChange={(e) => onChange('companyLocationId', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="">Chọn địa điểm...</option>
                  {locations.map((loc) => <option key={loc.id} value={loc.id}>{loc.city} ({loc.address})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input id="salaryMin" name="salaryMin" type="number" label="Lương tối thiểu (VND)" placeholder="15000000" value={formData.salaryMin} onChange={(e) => onChange('salaryMin', e.target.value)} />
              <Input id="salaryMax" name="salaryMax" type="number" label="Lương tối đa (VND)" placeholder="30000000" value={formData.salaryMax} onChange={(e) => onChange('salaryMax', e.target.value)} />
              <Input id="deadline" name="deadline" type="date" label="Hạn nộp hồ sơ" required value={formData.deadline} onChange={(e) => onChange('deadline', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Trách nhiệm công việc</label>
                <textarea rows={3} value={formData.responsibilities} onChange={(e) => onChange('responsibilities', e.target.value)} placeholder="Mô tả các đầu việc chính cần thực hiện..." className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Yêu cầu ứng viên</label>
                <textarea rows={3} value={formData.requirements} onChange={(e) => onChange('requirements', e.target.value)} placeholder="Kỹ năng bắt buộc, kinh nghiệm..." className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>Hủy</Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                {isEditing ? 'Cập nhật tin' : 'Đăng tin tuyển dụng'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
