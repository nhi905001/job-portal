import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { validateEmail, validatePassword, validateFullName } from '../utils/validators';
import { resolveRedirectPath } from '../routes/routeUtils';

export function useLogin() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    rememberMe: true,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setServerError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
  }, [location.search]);

  const validateField = (field, value) => {
    if (field === 'email') return validateEmail(value);
    if (field === 'password') return validatePassword(value);
    if (field === 'fullName' && mode === 'register') return validateFullName(value);
    return '';
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (serverError) setServerError('');
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, formData[field]) }));
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setTouched({});
    setServerError('');
    setSuccessMessage('');
  };

  const fillDemoCredentials = (email, password) => {
    setMode('login');
    setFormData((prev) => ({ ...prev, email, password }));
    setErrors({});
    setServerError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const emailErr = validateField('email', formData.email);
    const passErr = validateField('password', formData.password);
    const nameErr = mode === 'register' ? validateField('fullName', formData.fullName) : '';

    setTouched({
      email: true,
      password: true,
      ...(mode === 'register' ? { fullName: true } : {}),
    });

    const newErrors = { email: emailErr, password: passErr };
    if (mode === 'register') newErrors.fullName = nameErr;
    setErrors(newErrors);

    if (emailErr || passErr || nameErr) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(
          { email: formData.email, password: formData.password },
          formData.rememberMe
        );
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          const targetPath = resolveRedirectPath(res.user?.role, location.state?.from);
          navigate(targetPath, { replace: true });
        }, 350);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        });
        setSuccessMessage('Đăng ký thành công! Đang đăng nhập hệ thống...');
        const res = await login(
          { email: formData.email, password: formData.password },
          formData.rememberMe
        );
        setTimeout(() => {
          const targetPath = resolveRedirectPath(res.user?.role, location.state?.from);
          navigate(targetPath, { replace: true });
        }, 350);
      }
    } catch (err) {
      const parsed = authService.parseApiError(err);
      setServerError(parsed.summary);
      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...parsed.fieldErrors }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
