import axios from 'axios';

// Base API client cấu hình cho hệ thống Job Portal
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Tự động đính kèm Bearer JWT Token nếu đã đăng nhập
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hóa dữ liệu trả về và xử lý mã lỗi toàn cục (Task 5.2)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp để các service dễ sử dụng
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      // 1. Xử lý lỗi 401 Unauthorized: Phiên làm việc hết hạn hoặc token không hợp lệ
      if (status === 401) {
        const isAuthRequest =
          config?.url?.includes('/api/auth/login') ||
          config?.url?.includes('/api/auth/register');

        if (!isAuthRequest) {
          // Xóa token & phiên đăng nhập
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');

          // Chuyển hướng người dùng về trang đăng nhập nếu đang ở trang được bảo vệ
          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/register')
          ) {
            window.location.href = '/login?expired=true';
          }
        }
      }

      // 2. Chuẩn hóa thông báo lỗi từ backend ResponseStatusException
      if (data && typeof data === 'object') {
        // Trích xuất thông báo lỗi chính xác
        const serverMessage = data.message || data.error || data.reason;
        if (serverMessage && !error.messageOverride) {
          error.userFriendlyMessage = serverMessage;
        }
      }
    } else if (error.request) {
      // Mất kết nối server / Network error
      error.userFriendlyMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc thử lại sau.';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
