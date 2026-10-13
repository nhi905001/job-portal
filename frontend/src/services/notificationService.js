import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Thông báo hệ thống (Notifications)
 * Tương ứng với NotificationController (/api/notifications)
 */
const notificationService = {
  /**
   * Lấy danh sách thông báo của người dùng hiện tại
   * @param {Object} params - { page, size, sortBy, sortDir }
   */
  getMyNotifications: async (params = {}) => {
    return await axiosClient.get('/api/notifications', { params });
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   * Response: { count: number }
   */
  getUnreadCount: async () => {
    return await axiosClient.get('/api/notifications/unread-count');
  },

  /**
   * Đánh dấu 1 thông báo là đã đọc
   * @param {number|string} id
   */
  markAsRead: async (id) => {
    return await axiosClient.patch(`/api/notifications/${id}/read`);
  },
};

export default notificationService;
