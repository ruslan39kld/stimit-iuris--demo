import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { AGENTS, AgentId } from '../data/agents';

interface AgentPipelineProps {
  variant: 'hero' | 'workspace';
  activeAgentIds?: AgentId[];
  completedAgentIds?: AgentId[];
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  variant,
  activeAgentIds = [],
  completedAgentIds = [],
}) => {
  // In hero mode, animate a gentle sequential signal pulse across the 6 nodes
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);

  useEffect(() => {
    if (variant !== 'hero') return;
    const timer = window.setInterval(() => {
      setHeroActiveIndex((prev) => (prev + 1) % AGENTS.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [variant]);

  if (variant === 'hero') {
    return (
      <div
        className="w-full rounded-xl border border-white/15 bg-white/[0.06] p-4 sm:p-5 backdrop-blur-sm"
        aria-label="Схема работы шести последовательных AI-агентов"
      >
        <div className="mb-3 flex items-center justify-between text-xs text-blue-100/80">
          <span className="font-medium">Последовательный конвейер проверки договора</span>
          <span className="font-mono tabular-nums">6 этапов · роли не смешиваются</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
          {AGENTS.map((agent, idx) => {
            const isHighlighted = idx === heroActiveIndex;
            const isPast = idx < heroActiveIndex;
            return (
              <div key={agent.id} className="relative flex items-center">
                <div
                  className={`relative flex w-full flex-col justify-between rounded-lg border px-3 py-3 transition-all duration-300 ${
                    isHighlighted
                      ? 'border-blue-300/70 bg-white/15 shadow-sm'
                      : isPast
                        ? 'border-white/20 bg-white/[0.09]'
                        : 'border-white/10 bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold tabular-nums text-blue-200">
                      {agent.order}
                    </span>
                    {isHighlighted ? (
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-blue-300 animate-node-pulse"
                        aria-hidden="true"
                      />
                    ) : isPast ? (
                      <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-white/25" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-semibold leading-snug text-white">
                      {agent.shortName}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-tight text-blue-100/75 line-clamp-1">
                      {agent.role}
                    </div>
                  </div>
                </div>

                {idx < AGENTS.length - 1 && (
                  <div
                    className="hidden lg:flex relative mx-1 h-0.5 w-6 shrink-0 items-center overflow-hidden bg-white/20"
                    aria-hidden="true"
                  >
                    <span
                      className="absolute left-0 h-1.5 w-1.5 rounded-full bg-blue-200 animate-signal-travel"
                      style={{ animationDelay: `${idx * 0.35}s` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Workspace mode (light theme)
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
      aria-label="Статус конвейера агентов"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
        {AGENTS.map((agent, idx) => {
          const isActive = activeAgentIds.includes(agent.id);
          const isCompleted = completedAgentIds.includes(agent.id) && !isActive;

          return (
            <div key={agent.id} className="flex items-center">
              <div
                className={`flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 transition-all duration-200 ${
                  isActive
                    ? 'border-[#1B3A6B] bg-[#1B3A6B]/[0.06] text-[#1B3A6B] animate-node-pulse'
                    : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
                      : 'border-slate-200 bg-slate-50/60 text-slate-500'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-semibold tabular-nums">
                      {agent.order}
                    </span>
                    <span className="truncate text-xs font-semibold">{agent.shortName}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                  ) : isActive ? (
                    <span
                      className="block h-2.5 w-2.5 rounded-full bg-[#1B3A6B]"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="block h-2 w-2 rounded-full bg-slate-300"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              {idx < AGENTS.length - 1 && (
                <div
                  className="hidden lg:flex relative mx-1 h-0.5 w-4 shrink-0 items-center overflow-hidden bg-slate-200"
                  aria-hidden="true"
                >
                  {(isActive || isCompleted) && (
                    <span className="absolute left-0 h-1.5 w-1.5 rounded-full bg-[#1B3A6B] animate-signal-travel" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
