import { useState, useCallback, useEffect } from 'react';
import companyService from '../services/companyService';
import fileService from '../services/fileService';
import { useToast } from '../context/ToastContext';

export function useCompanies() {
  const { showToast } = useToast();

  const [companies, setCompanies] = useState([]);
  const [companyPage, setCompanyPage] = useState(0);
  const [companyTotalPages, setCompanyTotalPages] = useState(0);
  const [companyTotalElements, setCompanyTotalElements] = useState(0);
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [companyKeyword, setCompanyKeyword] = useState('');

  // Modal State
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  // Delete State
  const [deleteCompanyDialogOpen, setDeleteCompanyDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);

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

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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

  const handleSaveCompany = async (e) => {
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
      console.error('Lỗi lưu công ty:', err);
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
      const msg = err.response?.status === 409
        ? 'Không thể xóa công ty đang có tin tuyển dụng hoặc chi nhánh liên kết.'
        : err.response?.data?.message || 'Xóa công ty thất bại.';
      showToast(msg, 'error');
    } finally {
      setIsDeletingCompany(false);
    }
  };

  return {
    companies, companyPage, companyTotalPages, companyTotalElements, isCompanyLoading, companyKeyword,
    companyModalOpen, isEditingCompany, companyName, companyWebsite, companyDescription, companyLogoUrl,
    isUploadingLogo, isSavingCompany, deleteCompanyDialogOpen, companyToDelete, isDeletingCompany,
    setCompanyPage, setCompanyKeyword, setCompanyModalOpen, setCompanyName, setCompanyWebsite,
    setCompanyDescription, setCompanyLogoUrl, setDeleteCompanyDialogOpen, setCompanyToDelete,
    handleOpenCreateCompany, handleOpenEditCompany, handleUploadLogo, handleSaveCompany,
    handleConfirmDeleteCompany, fetchCompanies,
  };
}
