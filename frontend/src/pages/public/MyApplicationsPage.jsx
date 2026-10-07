import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Building2, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function MyApplicationsPage() {
  const mockApplications = [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer (React)',
      company: 'FPT Software',
      appliedAt: '10/10/2026',
      status: 'SHORTLISTED',
      statusLabel: 'Đã vào Shortlist',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 2,
      jobTitle: 'Fullstack Engineer',
      company: 'Viettel Telecom',
      appliedAt: '05/10/2026',
      status: 'APPLIED',
      statusLabel: 'Đã nộp đơn',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-[#EFE9DF] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">Đơn ứng tuyển của tôi</h1>
        <p className="text-xs text-[#8A8073] mt-1">
          Theo dõi tiến độ xử lý hồ sơ, lịch phỏng vấn và trạng thái ứng tuyển của bạn
        </p>
      </div>

      <div className="space-y-3.5">
        {mockApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-[#EFE9DF] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${app.statusColor}`}>
                  {app.statusLabel}
                </span>
                <span className="text-[11px] text-[#8A8073]">Nộp ngày: {app.appliedAt}</span>
              </div>
              <h3 className="text-base font-bold text-[#1E1E1E]">{app.jobTitle}</h3>
              <p className="text-xs text-[#786F62] flex items-center gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5 text-[#A89E90]" />
                <span>{app.company}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {app.status === 'SHORTLISTED' && (
                <button
                  type="button"
                  className="px-4 py-2 bg-[#F6B779] hover:bg-[#EEA861] text-[#2C241E] text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  Chọn giờ phỏng vấn
                </button>
              )}
              {app.status === 'APPLIED' && (
                <button
                  type="button"
                  className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-medium rounded-xl transition-colors"
                >
                  Rút đơn ứng tuyển
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
