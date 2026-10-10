import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import companyService from '../../services/companyService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function CategoryManagementPage() {
  const { showToast } = useToast();

  // =========================================================
  // 1. NGÀNH NGHỀ (Industries)
  // =========================================================
  const [industries, setIndustries] = useState([]);
  const [industryPage, setIndustryPage] = useState(0);
  const [industryTotalPages, setIndustryTotalPages] = useState(0);
  const [industryTotalElements, setIndustryTotalElements] = useState(0);
  const [isIndustryLoading, setIsIndustryLoading] = useState(true);
  const [industryKeyword, setIndustryKeyword] = useState('');

  // Industry Modal State
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [isEditingIndustry, setIsEditingIndustry] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState(null);
  const [industryName, setIndustryName] = useState('');
  const [isSavingIndustry, setIsSavingIndustry] = useState(false);

  // Delete Industry State
  const [deleteIndustryDialogOpen, setDeleteIndustryDialogOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState(null);
  const [isDeletingIndustry, setIsDeletingIndustry] = useState(false);

  // =========================================================
  // 2. LOẠI HÌNH CÔNG VIỆC (Job Types)
  // =========================================================
  const [jobTypes, setJobTypes] = useState([]);
  const [jobTypePage, setJobTypePage] = useState(0);
  const [jobTypeTotalPages, setJobTypeTotalPages] = useState(0);
  const [jobTypeTotalElements, setJobTypeTotalElements] = useState(0);
  const [isJobTypeLoading, setIsJobTypeLoading] = useState(true);
  const [jobTypeKeyword, setJobTypeKeyword] = useState('');

  // Job Type Modal State
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [isEditingJobType, setIsEditingJobType] = useState(false);
  const [editingJobTypeId, setEditingJobTypeId] = useState(null);
  const [jobTypeName, setJobTypeName] = useState('');
  const [isSavingJobType, setIsSavingJobType] = useState(false);

  // Delete Job Type State
  const [deleteJobTypeDialogOpen, setDeleteJobTypeDialogOpen] = useState(false);
  const [jobTypeToDelete, setJobTypeToDelete] = useState(null);
  const [isDeletingJobType, setIsDeletingJobType] = useState(false);

  // =========================================================
  // FETCH DATA
  // =========================================================
  const fetchIndustries = useCallback(async () => {
    try {
      setIsIndustryLoading(true);
      const res = await companyService.getIndustries({
        keyword: industryKeyword.trim() || undefined,
        page: industryPage,
        size: 8,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setIndustries(res?.content || []);
      setIndustryTotalPages(res?.totalPages || 0);
      setIndustryTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh mục ngành nghề:', err);
      showToast('Không thể tải danh mục ngành nghề.', 'error');
    } finally {
      setIsIndustryLoading(false);
    }
  }, [industryKeyword, industryPage, showToast]);

  const fetchJobTypes = useCallback(async () => {
    try {
      setIsJobTypeLoading(true);
      const res = await companyService.getJobTypes({
        keyword: jobTypeKeyword.trim() || undefined,
        page: jobTypePage,
        size: 8,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setJobTypes(res?.content || []);
      setJobTypeTotalPages(res?.totalPages || 0);
      setJobTypeTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh mục loại hình công việc:', err);
      showToast('Không thể tải danh mục loại hình công việc.', 'error');
    } finally {
      setIsJobTypeLoading(false);
    }
  }, [jobTypeKeyword, jobTypePage, showToast]);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  useEffect(() => {
    fetchJobTypes();
  }, [fetchJobTypes]);

  // =========================================================
  // ACTIONS NGÀNH NGHỀ
  // =========================================================
  const handleOpenCreateIndustry = () => {
    setIsEditingIndustry(false);
    setEditingIndustryId(null);
    setIndustryName('');
    setIndustryModalOpen(true);
  };

  const handleOpenEditIndustry = (ind) => {
    setIsEditingIndustry(true);
    setEditingIndustryId(ind.id);
    setIndustryName(ind.name || '');
    setIndustryModalOpen(true);
  };

  const handleSaveIndustrySubmit = async (e) => {
    e.preventDefault();
    if (!industryName.trim()) {
      showToast('Vui lòng nhập tên ngành nghề', 'error');
      return;
    }

    try {
      setIsSavingIndustry(true);
      const payload = { name: industryName.trim() };
      if (isEditingIndustry) {
        await companyService.updateIndustry(editingIndustryId, payload);
        showToast('Cập nhật ngành nghề thành công!', 'success');
      } else {
        await companyService.createIndustry(payload);
        showToast('Thêm ngành nghề mới thành công!', 'success');
      }
      setIndustryModalOpen(false);
      fetchIndustries();
    } catch (err) {
      console.error('Lỗi lưu ngành nghề:', err);
      showToast(err.response?.data?.message || 'Lưu ngành nghề thất bại.', 'error');
    } finally {
      setIsSavingIndustry(false);
    }
  };

  const handleConfirmDeleteIndustry = async () => {
    if (!industryToDelete) return;
    try {
      setIsDeletingIndustry(true);
      await companyService.deleteIndustry(industryToDelete.id);
      showToast('Đã xóa ngành nghề thành công!', 'success');
      setDeleteIndustryDialogOpen(false);
      setIndustryToDelete(null);
      fetchIndustries();
    } catch (err) {
      console.error('Lỗi xóa ngành nghề:', err);
      const msg =
        err.response?.status === 409
          ? 'Không thể xóa ngành nghề đang được gắn cho các tin tuyển dụng.'
          : err.response?.data?.message || 'Xóa ngành nghề thất bại.';
      showToast(msg, 'error');
    } finally {
      setIsDeletingIndustry(false);
    }
  };

  // =========================================================
  // ACTIONS LOẠI HÌNH CÔNG VIỆC
  // =========================================================
  const handleOpenCreateJobType = () => {
    setIsEditingJobType(false);
    setEditingJobTypeId(null);
    setJobTypeName('');
    setJobTypeModalOpen(true);
  };

  const handleOpenEditJobType = (jt) => {
    setIsEditingJobType(true);
    setEditingJobTypeId(jt.id);
    setJobTypeName(jt.name || '');
    setJobTypeModalOpen(true);
  };

  const handleSaveJobTypeSubmit = async (e) => {
    e.preventDefault();
    if (!jobTypeName.trim()) {
      showToast('Vui lòng nhập tên loại hình công việc', 'error');
      return;
    }

    try {
      setIsSavingJobType(true);
      const payload = { name: jobTypeName.trim() };
      if (isEditingJobType) {
        await companyService.updateJobType(editingJobTypeId, payload);
        showToast('Cập nhật loại hình công việc thành công!', 'success');
      } else {
        await companyService.createJobType(payload);
        showToast('Thêm loại hình công việc mới thành công!', 'success');
      }
      setJobTypeModalOpen(false);
      fetchJobTypes();
    } catch (err) {
      console.error('Lỗi lưu loại hình:', err);
      showToast(err.response?.data?.message || 'Lưu loại hình thất bại.', 'error');
    } finally {
      setIsSavingJobType(false);
    }
  };

  const handleConfirmDeleteJobType = async () => {
    if (!jobTypeToDelete) return;
    try {
      setIsDeletingJobType(true);
      await companyService.deleteJobType(jobTypeToDelete.id);
      showToast('Đã xóa loại hình công việc thành công!', 'success');
      setDeleteJobTypeDialogOpen(false);
      setJobTypeToDelete(null);
      fetchJobTypes();
    } catch (err) {
      console.error('Lỗi xóa loại hình:', err);
      const msg =
        err.response?.status === 409
          ? 'Không thể xóa loại hình công việc đang được gắn cho các tin tuyển dụng.'
          : err.response?.data?.message || 'Xóa loại hình thất bại.';
      showToast(msg, 'error');
    } finally {
      setIsDeletingJobType(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
          Quản Lý Ngành Nghề & Loại Hình Công Việc
        </h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Thiết lập các danh mục cốt lõi phục vụ lọc tin tuyển dụng và phân loại hồ sơ ứng viên
        </p>
      </div>

      {/* Grid 2 Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* PANEL 1: DANH MỤC NGÀNH NGHỀ (Industries)                  */}
        {/* ========================================================= */}
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F6B779]/20 flex items-center justify-center text-[#8C4A08]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1E1E1E]">Ngành nghề (Industries)</h2>
                  <p className="text-[11px] text-[#8A8073]">Tổng cộng: {industryTotalElements} danh mục</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateIndustry}
                className="px-3 py-1.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ngành</span>
              </button>
            </div>

            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIndustryPage(0);
                fetchIndustries();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#8A8073] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm ngành nghề..."
                  value={industryKeyword}
                  onChange={(e) => setIndustryKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder-[#8A8073] focus:outline-none focus:border-[#F6B779]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-[#2C241E] hover:bg-[#43382D] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Lọc
              </button>
            </form>

            {/* List */}
            <div className="space-y-2">
              {isIndustryLoading ? (
                <div className="py-10 text-center text-[#8A8073]">
                  <Loader2 className="w-5 h-5 animate-spin text-[#F6B779] mx-auto mb-2" />
                  <span className="text-xs">Đang tải ngành nghề...</span>
                </div>
              ) : industries.length === 0 ? (
                <div className="py-8 text-center text-[#8A8073]">
                  <Layers className="w-6 h-6 text-[#C4BDB0] mx-auto mb-1" />
                  <p className="text-xs font-medium">Chưa có ngành nghề nào</p>
                </div>
              ) : (
                industries.map((ind) => (
                  <div
                    key={ind.id}
                    className="flex items-center justify-between p-3 bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 border border-[#EAE4D9] rounded-xl transition-colors text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#1E1E1E] block">{ind.name}</span>
                      <span className="text-[10px] text-[#8A8073]">ID: #{ind.id}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditIndustry(ind)}
                        className="p-1 text-[#6B6152] hover:text-[#1E1E1E] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        title="Sửa tên ngành"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIndustryToDelete(ind);
                          setDeleteIndustryDialogOpen(true);
                        }}
                        className="p-1 text-[#8A8073] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa ngành nghề"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4EFE6] mt-4">
            <Pagination
              page={industryPage}
              totalPages={industryTotalPages}
              totalElements={industryTotalElements}
              size={8}
              onPageChange={(p) => setIndustryPage(p)}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* PANEL 2: LOẠI HÌNH CÔNG VIỆC (Job Types)                  */}
        {/* ========================================================= */}
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F6B779]/20 flex items-center justify-center text-[#8C4A08]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1E1E1E]">Loại hình công việc (Job Types)</h2>
                  <p className="text-[11px] text-[#8A8073]">Tổng cộng: {jobTypeTotalElements} loại hình</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateJobType}
                className="px-3 py-1.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm loại</span>
              </button>
            </div>

            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setJobTypePage(0);
                fetchJobTypes();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#8A8073] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm loại hình (Full-time, Remote...)..."
                  value={jobTypeKeyword}
                  onChange={(e) => setJobTypeKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder-[#8A8073] focus:outline-none focus:border-[#F6B779]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-[#2C241E] hover:bg-[#43382D] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Lọc
              </button>
            </form>

            {/* List */}
            <div className="space-y-2">
              {isJobTypeLoading ? (
                <div className="py-10 text-center text-[#8A8073]">
                  <Loader2 className="w-5 h-5 animate-spin text-[#F6B779] mx-auto mb-2" />
                  <span className="text-xs">Đang tải loại hình công việc...</span>
                </div>
              ) : jobTypes.length === 0 ? (
                <div className="py-8 text-center text-[#8A8073]">
                  <Briefcase className="w-6 h-6 text-[#C4BDB0] mx-auto mb-1" />
                  <p className="text-xs font-medium">Chưa có loại hình công việc nào</p>
                </div>
              ) : (
                jobTypes.map((jt) => (
                  <div
                    key={jt.id}
                    className="flex items-center justify-between p-3 bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 border border-[#EAE4D9] rounded-xl transition-colors text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#1E1E1E] block">{jt.name}</span>
                      <span className="text-[10px] text-[#8A8073]">ID: #{jt.id}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditJobType(jt)}
                        className="p-1 text-[#6B6152] hover:text-[#1E1E1E] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        title="Sửa loại hình"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setJobTypeToDelete(jt);
                          setDeleteJobTypeDialogOpen(true);
                        }}
                        className="p-1 text-[#8A8073] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa loại hình"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4EFE6] mt-4">
            <Pagination
              page={jobTypePage}
              totalPages={jobTypeTotalPages}
              totalElements={jobTypeTotalElements}
              size={8}
              onPageChange={(p) => setJobTypePage(p)}
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL TẠO / SỬA NGÀNH NGHỀ                                */}
      {/* ========================================================= */}
      {industryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSavingIndustry && setIndustryModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-sm rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">
                  {isEditingIndustry ? 'Sửa tên ngành nghề' : 'Thêm ngành nghề mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIndustryModalOpen(false)}
                  disabled={isSavingIndustry}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveIndustrySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Tên ngành nghề <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Công nghệ thông tin..."
                    value={industryName}
                    onChange={(e) => setIndustryName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4EFE6]">
                  <button
                    type="button"
                    onClick={() => setIndustryModalOpen(false)}
                    disabled={isSavingIndustry}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingIndustry}
                    className="px-4 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    {isSavingIndustry ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Lưu</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL TẠO / SỬA LOẠI HÌNH CÔNG VIỆC                       */}
      {/* ========================================================= */}
      {jobTypeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSavingJobType && setJobTypeModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-sm rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-4">
                <h3 className="text-base font-bold text-[#1E1E1E]">
                  {isEditingJobType ? 'Sửa loại hình công việc' : 'Thêm loại hình mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setJobTypeModalOpen(false)}
                  disabled={isSavingJobType}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveJobTypeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Tên loại hình <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Full-time, Remote, Thực tập..."
                    value={jobTypeName}
                    onChange={(e) => setJobTypeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4EFE6]">
                  <button
                    type="button"
                    onClick={() => setJobTypeModalOpen(false)}
                    disabled={isSavingJobType}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingJobType}
                    className="px-4 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    {isSavingJobType ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Lưu</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog Xóa Ngành nghề */}
      <ConfirmDialog
        isOpen={deleteIndustryDialogOpen}
        title="Xóa Ngành Nghề"
        message={`Bạn có chắc chắn muốn xóa ngành nghề "${industryToDelete?.name}"? Hệ thống sẽ ngăn chặn nếu có tin tuyển dụng đang sử dụng ngành nghề này.`}
        confirmText="Xóa ngành nghề"
        confirmVariant="danger"
        isLoading={isDeletingIndustry}
        onConfirm={handleConfirmDeleteIndustry}
        onCancel={() => {
          setDeleteIndustryDialogOpen(false);
          setIndustryToDelete(null);
        }}
      />

      {/* Confirm Dialog Xóa Loại hình công việc */}
      <ConfirmDialog
        isOpen={deleteJobTypeDialogOpen}
        title="Xóa Loại Hình Công Việc"
        message={`Bạn có chắc chắn muốn xóa loại hình công việc "${jobTypeToDelete?.name}"? Hệ thống sẽ ngăn chặn nếu có tin tuyển dụng đang sử dụng loại hình này.`}
        confirmText="Xóa loại hình"
        confirmVariant="danger"
        isLoading={isDeletingJobType}
        onConfirm={handleConfirmDeleteJobType}
        onCancel={() => {
          setDeleteJobTypeDialogOpen(false);
          setJobTypeToDelete(null);
        }}
      />
    </div>
  );
}
