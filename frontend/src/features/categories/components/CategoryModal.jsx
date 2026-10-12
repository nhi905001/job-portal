import React from 'react';
import { X, Save } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export default function CategoryModal({
  isOpen,
  title,
  label,
  value,
  isEditing,
  isSaving,
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
          className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              id="category-name"
              name="name"
              label={label}
              required
              placeholder="Nhập tên..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
                Hủy
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
