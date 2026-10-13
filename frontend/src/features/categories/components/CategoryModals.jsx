import React from 'react';
import CategoryModal from './CategoryModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export default function CategoryModals({ cat }) {
  return (
    <>
      <CategoryModal
        isOpen={cat.industryModalOpen}
        title={cat.isEditingIndustry ? 'Cập Nhật Ngành Nghề' : 'Thêm Ngành Nghề Mới'}
        label="Tên ngành nghề"
        value={cat.industryName}
        isEditing={cat.isEditingIndustry}
        isSaving={cat.isSavingIndustry}
        onClose={() => cat.setIndustryModalOpen(false)}
        onChange={cat.setIndustryName}
        onSubmit={cat.handleSaveIndustry}
      />

      <CategoryModal
        isOpen={cat.jobTypeModalOpen}
        title={cat.isEditingJobType ? 'Cập Nhật Loại Công Việc' : 'Thêm Loại Công Việc Mới'}
        label="Tên loại hình công việc"
        value={cat.jobTypeName}
        isEditing={cat.isEditingJobType}
        isSaving={cat.isSavingJobType}
        onClose={() => cat.setJobTypeModalOpen(false)}
        onChange={cat.setJobTypeName}
        onSubmit={cat.handleSaveJobType}
      />

      <ConfirmDialog
        isOpen={cat.deleteIndustryDialogOpen}
        title="Xóa Ngành Nghề"
        message={`Bạn có chắc chắn muốn xóa ngành nghề "${cat.industryToDelete?.name}"?`}
        confirmText="Xác nhận xóa"
        confirmVariant="danger"
        isLoading={cat.isDeletingIndustry}
        onConfirm={cat.handleConfirmDeleteIndustry}
        onCancel={() => cat.setDeleteIndustryDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={cat.deleteJobTypeDialogOpen}
        title="Xóa Loại Công Việc"
        message={`Bạn có chắc chắn muốn xóa loại hình "${cat.jobTypeToDelete?.name}"?`}
        confirmText="Xác nhận xóa"
        confirmVariant="danger"
        isLoading={cat.isDeletingJobType}
        onConfirm={cat.handleConfirmDeleteJobType}
        onCancel={() => cat.setDeleteJobTypeDialogOpen(false)}
      />
    </>
  );
}
