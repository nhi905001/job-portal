import React from 'react';
import { useHomeJobs } from '../../hooks/useHomeJobs';
import Pagination from '../../components/common/Pagination';
import {
  HomeHeroSearch,
  HomeFilterBar,
  JobListGrid,
} from '../../features/home';

export default function HomePage() {
  const {
    searchInput,
    selectedIndustry,
    selectedJobType,
    sortOption,
    industries,
    jobTypes,
    jobs,
    page,
    totalPages,
    totalElements,
    isLoading,
    setSearchInput,
    setSelectedIndustry,
    setSelectedJobType,
    setSortOption,
    setPage,
    handleSearchSubmit,
    handleResetFilter,
  } = useHomeJobs();

  // Compute active filters list for dismissible chips
  const activeFilters = [];
  if (searchInput.trim()) {
    activeFilters.push({ type: 'keyword', id: searchInput, label: `Từ khóa: ${searchInput}` });
  }
  if (selectedIndustry) {
    const ind = industries.find((i) => String(i.id) === String(selectedIndustry));
    if (ind) {
      activeFilters.push({ type: 'industry', id: selectedIndustry, label: ind.name });
    }
  }
  if (selectedJobType) {
    const jt = jobTypes.find((t) => String(t.id) === String(selectedJobType));
    if (jt) {
      activeFilters.push({ type: 'jobType', id: selectedJobType, label: jt.name });
    }
  }

  const handleRemoveFilter = (type) => {
    if (type === 'keyword') {
      setSearchInput('');
      handleSearchSubmit();
    } else if (type === 'industry') {
      setSelectedIndustry('');
      setPage(0);
    } else if (type === 'jobType') {
      setSelectedJobType('');
      setPage(0);
    }
  };

  const handleQuickFilter = (tag) => {
    setSearchInput(tag);
    // Find matching job type or industry if exists
    const matchedType = jobTypes.find((t) => t.name.toLowerCase().includes(tag.toLowerCase()));
    if (matchedType) {
      setSelectedJobType(matchedType.id);
    }
    const matchedInd = industries.find((i) => i.name.toLowerCase().includes(tag.toLowerCase()));
    if (matchedInd) {
      setSelectedIndustry(matchedInd.id);
    }
    setPage(0);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Job Board Header & Search Toolbar */}
      <HomeHeroSearch
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleResetFilter}
        onQuickFilter={handleQuickFilter}
      />

      {/* Result Count & Sorting Bar */}
      <HomeFilterBar
        selectedIndustry={selectedIndustry}
        selectedJobType={selectedJobType}
        sortOption={sortOption}
        industries={industries}
        jobTypes={jobTypes}
        totalElements={totalElements}
        onIndustryChange={(id) => {
          setSelectedIndustry(id);
          setPage(0);
        }}
        onJobTypeChange={(id) => {
          setSelectedJobType(id);
          setPage(0);
        }}
        onSortChange={(s) => {
          setSortOption(s);
          setPage(0);
        }}
        onReset={handleResetFilter}
      />

      {/* Horizontal Job Cards List */}
      <JobListGrid
        jobs={jobs}
        isLoading={isLoading}
        totalElements={totalElements}
      />

      {/* Pagination */}
      {!isLoading && jobs.length > 0 && (
        <div className="flex justify-center pt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={9}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
