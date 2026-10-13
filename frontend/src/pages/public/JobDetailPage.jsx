import React from 'react';
import { Loader2, AlertCircle, Link } from 'lucide-react';
import { useJobDetail } from '../../hooks/useJobDetail';
import Button from '../../components/common/Button';
import {
  JobDetailHeader,
  JobDetailContent,
  JobCompanyCard,
  JobApplyModal,
  CompanyReviewModal,
  CompanyReviewsList,
} from '../../features/jobs';

export default function JobDetailPage() {
  const {
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
  } = useJobDetail();

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800 mx-auto mb-2" />
        <span className="text-xs">Đang tải thông tin chi tiết việc làm...</span>
      </div>
    );
  }

  if (errorMessage || !jobDetail) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Không tìm thấy tin tuyển dụng</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          {errorMessage || 'Tin tuyển dụng có thể đã bị gỡ hoặc không tồn tại.'}
        </p>
        <Link to="/">
          <Button variant="primary" size="md">Quay về trang chủ</Button>
        </Link>
      </div>
    );
  }

  const rawListing = jobDetail.jobListing || jobDetail;
  const rawDesc = jobDetail.description || {};
  const job = {
    ...rawListing,
    responsibilities: rawDesc.responsibilities || rawListing.responsibilities,
    requirements: rawDesc.requirements || rawListing.requirements,
    benefits: rawDesc.benefits || rawListing.benefits,
    location: rawListing.location || rawListing.companyLocation,
    company: rawListing.company || rawListing.recruiter?.company,
  };
  const company = job?.company;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <JobDetailHeader
        job={job}
        company={company}
        hasApplied={hasApplied}
        onOpenApply={handleOpenApplyModal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Content */}
        <div className="lg:col-span-2 space-y-6">
          <JobDetailContent job={job} />
        </div>

        {/* Right Column: Company Info & Reviews */}
        <div className="space-y-6">
          <JobCompanyCard company={company} onOpenReview={handleOpenReviewModal} />
          <CompanyReviewsList reviews={reviews} />
        </div>
      </div>

      {/* Apply Modal */}
      <JobApplyModal
        isOpen={applyModalOpen}
        jobTitle={job?.title}
        cvUrl={cvUrl}
        coverLetter={coverLetter}
        isUploadingCV={isUploadingCV}
        isSubmitting={isSubmittingApp}
        onClose={() => setApplyModalOpen(false)}
        onCVUpload={handleCVUpload}
        onCoverLetterChange={setCoverLetter}
        onSubmit={handleApplySubmit}
      />

      {/* Review Modal */}
      <CompanyReviewModal
        isOpen={reviewModalOpen}
        companyName={company?.name}
        rating={reviewRating}
        comment={reviewComment}
        isSubmitting={isSubmittingReview}
        onClose={() => setReviewModalOpen(false)}
        onRatingChange={setReviewRating}
        onCommentChange={setReviewComment}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
