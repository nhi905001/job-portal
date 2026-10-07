import axiosClient from '../api/axiosClient';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const fileService = {
  /**
   * Tải file lên server qua API POST /api/files (multipart/form-data)
   * @param {File} file - File người dùng chọn từ máy tính
   * @returns {Promise<{ url: string }>}
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  },

  /**
   * Tạo URL đầy đủ để hiển thị hoặc tải file từ backend
   * @param {string} url - Đường dẫn file nhận từ backend (ví dụ /files/abc.pdf)
   * @returns {string} URL đầy đủ
   */
  getFullFileUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  },
};

export default fileService;
