import React from 'react';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-600 text-white border-purple-600',
  RECRUITER: 'bg-amber-600 text-white border-amber-600',
  JOB_SEEKER: 'bg-slate-600 text-white border-slate-600',
};

const ROLE_LABELS = {
  ADMIN: 'Quản trị viên (ADMIN)',
  RECRUITER: 'Nhà tuyển dụng',
  JOB_SEEKER: 'Ứng viên',
};

export default function UserRoleBadge({ role }) {
  const style = ROLE_STYLES[role] || 'bg-slate-600 text-white border-slate-600';
  const label = ROLE_LABELS[role] || role;

  return (
    <span className={`px-3 py-0.5 rounded-none font-normal text-[11px] border inline-block ${style}`}>
      {label}
    </span>
  );
}
