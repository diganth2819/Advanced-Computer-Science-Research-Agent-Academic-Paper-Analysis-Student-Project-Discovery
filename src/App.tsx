import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Layers, 
  Cpu, 
  Briefcase, 
  BookOpen, 
  ExternalLink, 
  Share2, 
  HelpCircle, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Terminal,
  Bookmark,
  Compass,
  ArrowRight,
  ShieldAlert,
  Code
} from 'lucide-react';

import { AnalysisResult, SamplePaper } from './types';
import { INITIAL_PAPER_ANALYSIS } from './data/initialPaper';
import { CoreConceptCard } from './components/CoreConceptCard';
import { MermaidViewer } from './components/MermaidViewer';
import { FutureWorkProjects } from './components/FutureWorkProjects';
import { TokenEfficiencyMonitor } from './components/TokenEfficiencyMonitor';
import { DeepDiveChat } from './components/DeepDiveChat';
import { ExportDossierModal } from './components/ExportDossierModal';

export default function App() {
  const [urlInput, setUrlInput] = useState<string>('https://arxiv.org/abs/1706.03762');
  const [analysis, setAnalysis] = useState<AnalysisResult>(INITIAL_PAPER_ANALYSIS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'step1' | 'step2' | 'step3' | 'chat'>('all');
  const [samplePapers, setSamplePapers] = useState<SamplePaper[]>([]);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Fetch sample papers on mount
  useEffect(() => {
    fetch('/api/sample-papers')
      .then(res => res.json())
      .then(data => {
        if (data.papers) setSamplePapers(data.papers);
      })
      .catch(err => console.warn('Could not load sample papers list:', err));
  }, []);

  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl || urlInput;
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setLoadingStep('Ingesting paper metadata & checking arXiv repository...');

    try {
      setTimeout(() => {
        setLoadingStep('Enforcing token efficiency & running Google Search grounding...');
      }, 1200);

      setTimeout(() => {
        setLoadingStep('Synthesizing Core Concepts & Mermaid.js architecture graph...');
      }, 3000);

      setTimeout(() => {
        setLoadingStep('Formulating 3rd-year CS student resume project extensions...');
      }, 5000);

      const res = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze paper.');
      }

      setAnalysis(data);
      if (overrideUrl) {
        setUrlInput(overrideUrl);
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Analysis failed. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSelectSample = (paper: SamplePaper) => {
    setUrlInput(paper.url);
    handleAnalyze(paper.url);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Agent Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-400 p-[1px] shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-[#070b14] rounded-[11px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white font-mono">
                  PaperArchitect
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 font-semibold tracking-wider">
                  CS Research Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Academic Paper Decomposition &bull; Mermaid.js Architecture &bull; Student Opportunities
              </p>
            </div>
          </div>

          {/* Operational Constraint Badge & Export CTA */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Tokens: <strong>&lt; 25,000 Cap</strong> Enforced</span>
            </div>

            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors shadow-sm"
              title="Export complete analysis dossier"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6 flex-1">
        {/* Research Input Bar */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          {/* Subtle glow highlight */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mb-3">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Parse Academic Paper & Synthesize System Architecture</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter an arXiv URL, DOI, direct paper title, or paper excerpt. The agent extracts core concepts under 300 words, renders a clean Mermaid.js flowchart, and plans 3 student resume projects.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. https://arxiv.org/abs/2312.00752 (Mamba), 1706.03762, or paper title..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors font-mono"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/50 disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Paper...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Execute Analysis</span>
                </>
              )}
            </button>
          </form>

          {/* Landmark Papers Quick Selector */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              Benchmark Papers:
            </span>
            {samplePapers.map((paper) => (
              <button
                key={paper.id}
                onClick={() => handleSelectSample(paper)}
                disabled={isLoading}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-slate-300 font-medium ${
                  urlInput.includes(paper.url)
                    ? 'bg-cyan-950/80 border-cyan-700 text-cyan-200 font-semibold'
                    : 'bg-slate-950 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
                }`}
                title={paper.blurb}
              >
                {paper.title.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Progress / Loading status */}
          {isLoading && (
            <div className="mt-4 p-3.5 bg-cyan-950/30 border border-cyan-800/50 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-900/50 text-cyan-300 animate-spin">
                <Loader2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-cyan-200">Executing Agent Pipeline:</span>
                  <span className="text-[11px] font-mono text-cyan-400">Token Efficiency Priority</span>
                </div>
                <p className="text-xs text-cyan-300 font-mono">
                  &gt; {loadingStep}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <h4 className="font-semibold text-rose-300">Analysis Error</h4>
                <p className="text-slate-300 mt-0.5">{error}</p>
                <button
                  onClick={() => handleAnalyze()}
                  className="mt-2 text-rose-400 underline font-mono hover:text-rose-300"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Paper Metadata Banner */}
        {analysis && (
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-[11px] font-mono rounded">
                    {analysis.paper.venueOrCategory || 'Computer Science Research'}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-mono rounded">
                    {analysis.paper.year || 'Published'}
                  </span>
                  {analysis.paper.primaryDomain && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      &bull; {analysis.paper.primaryDomain}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight">
                  {analysis.paper.title}
                </h2>

                {analysis.paper.authors && analysis.paper.authors.length > 0 && (
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Authors:</strong> {analysis.paper.authors.join(', ')}
                  </p>
                )}

                {analysis.paper.oneSentencePitch && (
                  <p className="text-xs text-slate-300 italic pt-0.5">
                    &ldquo;{analysis.paper.oneSentencePitch}&rdquo;
                  </p>
                )}
              </div>

              {analysis.paper.url && (
                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={analysis.paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                  >
                    <span>Source Paper</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Token Efficiency Guard Display */}
        {analysis?.tokenEfficiencyStats && (
          <TokenEfficiencyMonitor stats={analysis.tokenEfficiencyStats} />
        )}

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 overflow-x-auto pb-1 gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Research Dossier (Steps 1-3)</span>
            </button>

            <button
              onClick={() => setActiveTab('step1')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'step1'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step 1: Core Concept Extraction</span>
            </button>

            <button
              onClick={() => setActiveTab('step2')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'step2'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step 2: Mermaid Flowchart</span>
            </button>

            <button
              onClick={() => setActiveTab('step3')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'step3'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Step 3: Student Opportunities</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Interrogate Agent (Q&A)</span>
            </button>
          </div>
        </div>

        {/* Tab Views */}
        {analysis && (
          <div className="space-y-6">
            {/* ALL (Dossier Mode) */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                <CoreConceptCard 
                  coreConcept={analysis.coreConcept} 
                  paper={analysis.paper} 
                />
                
                <MermaidViewer 
                  chart={analysis.mermaidFlowchart} 
                  paperTitle={analysis.paper.title} 
                  onUpdateChart={(newChart) => {
                    setAnalysis(prev => ({ ...prev, mermaidFlowchart: newChart }));
                  }}
                />

                <FutureWorkProjects 
                  opportunities={analysis.futureWorkOpportunities} 
                  paperTitle={analysis.paper.title} 
                />
              </div>
            )}

            {/* STEP 1 ONLY */}
            {activeTab === 'step1' && (
              <CoreConceptCard 
                coreConcept={analysis.coreConcept} 
                paper={analysis.paper} 
              />
            )}

            {/* STEP 2 ONLY */}
            {activeTab === 'step2' && (
              <MermaidViewer 
                chart={analysis.mermaidFlowchart} 
                paperTitle={analysis.paper.title}
                onUpdateChart={(newChart) => {
                  setAnalysis(prev => ({ ...prev, mermaidFlowchart: newChart }));
                }}
              />
            )}

            {/* STEP 3 ONLY */}
            {activeTab === 'step3' && (
              <FutureWorkProjects 
                opportunities={analysis.futureWorkOpportunities} 
                paperTitle={analysis.paper.title} 
              />
            )}

            {/* INTERROGATION CHAT */}
            {activeTab === 'chat' && (
              <DeepDiveChat 
                paperTitle={analysis.paper.title} 
                paperContext={`Title: ${analysis.paper.title}
Problem: ${analysis.coreConcept.problemStatement}
Methodology: ${analysis.coreConcept.primaryMethodology}
Breakthroughs: ${analysis.coreConcept.mathematicalAlgorithmicBreakthroughs}
Mermaid Flowchart:
${analysis.mermaidFlowchart}`}
              />
            )}
          </div>
        )}
      </main>

      {/* Export Modal */}
      {analysis && (
        <ExportDossierModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          result={analysis}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
          <div>
            PaperArchitect &bull; Advanced Computer Science Research Agent
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Constraint: &lt; 25k Tokens</span>
            <span>Mermaid.js Flowchart (graph TD)</span>
            <span>3rd-Year CS Developer Roadmaps</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
