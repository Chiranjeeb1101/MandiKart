import React from 'react';
import type { AiInsight } from '../types/admin';

interface AiInsightsCardProps {
  insights: AiInsight[];
}

export const AiInsightsCard: React.FC<AiInsightsCardProps> = ({ insights }) => {
  const getCategoryBadge = (category: string) => {
    if (category.includes('RISK') || category.includes('DISPUTE')) {
      // Red indicator
      return 'bg-black text-rose-400 border border-rose-400';
    } else if (category.includes('PRICE') || category.includes('VOLATILITY') || category.includes('WEATHER')) {
      // Orange indicator
      return 'bg-black text-orange-400 border border-orange-400';
    } else {
      // Green indicator
      return 'bg-black text-emerald-400 border border-emerald-400';
    }
  };

  return (
    <div className="bg-black rounded-xl p-5 text-white shadow-md border border-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-emerald-400 border border-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">psychology</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">AI Intelligence Engine</h3>
              <p className="text-[11px] text-slate-300 font-medium">Automated spoilage risk & market forecasting</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-black text-emerald-400 border border-emerald-400">
            Live Stream
          </span>
        </div>

        <div className="space-y-3 my-2">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-3 rounded-lg bg-black border border-white space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getCategoryBadge(insight.category)}`}>
                  {insight.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{insight.timestamp}</span>
              </div>
              <p className="text-xs font-bold text-white leading-snug">{insight.title}</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">{insight.description}</p>
              <div className="pt-1.5 border-t border-white/30 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-bold">Recommended:</span>
                <button className="text-[11px] font-extrabold text-orange-400 hover:text-orange-300 underline">
                  {insight.recommendedAction}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-white flex items-center justify-between text-xs text-slate-300">
        <span className="text-[11px] font-medium text-slate-300">Synced 2m ago</span>
        <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
          <span>Open AI Workbench</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};



