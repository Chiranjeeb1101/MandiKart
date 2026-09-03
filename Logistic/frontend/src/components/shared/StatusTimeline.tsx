import React from 'react';
import { OrderStatus } from '../../types';
import { ORDER_STATUS_LOGISTICS_LABELS } from '../../constants/orderStatusLabels';
import { Check, Clock, AlertCircle } from 'lucide-react';

export interface StatusTimelineProps {
  currentStatus: OrderStatus;
  className?: string;
  isBulk?: boolean;
  collectedCount?: number;
  totalCount?: number;
}

const CANONICAL_ORDER_FLOW: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'PICKUP_SCHEDULED',
  'PICKUP_IN_PROGRESS',
  'COLLECTED',
  'IN_TRANSIT',
  'DELIVERED',
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  className = '',
  isBulk = false,
  collectedCount = 0,
  totalCount = 0,
}) => {
  const currentIndex = CANONICAL_ORDER_FLOW.indexOf(currentStatus);
  const isFailed = currentStatus === 'FAILED';
  const isDisputed = currentStatus === 'DISPUTED';
  const isCancelled = currentStatus === 'CANCELLED';

  return (
    <div className={`w-full py-3 ${className}`}>
      {/* Side status alert if present */}
      {(isFailed || isDisputed || isCancelled) && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>
            <strong>Attention:</strong> This order is in side-state:{' '}
            <span className="font-semibold underline">{ORDER_STATUS_LOGISTICS_LABELS[currentStatus]}</span>.
            Special operational intervention required.
          </span>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="relative flex items-center justify-between w-full overflow-x-auto pb-2">
        {/* Connecting Background Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 -z-0" />

        {/* Connecting Active Progress Line */}
        {currentIndex >= 0 && (
          <div
            className="absolute top-4 left-4 h-0.5 bg-brand-500 transition-all duration-300 -z-0"
            style={{
              width: `${(currentIndex / (CANONICAL_ORDER_FLOW.length - 1)) * 92}%`,
            }}
          />
        )}

        {CANONICAL_ORDER_FLOW.map((statusKey, index) => {
          const isPassed = currentIndex > index;
          const isCurrent = currentIndex === index;
          const label = ORDER_STATUS_LOGISTICS_LABELS[statusKey];

          return (
            <div
              key={statusKey}
              className="flex flex-col items-center relative z-10 min-w-[90px] text-center px-1"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                  isPassed
                    ? 'bg-brand-500 border-brand-400 text-slate-950 font-bold shadow-md shadow-brand-500/30'
                    : isCurrent
                    ? 'bg-slate-900 border-brand-400 text-brand-400 ring-4 ring-brand-500/20 shadow-lg'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isPassed ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 animate-spin text-brand-400" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>

              <span
                className={`text-[11px] font-medium mt-2 max-w-[110px] leading-tight ${
                  isCurrent
                    ? 'text-brand-400 font-bold'
                    : isPassed
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}
              >
                {label}
              </span>

              {statusKey === 'COLLECTED' && isBulk && totalCount > 0 && (
                <span className="text-[10px] mt-0.5 px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  {collectedCount}/{totalCount} Picked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
