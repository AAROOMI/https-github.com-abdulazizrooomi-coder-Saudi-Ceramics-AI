import React from 'react';
import { Bot, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400 font-medium">Interactive AI Agent</span>
          <span>•</span>
          <span>D-ID Agents v2 Integration</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Agent ID: <code className="text-indigo-300">v2_agt_PIurXsZC</code></span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Client Ready
          </span>
        </div>
      </div>
    </footer>
  );
};
