import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, FileText, Upload, Save } from 'lucide-react';

export default function CandidateProfilePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="border-b border-[#F4EFE6] pb-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">Hồ sơ ứng viên của tôi</h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Cập nhật thông tin liên hệ và CV để nhà tuyển dụng dễ dàng tiếp cận bạn
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                disabled
                value={user?.fullName || ''}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl text-sm text-[#5C5346] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
                Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl text-sm text-[#5C5346] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ví dụ: 0912345678"
              className="w-full px-4 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#786F62] mb-1.5">
              Tóm tắt bản thân (Summary)
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Giới thiệu về kỹ năng, kinh nghiệm và mục tiêu nghề nghiệp của bạn..."
              className="w-full px-4 py-2.5 bg-white border border-[#E6E0D6] rounded-xl text-sm text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20"
            />
          </div>

          {/* Upload Attachments */}
          <div className="border border-dashed border-[#D5CDC1] rounded-2xl p-6 text-center bg-[#FAF7F2]/50">
            <Upload className="w-8 h-8 text-[#9E9587] mx-auto mb-2" />
            <p className="text-xs font-medium text-[#4A4135]">Tải lên file đính kèm / CV mặc định (PDF, DOCX)</p>
            <p className="text-[11px] text-[#8A8073] mt-0.5">Dung lượng tối đa: 10MB</p>
            <button
              type="button"
              className="mt-3 px-4 py-2 bg-white border border-[#E0D8CB] hover:bg-[#FAF7F2] text-xs font-medium rounded-xl text-[#3A332A] transition-colors"
            >
              Chọn tệp từ máy tính
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thông tin hồ sơ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
