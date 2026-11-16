import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Send,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AGENTS } from '../data/agents';
import {
  AuditStep,
  FREE_INPUT_RESPONSE,
  ReplyOption,
  SCENARIOS,
  Scenario,
} from '../data/scenarios';
import { AgentPipeline } from './AgentPipeline';

interface AuditWorkspaceProps {
  scenario: Scenario;
  showHintBubble: boolean;
  onDismissHint: () => void;
  onSwitchScenario: (scenarioId: Scenario['id']) => void;
  onOpenFullContract: (highlightedClauses: number[]) => void;
  onFinishMission: () => void;
}

interface DialogueEntry {
  id: string;
  kind:
    | 'user-reply'
    | 'system-comment'
    | 'step-findings-summary'
    | 'user-free-input'
    | 'demo-honest-reply';
  stepNumber?: number;
  text: string;
  sectionLabel?: string;
}

export const AuditWorkspace: React.FC<AuditWorkspaceProps> = ({
  scenario,
  showHintBubble,
  onDismissHint,
  onSwitchScenario,
  onOpenFullContract,
  onFinishMission,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedStepCount, setCompletedStepCount] = useState(0);
  const [dialogue, setDialogue] = useState<DialogueEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [mobileTab, setMobileTab] = useState<'contract' | 'agents'>('contract');
  const [freeInput, setFreeInput] = useState('');
  const [flashKey, setFlashKey] = useState(0);

  const timersRef = useRef<number[]>([]);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  const clearPendingTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  // Reset workspace state cleanly whenever scenario changes
  useEffect(() => {
    clearPendingTimers();
    setCurrentStepIndex(0);
    setCompletedStepCount(0);
    setDialogue([]);
    setIsTyping(false);
    setShowAgentDetails(false);
    setMobileTab('contract');
    setFreeInput('');
    setFlashKey((k) => k + 1);
    return () => clearPendingTimers();
  }, [scenario.id]);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [dialogue.length, isTyping, completedStepCount]);

  const isAllStepsDone = completedStepCount >= scenario.steps.length;
  const activeStep: AuditStep =
    scenario.steps[Math.min(currentStepIndex, scenario.steps.length - 1)];

  // Determine which step's agent findings to display in the panel:
  // If user has completed at least 1 step, show latest completed step's findings until next step completes;
  // On initial view (0 completed), show step 1 preview context or prompt to analyze.
  const latestInspectedStep: AuditStep | null =
    completedStepCount > 0 ? scenario.steps[completedStepCount - 1] : null;

  const activeAgentMeta = AGENTS.find(
    (a) => a.id === (latestInspectedStep ? latestInspectedStep.activeAgentId : activeStep.activeAgentId)
  );

  const handleSelectReply = (reply: ReplyOption) => {
    if (isTyping || isAllStepsDone) return;
    if (showHintBubble) onDismissHint();

    const step = activeStep;
    const stepIdx = currentStepIndex;

    // 1. Add user's chosen reply immediately
    setDialogue((prev) => [
      ...prev,
      {
        id: `reply-${step.stepNumber}-${Date.now()}`,
        kind: 'user-reply',
        stepNumber: step.stepNumber,
        sectionLabel: step.sectionLabel,
        text: reply.label,
      },
    ]);

    setIsTyping(true);

    // 2. After typing pause, fly in comment (if alternative) + agent analysis summary
    const t1 = window.setTimeout(() => {
      if (reply.systemComment) {
        setDialogue((prev) => [
          ...prev,
          {
            id: `comment-${step.stepNumber}-${Date.now()}`,
            kind: 'system-comment',
            stepNumber: step.stepNumber,
            text: reply.systemComment!,
          },
        ]);
      }

      const t2 = window.setTimeout(() => {
        setDialogue((prev) => [
          ...prev,
          {
            id: `summary-${step.stepNumber}-${Date.now()}`,
            kind: 'step-findings-summary',
            stepNumber: step.stepNumber,
            sectionLabel: step.sectionLabel,
            text: step.findings.map((f) => `${f.agentLabel}: ${f.text}`).join(' '),
          },
        ]);

        setIsTyping(false);
        setCompletedStepCount(stepIdx + 1);
        setFlashKey((k) => k + 1);

        if (stepIdx + 1 < scenario.steps.length) {
          setCurrentStepIndex(stepIdx + 1);
        }
      }, reply.systemComment ? 420 : 120);

      timersRef.current.push(t2);
    }, 450);

    timersRef.current.push(t1);
  };

  const handleSubmitFreeInput = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = freeInput.trim();
    if (!trimmed || isTyping) return;
    if (showHintBubble) onDismissHint();

    setFreeInput('');
    setDialogue((prev) => [
      ...prev,
      {
        id: `free-${Date.now()}`,
        kind: 'user-free-input',
        text: trimmed,
      },
    ]);

    setIsTyping(true);
    const t = window.setTimeout(() => {
      setDialogue((prev) => [
        ...prev,
        {
          id: `demo-reply-${Date.now()}`,
          kind: 'demo-honest-reply',
          text: FREE_INPUT_RESPONSE,
        },
      ]);
      setIsTyping(false);
    }, 420);
    timersRef.current.push(t);
  };

  const displayedStepNumber = Math.min(currentStepIndex + 1, scenario.steps.length);
  const progressPercent = (completedStepCount / scenario.steps.length) * 100;

  const pipelineActiveIds = isAllStepsDone
    ? (['critic', 'enhancer'] as const)
    : activeStep.activeAgentIdsInPipeline;

  const pipelineCompletedIds = isAllStepsDone
    ? (['analyst', 'lawyer', 'balance', 'antagonist'] as const)
    : activeStep.completedAgentIdsInPipeline;

  const visibleClauses = scenario.clauses.filter((c) =>
    activeStep.clauseNumbers.includes(c.number)
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Workspace Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="font-mono font-semibold tabular-nums text-[#1B3A6B]">
              Шаг {displayedStepNumber} из {scenario.steps.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>{scenario.channelTag}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{scenario.budgetSummary}</span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {scenario.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenFullContract(activeStep.clauseNumbers)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
          >
            <FileText className="h-4 w-4 text-[#1B3A6B]" aria-hidden="true" />
            <span>Полный текст договора</span>
          </button>
        </div>
      </div>

      {/* Step Progress Line */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#1B3A6B] transition-all duration-300"
          style={{ width: `${Math.max(progressPercent, isAllStepsDone ? 100 : 8)}%` }}
        />
      </div>

      {/* 6-Agent Pipeline Status */}
      <div className="mt-4">
        <AgentPipeline
          variant="workspace"
          activeAgentIds={[...pipelineActiveIds]}
          completedAgentIds={[...pipelineCompletedIds]}
        />
      </div>

      {/* First-Visit Hint Bubble */}
      <AnimatePresence>
        {showHintBubble && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[#1B3A6B]/25 bg-[#1B3A6B]/[0.06] px-4 py-3 text-sm text-[#1B3A6B]"
          >
            <p className="font-medium leading-snug">
              Вы — заказчик. Читайте договор по шагам, выбирайте реплики и смотрите, как думают
              агенты.
            </p>
            <button
              type="button"
              onClick={onDismissHint}
              aria-label="Скрыть подсказку"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#1B3A6B]/70 transition-colors hover:bg-[#1B3A6B]/10 hover:text-[#1B3A6B] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Tab Switcher: Договор / Агенты */}
      <div className="mt-5 flex items-center gap-1 rounded-lg bg-slate-200/75 p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab('contract')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            mobileTab === 'contract'
              ? 'bg-white text-[#1B3A6B] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Договор
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('agents')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            mobileTab === 'agents'
              ? 'bg-white text-[#1B3A6B] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Агенты ({completedStepCount}/{scenario.steps.length})
        </button>
      </div>

      {/* Main Split Workspace */}
      <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Contract & Interactive Dialogue */}
        <section
          aria-label="Разбор договора по шагам"
          className={`lg:col-span-7 space-y-4 ${
            mobileTab === 'contract' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Context Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-semibold text-slate-500">Вводная ситуация</div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-800 sm:text-base">
              {scenario.entryContext}
            </p>
          </div>

          {/* Dialogue History Stream */}
          {dialogue.length > 0 && (
            <div className="space-y-3">
              {dialogue.map((entry) => {
                if (entry.kind === 'user-reply' || entry.kind === 'user-free-input') {
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[88%] rounded-xl bg-[#1B3A6B] px-4 py-3 text-sm leading-relaxed text-white">
                        {entry.stepNumber && (
                          <div className="mb-1 text-[11px] font-medium text-blue-200">
                            Вы (заказчик) · Шаг {entry.stepNumber}
                          </div>
                        )}
                        <p>{entry.text}</p>
                      </div>
                    </motion.div>
                  );
                }

                if (entry.kind === 'system-comment') {
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[92%] rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-slate-800">
                        <div className="mb-1 text-xs font-semibold text-amber-800">
                          Комментарий системы
                        </div>
                        <p>{entry.text}</p>
                      </div>
                    </motion.div>
                  );
                }

                if (entry.kind === 'demo-honest-reply') {
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[92%] rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800">
                        <p className="font-medium">{entry.text}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {SCENARIOS.map((sc) => (
                            <button
                              key={sc.id}
                              type="button"
                              onClick={() => onSwitchScenario(sc.id)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                sc.id === scenario.id
                                  ? 'border-[#1B3A6B] bg-[#1B3A6B]/10 text-[#1B3A6B]'
                                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {sc.shortLabel}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex justify-start"
                  >
                    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Шаг {entry.stepNumber} завершён ({entry.sectionLabel}):
                      </span>{' '}
                      находки агентов обновлены в панели анализа.
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-500">
                <span className="inline-flex gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: '0.3s' }}
                  />
                </span>
                <span>печатает…</span>
              </div>
            </div>
          )}

          {/* Current Active Contract Step & Reply Options */}
          {!isAllStepsDone && !isTyping && (
            <motion.div
              key={`step-card-${scenario.id}-${activeStep.stepNumber}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#1B3A6B]">
                  {activeStep.sectionLabel}
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  Шаг {activeStep.stepNumber} / {scenario.steps.length}
                </span>
              </div>

              {/* Relevant Full Clauses */}
              <div className="mt-3 space-y-2.5 rounded-lg border border-slate-200/80 bg-[#F8FAFC] p-4">
                {visibleClauses.map((clause) => (
                  <p key={clause.number} className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    <span className="font-mono font-semibold text-slate-800 mr-1.5">
                      {clause.number}. {clause.title}.
                    </span>
                    {clause.text}
                  </p>
                ))}
              </div>

              {/* Screen Quote Highlight (without thick left border cliché) */}
              <div className="mt-4 rounded-lg border border-[#1B3A6B]/20 bg-[#1B3A6B]/[0.04] p-4">
                <div className="text-xs font-semibold text-[#1B3A6B]">Ключевая цитата раздела</div>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-900">
                  «{activeStep.quote}»
                </p>
              </div>

              {/* Reply Choices — clicking advances step directly (no separate Next button) */}
              <div className="mt-5">
                <div className="mb-2.5 text-xs font-medium text-slate-500">
                  Выберите вашу реплику заказчика:
                </div>
                <div className="flex flex-col gap-2.5">
                  {activeStep.replies.map((reply) => (
                    <button
                      key={reply.id}
                      type="button"
                      onClick={() => handleSelectReply(reply)}
                      className={`group flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] ${
                        reply.isPrimary
                          ? 'border-[#1B3A6B]/35 bg-white text-slate-900 hover:border-[#1B3A6B] hover:bg-[#1B3A6B]/[0.04]'
                          : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      <span>{reply.label}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#1B3A6B]"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* After Step 5: Critic & Enhancer finish, show single clear CTA to Final Outcome */}
          {isAllStepsDone && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-[#1B3A6B]/25 bg-white p-6 shadow-xs"
            >
              <div className="text-xs font-semibold text-[#1B3A6B]">
                Конвейер завершён · Критик и Улучшатель готовы
              </div>
              <h2 className="mt-1.5 text-lg font-bold text-slate-900">
                Все 5 этапов проверки пройдены
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Критик собрал и приоритизировал риски, а Улучшатель подготовил список правок и
                финальный вердикт по договору.
              </p>
              <button
                type="button"
                onClick={onFinishMission}
                className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#1B3A6B] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#142D54] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
              >
                <span>Смотреть итог миссии</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          )}

          {/* Free-form input (demo stand honest answer) */}
          <form
            onSubmit={handleSubmitFreeInput}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2"
          >
            <input
              type="text"
              value={freeInput}
              onChange={(e) => setFreeInput(e.target.value)}
              placeholder="Задать свой вопрос или вставить пункт договора…"
              aria-label="Свободный ввод вопроса"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!freeInput.trim() || isTyping}
              aria-label="Отправить сообщение"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-[#1B3A6B] hover:text-white disabled:opacity-40 disabled:hover:bg-slate-100 disabled:hover:text-slate-700 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div ref={bottomAnchorRef} />
        </section>

        {/* Right Column: Compact Agent Panel + Expandable "Подробнее: как думали агенты" */}
        <aside
          aria-label="Панель работы AI-агентов"
          className={`lg:col-span-5 lg:sticky lg:top-20 space-y-4 ${
            mobileTab === 'agents' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  {latestInspectedStep
                    ? `Работа агентов · Шаг ${latestInspectedStep.stepNumber}`
                    : 'Текущий агент на старте'}
                </div>
                <h2 className="mt-0.5 text-base font-bold text-slate-900">
                  {isAllStepsDone
                    ? 'Критик и Улучшатель'
                    : activeAgentMeta?.name || 'Аналитик договора'}
                </h2>
              </div>
              <span className="font-mono text-xs font-semibold tabular-nums text-[#1B3A6B]">
                {completedStepCount}/{scenario.steps.length}
              </span>
            </div>

            {!latestInspectedStep ? (
              <div className="mt-4 rounded-lg border border-slate-200/80 bg-[#F8FAFC] p-4 text-sm leading-relaxed text-slate-600">
                Выберите первую реплику в диалоге слева — агенты разберут раздел договора и
                покажут скрытые риски и лазейки подрядчика.
              </div>
            ) : (
              <div key={flashKey} className="mt-4 space-y-2.5">
                {latestInspectedStep.compactSummaryFields.map((field) => {
                  const toneClasses =
                    field.tone === 'danger'
                      ? 'text-red-700'
                      : field.tone === 'warning'
                        ? 'text-amber-700'
                        : 'text-slate-900';

                  return (
                    <div
                      key={field.key}
                      className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 animate-field-flash"
                    >
                      <div className="text-xs text-slate-500">{field.label}</div>
                      <div className={`mt-0.5 text-sm font-semibold leading-snug ${toneClasses}`}>
                        {field.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Expandable Full Agent Reasoning */}
            {latestInspectedStep && (
              <div className="mt-4 border-t border-slate-100 pt-3.5">
                <button
                  type="button"
                  onClick={() => {
                    if (showHintBubble) onDismissHint();
                    setShowAgentDetails((v) => !v);
                  }}
                  aria-expanded={showAgentDetails}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1B3A6B] transition-colors hover:bg-slate-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
                >
                  <span>Подробнее: как думали агенты</span>
                  {showAgentDetails ? (
                    <ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {showAgentDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3">
                        {scenario.steps
                          .slice(0, completedStepCount)
                          .reverse()
                          .map((doneStep) => (
                            <div
                              key={doneStep.stepNumber}
                              className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5"
                            >
                              <div className="text-xs font-bold text-slate-800">
                                Шаг {doneStep.stepNumber} · {doneStep.sectionLabel}
                              </div>
                              <div className="mt-2 space-y-2.5">
                                {doneStep.findings.map((finding, fIdx) => (
                                  <div
                                    key={`${doneStep.stepNumber}-${finding.agentId}-${fIdx}`}
                                    className="rounded-md border border-slate-200/80 bg-white p-2.5"
                                  >
                                    <div className="text-xs font-semibold text-[#1B3A6B]">
                                      {finding.agentLabel}
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-700">
                                      {finding.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};
