import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';

// Auth Page
import LoginPage from './components/LoginPage';

// Public Pages (Khách & Job Seeker)
import HomePage from './pages/public/HomePage';
import JobDetailPage from './pages/public/JobDetailPage';
import CandidateProfilePage from './pages/public/CandidateProfilePage';
import MyApplicationsPage from './pages/public/MyApplicationsPage';
import MyOffersPage from './pages/public/MyOffersPage';

// Admin / Recruiter Workspace Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import JobManagementPage from './pages/admin/JobManagementPage';
import ApplicationManagementPage from './pages/admin/ApplicationManagementPage';
import ShortlistManagementPage from './pages/admin/ShortlistManagementPage';
import InterviewManagementPage from './pages/admin/InterviewManagementPage';
import OfferManagementPage from './pages/admin/OfferManagementPage';

// Admin Only System Management Pages
import UserManagementPage from './pages/admin/UserManagementPage';
import CompanyManagementPage from './pages/admin/CompanyManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import ReviewManagementPage from './pages/admin/ReviewManagementPage';

// Common / Error Pages
import NotFoundPage from './pages/common/NotFoundPage';
import UnauthorizedPage from './pages/common/UnauthorizedPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* =============================================================== */}
            {/* AUTHENTICATION ROUTES (Chỉ dành cho khách chưa login)          */}
            {/* =============================================================== */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />

            {/* =============================================================== */}
            {/* PUBLIC PORTAL ROUTES (/ và /public)                              */}
            {/* =============================================================== */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="jobs/:id" element={<JobDetailPage />} />
              
              {/* Tuyến đường yêu cầu Role JOB_SEEKER */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                    <CandidateProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-applications"
                element={
                  <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-offers"
                element={
                  <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                    <MyOffersPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* =============================================================== */}
            {/* ADMIN & RECRUITER WORKSPACE ROUTES (/admin/*)                   */}
            {/* =============================================================== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Tuyển dụng chung cho Recruiter & Admin */}
              <Route index element={<AdminDashboardPage />} />
              <Route path="jobs" element={<JobManagementPage />} />
              <Route path="applications" element={<ApplicationManagementPage />} />
              <Route path="shortlists" element={<ShortlistManagementPage />} />
              <Route path="interviews" element={<InterviewManagementPage />} />
              <Route path="offers" element={<OfferManagementPage />} />

              {/* Quản trị hệ thống chỉ dành cho ADMIN */}
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="companies"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CompanyManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="categories"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reviews"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ReviewManagementPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* =============================================================== */}
            {/* COMMON & ERROR ROUTES                                            */}
            {/* =============================================================== */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
