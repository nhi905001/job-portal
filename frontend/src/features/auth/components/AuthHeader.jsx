import React from 'react';

export default function AuthHeader({ mode, onSwitchMode }) {
  const isLogin = mode === 'login';

  return (
    <div className="text-center mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        {isLogin ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
      </h2>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
        {isLogin
          ? 'Nhập thông tin xác thực để truy cập bảng điều khiển'
          : 'Tạo tài khoản người tìm việc để ứng tuyển các cơ hội việc làm'}
      </p>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-600">
        <span>{isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}</span>
        <button
          type="button"
          onClick={() => onSwitchMode(isLogin ? 'register' : 'login')}
          className="font-medium text-slate-900 hover:underline focus:outline-none"
        >
          {isLogin ? 'Đăng ký ngay' : 'Đăng nhập tại đây'}
        </button>
      </div>
    </div>
  );
}
