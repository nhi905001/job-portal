import React from 'react';
import Card from '../../../components/common/Card';

export default function KpiCardGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="shadow-none border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="mt-1 text-[11px] text-slate-400 font-medium">{stat.change}</div>
          </Card>
        );
      })}
    </div>
  );
}
