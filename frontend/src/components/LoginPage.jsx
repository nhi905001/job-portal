import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

export default function LoginPage() {
  const { login, register, user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & status states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  // Validation rules
  const validateField = (fieldName, value) => {
    if (fieldName === 'fullName') {
      if (!value.trim()) return 'Vui lòng nhập họ và tên của bạn';
      return '';
    }

    if (fieldName === 'email') {
      if (!value.trim()) return 'Vui lòng nhập email / số điện thoại';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        return 'Email không hợp lệ (ví dụ: name@company.com)';
      }
      return '';
    }

    if (fieldName === 'password') {
      if (!value) return 'Vui lòng nhập mật khẩu';
      if (value.length < 6) return 'Mật khẩu tối thiểu 6 ký tự';
      return '';
    }

    return '';
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'email') val = email;
    else if (field === 'password') val = password;
    else if (field === 'fullName') val = fullName;
    setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
  };

  const resetFormState = () => {
    setErrors({});
    setTouched({});
    setServerError('');
    setFeedbackSuccess('');
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    resetFormState();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setFeedbackSuccess('');

    // Trigger validation
    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);
    const nameErr = mode === 'register' ? validateField('fullName', fullName) : '';

    setTouched({
      email: true,
      password: true,
      ...(mode === 'register' ? { fullName: true } : {}),
    });

    const newErrors = { email: emailErr, password: passErr };
    if (mode === 'register') newErrors.fullName = nameErr;
    setErrors(newErrors);

    if (emailErr || passErr || nameErr) return;

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login({ email, password }, rememberMe);
        setFeedbackSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          const fromLocation = location.state?.from?.pathname;
          if (fromLocation) {
            navigate(fromLocation, { replace: true });
          } else if (res.user?.role === 'ADMIN' || res.user?.role === 'RECRUITER') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 400);
      } else {
        await register({ email, password, fullName });
        setFeedbackSuccess('Đăng ký tài khoản thành công! Đang tự động đăng nhập...');
        await login({ email, password, rememberMe });
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 400);
      }
    } catch (err) {
      const parsed = authService.parseApiError(err);
      setServerError(parsed.summary);
      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...parsed.fieldErrors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nạp tài khoản mẫu kiểm thử
  const handleFillCredentials = (demoEmail, demoPassword) => {
    setMode('login');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
    setServerError('');
    setFeedbackSuccess('');
  };

  // =========================================================================
  // GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP THÀNH CÔNG (WARM MINIMAL DASHBOARD)
  // =========================================================================
  if (isAuthenticated && user) {
    const roleInfoMap = {
      ADMIN: {
        badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200',
        title: 'Quản trị viên Hệ thống (ADMIN)',
        portalTitle: 'Không gian Quản trị Toàn diện',
        portalRoute: '/admin',
        description:
          'Bạn có toàn quyền quản trị: Quản lý người dùng, tạo tài khoản nhà tuyển dụng, quản trị danh mục công ty và kiểm duyệt việc làm.',
        redirectAction: 'Vào Bảng điều khiển Quản trị',
      },
      RECRUITER: {
        badgeStyle: 'bg-orange-100 text-orange-900 border-orange-200',
        title: 'Nhà tuyển dụng Doanh nghiệp (RECRUITER)',
        portalTitle: 'Cổng Tuyển dụng Doanh nghiệp',
        portalRoute: '/admin',
        description:
          'Đăng tin tuyển dụng, quản lý hồ sơ ứng viên, lọc Shortlist, lên lịch phỏng vấn và gửi Offer tuyển dụng.',
        redirectAction: 'Vào Cổng Tuyển dụng Doanh nghiệp',
      },
      JOB_SEEKER: {
        badgeStyle: 'bg-[#F2ECE1] text-[#4A3E31] border-[#E2D8C7]',
        title: 'Ứng viên Tìm việc (JOB_SEEKER)',
        portalTitle: 'Cổng thông tin Ứng viên',
        portalRoute: '/',
        description:
          'Khám phá cơ hội việc làm, hoàn thiện hồ sơ cá nhân, nộp CV trực tuyến và kết nối trực tiếp với nhà tuyển dụng.',
        redirectAction: 'Khám phá Việc làm phù hợp',
      },
    };

    const currentRoleMeta = roleInfoMap[user.role] || roleInfoMap.JOB_SEEKER;

    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C261E] flex flex-col justify-between p-6 sm:p-10 font-sans">
        {/* Top Header */}
        <header className="flex items-center justify-between max-w-6xl w-full mx-auto">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1E1E]">JobPortal</h1>
            <p className="text-xs text-[#8A8073]">support@jobportal.vn →</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-xs font-medium text-[#5C5346] hover:text-[#1E1E1E] transition-colors"
          >
            Đăng xuất
          </button>
        </header>

        {/* Center Card */}
        <main className="w-full max-w-md mx-auto my-8 bg-white border border-[#EFE9DF] rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="mb-6">
            <span
              className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${currentRoleMeta.badgeStyle}`}
            >
              {currentRoleMeta.title}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-[#1E1E1E] tracking-tight">
              Bảng điều khiển phiên làm việc
            </h2>
            <p className="mt-1 text-xs text-[#8A8073]">
              Phiên xác thực JWT Bearer Token đang hoạt động.
            </p>
          </div>

          <div className="space-y-3.5 mb-6 text-sm border-t border-b border-[#F4EFE6] py-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8A8073]">Họ và tên:</span>
              <span className="font-semibold text-[#1E1E1E]">{user.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8A8073]">Email:</span>
              <span className="font-medium text-[#1E1E1E]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8A8073]">Vai trò:</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D6] text-[#4A3E31]">
                {user.role}
              </span>
            </div>
            {user.company && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8A8073]">Doanh nghiệp:</span>
                <span className="font-semibold text-[#1E1E1E]">{user.company.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate(currentRoleMeta.portalRoute)}
              className="w-full bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-sm font-semibold py-3 px-4 rounded-2xl transition-all shadow-sm"
            >
              {currentRoleMeta.redirectAction}
            </button>
            <button
              type="button"
              onClick={logout}
              className="w-full bg-white hover:bg-[#FAF7F2] text-[#5C5346] border border-[#E5DFD3] text-sm font-medium py-3 px-4 rounded-2xl transition-colors"
            >
              Đăng xuất khỏi hệ thống
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-[#A89E90]">
          Copyright @jobportal 2026 | Privacy Policy
        </footer>
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN THEO PHONG CÁCH "RAZOR / WARM MINIMAL"
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C261E] relative overflow-hidden flex flex-col justify-between p-4 sm:p-8 lg:p-10 font-sans selection:bg-[#F6B779]/30">
      {/* Top Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between max-w-7xl w-full mx-auto pt-2 pb-4">
        {/* Brand Left */}
        <div>
          <span className="text-2xl font-bold tracking-tight text-[#1E1E1E] inline-block">
            JobPortal
          </span>
          <div className="w-16 h-[1.5px] bg-[#1E1E1E]/20 mt-0.5 mb-1" />
          <a
            href="mailto:contact@jobportal.vn"
            className="text-xs text-[#8A8073] hover:text-[#1E1E1E] flex items-center gap-1 transition-colors group"
          >
            <span>contact@jobportal.vn</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        {/* Action Controls Right */}
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Language / Globe Icon */}
          <button
            type="button"
            aria-label="Language selector"
            className="text-[#6B6152] hover:text-[#1E1E1E] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>

          {/* Mode switch link */}
          <button
            type="button"
            onClick={() => handleSwitchMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs sm:text-sm font-medium text-[#4A4135] hover:text-[#1E1E1E] transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>

          {/* Employer Portal / Recruiter Button */}
          <button
            type="button"
            onClick={() => handleFillCredentials('recruiter@fpt.com', 'Recruiter@123')}
            className="bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-sm"
            title="Đăng nhập tài khoản Nhà tuyển dụng thử nghiệm"
          >
            Employer Portal
          </button>
        </div>
      </header>

      {/* Main Content Area with Vector Illustrations */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-center my-auto py-6 sm:py-8">
        {/* ========================================================================= */}
        {/* LEFT DOODLE ILLUSTRATION (Dotted pillar, arrow box, speech bubble, curves) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 pointer-events-none select-none w-64 h-80">
          {/* Floating squiggly doodle top */}
          <svg
            className="absolute top-2 left-6 w-28 h-12 text-[#2A2A2A]"
            viewBox="0 0 120 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M5 25 Q 25 5, 45 20 T 85 18 T 115 12" />
          </svg>
          <div className="absolute top-8 left-24 w-1.5 h-1.5 rounded-full border border-[#2A2A2A]" />

          {/* Speech bubble outline */}
          <div className="absolute top-16 left-10 w-24 h-14 border border-[#2A2A2A] rounded-xl bg-[#FAF7F2]/60 p-2.5 flex flex-col justify-center gap-1.5">
            <div className="w-12 h-[1.5px] bg-[#2A2A2A]" />
            <div className="w-16 h-[1.5px] bg-[#2A2A2A]" />
          </div>

          {/* Bottom elements: Dotted column & Arrow square box */}
          <div className="absolute bottom-2 left-0 flex items-end gap-3">
            {/* Polka dot pillar */}
            <div
              className="w-16 h-28 rounded-sm relative overflow-hidden"
              style={{
                backgroundColor: '#F6B779',
                backgroundImage: 'radial-gradient(#1E1E1E 18%, transparent 20%)',
                backgroundSize: '12px 12px',
                backgroundPosition: '4px 4px',
              }}
            />

            {/* White box with arrow */}
            <div className="w-16 h-18 h-[74px] bg-white border border-[#2A2A2A] rounded-sm flex items-center justify-center p-3 relative">
              <svg
                className="w-7 h-7 text-[#2A2A2A]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                viewBox="0 0 24 24"
              >
                <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Connecting squiggly curve at bottom */}
          <svg
            className="absolute bottom-6 left-32 w-20 h-10 text-[#2A2A2A]"
            viewBox="0 0 80 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M0 25 C 20 10, 40 35, 60 15 S 80 20, 80 20" />
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* CENTER LOGIN / REGISTER FORM CARD */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[420px] bg-white border border-[#EFE9DF] rounded-[32px] sm:rounded-[36px] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] relative z-20">
          {/* Card Header */}
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#1E1E1E] tracking-tight">
              {mode === 'login' ? 'JobPortal Login' : 'Create Account'}
            </h2>
            <p className="mt-2 text-xs sm:text-[13px] text-[#786F62] leading-relaxed max-w-[280px] mx-auto">
              {mode === 'login'
                ? 'Hey, Enter your details to get sign in to your account'
                : 'Enter your credentials to register as a job seeker'}
            </p>
          </div>

          {/* Alerts */}
          {serverError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border border-red-200/60 rounded-xl text-xs text-red-700"
            >
              {serverError}
            </div>
          )}

          {feedbackSuccess && (
            <div
              role="status"
              className="mb-4 p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs text-emerald-800"
            >
              {feedbackSuccess}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            {/* Field: Full Name (Register mode only) */}
            {mode === 'register' && (
              <div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (touched.fullName) {
                      setErrors((prev) => ({
                        ...prev,
                        fullName: validateField('fullName', e.target.value),
                      }));
                    }
                    if (serverError) setServerError('');
                  }}
                  onBlur={() => handleBlur('fullName')}
                  disabled={isSubmitting}
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 text-xs sm:text-sm text-[#1E1E1E] bg-white border rounded-xl placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all ${
                    touched.fullName && errors.fullName
                      ? 'border-red-400'
                      : 'border-[#E6E0D6] hover:border-[#D5CDC1]'
                  }`}
                />
                {touched.fullName && errors.fullName && (
                  <p className="mt-1 text-[11px] text-red-600 font-medium pl-1">
                    {errors.fullName}
                  </p>
                )}
              </div>
            )}

            {/* Field: Email / Phone */}
            <div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: validateField('email', e.target.value),
                      }));
                    }
                    if (serverError) setServerError('');
                  }}
                  onBlur={() => handleBlur('email')}
                  disabled={isSubmitting}
                  placeholder="Enter Email / Phone No"
                  className={`w-full px-4 py-3 pr-10 text-xs sm:text-sm text-[#1E1E1E] bg-white border rounded-xl placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all ${
                    touched.email && errors.email
                      ? 'border-red-400'
                      : 'border-[#E6E0D6] hover:border-[#D5CDC1]'
                  }`}
                />
                {/* Subtle circle icon indicator on the right like in reference */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full border border-[#C9C2B7]" />
                </div>
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-[11px] text-red-600 font-medium pl-1">{errors.email}</p>
              )}
            </div>

            {/* Field: Passcode */}
            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) {
                      setErrors((prev) => ({
                        ...prev,
                        password: validateField('password', e.target.value),
                      }));
                    }
                    if (serverError) setServerError('');
                  }}
                  onBlur={() => handleBlur('password')}
                  disabled={isSubmitting}
                  placeholder="Passcode"
                  className={`w-full px-4 py-3 pr-14 text-xs sm:text-sm text-[#1E1E1E] bg-white border rounded-xl placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all ${
                    touched.password && errors.password
                      ? 'border-red-400'
                      : 'border-[#E6E0D6] hover:border-[#D5CDC1]'
                  }`}
                />
                {/* Hide / Show text button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A8073] hover:text-[#1E1E1E] transition-colors focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-[11px] text-red-600 font-medium pl-1">{errors.password}</p>
              )}
            </div>

            {/* Trouble signing in / Remember Me */}
            <div className="flex items-center justify-between pt-0.5 pb-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="text-xs text-[#786F62] hover:text-[#1E1E1E] transition-colors text-left"
              >
                Having trouble in sign in?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 text-xs sm:text-sm font-semibold rounded-xl text-[#2C241E] bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F6B779] focus:ring-offset-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center justify-center">
            <span className="text-[11px] sm:text-xs text-[#9E9587] font-normal tracking-wide">
              — Or Sign in with —
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFillCredentials('seeker@gmail.com', 'Seeker@123')}
              className="py-2.5 px-2 bg-white hover:bg-[#FAF7F2] text-[#2C241E] border border-[#E6E0D6] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors group"
              title="Job Seeker demo fill"
            >
              {/* Google G icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('recruiter@fpt.com', 'Recruiter@123')}
              className="py-2.5 px-2 bg-white hover:bg-[#FAF7F2] text-[#2C241E] border border-[#E6E0D6] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="Recruiter demo fill"
            >
              {/* Apple icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.94-12.01-14.59-6.07-9.35-10.77-20.2-14.09-32.55-3.32-12.35-4.99-24.32-4.99-35.91 0-14.35 3.33-26.35 10-36 6.67-9.66 15.34-14.62 26-14.9 4.35 0 9.4 1.25 15.15 3.75 5.76 2.5 9.77 3.8 12.04 3.9 1.74 0 5.8-1.35 12.19-4.05 6.38-2.7 11.83-3.9 16.34-3.6 12.17.65 21.93 5.4 29.28 14.25-10.66 6.42-15.89 15.42-15.69 27 .2 9.08 3.7 16.83 10.5 23.25 6.8 6.42 14.8 10.05 24 10.9-1.95 6.13-4.3 12.1-7.05 17.92zM119.22 31.85c0-7.39 2.65-14.39 7.95-21 5.3-6.61 11.95-10.56 19.95-11.85.22 1.3.33 2.5.33 3.6 0 7.39-2.75 14.54-8.25 21.45-5.5 6.9-12.16 10.85-20 11.85-.22-1.3-.33-2.5-.33-4.05z" />
              </svg>
              <span>Apple ID</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('admin@jobportal.com', 'Admin@123')}
              className="py-2.5 px-2 bg-white hover:bg-[#FAF7F2] text-[#2C241E] border border-[#E6E0D6] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="Admin demo fill"
            >
              {/* Facebook icon */}
              <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          {/* Bottom helper */}
          <div className="mt-7 text-center">
            <span className="text-xs text-[#786F62]">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => handleSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs font-semibold text-[#1E1E1E] hover:underline transition-all"
            >
              {mode === 'login' ? 'Request Now' : 'Sign in'}
            </button>
          </div>

          {/* Quick role test pills */}
          <div className="mt-5 pt-4 border-t border-[#F2ECE1] flex items-center justify-center gap-2 text-[11px] text-[#8C8275]">
            <span className="font-medium">Quick Demo:</span>
            <button
              type="button"
              onClick={() => handleFillCredentials('seeker@gmail.com', 'Seeker@123')}
              className="px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#4A3E31] border border-[#E6E0D6] transition-colors"
            >
              Seeker
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('recruiter@fpt.com', 'Recruiter@123')}
              className="px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#4A3E31] border border-[#E6E0D6] transition-colors"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleFillCredentials('admin@jobportal.com', 'Admin@123')}
              className="px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#4A3E31] border border-[#E6E0D6] transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT DOODLE ILLUSTRATION (Girl sitting on cube with laptop, dotted pillar) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none w-72 h-84">
          {/* Squiggly line top right */}
          <svg
            className="absolute top-4 right-6 w-24 h-12 text-[#2A2A2A]"
            viewBox="0 0 100 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M0 20 Q 25 5, 50 20 T 100 15" />
          </svg>

          {/* Speech bubble outline above character */}
          <div className="absolute top-12 left-6 w-16 h-12 border border-[#2A2A2A] rounded-xl bg-[#FAF7F2]/60 p-2 flex flex-col justify-center gap-1.5">
            <div className="w-8 h-[1.5px] bg-[#2A2A2A]" />
            <div className="w-10 h-[1.5px] bg-[#2A2A2A]" />
          </div>

          {/* Character illustration sitting on white cube pedestal */}
          <div className="absolute bottom-2 left-6 flex items-end">
            <div className="relative w-44 h-64">
              {/* White cubic pedestal */}
              <div className="absolute bottom-0 right-4 w-24 h-32 bg-white border border-[#2A2A2A] rounded-sm" />

              {/* Character vector SVG */}
              <svg
                className="absolute bottom-10 left-1 w-40 h-56"
                viewBox="0 0 160 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hair bun */}
                <circle cx="118" cy="28" r="8" fill="#1E1E1E" />
                {/* Head */}
                <ellipse cx="106" cy="36" rx="9" ry="11" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="1.5" />
                <path d="M98 32 C 102 24, 114 26, 114 36 C 114 42, 110 44, 106 44" fill="#1E1E1E" />

                {/* Torso & Blouse (black patterned) */}
                <path
                  d="M102 46 C 96 52, 90 62, 92 84 L 118 84 C 122 72, 120 54, 106 46 Z"
                  fill="#1E1E1E"
                />
                {/* Pattern flecks on blouse */}
                <circle cx="100" cy="62" r="1" fill="#FFFFFF" />
                <circle cx="106" cy="70" r="1" fill="#FFFFFF" />
                <circle cx="112" cy="60" r="1" fill="#FFFFFF" />
                <circle cx="114" cy="74" r="1" fill="#FFFFFF" />
                <circle cx="102" cy="78" r="1" fill="#FFFFFF" />

                {/* Arms typing on laptop */}
                <path
                  d="M96 54 L 78 72 L 86 78 L 98 66"
                  fill="#FFFFFF"
                  stroke="#1E1E1E"
                  strokeWidth="1.5"
                />

                {/* Laptop (Lime green) */}
                <polygon
                  points="64,80 82,78 84,62 68,64"
                  fill="#D6E89E"
                  stroke="#1E1E1E"
                  strokeWidth="1.5"
                />
                <line x1="62" y1="80" x2="88" y2="78" stroke="#1E1E1E" strokeWidth="2" />

                {/* Legs & white pants */}
                {/* Thigh sitting */}
                <path
                  d="M92 84 C 92 84, 82 86, 76 96 L 90 128 L 118 128 C 118 108, 118 90, 118 84 Z"
                  fill="#FFFFFF"
                  stroke="#1E1E1E"
                  strokeWidth="1.5"
                />
                {/* Lower legs dangling */}
                <path
                  d="M76 96 L 70 144 L 88 144 L 92 120"
                  fill="#FFFFFF"
                  stroke="#1E1E1E"
                  strokeWidth="1.5"
                />

                {/* Feet / Shoes */}
                <ellipse cx="64" cy="148" rx="7" ry="4" fill="#1E1E1E" />
                <ellipse cx="86" cy="154" rx="7" ry="4" fill="#1E1E1E" />
              </svg>
            </div>

            {/* Dotted pillar right side */}
            <div
              className="w-14 h-28 rounded-sm relative overflow-hidden -ml-2"
              style={{
                backgroundColor: '#F6B779',
                backgroundImage: 'radial-gradient(#1E1E1E 18%, transparent 20%)',
                backgroundSize: '12px 12px',
                backgroundPosition: '4px 4px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-20 text-center text-xs text-[#8A8073] pt-4 pb-1">
        Copyright © JobPortal 2026 | Privacy Policy
      </footer>
    </div>
  );
}


