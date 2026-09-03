import React from 'react';

export interface CapacityBarProps {
  currentKg: number;
  maxKg: number;
  className?: string;
  showLabels?: boolean;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  currentKg,
  maxKg,
  className = '',
  showLabels = true,
}) => {
  const percentage = Math.min(Math.round((currentKg / maxKg) * 100), 100);

  const getBarColor = (pct: number) => {
    if (pct >= 90) return 'bg-rose-500 shadow-rose-500/50';
    if (pct >= 75) return 'bg-amber-500 shadow-amber-500/50';
    return 'bg-brand-500 shadow-brand-500/50';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400">
            Payload: <strong className="text-slate-200">{currentKg.toLocaleString()} kg</strong>
          </span>
          <span className="font-semibold text-slate-300">
            {percentage}% <span className="text-slate-500 font-normal">/ {maxKg.toLocaleString()} kg</span>
          </span>
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
