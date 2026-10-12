import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import companyService from '../services/companyService';

export function useCategories() {
  const { showToast } = useToast();

  // Industries
  const [industries, setIndustries] = useState([]);
  const [industryPage, setIndustryPage] = useState(0);
  const [industryTotalPages, setIndustryTotalPages] = useState(0);
  const [industryTotalElements, setIndustryTotalElements] = useState(0);
  const [isIndustryLoading, setIsIndustryLoading] = useState(true);
  const [industryKeyword, setIndustryKeyword] = useState('');
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [isEditingIndustry, setIsEditingIndustry] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState(null);
  const [industryName, setIndustryName] = useState('');
  const [isSavingIndustry, setIsSavingIndustry] = useState(false);
  const [deleteIndustryDialogOpen, setDeleteIndustryDialogOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState(null);
  const [isDeletingIndustry, setIsDeletingIndustry] = useState(false);

  // Job Types
  const [jobTypes, setJobTypes] = useState([]);
  const [jobTypePage, setJobTypePage] = useState(0);
  const [jobTypeTotalPages, setJobTypeTotalPages] = useState(0);
  const [jobTypeTotalElements, setJobTypeTotalElements] = useState(0);
  const [isJobTypeLoading, setIsJobTypeLoading] = useState(true);
  const [jobTypeKeyword, setJobTypeKeyword] = useState('');
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [isEditingJobType, setIsEditingJobType] = useState(false);
  const [editingJobTypeId, setEditingJobTypeId] = useState(null);
  const [jobTypeName, setJobTypeName] = useState('');
  const [isSavingJobType, setIsSavingJobType] = useState(false);
  const [deleteJobTypeDialogOpen, setDeleteJobTypeDialogOpen] = useState(false);
  const [jobTypeToDelete, setJobTypeToDelete] = useState(null);
  const [isDeletingJobType, setIsDeletingJobType] = useState(false);

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
    } catch {
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
    } catch {
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

  // Industry handlers
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

  const handleSaveIndustry = async (e) => {
    if (e) e.preventDefault();
    if (!industryName.trim()) return;
    try {
      setIsSavingIndustry(true);
      if (isEditingIndustry) {
        await companyService.updateIndustry(editingIndustryId, { name: industryName.trim() });
        showToast('Cập nhật ngành nghề thành công!', 'success');
      } else {
        await companyService.createIndustry({ name: industryName.trim() });
        showToast('Tạo ngành nghề mới thành công!', 'success');
      }
      setIndustryModalOpen(false);
      fetchIndustries();
    } catch (err) {
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
      showToast('Đã xóa ngành nghề!', 'success');
      setDeleteIndustryDialogOpen(false);
      fetchIndustries();
    } catch (err) {
      showToast(err.response?.data?.message || 'Xóa ngành nghề thất bại.', 'error');
    } finally {
      setIsDeletingIndustry(false);
    }
  };

  // Job Type handlers
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

  const handleSaveJobType = async (e) => {
    if (e) e.preventDefault();
    if (!jobTypeName.trim()) return;
    try {
      setIsSavingJobType(true);
      if (isEditingJobType) {
        await companyService.updateJobType(editingJobTypeId, { name: jobTypeName.trim() });
        showToast('Cập nhật loại công việc thành công!', 'success');
      } else {
        await companyService.createJobType({ name: jobTypeName.trim() });
        showToast('Tạo loại công việc mới thành công!', 'success');
      }
      setJobTypeModalOpen(false);
      fetchJobTypes();
    } catch (err) {
      showToast(err.response?.data?.message || 'Lưu loại công việc thất bại.', 'error');
    } finally {
      setIsSavingJobType(false);
    }
  };

  const handleConfirmDeleteJobType = async () => {
    if (!jobTypeToDelete) return;
    try {
      setIsDeletingJobType(true);
      await companyService.deleteJobType(jobTypeToDelete.id);
      showToast('Đã xóa loại công việc!', 'success');
      setDeleteJobTypeDialogOpen(false);
      fetchJobTypes();
    } catch (err) {
      showToast(err.response?.data?.message || 'Xóa loại công việc thất bại.', 'error');
    } finally {
      setIsDeletingJobType(false);
    }
  };

  return {
    industries,
    industryPage,
    industryTotalPages,
    industryTotalElements,
    isIndustryLoading,
    industryKeyword,
    industryModalOpen,
    isEditingIndustry,
    industryName,
    isSavingIndustry,
    deleteIndustryDialogOpen,
    industryToDelete,
    isDeletingIndustry,
    setIndustryPage,
    setIndustryKeyword,
    setIndustryModalOpen,
    setIndustryName,
    setDeleteIndustryDialogOpen,
    setIndustryToDelete,
    handleOpenCreateIndustry,
    handleOpenEditIndustry,
    handleSaveIndustry,
    handleConfirmDeleteIndustry,
    fetchIndustries,
    jobTypes,
    jobTypePage,
    jobTypeTotalPages,
    jobTypeTotalElements,
    isJobTypeLoading,
    jobTypeKeyword,
    jobTypeModalOpen,
    isEditingJobType,
    jobTypeName,
    isSavingJobType,
    deleteJobTypeDialogOpen,
    jobTypeToDelete,
    isDeletingJobType,
    setJobTypePage,
    setJobTypeKeyword,
    setJobTypeModalOpen,
    setJobTypeName,
    setDeleteJobTypeDialogOpen,
    setJobTypeToDelete,
    handleOpenCreateJobType,
    handleOpenEditJobType,
    handleSaveJobType,
    handleConfirmDeleteJobType,
    fetchJobTypes,
  };
}
