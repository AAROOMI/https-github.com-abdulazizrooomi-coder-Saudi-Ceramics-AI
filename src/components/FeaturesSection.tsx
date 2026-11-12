import React from 'react';
import { Video, Mic2, Cpu, Globe2, Shield, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Video,
      title: 'Full-Frame Neural Avatar',
      description:
        'Photorealistic facial animation with real-time lip sync (viseme-accurate audio mapping) rendered seamlessly via WebRTC.',
      badge: 'WebRTC Stream',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-indigo-400',
    },
    {
      icon: Mic2,
      title: 'Bi-Directional Voice Chat',
      description:
        'Continuous microphone listening with integrated noise gate and voice activity detection (VAD) for natural turn-taking conversation.',
      badge: 'Real-time Audio',
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-400',
    },
    {
      icon: Zap,
      title: 'Sub-Second Latency',
      description:
        'Low latency streaming architecture ensures near-instant replies, creating fluid human-like interactive dialogues.',
      badge: '< 800ms Response',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Cpu,
      title: 'Agent Knowledge & Tools',
      description:
        'Connected to agent intelligence configured under ID v2_agt_PIurXsZC with deep context awareness and custom prompts.',
      badge: 'Agent v2 API',
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            Powered by D-ID Agent v2
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
            Real-Time Conversational AI Video
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Experience next-generation multimodal agent interactions with live streaming video, speech synthesis, and natural dialogue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="relative group rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.gradient} border border-slate-800 flex items-center justify-center mb-4 text-white`}
                >
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white text-base">{feature.title}</h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">{feature.description}</p>

                <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  {feature.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
