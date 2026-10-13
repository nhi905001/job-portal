import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  FileText, 
  Gift, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';

export default function PublicLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-800 flex flex-col font-sans selection:bg-amber-400/30 selection:text-amber-950">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Logo & Main Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-xs transition-transform group-hover:scale-105">
                  <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M7 12h10M7 8h10M7 16h6" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                    JobPortal
                  </span>
                  <span className="text-[10px] block text-amber-600 font-semibold uppercase tracking-wider">
                    Cơ Hội & Tuyển Dụng
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl transition-all ${
                      isActive ? 'text-slate-950 font-bold bg-amber-50 text-amber-900' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                    }`
                  }
                >
                  Job Board
                </NavLink>
                {isAuthenticated && user?.role === 'JOB_SEEKER' && (
                  <>
                    <NavLink
                      to="/my-applications"
                      className={({ isActive }) =>
                        `px-3 py-1.5 rounded-xl transition-all ${
                          isActive ? 'text-slate-950 font-bold bg-amber-50 text-amber-900' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                        }`
                      }
                    >
                      Đơn ứng tuyển
                    </NavLink>
                    <NavLink
                      to="/my-offers"
                      className={({ isActive }) =>
                        `px-3 py-1.5 rounded-xl transition-all ${
                          isActive ? 'text-slate-950 font-bold bg-amber-50 text-amber-900' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                        }`
                      }
                    >
                      Offers nhận việc
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* Right User Actions */}
            <div className="hidden md:flex items-center gap-3.5">
              {isAuthenticated && user ? (
                <>
                  {/* Nếu là Recruiter hoặc Admin -> Nút tắt vào trang Quản trị */}
                  {(user.role === 'ADMIN' || user.role === 'RECRUITER') && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Workspace ({user.role})</span>
                    </Link>
                  )}

                  {/* Notification Bell */}
                  <NotificationBell />

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2.5 p-1 pl-3 bg-white border border-slate-200/90 rounded-2xl hover:bg-slate-50/80 transition-colors shadow-2xs"
                    >
                      <div className="text-left">
                        <span className="block text-xs font-bold text-slate-900 leading-tight">
                          {user.fullName || user.email?.split('@')[0]}
                        </span>
                        <span className="block text-[10px] text-amber-700 capitalize font-medium">
                          {user.role === 'JOB_SEEKER' ? 'Ứng viên' : user.role}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-bold text-slate-900">{user.fullName}</p>
                          <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
                        </div>

                        {user.role === 'JOB_SEEKER' && (
                          <>
                            <Link
                              to="/profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              <span>Hồ sơ cá nhân & CV</span>
                            </Link>
                            <Link
                              to="/my-applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span>Đơn ứng tuyển của tôi</span>
                            </Link>
                            <Link
                              to="/my-offers"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                              <Gift className="w-4 h-4 text-slate-400" />
                              <span>Thư mời nhận việc (Offers)</span>
                            </Link>
                          </>
                        )}

                        {(user.role === 'ADMIN' || user.role === 'RECRUITER') && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span>Khu vực Quản trị</span>
                          </Link>
                        )}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 transition-colors"
                  >
                    Đăng ký
                  </Link>
                  <Link
                    to="/login"
                    className="bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-2"
            >
              Job Board
            </Link>
            {isAuthenticated && user ? (
              <>
                {user.role === 'JOB_SEEKER' && (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-slate-700 py-2"
                    >
                      Hồ sơ cá nhân & CV
                    </Link>
                    <Link
                      to="/my-applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-slate-700 py-2"
                    >
                      Đơn ứng tuyển của tôi
                    </Link>
                    <Link
                      to="/my-offers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-slate-700 py-2"
                    >
                      Thư mời nhận việc
                    </Link>
                  </>
                )}
                {(user.role === 'ADMIN' || user.role === 'RECRUITER') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-amber-600 py-2"
                  >
                    Vào trang Quản trị ({user.role})
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left text-sm font-medium text-rose-600 py-2 border-t border-slate-100"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-amber-400 text-slate-950 font-bold text-sm rounded-xl"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Outlet Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">JobPortal</span>
            <span>— Cổng thông tin Tuyển dụng & Kết nối Ứng viên</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Hỗ trợ: contact@jobportal.vn</span>
            <span>Copyright © JobPortal 2026 | Modern Clean Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
