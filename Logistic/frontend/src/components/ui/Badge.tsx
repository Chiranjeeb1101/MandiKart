import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'amber' | 'blue' | 'purple' | 'rose' | 'slate' | 'cyan' | 'teal';
  dot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, string> = {
  brand: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  teal: 'bg-teal-500/10 text-teal-300 border-teal-500/25',
};

const dotColors: Record<string, string> = {
  brand: 'bg-emerald-400',
  amber: 'bg-amber-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  rose: 'bg-rose-400',
  slate: 'bg-slate-400',
  cyan: 'bg-cyan-400',
  teal: 'bg-teal-300',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  dot = false,
  className = '',
  size = 'md',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs tracking-wide'
      } ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />}
      {children}
    </span>
  );
};
