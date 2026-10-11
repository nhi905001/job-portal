import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Users, 
  Calendar, 
  Building2, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const stats = [
    { label: 'Tin đang tuyển (Open)', value: '12', change: '+2 tuần này', icon: Briefcase, color: 'text-[#8C4A08] bg-[#F6B779]/20' },
    { label: 'Đơn ứng tuyển mới', value: '48', change: '+15%', icon: FileText, color: 'text-emerald-800 bg-emerald-50' },
    { label: 'Phỏng vấn sắp tới', value: '6', change: 'Hôm nay: 2', icon: Calendar, color: 'text-[#4A3E31] bg-[#F2ECE1]' },
    { label: isAdmin ? 'Người dùng hệ thống' : 'Offers đang chờ', value: isAdmin ? '128' : '4', change: 'Đang hoạt động', icon: isAdmin ? Users : CheckCircle2, color: 'text-amber-800 bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#8C4A08] uppercase tracking-wider block mb-1">
            Bảng Điều Khiển Vận Hành
          </span>
          <h1 className="text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Xin chào, {user?.fullName || user?.email}!
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            {isAdmin
              ? 'Toàn quyền kiểm soát tài khoản, công ty, tin tuyển dụng và danh mục hệ thống.'
              : `Quản lý tin tuyển dụng và ứng viên trực thuộc ${user?.company?.name || 'doanh nghiệp'}.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/jobs"
            className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Tạo tin tuyển dụng</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-[#EFE9DF] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#786F62]">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#1E1E1E]">{stat.value}</div>
              <div className="mt-1 text-[11px] text-[#A89E90] font-medium">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3">
            <h2 className="text-sm font-bold text-[#1E1E1E]">Tin tuyển dụng gần đây</h2>
            <Link to="/admin/jobs" className="text-xs text-[#786F62] hover:text-[#1E1E1E] flex items-center gap-1">
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Senior Frontend Developer (React)', status: 'OPEN', apps: 18, deadline: '30/11/2026' },
              { title: 'Chuyên viên Tuyển dụng', status: 'OPEN', apps: 8, deadline: '25/11/2026' },
              { title: 'Backend Engineer (Java)', status: 'CLOSED', apps: 22, deadline: '15/10/2026' },
            ].map((job, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl text-xs">
                <div>
                  <span className="font-semibold text-[#1E1E1E] block">{job.title}</span>
                  <span className="text-[#8A8073] text-[11px]">Hạn chót: {job.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#F2ECE1] text-[#4A3E31] font-medium">
                    {job.apps} đơn
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-800' : 'bg-[#EAE4D9] text-[#786F62]'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3">
            <h2 className="text-sm font-bold text-[#1E1E1E]">Lối tắt thao tác nhanh</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/admin/applications"
              className="p-4 bg-[#FAF7F2] hover:bg-white border border-[#EAE4D9] hover:border-[#F6B779] rounded-2xl transition-all"
            >
              <FileText className="w-5 h-5 text-[#8C4A08] mb-2" />
              <span className="font-semibold text-[#1E1E1E] block">Duyệt Đơn Ứng Tuyển</span>
              <span className="text-[11px] text-[#8A8073]">Xem hồ sơ & lọc status</span>
            </Link>

            <Link
              to="/admin/interviews"
              className="p-4 bg-[#FAF7F2] hover:bg-white border border-[#EAE4D9] hover:border-[#F6B779] rounded-2xl transition-all"
            >
              <Calendar className="w-5 h-5 text-[#8C4A08] mb-2" />
              <span className="font-semibold text-[#1E1E1E] block">Lên Lịch Phỏng Vấn</span>
              <span className="text-[11px] text-[#8A8073]">Tạo slot & chấm feedback</span>
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/admin/users"
                  className="p-4 bg-[#FAF7F2] hover:bg-white border border-[#EAE4D9] hover:border-[#F6B779] rounded-2xl transition-all"
                >
                  <Users className="w-5 h-5 text-[#4A3E31] mb-2" />
                  <span className="font-semibold text-[#1E1E1E] block">Quản Lý Người Dùng</span>
                  <span className="text-[11px] text-[#8A8073]">Cấp quyền & khóa user</span>
                </Link>

                <Link
                  to="/admin/companies"
                  className="p-4 bg-[#FAF7F2] hover:bg-white border border-[#EAE4D9] hover:border-[#F6B779] rounded-2xl transition-all"
                >
                  <Building2 className="w-5 h-5 text-[#4A3E31] mb-2" />
                  <span className="font-semibold text-[#1E1E1E] block">Quản Lý Công Ty</span>
                  <span className="text-[11px] text-[#8A8073]">Cập nhật logo & địa điểm</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/shortlists"
                  className="p-4 bg-[#FAF7F2] hover:bg-white border border-[#EAE4D9] hover:border-[#F6B779] rounded-2xl transition-all"
                >
                  <Users className="w-5 h-5 text-[#4A3E31] mb-2" />
                  <span className="font-semibold text-[#1E1E1E] block">Danh Sách Shortlist</span>
                  <span className="text-[11px] text-[#8A8073]">Ứng viên tiềm năng</span>
                </Link>

                <Link
                  to="/admin/offers"
                  className="p-4 bg-[#FAF7F2] hover:bg-white border border-[#EAE4D9] hover:border-[#F6B779] rounded-2xl transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#4A3E31] mb-2" />
                  <span className="font-semibold text-[#1E1E1E] block">Quản Lý Offers</span>
                  <span className="text-[11px] text-[#8A8073]">Gửi thư mời nhận việc</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
