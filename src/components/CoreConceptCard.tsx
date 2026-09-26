import React, { useState } from 'react';
import { 
  FileText, 
  Target, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  BookOpen, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { CoreConcept, PaperMetadata } from '../types';

interface CoreConceptCardProps {
  coreConcept: CoreConcept;
  paper: PaperMetadata;
}

export const CoreConceptCard: React.FC<CoreConceptCardProps> = ({ coreConcept, paper }) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Compute actual word count of the combined plain language synthesis
  const computedWords = (
    (coreConcept.plainLanguageSummary || '') + ' ' +
    (coreConcept.problemStatement || '') + ' ' +
    (coreConcept.primaryMethodology || '') + ' ' +
    (coreConcept.mathematicalAlgorithmicBreakthroughs || '')
  ).trim().split(/\s+/).filter(Boolean).length;

  const wordCount = coreConcept.wordCount || computedWords;
  const isUnderWordLimit = wordCount <= 300;

  const handleCopy = () => {
    const text = `CORE CONCEPT EXTRACTION: ${paper.title}

1. Problem Statement:
${coreConcept.problemStatement}

2. Primary Methodology:
${coreConcept.primaryMethodology}

3. Mathematical & Algorithmic Breakthroughs:
${coreConcept.mathematicalAlgorithmicBreakthroughs}

Plain-Language Synthesis:
${coreConcept.plainLanguageSummary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-6 relative">
      {/* Header with Step Indicator and Word Counter Badge */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/50 rounded-lg text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            STEP 1: CORE CONCEPT EXTRACTION
          </div>
          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            Under 300 words &bull; Plain Accessible Language
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Word Count Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
            isUnderWordLimit 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' 
              : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Word Budget: <strong>{wordCount}</strong> / 300 max</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main 3 Sections required by system prompt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Section 1: Problem Statement */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700 transition-all flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                1. Problem Statement
              </h4>
              <p className="text-[11px] text-slate-400">What limitation existed</p>
            </div>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed flex-1">
            {coreConcept.problemStatement}
          </p>
        </div>

        {/* Section 2: Primary Methodology */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700 transition-all flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                2. Primary Methodology
              </h4>
              <p className="text-[11px] text-slate-400">Core architecture introduced</p>
            </div>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed flex-1">
            {coreConcept.primaryMethodology}
          </p>
        </div>

        {/* Section 3: Mathematical & Algorithmic Breakthroughs */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700 transition-all flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                3. Key Breakthroughs
              </h4>
              <p className="text-[11px] text-slate-400">Mathematical & algorithmic leaps</p>
            </div>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed flex-1">
            {coreConcept.mathematicalAlgorithmicBreakthroughs}
          </p>
        </div>
      </div>

      {/* Plain Language Accessible Synthesis Box */}
      {coreConcept.plainLanguageSummary && (
        <div className="bg-slate-950/90 border border-emerald-900/40 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h5 className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
              Plain-Language Undergrad Synthesis (TL;DR)
            </h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {coreConcept.plainLanguageSummary}
          </p>
        </div>
      )}
    </div>
  );
};
