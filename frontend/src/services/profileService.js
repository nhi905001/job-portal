import axiosClient from '../api/axiosClient';

export const profileService = {
  /**
   * Lấy hồ sơ của ứng viên hiện tại (GET /api/profiles/me)
   */
  async getMyProfile() {
    return await axiosClient.get('/api/profiles/me');
  },

  /**
   * Cập nhật hồ sơ ứng viên (PUT /api/profiles/me)
   * @param {Object} data - { phone, summary, avatarUrl, attachmentUrl }
   */
  async updateMyProfile(data) {
    return await axiosClient.put('/api/profiles/me', data);
  },

  /**
   * Xem hồ sơ của ứng viên theo userId (GET /api/profiles/user/{userId}) - dành cho Recruiter/Admin
   */
  async getProfileByUserId(userId) {
    return await axiosClient.get(`/api/profiles/user/${userId}`);
  },
};

export default profileService;
