import React from 'react';
import Card from '../../../components/common/Card';

export default function KpiCardGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="shadow-card border-slate-200/90 rounded-2xl p-5 hover:shadow-card-hover transition-all">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            {stat.label}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stat.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
