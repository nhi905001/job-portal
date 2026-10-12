import React from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function LoginForm({
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
        id="email"
        name="email"
        type="email"
        label="Địa chỉ Email"
        required
        placeholder="name@company.com"
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
        placeholder="Nhập mật khẩu của bạn"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
        onBlur={() => onBlur('password')}
        error={touched.password ? errors.password : ''}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between text-xs pt-0.5 select-none">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => onChange('rememberMe', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-1"
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        <a
          href="#forgot-password"
          onClick={(e) => {
            e.preventDefault();
            alert('Vui lòng liên hệ quản trị viên qua support@jobportal.vn để cấp lại mật khẩu.');
          }}
          className="text-slate-500 hover:text-slate-800 transition-colors"
        >
          Quên mật khẩu?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        isFullWidth
        isLoading={isLoading}
        className="mt-2"
      >
        Đăng nhập
      </Button>
    </form>
  );
}
