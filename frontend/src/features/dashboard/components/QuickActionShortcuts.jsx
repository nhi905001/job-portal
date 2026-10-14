import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';

export default function QuickActionShortcuts({ isAdmin }) {
  return (
    <Card className="shadow-card border-slate-200/90 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Lối tắt thao tác nhanh</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <Link
          to="/admin/applications"
          className="p-4 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-2xs rounded-2xl transition-all group"
        >
          <span className="font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">
            {isAdmin ? 'Theo Dõi Đơn Ứng Tuyển' : 'Duyệt Đơn Ứng Tuyển'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isAdmin ? 'Giám sát hồ sơ & trạng thái' : 'Xem hồ sơ & lọc trạng thái'}
          </span>
        </Link>

        <Link
          to="/admin/interviews"
          className="p-4 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-2xs rounded-2xl transition-all group"
        >
          <span className="font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">
            {isAdmin ? 'Lịch Phỏng Vấn Hệ Thống' : 'Lên Lịch Phỏng Vấn'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isAdmin ? 'Theo dõi lịch phỏng vấn' : 'Tạo slot & chấm feedback'}
          </span>
        </Link>

        {isAdmin ? (
          <>
            <Link
              to="/admin/users"
              className="p-4 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-2xs rounded-2xl transition-all group"
            >
              <span className="font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">Quản Lý Người Dùng</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Cấp quyền & khóa user</span>
            </Link>

            <Link
              to="/admin/companies"
              className="p-4 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-2xs rounded-2xl transition-all group"
            >
              <span className="font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">Quản Lý Doanh Nghiệp</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Cập nhật logo & địa điểm</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/admin/shortlists"
              className="p-4 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-2xs rounded-2xl transition-all group"
            >
              <span className="font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">Danh Sách Shortlist</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Ứng viên tiềm năng</span>
            </Link>

            <Link
              to="/admin/offers"
              className="p-4 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-2xs rounded-2xl transition-all group"
            >
              <span className="font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">Quản Lý Offers</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Gửi thư mời nhận việc</span>
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}
