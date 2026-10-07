import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CheckSquare,
  Calendar,
  Gift,
  Users,
  Building2,
  Layers,
  MessageSquare,
  LogOut,
  Bell,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isRecruiter = user?.role === 'RECRUITER';

  // Navigation Items
  const recruiterNavItems = [
    { label: 'Bảng điều khiển', to: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Tin tuyển dụng', to: '/admin/jobs', icon: Briefcase },
    { label: 'Đơn ứng tuyển', to: '/admin/applications', icon: FileText },
    { label: 'Danh sách Shortlist', to: '/admin/shortlists', icon: CheckSquare },
    { label: 'Lịch phỏng vấn', to: '/admin/interviews', icon: Calendar },
    { label: 'Offers việc làm', to: '/admin/offers', icon: Gift },
  ];

  const adminSystemNavItems = [
    { label: 'Quản lý Người dùng', to: '/admin/users', icon: Users },
    { label: 'Công ty & Địa điểm', to: '/admin/companies', icon: Building2 },
    { label: 'Ngành nghề & Loại việc', to: '/admin/categories', icon: Layers },
    { label: 'Kiểm duyệt Đánh giá', to: '/admin/reviews', icon: MessageSquare },
  ];

  // Helper check active link
  const isNavActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C261E] flex font-sans antialiased selection:bg-[#F6B779]/30">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#EFE9DF] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-18 flex items-center justify-between px-6 border-b border-[#F4EFE6]">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F6B779] flex items-center justify-center text-[#2C241E] font-bold text-sm shadow-sm">
                JP
              </div>
              <div>
                <span className="font-bold text-base text-[#1E1E1E] tracking-tight block leading-tight">
                  JobPortal
                </span>
                <span className="text-[10px] text-[#8A8073] font-semibold uppercase tracking-wider block">
                  {isAdmin ? 'Quản Trị Hệ Thống' : 'Cổng Tuyển Dụng'}
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-[#8A8073] hover:text-[#1E1E1E] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Company Info (nếu là Recruiter) */}
          {isRecruiter && user?.company && (
            <div className="mx-4 mt-4 p-3 bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl flex items-center gap-2.5">
              <Building className="w-4 h-4 text-[#8C4A08] shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-semibold text-[#8C4A08] block">Doanh nghiệp</span>
                <span className="text-xs font-semibold text-[#1E1E1E] truncate block">
                  {user.company.name}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {/* Recruiter / Workspace Section */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#8A8073] uppercase tracking-wider">
                Tuyển Dụng & Vận Hành
              </div>
              <nav className="space-y-1">
                {recruiterNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.to, item.exact);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        active
                          ? 'bg-[#F6B779] text-[#2C241E] font-semibold shadow-xs'
                          : 'text-[#6B6152] hover:text-[#1E1E1E] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#2C241E]' : 'text-[#9E9587]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Admin Management Section */}
            {isAdmin && (
              <div>
                <div className="px-3 mb-2 text-[11px] font-semibold text-[#8A8073] uppercase tracking-wider flex items-center justify-between">
                  <span>Hệ Thống Quản Trị</span>
                  <span className="text-[10px] text-[#4A3E31] bg-[#F2ECE1] border border-[#E2DACD] px-1.5 py-0.2 rounded font-mono">
                    ADMIN
                  </span>
                </div>
                <nav className="space-y-1">
                  {adminSystemNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                          active
                            ? 'bg-[#F6B779] text-[#2C241E] font-semibold shadow-xs'
                            : 'text-[#6B6152] hover:text-[#1E1E1E] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-[#2C241E]' : 'text-[#9E9587]'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-[#F4EFE6]">
          <div className="p-3 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#F6B779]/30 text-[#8C4A08] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#1E1E1E] truncate block">
                  {user?.fullName || user?.email}
                </span>
                <span className="text-[10px] text-[#8A8073] font-mono block">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[#6B6152] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất phiên làm việc</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 sm:h-18 bg-white/80 backdrop-blur-md border-b border-[#EFE9DF] px-4 sm:px-6 flex items-center justify-between shrink-0">
          {/* Left: Mobile Trigger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#6B6152] hover:text-[#1E1E1E] rounded-xl lg:hidden hover:bg-[#FAF7F2]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[#8A8073]">
              <span className="font-semibold text-[#1E1E1E]">Không gian Quản trị</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C9C2B7]" />
              <span className="capitalize">{location.pathname.replace('/admin', '').replace('/', '') || 'Tổng quan'}</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Link sang Cổng Ứng viên Public */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#5C5346] hover:text-[#1E1E1E] px-3.5 py-1.5 rounded-xl border border-[#E6E0D6] hover:bg-[#FAF7F2] transition-colors"
            >
              <span>Xem Cổng Việc làm</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8A8073]" />
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Thông báo"
              className="p-2 text-[#6B6152] hover:text-[#1E1E1E] rounded-xl hover:bg-[#FAF7F2] relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F6B779]" />
            </button>

            {/* Role Badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border ${
                isAdmin
                  ? 'bg-[#F2ECE1] text-[#4A3E31] border-[#E2DACD]'
                  : 'bg-[#F6B779]/20 text-[#8C4A08] border-[#F6B779]/30'
              }`}
            >
              {user?.role}
            </span>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
