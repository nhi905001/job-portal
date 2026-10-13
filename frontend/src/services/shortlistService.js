import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Danh sách rút gọn (Shortlist)
 * Tương ứng với ShortlistController (/api/shortlists)
 */
const shortlistService = {
  /**
   * Recruiter / Admin xem danh sách Shortlist
   * @param {Object} params - { page, size, sortBy, sortDir }
   */
  getShortlists: async (params = {}) => {
    return await axiosClient.get('/api/shortlists', { params });
  },

  /**
   * Thêm đơn ứng tuyển vào Shortlist
   * @param {Object} data - { applicationId, note }
   */
  addToShortlist: async (data) => {
    return await axiosClient.post('/api/shortlists', data);
  },

  /**
   * Xóa đơn khỏi Shortlist
   * @param {number|string} id
   */
  removeFromShortlist: async (id) => {
    return await axiosClient.delete(`/api/shortlists/${id}`);
  },
};

export default shortlistService;
