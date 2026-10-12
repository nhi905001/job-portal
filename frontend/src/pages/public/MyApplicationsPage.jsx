import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useMyApplications } from '../../hooks/useMyApplications';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { MyApplicationCard, InterviewBookingModal } from '../../features/applications';

export default function MyApplicationsPage() {
  const {
    applications,
    page,
    totalPages,
    totalElements,
    isLoading,
    withdrawDialogOpen,
    selectedAppToWithdraw,
    isWithdrawing,
    bookingModalOpen,
    selectedAppForInterview,
    slots,
    isLoadingSlots,
    isBookingSlot,
    setPage,
    handleOpenWithdraw,
    setWithdrawDialogOpen,
    handleConfirmWithdraw,
    handleOpenInterviewModal,
    setBookingModalOpen,
    handleBookSlot,
  } = useMyApplications();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Đơn Ứng Tuyển Của Tôi (My Applications)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi tiến độ xét duyệt hồ sơ, chọn lịch phỏng vấn hoặc rút đơn ứng tuyển
        </p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-slate-800 mx-auto mb-2" />
          <span className="text-xs">Đang tải danh sách đơn ứng tuyển...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">Bạn chưa nộp đơn ứng tuyển nào</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Khám phá các việc làm hấp dẫn tại trang chủ và nộp hồ sơ trực tuyến ngay hôm nay!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <MyApplicationCard
              key={app.id}
              app={app}
              onWithdrawClick={handleOpenWithdraw}
              onScheduleClick={handleOpenInterviewModal}
            />
          ))}

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={10}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}

      {/* Booking Interview Modal */}
      <InterviewBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedApp={selectedAppForInterview}
        slots={slots}
        isLoadingSlots={isLoadingSlots}
        isBookingSlot={isBookingSlot}
        onBookSlot={handleBookSlot}
      />

      {/* Withdraw Confirm Dialog */}
      <ConfirmDialog
        isOpen={withdrawDialogOpen}
        title="Rút Đơn Ứng Tuyển"
        message={`Bạn có chắc chắn muốn rút đơn ứng tuyển vị trí "${selectedAppToWithdraw?.jobListing?.title}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận rút đơn"
        confirmVariant="danger"
        isLoading={isWithdrawing}
        onConfirm={handleConfirmWithdraw}
        onCancel={() => setWithdrawDialogOpen(false)}
      />
    </div>
  );
}
