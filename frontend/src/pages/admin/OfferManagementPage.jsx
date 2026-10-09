import React, { useState, useEffect, useCallback } from 'react';
import {
  Gift,
  Plus,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  X,
  Building2,
  User,
  Send,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import offerService from '../../services/offerService';
import applicationService from '../../services/applicationService';
import Pagination from '../../components/common/Pagination';

export default function OfferManagementPage() {
  const { showToast } = useToast();

  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Create Offer Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [interviewingApps, setInterviewingApps] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [salary, setSalary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // 1. Tải danh sách Offers đã gửi
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

  // 2. Mở modal tạo Offer mới
  const handleOpenCreateModal = async () => {
    setCreateModalOpen(true);
    setSelectedAppId('');
    setSalary('');
    setStartDate('');
    setExpiryDate('');
    setNotes('');

    try {
      setIsLoadingApps(true);
      // Backend yêu cầu: chỉ các đơn đang ở trạng thái INTERVIEWING mới được tạo offer
      const res = await applicationService.getApplications({
        status: 'INTERVIEWING',
        size: 100,
      });
      const apps = res?.content || [];
      setInterviewingApps(apps);
      if (apps.length > 0) {
        setSelectedAppId(apps[0].id);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách ứng viên INTERVIEWING:', err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // 3. Gửi Offer mới (Task 3.5 - U020)
  const handleCreateOfferSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppId) {
      showToast('Vui lòng chọn ứng viên đủ điều kiện nhận Offer', 'error');
      return;
    }
    if (!salary || Number(salary) <= 0) {
      showToast('Mức lương đề xuất phải lớn hơn 0', 'error');
      return;
    }
    if (!startDate) {
      showToast('Vui lòng chọn ngày bắt đầu làm việc', 'error');
      return;
    }

    try {
      setIsSubmittingOffer(true);
      await offerService.createOffer({
        applicationId: Number(selectedAppId),
        salary: Number(salary),
        startDate,
        expiryDate: expiryDate || null,
        notes: notes.trim() || null,
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

  const formatSalary = (amount) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND / tháng';
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
          label: 'Chờ phản hồi',
          className: 'bg-amber-50 text-amber-800 border-amber-200/80',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'ACCEPTED':
        return {
          label: 'Đã chấp nhận',
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản lý Thư Mời Nhận Việc (Offers)
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Gửi Offer cho ứng viên sau phỏng vấn và theo dõi quyết định chấp nhận hoặc từ chối
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo & Gửi Offer mới</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Ứng viên nhận Offer</th>
                <th className="px-5 py-3.5">Vị trí ứng tuyển</th>
                <th className="px-5 py-3.5">Mức lương đề xuất</th>
                <th className="px-5 py-3.5">Ngày nhận việc</th>
                <th className="px-5 py-3.5">Hạn phản hồi</th>
                <th className="px-5 py-3.5">Trạng thái Offer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                    <span>Đang tải danh sách Offers...</span>
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Gift className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#1E1E1E]">Chưa có Offer nào được gửi</p>
                    <p className="text-[11px] mt-0.5">
                      Bấm nút "Tạo & Gửi Offer mới" để gửi lời mời nhận việc cho ứng viên sau phỏng vấn.
                    </p>
                  </td>
                </tr>
              ) : (
                offers.map((offer) => {
                  const badge = getStatusBadge(offer.status);
                  const candidate = offer.application?.user;
                  const job = offer.application?.jobListing;

                  return (
                    <tr key={offer.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#1E1E1E] block">
                          {candidate?.fullName || 'Ứng viên'}
                        </span>
                        <span className="text-[#8A8073] text-[11px]">{candidate?.email}</span>
                      </td>

                      <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                        {job?.title || 'Vị trí công việc'}
                      </td>

                      <td className="px-5 py-4 font-bold text-emerald-800">
                        {formatSalary(offer.salary)}
                      </td>

                      <td className="px-5 py-4 text-[#4A4135]">
                        {formatDate(offer.startDate)}
                      </td>

                      <td className="px-5 py-4 text-[#786F62]">
                        {formatDate(offer.expiryDate)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border inline-flex items-center gap-1.5 ${badge.className}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
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

      {/* ========================================================= */}
      {/* MODAL TẠO & GỬI OFFER MỚI (Task 3.5 - U020)               */}
      {/* ========================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSubmittingOffer && setCreateModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">Tạo Thư Mời Nhận Việc (Offer)</h3>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingApps ? (
                <div className="py-8 flex flex-col items-center justify-center text-[#8A8073]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mb-2" />
                  <span className="text-xs">Đang tìm các ứng viên đủ điều kiện nhận Offer...</span>
                </div>
              ) : interviewingApps.length === 0 ? (
                <div className="py-8 text-center text-[#8A8073] bg-[#FAF7F2]/60 rounded-2xl border border-[#F0EAE0]">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#1E1E1E]">
                    Chưa có ứng viên ở trạng thái INTERVIEWING
                  </p>
                  <p className="text-[11px] text-[#786F62] mt-1 max-w-xs mx-auto">
                    Theo quy trình hệ thống, ứng viên phải vượt qua phỏng vấn (trạng thái đơn
                    INTERVIEWING) mới có thể nhận Offer.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateOfferSubmit} className="space-y-4">
                  {/* Chọn đơn ứng tuyển */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Chọn ứng viên nhận Offer <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    >
                      {interviewingApps.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.user?.fullName} ({app.user?.email}) — {app.jobListing?.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lương đề xuất */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Mức lương khởi điểm (VND / tháng) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1000000"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="Ví dụ: 30000000"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                      />
                      <DollarSign className="w-4 h-4 text-[#9E9587] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Ngày bắt đầu & Hạn phản hồi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                        Ngày bắt đầu làm việc <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                        Hạn phản hồi Offer
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                      />
                    </div>
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Ghi chú / Lời chúc mừng
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Chào mừng bạn gia nhập công ty! Chi tiết về hợp đồng và thiết bị làm việc..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      disabled={isSubmittingOffer}
                      onClick={() => setCreateModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingOffer}
                      className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      {isSubmittingOffer && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Offer</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
