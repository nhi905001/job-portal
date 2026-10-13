import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Sparkles, Plus } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function DashboardBanner({ user, isAdmin }) {
  return (
    <div className="bg-gradient-to-r from-white via-white to-amber-50/40 border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-card">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-200/60 uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Không Gian Vận Hành</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Xin chào, {user?.fullName || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          {isAdmin
            ? 'Toàn quyền kiểm soát tài khoản, doanh nghiệp, tin tuyển dụng và danh mục hệ thống.'
            : `Quản lý tin tuyển dụng và ứng viên trực thuộc ${user?.company?.name || 'doanh nghiệp'}.`}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link to="/admin/jobs">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4 text-slate-950 stroke-[3]" />}
            className="font-bold shadow-xs hover:shadow"
          >
            Tạo tin tuyển dụng
          </Button>
        </Link>
      </div>
    </div>
  );
}
