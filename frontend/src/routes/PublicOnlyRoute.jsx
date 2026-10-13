import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resolveRedirectPath } from './routeUtils';

/**
 * Tuyến đường chỉ dành cho khách chưa đăng nhập (như /login, /register).
 * Nếu đã đăng nhập, tự động chuyển hướng đến không gian làm việc phù hợp theo Role.
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (isAuthenticated && user) {
    const destination = resolveRedirectPath(user.role, location.state?.from);
    return <Navigate to={destination} replace />;
  }

  return children;
}
