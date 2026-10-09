import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Plus,
  Link as LinkIcon,
  Video,
  Clock,
  Star,
  CheckCircle2,
  Trash2,
  Loader2,
  X,
  Send,
  MessageSquare,
  AlertCircle,
  User,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import interviewService from '../../services/interviewService';
import jobService from '../../services/jobService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function InterviewManagementPage() {
  const { showToast } = useToast();

  const [slots, setSlots] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Job options for creating slot
  const [jobOptions, setJobOptions] = useState([]);

  // Create Slot Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [jobListingId, setJobListingId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
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

  // 1. Tải danh mục tin tuyển dụng cho modal tạo slot
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await jobService.searchJobs({ size: 100 });
        setJobOptions(res?.content || []);
        if (res?.content?.length > 0) {
          setJobListingId(res.content[0].id);
        }
      } catch (err) {
        console.error('Lỗi tải danh mục tin:', err);
      }
    }
    fetchJobs();
  }, []);

  // 2. Tải danh sách các khung giờ phỏng vấn
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

  // 3. Tạo khung giờ mới (Task 3.4 - U017)
  const handleCreateSlotSubmit = async (e) => {
    e.preventDefault();
    if (!jobListingId) {
      showToast('Vui lòng chọn vị trí tuyển dụng', 'error');
      return;
    }
    if (!startTime || !endTime) {
      showToast('Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc', 'error');
      return;
    }

    try {
      setIsCreatingSlot(true);
      // Backend nhận định dạng: YYYY-MM-DDTHH:mm:ss
      const formattedStart = startTime.length === 16 ? `${startTime}:00` : startTime;
      const formattedEnd = endTime.length === 16 ? `${endTime}:00` : endTime;

      await interviewService.createSlot({
        jobListingId: Number(jobListingId),
        startTime: formattedStart,
        endTime: formattedEnd,
        meetingLink: meetingLink.trim() || null,
      });

      showToast('Tạo khung giờ phỏng vấn thành công!', 'success');
      setCreateModalOpen(false);
      setStartTime('');
      setEndTime('');
      setMeetingLink('');
      fetchSlots();
    } catch (err) {
      console.error('Lỗi tạo khung giờ:', err);
      showToast(err.response?.data?.message || 'Tạo khung giờ phỏng vấn thất bại.', 'error');
    } finally {
      setIsCreatingSlot(false);
    }
  };

  // 4. Mở modal chấm Feedback (Task 3.4 - U019)
  const handleOpenFeedbackModal = async (slot) => {
    setSelectedSlotForFeedback(slot);
    setExistingFeedback(null);
    setFeedbackScore(8);
    setFeedbackComment('');
    setFeedbackModalOpen(true);

    try {
      setIsLoadingFeedback(true);
      const fb = await interviewService.getFeedbackBySlot(slot.id);
      if (fb) {
        setExistingFeedback(fb);
        setFeedbackScore(fb.score || 8);
        setFeedbackComment(fb.comment || '');
      }
    } catch {
      // Chưa có feedback -> bình thường
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // 5. Gửi feedback sau phỏng vấn
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedSlotForFeedback) return;
    if (!feedbackComment.trim()) {
      showToast('Vui lòng nhập nội dung nhận xét sau phỏng vấn', 'error');
      return;
    }

    try {
      setIsSubmittingFeedback(true);
      await interviewService.createFeedback({
        interviewSlotId: selectedSlotForFeedback.id,
        score: Number(feedbackScore),
        comment: feedbackComment.trim(),
      });
      showToast('Ghi nhận đánh giá sau phỏng vấn thành công!', 'success');
      setFeedbackModalOpen(false);
      fetchSlots();
    } catch (err) {
      console.error('Lỗi lưu feedback:', err);
      showToast(err.response?.data?.message || 'Lưu đánh giá thất bại.', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // 6. Xóa khung giờ phỏng vấn
  const handleConfirmDeleteSlot = async () => {
    if (!slotToDelete) return;
    try {
      setIsDeletingSlot(true);
      await interviewService.deleteSlot(slotToDelete.id);
      showToast('Đã xóa khung giờ phỏng vấn!', 'success');
      setDeleteDialogOpen(false);
      setSlotToDelete(null);
      fetchSlots();
    } catch (err) {
      console.error('Lỗi xóa slot:', err);
      showToast(err.response?.data?.message || 'Không thể xóa khung giờ đã có người đặt.', 'error');
    } finally {
      setIsDeletingSlot(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản lý Lịch Phỏng Vấn & Đánh Giá
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Tạo các khung giờ phỏng vấn (slots), theo dõi lịch ứng viên đã đặt và chấm điểm feedback
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo khung giờ mới</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Khung giờ phỏng vấn</th>
                <th className="px-5 py-3.5">Vị trí tuyển dụng</th>
                <th className="px-5 py-3.5">Meeting Link</th>
                <th className="px-5 py-3.5">Ứng viên đặt lịch</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                    <span>Đang tải danh sách khung giờ phỏng vấn...</span>
                  </td>
                </tr>
              ) : slots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Calendar className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#1E1E1E]">Chưa có khung giờ phỏng vấn nào</p>
                    <p className="text-[11px] mt-0.5">Bấm nút "Tạo khung giờ mới" để lên lịch phỏng vấn.</p>
                  </td>
                </tr>
              ) : (
                slots.map((slot) => {
                  const job = slot.jobListing;
                  const candidate = slot.application?.user;
                  const isBooked = !!slot.application;

                  return (
                    <tr key={slot.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#1E1E1E]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#F6B779]" />
                          <span>{formatDateTime(slot.startTime)}</span>
                        </div>
                        <span className="text-[#8A8073] font-normal block text-[11px] mt-0.5">
                          Đến: {formatDateTime(slot.endTime)}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                        {job?.title || 'Vị trí công việc'}
                      </td>

                      <td className="px-5 py-4">
                        {slot.meetingLink ? (
                          <a
                            href={slot.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#8C4A08] hover:underline flex items-center gap-1 max-w-xs truncate"
                          >
                            <span>Link cuộc họp</span>
                            <LinkIcon className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Trực tiếp / Chưa có</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {isBooked ? (
                          <div>
                            <span className="font-semibold text-[#1E1E1E] block">
                              {candidate?.fullName || 'Ứng viên'}
                            </span>
                            <span className="text-[11px] text-[#8A8073]">{candidate?.email}</span>
                          </div>
                        ) : (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                            Còn trống
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                            isBooked
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {isBooked ? 'Đã được đặt' : 'Chưa đặt'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isBooked ? (
                            <button
                              type="button"
                              onClick={() => handleOpenFeedbackModal(slot)}
                              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F6B779] hover:text-[#2C241E] text-[#4A3E31] border border-[#E8E2D6] rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500" />
                              <span>Feedback</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSlotToDelete(slot);
                                setDeleteDialogOpen(true);
                              }}
                              className="p-1.5 text-[#8A8073] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa khung giờ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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
      {/* MODAL TẠO KHUNG GIỜ PHỎNG VẤN (Task 3.4 - U017)           */}
      {/* ========================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isCreatingSlot && setCreateModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">Tạo Khung Giờ Phỏng Vấn</h3>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSlotSubmit} className="space-y-4">
                {/* Vị trí tuyển dụng */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                    Vị trí tuyển dụng <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={jobListingId}
                    onChange={(e) => setJobListingId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  >
                    {jobOptions.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Giờ bắt đầu & Kết thúc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Giờ bắt đầu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Giờ kết thúc <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                    Link cuộc họp trực tuyến (Google Meet / Zoom)
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/abc-def-xyz"
                    className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isCreatingSlot}
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingSlot}
                    className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isCreatingSlot && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Tạo khung giờ</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL CHẤM ĐIỂM & FEEDBACK PHỎNG VẤN (Task 3.4 - U019)    */}
      {/* ========================================================= */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSubmittingFeedback && setFeedbackModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">Đánh Giá Sau Phỏng Vấn</h3>
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingFeedback ? (
                <div className="py-8 flex flex-col items-center justify-center text-[#8A8073]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mb-2" />
                  <span className="text-xs">Đang tải thông tin đánh giá...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-xs space-y-1">
                    <p className="text-[#5C5346]">
                      Ứng viên:{' '}
                      <span className="font-semibold text-[#1E1E1E]">
                        {selectedSlotForFeedback?.application?.user?.fullName}
                      </span>
                    </p>
                    <p className="text-[#5C5346]">
                      Vị trí:{' '}
                      <span className="font-semibold text-[#1E1E1E]">
                        {selectedSlotForFeedback?.jobListing?.title}
                      </span>
                    </p>
                  </div>

                  {/* Điểm số (1-10) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#786F62] mb-1.5 flex items-center justify-between">
                      <span>Điểm đánh giá chuyên môn (Thang điểm 1 - 10)</span>
                      <span className="font-bold text-sm text-[#8C4A08]">{feedbackScore} / 10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={feedbackScore}
                      onChange={(e) => setFeedbackScore(e.target.value)}
                      className="w-full accent-[#F6B779] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#A8A196] mt-0.5">
                      <span>1 (Rất yếu)</span>
                      <span>5 (Trung bình)</span>
                      <span>10 (Xuất sắc)</span>
                    </div>
                  </div>

                  {/* Nhận xét */}
                  <div>
                    <label className="block text-xs font-semibold text-[#786F62] mb-1.5">
                      Nhận xét chi tiết & Kết luận
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Ghi nhận điểm mạnh, điểm yếu, kiến thức chuyên môn và đề xuất..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      disabled={isSubmittingFeedback}
                      onClick={() => setFeedbackModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl"
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback}
                      className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      {isSubmittingFeedback && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{existingFeedback ? 'Cập nhật Feedback' : 'Lưu đánh giá'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Slot Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa khung giờ phỏng vấn"
        message="Bạn có chắc chắn muốn xóa khung giờ này không? Chỉ có thể xóa khung giờ khi chưa có ứng viên đặt lịch."
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeletingSlot}
        onConfirm={handleConfirmDeleteSlot}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
