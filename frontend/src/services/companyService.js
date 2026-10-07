import axiosClient from '../api/axiosClient';

/**
 * Service quản lý Công ty, Địa điểm, Ngành nghề và Loại hình công việc
 * Tương ứng với CompanyController (/api/companies), CompanyLocationController (/api/locations),
 * IndustryController (/api/industries), JobTypeController (/api/job-types)
 */
const companyService = {
  // ==========================================
  // 1. CÔNG TY (Companies)
  // ==========================================
  getCompanies: async (params = {}) => {
    return await axiosClient.get('/api/companies', { params });
  },

  getCompanyById: async (id) => {
    return await axiosClient.get(`/api/companies/${id}`);
  },

  createCompany: async (data) => {
    return await axiosClient.post('/api/companies', data);
  },

  updateCompany: async (id, data) => {
    return await axiosClient.put(`/api/companies/${id}`, data);
  },

  deleteCompany: async (id) => {
    return await axiosClient.delete(`/api/companies/${id}`);
  },

  // ==========================================
  // 2. ĐỊA ĐIỂM (Locations)
  // ==========================================
  getLocations: async (params = {}) => {
    return await axiosClient.get('/api/locations', { params });
  },

  getLocationById: async (id) => {
    return await axiosClient.get(`/api/locations/${id}`);
  },

  createLocation: async (data) => {
    return await axiosClient.post('/api/locations', data);
  },

  updateLocation: async (id, data) => {
    return await axiosClient.put(`/api/locations/${id}`, data);
  },

  deleteLocation: async (id) => {
    return await axiosClient.delete(`/api/locations/${id}`);
  },

  // ==========================================
  // 3. NGÀNH NGHỀ (Industries)
  // ==========================================
  getIndustries: async (params = {}) => {
    return await axiosClient.get('/api/industries', { params });
  },

  createIndustry: async (data) => {
    return await axiosClient.post('/api/industries', data);
  },

  updateIndustry: async (id, data) => {
    return await axiosClient.put(`/api/industries/${id}`, data);
  },

  deleteIndustry: async (id) => {
    return await axiosClient.delete(`/api/industries/${id}`);
  },

  // ==========================================
  // 4. LOẠI HÌNH CÔNG VIỆC (Job Types)
  // ==========================================
  getJobTypes: async (params = {}) => {
    return await axiosClient.get('/api/job-types', { params });
  },

  createJobType: async (data) => {
    return await axiosClient.post('/api/job-types', data);
  },

  updateJobType: async (id, data) => {
    return await axiosClient.put(`/api/job-types/${id}`, data);
  },

  deleteJobType: async (id) => {
    return await axiosClient.delete(`/api/job-types/${id}`);
  },
};

export default companyService;
