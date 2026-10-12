import React from 'react';
import { Plus } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { JobFilterBar, JobTable, JobFormModal } from '../../features/jobs';

export default function JobManagementPage() {
  const {
    jobs,
    page,
    totalPages,
    totalElements,
    isLoading,
    keyword,
    statusFilter,
    industries,
    jobTypes,
    locations,
    jobModalOpen,
    isEditing,
    isSaving,
    jobForm,
    deleteDialogOpen,
    jobToDelete,
    isDeleting,
    setPage,
    setKeyword,
    setStatusFilter,
    setJobModalOpen,
    setDeleteDialogOpen,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleFormChange,
    handleSaveJob,
    handleOpenDelete,
    handleConfirmDelete,
    refetchJobs,
  } = useJobs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Tin Tuyển Dụng
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng tin tuyển dụng mới, quản lý trạng thái, chỉ định địa điểm và theo dõi hồ sơ ứng viên
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Tạo tin tuyển dụng mới
        </Button>
      </div>

      {/* Filter Bar */}
      <JobFilterBar
        keyword={keyword}
        statusFilter={statusFilter}
        totalElements={totalElements}
        onKeywordChange={setKeyword}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setPage(0);
        }}
        onSearchSubmit={(e) => {
          e.preventDefault();
          setPage(0);
          refetchJobs();
        }}
      />

      {/* Table Card */}
      <Card className="shadow-none border-slate-200 overflow-hidden">
        <JobTable
          jobs={jobs}
          isLoading={isLoading}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDelete}
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

      {/* Job Form Modal */}
      <JobFormModal
        isOpen={jobModalOpen}
        isEditing={isEditing}
        formData={jobForm}
        industries={industries}
        jobTypes={jobTypes}
        locations={locations}
        isSaving={isSaving}
        onClose={() => setJobModalOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleSaveJob}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa Tin Tuyển Dụng"
        message={`Bạn có chắc chắn muốn xóa tin tuyển dụng "${jobToDelete?.title}" không? Thao tác này sẽ gỡ bỏ tin khỏi hệ thống.`}
        confirmText="Xác nhận xóa"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
