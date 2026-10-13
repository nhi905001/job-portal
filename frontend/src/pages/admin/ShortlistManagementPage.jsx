import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShortlists } from '../../hooks/useShortlists';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ShortlistTable } from '../../features/shortlists';

export default function ShortlistManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const {
    shortlists,
    page,
    totalPages,
    totalElements,
    isLoading,
    deleteDialogOpen,
    itemToDelete,
    isDeleting,
    setPage,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  } = useShortlists();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Danh Sách Shortlist (Ứng Viên Tiềm Năng)
            </h1>
            {isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-slate-100 text-slate-700 border-slate-200">
                Chế độ giám sát
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? 'Theo dõi danh sách ứng viên Shortlist trên toàn hệ thống (Quyền Admin: Chỉ xem, không thêm/xóa).'
              : 'Các ứng viên đã vượt qua vòng lọc hồ sơ ban đầu và sẵn sàng bước vào vòng phỏng vấn'}
          </p>
        </div>

        <Link to="/admin/interviews">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Calendar className="w-4 h-4" />}
            className="self-start sm:self-auto"
          >
            Quản lý lịch phỏng vấn
          </Button>
        </Link>
      </div>

      {/* Table Card */}
      <Card className="shadow-card border-slate-200/90 rounded-2xl overflow-hidden bg-white">
        <ShortlistTable
          shortlists={shortlists}
          isLoading={isLoading}
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa khỏi Shortlist"
        message={`Bạn có chắc chắn muốn xóa ứng viên "${itemToDelete?.jobApplication?.candidate?.fullName || itemToDelete?.application?.user?.fullName || 'này'}" khỏi danh sách Shortlist không?`}
        confirmText="Xác nhận xóa"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />
    </div>
  );
}
