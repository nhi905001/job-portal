import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  ExternalLink,
  Trash2,
  Video,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import applicationService from '../../services/applicationService';
import interviewService from '../../services/interviewService';
import fileService from '../../services/fileService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function MyApplicationsPage() {
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

  // 1. Tải danh sách đơn từ GET /api/applications/my
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

  // 2. Rút đơn ứng tuyển (DELETE /api/applications/{id})
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

  // 3. Mở modal chọn khung giờ phỏng vấn
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

  // 4. Đặt lịch phỏng vấn
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

  // Badge màu sắc cho từng trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return {
          label: 'Đã nộp đơn',
          className: 'bg-amber-50 text-amber-800 border-amber-200/80',
        };
      case 'SHORTLISTED':
        return {
          label: 'Đã vào Shortlist',
          className: 'bg-blue-50 text-blue-700 border-blue-200/80',
        };
      case 'INTERVIEWING':
        return {
          label: 'Đang phỏng vấn',
          className: 'bg-purple-50 text-purple-700 border-purple-200/80',
        };
      case 'OFFERED':
        return {
          label: 'Đã nhận Offer',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        };
      case 'REJECTED':
        return {
          label: 'Đã từ chối',
          className: 'bg-rose-50 text-rose-700 border-rose-200/80',
        };
      default:
        return {
          label: status,
          className: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#EFE9DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">Đơn ứng tuyển của tôi</h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Theo dõi tiến độ duyệt hồ sơ, đặt lịch phỏng vấn và nhận offer việc làm
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-semibold px-4 py-2 bg-white border border-[#E0D8CB] hover:bg-[#FAF7F2] rounded-xl text-[#3A332A] transition-colors self-start sm:self-auto"
        >
          Tìm thêm việc làm
        </Link>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#8A8073]">
          <Loader2 className="w-8 h-8 animate-spin text-[#F6B779] mb-3" />
          <p className="text-xs font-medium">Đang tải danh sách đơn ứng tuyển...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-12 text-center text-[#8A8073]">
          <FileText className="w-12 h-12 text-[#C4BDB0] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1E1E1E]">Bạn chưa ứng tuyển vị trí nào</h3>
          <p className="text-xs text-[#786F62] mt-1 mb-5">
            Hãy khám phá các cơ hội việc làm hấp dẫn và nộp hồ sơ ngay hôm nay.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Khám phá việc làm</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {applications.map((app) => {
            const statusBadge = getStatusBadge(app.status);
            const job = app.jobListing;
            const company = job?.company || job?.recruiter?.company;

            return (
              <div
                key={app.id}
                className="bg-white border border-[#EFE9DF] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E5DDD0] transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                    <span className="text-[11px] text-[#8A8073]">
                      Nộp ngày: {formatDateTime(app.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1E1E1E] truncate">
                    <Link to={`/jobs/${job?.id}`} className="hover:text-[#B86E20] transition-colors">
                      {job?.title || 'Vị trí công việc'}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#786F62]">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#A89E90]" />
                      <span className="font-medium text-[#3A332A]">{company?.name || 'Doanh nghiệp'}</span>
                    </div>

                    {app.cvUrl && (
                      <a
                        href={fileService.getFullFileUrl(app.cvUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#C27E38] hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Xem CV đã nộp</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {app.coverLetter && (
                    <p className="text-xs text-[#6B6152] bg-[#FAF7F2]/60 p-2.5 rounded-xl line-clamp-2 mt-2">
                      <span className="font-semibold text-[#3A332A]">Thư ngỏ: </span>
                      {app.coverLetter}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
                  {/* Nếu SHORTLISTED hoặc INTERVIEWING -> Nút chọn giờ phỏng vấn */}
                  {(app.status === 'SHORTLISTED' || app.status === 'INTERVIEWING') && (
                    <button
                      type="button"
                      onClick={() => handleOpenInterviewModal(app)}
                      className="px-4 py-2 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Chọn giờ phỏng vấn</span>
                    </button>
                  )}

                  {/* Nếu OFFERED -> Nút chuyển sang trang my-offers */}
                  {app.status === 'OFFERED' && (
                    <Link
                      to="/my-offers"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>Xem Offer việc làm</span>
                    </Link>
                  )}

                  {/* Nếu APPLIED -> Được phép rút đơn */}
                  {app.status === 'APPLIED' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAppToWithdraw(app);
                        setWithdrawDialogOpen(true);
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Rút đơn</span>
                    </button>
                  )}
                </div>
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

      {/* ========================================================= */}
      {/* DIALOG XÁC NHẬN RÚT ĐƠN (Task 2.5 - U012)                 */}
      {/* ========================================================= */}
      <ConfirmDialog
        isOpen={withdrawDialogOpen}
        title="Rút đơn ứng tuyển"
        message={`Bạn có chắc chắn muốn rút đơn ứng tuyển cho vị trí "${selectedAppToWithdraw?.jobListing?.title}" không? Hành động này sẽ hủy bỏ đơn ứng tuyển của bạn.`}
        confirmText="Xác nhận rút đơn"
        cancelText="Đóng"
        variant="danger"
        isLoading={isWithdrawing}
        onConfirm={handleConfirmWithdraw}
        onCancel={() => setWithdrawDialogOpen(false)}
      />

      {/* ========================================================= */}
      {/* MODAL CHỌN GIỜ PHỎNG VẤN (Task 2.6 - U018)                */}
      {/* ========================================================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isBookingSlot && setBookingModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1E1E1E]">Chọn khung giờ phỏng vấn</h3>
                  <p className="text-xs text-[#8A8073] mt-0.5 truncate max-w-sm">
                    {selectedAppForInterview?.jobListing?.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {isLoadingSlots ? (
                  <div className="py-8 flex flex-col items-center justify-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mb-2" />
                    <span className="text-xs">Đang tải các khung giờ còn trống...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="py-8 text-center text-[#8A8073] bg-[#FAF7F2]/60 rounded-2xl border border-[#F0EAE0]">
                    <Clock className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#1E1E1E]">Hiện chưa có khung giờ trống</p>
                    <p className="text-[11px] text-[#786F62] mt-1">
                      Nhà tuyển dụng sẽ sớm bổ sung các khung giờ mới. Vui lòng quay lại sau!
                    </p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-2.5">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-3.5 border border-[#E6E0D6] rounded-2xl bg-[#FAF7F2]/40 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2 font-semibold text-[#1E1E1E]">
                            <Calendar className="w-3.5 h-3.5 text-[#F6B779]" />
                            <span>
                              {formatDateTime(slot.startTime)} -{' '}
                              {new Date(slot.endTime).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {slot.meetingLink && (
                            <div className="flex items-center gap-1.5 text-[11px] text-blue-600">
                              <Video className="w-3 h-3" />
                              <span className="truncate max-w-[200px]">{slot.meetingLink}</span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isBookingSlot}
                          onClick={() => handleBookSlot(slot.id)}
                          className="px-3.5 py-1.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-60"
                        >
                          {isBookingSlot ? 'Đang đặt...' : 'Đặt lịch'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#F4EFE6] flex justify-end">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
