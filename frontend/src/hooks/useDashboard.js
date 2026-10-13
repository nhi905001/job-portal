import { useAuth } from '../context/AuthContext';
import { Briefcase, FileText, Users, Calendar, CheckCircle2 } from 'lucide-react';

export function useDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const stats = [
    {
      label: 'Tin đang tuyển (Open)',
      value: '12',
      change: '+2 tuần này',
      icon: Briefcase,
      color: 'text-amber-800 bg-amber-50',
    },
    {
      label: 'Đơn ứng tuyển mới',
      value: '48',
      change: '+15%',
      icon: FileText,
      color: 'text-emerald-800 bg-emerald-50',
    },
    {
      label: 'Phỏng vấn sắp tới',
      value: '6',
      change: 'Hôm nay: 2',
      icon: Calendar,
      color: 'text-slate-800 bg-slate-100',
    },
    {
      label: isAdmin ? 'Người dùng hệ thống' : 'Offers đang chờ',
      value: isAdmin ? '128' : '4',
      change: 'Đang hoạt động',
      icon: isAdmin ? Users : CheckCircle2,
      color: 'text-sky-800 bg-sky-50',
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
