import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Eye,
  CheckSquare,
  XCircle,
  ExternalLink,
  Loader2,
  Building2,
  Calendar,
  User,
  Phone,
  Clock,
  X,
  Send,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import applicationService from '../../services/applicationService';
import shortlistService from '../../services/shortlistService';
import jobService from '../../services/jobService';
import profileService from '../../services/profileService';
import fileService from '../../services/fileService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function ApplicationManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const initialJobListingId = searchParams.get('jobListingId') || '';

  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState(initialJobListingId);
  const [statusFilter, setStatusFilter] = useState('');
  const [jobOptions, setJobOptions] = useState([]);

  // Shortlist Modal State
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [appToShortlist, setAppToShortlist] = useState(null);
  const [shortlistNote, setShortlistNote] = useState('');
  const [isShortlisting, setIsShortlisting] = useState(false);

  // Reject Confirm Dialog State
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [appToReject, setAppToReject] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // View Candidate Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [selectedAppForView, setSelectedAppForView] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // 1. Tải danh sách tin tuyển dụng cho dropdown filter
  useEffect(() => {
    async function fetchJobsForFilter() {
      try {
        const res = await jobService.searchJobs({ size: 100 });
        setJobOptions(res?.content || []);
      } catch (err) {
        console.error('Lỗi tải danh mục tin:', err);
      }
    }
    fetchJobsForFilter();
  }, []);

  // 2. Tải danh sách đơn ứng tuyển
  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        jobListingId: selectedJobId || undefined,
        status: statusFilter || undefined,
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      };
      const res = await applicationService.getApplications(params);
      setApplications(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn ứng tuyển:', err);
      showToast('Không thể tải danh sách đơn ứng tuyển.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedJobId, statusFilter, page, showToast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Đổi tin tuyển dụng lọc
  const handleJobFilterChange = (e) => {
    const val = e.target.value;
    setSelectedJobId(val);
    setPage(0);
    if (val) {
      setSearchParams({ jobListingId: val });
    } else {
      setSearchParams({});
    }
  };

  // Mở modal xem hồ sơ ứng viên
  const handleViewCandidateProfile = async (app) => {
    setSelectedAppForView(app);
    setProfileModalOpen(true);
    try {
      setIsLoadingProfile(true);
      if (app.user?.id) {
        const p = await profileService.getProfileByUserId(app.user.id);
        setCandidateProfile(p);
      }
    } catch (err) {
      console.error('Lỗi tải hồ sơ ứng viên:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Mở modal thêm vào Shortlist (Task 3.3 - U015)
  const handleOpenShortlistModal = (app) => {
    setAppToShortlist(app);
    setShortlistNote('Ứng viên tiềm năng, kỹ năng và kinh nghiệm phù hợp');
    setShortlistModalOpen(true);
  };

  // Xác nhận thêm vào Shortlist
  const handleConfirmShortlist = async (e) => {
    e.preventDefault();
    if (!appToShortlist) return;
    try {
      setIsShortlisting(true);
      await shortlistService.addToShortlist({
        applicationId: appToShortlist.id,
        note: shortlistNote.trim(),
      });
      showToast('Đã đưa ứng viên vào danh sách Shortlist thành công!', 'success');
      setShortlistModalOpen(false);
      setAppToShortlist(null);
      fetchApplications();
    } catch (err) {
      console.error('Lỗi đưa vào shortlist:', err);
      showToast(err.response?.data?.message || 'Thêm vào shortlist thất bại.', 'error');
    } finally {
      setIsShortlisting(false);
    }
  };

  // Xác nhận từ chối đơn
  const handleConfirmReject = async () => {
    if (!appToReject) return;
    try {
      setIsRejecting(true);
      await applicationService.updateStatus(appToReject.id, 'REJECTED');
      showToast('Đã chuyển trạng thái đơn sang TỪ CHỐI (REJECTED).', 'info');
      setRejectDialogOpen(false);
      setAppToReject(null);
      fetchApplications();
    } catch (err) {
      console.error('Lỗi từ chối đơn:', err);
      showToast(err.response?.data?.message || 'Cập nhật trạng thái thất bại.', 'error');
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return {
          label: 'Mới nộp (APPLIED)',
          className: 'bg-amber-50 text-amber-800 border-amber-200/80',
        };
      case 'SHORTLISTED':
        return {
          label: 'Đã Shortlist',
          className: 'bg-blue-50 text-blue-700 border-blue-200/80',
        };
      case 'INTERVIEWING':
        return {
          label: 'Đang phỏng vấn',
          className: 'bg-purple-50 text-purple-700 border-purple-200/80',
        };
      case 'OFFERED':
        return {
          label: 'Đã gửi Offer',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        };
      case 'REJECTED':
        return {
          label: 'Từ chối (REJECTED)',
          className: 'bg-rose-50 text-rose-700 border-rose-200/80',
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
          Quản lý Đơn Ứng Tuyển & Duyệt CV
        </h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Theo dõi hồ sơ ứng viên nộp theo từng tin tuyển dụng, đưa vào Shortlist hoặc chuyển trạng thái
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EFE9DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Lọc theo tin tuyển dụng */}
          <select
            value={selectedJobId}
            onChange={handleJobFilterChange}
            className="w-full sm:w-72 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#3A332A] focus:outline-none focus:border-[#F6B779] cursor-pointer"
          >
            <option value="">Tất cả tin tuyển dụng</option>
            {jobOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          {/* Lọc theo trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#4A4135] focus:outline-none focus:border-[#F6B779] cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="APPLIED">APPLIED (Mới nộp)</option>
            <option value="SHORTLISTED">SHORTLISTED (Đã chọn)</option>
            <option value="INTERVIEWING">INTERVIEWING (Đang phỏng vấn)</option>
            <option value="OFFERED">OFFERED (Đã gửi offer)</option>
            <option value="REJECTED">REJECTED (Từ chối)</option>
          </select>
        </div>

        {selectedJobId && (
          <button
            type="button"
            onClick={() => {
              setSelectedJobId('');
              setSearchParams({});
            }}
            className="text-xs text-rose-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa lọc tin</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Ứng viên</th>
                <th className="px-5 py-3.5">Vị trí ứng tuyển</th>
                <th className="px-5 py-3.5">Hồ sơ CV đính kèm</th>
                <th className="px-5 py-3.5">Ngày nộp</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                    <span>Đang tải danh sách đơn ứng tuyển...</span>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <FileText className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#1E1E1E]">Không tìm thấy đơn ứng tuyển nào</p>
                    <p className="text-[11px] mt-0.5">Thử thay đổi bộ lọc tin tuyển dụng hoặc trạng thái.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const badge = getStatusBadge(app.status);
                  return (
                    <tr key={app.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#1E1E1E] block">
                          {app.user?.fullName || 'Ứng viên'}
                        </span>
                        <span className="text-[#8A8073] text-[11px]">{app.user?.email}</span>
                      </td>

                      <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                        <Link
                          to={`/jobs/${app.jobListing?.id}`}
                          target="_blank"
                          className="hover:text-[#B86E20] transition-colors"
                        >
                          {app.jobListing?.title || 'Vị trí công việc'}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        {app.cvUrl ? (
                          <a
                            href={fileService.getFullFileUrl(app.cvUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF7F2] hover:bg-white border border-[#E2DAD0] rounded-xl text-xs font-semibold text-[#8C4A08] transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Xem CV</span>
                            <ExternalLink className="w-3 h-3 text-[#A89E90]" />
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Không có CV</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-[#786F62]">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút xem chi tiết profile */}
                          <button
                            type="button"
                            onClick={() => handleViewCandidateProfile(app)}
                            className="p-1.5 text-[#6B6152] hover:text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết hồ sơ & thư ngỏ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Nếu đang APPLIED -> Cho phép đưa vào Shortlist */}
                          {app.status === 'APPLIED' && (
                            <button
                              type="button"
                              onClick={() => handleOpenShortlistModal(app)}
                              className="px-2.5 py-1 text-[#2C241E] bg-[#F6B779] hover:bg-[#EEA861] rounded-xl font-semibold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                              title="Đưa vào danh sách Shortlist"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Shortlist</span>
                            </button>
                          )}

                          {/* Nút từ chối đơn (nếu chưa bị từ chối) */}
                          {app.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => {
                                setAppToReject(app);
                                setRejectDialogOpen(true);
                              }}
                              className="p-1.5 text-[#8A8073] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Từ chối đơn ứng tuyển"
                            >
                              <XCircle className="w-4 h-4" />
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
      {/* MODAL XEM CHI TIẾT HỒ SƠ ỨNG VIÊN                         */}
      {/* ========================================================= */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setProfileModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">Hồ sơ ứng viên</h3>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingProfile ? (
                <div className="py-8 flex flex-col items-center justify-center text-[#8A8073]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mb-2" />
                  <span className="text-xs">Đang tải thông tin hồ sơ...</span>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Basic user info */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-[#FAF7F2] border border-[#E8E2D6] rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E2DAD0] flex items-center justify-center overflow-hidden shrink-0">
                      {candidateProfile?.avatarUrl ? (
                        <img
                          src={fileService.getFullFileUrl(candidateProfile.avatarUrl)}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-[#A89E90]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E1E1E]">
                        {selectedAppForView?.user?.fullName}
                      </h4>
                      <p className="text-[#786F62]">{selectedAppForView?.user?.email}</p>
                      {candidateProfile?.phone && (
                        <p className="text-[#3A332A] mt-0.5 font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#A89E90]" />
                          <span>{candidateProfile.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {candidateProfile?.summary && (
                    <div>
                      <span className="font-semibold text-[#786F62] uppercase tracking-wider text-[11px] block mb-1">
                        Tóm tắt bản thân & Kỹ năng
                      </span>
                      <p className="p-3 bg-[#FAF7F2]/60 border border-[#F0EAE0] rounded-xl text-[#3A332A] leading-relaxed">
                        {candidateProfile.summary}
                      </p>
                    </div>
                  )}

                  {/* Cover letter */}
                  {selectedAppForView?.coverLetter && (
                    <div>
                      <span className="font-semibold text-[#786F62] uppercase tracking-wider text-[11px] block mb-1">
                        Thư ngỏ gửi nhà tuyển dụng
                      </span>
                      <p className="p-3 bg-[#FAF7F2]/60 border border-[#F0EAE0] rounded-xl text-[#3A332A] leading-relaxed whitespace-pre-line">
                        {selectedAppForView.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* CV download */}
                  {selectedAppForView?.cvUrl && (
                    <div className="pt-2">
                      <a
                        href={fileService.getFullFileUrl(selectedAppForView.cvUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Mở file CV đính kèm trực tuyến</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL ĐƯA ỨNG VIÊN VÀO SHORTLIST (Task 3.3 - U015)       */}
      {/* ========================================================= */}
      {shortlistModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isShortlisting && setShortlistModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">Đưa vào Shortlist</h3>
                <button
                  type="button"
                  onClick={() => setShortlistModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmShortlist} className="space-y-4">
                <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-xs space-y-1">
                  <p className="text-[#5C5346]">
                    Ứng viên: <span className="font-semibold text-[#1E1E1E]">{appToShortlist?.user?.fullName}</span>
                  </p>
                  <p className="text-[#5C5346]">
                    Vị trí: <span className="font-semibold text-[#1E1E1E]">{appToShortlist?.jobListing?.title}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#786F62] mb-1.5">
                    Ghi chú đánh giá (Note)
                  </label>
                  <textarea
                    rows={3}
                    value={shortlistNote}
                    onChange={(e) => setShortlistNote(e.target.value)}
                    placeholder="Nhập lý do chọn ứng viên vào danh sách rút gọn..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isShortlisting}
                    onClick={() => setShortlistModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isShortlisting}
                    className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    {isShortlisting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Xác nhận Shortlist</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reject Dialog */}
      <ConfirmDialog
        isOpen={rejectDialogOpen}
        title="Từ chối đơn ứng tuyển"
        message={`Bạn có chắc chắn muốn TỪ CHỐI đơn ứng tuyển của ứng viên "${appToReject?.user?.fullName}" không? Trạng thái đơn sẽ được cập nhật thành REJECTED.`}
        confirmText="Xác nhận từ chối"
        cancelText="Hủy"
        variant="danger"
        isLoading={isRejecting}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectDialogOpen(false)}
      />
    </div>
  );
}
