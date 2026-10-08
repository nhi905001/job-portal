import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  Clock,
  DollarSign,
  ArrowRight,
  Filter,
  Loader2,
  X,
  Layers,
} from 'lucide-react';
import jobService from '../../services/jobService';
import companyService from '../../services/companyService';
import Pagination from '../../components/common/Pagination';

export default function HomePage() {
  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [sortOption, setSortOption] = useState('createdAt_desc');

  // Master filter options
  const [industries, setIndustries] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  // Data & pagination state
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Tải danh mục Ngành nghề & Loại việc cho bộ lọc
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const [indRes, typeRes] = await Promise.all([
          companyService.getIndustries({ size: 100 }),
          companyService.getJobTypes({ size: 100 }),
        ]);
        setIndustries(indRes?.content || []);
        setJobTypes(typeRes?.content || []);
      } catch (err) {
        console.error('Lỗi tải danh mục bộ lọc:', err);
      }
    }
    fetchFilterOptions();
  }, []);

  // 2. Tải danh sách việc làm từ GET /api/job-listings
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sortBy, sortDir] = sortOption.split('_');
      const params = {
        keyword: keyword.trim(),
        industryId: selectedIndustry || undefined,
        jobTypeId: selectedJobType || undefined,
        status: 'OPEN', // Chỉ hiển thị các tin đang tuyển
        page,
        size: 9,
        sortBy: sortBy || 'id',
        sortDir: sortDir || 'desc',
      };

      const res = await jobService.searchJobs(params);
      setJobs(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi khi tải danh sách việc làm:', err);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, selectedIndustry, selectedJobType, sortOption, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Xử lý submit tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  };

  // Reset bộ lọc
  const handleResetFilter = () => {
    setKeyword('');
    setSearchInput('');
    setSelectedIndustry('');
    setSelectedJobType('');
    setSortOption('createdAt_desc');
    setPage(0);
  };

  // Helper format lương
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (num) =>
      new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num) + ' đ';
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    return `Đến ${fmt(max)}`;
  };

  return (
    <div className="space-y-8">
      {/* Hero Search Section */}
      <section className="bg-white border border-[#EFE9DF] rounded-[32px] p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] text-center max-w-4xl mx-auto">
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#8C4A08] bg-[#F6B779]/20 border border-[#F6B779]/30 px-3.5 py-1 rounded-full mb-3">
          Cổng tuyển dụng & kết nối nghề nghiệp
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] tracking-tight">
          Tìm kiếm công việc mơ ước của bạn
        </h1>
        <p className="mt-2 text-sm text-[#786F62] max-w-lg mx-auto">
          Khám phá hàng trăm cơ hội việc làm hấp dẫn từ các doanh nghiệp hàng đầu tại Việt Nam.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-[#9E9587] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nhập tiêu đề công việc, kỹ năng, vị trí ứng tuyển..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#FAF7F2] border border-[#E8E2D6] rounded-2xl text-sm text-[#1E1E1E] placeholder:text-[#A8A196] focus:outline-none focus:border-[#F6B779] focus:ring-2 focus:ring-[#F6B779]/20 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] font-semibold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Tìm việc ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Secondary Filter Row */}
        <div className="mt-4 pt-4 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Industry */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl px-3 py-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8A8073]" />
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setPage(0);
                }}
                className="bg-transparent text-[#3A332A] font-medium focus:outline-none cursor-pointer"
              >
                <option value="">Tất cả ngành nghề</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Job Type */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E2DAD0] rounded-xl px-3 py-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#8A8073]" />
              <select
                value={selectedJobType}
                onChange={(e) => {
                  setSelectedJobType(e.target.value);
                  setPage(0);
                }}
                className="bg-transparent text-[#3A332A] font-medium focus:outline-none cursor-pointer"
              >
                <option value="">Tất cả loại việc</option>
                {jobTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {(selectedIndustry || selectedJobType || keyword) && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-[#8A8073]">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(0);
              }}
              className="bg-white border border-[#E2DAD0] rounded-xl px-2.5 py-1 text-[#3A332A] font-medium focus:outline-none cursor-pointer"
            >
              <option value="createdAt_desc">Mới nhất</option>
              <option value="createdAt_asc">Cũ nhất</option>
              <option value="salaryMax_desc">Lương cao nhất</option>
              <option value="salaryMin_asc">Lương tăng dần</option>
            </select>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section Header */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
              Danh sách việc làm đang mở
            </h2>
            <p className="text-xs text-[#8A8073] mt-0.5">
              {totalElements > 0
                ? `Tìm thấy ${totalElements} vị trí tuyển dụng phù hợp`
                : 'Khám phá các cơ hội nghề nghiệp hàng đầu'}
            </p>
          </div>
        </div>

        {/* Loading Skeleton / Indicator */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#8A8073]">
            <Loader2 className="w-8 h-8 animate-spin text-[#F6B779] mb-3" />
            <p className="text-xs font-medium">Đang tải danh sách việc làm...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-[#EFE9DF] rounded-3xl p-12 text-center text-[#8A8073] max-w-lg mx-auto">
            <Briefcase className="w-12 h-12 text-[#C4BDB0] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1E1E1E]">Không tìm thấy việc làm phù hợp</h3>
            <p className="text-xs text-[#786F62] mt-1 mb-4">
              Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc ngành nghề, loại công việc.
            </p>
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E2DAD0] text-[#4A3E31] text-xs font-semibold rounded-xl transition-colors"
            >
              Xem tất cả việc làm
            </button>
          </div>
        ) : (
          <>
            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#EFE9DF] rounded-2xl p-5 hover:border-[#F6B779] hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      {job.industry?.name && (
                        <span className="text-[11px] font-semibold text-[#8C4A08] bg-[#F6B779]/20 border border-[#F6B779]/30 px-2.5 py-0.5 rounded-lg">
                          {job.industry.name}
                        </span>
                      )}
                      {job.jobType?.name && (
                        <span className="text-[11px] font-medium text-[#786F62] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#EAE4D9]">
                          {job.jobType.name}
                        </span>
                      )}
                    </div>

                    {/* Job Title */}
                    <h3 className="font-bold text-sm sm:text-base text-[#1E1E1E] leading-snug group-hover:text-[#B86E20] transition-colors line-clamp-2">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>

                    {/* Meta Info */}
                    <div className="mt-3 space-y-1.5 text-xs text-[#786F62]">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#A89E90] shrink-0" />
                        <span className="font-medium text-[#3A332A] truncate">
                          {job.company?.name || job.recruiter?.company?.name || 'Doanh nghiệp'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#A89E90] shrink-0" />
                        <span className="truncate">
                          {job.companyLocation?.city || job.companyLocation?.address || 'Toàn quốc'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                      </div>
                      {job.deadline && (
                        <div className="flex items-center gap-2 text-[#8A8073] text-[11px]">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3.5 border-t border-[#F4EFE6] flex items-center justify-between">
                    <span className="text-[11px] text-[#A8A196]">
                      {job.createdAt
                        ? `Đăng ${new Date(job.createdAt).toLocaleDateString('vi-VN')}`
                        : ''}
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xs font-semibold text-[#2C241E] bg-[#FAF7F2] hover:bg-[#F6B779] border border-[#E2DAD0] hover:border-[#F6B779] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white border border-[#EFE9DF] rounded-2xl px-4 py-1">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                size={9}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
