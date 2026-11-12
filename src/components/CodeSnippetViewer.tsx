import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, ExternalLink, Key, Layers, Radio } from 'lucide-react';
import { DEFAULT_AGENT_CONFIG, generateScriptHtml } from '../utils/agent-config.ts';

export const CodeSnippetViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const snippet = generateScriptHtml(DEFAULT_AGENT_CONFIG);

  const handleCopy = () => {
    navigator.clipboard?.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="embed-snippet" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/80">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-violet-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Active Script Tag Configuration</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              The exact D-ID script currently loaded and executing in this landing page.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied Code</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Script Tag</span>
              </>
            )}
          </button>
        </div>

        {/* Code block preview */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">index.html / App.tsx</span>
            </div>

            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              HTML Module Script
            </span>
          </div>

          <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed bg-slate-950/70">
            <code>{snippet}</code>
          </pre>
        </div>

        {/* Parameter summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Container ID</span>
            </div>
            <p className="text-sm font-mono font-medium text-white">did-agent-container</p>
            <p className="text-[11px] text-slate-500 mt-1">Replaced placeholder &lt;PLACE_YOUR_DIV_ID_HERE&gt;</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Key className="w-3.5 h-3.5 text-violet-400" />
              <span>Client Key</span>
            </div>
            <p className="text-sm font-mono font-medium text-white">ck_OO4TW...zTs</p>
            <p className="text-[11px] text-slate-500 mt-1">Authenticated live D-ID API client</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agent ID & Mode</span>
            </div>
            <p className="text-sm font-mono font-medium text-white">v2_agt_PIurXsZC (full)</p>
            <p className="text-[11px] text-slate-500 mt-1">Full-screen interactive avatar mode</p>
          </div>
        </div>
      </div>
    </section>
  );
};
