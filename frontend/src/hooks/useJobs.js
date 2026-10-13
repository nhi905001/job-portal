import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import jobService from '../services/jobService';
import companyService from '../services/companyService';

const initialJobForm = {
  title: '',
  companyId: '',
  jobTypeId: '',
  industryId: '',
  locationId: '',
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
  const [industryFilter, setIndustryFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // Dropdown options
  const [industries, setIndustries] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Create / Edit Modal State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [jobForm, setJobForm] = useState(initialJobForm);

  // Delete Confirm Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        const promises = [
          companyService.getIndustries({ size: 100 }),
          companyService.getJobTypes({ size: 100 }),
          companyService.getLocations({
            companyId: user?.role === 'RECRUITER' ? user?.company?.id : undefined,
            size: 200,
          }),
        ];

        if (user?.role === 'ADMIN') {
          promises.push(companyService.getCompanies({ size: 200 }));
        }

        const [indRes, typeRes, locRes, compRes] = await Promise.all(promises);
        setIndustries(indRes?.content || []);
        setJobTypes(typeRes?.content || []);
        setLocations(locRes?.content || []);
        if (compRes) {
          setCompanies(compRes?.content || []);
        }
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
        industryId: industryFilter || undefined,
        jobTypeId: jobTypeFilter || undefined,
        companyId: user?.role === 'ADMIN' ? (companyFilter || undefined) : undefined,
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
  }, [keyword, statusFilter, industryFilter, jobTypeFilter, companyFilter, user, page, showToast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleOpenCreateModal = () => {
    setJobForm({
      ...initialJobForm,
      companyId: user?.role === 'RECRUITER' ? String(user?.company?.id || '') : '',
    });
    setIsEditing(false);
    setEditingJobId(null);
    setJobModalOpen(true);
  };

  const handleOpenEditModal = async (job) => {
    setIsEditing(true);
    setEditingJobId(job.id);
    setJobModalOpen(true);
    setIsLoadingDetail(true);

    try {
      // Backend: GET /api/job-listings/{id} returns JobListingDetail { jobListing, description }
      const detail = await jobService.getJobById(job.id);
      const listing = detail?.jobListing || job;
      const desc = detail?.description || {};

      setJobForm({
        title: listing.title || '',
        companyId: listing.company?.id ? String(listing.company.id) : (user?.company?.id ? String(user.company.id) : ''),
        jobTypeId: listing.jobType?.id ? String(listing.jobType.id) : '',
        industryId: listing.industry?.id ? String(listing.industry.id) : '',
        locationId: listing.location?.id ? String(listing.location.id) : (listing.companyLocation?.id ? String(listing.companyLocation.id) : ''),
        salaryMin: listing.salaryMin != null ? String(listing.salaryMin) : '',
        salaryMax: listing.salaryMax != null ? String(listing.salaryMax) : '',
        deadline: listing.deadline ? listing.deadline.split('T')[0] : '',
        status: listing.status || 'OPEN',
        responsibilities: desc.responsibilities || '',
        requirements: desc.requirements || '',
        benefits: desc.benefits || '',
      });
    } catch (err) {
      console.error('Lỗi tải chi tiết tin tuyển dụng:', err);
      showToast('Không thể tải chi tiết mô tả tin tuyển dụng.', 'error');
      // Fallback to table data
      setJobForm({
        title: job.title || '',
        companyId: job.company?.id ? String(job.company.id) : '',
        jobTypeId: job.jobType?.id ? String(job.jobType.id) : '',
        industryId: job.industry?.id ? String(job.industry.id) : '',
        locationId: job.location?.id ? String(job.location.id) : (job.companyLocation?.id ? String(job.companyLocation.id) : ''),
        salaryMin: job.salaryMin != null ? String(job.salaryMin) : '',
        salaryMax: job.salaryMax != null ? String(job.salaryMax) : '',
        deadline: job.deadline ? job.deadline.split('T')[0] : '',
        status: job.status || 'OPEN',
        responsibilities: '',
        requirements: '',
        benefits: '',
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleFormChange = (field, value) => {
    setJobForm((prev) => {
      // If changing company as Admin, clear locationId if it doesn't belong to the new company
      if (field === 'companyId') {
        return { ...prev, [field]: value, locationId: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSaveJob = async (e) => {
    if (e) e.preventDefault();

    if (!jobForm.title.trim()) {
      showToast('Vui lòng nhập tiêu đề tin tuyển dụng', 'error');
      return;
    }
    if (user?.role === 'ADMIN' && !jobForm.companyId) {
      showToast('Vui lòng chọn doanh nghiệp tuyển dụng', 'error');
      return;
    }
    if (!jobForm.industryId) {
      showToast('Vui lòng chọn ngành nghề', 'error');
      return;
    }
    if (!jobForm.jobTypeId) {
      showToast('Vui lòng chọn loại hình công việc', 'error');
      return;
    }
    if (!jobForm.locationId) {
      showToast('Vui lòng chọn địa điểm làm việc', 'error');
      return;
    }
    if (!jobForm.deadline) {
      showToast('Vui lòng chọn hạn nộp hồ sơ', 'error');
      return;
    }
    if (!jobForm.responsibilities.trim()) {
      showToast('Vui lòng điền trách nhiệm công việc', 'error');
      return;
    }
    if (!jobForm.requirements.trim()) {
      showToast('Vui lòng điền yêu cầu ứng viên', 'error');
      return;
    }

    if (jobForm.salaryMin && jobForm.salaryMax && Number(jobForm.salaryMin) > Number(jobForm.salaryMax)) {
      showToast('Lương tối thiểu không được lớn hơn lương tối đa', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title: jobForm.title.trim(),
        companyId: user?.role === 'ADMIN' ? (jobForm.companyId ? Number(jobForm.companyId) : undefined) : undefined,
        jobTypeId: Number(jobForm.jobTypeId),
        industryId: Number(jobForm.industryId),
        locationId: Number(jobForm.locationId),
        salaryMin: jobForm.salaryMin ? Number(jobForm.salaryMin) : null,
        salaryMax: jobForm.salaryMax ? Number(jobForm.salaryMax) : null,
        deadline: jobForm.deadline,
        status: jobForm.status || 'OPEN',
        responsibilities: jobForm.responsibilities.trim(),
        requirements: jobForm.requirements.trim(),
        benefits: jobForm.benefits?.trim() || null,
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

  const handleResetFilters = () => {
    setKeyword('');
    setStatusFilter('');
    setIndustryFilter('');
    setJobTypeFilter('');
    setCompanyFilter('');
    setPage(0);
  };

  return {
    user,
    jobs,
    page,
    totalPages,
    totalElements,
    isLoading,
    keyword,
    statusFilter,
    industryFilter,
    jobTypeFilter,
    companyFilter,
    industries,
    jobTypes,
    locations,
    companies,
    jobModalOpen,
    isEditing,
    isSaving,
    isLoadingDetail,
    jobForm,
    deleteDialogOpen,
    jobToDelete,
    isDeleting,
    setPage,
    setKeyword,
    setStatusFilter,
    setIndustryFilter,
    setJobTypeFilter,
    setCompanyFilter,
    setJobModalOpen,
    setDeleteDialogOpen,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleFormChange,
    handleSaveJob,
    handleOpenDelete,
    handleConfirmDelete,
    handleResetFilters,
    refetchJobs: fetchJobs,
  };
}
