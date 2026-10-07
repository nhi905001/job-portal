import axiosClient from '../api/axiosClient';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  /**
   * Gọi API POST /api/auth/login
   * @param {Object} credentials - { email, password }
   * @param {boolean} remember - Lưu vào localStorage hay sessionStorage
   * @returns {Promise<{ token: string, user: Object }>}
   */
  async login({ email, password }, remember = true) {
    const response = await axiosClient.post('/api/auth/login', {
      email: email.trim(),
      password,
    });

    const { token, user } = response;
    this.saveAuth(token, user, remember);
    return { token, user };
  },

  /**
   * Gọi API POST /api/auth/register dành cho JOB_SEEKER
   * @param {Object} data - { email, password, fullName }
   * @returns {Promise<Object>} user
   */
  async register({ email, password, fullName }) {
    return await axiosClient.post('/api/auth/register', {
      email: email.trim(),
      password,
      fullName: fullName.trim(),
    });
  },

  /**
   * Lưu thông tin xác thực vào storage
   */
  saveAuth(token, user, remember = true) {
    const storage = remember ? localStorage : sessionStorage;
    // Dọn dẹp storage khác trước khi lưu mới
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Đăng xuất và xóa phiên đăng nhập
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  /**
   * Lấy token hiện tại
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Lấy thông tin người dùng từ storage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Kiểm tra người dùng đã đăng nhập hay chưa
   */
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  /**
   * Chuẩn hóa và trích xuất thông báo lỗi từ backend
   * @param {Error} error
   * @returns {{ summary: string, fieldErrors: Object }}
   */
  parseApiError(error) {
    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        return {
          summary: 'Không thể kết nối đến máy chủ API (http://localhost:8081). Vui lòng đảm bảo backend đang chạy.',
          fieldErrors: {},
        };
      }
      return {
        summary: error.message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.',
        fieldErrors: {},
      };
    }

    const { status, data } = error.response;

    if (status === 401) {
      return {
        summary: 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.',
        fieldErrors: {},
      };
    }

    if (status === 403) {
      return {
        summary: data?.message || 'Tài khoản của bạn đã bị vô hiệu hóa hoặc không có quyền truy cập.',
        fieldErrors: {},
      };
    }

    if (status === 400) {
      // Backend validation: { message, errors: { email: "...", password: "..." } }
      const fieldErrors = data?.errors || {};
      const summary = data?.message || 'Dữ liệu gửi lên không hợp lệ.';
      return { summary, fieldErrors };
    }

    if (status === 409) {
      return {
        summary: data?.message || 'Email này đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.',
        fieldErrors: { email: 'Email đã tồn tại' },
      };
    }

    if (status === 500) {
      return {
        summary: 'Lỗi hệ thống máy chủ nội bộ (500). Vui lòng thử lại sau.',
        fieldErrors: {},
      };
    }

    return {
      summary: data?.message || `Lỗi yêu cầu (Mã lỗi: ${status}). Vui lòng thử lại.`,
      fieldErrors: {},
    };
  },
};

export default authService;
