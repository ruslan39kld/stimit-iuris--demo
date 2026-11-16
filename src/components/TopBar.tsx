import React from 'react';
import { SCENARIOS, Scenario } from '../data/scenarios';

interface TopBarProps {
  mode: 'landing' | 'workspace' | 'outcome';
  activeScenarioId?: Scenario['id'];
  onGoHome: () => void;
  onStartScenario: (scenarioId: Scenario['id']) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  mode,
  activeScenarioId,
  onGoHome,
  onStartScenario,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-lg font-extrabold tracking-tight text-[#1B3A6B] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2 rounded"
        >
          STIMIT
        </button>

        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => onScrollToSection('pipeline-section')}
            className="hover:text-[#1B3A6B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] rounded px-1 py-0.5"
          >
            6 агентов
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('stimit-section')}
            className="hover:text-[#1B3A6B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] rounded px-1 py-0.5"
          >
            О проекте
          </button>
          <button
            type="button"
            onClick={() => onStartScenario(SCENARIOS[0].id)}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] rounded px-1 py-0.5 ${
              mode !== 'landing' && activeScenarioId === SCENARIOS[0].id
                ? 'text-[#1B3A6B] font-semibold underline decoration-2 underline-offset-4'
                : 'hover:text-[#1B3A6B]'
            }`}
          >
            Яндекс.Директ
          </button>
          <button
            type="button"
            onClick={() => onStartScenario(SCENARIOS[1].id)}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] rounded px-1 py-0.5 ${
              mode !== 'landing' && activeScenarioId === SCENARIOS[1].id
                ? 'text-[#1B3A6B] font-semibold underline decoration-2 underline-offset-4'
                : 'hover:text-[#1B3A6B]'
            }`}
          >
            Блогер
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          {mode === 'landing' ? (
            <button
              type="button"
              onClick={() => onStartScenario('yandex-direct')}
              className="rounded-lg bg-[#1B3A6B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#142D54] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
            >
              Смотреть пример
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoHome}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B] focus-visible:ring-offset-2"
            >
              На главную
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
