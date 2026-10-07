import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Đánh giá Công ty (Reviews)
 * Tương ứng với ReviewController (/api/reviews)
 */
const reviewService = {
  /**
   * Xem danh sách review theo công ty (hoặc tất cả nếu null)
   * @param {Object} params - { companyId, page, size, sortBy, sortDir }
   */
  getReviews: async (params = {}) => {
    return await axiosClient.get('/api/reviews', { params });
  },

  /**
   * Ứng viên viết đánh giá công ty
   * @param {Object} data - { companyId, rating, comment }
   */
  createReview: async (data) => {
    return await axiosClient.post('/api/reviews', data);
  },

  /**
   * Admin kiểm duyệt / xóa review vi phạm
   * @param {number|string} id
   */
  deleteReview: async (id) => {
    return await axiosClient.delete(`/api/reviews/${id}`);
  },
};

export default reviewService;
