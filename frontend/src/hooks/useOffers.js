import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import offerService from '../services/offerService';
import applicationService from '../services/applicationService';

export function useOffers() {
  const { showToast } = useToast();

  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [interviewingApps, setInterviewingApps] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Form State
  const [offerForm, setOfferForm] = useState({
    applicationId: '',
    salary: '',
    startDate: '',
    expiryDate: '',
    notes: '',
  });

  const fetchOffers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await offerService.getOffers({
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setOffers(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách offer:', err);
      showToast('Không thể tải danh sách Offers.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleOpenCreateModal = async () => {
    setCreateModalOpen(true);
    setOfferForm({
      applicationId: '',
      salary: '',
      startDate: '',
      expiryDate: '',
      notes: '',
    });

    try {
      setIsLoadingApps(true);
      const [resInterviewing, resShortlisted] = await Promise.all([
        applicationService.getApplications({
          status: 'INTERVIEWING',
          size: 100,
        }),
        applicationService.getApplications({
          status: 'SHORTLISTED',
          size: 100,
        }),
      ]);
      const interviewingList = resInterviewing?.content || [];
      const shortlistedList = resShortlisted?.content || [];
      const combined = [...interviewingList, ...shortlistedList];
      setInterviewingApps(combined);
      if (combined.length > 0) {
        setOfferForm((prev) => ({ ...prev, applicationId: String(combined[0].id) }));
      }
    } catch (err) {
      console.error('Lỗi tải danh sách ứng viên đủ điều kiện nhận Offer:', err);
      showToast('Lỗi khi tải danh sách ứng viên.', 'error');
    } finally {
      setIsLoadingApps(false);
    }
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleFormChange = (field, value) => {
    setOfferForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOffer = async (e) => {
    if (e) e.preventDefault();
    if (!offerForm.applicationId) {
      showToast('Vui lòng chọn ứng viên đủ điều kiện nhận Offer', 'error');
      return;
    }
    if (!offerForm.salary || Number(offerForm.salary) <= 0) {
      showToast('Mức lương đề xuất phải lớn hơn 0', 'error');
      return;
    }
    if (!offerForm.startDate) {
      showToast('Vui lòng chọn ngày bắt đầu làm việc', 'error');
      return;
    }

    try {
      setIsSubmittingOffer(true);
      await offerService.createOffer({
        applicationId: Number(offerForm.applicationId),
        salary: Number(offerForm.salary),
        startDate: offerForm.startDate,
        expiryDate: offerForm.expiryDate || null,
        notes: offerForm.notes.trim() || null,
      });

      showToast('Gửi Offer cho ứng viên thành công!', 'success');
      setCreateModalOpen(false);
      fetchOffers();
    } catch (err) {
      console.error('Lỗi tạo Offer:', err);
      showToast(err.response?.data?.message || 'Gửi Offer thất bại.', 'error');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  // Cancel Offer Dialog State
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [offerToCancel, setOfferToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleOpenCancelDialog = (offer) => {
    setOfferToCancel(offer);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setOfferToCancel(null);
    setCancelDialogOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!offerToCancel) return;
    try {
      setIsCancelling(true);
      await offerService.cancelOffer(offerToCancel.id);
      showToast('Đã hủy Thư mời nhận việc (Offer) thành công!', 'success');
      setCancelDialogOpen(false);
      setOfferToCancel(null);
      fetchOffers();
    } catch (err) {
      console.error('Lỗi hủy Offer:', err);
      showToast(err.response?.data?.message || 'Không thể hủy Offer này.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return {
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
    refetchOffers: fetchOffers,
  };
}
