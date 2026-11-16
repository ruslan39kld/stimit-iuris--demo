import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Scenario } from '../data/scenarios';

interface ContractModalProps {
  isOpen: boolean;
  scenario: Scenario;
  highlightedClauses?: number[];
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  scenario,
  highlightedClauses = [],
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div className="min-w-0">
            <h2
              id="contract-modal-title"
              className="truncate text-lg font-bold text-slate-900"
            >
              Полный текст договора
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {scenario.title} · {scenario.clauses.length} разделов
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно с текстом договора"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {scenario.clauses.map((clause) => {
            const isHighlighted = highlightedClauses.includes(clause.number);
            return (
              <div
                key={clause.number}
                className={`rounded-lg border p-4 transition-colors ${
                  isHighlighted
                    ? 'border-[#1B3A6B]/40 bg-[#1B3A6B]/[0.04]'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    <span className="font-mono text-[#1B3A6B] tabular-nums mr-1.5">
                      {clause.number}.
                    </span>
                    {clause.title}
                  </h3>
                  {isHighlighted && (
                    <span className="text-xs font-medium text-[#1B3A6B]">
                      Разбирается сейчас
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{clause.text}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#1B3A6B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#142D54] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A6B]"
          >
            Вернуться к разбору
          </button>
        </div>
      </div>
    </div>
  );
};
