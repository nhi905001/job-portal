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

  return (
    <div className="space-y-8">
      {/* Hero Search Section */}
      <HomeHeroSearch
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Filter Bar */}
      <HomeFilterBar
        selectedIndustry={selectedIndustry}
        selectedJobType={selectedJobType}
        sortOption={sortOption}
        industries={industries}
        jobTypes={jobTypes}
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

      {/* Job Grid */}
      <JobListGrid
        jobs={jobs}
        isLoading={isLoading}
        totalElements={totalElements}
      />

      {/* Pagination */}
      {!isLoading && jobs.length > 0 && (
        <div className="flex justify-center pt-2">
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
