import React from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { useMyOffers } from '../../hooks/useMyOffers';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { MyOfferCard } from '../../features/offers';

export default function MyOffersPage() {
  const {
    offers,
    page,
    totalPages,
    totalElements,
    isLoading,
    confirmDialogOpen,
    selectedOffer,
    respondAction,
    isResponding,
    setPage,
    handleOpenRespondDialog,
    handleCloseRespondDialog,
    handleConfirmResponse,
  } = useMyOffers();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Thư Mời Nhận Việc (My Offers)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Xem thông tin mức lương và thời hạn làm việc để đưa ra quyết định phản hồi nhà tuyển dụng
        </p>
      </div>

      {/* Offers List */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-slate-800 mx-auto mb-2" />
          <span className="text-xs">Đang tải danh sách Offer...</span>
        </div>
      ) : offers.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
          <Gift className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">Bạn chưa nhận được Offer nào</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Khi nhà tuyển dụng hoàn tất vòng phỏng vấn và gửi lời mời gia nhập, thư mời nhận việc sẽ hiển thị tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <MyOfferCard
              key={offer.id}
              offer={offer}
              onRespond={handleOpenRespondDialog}
            />
          ))}

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={10}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        title={respondAction ? 'Chấp Nhận Lời Mời Nhận Việc' : 'Từ Chối Lời Mời Nhận Việc'}
        message={
          respondAction
            ? `Bạn có chắc chắn muốn CHẤP NHẬN Offer cho vị trí "${selectedOffer?.application?.jobListing?.title}" với mức lương đề xuất không?`
            : `Bạn có chắc chắn muốn TỪ CHỐI Offer từ "${selectedOffer?.application?.jobListing?.company?.name}"? Quyết định này không thể hoàn tác.`
        }
        confirmText={respondAction ? 'Chấp nhận Offer' : 'Từ chối Offer'}
        confirmVariant={respondAction ? 'primary' : 'danger'}
        isLoading={isResponding}
        onConfirm={handleConfirmResponse}
        onCancel={handleCloseRespondDialog}
      />
    </div>
  );
}
