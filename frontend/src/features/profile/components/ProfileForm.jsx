import React from 'react';
import { Save } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import AvatarUploader from './AvatarUploader';
import AttachmentUploader from './AttachmentUploader';

export default function ProfileForm({
  user,
  phone,
  summary,
  avatarUrl,
  attachmentUrl,
  isSaving,
  isUploadingAvatar,
  isUploadingCV,
  onPhoneChange,
  onSummaryChange,
  onAvatarChange,
  onCVChange,
  onRemoveAttachment,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Avatar */}
      <AvatarUploader
        avatarUrl={avatarUrl}
        isUploading={isUploadingAvatar}
        onAvatarChange={onAvatarChange}
      />

      {/* Basic Info (Readonly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Họ và tên</label>
          <input
            type="text"
            disabled
            value={user?.fullName || ''}
            className="w-full px-3.5 py-2.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Địa chỉ Email</label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full px-3.5 py-2.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed"
          />
        </div>
      </div>

      {/* Phone Number */}
      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Số điện thoại liên hệ"
        placeholder="0912 345 678"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
      />

      {/* Summary */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Tóm tắt bản thân / Mục tiêu nghề nghiệp
        </label>
        <textarea
          rows={4}
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Mô tả kỹ năng, số năm kinh nghiệm và mục tiêu làm việc..."
          className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
        />
      </div>

      {/* CV Attachment */}
      <AttachmentUploader
        attachmentUrl={attachmentUrl}
        isUploading={isUploadingCV}
        onCVChange={onCVChange}
        onRemove={onRemoveAttachment}
      />

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isFullWidth
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Lưu thông tin hồ sơ
        </Button>
      </div>
    </form>
  );
}
