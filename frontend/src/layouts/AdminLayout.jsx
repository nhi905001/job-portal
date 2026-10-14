import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  ExternalLink,
  Menu,
  X,
  Search,
  Sparkles,
  ChevronDown,
  Building,
} from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isRecruiter = user?.role === 'RECRUITER';

  // Navigation Items
  const recruiterNavItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Job Board', to: '/admin/jobs', icon: Briefcase },
    { label: 'Đơn ứng tuyển', to: '/admin/applications', icon: FileText },
    { label: 'Shortlist', to: '/admin/shortlists', icon: CheckSquare },
    { label: 'Schedule', to: '/admin/interviews', icon: Calendar },
    { label: 'Offers', to: '/admin/offers', icon: Gift },
  ];

  const adminSystemNavItems = [
    { label: 'Người dùng', to: '/admin/users', icon: Users },
    { label: 'Doanh nghiệp', to: '/admin/companies', icon: Building2 },
    { label: 'Danh mục & Loại việc', to: '/admin/categories', icon: Layers },
    { label: 'Kiểm duyệt Đánh giá', to: '/admin/reviews', icon: MessageSquare },
  ];

  // Helper check active link
  const isNavActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-slate-800 flex font-sans antialiased selection:bg-amber-400/30 selection:text-amber-950">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Brand Logo Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
              <Link to="/admin" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-xs transition-transform group-hover:scale-105">
                  <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M7 12h10M7 8h10M7 16h6" />
                  </svg>
                </div>
                <div>
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">
                    JobPortal
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider block">
                    {isAdmin ? 'System Admin' : 'Work Workspace'}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recruiter Company Pill */}
            {isRecruiter && user?.company && (
              <div className="mx-4 mt-3.5 p-3 bg-amber-50/60 border border-amber-200/50 rounded-2xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                  <Building className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Doanh nghiệp</span>
                  <span className="text-xs font-semibold text-slate-900 truncate block">
                    {user.company.name}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-22rem)]">
              {/* Recruiter / General Section */}
              <div>
                <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Menu Quản Trị
                </div>
                <nav className="space-y-1.5">
                  {recruiterNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.to, item.exact);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium ${
                          active
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Admin System Section */}
              {isAdmin && (
                <div>
                  <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Hệ Thống</span>
                    <span className="text-[9px] text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded-md font-semibold">
                      ADMIN
                    </span>
                  </div>
                  <nav className="space-y-1.5">
                    {adminSystemNavItems.map((item) => {
                      const Icon = item.icon;
                      const active = isNavActive(item.to);
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium ${
                            active
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Area: Promo Upgrade Card & Logout */}
          <div className="p-4 border-t border-slate-100 space-y-3">
            {/* "Get Upgrade" Promo Card (as in the reference design mockup!) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/50 border border-amber-200/60 p-4 text-center">
              {/* Illustration Art */}
              <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-amber-700">
                <svg viewBox="0 0 100 80" className="w-16 h-14" fill="none">
                  {/* Modern minimalist illustration matching the style */}
                  <circle cx="50" cy="28" r="14" stroke="#8A4F0B" strokeWidth="2.5" fill="#FEF3C7" />
                  <path d="M42 26c1-2 4-4 8-4s7 2 8 4" stroke="#8A4F0B" strokeWidth="2" strokeLinecap="round" />
                  <path d="M30 65c0-12 9-21 20-21s20 9 20 21" stroke="#8A4F0B" strokeWidth="2.5" fill="#FEF9E7" />
                  <rect x="25" y="58" width="50" height="15" rx="3" stroke="#8A4F0B" strokeWidth="2.5" fill="#FFFFFF" />
                  <path d="M40 65h20" stroke="#8A4F0B" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Nâng cấp Gói Tuyển Dụng
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Mở rộng giới hạn tin đăng và tiếp cận hồ sơ ứng viên VIP.
              </p>
              <Link
                to="/admin/jobs"
                className="mt-3 block w-full py-2 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50/70 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout / Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-18 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          {/* Left: Mobile trigger & Quick Search Input (matching the mockup Quick Search!) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl lg:hidden hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input Bar */}
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick Search (ctrl + D)"
                className="w-full pl-9 pr-14 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/admin/jobs?q=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                ⌘D
              </span>
            </div>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Public Portal */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
            >
              <span>Xem Cổng Việc Làm</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Profile Pill (Anne Douglas style) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 pl-1.5 sm:pl-3 bg-white border border-slate-200/90 rounded-2xl hover:bg-slate-50/80"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">
                    {user?.fullName || user?.email?.split('@')[0]}
                  </span>
                  <span className="block text-[10px] text-amber-700 font-medium">
                    {user?.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{user?.fullName}</p>
                    <p className="text-slate-500 truncate text-[11px]">{user?.email}</p>
                  </div>
                  <Link
                    to="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cổng thông tin việc làm</span>
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8F9FB]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
