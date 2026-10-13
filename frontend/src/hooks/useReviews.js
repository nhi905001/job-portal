import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import reviewService from '../services/reviewService';
import companyService from '../services/companyService';

export function useReviews() {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // Delete Review State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await companyService.getCompanies({ size: 100 });
        setCompanies(res?.content || []);
      } catch (err) {
        console.error('Lỗi tải danh sách công ty:', err);
      }
    }
    loadCompanies();
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await reviewService.getReviews({
        companyId: selectedCompanyId || undefined,
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      let content = res?.content || [];
      if (selectedRating) {
        content = content.filter((r) => r.rating === Number(selectedRating));
      }
      setReviews(content);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách đánh giá:', err);
      showToast('Không thể tải danh sách đánh giá.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompanyId, selectedRating, page, showToast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleOpenDeleteDialog = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeleting(true);
      await reviewService.deleteReview(reviewToDelete.id);
      showToast('Đã xóa đánh giá vi phạm thành công!', 'success');
      handleCloseDeleteDialog();
      fetchReviews();
    } catch (err) {
      console.error('Lỗi xóa đánh giá:', err);
      showToast(err.response?.data?.message || 'Xóa đánh giá thất bại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCompanyChange = (id) => {
    setSelectedCompanyId(id);
    setPage(0);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setPage(0);
  };

  return {
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
    refetchReviews: fetchReviews,
  };
}
