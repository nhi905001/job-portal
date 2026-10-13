import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import {
  AuthHeader,
  LoginForm,
  RegisterForm,
  AuthSocialButtons,
  AuthQuickDemo,
  AuthSessionCard,
} from '../features/auth';

export default function LoginPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    mode,
    formData,
    errors,
    touched,
    isLoading,
    serverError,
    successMessage,
    handleChange,
    handleBlur,
    handleSwitchMode,
    fillDemoCredentials,
    handleSubmit,
    setServerError,
  } = useLogin();

  // Nếu người dùng đã đăng nhập, hiển thị thông tin phiên hiện tại
  if (isAuthenticated && user) {
    return (
      <AuthLayout>
        <AuthSessionCard
          user={user}
          onNavigate={(path) => navigate(path)}
          onLogout={logout}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      topAction={
        <button
          type="button"
          onClick={() => fillDemoCredentials('recruiter@fpt.com', 'Recruiter@123')}
          className="text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Cổng Doanh nghiệp
        </button>
      }
    >
      <Card className="shadow-none border-slate-200">
        <Card.Body className="p-6 sm:p-8 space-y-5">
          <AuthHeader mode={mode} onSwitchMode={handleSwitchMode} />

          {serverError && (
            <Alert
              type="error"
              message={serverError}
              onClose={() => setServerError('')}
            />
          )}

          {successMessage && (
            <Alert type="success" message={successMessage} />
          )}

          {mode === 'login' ? (
            <LoginForm
              formData={formData}
              errors={errors}
              touched={touched}
              isLoading={isLoading}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
            />
          ) : (
            <RegisterForm
              formData={formData}
              errors={errors}
              touched={touched}
              isLoading={isLoading}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
            />
          )}

          <AuthSocialButtons />

          <AuthQuickDemo onFill={fillDemoCredentials} />
        </Card.Body>
      </Card>
    </AuthLayout>
  );
}
