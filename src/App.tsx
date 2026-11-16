/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { SCENARIOS, Scenario } from './data/scenarios';
import { TopBar } from './components/TopBar';
import { LandingView } from './components/LandingView';
import { AuditWorkspace } from './components/AuditWorkspace';
import { MissionOutcome } from './components/MissionOutcome';
import { ContractModal } from './components/ContractModal';

type ViewMode = 'landing' | 'workspace' | 'outcome';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeScenarioId, setActiveScenarioId] = useState<Scenario['id']>('yandex-direct');
  const [replayVersion, setReplayVersion] = useState(0);
  const [showHintBubble, setShowHintBubble] = useState(true);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [highlightedClauses, setHighlightedClauses] = useState<number[]>([]);

  const activeScenario =
    SCENARIOS.find((s) => s.id === activeScenarioId) ?? SCENARIOS[0];

  const handleStartScenario = (scenarioId: Scenario['id']) => {
    setActiveScenarioId(scenarioId);
    setReplayVersion((v) => v + 1);
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    if (viewMode !== 'landing') {
      setViewMode('landing');
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenFullContract = (clauses: number[] = []) => {
    setHighlightedClauses(clauses);
    setContractModalOpen(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
        <TopBar
          mode={viewMode}
          activeScenarioId={viewMode !== 'landing' ? activeScenarioId : undefined}
          onGoHome={handleGoHome}
          onStartScenario={handleStartScenario}
          onScrollToSection={handleScrollToSection}
        />

        {viewMode === 'landing' && (
          <LandingView onStartScenario={handleStartScenario} />
        )}

        {viewMode === 'workspace' && (
          <AuditWorkspace
            key={`${activeScenario.id}-${replayVersion}`}
            scenario={activeScenario}
            showHintBubble={showHintBubble}
            onDismissHint={() => setShowHintBubble(false)}
            onSwitchScenario={handleStartScenario}
            onOpenFullContract={handleOpenFullContract}
            onFinishMission={() => {
              setViewMode('outcome');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {viewMode === 'outcome' && (
          <MissionOutcome
            scenario={activeScenario}
            onReplay={() => handleStartScenario(activeScenario.id)}
            onSwitchScenario={handleStartScenario}
            onOpenFullContract={() => handleOpenFullContract([])}
            onGoHome={handleGoHome}
          />
        )}

        <ContractModal
          isOpen={contractModalOpen}
          scenario={activeScenario}
          highlightedClauses={highlightedClauses}
          onClose={() => setContractModalOpen(false)}
        />
      </div>
    </MotionConfig>
  );
}
