import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import jobService from '../services/jobService';
import companyService from '../services/companyService';

const initialJobForm = {
  title: '',
  jobTypeId: '',
  industryId: '',
  companyLocationId: '',
  salaryMin: '',
  salaryMax: '',
  deadline: '',
  status: 'OPEN',
  responsibilities: '',
  requirements: '',
  benefits: '',
};

export function useJobs() {
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
  const [jobForm, setJobForm] = useState(initialJobForm);

  // Delete Confirm Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        console.error('Lỗi tải options:', err);
      }
    }
    loadOptions();
  }, [user]);

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

  const handleOpenCreateModal = () => {
    setJobForm(initialJobForm);
    setIsEditing(false);
    setEditingJobId(null);
    setJobModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setJobForm({
      title: job.title || '',
      jobTypeId: job.jobType?.id ? String(job.jobType.id) : '',
      industryId: job.industry?.id ? String(job.industry.id) : '',
      companyLocationId: job.companyLocation?.id ? String(job.companyLocation.id) : '',
      salaryMin: job.salaryMin != null ? String(job.salaryMin) : '',
      salaryMax: job.salaryMax != null ? String(job.salaryMax) : '',
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      status: job.status || 'OPEN',
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
    });
    setIsEditing(true);
    setEditingJobId(job.id);
    setJobModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveJob = async (e) => {
    if (e) e.preventDefault();
    if (!jobForm.title.trim()) {
      showToast('Vui lòng nhập tiêu đề tin tuyển dụng', 'error');
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        ...jobForm,
        jobTypeId: Number(jobForm.jobTypeId),
        industryId: Number(jobForm.industryId),
        companyLocationId: Number(jobForm.companyLocationId),
        salaryMin: jobForm.salaryMin ? Number(jobForm.salaryMin) : null,
        salaryMax: jobForm.salaryMax ? Number(jobForm.salaryMax) : null,
      };
      if (isEditing) {
        await jobService.updateJob(editingJobId, payload);
        showToast('Cập nhật tin tuyển dụng thành công!', 'success');
      } else {
        await jobService.createJob(payload);
        showToast('Đăng tin tuyển dụng thành công!', 'success');
      }
      setJobModalOpen(false);
      fetchJobs();
    } catch (err) {
      console.error('Lỗi lưu tin tuyển dụng:', err);
      showToast(err.response?.data?.message || 'Lưu tin tuyển dụng thất bại.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDelete = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

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
      console.error('Lỗi xóa tin tuyển dụng:', err);
      showToast(err.response?.data?.message || 'Xóa tin tuyển dụng thất bại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    jobs,
    page,
    totalPages,
    totalElements,
    isLoading,
    keyword,
    statusFilter,
    industries,
    jobTypes,
    locations,
    jobModalOpen,
    isEditing,
    isSaving,
    jobForm,
    deleteDialogOpen,
    jobToDelete,
    isDeleting,
    setPage,
    setKeyword,
    setStatusFilter,
    setJobModalOpen,
    setDeleteDialogOpen,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleFormChange,
    handleSaveJob,
    handleOpenDelete,
    handleConfirmDelete,
    refetchJobs: fetchJobs,
  };
}
