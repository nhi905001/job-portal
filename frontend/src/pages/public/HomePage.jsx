import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Briefcase, Clock, DollarSign, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [keyword, setKeyword] = useState('');

  return (
    <div className="space-y-8">
      {/* Hero Search Section */}
      <section className="bg-white border border-[#EFE9DF] rounded-[32px] p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] text-center max-w-4xl mx-auto">
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#1E1E1E] bg-[#F6B779]/30 px-3.5 py-1 rounded-full mb-3">
          Hơn 500+ Cơ hội nghề nghiệp đang tuyển dụng
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] tracking-tight">
          Tìm kiếm công việc mơ ước của bạn
        </h1>
        <p className="mt-2 text-sm text-[#786F62] max-w-lg mx-auto">
          Kết nối trực tiếp giữa ứng viên tài năng và hàng trăm doanh nghiệp hàng đầu tại Việt Nam.
        </p>

        {/* Search Bar */}
        <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-[#9E9587] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tiêu đề công việc, vị trí tuyển dụng..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#FAF7F2] border border-[#E8E2D6] rounded-2xl text-sm text-[#1E1E1E] placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Tìm việc ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* Featured Jobs Section Header */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
              Việc làm mới nhất
            </h2>
            <p className="text-xs text-[#8A8073]">Các vị trí tuyển dụng vừa được cập nhật hôm nay</p>
          </div>
        </div>

        {/* Mock/Starter Job Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 1,
              title: 'Senior Frontend Developer (React)',
              company: 'FPT Software',
              city: 'Hà Nội',
              salary: '25.000.000 - 35.000.000 VND',
              type: 'Full-time',
              industry: 'Công nghệ thông tin',
            },
            {
              id: 2,
              title: 'Chuyên viên Tuyển dụng Nhân sự',
              company: 'Viettel Telecom',
              city: 'Hồ Chí Minh',
              salary: '15.000.000 - 20.000.000 VND',
              type: 'Full-time',
              industry: 'Nhân sự',
            },
            {
              id: 3,
              title: 'Backend Engineer (Java Spring Boot)',
              company: 'VNG Corporation',
              city: 'Đà Nẵng',
              salary: '30.000.000 - 45.000.000 VND',
              type: 'Full-time',
              industry: 'Công nghệ thông tin',
            },
          ].map((job) => (
            <div
              key={job.id}
              className="bg-white border border-[#EFE9DF] rounded-2xl p-5 hover:border-[#F6B779] transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                    {job.industry}
                  </span>
                  <span className="text-[11px] font-medium text-[#786F62] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#EAE4D9]">
                    {job.type}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1E1E1E] leading-snug hover:text-blue-600 transition-colors">
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </h3>
                <div className="mt-2.5 space-y-1.5 text-xs text-[#786F62]">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#A89E90]" />
                    <span className="font-medium text-[#3A332A]">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A89E90]" />
                    <span>{job.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex justify-end">
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-xs font-semibold text-[#1E1E1E] hover:text-[#EEA861] flex items-center gap-1 transition-colors"
                >
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
