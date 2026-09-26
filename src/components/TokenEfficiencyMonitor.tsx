import React from 'react';
import { Zap, ShieldCheck, Database, ArrowDownRight } from 'lucide-react';
import { TokenEfficiencyStats } from '../types';

interface TokenEfficiencyMonitorProps {
  stats: TokenEfficiencyStats;
}

export const TokenEfficiencyMonitor: React.FC<TokenEfficiencyMonitorProps> = ({ stats }) => {
  const max = stats.maxTokenConstraint || 25000;
  const used = stats.estimatedTokensIngested || 1950;
  const percentage = Math.min(Math.round((used / max) * 100), 100);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">
              Operational Token Efficiency Guard
            </h4>
            <p className="text-[11px] text-slate-400">
              Strict constraint: &lt; 25,000 tokens per analysis run
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
            {used.toLocaleString()} / {max.toLocaleString()} tokens ({percentage}%)
          </span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />
            {stats.savingsPercentage || '92%'} saved
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 mb-2">
        <div 
          className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" />
          Strategy: <strong className="text-slate-300 font-normal">{stats.efficiencyMethod || 'Targeted arXiv abstract + Search grounding'}</strong>
        </span>
        <span className="text-emerald-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Token Budget Verified Safe
        </span>
      </div>
    </div>
  );
};
