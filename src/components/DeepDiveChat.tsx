import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle, 
  Terminal, 
  Layers, 
  BrainCircuit,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage } from '../types';

interface DeepDiveChatProps {
  paperTitle: string;
  paperContext: string;
}

export const DeepDiveChat: React.FC<DeepDiveChatProps> = ({ paperTitle, paperContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I am your CS Research Agent for **"${paperTitle}"**. 

You can ask me to:
- Explain specific mathematical equations or matrix shapes
- Provide minimal PyTorch implementations of the core modules
- Review hardware considerations (SRAM tiling, GPU memory bandwidth, FLOPs)
- Prepare for technical ML engineering interview questions on this paper.`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickQuestions = [
    'How would I implement the forward pass in PyTorch?',
    'What is the computational complexity vs baseline models?',
    'What are the top 3 questions an interviewer at Google or Meta would ask about this paper?',
    'Explain the key mathematical derivation simply.'
  ];

  const handleSend = async (questionText?: string) => {
    const promptToSend = questionText || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/interrogate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: promptToSend,
          paperTitle,
          paperContext
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to interrogate paper.');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error: ${err.message || 'Unable to fetch response. Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              Research Agent Interrogation & Technical Deep-Dive
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-sm">
              Context grounded in {paperTitle}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
          Grounded Mode Active
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-500 shrink-0">Quick prompts:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg shrink-0 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`relative max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-cyan-600 text-white rounded-tr-sm' 
                : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
            }`}>
              <div className="whitespace-pre-wrap font-sans">
                {m.content}
              </div>

              <div className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                m.role === 'user' ? 'border-cyan-500/40 text-cyan-200' : 'border-slate-800/80 text-slate-500'
              }`}>
                <span>{m.timestamp}</span>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => copyMessage(m.id, m.content)}
                    className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                    title="Copy Answer"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/60 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Analyzing paper mechanics and engineering formulation...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about PyTorch code, math derivations, hardware bottlenecks, or interview questions..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
