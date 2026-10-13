import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import applicationService from '../services/applicationService';
import interviewService from '../services/interviewService';

export function useMyApplications() {
  const { showToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Withdraw confirm modal
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedAppToWithdraw, setSelectedAppToWithdraw] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Interview Booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBookingSlot, setIsBookingSlot] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await applicationService.getMyApplications({
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setApplications(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách đơn ứng tuyển:', err);
      showToast('Không thể tải danh sách đơn ứng tuyển.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenWithdraw = (app) => {
    setSelectedAppToWithdraw(app);
    setWithdrawDialogOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedAppToWithdraw) return;
    try {
      setIsWithdrawing(true);
      await applicationService.withdrawApplication(selectedAppToWithdraw.id);
      showToast('Đã rút đơn ứng tuyển thành công!', 'success');
      setWithdrawDialogOpen(false);
      setSelectedAppToWithdraw(null);
      fetchApplications();
    } catch (err) {
      console.error('Lỗi rút đơn:', err);
      showToast(err.response?.data?.message || 'Không thể rút đơn ứng tuyển.', 'error');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleOpenInterviewModal = async (app) => {
    setSelectedAppForInterview(app);
    setBookingModalOpen(true);
    try {
      setIsLoadingSlots(true);
      const jobListingId = app.jobListing?.id;
      const res = await interviewService.getSlots({
        jobListingId,
        onlyFree: true,
        size: 50,
      });
      setSlots(res?.content || []);
    } catch (err) {
      console.error('Lỗi tải khung giờ phỏng vấn:', err);
      showToast('Không thể tải danh sách khung giờ phỏng vấn.', 'error');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBookSlot = async (slotId) => {
    if (!selectedAppForInterview) return;
    try {
      setIsBookingSlot(true);
      await interviewService.bookSlot(slotId, {
        applicationId: selectedAppForInterview.id,
      });
      showToast('Đặt lịch phỏng vấn thành công!', 'success');
      setBookingModalOpen(false);
      fetchApplications();
    } catch (err) {
      console.error('Lỗi đặt lịch phỏng vấn:', err);
      showToast(err.response?.data?.message || 'Đặt lịch phỏng vấn thất bại.', 'error');
    } finally {
      setIsBookingSlot(false);
    }
  };

  return {
    applications,
    page,
    totalPages,
    totalElements,
    isLoading,
    withdrawDialogOpen,
    selectedAppToWithdraw,
    isWithdrawing,
    bookingModalOpen,
    selectedAppForInterview,
    slots,
    isLoadingSlots,
    isBookingSlot,
    setPage,
    handleOpenWithdraw,
    setWithdrawDialogOpen,
    handleConfirmWithdraw,
    handleOpenInterviewModal,
    setBookingModalOpen,
    handleBookSlot,
    refetchApplications: fetchApplications,
  };
}
