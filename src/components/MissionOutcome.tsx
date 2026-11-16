import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SCENARIOS, Scenario } from '../data/scenarios';
import { AgentPipeline } from './AgentPipeline';

interface MissionOutcomeProps {
  scenario: Scenario;
  onReplay: () => void;
  onSwitchScenario: (scenarioId: Scenario['id']) => void;
  onOpenFullContract: () => void;
  onGoHome: () => void;
}

export const MissionOutcome: React.FC<MissionOutcomeProps> = ({
  scenario,
  onReplay,
  onSwitchScenario,
  onOpenFullContract,
  onGoHome,
}) => {
  const { outcome } = scenario;
  const [animatedScore, setAnimatedScore] = useState(0);

  const otherScenario = SCENARIOS.find((s) => s.id !== scenario.id) ?? SCENARIOS[0];

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setAnimatedScore(outcome.safetyIndex);
      return;
    }

    setAnimatedScore(0);
    const target = outcome.safetyIndex;
    const duration = 1100;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [outcome.safetyIndex, scenario.id]);

  const isReject = outcome.verdictType === 'reject';

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header & Completed Pipeline */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500">
            Итог миссии · {scenario.channelTag}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {scenario.title}
          </h1>
        </div>
        <button
          type="button"
          onClick={onOpenFullContract}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
        >
          <FileText className="h-4 w-4 text-[#1B3A6B]" aria-hidden="true" />
          <span>Полный текст договора</span>
        </button>
      </div>

      <div className="mt-5">
        <AgentPipeline
          variant="workspace"
          activeAgentIds={[]}
          completedAgentIds={[
            'analyst',
            'lawyer',
            'balance',
            'antagonist',
            'critic',
            'enhancer',
          ]}
        />
      </div>

      {/* Top Grid: Animated Safety Index + Verdict Reveal */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5"
        >
          <div>
            <div className="text-xs font-semibold text-slate-500">
              Индекс безопасности договора
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span
                className={`font-mono text-5xl font-bold tabular-nums sm:text-6xl ${
                  isReject ? 'text-red-600' : 'text-amber-600'
                }`}
              >
                {animatedScore}
              </span>
              <span className="font-mono text-xl font-medium tabular-nums text-slate-400">
                /100
              </span>
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isReject ? 'bg-red-600' : 'bg-amber-500'
                }`}
                style={{ width: `${animatedScore}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>Критичных угроз: {outcome.criticalRisks.length}</span>
            <span>Средних: {outcome.mediumRisks.length}</span>
            <span>Незначительных: {outcome.minorRisks.length}</span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className={`flex flex-col justify-between rounded-xl border p-6 lg:col-span-7 ${
            isReject
              ? 'border-red-200 bg-red-50/70'
              : 'border-amber-200 bg-amber-50/70'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              {isReject ? (
                <XCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
              )}
              <span>Вердикт Улучшателя</span>
            </div>

            <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              {outcome.verdictTitle}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-800">
              {outcome.verdictExplanation}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
            <button
              type="button"
              onClick={() => onSwitchScenario(otherScenario.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1B3A6B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#142D54] whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
            >
              <span>Разобрать: {otherScenario.shortLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Пройти заново</span>
            </button>
          </div>
        </motion.section>
      </div>

      {/* Critic's Risk Prioritization */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[#1B3A6B]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">
            Карта рисков от агента «Критик»
          </h2>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* Critical */}
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
            <div className="text-sm font-bold text-red-800">
              🔴 Критические (нельзя подписывать)
            </div>
            <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-800">
              {outcome.criticalRisks.map((risk, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-mono text-xs font-semibold tabular-nums text-red-700 mt-0.5">
                    {idx + 1})
                  </span>
                  <span>{risk}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Medium */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <div className="text-sm font-bold text-amber-800">
              🟠 Средние (нужно исправить)
            </div>
            <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-800">
              {outcome.mediumRisks.map((risk, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-mono text-xs font-semibold tabular-nums text-amber-700 mt-0.5">
                    {idx + 1})
                  </span>
                  <span>{risk}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Minor */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="text-sm font-bold text-emerald-800">
              🟢 Незначительные
            </div>
            <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-800">
              {outcome.minorRisks.map((risk, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-mono text-xs font-semibold tabular-nums text-emerald-700 mt-0.5">
                    {idx + 1})
                  </span>
                  <span>{risk}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.section>

      {/* Enhancer Concrete Fixes */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#1B3A6B]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-900">Правки Улучшателя</h2>
          </div>
          <span className="text-xs text-slate-500">
            Что добавить в договор перед подписанием
          </span>
        </div>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {outcome.enhancerFixes.map((fix, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 text-sm leading-relaxed text-slate-800"
            >
              <span className="font-mono text-xs font-bold tabular-nums text-[#1B3A6B] mt-0.5">
                0{idx + 1}
              </span>
              <span>{fix}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onGoHome}
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#1B3A6B] cursor-pointer"
          >
            Вернуться на главный экран
          </button>
          <button
            type="button"
            onClick={() => onSwitchScenario(otherScenario.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1B3A6B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#142D54] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
          >
            <span>Перейти ко второму сценарию</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </motion.section>
    </main>
  );
};
