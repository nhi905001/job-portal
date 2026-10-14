import React from 'react';
import { AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react';

/**
 * Dialog xác nhận hành động nguy hiểm / quan trọng (xóa, khóa tài khoản, rút đơn,...)
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Xác nhận hành động',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertCircle className="w-6 h-6 text-rose-600" />,
          iconBg: 'bg-rose-50 border-rose-200/60',
          btnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-50 border-amber-200/60',
          btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'primary':
      default:
        return {
          icon: <Info className="w-6 h-6 text-[#8C4A08]" />,
          iconBg: 'bg-[#FAF7F2] border-[#E8E2D6]',
          btnClass: 'bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E]',
        };
    }
  };

  const currentVariant = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={isLoading ? undefined : onCancel}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="relative transform overflow-hidden rounded-3xl bg-white border border-[#EFE9DF] text-left transition-all sm:my-8 sm:w-full sm:max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}
            >
              {currentVariant.icon}
            </div>
            <div className="flex-1 mt-0.5">
              <h3 className="text-base font-bold text-[#1E1E1E] leading-6">{title}</h3>
              <p className="mt-2 text-xs text-[#786F62] leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 ${currentVariant.btnClass}`}
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
