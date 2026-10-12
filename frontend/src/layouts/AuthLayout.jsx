import React from 'react';

export default function AuthLayout({ children, topAction }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans antialiased">
      {/* Top Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sm:border-transparent sm:bg-transparent">
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-900 block">
            JobPortal
          </span>
          <span className="text-xs text-slate-500 font-normal">
            Hệ thống Quản lý Tuyển dụng & Tìm việc
          </span>
        </div>

        {topAction && <div className="flex items-center gap-4">{topAction}</div>}
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 sm:border-transparent">
        <span>© 2026 JobPortal Platform. Thiết kế phẳng chuẩn Modern Clean Dashboard.</span>
      </footer>
    </div>
  );
}
