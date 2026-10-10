import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Globe,
  Upload,
  Loader2,
  X,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import companyService from '../../services/companyService';
import fileService from '../../services/fileService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function CompanyManagementPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('companies'); // 'companies' | 'locations'

  // =========================================================
  // TAB 1: CÔNG TY (Companies)
  // =========================================================
  const [companies, setCompanies] = useState([]);
  const [companyPage, setCompanyPage] = useState(0);
  const [companyTotalPages, setCompanyTotalPages] = useState(0);
  const [companyTotalElements, setCompanyTotalElements] = useState(0);
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [companyKeyword, setCompanyKeyword] = useState('');

  // Company Modal State
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  // Delete Company State
  const [deleteCompanyDialogOpen, setDeleteCompanyDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);

  // =========================================================
  // TAB 2: ĐỊA ĐIỂM (Locations)
  // =========================================================
  const [locations, setLocations] = useState([]);
  const [locationPage, setLocationPage] = useState(0);
  const [locationTotalPages, setLocationTotalPages] = useState(0);
  const [locationTotalElements, setLocationTotalElements] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [locationCompanyFilter, setLocationCompanyFilter] = useState('');
  const [locationKeyword, setLocationKeyword] = useState('');

  // Location Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [locCompanyId, setLocCompanyId] = useState('');
  const [locCity, setLocCity] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [isSavingLocation, setIsSavingLocation] = useState(false);

  // Delete Location State
  const [deleteLocationDialogOpen, setDeleteLocationDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [isDeletingLocation, setIsDeletingLocation] = useState(false);

  // =========================================================
  // FETCH DATA
  // =========================================================
  const fetchCompanies = useCallback(async () => {
    try {
      setIsCompanyLoading(true);
      const res = await companyService.getCompanies({
        keyword: companyKeyword.trim() || undefined,
        page: companyPage,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setCompanies(res?.content || []);
      setCompanyTotalPages(res?.totalPages || 0);
      setCompanyTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách công ty:', err);
      showToast('Không thể tải danh sách công ty.', 'error');
    } finally {
      setIsCompanyLoading(false);
    }
  }, [companyKeyword, companyPage, showToast]);

  const fetchLocations = useCallback(async () => {
    try {
      setIsLocationLoading(true);
      const res = await companyService.getLocations({
        companyId: locationCompanyFilter || undefined,
        keyword: locationKeyword.trim() || undefined,
        page: locationPage,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setLocations(res?.content || []);
      setLocationTotalPages(res?.totalPages || 0);
      setLocationTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách địa điểm:', err);
      showToast('Không thể tải danh sách địa điểm.', 'error');
    } finally {
      setIsLocationLoading(false);
    }
  }, [locationCompanyFilter, locationKeyword, locationPage, showToast]);

  useEffect(() => {
    if (activeTab === 'companies') {
      fetchCompanies();
    } else {
      fetchLocations();
    }
  }, [activeTab, fetchCompanies, fetchLocations]);

  // =========================================================
  // ACTIONS CÔNG TY
  // =========================================================
  const handleOpenCreateCompany = () => {
    setIsEditingCompany(false);
    setEditingCompanyId(null);
    setCompanyName('');
    setCompanyWebsite('');
    setCompanyDescription('');
    setCompanyLogoUrl('');
    setCompanyModalOpen(true);
  };

  const handleOpenEditCompany = (c) => {
    setIsEditingCompany(true);
    setEditingCompanyId(c.id);
    setCompanyName(c.name || '');
    setCompanyWebsite(c.website || '');
    setCompanyDescription(c.description || '');
    setCompanyLogoUrl(c.logoUrl || '');
    setCompanyModalOpen(true);
  };

  const handleUploadLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file hình ảnh (PNG, JPG, WEBP)', 'error');
      return;
    }

    try {
      setIsUploadingLogo(true);
      const res = await fileService.uploadFile(file);
      const uploadedUrl = res.url || res.data?.url || res;
      setCompanyLogoUrl(uploadedUrl);
      showToast('Tải logo lên thành công!', 'success');
    } catch (err) {
      console.error('Lỗi tải logo:', err);
      showToast('Tải ảnh logo thất bại.', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveCompanySubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showToast('Vui lòng nhập tên doanh nghiệp', 'error');
      return;
    }

    try {
      setIsSavingCompany(true);
      const payload = {
        name: companyName.trim(),
        website: companyWebsite.trim() || null,
        description: companyDescription.trim() || null,
        logoUrl: companyLogoUrl.trim() || null,
      };

      if (isEditingCompany) {
        await companyService.updateCompany(editingCompanyId, payload);
        showToast('Cập nhật thông tin công ty thành công!', 'success');
      } else {
        await companyService.createCompany(payload);
        showToast('Thêm doanh nghiệp mới thành công!', 'success');
      }
      setCompanyModalOpen(false);
      fetchCompanies();
    } catch (err) {
      console.error('Lỗi lưu thông tin công ty:', err);
      showToast(err.response?.data?.message || 'Lưu thông tin thất bại.', 'error');
    } finally {
      setIsSavingCompany(false);
    }
  };

  const handleConfirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    try {
      setIsDeletingCompany(true);
      await companyService.deleteCompany(companyToDelete.id);
      showToast('Đã xóa doanh nghiệp thành công!', 'success');
      setDeleteCompanyDialogOpen(false);
      setCompanyToDelete(null);
      fetchCompanies();
    } catch (err) {
      console.error('Lỗi xóa công ty:', err);
      const msg =
        err.response?.status === 409
          ? 'Không thể xóa công ty đang có tin tuyển dụng, địa điểm chi nhánh hoặc nhân sự liên kết.'
          : err.response?.data?.message || 'Xóa công ty thất bại.';
      showToast(msg, 'error');
    } finally {
      setIsDeletingCompany(false);
    }
  };

  // =========================================================
  // ACTIONS ĐỊA ĐIỂM
  // =========================================================
  const handleOpenCreateLocation = (defaultCompId) => {
    setIsEditingLocation(false);
    setEditingLocationId(null);
    setLocCompanyId(defaultCompId || (companies.length > 0 ? String(companies[0].id) : ''));
    setLocCity('');
    setLocAddress('');
    setLocationModalOpen(true);
  };

  const handleOpenEditLocation = (loc) => {
    setIsEditingLocation(true);
    setEditingLocationId(loc.id);
    setLocCompanyId(loc.company?.id ? String(loc.company.id) : '');
    setLocCity(loc.city || '');
    setLocAddress(loc.address || '');
    setLocationModalOpen(true);
  };

  const handleSaveLocationSubmit = async (e) => {
    e.preventDefault();
    if (!locCompanyId) {
      showToast('Vui lòng chọn doanh nghiệp', 'error');
      return;
    }
    if (!locCity.trim()) {
      showToast('Vui lòng nhập thành phố', 'error');
      return;
    }
    if (!locAddress.trim()) {
      showToast('Vui lòng nhập địa chỉ chi tiết', 'error');
      return;
    }

    try {
      setIsSavingLocation(true);
      const payload = {
        companyId: Number(locCompanyId),
        city: locCity.trim(),
        address: locAddress.trim(),
      };

      if (isEditingLocation) {
        await companyService.updateLocation(editingLocationId, payload);
        showToast('Cập nhật địa điểm thành công!', 'success');
      } else {
        await companyService.createLocation(payload);
        showToast('Thêm địa điểm chi nhánh mới thành công!', 'success');
      }
      setLocationModalOpen(false);
      fetchLocations();
    } catch (err) {
      console.error('Lỗi lưu địa điểm:', err);
      showToast(err.response?.data?.message || 'Lưu địa điểm thất bại.', 'error');
    } finally {
      setIsSavingLocation(false);
    }
  };

  const handleConfirmDeleteLocation = async () => {
    if (!locationToDelete) return;
    try {
      setIsDeletingLocation(true);
      await companyService.deleteLocation(locationToDelete.id);
      showToast('Đã xóa địa điểm chi nhánh thành công!', 'success');
      setDeleteLocationDialogOpen(false);
      setLocationToDelete(null);
      fetchLocations();
    } catch (err) {
      console.error('Lỗi xóa địa điểm:', err);
      const msg =
        err.response?.status === 409
          ? 'Không thể xóa địa điểm đang được gán cho các tin tuyển dụng đang hoạt động.'
          : err.response?.data?.message || 'Xóa địa điểm thất bại.';
      showToast(msg, 'error');
    } finally {
      setIsDeletingLocation(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản Lý Công Ty & Địa Điểm Làm Việc
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Thiết lập danh bạ doanh nghiệp đối tác, upload logo đại diện và danh sách địa điểm chi nhánh
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'companies' ? (
            <button
              type="button"
              onClick={handleOpenCreateCompany}
              className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm doanh nghiệp mới</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenCreateLocation('')}
              className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm địa điểm chi nhánh</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#EFE9DF] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'companies'
              ? 'bg-[#2C241E] text-white shadow-sm'
              : 'text-[#786F62] hover:bg-[#F4EFE6] hover:text-[#1E1E1E]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Doanh nghiệp ({companyTotalElements})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'locations'
              ? 'bg-[#2C241E] text-white shadow-sm'
              : 'text-[#786F62] hover:bg-[#F4EFE6] hover:text-[#1E1E1E]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Địa điểm chi nhánh ({locationTotalElements})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* NỘI DUNG TAB 1: DOANH NGHIỆP                              */}
      {/* ========================================================= */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white border border-[#EFE9DF] rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCompanyPage(0);
                fetchCompanies();
              }}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-[#8A8073] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên công ty..."
                  value={companyKeyword}
                  onChange={(e) => setCompanyKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder-[#8A8073] focus:outline-none focus:border-[#F6B779]"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#2C241E] hover:bg-[#43382D] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Logo</th>
                    <th className="px-5 py-3.5">Doanh nghiệp</th>
                    <th className="px-5 py-3.5">Website chính thức</th>
                    <th className="px-5 py-3.5">Giới thiệu vắn tắt</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
                  {isCompanyLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-[#8A8073]">
                        <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                        <span>Đang tải danh sách doanh nghiệp...</span>
                      </td>
                    </tr>
                  ) : companies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-[#8A8073]">
                        <Building2 className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                        <p className="font-semibold text-xs text-[#1E1E1E]">Chưa có doanh nghiệp nào</p>
                        <p className="text-[11px] mt-0.5">Nhấn "Thêm doanh nghiệp mới" để bắt đầu thiết lập.</p>
                      </td>
                    </tr>
                  ) : (
                    companies.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] overflow-hidden flex items-center justify-center shrink-0">
                            {c.logoUrl ? (
                              <img
                                src={fileService.getFullFileUrl(c.logoUrl)}
                                alt={c.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Building2 className="w-5 h-5 text-[#8C4A08]" />
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-sm text-[#1E1E1E] block">{c.name}</span>
                          <span className="text-[11px] text-[#8A8073]">Mã định danh: #{c.id}</span>
                        </td>

                        <td className="px-5 py-4">
                          {c.website ? (
                            <a
                              href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-[#8C4A08] hover:underline font-medium"
                            >
                              <Globe className="w-3.5 h-3.5 text-[#A89E90]" />
                              <span>{c.website}</span>
                              <ExternalLink className="w-3 h-3 text-[#A89E90]" />
                            </a>
                          ) : (
                            <span className="text-[#A89E90] italic">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-[#786F62] max-w-xs truncate">
                          {c.description || 'Chưa có mô tả'}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('locations');
                                setLocationCompanyFilter(String(c.id));
                              }}
                              className="px-2.5 py-1 text-[11px] text-[#8C4A08] bg-[#F6B779]/20 hover:bg-[#F6B779]/30 rounded-lg font-semibold transition-colors cursor-pointer"
                              title="Xem địa điểm chi nhánh"
                            >
                              Chi nhánh
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditCompany(c)}
                              className="p-1.5 text-[#6B6152] hover:text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa thông tin"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCompanyToDelete(c);
                                setDeleteCompanyDialogOpen(true);
                              }}
                              className="p-1.5 text-[#8A8073] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa công ty"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2 border-t border-[#F4EFE6]">
              <Pagination
                page={companyPage}
                totalPages={companyTotalPages}
                totalElements={companyTotalElements}
                size={10}
                onPageChange={(p) => setCompanyPage(p)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NỘI DUNG TAB 2: ĐỊA ĐIỂM CHI NHÁNH                        */}
      {/* ========================================================= */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-[#EFE9DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <select
                value={locationCompanyFilter}
                onChange={(e) => {
                  setLocationCompanyFilter(e.target.value);
                  setLocationPage(0);
                }}
                className="w-full sm:w-64 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#3A332A] focus:outline-none focus:border-[#F6B779] cursor-pointer"
              >
                <option value="">Tất cả doanh nghiệp</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#8A8073] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm thành phố hoặc địa chỉ..."
                  value={locationKeyword}
                  onChange={(e) => setLocationKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder-[#8A8073] focus:outline-none focus:border-[#F6B779]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setLocationPage(0);
                  fetchLocations();
                }}
                className="px-3.5 py-2 bg-[#2C241E] hover:bg-[#43382D] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Lọc
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Doanh nghiệp trực thuộc</th>
                    <th className="px-5 py-3.5">Thành phố / Tỉnh</th>
                    <th className="px-5 py-3.5">Địa chỉ chi tiết</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
                  {isLocationLoading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-[#8A8073]">
                        <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                        <span>Đang tải danh sách địa điểm...</span>
                      </td>
                    </tr>
                  ) : locations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-[#8A8073]">
                        <MapPin className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                        <p className="font-semibold text-xs text-[#1E1E1E]">Chưa có địa điểm nào</p>
                        <p className="text-[11px] mt-0.5">Nhấn "Thêm địa điểm chi nhánh" để bắt đầu tạo.</p>
                      </td>
                    </tr>
                  ) : (
                    locations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="px-5 py-4 font-bold text-[#1E1E1E] flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#8C4A08]" />
                          <span>{loc.company?.name || 'Doanh nghiệp'}</span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold text-xs text-[#2C241E] bg-[#FAF7F2] border border-[#E8E2D6] px-2.5 py-0.5 rounded-lg">
                            {loc.city}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-[#786F62]">{loc.address}</td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditLocation(loc)}
                              className="p-1.5 text-[#6B6152] hover:text-[#1E1E1E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa địa điểm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocationToDelete(loc);
                                setDeleteLocationDialogOpen(true);
                              }}
                              className="p-1.5 text-[#8A8073] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa địa điểm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2 border-t border-[#F4EFE6]">
              <Pagination
                page={locationPage}
                totalPages={locationTotalPages}
                totalElements={locationTotalElements}
                size={10}
                onPageChange={(p) => setLocationPage(p)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL TẠO / SỬA CÔNG TY                                   */}
      {/* ========================================================= */}
      {companyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSavingCompany && setCompanyModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F6B779]/20 flex items-center justify-center text-[#8C4A08]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E1E1E]">
                      {isEditingCompany ? 'Chỉnh sửa doanh nghiệp' : 'Thêm doanh nghiệp mới'}
                    </h3>
                    <p className="text-[11px] text-[#8A8073]">Thông tin hồ sơ công ty và nhận diện thương hiệu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCompanyModalOpen(false)}
                  disabled={isSavingCompany}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCompanySubmit} className="space-y-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">Logo doanh nghiệp</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D6] overflow-hidden flex items-center justify-center shrink-0">
                      {companyLogoUrl ? (
                        <img
                          src={fileService.getFullFileUrl(companyLogoUrl)}
                          alt="Company Logo Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-7 h-7 text-[#C4BDB0]" />
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-white border border-[#E2DAD0] rounded-xl text-xs font-semibold text-[#8C4A08] cursor-pointer transition-colors shadow-2xs">
                        {isUploadingLogo ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{isUploadingLogo ? 'Đang tải lên...' : 'Tải ảnh logo lên'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadLogo}
                          disabled={isUploadingLogo}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-[#8A8073]">Định dạng JPG, PNG hoặc WEBP (tối đa 5MB)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Tên doanh nghiệp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    placeholder="Ví dụ: FPT Software, Viettel Telecom..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">Website chính thức</label>
                  <input
                    type="text"
                    placeholder="https://fptsoftware.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">Mô tả giới thiệu công ty</label>
                  <textarea
                    rows={3}
                    placeholder="Giới thiệu tầm nhìn, sứ mệnh và quy mô doanh nghiệp..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F4EFE6]">
                  <button
                    type="button"
                    onClick={() => setCompanyModalOpen(false)}
                    disabled={isSavingCompany}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCompany}
                    className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingCompany ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <span>{isEditingCompany ? 'Lưu thay đổi' : 'Thêm doanh nghiệp'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL TẠO / SỬA ĐỊA ĐIỂM CHI NHÁNH                         */}
      {/* ========================================================= */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSavingLocation && setLocationModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F6B779]/20 flex items-center justify-center text-[#8C4A08]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E1E1E]">
                      {isEditingLocation ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm chi nhánh'}
                    </h3>
                    <p className="text-[11px] text-[#8A8073]">Địa chỉ văn phòng làm việc của doanh nghiệp</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(false)}
                  disabled={isSavingLocation}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLocationSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Doanh nghiệp <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={locCompanyId}
                    onChange={(e) => setLocCompanyId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] cursor-pointer"
                  >
                    <option value="">-- Chọn doanh nghiệp --</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Thành phố / Tỉnh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng..."
                    value={locCity}
                    onChange={(e) => setLocCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Địa chỉ chi tiết <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tòa nhà FPT Cầu Giấy, Số 10 Phạm Văn Bạch..."
                    value={locAddress}
                    onChange={(e) => setLocAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F4EFE6]">
                  <button
                    type="button"
                    onClick={() => setLocationModalOpen(false)}
                    disabled={isSavingLocation}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingLocation}
                    className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <span>{isEditingLocation ? 'Lưu thay đổi' : 'Thêm địa điểm'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog Xóa Công ty */}
      <ConfirmDialog
        isOpen={deleteCompanyDialogOpen}
        title="Xóa Doanh Nghiệp"
        message={`Bạn có chắc chắn muốn xóa doanh nghiệp "${companyToDelete?.name}"? Hệ thống sẽ ngăn chặn nếu công ty đang có tin tuyển dụng hoặc chi nhánh liên kết.`}
        confirmText="Xóa doanh nghiệp"
        confirmVariant="danger"
        isLoading={isDeletingCompany}
        onConfirm={handleConfirmDeleteCompany}
        onCancel={() => {
          setDeleteCompanyDialogOpen(false);
          setCompanyToDelete(null);
        }}
      />

      {/* Confirm Dialog Xóa Địa điểm */}
      <ConfirmDialog
        isOpen={deleteLocationDialogOpen}
        title="Xóa Địa Điểm Chi Nhánh"
        message={`Bạn có chắc chắn muốn xóa chi nhánh "${locationToDelete?.address}, ${locationToDelete?.city}"?`}
        confirmText="Xóa địa điểm"
        confirmVariant="danger"
        isLoading={isDeletingLocation}
        onConfirm={handleConfirmDeleteLocation}
        onCancel={() => {
          setDeleteLocationDialogOpen(false);
          setLocationToDelete(null);
        }}
      />
    </div>
  );
}
