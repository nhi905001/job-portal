import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import profileService from '../services/profileService';
import fileService from '../services/fileService';
import reviewService from '../services/reviewService';

export function useJobDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [jobDetail, setJobDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const res = await jobService.getJobById(id);
        setJobDetail(res);

        const companyId = res?.jobListing?.company?.id || res?.jobListing?.recruiter?.company?.id;
        if (companyId) {
          const revRes = await reviewService.getReviews({ companyId, size: 20 });
          setReviews(revRes?.content || []);
        }
      } catch (err) {
        console.error('Lỗi chi tiết việc làm:', err);
        setErrorMessage('Không tìm thấy thông tin tin tuyển dụng hoặc tin đã bị gỡ.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobDetail();
  }, [id]);

  const handleOpenApplyModal = async () => {
    setApplyModalOpen(true);
    if (!cvUrl) {
      try {
        const profile = await profileService.getMyProfile();
        if (profile?.attachmentUrl) {
          setCvUrl(profile.attachmentUrl);
        }
      } catch (err) {
        console.warn('Lỗi lấy hồ sơ:', err);
      }
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Dung lượng CV không được vượt quá 10MB', 'error');
      return;
    }

    try {
      setIsUploadingCV(true);
      const res = await fileService.uploadFile(file);
      if (res?.url) {
        setCvUrl(res.url);
        showToast('Tải lên CV thành công!', 'success');
      }
    } catch {
      showToast('Tải file thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setIsUploadingCV(false);
    }
  };

  const handleApplySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!cvUrl) {
      showToast('Vui lòng tải lên hoặc chọn file CV đính kèm', 'error');
      return;
    }

    try {
      setIsSubmittingApp(true);
      await applicationService.apply({
        jobListingId: id,
        cvUrl,
        coverLetter: coverLetter.trim(),
      });
      setHasApplied(true);
      setApplyModalOpen(false);
      showToast('Nộp đơn ứng tuyển thành công! Nhà tuyển dụng sẽ sớm phản hồi.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Nộp đơn thất bại.', 'error');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const handleOpenReviewModal = () => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để viết đánh giá doanh nghiệp', 'warning');
      return;
    }
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    if (e) e.preventDefault();
    const companyId = jobDetail?.jobListing?.company?.id || jobDetail?.jobListing?.recruiter?.company?.id;
    if (!companyId) return;

    try {
      setIsSubmittingReview(true);
      await reviewService.createReview({
        companyId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      showToast('Đánh giá của bạn đã được ghi nhận thành công!', 'success');
      setReviewModalOpen(false);
      setReviewComment('');
      const revRes = await reviewService.getReviews({ companyId, size: 20 });
      setReviews(revRes?.content || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gửi đánh giá thất bại.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return {
    id,
    jobDetail,
    reviews,
    isLoading,
    errorMessage,
    applyModalOpen,
    cvUrl,
    coverLetter,
    isUploadingCV,
    isSubmittingApp,
    hasApplied,
    reviewModalOpen,
    reviewRating,
    reviewComment,
    isSubmittingReview,
    setApplyModalOpen,
    setCoverLetter,
    setReviewModalOpen,
    setReviewRating,
    setReviewComment,
    handleOpenApplyModal,
    handleCVUpload,
    handleApplySubmit,
    handleOpenReviewModal,
    handleReviewSubmit,
  };
}
