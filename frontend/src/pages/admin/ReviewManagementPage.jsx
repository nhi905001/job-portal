import React from 'react';
import { useReviews } from '../../hooks/useReviews';
import Card from '../../components/common/Card';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ReviewFilterBar, ReviewTable } from '../../features/reviews';

export default function ReviewManagementPage() {
  const {
    reviews,
    page,
    totalPages,
    totalElements,
    isLoading,
    companies,
    selectedCompanyId,
    selectedRating,
    deleteDialogOpen,
    reviewToDelete,
    isDeleting,
    setPage,
    handleCompanyChange,
    handleRatingChange,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
  } = useReviews();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kiểm Duyệt Đánh Giá Doanh Nghiệp (Reviews)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi nhận xét của ứng viên về các công ty và gỡ bỏ các đánh giá vi phạm tiêu chuẩn cộng đồng
        </p>
      </div>

      {/* Filter Bar */}
      <ReviewFilterBar
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        selectedRating={selectedRating}
        totalElements={totalElements}
        onCompanyChange={handleCompanyChange}
        onRatingChange={handleRatingChange}
      />

      {/* Table Card */}
      <Card className="shadow-card border-slate-200/90 rounded-2xl overflow-hidden bg-white">
        <ReviewTable
          reviews={reviews}
          companies={companies}
          isLoading={isLoading}
          onDeleteClick={handleOpenDeleteDialog}
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa Đánh Giá Vi Phạm Tiêu Chuẩn"
        message={`Bạn có chắc chắn muốn xóa đánh giá của ứng viên "${
          reviewToDelete?.user?.fullName || 'này'
        }" về công ty "${reviewToDelete?.company?.name || ''}"? Thao tác này sẽ xóa vĩnh viễn nhận xét khỏi hệ thống.`}
        confirmText="Xóa đánh giá"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
      />
    </div>
  );
}
