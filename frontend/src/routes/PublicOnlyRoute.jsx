import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Tuyến đường chỉ dành cho khách chưa đăng nhập (như /login, /register).
 * Nếu đã đăng nhập, tự động chuyển hướng đến không gian làm việc phù hợp theo Role.
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated && user) {
    if (user.role === 'ADMIN' || user.role === 'RECRUITER') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
