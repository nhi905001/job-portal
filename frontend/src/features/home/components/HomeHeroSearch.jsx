import React from 'react';
import { Search } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function HomeHeroSearch({ searchInput, onSearchChange, onSearchSubmit }) {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center max-w-4xl mx-auto">
      <span className="inline-block text-xs font-medium tracking-wider uppercase text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full mb-3">
        Cổng tuyển dụng & kết nối nghề nghiệp
      </span>
      <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
        Tìm kiếm công việc mơ ước của bạn
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
        Khám phá hàng trăm cơ hội việc làm hấp dẫn từ các doanh nghiệp hàng đầu tại Việt Nam.
      </p>

      <form onSubmit={onSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-2xl mx-auto">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nhập tiêu đề công việc, kỹ năng, vị trí ứng tuyển..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>
        <Button type="submit" variant="primary" size="md" className="px-6 py-3">
          Tìm việc làm
        </Button>
      </form>
    </section>
  );
}
