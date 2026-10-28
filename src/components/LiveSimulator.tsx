import React, { useState, useEffect } from 'react';
import { GridRegion, MicroserviceDeployment, ReconcilerEvent } from '../types';
import { 
  Activity, 
  Flame, 
  TrendingDown, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  RefreshCw, 
  Zap, 
  Boxes, 
  Play, 
  Pause, 
  Terminal,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface LiveSimulatorProps {
  activeRegion: GridRegion;
  microservices: MicroserviceDeployment[];
  onUpdateServices: (services: MicroserviceDeployment[]) => void;
  isSimulating: boolean;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  activeRegion,
  microservices,
  onUpdateServices,
  isSimulating,
}) => {
  // Simulator State
  const [trafficMultiplier, setTrafficMultiplier] = useState<number>(1.0); // 0.5x to 2.5x
  const [carbonIntensityOverride, setCarbonIntensityOverride] = useState<number>(activeRegion.currentIntensity);
  const [carbonWeightAlpha, setCarbonWeightAlpha] = useState<number>(0.75);
  const [sloCeilingMs, setSloCeilingMs] = useState<number>(150);
  const [safetyMarginMs, setSafetyMarginMs] = useState<number>(25);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('frontend');
  const [events, setEvents] = useState<ReconcilerEvent[]>([]);

  // Sync intensity with active region when changed unless manually overridden
  useEffect(() => {
    setCarbonIntensityOverride(activeRegion.currentIntensity);
  }, [activeRegion]);

  // Selected service
  const currentService = microservices.find((s) => s.id === selectedServiceId) || microservices[0];

  // Simulation Tick Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Calculate new metrics based on sliders
      const effectiveRps = Math.round(currentService.rps * trafficMultiplier);
      
      // Baseline calculation (Standard HPA with fixed 60% CPU target)
      const baseCpuUsage = Math.min(95, Math.max(30, Math.round(55 * trafficMultiplier)));
      const baselinePods = Math.max(
        currentService.minReplicas,
        Math.min(currentService.maxReplicas, Math.ceil((effectiveRps / 120)))
      );
      const baselineLatency = Math.round(65 + (trafficMultiplier * 25));

      // Carbon Pilot calculation:
      // High carbon intensity drives higher CPU target if latency slack permits
      const latencySlack = sloCeilingMs - baselineLatency;
      let targetCpu = 60; // base default
      let isSloRisk = false;

      if (latencySlack <= safetyMarginMs) {
        // Latency at risk: back off to base CPU target
        targetCpu = 60;
        isSloRisk = true;
      } else {
        // Normalize carbon intensity: 100 gCO2 = 0, 600 gCO2 = 1.0
        const normalizedCarbon = Math.min(1.0, Math.max(0.0, (carbonIntensityOverride - 80) / 500));
        const maxBoost = 22; // can raise up to 82%
        targetCpu = Math.round(60 + (maxBoost * normalizedCarbon * carbonWeightAlpha));
      }

      // Replicas under Carbon Pilot
      const carbonPilotPods = Math.max(
        currentService.minReplicas,
        Math.min(baselinePods, Math.ceil(baselinePods * (60 / targetCpu)))
      );

      // Latency increases slightly due to higher CPU utilization, but remains strictly bounded
      const carbonPilotLatency = Math.min(
        sloCeilingMs - 5,
        Math.round(baselineLatency * (1 + ((targetCpu - 60) / 100) * 0.45))
      );

      // Grams CO2 saved per minute = (pods saved) * (watts per pod) * (carbon intensity)
      const podsSaved = Math.max(0, baselinePods - carbonPilotPods);
      const wattsPerPod = 120; // 120 Watts average per containerized microservice instance
      const savedGramsPerMin = Number(
        ((podsSaved * wattsPerPod * (carbonIntensityOverride / 1000) * (60 / 3600))).toFixed(1)
      );

      // Update service list in parent
      const updatedServices = microservices.map((s) => {
        if (s.id === currentService.id) {
          return {
            ...s,
            currentCpuPercent: targetCpu,
            baselineReplicas: baselinePods,
            carbonPilotReplicas: carbonPilotPods,
            baselineLatencyP99: baselineLatency,
            carbonPilotLatencyP99: carbonPilotLatency,
            carbonSavedGramsPerMin: savedGramsPerMin,
            status: (isSloRisk ? 'throttling-safe' : 'optimal') as any,
          };
        }
        return s;
      });
      onUpdateServices(updatedServices);

      // Add a Reconciler Event Log
      const now = new Date().toLocaleTimeString();
      const newEvent: ReconcilerEvent = {
        id: Math.random().toString(),
        timestamp: now,
        service: currentService.name,
        type: isSloRisk ? 'SLO_GUARD_ACTIVE' : podsSaved > 0 ? 'SCALE_DOWN' : 'POLICY_UPDATE',
        severity: isSloRisk ? 'warning' : podsSaved > 0 ? 'success' : 'info',
        message: isSloRisk
          ? `SLO guard activated! Latency margin (${latencySlack}ms) < margin (${safetyMarginMs}ms). Restoring baseline target 60%.`
          : `Reconciled: Target CPU tuned to ${targetCpu}%. Replicas: ${baselinePods} -> ${carbonPilotPods} (Saved ${savedGramsPerMin}g CO2/min).`,
        carbonIntensity: carbonIntensityOverride,
        sloMarginMs: sloCeilingMs - carbonPilotLatency,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, 2500);

    return () => clearInterval(interval);
  }, [
    isSimulating,
    trafficMultiplier,
    carbonIntensityOverride,
    carbonWeightAlpha,
    sloCeilingMs,
    safetyMarginMs,
    selectedServiceId,
    currentService,
    microservices,
  ]);

  // Quick preset triggers
  const triggerCarbonSpike = () => {
    setCarbonIntensityOverride(580);
  };

  const triggerCleanGrid = () => {
    setCarbonIntensityOverride(35);
  };

  const triggerTrafficSurge = () => {
    setTrafficMultiplier(2.2);
  };

  const resetPresets = () => {
    setTrafficMultiplier(1.0);
    setCarbonIntensityOverride(activeRegion.currentIntensity);
    setCarbonWeightAlpha(0.75);
    setSloCeilingMs(150);
  };

  const podsSaved = Math.max(0, currentService.baselineReplicas - currentService.carbonPilotReplicas);
  const carbonPctSaved = Math.round(
    (podsSaved / Math.max(1, currentService.baselineReplicas)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Simulation Control Deck */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Interactive Operator Playground
              </span>
              <span className="text-xs text-slate-400">Live Mathematical Reconciliation Model</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Carbon Pilot vs Baseline HPA Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Adjust grid carbon intensity, service traffic load, and SLO guardrails to observe how Carbon Pilot dynamically consolidates replicas without breaching the latency SLO.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={triggerCarbonSpike}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Dirty Grid (580g)</span>
            </button>
            <button
              onClick={triggerCleanGrid}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Clean Grid (35g)</span>
            </button>
            <button
              onClick={triggerTrafficSurge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-950/40 border border-blue-500/40 text-blue-300 hover:bg-blue-900/60 transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Surge Load (2.2x)</span>
            </button>
            <button
              onClick={resetPresets}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
              title="Reset sliders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          
          {/* Slider 1: Grid Carbon Intensity */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Grid Carbon Intensity
              </span>
              <span className="font-mono font-bold text-amber-400">
                {carbonIntensityOverride} gCO₂/kWh
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="700"
              step="10"
              value={carbonIntensityOverride}
              onChange={(e) => setCarbonIntensityOverride(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Clean (20g)</span>
              <span>Average (300g)</span>
              <span>Dirty (700g)</span>
            </div>
          </div>

          {/* Slider 2: Microservice Traffic Load */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Workload Traffic (RPS)
              </span>
              <span className="font-mono font-bold text-blue-400">
                {(trafficMultiplier * 100).toFixed(0)}% ({Math.round(currentService.rps * trafficMultiplier)} RPS)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={trafficMultiplier}
              onChange={(e) => setTrafficMultiplier(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Low (50%)</span>
              <span>Baseline (100%)</span>
              <span>Peak (250%)</span>
            </div>
          </div>

          {/* Slider 3: Carbon Sensitivity Weight (Alpha) */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Carbon Weight (α)
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {carbonWeightAlpha.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={carbonWeightAlpha}
              onChange={(e) => setCarbonWeightAlpha(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0 (Standard)</span>
              <span>0.5 (Balanced)</span>
              <span>1.0 (Max Eco)</span>
            </div>
          </div>

          {/* Slider 4: SLO Latency Ceiling */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> SLO Latency Ceiling
              </span>
              <span className="font-mono font-bold text-teal-400">
                {sloCeilingMs} ms
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="300"
              step="10"
              value={sloCeilingMs}
              onChange={(e) => setSloCeilingMs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Strict (80ms)</span>
              <span>Standard (150ms)</span>
              <span>Loose (300ms)</span>
            </div>
          </div>

        </div>

        {/* Microservice Selector Pills */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap">
            Target Microservice:
          </span>
          {microservices.map((svc) => (
            <button
              key={svc.id}
              onClick={() => setSelectedServiceId(svc.id)}
              className={`px-3 py-1 rounded-lg font-mono text-xs transition-all whitespace-nowrap ${
                selectedServiceId === svc.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {svc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Head-to-Head Comparison: Baseline Standard HPA vs Carbon Pilot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Standard HPA (Baseline) */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                Standard Baseline
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Native HPA (Static 60% CPU)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Carbon-Blind</span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Target CPU</span>
              <span className="text-xl font-black text-slate-200 mt-0.5 block">60%</span>
              <span className="text-[10px] text-slate-400">Fixed threshold</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Pod Replicas</span>
              <span className="text-xl font-black text-rose-400 mt-0.5 block">
                {currentService.baselineReplicas}
              </span>
              <span className="text-[10px] text-slate-400">Allocated pods</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">P99 Latency</span>
              <span className="text-xl font-black text-blue-400 mt-0.5 block">
                {currentService.baselineLatencyP99} ms
              </span>
              <span className="text-[10px] text-slate-400">&lt; {sloCeilingMs}ms SLO</span>
            </div>
          </div>

          {/* Pod Visualizer */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Active Pod Instances ({currentService.baselineReplicas} Pods Running):
            </span>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-900 min-h-[70px]">
              {Array.from({ length: currentService.baselineReplicas }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-300"
                  title={`Baseline Pod #${i + 1}`}
                >
                  <Boxes className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Baseline Behavior:</span> Standard HPA maintains excess replica headroom even during peak dirty grid hours, emitting unnecessary carbon emissions.
          </div>
        </div>

        {/* Card 2: Carbon Pilot Dynamic HPA */}
        <div className="glass-panel rounded-2xl p-6 border-emerald-500/30 space-y-4 glow-emerald">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Carbon Pilot Managed
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Dynamic Carbon-Aware HPA
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <TrendingDown className="w-4 h-4" />
              <span>-{carbonPctSaved}% Pods</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-[11px] text-slate-400 block">Target CPU</span>
              <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                {currentService.currentCpuPercent}%
              </span>
              <span className="text-[10px] text-emerald-300/80">Tuned dynamically</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-[11px] text-slate-400 block">Pod Replicas</span>
              <span className="text-xl font-black text-white mt-0.5 block">
                {currentService.carbonPilotReplicas}
              </span>
              <span className="text-[10px] text-emerald-400">
                {podsSaved > 0 ? `-${podsSaved} pods trimmed` : 'Optimal'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-[11px] text-slate-400 block">P99 Latency</span>
              <span className="text-xl font-black text-teal-300 mt-0.5 block">
                {currentService.carbonPilotLatencyP99} ms
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Safe Margin
              </span>
            </div>
          </div>

          {/* Pod Visualizer */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Carbon-Optimized Instances ({currentService.carbonPilotReplicas} Active):
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                Saved {currentService.carbonSavedGramsPerMin} gCO₂/min
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 min-h-[70px]">
              {Array.from({ length: currentService.carbonPilotReplicas }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-[10px] font-mono text-emerald-300"
                  title={`Active Eco Pod #${i + 1}`}
                >
                  <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              ))}
              {/* Ghost / Saved Pods */}
              {Array.from({ length: podsSaved }).map((_, i) => (
                <div
                  key={`saved-${i}`}
                  className="w-7 h-7 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center text-[10px] font-mono text-emerald-500/50"
                  title={`Avoided Pod #${i + 1} (Emissions prevented)`}
                >
                  <span className="text-[9px]">Eco</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SLO Guardrail: {sloCeilingMs - currentService.carbonPilotLatencyP99}ms buffer before ceiling.
            </span>
            <span className="font-mono text-[11px] font-bold text-white">
              0 Violations
            </span>
          </div>
        </div>

      </div>

      {/* Live Reconciler Audit Log Stream */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Operator Controller Reconciliation Log Feed (Live Event Stream)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Target: {currentService.name} • Controller: carbonpolicy-controller
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs space-y-2 max-h-56 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-slate-500 italic">Waiting for initial operator tick...</div>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3">
                <span className="text-slate-500 flex-shrink-0">[{evt.timestamp}]</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold flex-shrink-0 ${
                    evt.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-300'
                      : evt.severity === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {evt.type}
                </span>
                <span className="text-slate-300">{evt.message}</span>
                <span className="ml-auto text-[10px] text-slate-500 hidden sm:inline flex-shrink-0">
                  SLO Margin: {evt.sloMarginMs}ms
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
