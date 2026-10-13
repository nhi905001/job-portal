import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import shortlistService from '../services/shortlistService';

export function useShortlists() {
  const { showToast } = useToast();

  const [shortlists, setShortlists] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchShortlists = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await shortlistService.getShortlists({
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setShortlists(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách Shortlist:', err);
      showToast('Không thể tải danh sách Shortlist.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchShortlists();
  }, [fetchShortlists]);

  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await shortlistService.removeFromShortlist(itemToDelete.id);
      showToast('Đã xóa ứng viên khỏi danh sách Shortlist!', 'success');
      handleCloseDelete();
      fetchShortlists();
    } catch (err) {
      console.error('Lỗi xóa khỏi shortlist:', err);
      showToast(err.response?.data?.message || 'Xóa khỏi Shortlist thất bại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    shortlists,
    page,
    totalPages,
    totalElements,
    isLoading,
    deleteDialogOpen,
    itemToDelete,
    isDeleting,
    setPage,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    refetchShortlists: fetchShortlists,
  };
}
