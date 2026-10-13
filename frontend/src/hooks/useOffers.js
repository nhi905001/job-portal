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
      const res = await applicationService.getApplications({
        status: 'INTERVIEWING',
        size: 100,
      });
      const apps = res?.content || [];
      setInterviewingApps(apps);
      if (apps.length > 0) {
        setOfferForm((prev) => ({ ...prev, applicationId: String(apps[0].id) }));
      }
    } catch (err) {
      console.error('Lỗi tải danh sách ứng viên INTERVIEWING:', err);
      showToast('Lỗi khi tải danh sách ứng viên phỏng vấn.', 'error');
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
    setPage,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleFormChange,
    handleSubmitOffer,
    refetchOffers: fetchOffers,
  };
}
