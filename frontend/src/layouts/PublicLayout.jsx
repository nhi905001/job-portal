import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  FileText, 
  Gift, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck, 
  Building2, 
  ChevronDown 
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C261E] flex flex-col font-sans selection:bg-[#F6B779]/30">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EFE9DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Main Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-[#F6B779] flex items-center justify-center text-[#2C241E] font-bold shadow-sm transition-transform group-hover:scale-105">
                  <Briefcase className="w-5 h-5 text-[#2C241E]" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-[#1E1E1E]">JobPortal</span>
                  <span className="text-[10px] block text-[#8A8073] -mt-1 font-medium tracking-wide">
                    Cơ Hội & Tuyển Dụng
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `transition-colors ${
                      isActive ? 'text-[#1E1E1E] font-semibold' : 'text-[#6B6152] hover:text-[#1E1E1E]'
                    }`
                  }
                >
                  Khám phá Việc làm
                </NavLink>
                {isAuthenticated && user?.role === 'JOB_SEEKER' && (
                  <>
                    <NavLink
                      to="/my-applications"
                      className={({ isActive }) =>
                        `transition-colors ${
                          isActive ? 'text-[#1E1E1E] font-semibold' : 'text-[#6B6152] hover:text-[#1E1E1E]'
                        }`
                      }
                    >
                      Đơn ứng tuyển
                    </NavLink>
                    <NavLink
                      to="/my-offers"
                      className={({ isActive }) =>
                        `transition-colors ${
                          isActive ? 'text-[#1E1E1E] font-semibold' : 'text-[#6B6152] hover:text-[#1E1E1E]'
                        }`
                      }
                    >
                      Thư mời nhận việc
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* Right User Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  {/* Nếu là Recruiter hoặc Admin -> Nút tắt vào trang Quản trị */}
                  {(user.role === 'ADMIN' || user.role === 'RECRUITER') && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#1E1E1E] text-white hover:bg-black transition-all shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#F6B779]" />
                      <span>Trang Quản Trị ({user.role})</span>
                    </Link>
                  )}

                  {/* Notification Bell (chỉ demo icon hoặc badge) */}
                  <button
                    type="button"
                    aria-label="Thông báo"
                    className="p-2 text-[#6B6152] hover:text-[#1E1E1E] rounded-xl hover:bg-[#F2ECE1] transition-colors relative"
                    title="Thông báo hệ thống"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                  </button>

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2.5 p-1.5 pl-3 bg-white border border-[#E6E0D6] rounded-xl hover:bg-[#FAF7F2] transition-colors"
                    >
                      <div className="text-left">
                        <span className="block text-xs font-semibold text-[#1E1E1E] leading-tight">
                          {user.fullName || user.email}
                        </span>
                        <span className="block text-[10px] text-[#8A8073] capitalize">
                          {user.role === 'JOB_SEEKER' ? 'Ứng viên' : user.role}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] flex items-center justify-center font-bold text-xs text-[#4A3E31]">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8A8073]" />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EFE9DF] rounded-2xl shadow-xl py-2 z-50 text-xs">
                        <div className="px-4 py-2 border-b border-[#F4EFE6]">
                          <p className="font-semibold text-[#1E1E1E]">{user.fullName}</p>
                          <p className="text-[#8A8073] truncate">{user.email}</p>
                        </div>

                        {user.role === 'JOB_SEEKER' && (
                          <>
                            <Link
                              to="/profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAF7F2] text-[#4A3E31] transition-colors"
                            >
                              <User className="w-4 h-4 text-[#8A8073]" />
                              <span>Hồ sơ cá nhân & CV</span>
                            </Link>
                            <Link
                              to="/my-applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAF7F2] text-[#4A3E31] transition-colors"
                            >
                              <FileText className="w-4 h-4 text-[#8A8073]" />
                              <span>Đơn ứng tuyển của tôi</span>
                            </Link>
                            <Link
                              to="/my-offers"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAF7F2] text-[#4A3E31] transition-colors"
                            >
                              <Gift className="w-4 h-4 text-[#8A8073]" />
                              <span>Thư mời nhận việc (Offers)</span>
                            </Link>
                          </>
                        )}

                        {(user.role === 'ADMIN' || user.role === 'RECRUITER') && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAF7F2] text-[#4A3E31] transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#8A8073]" />
                            <span>Khu vực Quản trị</span>
                          </Link>
                        )}

                        <div className="border-t border-[#F4EFE6] mt-1 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất khỏi hệ thống</span>
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
                    className="text-xs sm:text-sm font-medium text-[#4A4135] hover:text-[#1E1E1E] transition-colors"
                  >
                    Đăng ký tài khoản
                  </Link>
                  <Link
                    to="/login"
                    className="bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-sm"
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
                className="p-2 text-[#4A4135] hover:text-[#1E1E1E] rounded-xl hover:bg-[#F2ECE1]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#EFE9DF] bg-white px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#4A4135] py-2"
            >
              Khám phá Việc làm
            </Link>
            {isAuthenticated && user ? (
              <>
                {user.role === 'JOB_SEEKER' && (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-[#4A4135] py-2"
                    >
                      Hồ sơ cá nhân & CV
                    </Link>
                    <Link
                      to="/my-applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-[#4A4135] py-2"
                    >
                      Đơn ứng tuyển của tôi
                    </Link>
                    <Link
                      to="/my-offers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-[#4A4135] py-2"
                    >
                      Thư mời nhận việc
                    </Link>
                  </>
                )}
                {(user.role === 'ADMIN' || user.role === 'RECRUITER') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-blue-600 py-2"
                  >
                    Vào trang Quản trị ({user.role})
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left text-sm font-medium text-rose-600 py-2 border-t border-gray-100"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-[#F6B779] text-[#2C241E] font-semibold text-sm rounded-xl"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-[#E6E0D6] text-[#4A3E31] font-medium text-sm rounded-xl"
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
      <footer className="border-t border-[#EFE9DF] bg-white/70 py-8 text-xs text-[#8A8073]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E1E1E]">JobPortal</span>
            <span>— Cổng thông tin Tuyển dụng & Kết nối Ứng viên</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Hỗ trợ: contact@jobportal.vn</span>
            <span>Copyright © JobPortal 2026 | Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
