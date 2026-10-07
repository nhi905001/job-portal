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

// Response Interceptor: Chuẩn hóa dữ liệu trả về và xử lý mã lỗi
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp để các service dễ sử dụng
    return response.data;
  },
  (error) => {
    // Xử lý các mã lỗi theo tài liệu API Backend:
    // - 401: Sai mật khẩu hoặc token hết hạn
    // - 403: Tài khoản bị khóa (inactive) hoặc không đủ quyền
    // - 400: Lỗi validation hoặc nghiệp vụ
    // - Mất kết nối server / Network Error
    return Promise.reject(error);
  }
);

export default axiosClient;
