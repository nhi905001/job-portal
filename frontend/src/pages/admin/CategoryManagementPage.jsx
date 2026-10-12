import React from 'react';
import { Layers, Briefcase } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { CategorySection, CategoryModals } from '../../features/categories';

export default function CategoryManagementPage() {
  const cat = useCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Quản Lý Ngành Nghề & Loại Hình Công Việc
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cấu hình danh mục hệ thống giúp ứng viên dễ dàng lọc và tìm kiếm cơ hội việc làm
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySection
          title="Ngành Nghề Tuyển Dụng"
          subtitle="Danh sách các ngành nghề trên hệ thống"
          icon={Layers}
          items={cat.industries}
          isLoading={cat.isIndustryLoading}
          keyword={cat.industryKeyword}
          page={cat.industryPage}
          totalPages={cat.industryTotalPages}
          totalElements={cat.industryTotalElements}
          onKeywordChange={cat.setIndustryKeyword}
          onSearchSubmit={(e) => {
            e.preventDefault();
            cat.setIndustryPage(0);
            cat.fetchIndustries();
          }}
          onPageChange={cat.setIndustryPage}
          onOpenCreate={cat.handleOpenCreateIndustry}
          onEdit={cat.handleOpenEditIndustry}
          onDelete={(item) => {
            cat.setIndustryToDelete(item);
            cat.setDeleteIndustryDialogOpen(true);
          }}
        />

        <CategorySection
          title="Loại Hình Công Việc"
          subtitle="Full-time, Part-time, Remote, Thực tập..."
          icon={Briefcase}
          items={cat.jobTypes}
          isLoading={cat.isJobTypeLoading}
          keyword={cat.jobTypeKeyword}
          page={cat.jobTypePage}
          totalPages={cat.jobTypeTotalPages}
          totalElements={cat.jobTypeTotalElements}
          onKeywordChange={cat.setJobTypeKeyword}
          onSearchSubmit={(e) => {
            e.preventDefault();
            cat.setJobTypePage(0);
            cat.fetchJobTypes();
          }}
          onPageChange={cat.setJobTypePage}
          onOpenCreate={cat.handleOpenCreateJobType}
          onEdit={cat.handleOpenEditJobType}
          onDelete={(item) => {
            cat.setJobTypeToDelete(item);
            cat.setDeleteJobTypeDialogOpen(true);
          }}
        />
      </div>

      <CategoryModals cat={cat} />
    </div>
  );
}
