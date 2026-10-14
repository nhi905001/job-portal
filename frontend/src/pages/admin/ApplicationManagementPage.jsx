import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../hooks/useApplications';
import Card from '../../components/common/Card';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  ApplicationFilterBar,
  AdminApplicationTable,
  ShortlistModal,
  CandidateProfileModal,
} from '../../features/applications';

export default function ApplicationManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const {
    applications,
    page,
    totalPages,
    totalElements,
    isLoading,
    selectedJobId,
    statusFilter,
    jobOptions,
    shortlistModalOpen,
    appToShortlist,
    shortlistNote,
    isShortlisting,
    rejectDialogOpen,
    appToReject,
    isRejecting,
    profileModalOpen,
    candidateProfile,
    selectedAppForView,
    isLoadingProfile,
    setPage,
    setShortlistNote,
    setShortlistModalOpen,
    setRejectDialogOpen,
    setProfileModalOpen,
    handleJobFilterChange,
    handleStatusFilterChange,
    handleViewCandidateProfile,
    handleOpenShortlist,
    handleConfirmShortlist,
    handleOpenReject,
    handleConfirmReject,
  } = useApplications();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Đơn Ứng Tuyển
          </h1>
          <span className={`px-2.5 py-0.5 rounded-none text-[11px] font-normal border ${
            isAdmin
              ? 'bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-amber-100 text-amber-900 border-amber-200/60'
          }`}>
            {isAdmin ? 'Giám sát hệ thống' : 'Hồ sơ'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isAdmin
            ? 'Theo dõi và giám sát hồ sơ ứng viên trong toàn hệ thống (Quyền Admin: Chỉ xem, không shortlist hoặc từ chối đơn).'
            : 'Xem xét hồ sơ ứng viên, lọc theo tin tuyển dụng, đưa vào Shortlist hoặc cập nhật trạng thái.'}
        </p>
      </div>

      {/* Filter Bar */}
      <ApplicationFilterBar
        selectedJobId={selectedJobId}
        statusFilter={statusFilter}
        jobOptions={jobOptions}
        totalElements={totalElements}
        onJobFilterChange={handleJobFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* Table Card */}
      <Card className="shadow-card border-slate-200/90 rounded-2xl overflow-hidden bg-white">
        <AdminApplicationTable
          applications={applications}
          isLoading={isLoading}
          onViewProfile={handleViewCandidateProfile}
          onShortlist={handleOpenShortlist}
          onReject={handleOpenReject}
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

      {/* Shortlist Modal */}
      <ShortlistModal
        isOpen={shortlistModalOpen}
        app={appToShortlist}
        note={shortlistNote}
        isSubmitting={isShortlisting}
        onClose={() => setShortlistModalOpen(false)}
        onNoteChange={setShortlistNote}
        onSubmit={handleConfirmShortlist}
      />

      {/* Profile Detail Modal */}
      <CandidateProfileModal
        isOpen={profileModalOpen}
        app={selectedAppForView}
        profile={candidateProfile}
        isLoading={isLoadingProfile}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Reject Confirm Dialog */}
      <ConfirmDialog
        isOpen={rejectDialogOpen}
        title="Từ Chối Đơn Ứng Tuyển"
        message={`Bạn có chắc chắn muốn từ chối đơn ứng tuyển của "${appToReject?.candidate?.fullName || appToReject?.user?.fullName || 'ứng viên này'}"? Trạng thái sẽ được chuyển sang REJECTED.`}
        confirmText="Xác nhận từ chối"
        confirmVariant="danger"
        isLoading={isRejecting}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectDialogOpen(false)}
      />
    </div>
  );
}
