import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  Star,
  MessageSquare,
  AlertCircle,
  Loader2,
  Send,
  X,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import profileService from '../../services/profileService';
import fileService from '../../services/fileService';
import reviewService from '../../services/reviewService';

export default function JobDetailPage() {
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

  // 1. Tải chi tiết tin tuyển dụng & review công ty
  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const res = await jobService.getJobById(id);
        setJobDetail(res);

        // Tải reviews của công ty này
        const companyId = res?.jobListing?.company?.id || res?.jobListing?.recruiter?.company?.id;
        if (companyId) {
          const revRes = await reviewService.getReviews({ companyId, size: 20 });
          setReviews(revRes?.content || []);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết tin tuyển dụng:', err);
        setErrorMessage('Không tìm thấy thông tin tin tuyển dụng hoặc tin đã bị gỡ.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobDetail();
  }, [id]);

  // Khi mở Apply Modal, nạp CV mặc định từ hồ sơ nếu có
  const handleOpenApplyModal = async () => {
    setApplyModalOpen(true);
    if (!cvUrl) {
      try {
        const profile = await profileService.getMyProfile();
        if (profile?.attachmentUrl) {
          setCvUrl(profile.attachmentUrl);
        }
      } catch (err) {
        console.warn('Chưa có hồ sơ hoặc lỗi lấy hồ sơ:', err);
      }
    }
  };

  // Upload CV mới trong modal
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
    } catch (err) {
      console.error('Lỗi upload CV:', err);
      showToast('Tải file thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setIsUploadingCV(false);
    }
  };

  // Nộp đơn ứng tuyển
  const handleApplySubmit = async (e) => {
    e.preventDefault();
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
      console.error('Lỗi nộp đơn:', err);
      const msg = err.response?.data?.message || 'Nộp đơn thất bại. Vui lòng kiểm tra lại.';
      showToast(msg, 'error');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Gửi đánh giá công ty
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const companyId =
      jobDetail?.jobListing?.company?.id || jobDetail?.jobListing?.recruiter?.company?.id;

    if (!companyId) {
      showToast('Không tìm thấy thông tin doanh nghiệp', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá', 'error');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const newRev = await reviewService.createReview({
        companyId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviews((prev) => [newRev, ...prev]);
      setReviewModalOpen(false);
      setReviewComment('');
      showToast('Đánh giá của bạn đã được gửi thành công!', 'success');
    } catch (err) {
      console.error('Lỗi gửi review:', err);
      showToast(err.response?.data?.message || 'Gửi đánh giá thất bại.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Helper format lương
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (num) =>
      new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num) + ' đ';
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-[#786F62]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F6B779] mb-3" />
        <p className="text-xs font-medium">Đang tải thông tin chi tiết việc làm...</p>
      </div>
    );
  }

  if (errorMessage || !jobDetail) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="p-8 bg-white border border-[#EFE9DF] rounded-3xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-[#1E1E1E]">Không tìm thấy tin việc làm</h2>
          <p className="text-xs text-[#786F62] mt-1.5 mb-5">{errorMessage}</p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E2DAD0] text-[#3A332A] text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang tìm việc</span>
          </Link>
        </div>
      </div>
    );
  }

  const { jobListing, description } = jobDetail;
  const company = jobListing?.company || jobListing?.recruiter?.company;
  const isClosed = jobListing?.status === 'CLOSED';
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#786F62] hover:text-[#1E1E1E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách việc làm</span>
      </Link>

      {/* Main Job Header Card */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#F4EFE6] pb-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {jobListing?.industry?.name && (
                <span className="text-xs font-semibold text-[#8C4A08] bg-[#F6B779]/20 border border-[#F6B779]/30 px-2.5 py-0.5 rounded-lg">
                  {jobListing.industry.name}
                </span>
              )}
              {jobListing?.jobType?.name && (
                <span className="text-xs font-medium text-[#786F62] bg-[#FAF7F2] px-2.5 py-0.5 rounded-lg border border-[#EAE4D9]">
                  {jobListing.jobType.name}
                </span>
              )}
              {isClosed && (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                  Đã hết hạn tuyển
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] tracking-tight">
              {jobListing?.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#786F62]">
              <div className="flex items-center gap-1.5 font-medium text-[#1E1E1E]">
                <Building2 className="w-4 h-4 text-[#A89E90]" />
                <span>{company?.name || 'Doanh nghiệp'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#A89E90]" />
                <span>
                  {jobListing?.companyLocation?.city ||
                    jobListing?.companyLocation?.address ||
                    'Toàn quốc'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>{formatSalary(jobListing?.salaryMin, jobListing?.salaryMax)}</span>
              </div>
              {jobListing?.deadline && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#A89E90]" />
                  <span>
                    Hạn nộp: {new Date(jobListing.deadline).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            {isClosed ? (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-400 font-semibold text-xs sm:text-sm rounded-xl cursor-not-allowed"
              >
                Vị trí đã dừng nhận hồ sơ
              </button>
            ) : hasApplied ? (
              <div className="w-full sm:w-auto px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã nộp đơn ứng tuyển</span>
              </div>
            ) : isAuthenticated ? (
              user?.role === 'JOB_SEEKER' ? (
                <button
                  type="button"
                  onClick={handleOpenApplyModal}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Ứng tuyển ngay</span>
                </button>
              ) : (
                <div className="p-2.5 bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-center">
                  <span className="text-xs text-[#8A8073] italic">
                    Tài khoản {user?.role} không thể nộp đơn
                  </span>
                </div>
              )
            ) : (
              <Link
                to="/login"
                className="block w-full sm:w-auto px-6 py-3.5 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm text-center"
              >
                Đăng nhập để ứng tuyển
              </Link>
            )}
          </div>
        </div>

        {/* Job Content Sections */}
        <div className="pt-6 space-y-6 text-xs sm:text-sm text-[#4A4135] leading-relaxed">
          {/* Responsibilities */}
          {description?.responsibilities && (
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E1E1E] mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#F6B779]" />
                <span>Mô tả công việc & Trách nhiệm</span>
              </h2>
              <div className="p-4 bg-[#FAF7F2]/50 border border-[#F0EAE0] rounded-2xl whitespace-pre-line text-[#3A332A]">
                {description.responsibilities}
              </div>
            </div>
          )}

          {/* Requirements */}
          {description?.requirements && (
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E1E1E] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Yêu cầu ứng viên</span>
              </h2>
              <div className="p-4 bg-[#FAF7F2]/50 border border-[#F0EAE0] rounded-2xl whitespace-pre-line text-[#3A332A]">
                {description.requirements}
              </div>
            </div>
          )}

          {/* Benefits */}
          {description?.benefits && (
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E1E1E] mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#C27E38]" />
                <span>Quyền lợi được hưởng</span>
              </h2>
              <div className="p-4 bg-[#FAF7F2]/50 border border-[#F0EAE0] rounded-2xl whitespace-pre-line text-[#3A332A]">
                {description.benefits}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Company Overview & Reviews Section (U008, U023) */}
      {company && (
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4EFE6] pb-5">
            <div>
              <h2 className="text-lg font-bold text-[#1E1E1E] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#8C4A08]" />
                <span>Thông tin doanh nghiệp: {company.name}</span>
              </h2>
              {averageRating && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-xs ml-1 text-[#1E1E1E]">{averageRating}</span>
                  </div>
                  <span className="text-xs text-[#8A8073]">({reviews.length} đánh giá)</span>
                </div>
              )}
            </div>

            {isAuthenticated && user?.role === 'JOB_SEEKER' && (
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 bg-white border border-[#E0D8CB] hover:bg-[#FAF7F2] text-xs font-semibold text-[#3A332A] rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#786F62]" />
                <span>Viết đánh giá công ty</span>
              </button>
            )}
          </div>

          {company.description && (
            <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed">
              {company.description}
            </p>
          )}

          {/* Reviews list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#786F62]">
              Đánh giá từ cộng đồng ứng viên ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#8A8073] bg-[#FAF7F2]/50 border border-[#F0EAE0] rounded-2xl">
                Chưa có đánh giá nào cho doanh nghiệp này. Hãy là người đầu tiên chia sẻ cảm nhận!
              </div>
            ) : (
              <div className="divide-y divide-[#F4EFE6]">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 first:pt-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#1E1E1E]">
                          {rev.user?.fullName || 'Ứng viên ẩn danh'}
                        </span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-200 fill-gray-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-[#A8A196]">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString('vi-VN')
                          : ''}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A4135] leading-relaxed mt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODAL NỘP ĐƠN ỨNG TUYỂN (Task 2.4 - U011)               */}
      {/* ========================================================= */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSubmittingApp && setApplyModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE9DF] p-6 sm:p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#1E1E1E]">Nộp đơn ứng tuyển</h3>
                  <p className="text-xs text-[#8A8073] mt-0.5 truncate max-w-sm">
                    {jobListing?.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                {/* Info summary */}
                <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D6] rounded-2xl text-xs space-y-1">
                  <p className="text-[#5C5346]">
                    Ứng viên: <span className="font-semibold text-[#1E1E1E]">{user?.fullName}</span>
                  </p>
                  <p className="text-[#5C5346]">
                    Email liên hệ: <span className="font-semibold text-[#1E1E1E]">{user?.email}</span>
                  </p>
                </div>

                {/* CV Attachment Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                    Hồ sơ CV đính kèm <span className="text-rose-500">*</span>
                  </label>

                  {cvUrl ? (
                    <div className="p-3 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[#F6B779] shrink-0" />
                        <span className="truncate text-[#1E1E1E]">{cvUrl.split('/').pop()}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="cursor-pointer text-xs text-[#C27E38] hover:underline">
                          <span>Thay file</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCVUpload}
                            className="hidden"
                            disabled={isUploadingCV}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#D5CDC1] rounded-2xl p-5 text-center bg-[#FAF7F2]/40">
                      {isUploadingCV ? (
                        <div className="flex flex-col items-center justify-center py-2 text-[#786F62]">
                          <Loader2 className="w-5 h-5 animate-spin text-[#F6B779] mb-1.5" />
                          <span className="text-xs">Đang tải tệp CV lên...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-[#9E9587] mx-auto mb-1.5" />
                          <p className="text-xs font-medium text-[#4A4135]">
                            Tải lên CV của bạn (PDF, DOC, DOCX - Tối đa 10MB)
                          </p>
                          <label className="inline-block mt-2.5 px-3.5 py-1.5 bg-white border border-[#E0D8CB] hover:bg-[#FAF7F2] text-xs font-medium rounded-xl text-[#3A332A] cursor-pointer transition-colors shadow-2xs">
                            <span>Chọn file từ máy tính</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleCVUpload}
                              className="hidden"
                            />
                          </label>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Cover letter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                    Thư giới thiệu / Thư ngỏ (Cover letter)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Giới thiệu ngắn về lý do bạn phù hợp với vị trí này..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isSubmittingApp}
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApp || isUploadingCV}
                    className="px-5 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmittingApp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang gửi đơn...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Xác nhận nộp đơn</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MODAL VIẾT ĐÁNH GIÁ CÔNG TY (Task 2.8 - U023)           */}
      {/* ========================================================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSubmittingReview && setReviewModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">
                  Đánh giá công ty {company?.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Star rating selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#786F62] mb-1.5">
                    Mức độ hài lòng (1 - 5 sao)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 fill-gray-100'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#1E1E1E] ml-2">
                      {reviewRating} sao
                    </span>
                  </div>
                </div>

                {/* Comment textarea */}
                <div>
                  <label className="block text-xs font-semibold text-[#786F62] mb-1.5">
                    Nội dung nhận xét & Trải nghiệm
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Chia sẻ về môi trường làm việc, chế độ đãi ngộ, quy trình phỏng vấn..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isSubmittingReview}
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    {isSubmittingReview ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Gửi đánh giá</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
