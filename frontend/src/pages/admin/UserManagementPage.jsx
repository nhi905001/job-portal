import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Lock,
  Unlock,
  Building2,
  Shield,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import userService from '../../services/userService';
import companyService from '../../services/companyService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function UserManagementPage() {
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RECRUITER');
  const [companyId, setCompanyId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle Active Confirm Dialog State
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  // 1. Tải danh sách công ty để phục vụ dropdown gán Recruiter
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

  // 2. Tải danh sách người dùng
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

  // Tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  // Mở modal tạo tài khoản
  const handleOpenCreateModal = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('RECRUITER');
    setCompanyId(companies.length > 0 ? String(companies[0].id) : '');
    setCreateModalOpen(true);
  };

  // Submit tạo tài khoản người dùng
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Vui lòng nhập họ và tên', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Vui lòng nhập email hợp lệ', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Mật khẩu tối thiểu phải từ 6 ký tự', 'error');
      return;
    }
    if (role === 'RECRUITER' && !companyId) {
      showToast('Tài khoản Recruiter bắt buộc phải thuộc một Doanh nghiệp', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        companyId: role === 'RECRUITER' ? Number(companyId) : null,
      };

      await userService.createUser(payload);
      showToast(`Đã tạo tài khoản ${role} thành công!`, 'success');
      setCreateModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Lỗi tạo người dùng:', err);
      showToast(err.response?.data?.message || 'Tạo tài khoản thất bại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mở dialog khóa / mở khóa tài khoản
  const handleOpenToggleDialog = (u) => {
    if (currentUser?.id === u.id) {
      showToast('Bạn không thể tự khóa tài khoản của chính mình!', 'error');
      return;
    }
    setUserToToggle(u);
    setToggleDialogOpen(true);
  };

  // Xác nhận khóa / mở khóa
  const handleConfirmToggleActive = async () => {
    if (!userToToggle) return;
    try {
      setIsToggling(true);
      const nextActiveState = !userToToggle.active;
      await userService.setUserActive(userToToggle.id, nextActiveState);
      showToast(
        nextActiveState
          ? `Đã mở khóa tài khoản ${userToToggle.email} thành công!`
          : `Đã khóa tài khoản ${userToToggle.email}!`,
        'success'
      );
      setToggleDialogOpen(false);
      setUserToToggle(null);
      fetchUsers();
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái hoạt động:', err);
      showToast(err.response?.data?.message || 'Cập nhật trạng thái thất bại.', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  // Helper hiển thị badge vai trò
  const getRoleBadge = (r) => {
    switch (r) {
      case 'ADMIN':
        return {
          label: 'Quản trị viên (ADMIN)',
          className: 'bg-rose-50 text-rose-700 border-rose-200/80',
          icon: Shield,
        };
      case 'RECRUITER':
        return {
          label: 'Nhà tuyển dụng (RECRUITER)',
          className: 'bg-amber-50 text-amber-800 border-amber-200/80',
          icon: Building2,
        };
      case 'JOB_SEEKER':
      default:
        return {
          label: 'Ứng viên (JOB_SEEKER)',
          className: 'bg-blue-50 text-blue-700 border-blue-200/80',
          icon: Users,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Quản Lý Người Dùng & Phân Quyền
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Quản lý tài khoản toàn hệ thống, cấp quyền Recruiter cho doanh nghiệp và quản lý trạng thái khóa/mở
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tạo tài khoản người dùng</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EFE9DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#8A8073] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo họ tên hoặc email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] placeholder-[#8A8073] focus:outline-none focus:border-[#F6B779]"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#2C241E] hover:bg-[#43382D] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            Tìm
          </button>
        </form>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#8A8073] hidden sm:block" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#3A332A] focus:outline-none focus:border-[#F6B779] cursor-pointer"
          >
            <option value="">Tất cả vai trò (Role)</option>
            <option value="ADMIN">ADMIN (Quản trị viên)</option>
            <option value="RECRUITER">RECRUITER (Nhà tuyển dụng)</option>
            <option value="JOB_SEEKER">JOB_SEEKER (Ứng viên)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Họ và tên</th>
                <th className="px-5 py-3.5">Email liên hệ</th>
                <th className="px-5 py-3.5">Vai trò</th>
                <th className="px-5 py-3.5">Doanh nghiệp trực thuộc</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Khóa / Mở</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                    <span>Đang tải danh sách người dùng...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Users className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#1E1E1E]">Không tìm thấy người dùng phù hợp</p>
                    <p className="text-[11px] mt-0.5">Thử thay đổi bộ lọc vai trò hoặc từ khóa tìm kiếm.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleBadge = getRoleBadge(u.role);
                  const isCurrent = currentUser?.id === u.id;
                  const Icon = roleBadge.icon;
                  return (
                    <tr key={u.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#1E1E1E] flex items-center gap-1.5">
                          <span>{u.fullName || 'Chưa đặt tên'}</span>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-[#FAF7F2] text-[#8C4A08] font-bold border border-[#E8E2D6] rounded">
                              Bạn
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8A8073]">ID: #{u.id}</span>
                      </td>

                      <td className="px-5 py-4 text-[#786F62] font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#A89E90]" />
                        <span>{u.email}</span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${roleBadge.className}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{roleBadge.label}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                        {u.company ? (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#8C4A08]" />
                            <span>{u.company.name}</span>
                          </div>
                        ) : (
                          <span className="text-[#A89E90] italic">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {u.active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đang hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Bị khóa</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isCurrent ? (
                          <span className="text-[11px] text-[#A89E90] italic">Không thể tự khóa</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenToggleDialog(u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ml-auto cursor-pointer ${
                              u.active
                                ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                                : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                            }`}
                          >
                            {u.active ? (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Khóa</span>
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3 h-3" />
                                <span>Mở khóa</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2 border-t border-[#F4EFE6]">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL TẠO TÀI KHOẢN NGƯỜI DÙNG (RECRUITER / ADMIN / SEEKER) */}
      {/* ========================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !isSubmitting && setCreateModalOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#EFE9DF] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F6B779]/20 flex items-center justify-center text-[#8C4A08]">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E1E1E]">Tạo tài khoản người dùng</h3>
                    <p className="text-[11px] text-[#8A8073]">Thêm tài khoản Quản trị viên, Nhà tuyển dụng hoặc Ứng viên</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Quản Trị"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Email đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Mật khẩu khởi tạo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                    Vai trò (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] cursor-pointer"
                  >
                    <option value="RECRUITER">RECRUITER (Nhà tuyển dụng doanh nghiệp)</option>
                    <option value="ADMIN">ADMIN (Quản trị viên toàn hệ thống)</option>
                    <option value="JOB_SEEKER">JOB_SEEKER (Ứng viên tìm việc)</option>
                  </select>
                </div>

                {role === 'RECRUITER' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#2C241E] mb-1.5">
                      Gán với Doanh nghiệp <span className="text-rose-500">*</span>
                    </label>
                    {companies.length === 0 ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Chưa có doanh nghiệp nào. Vui lòng tạo Công ty trước ở mục Quản lý Công ty.</span>
                      </div>
                    ) : (
                      <select
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D6] rounded-xl text-[#1E1E1E] focus:outline-none focus:border-[#F6B779] cursor-pointer"
                      >
                        <option value="">-- Chọn công ty gán quyền --</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F4EFE6]">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (role === 'RECRUITER' && !companyId)}
                    className="px-5 py-2 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tạo...</span>
                      </>
                    ) : (
                      <span>Tạo tài khoản</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dialog xác nhận khóa / mở khóa tài khoản */}
      <ConfirmDialog
        isOpen={toggleDialogOpen}
        title={userToToggle?.active ? 'Khóa tài khoản người dùng' : 'Mở khóa tài khoản người dùng'}
        message={
          userToToggle?.active
            ? `Bạn có chắc chắn muốn KHÓA tài khoản "${userToToggle?.email}"? Người dùng này sẽ không thể đăng nhập vào hệ thống cho đến khi được mở khóa lại.`
            : `Bạn có muốn MỞ KHÓA cho tài khoản "${userToToggle?.email}" tiếp tục hoạt động?`
        }
        confirmText={userToToggle?.active ? 'Khóa tài khoản' : 'Mở khóa'}
        confirmVariant={userToToggle?.active ? 'danger' : 'primary'}
        isLoading={isToggling}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => {
          setToggleDialogOpen(false);
          setUserToToggle(null);
        }}
      />
    </div>
  );
}
