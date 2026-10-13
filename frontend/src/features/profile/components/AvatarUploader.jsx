import React from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import fileService from '../../../services/fileService';

export default function AvatarUploader({ avatarUrl, isUploading, onAvatarChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={fileService.getFullFileUrl(avatarUrl)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-slate-400" />
          )}
        </div>

        <label
          htmlFor="avatar-input"
          className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
          title="Tải ảnh đại diện mới"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
          disabled={isUploading}
        />
      </div>

      <div className="text-center sm:text-left">
        <h3 className="text-sm font-bold text-slate-900">Ảnh đại diện hồ sơ</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 10MB)
        </p>
      </div>
    </div>
  );
}
