import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Gift,
  Building2,
  Calendar,
  DollarSign,
  Check,
  X,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import offerService from '../../services/offerService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function MyOffersPage() {
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

  // 1. Tải danh sách offer từ GET /api/offers/my
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

  // 2. Mở dialog phản hồi
  const handleOpenRespondDialog = (offer, accept) => {
    setSelectedOffer(offer);
    setRespondAction(accept);
    setConfirmDialogOpen(true);
  };

  // 3. Thực hiện phản hồi Offer
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
      setConfirmDialogOpen(false);
      setSelectedOffer(null);
      fetchOffers();
    } catch (err) {
      console.error('Lỗi khi phản hồi Offer:', err);
      showToast(err.response?.data?.message || 'Phản hồi Offer thất bại.', 'error');
    } finally {
      setIsResponding(false);
    }
  };

  const formatSalary = (amount) => {
    if (!amount) return 'Thỏa thuận';
    return (
      new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount) + ' VND / tháng'
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Chờ bạn phản hồi',
          className: 'bg-amber-50 text-amber-800 border-amber-200/80',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'ACCEPTED':
        return {
          label: 'Đã chấp nhận Offer',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'REJECTED':
        return {
          label: 'Đã từ chối',
          className: 'bg-rose-50 text-rose-700 border-rose-200/80',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'EXPIRED':
        return {
          label: 'Đã hết hạn',
          className: 'bg-gray-50 text-gray-600 border-gray-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-gray-500" />,
        };
      default:
        return {
          label: status,
          className: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#EFE9DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
            Thư mời nhận việc (Offers)
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Xem xét các lời mời làm việc chính thức từ nhà tuyển dụng và gửi phản hồi
          </p>
        </div>
        <Link
          to="/my-applications"
          className="text-xs font-semibold px-4 py-2 bg-white border border-[#E0D8CB] hover:bg-[#FAF7F2] rounded-xl text-[#3A332A] transition-colors self-start sm:self-auto"
        >
          Xem đơn ứng tuyển
        </Link>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#8A8073]">
          <Loader2 className="w-8 h-8 animate-spin text-[#F6B779] mb-3" />
          <p className="text-xs font-medium">Đang tải danh sách thư mời nhận việc...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-12 text-center text-[#8A8073]">
          <Gift className="w-12 h-12 text-[#C4BDB0] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1E1E1E]">Bạn chưa có thư mời nhận việc nào</h3>
          <p className="text-xs text-[#786F62] mt-1 mb-5">
            Khi nhà tuyển dụng hoàn tất đánh giá phỏng vấn và gửi Offer, thông tin sẽ xuất hiện tại
            đây.
          </p>
          <Link
            to="/my-applications"
            className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E2DAD0] text-[#3A332A] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <span>Kiểm tra tiến độ đơn ứng tuyển</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const badge = getStatusBadge(offer.status);
            const job = offer.application?.jobListing;
            const company = job?.company || job?.recruiter?.company;

            return (
              <div
                key={offer.id}
                className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-7 shadow-xs hover:border-[#E8E1D4] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#F4EFE6] pb-5 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${badge.className}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      {offer.createdAt && (
                        <span className="text-[11px] text-[#8A8073]">
                          Nhận ngày: {formatDate(offer.createdAt)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#1E1E1E]">
                      {job?.title || 'Vị trí công việc'}
                    </h3>
                    <p className="text-xs text-[#786F62] flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-[#A89E90]" />
                      <span className="font-medium text-[#3A332A]">
                        {company?.name || 'Doanh nghiệp'}
                      </span>
                    </p>
                  </div>

                  {/* Actions khi trạng thái là PENDING */}
                  {offer.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenRespondDialog(offer, true)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Chấp nhận Offer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenRespondDialog(offer, false)}
                        className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Từ chối</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Offer Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="p-3.5 bg-[#FAF7F2]/70 border border-[#F0EAE0] rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#8A8073] block">Mức lương đề xuất</span>
                      <span className="font-bold text-[#1E1E1E] text-xs sm:text-sm">
                        {formatSalary(offer.salary)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F2]/70 border border-[#F0EAE0] rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#8A8073] block">Ngày nhận việc</span>
                      <span className="font-bold text-[#1E1E1E] text-xs sm:text-sm">
                        {formatDate(offer.startDate)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F2]/70 border border-[#F0EAE0] rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#8A8073] block">Hạn phản hồi</span>
                      <span className="font-bold text-[#1E1E1E] text-xs sm:text-sm">
                        {formatDate(offer.expiryDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {offer.notes && (
                  <div className="p-3.5 bg-[#FAF7F2]/50 border border-[#F0EAE0] rounded-2xl text-xs text-[#5C5346]">
                    <span className="font-semibold text-[#1E1E1E]">Ghi chú từ nhà tuyển dụng: </span>
                    <span>{offer.notes}</span>
                  </div>
                )}
              </div>
            );
          })}

          <div className="bg-white border border-[#EFE9DF] rounded-2xl px-4 py-1">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={10}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}

      {/* Dialog xác nhận phản hồi Offer */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        title={respondAction ? 'Chấp nhận lời mời làm việc' : 'Từ chối lời mời làm việc'}
        message={
          respondAction
            ? `Bạn có chắc chắn muốn CHẤP NHẬN Offer cho vị trí "${selectedOffer?.application?.jobListing?.title}" với mức lương ${formatSalary(
                selectedOffer?.salary
              )} không?`
            : `Bạn có chắc chắn muốn TỪ CHỐI Offer cho vị trí "${selectedOffer?.application?.jobListing?.title}" không? Hành động này sẽ thông báo tới nhà tuyển dụng.`
        }
        confirmText={respondAction ? 'Đồng ý nhận việc' : 'Xác nhận từ chối'}
        cancelText="Xem lại"
        variant={respondAction ? 'primary' : 'danger'}
        isLoading={isResponding}
        onConfirm={handleConfirmResponse}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </div>
  );
}
