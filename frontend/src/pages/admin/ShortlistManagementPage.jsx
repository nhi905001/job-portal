import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  FileText,
  Calendar,
  Trash2,
  ExternalLink,
  Loader2,
  User,
  Building2,
  Clock,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import shortlistService from '../../services/shortlistService';
import fileService from '../../services/fileService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function ShortlistManagementPage() {
  const { showToast } = useToast();

  const [shortlists, setShortlists] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Delete Confirm Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Tải danh sách Shortlist
  const fetchShortlists = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await shortlistService.getShortlists({
        page,
        size: 10,
        sortBy: 'id',
        sortDir: 'desc',
      });
      setShortlists(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách Shortlist:', err);
      showToast('Không thể tải danh sách Shortlist.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchShortlists();
  }, [fetchShortlists]);

  // 2. Xóa khỏi Shortlist
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await shortlistService.removeFromShortlist(itemToDelete.id);
      showToast('Đã xóa ứng viên khỏi danh sách Shortlist!', 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchShortlists();
    } catch (err) {
      console.error('Lỗi xóa khỏi shortlist:', err);
      showToast(err.response?.data?.message || 'Xóa khỏi Shortlist thất bại.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] tracking-tight">
            Danh Sách Shortlist (Ứng Viên Tiềm Năng)
          </h1>
          <p className="text-xs text-[#8A8073] mt-1">
            Các ứng viên đã vượt qua vòng lọc hồ sơ ban đầu và sẵn sàng bước vào vòng phỏng vấn
          </p>
        </div>
        <Link
          to="/admin/interviews"
          className="px-4 py-2.5 bg-[#F6B779] hover:bg-[#EEA861] active:bg-[#E59C51] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Quản lý lịch phỏng vấn</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EFE9DF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2]/80 border-b border-[#EFE9DF] text-[#786F62] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Ứng viên</th>
                <th className="px-5 py-3.5">Vị trí ứng tuyển</th>
                <th className="px-5 py-3.5">Ghi chú tuyển dụng</th>
                <th className="px-5 py-3.5">CV đính kèm</th>
                <th className="px-5 py-3.5">Ngày đưa vào</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#F6B779] mx-auto mb-2" />
                    <span>Đang tải danh sách Shortlist...</span>
                  </td>
                </tr>
              ) : shortlists.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#8A8073]">
                    <CheckSquare className="w-8 h-8 text-[#C4BDB0] mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#1E1E1E]">Chưa có ứng viên nào trong Shortlist</p>
                    <p className="text-[11px] mt-0.5">
                      Vào mục "Đơn ứng tuyển" và bấm nút Shortlist để thêm ứng viên phù hợp vào đây.
                    </p>
                  </td>
                </tr>
              ) : (
                shortlists.map((item) => {
                  const app = item.application;
                  const candidate = app?.user;
                  const job = app?.jobListing;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#1E1E1E] block">
                          {candidate?.fullName || 'Ứng viên'}
                        </span>
                        <span className="text-[#8A8073] text-[11px]">{candidate?.email}</span>
                      </td>

                      <td className="px-5 py-4 font-medium text-[#1E1E1E]">
                        <Link
                          to={`/jobs/${job?.id}`}
                          target="_blank"
                          className="hover:text-[#B86E20] transition-colors"
                        >
                          {job?.title || 'Vị trí công việc'}
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-[#4A4135] max-w-xs">
                        <p className="p-2 bg-[#FAF7F2]/70 border border-[#F0EAE0] rounded-xl text-xs line-clamp-2">
                          {item.note || 'Không có ghi chú'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {app?.cvUrl ? (
                          <a
                            href={fileService.getFullFileUrl(app.cvUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF7F2] hover:bg-white border border-[#E2DAD0] rounded-xl text-xs font-semibold text-[#8C4A08] transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Mở CV</span>
                            <ExternalLink className="w-3 h-3 text-[#A89E90]" />
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Không có CV</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-[#786F62]">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteDialogOpen(true);
                          }}
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                        >
                          Xóa khỏi Shortlist
                        </button>
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Xóa khỏi Shortlist"
        message={`Bạn có chắc chắn muốn xóa ứng viên "${itemToDelete?.application?.user?.fullName}" khỏi danh sách Shortlist không?`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
