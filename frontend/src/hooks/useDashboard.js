import { useAuth } from '../context/AuthContext';

export function useDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const stats = [
    {
      label: 'Tin đang tuyển (Open)',
      value: '12',
    },
    {
      label: 'Đơn ứng tuyển mới',
      value: '48',
    },
    {
      label: 'Phỏng vấn sắp tới',
      value: '6',
    },
    {
      label: isAdmin ? 'Người dùng hệ thống' : 'Offers đang chờ',
      value: isAdmin ? '128' : '4',
    },
  ];

  const recentJobs = [
    { title: 'Senior Frontend Developer (React)', status: 'OPEN', apps: 18, deadline: '30/11/2026' },
    { title: 'Chuyên viên Tuyển dụng', status: 'OPEN', apps: 8, deadline: '25/11/2026' },
    { title: 'Backend Engineer (Java)', status: 'CLOSED', apps: 22, deadline: '15/10/2026' },
  ];

  return {
    user,
    isAdmin,
    stats,
    recentJobs,
  };
}
