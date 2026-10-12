import React from 'react';

const ROLE_STYLES = {
  ADMIN: 'bg-amber-50 text-amber-900 border-amber-200/80',
  RECRUITER: 'bg-orange-50 text-orange-900 border-orange-200/80',
  JOB_SEEKER: 'bg-slate-100 text-slate-800 border-slate-200',
};

const ROLE_LABELS = {
  ADMIN: 'Quản trị viên (ADMIN)',
  RECRUITER: 'Nhà tuyển dụng',
  JOB_SEEKER: 'Ứng viên',
};

export default function UserRoleBadge({ role }) {
  const style = ROLE_STYLES[role] || 'bg-slate-50 text-slate-700 border-slate-200';
  const label = ROLE_LABELS[role] || role;

  return (
    <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border inline-block ${style}`}>
      {label}
    </span>
  );
}
