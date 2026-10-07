import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import fileService from '../../services/fileService';
import {
  User,
  Phone,
  FileText,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Loader2,
  Camera,
} from 'lucide-react';

export default function CandidateProfilePage() {
  const { user } = useAuth();

  // Form fields
  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  // Status & feedback
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Tải thông tin hồ sơ hiện tại từ GET /api/profiles/me
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await profileService.getMyProfile();
        if (data) {
          setPhone(data.phone || '');
          setSummary(data.summary || '');
          setAvatarUrl(data.avatarUrl || '');
          setAttachmentUrl(data.attachmentUrl || '');
        }
      } catch (err) {
        console.error('Lỗi khi tải hồ sơ:', err);
        setErrorMessage('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // 2. Upload Avatar qua POST /api/files
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng (ảnh)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Ảnh đại diện phải thuộc định dạng: JPG, PNG, GIF, WEBP');
      return;
    }

    // Giới hạn 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Dung lượng ảnh không được vượt quá 10MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setErrorMessage('');
      const res = await fileService.uploadFile(file);
      if (res?.url) {
        setAvatarUrl(res.url);
        setSuccessMessage('Tải ảnh đại diện thành công. Hãy bấm "Lưu thông tin" để cập nhật hồ sơ.');
      }
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
      setErrorMessage('Tải ảnh đại diện thất bại. Vui lòng kiểm tra lại file.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // 3. Upload CV / Tài liệu qua POST /api/files
  const handleCVChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Giới hạn 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Dung lượng file đính kèm không được vượt quá 10MB');
      return;
    }

    try {
      setIsUploadingCV(true);
      setErrorMessage('');
      const res = await fileService.uploadFile(file);
      if (res?.url) {
        setAttachmentUrl(res.url);
        setSuccessMessage('Tải tệp đính kèm thành công. Hãy bấm "Lưu thông tin" để hoàn tất.');
      }
    } catch (err) {
      console.error('Lỗi upload CV:', err);
      setErrorMessage('Tải file đính kèm thất bại. Vui lòng kiểm tra định dạng (PDF, DOC, DOCX, ảnh).');
    } finally {
      setIsUploadingCV(false);
    }
  };

  // 4. Lưu cập nhật hồ sơ qua PUT /api/profiles/me
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const payload = {
        phone: phone.trim(),
        summary: summary.trim(),
        avatarUrl: avatarUrl || null,
        attachmentUrl: attachmentUrl || null,
      };

      const updated = await profileService.updateMyProfile(payload);
      if (updated) {
        setSuccessMessage('Hồ sơ ứng viên đã được cập nhật thành công!');
      }
    } catch (err) {
      console.error('Lỗi khi lưu hồ sơ:', err);
      setErrorMessage(
        err.response?.data?.message || 'Lỗi khi lưu thông tin hồ sơ. Vui lòng thử lại.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center text-[#786F62]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F6B779] mb-3" />
        <p className="text-xs font-medium">Đang tải thông tin hồ sơ ứng viên...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Header */}
        <div className="border-b border-[#F4EFE6] pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">Hồ sơ ứng viên của tôi</h1>
            <p className="text-xs text-[#8A8073] mt-1">
              Cập nhật thông tin liên hệ và CV để nhà tuyển dụng dễ dàng tiếp cận bạn
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D6] text-[#4A3E31]">
            JOB_SEEKER
          </span>
        </div>

        {/* Thông báo Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200/60 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200/60 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#FAF7F2]/60 border border-[#F0EAE0]">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-[#E6E0D6] overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={fileService.getFullFileUrl(avatarUrl)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-[#C4BDB0]" />
                )}
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h3 className="text-sm font-semibold text-[#1E1E1E]">Ảnh đại diện</h3>
              <p className="text-[11px] text-[#8A8073] mt-0.5 mb-2.5">
                Định dạng: JPG, PNG, WEBP (Tối đa 10MB)
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <label className="cursor-pointer px-3.5 py-1.5 bg-white border border-[#E0D8CB] hover:bg-[#FAF7F2] text-xs font-medium rounded-xl text-[#3A332A] transition-colors flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#786F62]" />
                  <span>{avatarUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User Basic Info (Readonly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                disabled
                value={user?.fullName || ''}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl text-sm text-[#5C5346] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                Email tài khoản
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl text-sm text-[#5C5346] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
              Số điện thoại liên hệ
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912345678"
                className="w-full px-4 py-2.5 pl-10 bg-white border border-[#E6E0D6] rounded-xl text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all"
              />
              <Phone className="w-4 h-4 text-[#A89E90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Summary Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
              Tóm tắt bản thân & Mục tiêu nghề nghiệp
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Giới thiệu về kỹ năng nổi bật, kinh nghiệm làm việc và định hướng nghề nghiệp của bạn..."
              className="w-full px-4 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all"
            />
          </div>

          {/* Upload Attachments / Default CV */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
              Tệp đính kèm / CV mặc định
            </label>

            {attachmentUrl ? (
              <div className="p-4 border border-[#E2DAD0] rounded-2xl bg-[#FAF7F2]/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2DAD0] flex items-center justify-center shrink-0 text-[#F6B779]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#1E1E1E] truncate">
                      {attachmentUrl.split('/').pop()}
                    </p>
                    <a
                      href={fileService.getFullFileUrl(attachmentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#C27E38] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Xem / Tải file</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-[#FAF7F2] border border-[#E0D8CB] text-xs font-medium rounded-xl text-[#3A332A] transition-colors">
                    <span>Thay thế</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      onChange={handleCVChange}
                      className="hidden"
                      disabled={isUploadingCV}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setAttachmentUrl('')}
                    className="p-1.5 text-[#8A8073] hover:text-red-600 rounded-lg transition-colors"
                    title="Xóa tệp đính kèm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[#D5CDC1] rounded-2xl p-6 text-center bg-[#FAF7F2]/50">
                {isUploadingCV ? (
                  <div className="py-4 flex flex-col items-center justify-center text-[#786F62]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mb-2" />
                    <p className="text-xs">Đang tải tệp lên máy chủ...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-[#9E9587] mx-auto mb-2" />
                    <p className="text-xs font-medium text-[#4A4135]">
                      Tải lên CV mặc định hoặc file chứng chỉ (PDF, DOC, DOCX, ảnh)
                    </p>
                    <p className="text-[11px] text-[#8A8073] mt-0.5">Dung lượng tối đa: 10MB</p>
                    <label className="inline-block mt-3 px-4 py-2 bg-white border border-[#E0D8CB] hover:bg-[#FAF7F2] text-xs font-medium rounded-xl text-[#3A332A] cursor-pointer transition-colors shadow-2xs">
                      <span>Chọn tệp từ máy tính</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        onChange={handleCVChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isUploadingAvatar || isUploadingCV}
              className={`px-6 py-3 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu thông tin...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thông tin hồ sơ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
