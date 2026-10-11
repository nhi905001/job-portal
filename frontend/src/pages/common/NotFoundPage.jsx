import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-[#EFE9DF] rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-[#1E1E1E]">404</h1>
        <h2 className="text-lg font-bold text-[#1E1E1E] mt-2">Trang không tồn tại</h2>
        <p className="text-xs text-[#786F62] mt-2 leading-relaxed">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
