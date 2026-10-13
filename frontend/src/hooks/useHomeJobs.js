import { useState, useEffect, useCallback } from 'react';
import jobService from '../services/jobService';
import companyService from '../services/companyService';

export function useHomeJobs() {
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [sortOption, setSortOption] = useState('createdAt_desc');

  const [industries, setIndustries] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sortBy, sortDir] = sortOption.split('_');
      const params = {
        keyword: keyword.trim(),
        industryId: selectedIndustry || undefined,
        jobTypeId: selectedJobType || undefined,
        status: 'OPEN',
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

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  };

  const handleResetFilter = () => {
    setKeyword('');
    setSearchInput('');
    setSelectedIndustry('');
    setSelectedJobType('');
    setSortOption('createdAt_desc');
    setPage(0);
  };

  return {
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
  };
}
