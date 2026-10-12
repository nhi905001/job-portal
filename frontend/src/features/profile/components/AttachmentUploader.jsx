import React from 'react';
import { Upload, FileText, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import fileService from '../../../services/fileService';

export default function AttachmentUploader({
  attachmentUrl,
  isUploading,
  onCVChange,
  onRemove,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-700">
        CV / Tài liệu đính kèm mặc định
      </label>

      {attachmentUrl ? (
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="font-medium text-slate-800 truncate">
              {attachmentUrl.split('/').pop() || 'Tai_lieu_dinh_kem'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={fileService.getFullFileUrl(attachmentUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-white transition-colors"
              title="Xem trước tệp"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-rose-600 hover:text-rose-800 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
              title="Gỡ bỏ tài liệu này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="cv-upload"
          className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-slate-50/50"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-slate-800 mb-2" />
          ) : (
            <Upload className="w-6 h-6 text-slate-400 mb-2" />
          )}
          <span className="text-xs font-semibold text-slate-800">
            {isUploading ? 'Đang tải lên...' : 'Bấm để tải tệp CV (PDF/DOCX)'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Dung lượng tối đa 10MB</span>
          <input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={onCVChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
