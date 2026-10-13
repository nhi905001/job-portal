import React, { useState } from 'react';
import { Building2, Plus, MapPin } from 'lucide-react';
import { useCompanies } from '../../hooks/useCompanies';
import { useCompanyLocations } from '../../hooks/useCompanyLocations';
import { CompanyTable, CompanyModal, LocationTable, LocationModal } from '../../features/companies';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function CompanyManagementPage() {
  const [activeTab, setActiveTab] = useState('companies');
  const comp = useCompanies();
  const loc = useCompanyLocations(comp.companies);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Quản Lý Công Ty & Địa Điểm Làm Việc</h1>
          <p className="text-xs text-slate-500 mt-1">Thiết lập danh bạ doanh nghiệp, upload logo và danh sách chi nhánh</p>
        </div>
        <button
          type="button"
          onClick={() => (activeTab === 'companies' ? comp.handleOpenCreateCompany() : loc.handleOpenCreateLocation(''))}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{activeTab === 'companies' ? 'Thêm doanh nghiệp mới' : 'Thêm địa điểm chi nhánh'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'companies' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Doanh nghiệp ({comp.companyTotalElements})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'locations' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Địa điểm chi nhánh ({loc.locationTotalElements})</span>
        </button>
      </div>

      {/* Tab 1: Companies */}
      {activeTab === 'companies' && (
        <CompanyTable
          companies={comp.companies}
          isLoading={comp.isCompanyLoading}
          keyword={comp.companyKeyword}
          page={comp.companyPage}
          totalPages={comp.companyTotalPages}
          totalElements={comp.companyTotalElements}
          onKeywordChange={comp.setCompanyKeyword}
          onSearchSubmit={(e) => { e.preventDefault(); comp.setCompanyPage(0); comp.fetchCompanies(); }}
          onPageChange={comp.setCompanyPage}
          onOpenEdit={comp.handleOpenEditCompany}
          onDelete={(c) => { comp.setCompanyToDelete(c); comp.setDeleteCompanyDialogOpen(true); }}
          onViewLocations={(c) => { setActiveTab('locations'); loc.setLocationCompanyFilter(String(c.id)); }}
        />
      )}

      {/* Tab 2: Locations */}
      {activeTab === 'locations' && (
        <LocationTable
          locations={loc.locations}
          companies={comp.companies}
          isLoading={loc.isLocationLoading}
          selectedCompanyId={loc.locationCompanyFilter}
          keyword={loc.locationKeyword}
          page={loc.locationPage}
          totalPages={loc.locationTotalPages}
          totalElements={loc.locationTotalElements}
          onCompanyFilterChange={(id) => { loc.setLocationCompanyFilter(id); loc.setLocationPage(0); }}
          onKeywordChange={loc.setLocationKeyword}
          onSearchSubmit={() => { loc.setLocationPage(0); loc.fetchLocations(); }}
          onPageChange={loc.setLocationPage}
          onOpenEdit={loc.handleOpenEditLocation}
          onDelete={(l) => { loc.setLocationToDelete(l); loc.setDeleteLocationDialogOpen(true); }}
        />
      )}

      {/* Modals & Dialogs */}
      <CompanyModal
        isOpen={comp.companyModalOpen}
        isEditing={comp.isEditingCompany}
        isSaving={comp.isSavingCompany}
        name={comp.companyName}
        website={comp.companyWebsite}
        description={comp.companyDescription}
        logoUrl={comp.companyLogoUrl}
        isUploadingLogo={comp.isUploadingLogo}
        onClose={() => comp.setCompanyModalOpen(false)}
        onNameChange={comp.setCompanyName}
        onWebsiteChange={comp.setCompanyWebsite}
        onDescriptionChange={comp.setCompanyDescription}
        onUploadLogo={comp.handleUploadLogo}
        onSubmit={comp.handleSaveCompany}
      />

      <LocationModal
        isOpen={loc.locationModalOpen}
        isEditing={loc.isEditingLocation}
        isSaving={loc.isSavingLocation}
        companies={comp.companies}
        companyId={loc.locCompanyId}
        city={loc.locCity}
        address={loc.locAddress}
        onClose={() => loc.setLocationModalOpen(false)}
        onCompanyIdChange={loc.setLocCompanyId}
        onCityChange={loc.setLocCity}
        onAddressChange={loc.setLocAddress}
        onSubmit={loc.handleSaveLocation}
      />

      <ConfirmDialog
        isOpen={comp.deleteCompanyDialogOpen}
        title="Xóa Doanh Nghiệp"
        message={`Bạn có chắc chắn muốn xóa doanh nghiệp "${comp.companyToDelete?.name}"?`}
        confirmText="Xóa doanh nghiệp"
        confirmVariant="danger"
        isLoading={comp.isDeletingCompany}
        onConfirm={comp.handleConfirmDeleteCompany}
        onCancel={() => { comp.setDeleteCompanyDialogOpen(false); comp.setCompanyToDelete(null); }}
      />

      <ConfirmDialog
        isOpen={loc.deleteLocationDialogOpen}
        title="Xóa Địa Điểm Chi Nhánh"
        message={`Bạn có chắc chắn muốn xóa chi nhánh "${loc.locationToDelete?.address}, ${loc.locationToDelete?.city}"?`}
        confirmText="Xóa địa điểm"
        confirmVariant="danger"
        isLoading={loc.isDeletingLocation}
        onConfirm={loc.handleConfirmDeleteLocation}
        onCancel={() => { loc.setDeleteLocationDialogOpen(false); loc.setLocationToDelete(null); }}
      />
    </div>
  );
}
