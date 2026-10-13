import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Thư mời nhận việc (Offers)
 * Tương ứng với OfferController (/api/offers)
 */
const offerService = {
  /**
   * Recruiter gửi Offer cho ứng viên
   * @param {Object} data - { applicationId, salary, startDate, expiryDate, notes }
   */
  createOffer: async (data) => {
    return await axiosClient.post('/api/offers', data);
  },

  /**
   * Recruiter / Admin xem danh sách offer đã gửi
   * @param {Object} params - { page, size, sortBy, sortDir }
   */
  getOffers: async (params = {}) => {
    return await axiosClient.get('/api/offers', { params });
  },

  /**
   * Ứng viên xem danh sách offer mình nhận được
   * @param {Object} params - { page, size, sortBy, sortDir }
   */
  getMyOffers: async (params = {}) => {
    return await axiosClient.get('/api/offers/my', { params });
  },

  /**
   * Ứng viên phản hồi Offer (chấp nhận hoặc từ chối)
   * @param {number|string} id
   * @param {boolean} accept - true để nhận, false để từ chối
   */
  respondToOffer: async (id, accept) => {
    return await axiosClient.patch(`/api/offers/${id}/respond`, null, {
      params: { accept },
    });
  },

  /**
   * Recruiter hủy Offer đang chờ phản hồi (PENDING)
   * @param {number|string} id
   */
  cancelOffer: async (id) => {
    return await axiosClient.patch(`/api/offers/${id}/cancel`);
  },

  /**
   * Recruiter xóa Offer khỏi hệ thống
   * @param {number|string} id
   */
  deleteOffer: async (id) => {
    return await axiosClient.delete(`/api/offers/${id}`);
  },
};

export default offerService;
