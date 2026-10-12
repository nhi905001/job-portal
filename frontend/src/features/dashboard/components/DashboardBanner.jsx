import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function DashboardBanner({ user, isAdmin }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
          Bảng Điều Khiển Vận Hành
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Xin chào, {user?.fullName || user?.email}!
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isAdmin
            ? 'Toàn quyền kiểm soát tài khoản, công ty, tin tuyển dụng và danh mục hệ thống.'
            : `Quản lý tin tuyển dụng và ứng viên trực thuộc ${user?.company?.name || 'doanh nghiệp'}.`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/admin/jobs">
          <Button variant="primary" size="md" leftIcon={<Briefcase className="w-4 h-4" />}>
            Tạo tin tuyển dụng
          </Button>
        </Link>
      </div>
    </div>
  );
}
