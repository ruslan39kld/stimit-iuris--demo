import React from 'react';
import { ArrowRight, FileText, ShieldAlert, Scale } from 'lucide-react';
import { AGENTS, STIMIT_PROJECT_BLOCK } from '../data/agents';
import { SCENARIOS, Scenario } from '../data/scenarios';
import { AgentPipeline } from './AgentPipeline';

interface LandingViewProps {
  onStartScenario: (scenarioId: Scenario['id']) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartScenario }) => {
  const primaryScenario = SCENARIOS[0];
  const secondaryScenario = SCENARIOS[1];

  return (
    <main>
      {/* Top Dark-Blue Gradient Hero Block (STIMIT style) */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(145deg, #1B3A6B 0%, #12284D 55%, #0B1B36 100%)',
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-wide text-blue-200/90">
              Интерактивный стенд агентной AI-системы · STIMIT
            </p>
            <h1 className="mt-3 text-balance font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-[1.12]">
              Подписать договор с подрядчиком — или вас разведут?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
              Шесть AI-агентов разбирают рекламный договор: находят ловушки, показывают, как вас
              могут обмануть, и выносят вердикт.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onStartScenario(primaryScenario.id)}
                className="inline-flex items-center gap-2.5 rounded-lg bg-white px-6 py-3.5 text-base font-bold text-[#1B3A6B] shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B3A6B]"
              >
                <span>Смотреть пример</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-sm text-blue-100/80">
                Сценарий 1 · {primaryScenario.title}
              </span>
            </div>
          </div>

          <div className="mt-12">
            <AgentPipeline variant="hero" />
          </div>
        </div>
      </section>

      {/* Second Row: Scenarios Selection */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Выберите договор для разбора
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
              Вы выступаете в роли заказчика. Читайте разделы, выбирайте реплики и проверяйте выводы агентов.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Scenario 2 featured as second-row card + Scenario 1 card */}
          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1B3A6B]/30 hover:shadow-md">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span>Сценарий 1</span>
                <span aria-hidden="true">·</span>
                <span>{primaryScenario.channelTag}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{primaryScenario.budgetSummary}</span>
              </div>
              <h3 className="mt-2.5 text-xl font-bold text-slate-900">
                {primaryScenario.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                {primaryScenario.cardPreview}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <FileText className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>7 разделов · 5 шагов разбора</span>
              </div>
              <button
                type="button"
                onClick={() => onStartScenario(primaryScenario.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1B3A6B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#142D54] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
              >
                <span>Разобрать</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1B3A6B]/30 hover:shadow-md">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span>Сценарий 2</span>
                <span aria-hidden="true">·</span>
                <span>{secondaryScenario.channelTag}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{secondaryScenario.budgetSummary}</span>
              </div>
              <h3 className="mt-2.5 text-xl font-bold text-slate-900">
                {secondaryScenario.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                {secondaryScenario.cardPreview}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <FileText className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>9 разделов · 5 шагов разбора</span>
              </div>
              <button
                type="button"
                onClick={() => onStartScenario(secondaryScenario.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#1B3A6B] bg-white px-4 py-2 text-sm font-semibold text-[#1B3A6B] transition-colors hover:bg-[#1B3A6B] hover:text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
              >
                <span>Проверить блогера</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 6 Sequential Agents Architecture */}
      <section id="pipeline-section" className="border-y border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Как работают 6 агентов
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Агенты запускаются строго последовательно, а их зоны ответственности не смешиваются:
              от структуры сделки до моделирования уловок подрядчика и итоговых правок.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 transition-colors hover:border-slate-300"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-xs font-semibold tabular-nums text-[#1B3A6B]">
                      {agent.order}.
                    </span>
                    <span className="text-xs text-slate-500">{agent.role}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{agent.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{agent.focus}</p>
                </div>
                <p className="mt-4 border-t border-slate-200/80 pt-3 text-xs leading-relaxed text-slate-500">
                  {agent.boundary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STIMIT Project Showcase Block */}
      <section id="stimit-section" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold text-[#1B3A6B]">
              Раздел «Проекты» · Методология STIMIT
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {STIMIT_PROJECT_BLOCK.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {STIMIT_PROJECT_BLOCK.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:border-slate-200 lg:pl-8 lg:pt-0">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <ShieldAlert className="h-4 w-4 shrink-0 text-[#1B3A6B]" aria-hidden="true" />
              <span>Поиск ловушек в Яндекс.Директ, Telegram Ads, VK и RuTube</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Scale className="h-4 w-4 shrink-0 text-[#1B3A6B]" aria-hidden="true" />
              <span>Автономный статический стенд без внешних API</span>
            </div>
            <button
              type="button"
              onClick={() => onStartScenario(primaryScenario.id)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B3A6B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#142D54] whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
            >
              <span>Запустить демонстрацию</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>STIMIT · AI-юрист по рекламным договорам</span>
          <span>Демонстрационный стенд со встроенными сценариями</span>
        </div>
      </footer>
    </main>
  );
};
