/**
 * Validation utilities for form inputs
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Vui lòng nhập email hoặc tài khoản';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Email không hợp lệ (ví dụ: name@company.com)';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Vui lòng nhập mật khẩu';
  }
  if (password.length < 6) {
    return 'Mật khẩu phải chứa ít nhất 6 ký tự';
  }
  return '';
};

export const validateFullName = (fullName) => {
  if (!fullName || !fullName.trim()) {
    return 'Vui lòng nhập họ và tên của bạn';
  }
  if (fullName.trim().length < 2) {
    return 'Họ và tên tối thiểu 2 ký tự';
  }
  return '';
};
