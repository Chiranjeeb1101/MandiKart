import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  className = '',
  bodyClassName = '',
  hoverable = false,
}) => {
  return (
    <div
      className={`glass-panel rounded-xl overflow-hidden ${
        hoverable ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
