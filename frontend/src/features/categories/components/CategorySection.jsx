import React from 'react';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';

export default function CategorySection({
  title,
  subtitle,
  icon: Icon,
  items,
  isLoading,
  keyword,
  page,
  totalPages,
  totalElements,
  onKeywordChange,
  onSearchSubmit,
  onPageChange,
  onOpenCreate,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="shadow-none border-slate-200 overflow-hidden flex flex-col justify-between">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={onOpenCreate} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Thêm mới
        </Button>
      </div>

      <div className="p-4 bg-slate-50/50 border-b border-slate-100">
        <form onSubmit={onSearchSubmit} className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-800 mx-auto mb-1.5" />
                  <span>Đang tải...</span>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-slate-500">
                  Chưa có dữ liệu nào.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Sửa tên"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          size={8}
          onPageChange={onPageChange}
        />
      </div>
    </Card>
  );
}
