import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import offerService from '../services/offerService';

export function useMyOffers() {
  const { showToast } = useToast();

  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Response confirm dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [respondAction, setRespondAction] = useState(true); // true = accept, false = reject
  const [isResponding, setIsResponding] = useState(false);

  const fetchOffers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await offerService.getMyOffers({
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setOffers(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi khi tải danh sách offer:', err);
      showToast('Không thể tải danh sách thư mời nhận việc.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleOpenRespondDialog = (offer, accept) => {
    setSelectedOffer(offer);
    setRespondAction(accept);
    setConfirmDialogOpen(true);
  };

  const handleCloseRespondDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedOffer(null);
  };

  const handleConfirmResponse = async () => {
    if (!selectedOffer) return;
    try {
      setIsResponding(true);
      await offerService.respondToOffer(selectedOffer.id, respondAction);
      showToast(
        respondAction
          ? 'Chúc mừng! Bạn đã chấp nhận Offer việc làm thành công.'
          : 'Bạn đã từ chối Offer việc làm.',
        respondAction ? 'success' : 'info'
      );
      handleCloseRespondDialog();
      fetchOffers();
    } catch (err) {
      console.error('Lỗi khi phản hồi Offer:', err);
      showToast(err.response?.data?.message || 'Phản hồi Offer thất bại.', 'error');
    } finally {
      setIsResponding(false);
    }
  };

  return {
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
    refetchOffers: fetchOffers,
  };
}
