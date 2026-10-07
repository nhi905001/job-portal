import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#786F62] hover:text-[#1E1E1E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách việc làm</span>
      </Link>

      {/* Main Job Header Card */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4EFE6] pb-6">
          <div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg inline-block mb-2">
              Công nghệ thông tin
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] tracking-tight">
              Senior Frontend Developer (React)
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#786F62]">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4 text-[#A89E90]" />
                <span className="font-semibold text-[#1E1E1E]">FPT Software</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#A89E90]" />
                <span>Hà Nội</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-medium">
                <DollarSign className="w-4 h-4" />
                <span>25.000.000 - 35.000.000 VND</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#A89E90]" />
                <span>Hạn nộp: 30/11/2026</span>
              </div>
            </div>
          </div>

          <div>
            {isAuthenticated ? (
              user?.role === 'JOB_SEEKER' ? (
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  Nộp đơn ứng tuyển ngay
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  (Tài khoản {user?.role} không thể nộp đơn)
                </span>
              )
            ) : (
              <Link
                to="/login"
                className="inline-block w-full sm:w-auto px-6 py-3 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] font-semibold text-sm rounded-xl transition-all shadow-sm text-center"
              >
                Đăng nhập để ứng tuyển
              </Link>
            )}
          </div>
        </div>

        {/* Content sections */}
        <div className="pt-6 space-y-6 text-sm text-[#4A4135] leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-[#1E1E1E] mb-2">Mô tả công việc (Responsibilities)</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>Phát triển các tính năng giao diện người dùng mới bằng React.js, TailwindCSS.</li>
              <li>Tối ưu hóa hiệu năng và khả năng tương thích đa nền tảng trình duyệt.</li>
              <li>Làm việc chặt chẽ cùng Product Owner, Backend team và UI/UX Designer.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#1E1E1E] mb-2">Yêu cầu ứng viên (Requirements)</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>Tối thiểu 3 năm kinh nghiệm lập trình Frontend với React.js, JavaScript/TypeScript.</li>
              <li>Thành thạo quản lý trạng thái, RESTful API và UI Frameworks.</li>
              <li>Kỹ năng giao tiếp và làm việc nhóm hiệu quả trong môi trường Agile/Scrum.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#1E1E1E] mb-2">Quyền lợi được hưởng (Benefits)</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>Lương thưởng cạnh tranh, đánh giá tăng lương 2 lần/năm.</li>
              <li>Bảo hiểm sức khỏe cao cấp toàn diện cho nhân viên và người thân.</li>
              <li>Cung cấp trang thiết bị làm việc hiện đại (Macbook Pro, màn hình 4K).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
