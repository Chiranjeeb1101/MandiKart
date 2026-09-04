import React from 'react';
import type { KpiMetric } from '../types/admin';

interface KpiCardProps {
  metric: KpiMetric;
}

export const KpiCard: React.FC<KpiCardProps> = ({ metric }) => {
  return (
    <div className="bg-black p-5 rounded-xl border border-white shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
          {metric.label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-black text-emerald-400 flex items-center justify-center border border-emerald-400">
          <span className="material-symbols-outlined text-lg">{metric.iconName}</span>
        </div>
      </div>

      <div>
        {/* Metric Value in Bold Bright White */}
        <div className="text-2xl font-black text-white tracking-tight">
          {metric.value}
        </div>

        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/40">
          {/* Trend Pill: Green for positive, Red for negative */}
          <span
            className={`inline-flex items-center text-[11px] font-black px-2 py-0.5 rounded border ${
              metric.isPositive
                ? 'bg-black text-emerald-400 border-emerald-400'
                : 'bg-black text-rose-400 border-rose-400'
            }`}
          >
            <span className="material-symbols-outlined text-xs mr-0.5">
              {metric.isPositive ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {metric.change}
          </span>
          <span className="text-[11px] text-slate-300 font-bold">vs {metric.period}</span>
        </div>
      </div>
    </div>
  );
};



