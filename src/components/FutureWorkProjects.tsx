import React, { useState } from 'react';
import { 
  Briefcase, 
  Gauge, 
  Cpu, 
  Layers, 
  Calendar, 
  Copy, 
  Check, 
  ArrowUpRight, 
  CheckCircle2, 
  FolderGit2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { FutureWorkOpportunity } from '../types';

interface FutureWorkProjectsProps {
  opportunities: FutureWorkOpportunity[];
  paperTitle: string;
}

export const FutureWorkProjects: React.FC<FutureWorkProjectsProps> = ({ 
  opportunities, 
  paperTitle 
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const handleCopyBullet = (id: number, bullet: string) => {
    navigator.clipboard.writeText(bullet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'intermediate':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'advanced':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'hard':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      default:
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/60 border border-indigo-800/50 rounded-lg text-xs font-semibold text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            STEP 3: FUTURE WORK & INTERNSHIP OPPORTUNITIES
          </div>
          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            3 High-Impact Resume Projects for 3rd-Year CS Students
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Resume-Ready Deliverables</span>
        </div>
      </div>

      {/* 3 Project Cards */}
      <div className="space-y-5">
        {opportunities.map((opp, idx) => {
          const isExpanded = expandedId === opp.id;
          return (
            <div 
              key={opp.id || idx}
              className={`bg-slate-950 border rounded-xl overflow-hidden transition-all duration-200 ${
                isExpanded 
                  ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-lg' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header Accordion / Overview */}
              <div 
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                onClick={() => setExpandedId(isExpanded ? null : opp.id)}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-mono font-bold flex items-center justify-center shrink-0 text-sm">
                    #{opp.id || idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      {opp.projectTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {opp.exactExtension}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:self-center shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(opp.difficultyLevel)}`}>
                    {opp.difficultyLevel || 'Advanced'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {opp.estimatedWeeks || '3-4 weeks'}
                  </span>
                  <button 
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 bg-slate-950/40 space-y-4 text-xs">
                  {/* The Exact Extension */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5">
                    <div className="flex items-center gap-2 text-indigo-400 font-mono uppercase tracking-wider font-semibold mb-1 text-[11px]">
                      <Layers className="w-3.5 h-3.5" />
                      The Exact Extension
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">
                      {opp.exactExtension}
                    </p>
                  </div>

                  {/* 2-column info: Targeted Metric & Tech Stack */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Targeted Performance Metric */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono uppercase tracking-wider font-semibold mb-1 text-[11px]">
                        <Gauge className="w-3.5 h-3.5" />
                        Targeted Performance Metric
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {opp.targetedPerformanceMetric}
                      </p>
                    </div>

                    {/* Recommended Tech Stack */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5">
                      <div className="flex items-center gap-2 text-cyan-400 font-mono uppercase tracking-wider font-semibold mb-2 text-[11px]">
                        <Cpu className="w-3.5 h-3.5" />
                        Recommended Tech Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.recommendedTechStack.map((tech, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-mono text-[11px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-Paste Resume Bullet */}
                  <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-lg p-3.5 relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px] uppercase tracking-wide">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Ready-To-Paste Resume Bullet</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyBullet(opp.id, opp.resumeBullet);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 rounded text-[11px] font-medium transition-colors"
                      >
                        {copiedId === opp.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-slate-300 font-mono text-xs italic bg-slate-950/80 p-2.5 rounded border border-indigo-900/40">
                      &bull; {opp.resumeBullet}
                    </p>
                  </div>

                  {/* Milestones & Starter Repo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {opp.starterGithubIdea && (
                      <div className="flex items-start gap-2 text-slate-400 bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                        <FolderGit2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-medium text-slate-300 block">Baseline Codebase to Fork:</span>
                          <span className="text-slate-400 text-[11px] font-mono">{opp.starterGithubIdea}</span>
                        </div>
                      </div>
                    )}

                    {opp.milestones && opp.milestones.length > 0 && (
                      <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                        <span className="text-[11px] font-medium text-slate-300 block mb-1.5">Execution Milestones:</span>
                        <div className="space-y-1">
                          {opp.milestones.map((m, mIdx) => (
                            <div key={mIdx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
