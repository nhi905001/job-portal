import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import fileService from '../services/fileService';

export function useProfile() {
  const { user } = useAuth();

  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Ảnh đại diện phải thuộc định dạng: JPG, PNG, GIF, WEBP');
      return;
    }
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
        setSuccessMessage('Tải ảnh đại diện thành công. Hãy bấm "Lưu thông tin" để cập nhật.');
      }
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
      setErrorMessage('Tải ảnh đại diện thất bại. Vui lòng kiểm tra lại file.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCVChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      setErrorMessage('Tải file đính kèm thất bại. Vui lòng kiểm tra định dạng.');
    } finally {
      setIsUploadingCV(false);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentUrl('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
      console.error('Lỗi cập nhật hồ sơ:', err);
      setErrorMessage(err.response?.data?.message || 'Cập nhật hồ sơ thất bại.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
}
