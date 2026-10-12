import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Users, Building2, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/common/Card';

export default function QuickActionShortcuts({ isAdmin }) {
  return (
    <Card className="shadow-none border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Lối tắt thao tác nhanh</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <Link
          to="/admin/applications"
          className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-all"
        >
          <FileText className="w-5 h-5 text-slate-700 mb-2" />
          <span className="font-semibold text-slate-900 block">Duyệt Đơn Ứng Tuyển</span>
          <span className="text-[11px] text-slate-500">Xem hồ sơ & lọc status</span>
        </Link>

        <Link
          to="/admin/interviews"
          className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-all"
        >
          <Calendar className="w-5 h-5 text-slate-700 mb-2" />
          <span className="font-semibold text-slate-900 block">Lên Lịch Phỏng Vấn</span>
          <span className="text-[11px] text-slate-500">Tạo slot & chấm feedback</span>
        </Link>

        {isAdmin ? (
          <>
            <Link
              to="/admin/users"
              className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-all"
            >
              <Users className="w-5 h-5 text-slate-700 mb-2" />
              <span className="font-semibold text-slate-900 block">Quản Lý Người Dùng</span>
              <span className="text-[11px] text-slate-500">Cấp quyền & khóa user</span>
            </Link>

            <Link
              to="/admin/companies"
              className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-all"
            >
              <Building2 className="w-5 h-5 text-slate-700 mb-2" />
              <span className="font-semibold text-slate-900 block">Quản Lý Công Ty</span>
              <span className="text-[11px] text-slate-500">Cập nhật logo & địa điểm</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/admin/shortlists"
              className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-all"
            >
              <Users className="w-5 h-5 text-slate-700 mb-2" />
              <span className="font-semibold text-slate-900 block">Danh Sách Shortlist</span>
              <span className="text-[11px] text-slate-500">Ứng viên tiềm năng</span>
            </Link>

            <Link
              to="/admin/offers"
              className="p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400 rounded-xl transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-slate-700 mb-2" />
              <span className="font-semibold text-slate-900 block">Quản Lý Offers</span>
              <span className="text-[11px] text-slate-500">Gửi thư mời nhận việc</span>
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}
