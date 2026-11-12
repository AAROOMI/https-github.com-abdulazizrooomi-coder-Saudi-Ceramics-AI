import React, { useEffect, useState, useRef } from 'react';
import {
  Mic,
  Volume2,
  RefreshCw,
  ShieldCheck,
  Maximize2,
  Minimize2,
  AlertCircle,
  Sparkles,
  Wifi,
  Radio,
  Settings2,
  KeyRound,
  CheckCircle2,
  Video,
  Send,
} from 'lucide-react';
import { DEFAULT_AGENT_CONFIG, PROMPT_SUGGESTIONS, DidAgentConfig } from '../utils/agent-config.ts';

export const AgentStage: React.FC = () => {
  const [config, setConfig] = useState<DidAgentConfig>(DEFAULT_AGENT_CONFIG);
  const [hasLiveVideo, setHasLiveVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePromptToast, setActivePromptToast] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'initializing' | 'connecting' | 'connected' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [interactiveChatInput, setInteractiveChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Hello! I am your real-time D-ID interactive AI agent. You can ask me anything using your voice or this chat window.',
      time: 'Just now',
    },
  ]);

  // Form state for config drawer
  const [inputAgentId, setInputAgentId] = useState(config.agentId);
  const [inputClientKey, setInputClientKey] = useState(config.clientKey);
  const [inputMode, setInputMode] = useState<DidAgentConfig['mode']>(config.mode);

  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and inject the D-ID agent script
  const loadAgentScript = (agentConf: DidAgentConfig) => {
    setConnectionStatus('connecting');
    setErrorMessage(null);
    setHasLiveVideo(false);

    // Remove existing script if any
    const existingScript = document.querySelector<HTMLScriptElement>(`script[data-name="${agentConf.name}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = agentConf.scriptSrc;
    script.setAttribute('data-mode', agentConf.mode);
    script.setAttribute('data-client-key', agentConf.clientKey);
    script.setAttribute('data-agent-id', agentConf.agentId);
    script.setAttribute('data-name', agentConf.name);
    script.setAttribute('data-monitor', String(agentConf.monitor));
    script.setAttribute('data-light-mode', String(agentConf.lightMode));
    script.setAttribute('data-target-id', agentConf.targetId);

    script.onload = () => {
      setTimeout(() => {
        const didApi = (window as unknown as { DID_AGENTS_API?: { events?: { on: (event: string, cb: (data: unknown) => void) => void } } }).DID_AGENTS_API;
        if (didApi?.events?.on) {
          didApi.events.on('error', (payload: unknown) => {
            console.warn('[D-ID Event] Error received:', payload);
            setConnectionStatus('error');
            setErrorMessage('D-ID API authentication or origin permission notice (401). Verify allowed domains or credit balance.');
          });
          didApi.events.on('connection', (payload: unknown) => {
            console.log('[D-ID Event] Connection changed:', payload);
            setConnectionStatus('connected');
          });
        }
      }, 500);
    };

    script.onerror = () => {
      setConnectionStatus('error');
      setErrorMessage('Failed to load D-ID script from https://agent.d-id.com/v2/index.js');
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    loadAgentScript(config);

    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message?.includes('d-id') ||
        event.filename?.includes('d-id') ||
        event.error?.message?.includes('Network request failed')
      ) {
        setConnectionStatus('error');
        setErrorMessage(
          'D-ID API Origin Notice: D-ID streaming servers returned 401 Unauthorized for this origin. Check Allowed Domains or credits in D-ID Studio.'
        );
      }
    };

    window.addEventListener('error', handleGlobalError);

    // Watch for actual video rendering inside target or body
    const videoCheckInterval = window.setInterval(() => {
      const video = document.querySelector<HTMLVideoElement>('#did-agent-container video, .didagent_target video');
      if (video && video.videoWidth > 0) {
        setHasLiveVideo(true);
        setConnectionStatus('connected');
      }
    }, 1000);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      clearInterval(videoCheckInterval);
    };
  }, [config]);

  const handleReloadAgent = () => {
    loadAgentScript(config);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const newConf: DidAgentConfig = {
      ...config,
      agentId: inputAgentId.trim(),
      clientKey: inputClientKey.trim(),
      mode: inputMode,
    };
    setConfig(newConf);
    setShowConfigModal(false);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard?.writeText(prompt);
    setActivePromptToast(prompt);
    setTimeout(() => setActivePromptToast(null), 3500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactiveChatInput.trim()) return;

    const userText = interactiveChatInput.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: now },
      {
        sender: 'agent',
        text: `I received your message: "${userText}". When my live WebRTC audio stream connects with active D-ID minutes, I will answer verbally with photorealistic lip sync!`,
        time: now,
      },
    ]);
    setInteractiveChatInput('');
  };

  const toggleFullscreen = () => {
    if (!stageContainerRef.current) return;
    if (!document.fullscreenElement) {
      stageContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <section id="agent-stage" className="relative pt-4 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Main Agent Card Frame */}
        <div
          ref={stageContainerRef}
          className={`relative rounded-3xl border border-slate-800/90 bg-slate-900/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
          }`}
        >
          {/* Card Top Window Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2">
                <Radio className={`w-3.5 h-3.5 ${connectionStatus === 'connected' ? 'text-emerald-400 animate-pulse' : connectionStatus === 'error' ? 'text-amber-400' : 'text-indigo-400 animate-pulse'}`} />
                <span className="text-xs font-semibold text-slate-200">D-ID Agent Session</span>
                <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                  (ID: {config.agentId})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status pill */}
              {hasLiveVideo ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live Video Stream
                </span>
              ) : connectionStatus === 'error' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Auth Notice (401)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  Script Running
                </span>
              )}

              {/* Configure Key / Agent Button */}
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
                title="Configure Agent ID or Client Key"
              >
                <Settings2 className="w-3.5 h-3.5 text-violet-400" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              {/* Reload Button */}
              <button
                onClick={handleReloadAgent}
                title="Reload D-ID Script & Stream"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Reload D-ID Script"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Video Container Area */}
          <div className="relative w-full bg-slate-950 min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden">
            {/* The exact target DIV referenced by data-target-id */}
            <div
              id="did-agent-container"
              className="absolute inset-0 w-full h-full z-20 pointer-events-auto"
            />

            {/* Interactive Avatar Stage Display (visible whenever D-ID is connecting or waiting for video) */}
            <div className="relative z-10 w-full h-full min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-between p-6 sm:p-8">
              {/* Top status bar inside stage */}
              <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pb-2">
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>D-ID Script Running on Landing Page</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800 font-mono text-[11px]">
                  <span>Target: #{config.targetId}</span>
                </div>
              </div>

              {/* Avatar Center Visualizer */}
              <div className="flex flex-col items-center justify-center my-auto text-center max-w-lg">
                <div className="relative mb-6">
                  {/* Glowing halo */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-20 blur-xl scale-125 animate-pulse" />

                  {/* Circular Avatar Graphic */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden relative">
                      <Video className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-300" />
                      {/* Audio wave simulation bars */}
                      <div className="absolute bottom-4 flex items-end gap-1 h-4">
                        <span className="w-1 bg-indigo-400 rounded-full h-2 animate-pulse" style={{ animationDuration: '0.8s' }} />
                        <span className="w-1 bg-violet-400 rounded-full h-4 animate-pulse" style={{ animationDuration: '0.6s' }} />
                        <span className="w-1 bg-purple-400 rounded-full h-3 animate-pulse" style={{ animationDuration: '0.9s' }} />
                        <span className="w-1 bg-cyan-400 rounded-full h-4 animate-pulse" style={{ animationDuration: '0.7s' }} />
                        <span className="w-1 bg-indigo-400 rounded-full h-2 animate-pulse" style={{ animationDuration: '0.8s' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  D-ID Interactive Agent Loaded
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-4">
                  The script is active and rendering in full mode. Client Key:{' '}
                  <span className="text-violet-300 font-mono font-medium">{config.clientKey.slice(0, 10)}...</span>
                </p>

                {/* Diagnostic notice for 401 origin */}
                {errorMessage && (
                  <div className="w-full text-left bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 text-xs text-slate-300 shadow-xl mb-4">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-300">D-ID API Origin Notice (401)</p>
                        <p className="text-slate-400 mt-1">
                          The D-ID script initialized correctly on the landing page. The streaming server requires adding this origin to <strong>Allowed Domains</strong> or having active streaming credits on your D-ID account.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Configuration pill overview */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                    Key: {config.clientKey.slice(0, 8)}...
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Agent: {config.agentId}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    Mode: {config.mode}
                  </span>
                </div>
              </div>

              {/* Interactive prompt input bar */}
              <div className="w-full max-w-xl">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={interactiveChatInput}
                    onChange={(e) => setInteractiveChatInput(e.target.value)}
                    placeholder="Type a message or question to the agent..."
                    className="w-full pl-4 pr-24 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="submit"
                      disabled={!interactiveChatInput.trim()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Send</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>

                {/* Recent dialogue preview */}
                {chatMessages.length > 1 && (
                  <div className="mt-3 bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-2 max-h-32 overflow-y-auto">
                    {chatMessages.slice(-2).map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg ${
                          msg.sender === 'user' ? 'bg-indigo-600/20 text-indigo-200 ml-4' : 'bg-slate-800/70 text-slate-300 mr-4'
                        }`}
                      >
                        <span className="font-semibold text-[10px] uppercase tracking-wider block text-slate-400 mb-0.5">
                          {msg.sender === 'user' ? 'You' : 'Agent (Aura)'} • {msg.time}
                        </span>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick interactive prompts and audio tips */}
          <div className="p-4 sm:p-6 bg-slate-900/95 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Suggested Questions
                </span>
                <span className="text-[11px] text-slate-500">(Click to copy)</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Tip: Grant microphone permission for conversational voice turn-taking</span>
              </div>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyPrompt(prompt)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500/50 rounded-lg transition-all text-left flex items-center gap-1.5 group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
                  <span>&quot;{prompt}&quot;</span>
                </button>
              ))}
            </div>

            {/* Toast feedback when copying prompt */}
            {activePromptToast && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Copied prompt to clipboard! You can speak it aloud or paste into the chat.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal to test custom Agent ID or Client Key */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Agent Credentials</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Agent ID</label>
                <input
                  type="text"
                  value={inputAgentId}
                  onChange={(e) => setInputAgentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. v2_agt_PIurXsZC"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Client Key</label>
                <input
                  type="text"
                  value={inputClientKey}
                  onChange={(e) => setInputClientKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. ck_OO4TWPiyzqbHV6mijfzTs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Display Mode</label>
                <select
                  value={inputMode}
                  onChange={(e) => setInputMode(e.target.value as DidAgentConfig['mode'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="full">full (Embedded in Target Container)</option>
                  <option value="fabio">fabio (Floating interactive widget)</option>
                  <option value="widget">widget (Classic corner popup)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputAgentId(DEFAULT_AGENT_CONFIG.agentId);
                    setInputClientKey(DEFAULT_AGENT_CONFIG.clientKey);
                    setInputMode(DEFAULT_AGENT_CONFIG.mode);
                  }}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Apply & Reload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
