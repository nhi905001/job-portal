import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Đơn ứng tuyển (Job Applications)
 * Tương ứng với JobApplicationController (/api/applications)
 */
const applicationService = {
  /**
   * Ứng viên nộp đơn ứng tuyển vào tin tuyển dụng
   * @param {Object} data - { jobListingId, cvUrl, coverLetter }
   */
  apply: async (data) => {
    const payload = {
      jobListingId: data.jobListingId,
      resumeUrl: data.resumeUrl || data.cvUrl,
      coverLetter: data.coverLetter || '',
    };
    return await axiosClient.post('/api/applications', payload);
  },

  /**
   * Ứng viên xem danh sách các đơn đã nộp của bản thân
   * @param {Object} params - { page, size, sortBy, sortDir }
   */
  getMyApplications: async (params = {}) => {
    return await axiosClient.get('/api/applications/my', { params });
  },

  /**
   * Ứng viên rút đơn ứng tuyển (Chỉ được phép khi đơn đang ở trạng thái APPLIED)
   * @param {number|string} id
   */
  withdrawApplication: async (id) => {
    return await axiosClient.delete(`/api/applications/${id}`);
  },

  /**
   * Recruiter / Admin xem danh sách đơn ứng tuyển (lọc theo jobListingId hoặc status)
   * @param {Object} params - { jobListingId, status, page, size, sortBy, sortDir }
   */
  getApplications: async (params = {}) => {
    return await axiosClient.get('/api/applications', { params });
  },

  /**
   * Recruiter / Admin lấy chi tiết đơn ứng tuyển
   * @param {number|string} id
   */
  getApplicationById: async (id) => {
    return await axiosClient.get(`/api/applications/${id}`);
  },

  /**
   * Recruiter cập nhật trạng thái đơn (APPLIED -> SHORTLISTED / REJECTED...)
   * Backend Controller: @PatchMapping("/{id}/status") @RequestParam("value") ApplicationStatus value
   * @param {number|string} id
   * @param {string} status - APPLIED | SHORTLISTED | INTERVIEWING | OFFERED | REJECTED
   */
  updateStatus: async (id, status) => {
    return await axiosClient.patch(`/api/applications/${id}/status`, null, {
      params: { value: status },
    });
  },
};

export default applicationService;
