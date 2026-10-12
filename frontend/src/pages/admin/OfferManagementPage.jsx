import React from 'react';
import { Plus } from 'lucide-react';
import { useOffers } from '../../hooks/useOffers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { OfferTable, CreateOfferModal } from '../../features/offers';

export default function OfferManagementPage() {
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
    setPage,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleFormChange,
    handleSubmitOffer,
  } = useOffers();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Thư Mời Nhận Việc (Offers)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gửi Offer cho ứng viên sau phỏng vấn và theo dõi quyết định chấp nhận hoặc từ chối
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Tạo & Gửi Offer mới
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-none border-slate-200 overflow-hidden">
        <OfferTable offers={offers} isLoading={isLoading} />

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
    </div>
  );
}
