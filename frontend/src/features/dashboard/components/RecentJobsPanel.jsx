import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Card from '../../../components/common/Card';

export default function RecentJobsPanel({ jobs }) {
  return (
    <Card className="shadow-none border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Tin tuyển dụng gần đây</h2>
        <Link to="/admin/jobs" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1">
          <span>Xem tất cả</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.map((job, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
            <div>
              <span className="font-semibold text-slate-900 block">{job.title}</span>
              <span className="text-slate-500 text-[11px]">Hạn chót: {job.deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-medium text-[11px]">
                {job.apps} đơn
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                  job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
