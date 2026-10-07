import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-[#EFE9DF] rounded-3xl p-8 sm:p-10 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1E1E1E]">403</h1>
        <h2 className="text-lg font-bold text-[#1E1E1E] mt-2">Truy cập bị từ chối</h2>
        <p className="text-xs text-[#786F62] mt-2 leading-relaxed">
          Tài khoản của bạn ({user?.role || 'Khách'}) không có quyền truy cập vào khu vực này.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#2C241E] border border-[#E6E0D6] text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>
          {user?.role && (user.role === 'ADMIN' || user.role === 'RECRUITER') && (
            <Link
              to="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              <span>Vào Bảng điều khiển</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
