import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  X, 
  HelpCircle,
  Flame,
  Activity,
  FileSpreadsheet,
  Layers,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface DemoScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

interface DemoStep {
  step: number;
  title: string;
  tabTarget: string;
  actionText: string;
  talkingPoint: string;
  highlightMetric: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Open the Overview Page',
    tabTarget: 'overview',
    actionText: 'Orient the judges to the Carbon Pilot control plane overview.',
    talkingPoint: '"Carbon Pilot is a Kubernetes-native orchestrator that augments standard HPA with grid carbon awareness while strictly safeguarding microservice SLOs."',
    highlightMetric: 'Shows 44.6 kg CO2e/day avoided with 0 SLO breaches.',
  },
  {
    step: 2,
    title: 'Show Current Carbon Intensity & Telemetry Mode',
    tabTarget: 'overview',
    actionText: 'Point to the top right region indicator and the simulated telemetry badge.',
    talkingPoint: '"We evaluate the cluster against real-world grid intensity traces from Electricity Maps (e.g., PJM Virginia at 435 gCO2e/kWh), monitoring Google Online Boutique microservices."',
    highlightMetric: 'Displays current grid fuel mix and active operating mode.',
  },
  {
    step: 3,
    title: 'Launch the Operator Simulator',
    tabTarget: 'simulator',
    actionText: 'Switch to the Operator Simulator to show the closed-loop decision engine.',
    talkingPoint: '"Here is the heart of Carbon Pilot: our closed-loop decision engine running alongside native HPA."',
    highlightMetric: 'Simulator interface with live pod matrix & virtual clock.',
  },
  {
    step: 4,
    title: 'Start a Representative Workload',
    tabTarget: 'simulator',
    actionText: 'Set nominal load at 1200 RPS across the Online Boutique frontend.',
    talkingPoint: '"Under standard load (1200 RPS), standard HPA allocates 10 pods based on a fixed 60% CPU target."',
    highlightMetric: 'Initial state: 10 baseline pods at 60% CPU utilization.',
  },
  {
    step: 5,
    title: 'Demonstrate Standard HPA Behavior',
    tabTarget: 'simulator',
    actionText: 'Toggle scaling mode to "Standard HPA (Static 60% CPU)".',
    talkingPoint: '"Notice that standard HPA is carbon-blind. Even when electricity on the grid is heavily powered by coal and gas, it maintains static replica headroom."',
    highlightMetric: 'Shows constant 60% target regardless of carbon intensity.',
  },
  {
    step: 6,
    title: 'Switch to Carbon-Aware Mode',
    tabTarget: 'simulator',
    actionText: 'Click "Carbon Pilot (Dynamic)" using the identical workload trace.',
    talkingPoint: '"Now we activate Carbon Pilot. With the same 1200 RPS workload, our reconciler detects high grid emissions and safe latency margin, raising target CPU to consolidate surplus pods."',
    highlightMetric: 'Safe downscale from 10 -> 8 pods, avoiding idle power.',
  },
  {
    step: 7,
    title: 'Introduce a Changing Carbon Intensity Profile',
    tabTarget: 'simulator',
    actionText: 'Click the "Evening Carbon Surge (580g)" preset button.',
    talkingPoint: '"Watch what happens when renewable wind drops and grid carbon surges to 580 gCO2e/kWh. Carbon Pilot increases consolidation aggressiveness (alpha=0.75)."',
    highlightMetric: 'Target CPU dynamically tunes to 78%, trimming 2-3 surplus pods.',
  },
  {
    step: 8,
    title: 'Verify Non-Negotiable SLO Guardrails',
    tabTarget: 'simulator',
    actionText: 'Point to the 6-point Decision Explanation Trace panel.',
    talkingPoint: '"Every decision is auditable. If P99 latency approaches our 150ms SLO ceiling within our 25ms safety margin, the guardrail triggers immediately."',
    highlightMetric: 'Shows Latency Slack buffer and mathematical justification.',
  },
  {
    step: 9,
    title: 'Surge Workload to Prove Performance Priority',
    tabTarget: 'simulator',
    actionText: 'Click "Flash Traffic Surge (2800 RPS)" to stress test capacity.',
    talkingPoint: '"When traffic surges to 2800 RPS, performance is non-negotiable! Carbon Pilot immediately suspends eco-tuning, restores base CPU thresholds, and scales pods up to protect latency."',
    highlightMetric: 'Replicas instantly scale up from 8 -> 24 pods. Zero SLA violations!',
  },
  {
    step: 10,
    title: 'Compare Baseline vs Optimized Emissions',
    tabTarget: 'dashboard',
    actionText: 'Switch to the Live Telemetry Dashboard.',
    talkingPoint: '"In our live telemetry dashboard, we observe the continuous 24-hour differential: 254.1 kWh consumed versus 348.5 kWh baseline, a net 31.2% carbon reduction."',
    highlightMetric: 'Real-time SVG curves and microservice fleet status table.',
  },
  {
    step: 11,
    title: 'Inspect Evaluation Results & Export Experiment',
    tabTarget: 'evaluation',
    actionText: 'Open the Evaluation Results page and click "Export CSV".',
    talkingPoint: '"We provide reproducible benchmark datasets across diurnal, spike, and surge scenarios with one-click exportable CSV/JSON reports for academic evaluation."',
    highlightMetric: 'Downloadable experiment report with hourly traces and summary.',
  },
];

export const DemoScriptModal: React.FC<DemoScriptModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setActiveTab(DEMO_STEPS[nextIdx].tabTarget);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      setActiveTab(DEMO_STEPS[prevIdx].tabTarget);
    }
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setActiveTab(DEMO_STEPS[idx].tabTarget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="enterprise-panel max-w-2xl w-full p-6 space-y-5 shadow-2xl border-cyan-500/40">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Hackathon Demonstration Script & Flow
              </h3>
              <span className="text-[11px] text-slate-400">
                11-Step Guided Evaluation Sequence (Phase 8 Specification)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => handleJumpToStep(idx)}
              className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-colors cursor-pointer ${
                currentStepIdx === idx
                  ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
                  : currentStepIdx > idx
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            >
              {s.step}
            </button>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="p-4 rounded-xl enterprise-subtle space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="badge-info px-2.5 py-0.5 rounded text-xs font-mono font-bold">
              Step {currentStep.step} of 11: {currentStep.title}
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              Target Tab: <strong className="text-cyan-400">{currentStep.tabTarget}</strong>
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              What to Demonstrate:
            </span>
            <p className="text-xs text-white leading-relaxed font-medium">
              {currentStep.actionText}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#070c18] border border-[#1e293b]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              What to Say to Judges / Audience:
            </span>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {currentStep.talkingPoint}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span><strong>Expected Observation: </strong>{currentStep.highlightMetric}</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1527] border border-[#1e293b] text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <div className="text-xs font-mono text-slate-400">
            Step {currentStep.step} / {DEMO_STEPS.length}
          </div>

          {currentStepIdx < DEMO_STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
            >
              <span>Next Demo Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Walkthrough</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
