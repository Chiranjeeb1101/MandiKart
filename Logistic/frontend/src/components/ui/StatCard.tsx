import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'brand' | 'amber' | 'blue' | 'purple' | 'rose' | 'cyan';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'brand',
  onClick,
}) => {
  const accentBorders = {
    brand: 'hover:border-emerald-500/50 shadow-emerald-500/5',
    amber: 'hover:border-amber-500/50 shadow-amber-500/5',
    blue: 'hover:border-blue-500/50 shadow-blue-500/5',
    purple: 'hover:border-purple-500/50 shadow-purple-500/5',
    rose: 'hover:border-rose-500/50 shadow-rose-500/5',
    cyan: 'hover:border-cyan-500/50 shadow-cyan-500/5',
  };

  const iconBg = {
    brand: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-xl transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${accentBorders[accentColor]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBg[accentColor]}`}>{icon}</div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.value}
          </span>
          <span className="text-slate-400">{trend.label || 'vs yesterday'}</span>
        </div>
      )}
    </div>
  );
};
