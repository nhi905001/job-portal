import React from 'react';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

export default function HomeHeroSearch({
  searchInput,
  onSearchChange,
  onSearchSubmit,
  selectedLocation,
  onLocationChange,
  locations = [],
  activeFilterCount = 0,
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
  onQuickFilter,
}) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Job Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Khám phá cơ hội nghề nghiệp hàng đầu từ các công ty công nghệ và doanh nghiệp uy tín.
          </p>
        </div>
      </div>

      {/* Main Search Toolbar (Exact match to reference mockup!) */}
      <form
        onSubmit={onSearchSubmit}
        className="bg-white border border-slate-200/90 rounded-2xl p-2 sm:p-2.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2"
      >
        {/* Search Input */}
        <div className="flex-1 relative flex items-center min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by job title, company, keywords"
            className="w-full pl-10 pr-3 py-2.5 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Divider on desktop */}
        <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

        {/* Location Dropdown */}
        <div className="relative flex items-center md:w-56 shrink-0">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedLocation || ''}
            onChange={(e) => onLocationChange?.(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 md:bg-transparent rounded-xl text-xs sm:text-sm text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer appearance-none truncate"
          >
            <option value="">Anywhere (Toàn quốc)</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Cần Thơ">Cần Thơ</option>
            <option value="Remote">Làm việc từ xa (Remote)</option>
            {locations.map((loc) => (
              <option key={loc.id || loc} value={loc.city || loc}>
                {loc.city || loc}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▾
          </div>
        </div>

        {/* Search & Submit Button */}
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4 text-slate-950" />
          <span>Tìm việc</span>
        </button>
      </form>

      {/* Active Filter Chips Row (as in mockup: ✕ Design, ✕ Regular, ✕ Full time, Clear All) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        {/* Quick presets & active tags */}
        {activeFilters.length > 0 ? (
          <>
            {activeFilters.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onRemoveFilter?.(tag.type, tag.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 transition-colors font-medium group"
              >
                <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                <span>{tag.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={onClearAll}
              className="text-slate-500 hover:text-slate-900 font-semibold px-2 py-1 text-xs transition-colors underline-offset-4 hover:underline"
            >
              Clear All
            </button>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-slate-400 text-xs">
            <span className="text-[11px] font-medium text-slate-400">Gợi ý tìm kiếm:</span>
            {['Design', 'Developer', 'Full time', 'Remote', 'Marketing'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onQuickFilter?.(suggestion)}
                className="px-3 py-1 rounded-full bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200/90 text-slate-600 text-[11px] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
