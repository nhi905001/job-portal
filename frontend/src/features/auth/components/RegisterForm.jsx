import React from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function RegisterForm({
  formData,
  errors,
  touched,
  isLoading,
  onChange,
  onBlur,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Input
        id="fullName"
        name="fullName"
        type="text"
        label="Họ và tên"
        required
        placeholder="Nguyễn Văn A"
        value={formData.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        onBlur={() => onBlur('fullName')}
        error={touched.fullName ? errors.fullName : ''}
        disabled={isLoading}
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Địa chỉ Email"
        required
        placeholder="candidate@gmail.com"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        onBlur={() => onBlur('email')}
        error={touched.email ? errors.email : ''}
        disabled={isLoading}
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Mật khẩu"
        required
        allowTogglePassword
        placeholder="Tối thiểu 6 ký tự"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
        onBlur={() => onBlur('password')}
        error={touched.password ? errors.password : ''}
        disabled={isLoading}
      />

      <p className="text-[11px] text-slate-500 leading-normal">
        Bằng cách nhấp vào Đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của JobPortal.
      </p>

      <Button
        type="submit"
        variant="primary"
        isFullWidth
        isLoading={isLoading}
        className="mt-2"
      >
        Tạo tài khoản ứng viên
      </Button>
    </form>
  );
}
