import { useState, useCallback, useEffect } from 'react';
import companyService from '../services/companyService';
import { useToast } from '../context/ToastContext';

export function useCompanyLocations(defaultCompanyList = []) {
  const { showToast } = useToast();

  const [locations, setLocations] = useState([]);
  const [locationPage, setLocationPage] = useState(0);
  const [locationTotalPages, setLocationTotalPages] = useState(0);
  const [locationTotalElements, setLocationTotalElements] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [locationCompanyFilter, setLocationCompanyFilter] = useState('');
  const [locationKeyword, setLocationKeyword] = useState('');

  // Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [locCompanyId, setLocCompanyId] = useState('');
  const [locCity, setLocCity] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [isSavingLocation, setIsSavingLocation] = useState(false);

  // Delete State
  const [deleteLocationDialogOpen, setDeleteLocationDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [isDeletingLocation, setIsDeletingLocation] = useState(false);

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
    fetchLocations();
  }, [fetchLocations]);

  const handleOpenCreateLocation = (defaultCompId) => {
    setIsEditingLocation(false);
    setEditingLocationId(null);
    setLocCompanyId(defaultCompId || (defaultCompanyList.length > 0 ? String(defaultCompanyList[0].id) : ''));
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

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!locCompanyId) return showToast('Vui lòng chọn doanh nghiệp', 'error');
    if (!locCity.trim()) return showToast('Vui lòng nhập thành phố', 'error');
    if (!locAddress.trim()) return showToast('Vui lòng nhập địa chỉ chi tiết', 'error');

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
      const msg = err.response?.status === 409
        ? 'Không thể xóa địa điểm đang được gán cho các tin tuyển dụng đang hoạt động.'
        : err.response?.data?.message || 'Xóa địa điểm thất bại.';
      showToast(msg, 'error');
    } finally {
      setIsDeletingLocation(false);
    }
  };

  return {
    locations, locationPage, locationTotalPages, locationTotalElements, isLocationLoading,
    locationCompanyFilter, locationKeyword, locationModalOpen, isEditingLocation, locCompanyId,
    locCity, locAddress, isSavingLocation, deleteLocationDialogOpen, locationToDelete, isDeletingLocation,
    setLocationPage, setLocationCompanyFilter, setLocationKeyword, setLocationModalOpen,
    setLocCompanyId, setLocCity, setLocAddress, setDeleteLocationDialogOpen, setLocationToDelete,
    handleOpenCreateLocation, handleOpenEditLocation, handleSaveLocation, handleConfirmDeleteLocation, fetchLocations,
  };
}
