import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Lịch phỏng vấn & Đánh giá sau phỏng vấn
 * Tương ứng với InterviewSlotController (/api/interview-slots) & InterviewFeedbackController (/api/interview-feedbacks)
 */
const interviewService = {
  /**
   * Danh sách các khung giờ phỏng vấn
   * @param {Object} params - { jobListingId, onlyFree, page, size, sortBy, sortDir }
   */
  getSlots: async (params = {}) => {
    return await axiosClient.get('/api/interview-slots', { params });
  },

  /**
   * Recruiter tạo khung giờ phỏng vấn
   * @param {Object} data - { jobListingId, startTime, endTime, meetingLink }
   */
  createSlot: async (data) => {
    return await axiosClient.post('/api/interview-slots', data);
  },

  /**
   * Ứng viên chọn đặt khung giờ phỏng vấn
   * @param {number|string} slotId
   * @param {Object} data - { applicationId }
   */
  bookSlot: async (slotId, data) => {
    return await axiosClient.post(`/api/interview-slots/${slotId}/book`, data);
  },

  /**
   * Hủy đặt lịch phỏng vấn (Ứng viên hoặc Recruiter)
   * @param {number|string} slotId
   */
  cancelBooking: async (slotId) => {
    return await axiosClient.delete(`/api/interview-slots/${slotId}/book`);
  },

  /**
   * Xóa khung giờ phỏng vấn (chỉ khi chưa có ai book)
   * @param {number|string} slotId
   */
  deleteSlot: async (slotId) => {
    return await axiosClient.delete(`/api/interview-slots/${slotId}`);
  },

  /**
   * Recruiter ghi nhận đánh giá / chấm điểm sau phỏng vấn
   * @param {Object} data - { interviewSlotId, score, comment }
   */
  createFeedback: async (data) => {
    return await axiosClient.post('/api/interview-feedbacks', data);
  },

  /**
   * Recruiter / Admin xem đánh giá của khung giờ phỏng vấn
   * @param {number|string} slotId
   */
  getFeedbackBySlot: async (slotId) => {
    return await axiosClient.get(`/api/interview-feedbacks/slot/${slotId}`);
  },
};

export default interviewService;
