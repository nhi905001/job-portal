import React from 'react';
import { UserPlus } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { UserFilterBar, UserTable, CreateUserModal } from '../../features/users';

export default function UserManagementPage() {
  const {
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
  } = useUsers();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Người Dùng & Phân Quyền
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tài khoản Admin, Nhà tuyển dụng (Recruiter) và Ứng viên (Job Seeker)
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Tạo tài khoản mới
        </Button>
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        keyword={keyword}
        roleFilter={roleFilter}
        totalElements={totalElements}
        onKeywordChange={setKeyword}
        onRoleChange={(r) => {
          setRoleFilter(r);
          setPage(0);
        }}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Table Card */}
      <Card className="shadow-none border-slate-200 overflow-hidden">
        <UserTable
          users={users}
          isLoading={isLoading}
          currentUserId={currentUser?.id}
          onToggleActive={handleOpenToggleDialog}
        />

        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </Card>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        companies={companies}
        formData={userForm}
        isSubmitting={isSubmitting}
        onChange={handleFormChange}
        onSubmit={handleCreateUserSubmit}
      />

      {/* Toggle Active Confirm Dialog */}
      <ConfirmDialog
        isOpen={toggleDialogOpen}
        title={userToToggle?.active ? 'Khóa Tài Khoản Người Dùng' : 'Mở Khóa Tài Khoản Người Dùng'}
        message={`Bạn có chắc chắn muốn ${
          userToToggle?.active ? 'KHÓA' : 'MỞ KHÓA'
        } tài khoản "${userToToggle?.fullName}" (${userToToggle?.email}) không?`}
        confirmText={userToToggle?.active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        confirmVariant={userToToggle?.active ? 'danger' : 'primary'}
        isLoading={isToggling}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setToggleDialogOpen(false)}
      />
    </div>
  );
}
