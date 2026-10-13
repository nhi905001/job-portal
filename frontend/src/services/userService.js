import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Người dùng & Phân quyền
 * Tương ứng với UserController (/api/users) - Yêu cầu Role ADMIN
 */
const userService = {
  /**
   * Danh sách người dùng, lọc theo role hoặc keyword
   * @param {Object} params - { role, keyword, page, size, sortBy, sortDir }
   */
  getUsers: async (params = {}) => {
    return await axiosClient.get('/api/users', { params });
  },

  /**
   * Lấy chi tiết thông tin người dùng theo ID
   * @param {number|string} id
   */
  getUserById: async (id) => {
    return await axiosClient.get(`/api/users/${id}`);
  },

  /**
   * Admin tạo tài khoản (ví dụ Recruiter gắn với companyId)
   * @param {Object} data - { email, password, fullName, role, companyId }
   */
  createUser: async (data) => {
    return await axiosClient.post('/api/users', data);
  },

  /**
   * Khóa hoặc mở khóa tài khoản người dùng
   * @param {number|string} id
   * @param {boolean} activeValue - true để mở, false để khóa
   */
  setUserActive: async (id, activeValue) => {
    return await axiosClient.patch(`/api/users/${id}/active`, null, {
      params: { value: activeValue },
    });
  },

  /**
   * Alias: Khóa hoặc mở khóa tài khoản người dùng (tương thích các hook gọi toggleUserActive)
   * @param {number|string} id
   * @param {boolean} activeValue - true để mở, false để khóa
   */
  toggleUserActive: async (id, activeValue) => {
    return await axiosClient.patch(`/api/users/${id}/active`, null, {
      params: { value: activeValue },
    });
  },
};

export default userService;
