import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import applicationService from '../services/applicationService';
import shortlistService from '../services/shortlistService';
import jobService from '../services/jobService';
import profileService from '../services/profileService';

export function useApplications() {
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

  const handleJobFilterChange = (val) => {
    setSelectedJobId(val);
    setPage(0);
    if (val) setSearchParams({ jobListingId: val });
    else setSearchParams({});
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(0);
  };

  const handleViewCandidateProfile = async (app) => {
    setSelectedAppForView(app);
    setProfileModalOpen(true);
    try {
      setIsLoadingProfile(true);
      const candidateId = app.candidate?.id || app.user?.id;
      if (candidateId) {
        const p = await profileService.getProfileByUserId(candidateId);
        setCandidateProfile(p);
      }
    } catch (err) {
      console.error('Lỗi tải hồ sơ:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleOpenShortlist = (app) => {
    setAppToShortlist(app);
    setShortlistNote('Ứng viên tiềm năng, kỹ năng và kinh nghiệm phù hợp');
    setShortlistModalOpen(true);
  };

  const handleConfirmShortlist = async (e) => {
    if (e) e.preventDefault();
    if (!appToShortlist) return;
    try {
      setIsShortlisting(true);
      await shortlistService.addToShortlist({
        applicationId: appToShortlist.id,
        note: shortlistNote.trim() || undefined,
      });
      showToast('Đã đưa ứng viên vào danh sách Shortlist thành công!', 'success');
      setShortlistModalOpen(false);
      fetchApplications();
    } catch (err) {
      console.error('Lỗi shortlist:', err);
      showToast(err.response?.data?.message || 'Không thể đưa vào Shortlist.', 'error');
    } finally {
      setIsShortlisting(false);
    }
  };

  const handleOpenReject = (app) => {
    setAppToReject(app);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!appToReject) return;
    try {
      setIsRejecting(true);
      await applicationService.updateStatus(appToReject.id, 'REJECTED');
      showToast('Đã cập nhật trạng thái từ chối hồ sơ.', 'info');
      setRejectDialogOpen(false);
      fetchApplications();
    } catch (err) {
      console.error('Lỗi từ chối đơn:', err);
      showToast(err.response?.data?.message || 'Cập nhật trạng thái thất bại.', 'error');
    } finally {
      setIsRejecting(false);
    }
  };

  return {
    applications,
    page,
    totalPages,
    totalElements,
    isLoading,
    selectedJobId,
    statusFilter,
    jobOptions,
    shortlistModalOpen,
    appToShortlist,
    shortlistNote,
    isShortlisting,
    rejectDialogOpen,
    appToReject,
    isRejecting,
    profileModalOpen,
    candidateProfile,
    selectedAppForView,
    isLoadingProfile,
    setPage,
    setShortlistNote,
    setShortlistModalOpen,
    setRejectDialogOpen,
    setProfileModalOpen,
    handleJobFilterChange,
    handleStatusFilterChange,
    handleViewCandidateProfile,
    handleOpenShortlist,
    handleConfirmShortlist,
    handleOpenReject,
    handleConfirmReject,
    refetchApplications: fetchApplications,
  };
}
