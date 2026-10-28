import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  Play, 
  RefreshCw, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Layers,
  BookOpen,
  Info
} from 'lucide-react';
import { executeExperiment, EVALUATION_SCENARIOS } from '../../server/server.mjs';

export const BenchmarkEvaluation: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-diurnal-24h');
  const [experimentResult, setExperimentResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Run experiment on mount or when scenario changes
  const runEvaluation = async (scenarioId: string) => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/experiments/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId }),
      });
      if (res.ok) {
        const data = await res.json();
        setExperimentResult(data);
      } else {
        // Fallback to local deterministic execution
        const data = executeExperiment(scenarioId);
        setExperimentResult(data);
      }
    } catch {
      const data = executeExperiment(scenarioId);
      setExperimentResult(data);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runEvaluation(selectedScenarioId);
  }, [selectedScenarioId]);

  const handleExportCsv = () => {
    window.open(`/api/experiments/export?scenarioId=${selectedScenarioId}&format=csv`, '_blank');
  };

  const handleExportJson = () => {
    window.open(`/api/experiments/export?scenarioId=${selectedScenarioId}&format=json`, '_blank');
  };

  const selectedScenario = EVALUATION_SCENARIOS.find((s) => s.id === selectedScenarioId) || EVALUATION_SCENARIOS[0];

  return (
    <div className="space-y-6">
      
      {/* Header & Scenario Selector */}
      <div className="enterprise-panel p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-violet px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider font-mono">
                Empirical Evaluation (Phase 2.G)
              </span>
              <span className="text-xs text-slate-400">Reproducible Benchmark Traces</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Performance & Carbon Savings Evaluation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Compares standard HPA baseline against Carbon Pilot using identical workload traces, explicit per-pod power assumptions, and verifiable SLO compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090f1d] hover:bg-[#111a2e] border border-[#1e293b] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090f1d] hover:bg-[#111a2e] border border-[#1e293b] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-violet-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Scenario Tabs */}
        <div className="mt-4 pt-3 border-t border-[#1e293b] flex flex-wrap items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold">Evaluation Scenario:</span>
          {EVALUATION_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenarioId(s.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedScenarioId === s.id
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-[#090f1d] text-slate-400 border border-[#1e293b] hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards from Experiment Result */}
      {experimentResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="enterprise-panel p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Net Carbon Avoided</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  {experimentResult.summary.netCarbonAvoidedKg} <span className="text-xs font-normal text-emerald-400 font-mono">kg CO₂e</span>
                </div>
              </div>
              <span className="badge-eco px-2 py-0.5 rounded text-xs font-mono font-bold">
                -{experimentResult.summary.netPercentageAvoided}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Baseline: {experimentResult.summary.baselineTotalEmissionsKg} kg vs Carbon Pilot: {experimentResult.summary.carbonPilotTotalEmissionsKg} kg
            </p>
          </div>

          <div className="enterprise-panel p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Energy Conserved</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  {experimentResult.summary.netEnergySavedKWh} <span className="text-xs font-normal text-cyan-400 font-mono">kWh</span>
                </div>
              </div>
              <span className="badge-info px-2 py-0.5 rounded text-xs font-mono font-bold">
                Saved
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Baseline: {experimentResult.summary.baselineTotalEnergyKWh} kWh vs {experimentResult.summary.carbonPilotTotalEnergyKWh} kWh
            </p>
          </div>

          <div className="enterprise-panel p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">SLO Compliance Rate</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  {experimentResult.summary.sloComplianceRate}%
                </div>
              </div>
              <span className="badge-violet px-2 py-0.5 rounded text-xs font-mono font-bold">
                Guaranteed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              {experimentResult.summary.sloViolationsCount} SLA violations over {experimentResult.totalHours} evaluation hours
            </p>
          </div>

          <div className="enterprise-panel p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Evaluation Trace Duration</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  {experimentResult.totalHours} <span className="text-xs font-normal text-slate-400 font-mono">Hours</span>
                </div>
              </div>
              <span className="badge-warning px-2 py-0.5 rounded text-xs font-mono font-bold">
                Hourly Ticks
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 truncate">
              {selectedScenario.description}
            </p>
          </div>
        </div>
      )}

      {/* Hourly Trace Data Table */}
      {experimentResult && (
        <div className="enterprise-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Trace Data: Standard HPA vs Carbon Pilot Hourly Decisions
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Scenario: {experimentResult.scenarioName}
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090f1d] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#1e293b]">
                <tr>
                  <th className="py-2.5 px-3">Hour</th>
                  <th className="py-2.5 px-3">Workload (RPS)</th>
                  <th className="py-2.5 px-3">Grid Carbon</th>
                  <th className="py-2.5 px-3">Base Pods</th>
                  <th className="py-2.5 px-3">Carbon Pilot</th>
                  <th className="py-2.5 px-3">Target CPU</th>
                  <th className="py-2.5 px-3">P99 Latency</th>
                  <th className="py-2.5 px-3">Emissions Avoided</th>
                  <th className="py-2.5 px-3">Decision Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] font-mono text-slate-300">
                {experimentResult.hourlyTrace.map((row: any) => (
                  <tr key={row.hour} className="hover:bg-[#111a2e]/60 transition-colors">
                    <td className="py-2 px-3 text-slate-400 font-bold font-sans">
                      {row.timestamp}
                    </td>
                    <td className="py-2 px-3 text-white">
                      {row.workloadRps}
                    </td>
                    <td className="py-2 px-3 text-amber-400">
                      {row.carbonIntensityGCO2}g
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {row.standardHpaReplicas}
                    </td>
                    <td className="py-2 px-3 text-emerald-300 font-bold">
                      {row.carbonPilotReplicas} {row.replicasAvoided > 0 && <span className="text-[10px] text-emerald-400 font-normal">(-{row.replicasAvoided})</span>}
                    </td>
                    <td className="py-2 px-3 text-cyan-300">
                      {row.targetCpuPercent}%
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {row.p99LatencyMs}ms <span className="text-slate-500">/ {row.sloCeilingMs}ms</span>
                    </td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">
                      {row.emissionsSavedGrams} gCO₂e
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-slate-400 truncate max-w-xs" title={row.justification}>
                      {row.justification}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Methodology Assumptions Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Math Formulation */}
        <div className="enterprise-panel p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1e293b]">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Mathematical Decision Model</h3>
          </div>
          <div className="p-3 rounded bg-[#050811] border border-[#1e293b] font-mono text-xs text-emerald-300 space-y-1">
            <div>TargetCPU = BaseCPU + (MaxCPU - BaseCPU) × NormalizedCarbon × α</div>
            <div className="text-slate-500">// Guardrail Condition:</div>
            <div className="text-cyan-300">IF (SLO_Ceiling - P99_Latency) ≤ Safety_Margin → TargetCPU = BaseCPU</div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Carbon Pilot tunes target CPU dynamically. When grid electricity is dirty, target utilization safely increases to shed idle pod overhead. The instant latency nears the SLO ceiling, the guardrail immediately reverts CPU thresholds to protect performance.
          </p>
        </div>

        {/* Calculation Assumptions */}
        <div className="enterprise-panel p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1e293b]">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Documented Power & Emissions Assumptions</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <span><strong>Base Pod Overhead:</strong> 40 Watts idle power per container instance (cgroups runtime + kernel memory).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <span><strong>Dynamic CPU Power:</strong> 80 Watts at 100% CPU utilization scaling linearly with observed utilization.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <span><strong>Energy Conversion:</strong> Energy (kWh) = (Watts / 1000) × (Duration / 3600).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
              <span><strong>Emissions Calculation:</strong> Operational Emissions = Energy (kWh) × Grid Carbon Intensity (gCO₂e/kWh).</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
