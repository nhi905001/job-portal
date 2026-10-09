import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Eye,
  Loader2,
  X,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import jobService from '../../services/jobService';
import companyService from '../../services/companyService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function JobManagementPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dropdown options
  const [industries, setIndustries] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  // Create / Edit Modal State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [jobTypeId, setJobTypeId] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [companyLocationId, setCompanyLocationId] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');

  // Delete Confirm Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Tải danh mục hỗ trợ
  useEffect(() => {
    async function loadOptions() {
      try {
        const [indRes, typeRes, locRes] = await Promise.all([
          companyService.getIndustries({ size: 100 }),
          companyService.getJobTypes({ size: 100 }),
          companyService.getLocations({
            companyId: user?.role === 'RECRUITER' ? user?.company?.id : undefined,
            size: 100,
          }),
        ]);
        setIndustries(indRes?.content || []);
        setJobTypes(typeRes?.content || []);
        setLocations(locRes?.content || []);
      } catch (err) {
        console.error('Lỗi tải danh mục options:', err);
      }
    }
    loadOptions();
  }, [user]);

  // 2. Tải danh sách tin tuyển dụng
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        keyword: keyword.trim(),
        status: statusFilter || undefined,
        recruiterId: user?.role === 'RECRUITER' ? user.id : undefined,
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      };
      const res = await jobService.searchJobs(params);
      setJobs(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải tin tuyển dụng:', err);
      showToast('Không thể tải danh sách tin tuyển dụng.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [keyword, statusFilter, user, page, showToast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset form
  const resetForm = () => {
    setTitle('');
    setJobTypeId('');
    setIndustryId('');
    setCompanyLocationId('');
    setSalaryMin('');
    setSalaryMax('');
    setDeadline('');
    setStatus('OPEN');
    setResponsibilities('');
    setRequirements('');
    setBenefits('');
    setIsEditing(false);
    setEditingJobId(null);
  };

  // Mở modal tạo mới
  const handleOpenCreateModal = () => {
    resetForm();
    if (jobTypes.length > 0) setJobTypeId(jobTypes[0].id);
    if (industries.length > 0) setIndustryId(industries[0].id);
    if (locations.length > 0) setCompanyLocationId(locations[0].id);
    setJobModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = async (job) => {
    try {
      setIsSaving(true);
      const detail = await jobService.getJobById(job.id);
      const jl = detail.jobListing;
      const desc = detail.description;

      setTitle(jl.title || '');
      setJobTypeId(jl.jobType?.id || '');
      setIndustryId(jl.industry?.id || '');
      setCompanyLocationId(jl.companyLocation?.id || '');
      setSalaryMin(jl.salaryMin || '');
      setSalaryMax(jl.salaryMax || '');
      setDeadline(jl.deadline ? jl.deadline.split('T')[0] : '');
      setStatus(jl.status || 'OPEN');

      setResponsibilities(desc?.responsibilities || '');
      setRequirements(desc?.requirements || '');
      setBenefits(desc?.benefits || '');

      setIsEditing(true);
      setEditingJobId(job.id);
      setJobModalOpen(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết tin để sửa:', err);
      showToast('Không thể tải chi tiết tin để chỉnh sửa.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit tạo/sửa tin
  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Vui lòng nhập tiêu đề tin tuyển dụng', 'error');
      return;
    }
    if (!jobTypeId) {
      showToast('Vui lòng chọn loại hình công việc', 'error');
      return;
    }
    if (!industryId) {
      showToast('Vui lòng chọn ngành nghề', 'error');
      return;
    }
    if (!companyLocationId) {
      showToast('Vui lòng chọn địa điểm làm việc', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      jobTypeId: Number(jobTypeId),
      industryId: Number(industryId),
      companyLocationId: Number(companyLocationId),
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      deadline: deadline || null,
      status,
      description: {
        responsibilities: responsibilities.trim(),
        requirements: requirements.trim(),
        benefits: benefits.trim(),
      },
    };

    try {
      setIsSaving(true);
      if (isEditing) {
        await jobService.updateJob(editingJobId, payload);
        showToast('Cập nhật tin tuyển dụng thành công!', 'success');
      } else {
        await jobService.createJob(payload);
        showToast('Đăng tin tuyển dụng mới thành công!', 'success');
      }
      setJobModalOpen(false);
      resetForm();
      fetchJobs();
    } catch (err) {
      console.error('Lỗi khi lưu tin tuyển dụng:', err);
      showToast(err.response?.data?.message || 'Lưu tin tuyển dụng thất bại.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Xóa tin
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      setIsDeleting(true);
      await jobService.deleteJob(jobToDelete.id);
      showToast('Đã xóa tin tuyển dụng thành công!', 'success');
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (err) {
      console.error('Lỗi xóa tin:', err);
      const msg =
        err.response?.status === 409
          ? 'Không thể xóa tin tuyển dụng đã có ứng viên nộp hồ sơ. Bạn hãy chuyển trạng thái sang ĐÃ ĐÓNG (CLOSED).'
          : err.response?.data?.message || 'Xóa tin tuyển dụng thất bại.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (num) => (num / 1000000).toFixed(0) + 'M';
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'DRAFT':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản lý Tin Tuyển Dụng
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Đăng mới, chỉnh sửa, theo dõi trạng thái và quản lý các vị trí tuyển dụng
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tin tuyển dụng mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EFE9DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9E9587] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            placeholder="Tìm theo tiêu đề tin tuyển dụng..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#4A4135] focus:outline-none focus:border-[#F6B779] cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">Đang tuyển (OPEN)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Tiêu đề tin tuyển dụng</th>
                <th className="px-5 py-3.5">Loại việc / Ngành</th>
                <th className="px-5 py-3.5">Địa điểm</th>
                <th className="px-5 py-3.5">Mức lương</th>
                <th className="px-5 py-3.5">Hạn nộp</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                    <span>Đang tải danh sách tin tuyển dụng...</span>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#8A8073]">
                    <Briefcase className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#1E1E1E]">Chưa có tin tuyển dụng nào</p>
                    <p className="text-[11px] mt-0.5">Bấm nút "Tạo tin tuyển dụng mới" để bắt đầu nhận hồ sơ ứng viên.</p>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#1E1E1E] leading-snug">{job.title}</div>
                      <div className="text-[11px] text-[#8A8073] mt-0.5">
                        {job.company?.name || job.recruiter?.company?.name || 'Doanh nghiệp'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-[#1E1E1E]">{job.jobType?.name || '—'}</span>
                      <span className="text-[#8A8073] block text-[11px]">{job.industry?.name || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-[#6B6152]">
                      {job.companyLocation?.city || job.companyLocation?.address || 'Toàn quốc'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-800">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </td>
                    <td className="px-5 py-4 text-[#786F62]">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${getStatusBadge(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/applications?jobListingId=${job.id}`}
                          className="p-1.5 text-[#5C5346] hover:text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                          title="Xem danh sách ứng viên nộp đơn"
                        >
                          <Users className="w-4 h-4 text-blue-600" />
                        </Link>
                        <Link
                          to={`/jobs/${job.id}`}
                          target="_blank"
                          className="p-1.5 text-[#8A8073] hover:text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                          title="Xem trang công khai"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(job)}
                          className="p-1.5 text-[#8A8073] hover:text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                          title="Chỉnh sửa tin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setJobToDelete(job);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-1.5 text-[#8A8073] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa tin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* ========================================================= */}
      {/* MODAL TẠO / SỬA TIN TUYỂN DỤNG (Task 3.1 - U004, U005)    */}
      {/* ========================================================= */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSaving && setJobModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#EFE9DF] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4 mb-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1E1E]">
                    {isEditing ? 'Chỉnh sửa Tin Tuyển Dụng' : 'Tạo Tin Tuyển Dụng Mới'}
                  </h3>
                  <p className="text-xs text-[#8A8073] mt-0.5">
                    Điền đầy đủ thông tin vị trí và mô tả công việc để thu hút ứng viên
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-4">
                {/* Tiêu đề */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                    Tiêu đề tin tuyển dụng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Senior Frontend Developer (React / TypeScript)"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20"
                  />
                </div>

                {/* 3 Selects: Loại việc, Ngành, Địa điểm */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Loại việc <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={jobTypeId}
                      onChange={(e) => setJobTypeId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    >
                      <option value="">Chọn loại việc</option>
                      {jobTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Ngành nghề <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={industryId}
                      onChange={(e) => setIndustryId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    >
                      <option value="">Chọn ngành nghề</option>
                      {industries.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Địa điểm <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={companyLocationId}
                      onChange={(e) => setCompanyLocationId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    >
                      <option value="">Chọn địa điểm</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.city ? `${loc.city} - ${loc.address}` : loc.address}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Lương & Hạn nộp & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Lương tối thiểu (VND)
                    </label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="15000000"
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Lương tối đa (VND)
                    </label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="25000000"
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Hạn nộp hồ sơ
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Trạng thái tin
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E0D6] rounded-xl text-xs text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    >
                      <option value="OPEN">OPEN (Đang tuyển)</option>
                      <option value="CLOSED">CLOSED (Đã đóng)</option>
                      <option value="DRAFT">DRAFT (Bản nháp)</option>
                    </select>
                  </div>
                </div>

                {/* Mô tả công việc (JobDescription) */}
                <div className="space-y-3 pt-2 border-t border-[#F4EFE6]">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Trách nhiệm & Mô tả công việc (Responsibilities)
                    </label>
                    <textarea
                      rows={3}
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                      placeholder="Mô tả công việc hàng ngày, nhiệm vụ chính..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Yêu cầu ứng viên (Requirements)
                    </label>
                    <textarea
                      rows={3}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Số năm kinh nghiệm, kỹ năng chuyên môn bắt buộc..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                      Quyền lợi được hưởng (Benefits)
                    </label>
                    <textarea
                      rows={3}
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                      placeholder="Chế độ bảo hiểm, thưởng lễ tết, lộ trình thăng tiến..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-xs sm:text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#F4EFE6] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setJobModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#4A3E31] hover:bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isEditing ? 'Lưu thay đổi' : 'Đăng tin ngay'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa tin tuyển dụng"
        message={`Bạn có chắc chắn muốn xóa tin tuyển dụng "${jobToDelete?.title}" không? Lưu ý: Nếu tin đã có ứng viên nộp hồ sơ, bạn không thể xóa mà hãy chuyển sang trạng thái CLOSED.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
