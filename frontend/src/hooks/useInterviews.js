import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import interviewService from '../services/interviewService';
import jobService from '../services/jobService';

export function useInterviews() {
  const { showToast } = useToast();

  const [slots, setSlots] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [jobOptions, setJobOptions] = useState([]);

  // Create Slot Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [slotForm, setSlotForm] = useState({
    jobListingId: '',
    startTime: '',
    endTime: '',
    meetingLink: '',
  });
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);

  // Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedSlotForFeedback, setSelectedSlotForFeedback] = useState(null);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [feedbackScore, setFeedbackScore] = useState(8);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Delete Slot Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [isDeletingSlot, setIsDeletingSlot] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await jobService.searchJobs({ size: 100 });
        const list = res?.content || [];
        setJobOptions(list);
        if (list.length > 0) {
          setSlotForm((prev) => ({ ...prev, jobListingId: String(list[0].id) }));
        }
      } catch (err) {
        console.error('Lỗi tải danh mục tin:', err);
      }
    }
    fetchJobs();
  }, []);

  const fetchSlots = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await interviewService.getSlots({
        page,
        size: 10,
        sortBy: 'startTime',
        sortDir: 'desc',
      });
      setSlots(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải lịch phỏng vấn:', err);
      showToast('Không thể tải danh sách khung giờ phỏng vấn.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleOpenCreateModal = () => {
    setSlotForm({
      jobListingId: jobOptions.length > 0 ? String(jobOptions[0].id) : '',
      startTime: '',
      endTime: '',
      meetingLink: '',
    });
    setCreateModalOpen(true);
  };

  const handleSlotFormChange = (field, value) => {
    setSlotForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSlotSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!slotForm.jobListingId || !slotForm.startTime || !slotForm.endTime) {
      showToast('Vui lòng nhập đầy đủ thông tin bắt buộc.', 'error');
      return;
    }

    try {
      setIsCreatingSlot(true);
      const formattedStart = slotForm.startTime.length === 16 ? `${slotForm.startTime}:00` : slotForm.startTime;
      const formattedEnd = slotForm.endTime.length === 16 ? `${slotForm.endTime}:00` : slotForm.endTime;

      await interviewService.createSlot({
        jobListingId: Number(slotForm.jobListingId),
        startTime: formattedStart,
        endTime: formattedEnd,
        meetingLink: slotForm.meetingLink.trim() || null,
      });

      showToast('Tạo khung giờ phỏng vấn thành công!', 'success');
      setCreateModalOpen(false);
      fetchSlots();
    } catch (err) {
      console.error('Lỗi tạo khung giờ:', err);
      showToast(err.response?.data?.message || 'Tạo khung giờ thất bại.', 'error');
    } finally {
      setIsCreatingSlot(false);
    }
  };

  const handleOpenFeedbackModal = async (slot) => {
    setSelectedSlotForFeedback(slot);
    setExistingFeedback(null);
    setFeedbackScore(8);
    setFeedbackComment('');
    setFeedbackModalOpen(true);

    try {
      setIsLoadingFeedback(true);
      const fb = await interviewService.getFeedbackBySlotId(slot.id);
      if (fb) {
        setExistingFeedback(fb);
        setFeedbackScore(fb.score || 8);
        setFeedbackComment(fb.comment || '');
      }
    } catch {
      // Slot chưa có feedback là trạng thái bình thường
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    if (e) e.preventDefault();
    if (!selectedSlotForFeedback?.id) return;

    try {
      setIsSubmittingFeedback(true);
      await interviewService.createFeedback({
        interviewSlotId: selectedSlotForFeedback.id,
        score: feedbackScore,
        comment: feedbackComment.trim(),
      });
      showToast('Ghi nhận đánh giá sau phỏng vấn thành công!', 'success');
      setFeedbackModalOpen(false);
    } catch (err) {
      console.error('Lỗi lưu đánh giá:', err);
      showToast(err.response?.data?.message || 'Lưu đánh giá thất bại.', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleOpenDelete = (slot) => {
    setSlotToDelete(slot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!slotToDelete) return;
    try {
      setIsDeletingSlot(true);
      await interviewService.deleteSlot(slotToDelete.id);
      showToast('Đã xóa khung giờ phỏng vấn!', 'success');
      setDeleteDialogOpen(false);
      setSlotToDelete(null);
      fetchSlots();
    } catch (err) {
      console.error('Lỗi xóa khung giờ:', err);
      showToast(err.response?.data?.message || 'Xóa khung giờ thất bại.', 'error');
    } finally {
      setIsDeletingSlot(false);
    }
  };

  return {
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
    refetchSlots: fetchSlots,
  };
}
