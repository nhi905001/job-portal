import React from 'react';
import Card from '../../../components/common/Card';

export default function KpiCardGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="shadow-card border-slate-200/90 rounded-2xl p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
              <div className={`p-2.5 rounded-xl border border-slate-100 ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stat.value}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-medium">
              {stat.change}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
