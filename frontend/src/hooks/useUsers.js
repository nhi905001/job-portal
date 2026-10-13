import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import userService from '../services/userService';
import companyService from '../services/companyService';

export function useUsers() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  // Companies for Recruiter creation
  const [companies, setCompanies] = useState([]);

  // Create User Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'RECRUITER',
    companyId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle Active Confirm Dialog State
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await companyService.getCompanies({ size: 100 });
        setCompanies(res?.content || []);
      } catch (err) {
        console.error('Lỗi tải danh sách công ty:', err);
      }
    }
    loadCompanies();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        role: roleFilter || undefined,
        keyword: keyword.trim() || undefined,
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      };
      const res = await userService.getUsers(params);
      setUsers(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
      showToast('Không thể tải danh sách người dùng.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, keyword, page, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleOpenCreateModal = () => {
    setUserForm({
      fullName: '',
      email: '',
      password: '',
      role: 'RECRUITER',
      companyId: companies.length > 0 ? String(companies[0].id) : '',
    });
    setCreateModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUserSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!userForm.fullName.trim() || !userForm.email.trim() || !userForm.password) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc.', 'error');
      return;
    }
    if (userForm.role === 'RECRUITER' && !userForm.companyId) {
      showToast('Tài khoản Recruiter bắt buộc phải thuộc một Doanh nghiệp', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim().toLowerCase(),
        password: userForm.password,
        role: userForm.role,
        companyId: userForm.role === 'RECRUITER' ? Number(userForm.companyId) : null,
      };
      await userService.createUser(payload);
      showToast('Tạo tài khoản người dùng thành công!', 'success');
      setCreateModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Lỗi tạo người dùng:', err);
      showToast(err.response?.data?.message || 'Tạo tài khoản thất bại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenToggleDialog = (targetUser) => {
    if (currentUser?.id === targetUser.id) {
      showToast('Bạn không thể tự khóa tài khoản của chính mình!', 'warning');
      return;
    }
    setUserToToggle(targetUser);
    setToggleDialogOpen(true);
  };

  const handleConfirmToggleActive = async () => {
    if (!userToToggle) return;
    try {
      setIsToggling(true);
      const newActive = !userToToggle.active;
      await userService.toggleUserActive(userToToggle.id, newActive);
      showToast(
        newActive
          ? `Đã mở khóa tài khoản "${userToToggle.fullName}" thành công!`
          : `Đã khóa tài khoản "${userToToggle.fullName}"!`,
        'success'
      );
      setToggleDialogOpen(false);
      setUserToToggle(null);
      fetchUsers();
    } catch (err) {
      console.error('Lỗi đổi trạng thái active:', err);
      showToast(err.userFriendlyMessage || err.response?.data?.message || err.message || 'Thao tác thất bại.', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  return {
    currentUser,
    users,
    page,
    totalPages,
    totalElements,
    isLoading,
    roleFilter,
    keyword,
    companies,
    createModalOpen,
    userForm,
    isSubmitting,
    toggleDialogOpen,
    userToToggle,
    isToggling,
    setPage,
    setRoleFilter,
    setKeyword,
    setCreateModalOpen,
    setToggleDialogOpen,
    handleSearchSubmit,
    handleOpenCreateModal,
    handleFormChange,
    handleCreateUserSubmit,
    handleOpenToggleDialog,
    handleConfirmToggleActive,
  };
}
