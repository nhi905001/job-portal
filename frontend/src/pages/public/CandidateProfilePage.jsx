import React from 'react';
import { Loader2 } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import Card from '../../components/common/Card';
import Alert from '../../components/common/Alert';
import { ProfileForm } from '../../features/profile';

export default function CandidateProfilePage() {
  const {
    user,
    phone,
    summary,
    avatarUrl,
    attachmentUrl,
    isLoading,
    isSaving,
    isUploadingAvatar,
    isUploadingCV,
    errorMessage,
    successMessage,
    setPhone,
    setSummary,
    setErrorMessage,
    setSuccessMessage,
    handleAvatarChange,
    handleCVChange,
    handleRemoveAttachment,
    handleSubmit,
  } = useProfile();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Hồ Sơ Cá Nhân (Candidate Profile)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cập nhật thông tin liên hệ, ảnh đại diện và CV đính kèm để nhà tuyển dụng dễ dàng tiếp cận
        </p>
      </div>

      {/* Main Card */}
      <Card className="shadow-none border-slate-200 p-6 sm:p-8">
        {errorMessage && (
          <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} className="mb-5" />
        )}

        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} className="mb-5" />
        )}

        {isLoading ? (
          <div className="py-16 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-slate-800 mx-auto mb-2" />
            <span className="text-xs">Đang tải thông tin hồ sơ...</span>
          </div>
        ) : (
          <ProfileForm
            user={user}
            phone={phone}
            summary={summary}
            avatarUrl={avatarUrl}
            attachmentUrl={attachmentUrl}
            isSaving={isSaving}
            isUploadingAvatar={isUploadingAvatar}
            isUploadingCV={isUploadingCV}
            onPhoneChange={setPhone}
            onSummaryChange={setSummary}
            onAvatarChange={handleAvatarChange}
            onCVChange={handleCVChange}
            onRemoveAttachment={handleRemoveAttachment}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
