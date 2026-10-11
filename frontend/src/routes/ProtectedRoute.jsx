import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route Guard để bảo vệ các tuyến đường yêu cầu đăng nhập và phân quyền theo Role.
 * @param {Array<string>} allowedRoles - Danh sách role được phép truy cập (ví dụ: ['RECRUITER', 'ADMIN'])
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#F6B779] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#8A8073] font-medium">Đang tải phiên làm việc...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> Chuyển về /login kèm redirect state
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền (Role) nếu có chỉ định
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
