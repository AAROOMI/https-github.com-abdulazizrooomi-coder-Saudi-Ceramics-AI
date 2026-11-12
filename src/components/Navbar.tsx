import React from 'react';
import { Bot, Sparkles, Mic, Radio, Code2, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onScrollToStage: () => void;
  onScrollToEmbed: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToStage, onScrollToEmbed }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 shadow-lg shadow-indigo-500/20 text-white">
            <Bot className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">AURA AI</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                D-ID v2
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Conversational Video Avatar</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Agent Stream:</span>
          <span className="font-medium text-emerald-400">Active Ready</span>
        </div>

        {/* Action Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onScrollToStage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Mic className="w-4 h-4 text-indigo-400" />
            <span>Live Agent</span>
          </button>

          <button
            onClick={onScrollToEmbed}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Code2 className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline">Script Tag</span>
            <span className="sm:hidden">Script</span>
          </button>

          <a
            href="https://docs.d-id.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>D-ID Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
