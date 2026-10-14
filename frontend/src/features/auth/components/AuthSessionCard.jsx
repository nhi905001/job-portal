import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export default function AuthSessionCard({ user, onNavigate, onLogout }) {
  const roleLabelMap = {
    ADMIN: { text: 'Quản trị viên Hệ thống', path: '/admin' },
    RECRUITER: { text: 'Nhà tuyển dụng Doanh nghiệp', path: '/admin' },
    JOB_SEEKER: { text: 'Ứng viên Tìm việc', path: '/' },
  };

  const roleMeta = roleLabelMap[user?.role] || {
    text: user?.role || 'Người dùng',
    path: '/',
  };

  return (
    <Card className="shadow-none border-slate-200">
      <Card.Header>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium px-2.5 py-1 rounded-none bg-slate-100 text-slate-800 border border-slate-200">
            {roleMeta.text}
          </span>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Đang hoạt động
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mt-3">Phiên đăng nhập hiện tại</h3>
      </Card.Header>

      <Card.Body className="space-y-3 text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">Họ và tên:</span>
          <span className="font-semibold text-slate-800">{user?.fullName || '—'}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500">Email:</span>
          <span className="font-medium text-slate-800">{user?.email || '—'}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-slate-500">Vai trò (Role):</span>
          <span className="font-medium text-slate-800">{user?.role}</span>
        </div>
      </Card.Body>

      <Card.Footer className="flex flex-col gap-2">
        <Button
          variant="primary"
          isFullWidth
          onClick={() => onNavigate(roleMeta.path)}
        >
          Vào Không gian làm việc
        </Button>
        <Button
          variant="outline"
          isFullWidth
          onClick={onLogout}
        >
          Đăng xuất tài khoản
        </Button>
      </Card.Footer>
    </Card>
  );
}
