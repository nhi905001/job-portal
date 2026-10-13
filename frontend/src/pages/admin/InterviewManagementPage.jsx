import React from 'react';
import { Plus } from 'lucide-react';
import { useInterviews } from '../../hooks/useInterviews';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  InterviewSlotTable,
  CreateSlotModal,
  InterviewFeedbackModal,
} from '../../features/interviews';

export default function InterviewManagementPage() {
  const {
    slots,
    page,
    totalPages,
    totalElements,
    isLoading,
    jobOptions,
    createModalOpen,
    slotForm,
    isCreatingSlot,
    feedbackModalOpen,
    selectedSlotForFeedback,
    existingFeedback,
    feedbackScore,
    feedbackComment,
    isLoadingFeedback,
    isSubmittingFeedback,
    deleteDialogOpen,
    slotToDelete,
    isDeletingSlot,
    setPage,
    setCreateModalOpen,
    setFeedbackModalOpen,
    setDeleteDialogOpen,
    setFeedbackScore,
    setFeedbackComment,
    handleOpenCreateModal,
    handleSlotFormChange,
    handleCreateSlotSubmit,
    handleOpenFeedbackModal,
    handleSubmitFeedback,
    handleOpenDelete,
    handleConfirmDelete,
  } = useInterviews();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Lịch Phỏng Vấn (Interview Slots)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập các khung giờ phỏng vấn, theo dõi lịch ứng viên đã đặt và chấm điểm đánh giá
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Tạo khung giờ mới
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-card border-slate-200/90 rounded-2xl overflow-hidden bg-white">
        <InterviewSlotTable
          slots={slots}
          isLoading={isLoading}
          onFeedbackClick={handleOpenFeedbackModal}
          onDeleteClick={handleOpenDelete}
        />

        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </Card>

      {/* Create Slot Modal */}
      <CreateSlotModal
        isOpen={createModalOpen}
        jobOptions={jobOptions}
        formData={slotForm}
        isSubmitting={isCreatingSlot}
        onClose={() => setCreateModalOpen(false)}
        onChange={handleSlotFormChange}
        onSubmit={handleCreateSlotSubmit}
      />

      {/* Feedback Modal */}
      <InterviewFeedbackModal
        isOpen={feedbackModalOpen}
        slot={selectedSlotForFeedback}
        existingFeedback={existingFeedback}
        feedbackScore={feedbackScore}
        feedbackComment={feedbackComment}
        isLoadingFeedback={isLoadingFeedback}
        isSubmitting={isSubmittingFeedback}
        onClose={() => setFeedbackModalOpen(false)}
        onScoreChange={setFeedbackScore}
        onCommentChange={setFeedbackComment}
        onSubmit={handleSubmitFeedback}
      />

      {/* Delete Slot Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa Khung Giờ Phỏng Vấn"
        message={`Bạn có chắc chắn muốn xóa khung giờ phỏng vấn cho vị trí "${slotToDelete?.jobListing?.title}" không?`}
        confirmText="Xác nhận xóa"
        confirmVariant="danger"
        isLoading={isDeletingSlot}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
