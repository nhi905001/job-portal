import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOffers } from '../../hooks/useOffers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { OfferTable, CreateOfferModal } from '../../features/offers';

export default function OfferManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isRecruiter = user?.role === 'RECRUITER';

  const {
    offers,
    page,
    totalPages,
    totalElements,
    isLoading,
    createModalOpen,
    interviewingApps,
    isLoadingApps,
    isSubmittingOffer,
    offerForm,
    cancelDialogOpen,
    offerToCancel,
    isCancelling,
    setPage,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleFormChange,
    handleSubmitOffer,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleConfirmCancel,
  } = useOffers();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Quản lý Thư Mời Nhận Việc (Offers)
            </h1>
            {isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-slate-100 text-slate-700 border-slate-200">
                Chế độ giám sát
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? 'Theo dõi danh sách Offer đã phát hành trên toàn hệ thống (Quyền Admin: Chỉ xem, không gửi offer).'
              : 'Gửi Offer cho ứng viên sau phỏng vấn và theo dõi quyết định chấp nhận hoặc từ chối'}
          </p>
        </div>

        {isRecruiter && (
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="self-start sm:self-auto"
          >
            Tạo & Gửi Offer mới
          </Button>
        )}
      </div>

      {/* Main Table Card */}
      <Card className="shadow-card border-slate-200/90 rounded-2xl overflow-hidden bg-white">
        <OfferTable
          offers={offers}
          isLoading={isLoading}
          onCancelClick={handleOpenCancelDialog}
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

      {/* Modal Tạo Offer */}
      <CreateOfferModal
        isOpen={createModalOpen}
        onClose={handleCloseCreateModal}
        interviewingApps={interviewingApps}
        isLoadingApps={isLoadingApps}
        isSubmitting={isSubmittingOffer}
        formData={offerForm}
        onChange={handleFormChange}
        onSubmit={handleSubmitOffer}
      />

      {/* Confirm Hủy Offer Dialog */}
      <ConfirmDialog
        isOpen={cancelDialogOpen}
        title="Hủy Thư Mời Nhận Việc (Offer)"
        message={`Bạn có chắc chắn muốn hủy Offer gửi cho ứng viên "${offerToCancel?.jobApplication?.candidate?.fullName || offerToCancel?.application?.user?.fullName || 'này'}"? Trạng thái đơn ứng tuyển sẽ được quay về vòng tuyển dụng trước đó.`}
        confirmText="Xác nhận hủy Offer"
        confirmVariant="danger"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseCancelDialog}
      />
    </div>
  );
}
