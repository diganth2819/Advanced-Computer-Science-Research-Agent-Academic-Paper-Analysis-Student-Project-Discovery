import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  Code, 
  Eye, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  paperTitle?: string;
  onUpdateChart?: (newChart: string) => void;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ 
  chart, 
  paperTitle = 'System Architecture',
  onUpdateChart 
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'code' | 'raw_segment'>('diagram');
  const [editableCode, setEditableCode] = useState<string>(chart);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditableCode(chart);
  }, [chart]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#0284c7',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#38bdf8',
        lineColor: '#38bdf8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        edgeLabelBackground: '#1e293b',
        nodeBorder: '#38bdf8',
        nodeTextColor: '#f8fafc',
        clusterBkg: '#0f172a',
        clusterBorder: '#334155',
        titleColor: '#38bdf8',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis'
      },
      securityLevel: 'loose'
    });
  }, []);

  const renderDiagram = async (codeToRender: string) => {
    try {
      setRenderError(null);
      const uniqueId = `mermaid-graph-${Date.now()}`;
      // Sanitize input: ensure it starts with graph or flowchart
      let cleaned = codeToRender.trim();
      if (!cleaned.startsWith('graph ') && !cleaned.startsWith('flowchart ')) {
        cleaned = `graph TD\n${cleaned}`;
      }
      const { svg } = await mermaid.render(uniqueId, cleaned);
      setSvgContent(svg);
    } catch (err: any) {
      console.error('Mermaid render error:', err);
      setRenderError(err.message || 'Failed to render Mermaid diagram. Review syntax.');
    }
  };

  useEffect(() => {
    if (editableCode) {
      renderDiagram(editableCode);
    }
  }, [editableCode]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'diagram') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paperTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_architecture.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 backdrop-blur-xl' : 'w-full'
    }`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/60 border border-cyan-800/50 rounded-lg text-xs font-semibold text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            STEP 2: ARCHITECTURAL FLOWCHART
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            graph TD (Mermaid.js)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'diagram' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Interactive Diagram View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Diagram</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'code' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mermaid Syntax Editor"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Edit Code</span>
            </button>
            <button
              onClick={() => setViewMode('raw_segment')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'raw_segment' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Prompt Spec: [FLOWCHART] Text Segment"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>[FLOWCHART]</span>
            </button>
          </div>

          {/* Canvas controls */}
          {viewMode === 'diagram' && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 px-1">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={() => copyToClipboard(viewMode === 'raw_segment' ? `[FLOWCHART]\n${editableCode}` : editableCode)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={downloadSvg}
            disabled={!svgContent}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all disabled:opacity-50"
            title="Download Vector SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SVG</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div 
        ref={containerRef}
        className={`relative w-full overflow-hidden select-none ${
          isFullscreen ? 'flex-1 min-h-[70vh]' : 'min-h-[460px] h-[540px]'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : viewMode === 'diagram' ? 'grab' : 'default' }}
      >
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {viewMode === 'diagram' && (
          <>
            {renderError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-950/90">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-rose-400" />
                </div>
                <h4 className="text-base font-semibold text-rose-300 mb-1">Mermaid Syntax Warning</h4>
                <p className="text-xs text-slate-400 max-w-md mb-4 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                  {renderError}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('code')}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg"
                  >
                    Open Code Editor to Fix
                  </button>
                  <button
                    onClick={() => renderDiagram(chart)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
                  >
                    Revert to Default
                  </button>
                </div>
              </div>
            ) : svgContent ? (
              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center'
                }}
              >
                <div 
                  className="mermaid-svg-container p-6"
                  dangerouslySetInnerHTML={{ __html: svgContent }} 
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                <div className="animate-spin w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full mr-2" />
                Compiling Mermaid architecture graph...
              </div>
            )}

            {/* Quick helper badge overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Drag to pan &bull; Scroll / buttons to zoom &bull; Export vector SVG
            </div>
          </>
        )}

        {viewMode === 'code' && (
          <div className="w-full h-full p-4 flex flex-col bg-slate-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold">Live Mermaid Syntax:</span>
              <button
                onClick={() => {
                  onUpdateChart?.(editableCode);
                  setViewMode('diagram');
                }}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-md transition-colors"
              >
                Apply & View Diagram
              </button>
            </div>
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-200 resize-none focus:outline-none focus:border-cyan-500"
              spellCheck={false}
            />
          </div>
        )}

        {viewMode === 'raw_segment' && (
          <div className="w-full h-full p-4 flex flex-col bg-slate-950">
            <div className="mb-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Constraint Output: Plain text labeled [FLOWCHART] (No Markdown ticks inside):
              </span>
            </div>
            <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-auto whitespace-pre select-text">
              {`[FLOWCHART]\n${editableCode}`}
            </div>
          </div>
        )}
      </div>

      {/* Footer architectural layer guide */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-mono">FLOW PIPELINE:</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-cyan-500"></span> Input Tokens / Tensors</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-indigo-500"></span> Core Math / Attention / SSM</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500"></span> Projection / Output Heads</span>
        </div>
        <div className="text-slate-500 font-mono">
          Tokens: ~250 in diagram specification
        </div>
      </div>
    </div>
  );
};
