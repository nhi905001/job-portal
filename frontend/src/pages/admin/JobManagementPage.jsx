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
    user,
    jobs,
    page,
    totalPages,
    totalElements,
    isLoading,
    keyword,
    statusFilter,
    industryFilter,
    jobTypeFilter,
    companyFilter,
    industries,
    jobTypes,
    locations,
    companies,
    jobModalOpen,
    isEditing,
    isSaving,
    isLoadingDetail,
    jobForm,
    deleteDialogOpen,
    jobToDelete,
    isDeleting,
    setPage,
    setKeyword,
    setStatusFilter,
    setIndustryFilter,
    setJobTypeFilter,
    setCompanyFilter,
    setJobModalOpen,
    setDeleteDialogOpen,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleFormChange,
    handleSaveJob,
    handleOpenDelete,
    handleConfirmDelete,
    handleResetFilters,
    refetchJobs,
  } = useJobs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Board
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200/60">
              {user?.role === 'ADMIN' ? 'Admin Tuyển Dụng' : 'Nhà Tuyển Dụng'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đăng tin tuyển dụng, kiểm soát trạng thái, chỉ định chi nhánh và theo dõi hồ sơ ứng tuyển theo thời gian thực.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4 text-slate-950 stroke-[3]" />}
          className="self-start sm:self-auto font-bold shadow-sm"
        >
          Tạo tin tuyển dụng mới
        </Button>
      </div>

      {/* Filter Bar */}
      <JobFilterBar
        keyword={keyword}
        statusFilter={statusFilter}
        industryFilter={industryFilter}
        jobTypeFilter={jobTypeFilter}
        companyFilter={companyFilter}
        industries={industries}
        jobTypes={jobTypes}
        companies={companies}
        isAdmin={user?.role === 'ADMIN'}
        totalElements={totalElements}
        onKeywordChange={setKeyword}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setPage(0);
        }}
        onIndustryChange={(id) => {
          setIndustryFilter(id);
          setPage(0);
        }}
        onJobTypeChange={(id) => {
          setJobTypeFilter(id);
          setPage(0);
        }}
        onCompanyChange={(id) => {
          setCompanyFilter(id);
          setPage(0);
        }}
        onSearchSubmit={(e) => {
          e.preventDefault();
          setPage(0);
          refetchJobs();
        }}
        onReset={handleResetFilters}
      />

      {/* Table Card */}
      <Card className="shadow-card border-slate-200/90 rounded-2xl overflow-hidden bg-white">
        <JobTable
          jobs={jobs}
          isLoading={isLoading}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDelete}
        />

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/40">
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
        companies={companies}
        user={user}
        isSaving={isSaving}
        isLoadingDetail={isLoadingDetail}
        onClose={() => setJobModalOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleSaveJob}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa Tin Tuyển Dụng"
        message={`Bạn có chắc chắn muốn xóa tin tuyển dụng "${jobToDelete?.title}" không? Lưu ý: Tin tuyển dụng đã có người nộp đơn sẽ không thể xóa (hãy chuyển sang trạng thái ĐÃ ĐÓNG thay vì xóa).`}
        confirmText="Xác nhận xóa"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
