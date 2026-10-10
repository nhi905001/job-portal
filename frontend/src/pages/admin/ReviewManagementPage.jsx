import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Star,
  Trash2,
  Building2,
  User,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import reviewService from '../../services/reviewService';
import companyService from '../../services/companyService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function ReviewManagementPage() {
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

  // 1. Tải danh sách công ty cho dropdown lọc
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

  // 2. Tải danh sách đánh giá
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
      // Client-side filter rating nếu backend chỉ hỗ trợ lọc companyId
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

  // 3. Xóa đánh giá vi phạm (Task 4.4 - U024)
  const handleConfirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeleting(true);
      await reviewService.deleteReview(reviewToDelete.id);
      showToast('Đã xóa đánh giá vi phạm thành công!', 'success');
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      fetchReviews();
    } catch (err) {
      console.error('Lỗi xóa đánh giá:', err);
      showToast(err.response?.data?.message || 'Xóa đánh giá thất bại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
          Kiểm Duyệt Đánh Giá Doanh Nghiệp (Reviews)
        </h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Theo dõi nhận xét của ứng viên về các công ty và gỡ bỏ các đánh giá vi phạm tiêu chuẩn cộng đồng
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#EFE9DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#8A8073] hidden sm:block" />

          {/* Lọc theo doanh nghiệp */}
          <select
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              setPage(0);
            }}
            className="w-full sm:w-64 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#3A332A] focus:outline-none focus:border-[#F6B779] cursor-pointer"
          >
            <option value="">Tất cả doanh nghiệp</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Lọc theo số sao */}
          <select
            value={selectedRating}
            onChange={(e) => {
              setSelectedRating(e.target.value);
              setPage(0);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#3A332A] focus:outline-none focus:border-[#F6B779] cursor-pointer"
          >
            <option value="">Tất cả mức sao</option>
            <option value="5">5 sao (Tuyệt vời)</option>
            <option value="4">4 sao (Tốt)</option>
            <option value="3">3 sao (Bình thường)</option>
            <option value="2">2 sao (Kém)</option>
            <option value="1">1 sao (Rất tệ)</option>
          </select>
        </div>

        <div className="text-xs text-[#8A8073] self-start sm:self-auto font-medium">
          Tổng cộng: <span className="font-bold text-[#1E1E1E]">{totalElements}</span> đánh giá
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Người đánh giá</th>
                <th className="px-5 py-3.5">Doanh nghiệp</th>
                <th className="px-5 py-3.5">Đánh giá (Sao)</th>
                <th className="px-5 py-3.5">Nội dung nhận xét</th>
                <th className="px-5 py-3.5">Ngày đăng</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                    <span>Đang tải danh sách đánh giá...</span>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <MessageSquare className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#1E1E1E]">Không tìm thấy đánh giá nào</p>
                    <p className="text-[11px] mt-0.5">Thử chọn doanh nghiệp khác hoặc kiểm tra lại bộ lọc.</p>
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#1E1E1E] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#8C4A08]" />
                        <span>{r.user?.fullName || 'Ứng viên'}</span>
                      </div>
                      <span className="text-[11px] text-[#8A8073]">{r.user?.email || '—'}</span>
                    </td>

                    <td className="px-5 py-4 font-bold text-[#1E1E1E]">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#8C4A08]" />
                        <span>{r.company?.name || `Công ty #${r.companyId}`}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= r.rating
                                ? 'fill-[#F6B779] text-[#F6B779]'
                                : 'fill-transparent text-[#D4CBBF]'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#8C4A08] ml-1">
                          {r.rating}/5
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-md">
                      <p className="text-xs text-[#3A332A] whitespace-normal leading-relaxed">
                        {r.comment || <span className="italic text-[#A89E90]">Không có lời nhận xét</span>}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-[#786F62] whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setReviewToDelete(r);
                          setDeleteDialogOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-xl font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Xóa đánh giá vi phạm"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2 border-t border-[#F4EFE6]">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Confirm Dialog Xóa Đánh giá */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa Đánh Giá Vi Phạm Tiêu Chuẩn"
        message={`Bạn có chắc chắn muốn xóa đánh giá của ứng viên "${
          reviewToDelete?.user?.fullName || 'này'
        }" về công ty "${reviewToDelete?.company?.name || ''}"? Thao tác này sẽ xóa vĩnh viễn nhận xét khỏi hệ thống.`}
        confirmText="Xóa đánh giá"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteReview}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setReviewToDelete(null);
        }}
      />
    </div>
  );
}
