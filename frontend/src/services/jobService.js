import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Tin tuyển dụng (Job Listings)
 * Tương ứng với JobListingController (/api/job-listings)
 */
const jobService = {
  /**
   * Tìm kiếm và phân trang danh sách tin tuyển dụng (Public / Recruiter)
   * @param {Object} params - { keyword, companyId, jobTypeId, industryId, recruiterId, status, page, size, sortBy, sortDir }
   */
  searchJobs: async (params = {}) => {
    return await axiosClient.get('/api/job-listings', { params });
  },

  /**
   * Lấy chi tiết một tin tuyển dụng (bao gồm JobDescription)
   * @param {number|string} id
   */
  getJobById: async (id) => {
    return await axiosClient.get(`/api/job-listings/${id}`);
  },

  /**
   * Tạo tin tuyển dụng mới (Recruiter / Admin)
   * @param {Object} data - { title, jobTypeId, companyLocationId, industryId, salaryMin, salaryMax, deadline, description }
   */
  createJob: async (data) => {
    return await axiosClient.post('/api/job-listings', data);
  },

  /**
   * Cập nhật tin tuyển dụng (Recruiter sở hữu / Admin)
   * @param {number|string} id
   * @param {Object} data
   */
  updateJob: async (id, data) => {
    return await axiosClient.put(`/api/job-listings/${id}`, data);
  },

  /**
   * Xóa tin tuyển dụng (Chỉ khi chưa có ai ứng tuyển)
   * @param {number|string} id
   */
  deleteJob: async (id) => {
    return await axiosClient.delete(`/api/job-listings/${id}`);
  },
};

export default jobService;
