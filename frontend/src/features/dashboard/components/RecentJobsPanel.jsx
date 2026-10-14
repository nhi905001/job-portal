import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';

export default function RecentJobsPanel({ jobs = [] }) {
  return (
    <Card className="shadow-card border-slate-200/90 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Tin tuyển dụng gần đây</h2>
        <Link
          to="/admin/jobs"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="space-y-2.5">
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">Chưa có tin tuyển dụng nào được tạo.</p>
        ) : (
          jobs.map((job, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-amber-50/30 border border-slate-100 rounded-xl text-xs transition-colors"
            >
              <div className="min-w-0 pr-2">
                <span className="font-bold text-slate-900 block truncate">{job.title}</span>
                <span className="text-slate-400 text-[11px] font-medium">Hạn chót: {job.deadline}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-0.5 rounded-none bg-slate-200/70 text-slate-700 font-normal text-[11px]">
                  {job.apps} đơn
                </span>
                <span
                  className={`px-3 py-0.5 rounded-none font-normal text-[10px] border ${
                    job.status === 'OPEN'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-600 text-white border-slate-600'
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
