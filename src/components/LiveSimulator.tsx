import React, { useState, useEffect } from 'react';
import { GridRegion, MicroserviceDeployment, ReconcilerEvent } from '../types';
import {
  evaluateScalingPolicy,
  computeComparativeSavings,
} from '../../server/engine.mjs';
import { 
  Activity, 
  Flame, 
  TrendingDown, 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  RefreshCw, 
  Zap, 
  Boxes, 
  Play, 
  Pause, 
  StepForward,
  Terminal,
  CheckCircle2,
  Clock,
  Info,
  Scale
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
  const [trafficRps, setTrafficRps] = useState<number>(1200);
  const [carbonIntensity, setCarbonIntensity] = useState<number>(activeRegion.currentIntensity);
  const [carbonWeightAlpha, setCarbonWeightAlpha] = useState<number>(0.75);
  const [baseCpuTarget, setBaseCpuTarget] = useState<number>(60);
  const [maxCpuTarget, setMaxCpuTarget] = useState<number>(80);
  const [sloCeilingMs, setSloCeilingMs] = useState<number>(150);
  const [safetyMarginMs, setSafetyMarginMs] = useState<number>(25);
  const [minReplicas, setMinReplicas] = useState<number>(3);
  const [maxReplicas, setMaxReplicas] = useState<number>(30);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(30);
  const [scalingMode, setScalingMode] = useState<'carbon-aware' | 'standard-hpa'>('carbon-aware');
  
  // Selected microservice
  const [selectedServiceId, setSelectedServiceId] = useState<string>('frontend');
  const currentService = microservices.find((s) => s.id === selectedServiceId) || microservices[0];

  // Simulation Clock and Step Tracking
  const [virtualHour, setVirtualHour] = useState<number>(14);
  const [virtualMinute, setVirtualMinute] = useState<number>(30);
  const [tickCount, setTickCount] = useState<number>(1);
  const [lastScaleTimestamp, setLastScaleTimestamp] = useState<number>(Date.now() - 45000);
  const [currentReplicas, setCurrentReplicas] = useState<number>(10);
  const [events, setEvents] = useState<ReconcilerEvent[]>([]);
  const [latestExplanationTrace, setLatestExplanationTrace] = useState<any>(null);

  // Sync intensity with region when changed unless manually overridden
  useEffect(() => {
    setCarbonIntensity(activeRegion.currentIntensity);
  }, [activeRegion]);

  // Execute single decision step
  const executeStep = () => {
    // Determine live latency based on workload vs replica capacity
    const nominalRpsPerPod = 120;
    const capacityRatio = trafficRps / (Math.max(1, currentReplicas) * nominalRpsPerPod);
    const measuredP99 = Math.round(50 + (capacityRatio * 65));

    const activePolicy = {
      baseCpuThreshold: baseCpuTarget,
      maxAllowedCpuThreshold: maxCpuTarget,
      carbonWeightAlpha: scalingMode === 'carbon-aware' ? carbonWeightAlpha : 0, // alpha=0 behaves like standard HPA!
      sloLatencyCeilingMs: sloCeilingMs,
      safetyMarginMs,
      minReplicas,
      maxReplicas,
      cooldownSeconds,
      nominalRpsPerReplica: nominalRpsPerPod,
    };

    const decision = evaluateScalingPolicy({
      currentRps: trafficRps,
      currentReplicas,
      currentLatencyP99: measuredP99,
      carbonIntensity,
      policy: activePolicy,
      lastScaleTimestamp,
      now: Date.now(),
    });

    setLatestExplanationTrace(decision.explanationTrace);

    // Apply replica change
    if (decision.targetReplicas !== currentReplicas) {
      setCurrentReplicas(decision.targetReplicas);
      setLastScaleTimestamp(Date.now());
    }

    // Update parent microservices state for consistency
    const updatedServices = microservices.map((s) => {
      if (s.id === currentService.id) {
        return {
          ...s,
          rps: trafficRps,
          currentCpuPercent: decision.targetCpuThreshold,
          baselineReplicas: decision.baselineReplicas,
          carbonPilotReplicas: decision.targetReplicas,
          baselineLatencyP99: Math.round(measuredP99 * 0.95),
          carbonPilotLatencyP99: decision.explanationTrace.sloGuardrailCheck.estimatedLatencyP99,
          carbonSavedGramsPerMin: decision.explanationTrace.energyEmissionsImpact.carbonSavedGramsPerMin,
          status: (decision.guardrailActive ? 'throttling-safe' : 'optimal') as any,
        };
      }
      return s;
    });
    onUpdateServices(updatedServices);

    // Increment virtual clock
    setVirtualMinute((prev) => {
      const nextMin = (prev + 5) % 60;
      if (nextMin === 0) {
        setVirtualHour((h) => (h + 1) % 24);
      }
      return nextMin;
    });
    setTickCount((t) => t + 1);

    // Append event to reconciler log
    const timeStr = `${String(virtualHour).padStart(2, '0')}:${String(virtualMinute).padStart(2, '0')}`;
    const newEvent: ReconcilerEvent = {
      id: Math.random().toString(),
      timestamp: timeStr,
      service: currentService.name,
      type: decision.guardrailActive 
        ? 'SLO_GUARD_ACTIVE' 
        : decision.decisionAction === 'SCALE_DOWN'
        ? 'SCALE_DOWN'
        : decision.decisionAction === 'SCALE_UP'
        ? 'SCALE_UP'
        : 'POLICY_UPDATE',
      severity: decision.guardrailActive 
        ? 'warning' 
        : decision.decisionAction === 'SCALE_DOWN' 
        ? 'success' 
        : 'info',
      message: decision.reason,
      carbonIntensity,
      sloMarginMs: decision.explanationTrace.sloGuardrailCheck.latencySlackMs,
    };

    setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
  };

  // Simulation timer loop
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      executeStep();
    }, 3000);
    return () => clearInterval(interval);
  }, [
    isSimulating,
    trafficRps,
    carbonIntensity,
    carbonWeightAlpha,
    baseCpuTarget,
    maxCpuTarget,
    sloCeilingMs,
    safetyMarginMs,
    minReplicas,
    maxReplicas,
    scalingMode,
    currentReplicas,
    virtualHour,
    virtualMinute,
    lastScaleTimestamp,
  ]);

  // Scenario Presets
  const triggerDirtyGridSpike = () => {
    setCarbonIntensity(580);
    setScalingMode('carbon-aware');
  };

  const triggerCleanGrid = () => {
    setCarbonIntensity(32);
    setScalingMode('carbon-aware');
  };

  const triggerTrafficSurge = () => {
    setTrafficRps(2800);
  };

  const resetSimulation = () => {
    setTrafficRps(1200);
    setCarbonIntensity(activeRegion.currentIntensity);
    setCarbonWeightAlpha(0.75);
    setBaseCpuTarget(60);
    setMaxCpuTarget(80);
    setSloCeilingMs(150);
    setSafetyMarginMs(25);
    setMinReplicas(3);
    setMaxReplicas(30);
    setCurrentReplicas(10);
    setScalingMode('carbon-aware');
    setVirtualHour(14);
    setVirtualMinute(30);
    setTickCount(1);
    setEvents([]);
  };

  const baselinePods = Math.max(minReplicas, Math.ceil(trafficRps / 120));
  const podsAvoided = Math.max(0, baselinePods - currentReplicas);

  return (
    <div className="space-y-6">
      
      {/* Control Console Header */}
      <div className="enterprise-panel p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-eco px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider font-mono">
                Operator Simulator (Centerpiece)
              </span>
              <span className="text-xs text-slate-400">Deterministic Closed-Loop Controller</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Interactive Scaling Simulator & Decision Auditor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Dynamically manipulate grid emissions, microservice traffic load, and SLO guardrails to observe the reconciler adjust HPA thresholds and consolidate pods without risking latency.
            </p>
          </div>

          {/* Virtual Clock & Step Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg enterprise-subtle text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Virtual Clock: <strong className="text-white">{String(virtualHour).padStart(2, '0')}:{String(virtualMinute).padStart(2, '0')}</strong></span>
              <span className="text-slate-500">•</span>
              <span>Tick #{tickCount}</span>
            </div>

            <button
              onClick={executeStep}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111a2e] hover:bg-[#162035] text-cyan-300 border border-cyan-800/40 transition-colors cursor-pointer"
              title="Execute single simulation step forward"
            >
              <StepForward className="w-3.5 h-3.5" />
              <span>Step Forward</span>
            </button>

            <button
              onClick={resetSimulation}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              title="Reset simulation parameters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Scenario Preset Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-3 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Demo Presets:</span>
          <button
            onClick={triggerDirtyGridSpike}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 transition-colors cursor-pointer"
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>Evening Carbon Surge (580g)</span>
          </button>
          <button
            onClick={triggerCleanGrid}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Solar Peak Abundance (32g)</span>
          </button>
          <button
            onClick={triggerTrafficSurge}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 transition-colors cursor-pointer"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Flash Traffic Surge (2800 RPS)</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          
          {/* Slider 1: Traffic Load */}
          <div className="p-3.5 rounded-lg enterprise-subtle space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Workload Rate (RPS)
              </span>
              <span className="font-mono font-bold text-cyan-400">{trafficRps} RPS</span>
            </div>
            <input
              type="range"
              min="200"
              max="4000"
              step="50"
              value={trafficRps}
              onChange={(e) => setTrafficRps(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Low (200)</span>
              <span>Nominal (1200)</span>
              <span>Peak (4000)</span>
            </div>
          </div>

          {/* Slider 2: Carbon Intensity */}
          <div className="p-3.5 rounded-lg enterprise-subtle space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Grid Carbon Intensity
              </span>
              <span className="font-mono font-bold text-amber-400">{carbonIntensity} gCO₂e/kWh</span>
            </div>
            <input
              type="range"
              min="20"
              max="700"
              step="10"
              value={carbonIntensity}
              onChange={(e) => setCarbonIntensity(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Clean (20g)</span>
              <span>Average (300g)</span>
              <span>Coal Heavy (700g)</span>
            </div>
          </div>

          {/* Slider 3: Carbon Sensitivity Alpha */}
          <div className="p-3.5 rounded-lg enterprise-subtle space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Carbon Weight (α)
              </span>
              <span className="font-mono font-bold text-emerald-400">{carbonWeightAlpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={carbonWeightAlpha}
              onChange={(e) => setCarbonWeightAlpha(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0 (Standard HPA)</span>
              <span>0.5 (Balanced)</span>
              <span>1.0 (Max Eco)</span>
            </div>
          </div>

          {/* Slider 4: SLO Latency Ceiling */}
          <div className="p-3.5 rounded-lg enterprise-subtle space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Latency SLO Ceiling
              </span>
              <span className="font-mono font-bold text-violet-400">{sloCeilingMs} ms</span>
            </div>
            <input
              type="range"
              min="80"
              max="300"
              step="10"
              value={sloCeilingMs}
              onChange={(e) => setSloCeilingMs(Number(e.target.value))}
              className="w-full accent-violet-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Strict (80ms)</span>
              <span>Target (150ms)</span>
              <span>Loose (300ms)</span>
            </div>
          </div>

        </div>

        {/* Scaling Mode Toggle & Target Microservice Select */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#1e293b] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Scaling Mode:</span>
            <button
              onClick={() => setScalingMode('carbon-aware')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                scalingMode === 'carbon-aware'
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'bg-[#111a2e] text-slate-400 border border-[#1e293b]'
              }`}
            >
              Carbon Pilot (Dynamic)
            </button>
            <button
              onClick={() => setScalingMode('standard-hpa')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                scalingMode === 'standard-hpa'
                  ? 'bg-cyan-600 text-slate-950 font-bold'
                  : 'bg-[#111a2e] text-slate-400 border border-[#1e293b]'
              }`}
            >
              Standard HPA (Static 60% CPU)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Target Service:</span>
            {microservices.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                className={`px-2.5 py-0.5 rounded font-mono text-xs transition-colors cursor-pointer ${
                  selectedServiceId === svc.id
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-[#111a2e] text-slate-400 border border-[#1e293b]'
                }`}
              >
                {svc.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Baseline Standard HPA Card */}
        <div className="enterprise-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Baseline Model
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Standard HPA (Static Utilization)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Fixed 60% Target</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded enterprise-subtle">
              <span className="text-slate-400 block text-[10px]">CPU Target</span>
              <span className="text-lg font-bold text-white block mt-0.5">60%</span>
              <span className="text-[10px] text-slate-500">Constant</span>
            </div>
            <div className="p-2.5 rounded enterprise-subtle">
              <span className="text-slate-400 block text-[10px]">Active Pods</span>
              <span className="text-lg font-bold text-rose-300 block mt-0.5">{baselinePods}</span>
              <span className="text-[10px] text-slate-500">Allocated</span>
            </div>
            <div className="p-2.5 rounded enterprise-subtle">
              <span className="text-slate-400 block text-[10px]">P99 Latency</span>
              <span className="text-lg font-bold text-cyan-300 block mt-0.5">
                {latestExplanationTrace?.sloGuardrailCheck.currentLatencyP99 || 85} ms
              </span>
              <span className="text-[10px] text-slate-500">&lt; {sloCeilingMs}ms SLO</span>
            </div>
          </div>

          {/* Pod Visualizer */}
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Baseline Pod Allocation ({baselinePods} Instances):
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-[#070c18] border border-[#1e293b] min-h-[55px]">
              {Array.from({ length: baselinePods }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300"
                  title={`Baseline Pod #${i + 1}`}
                >
                  <Boxes className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Standard HPA allocates replica headroom purely on CPU, wasting power and emitting carbon during dirty grid hours.
          </p>
        </div>

        {/* Carbon Pilot Dynamic Managed Card */}
        <div className="enterprise-panel p-5 space-y-4 border-emerald-500/30">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <span className="badge-eco px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">
                Carbon-Aware Model
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Carbon Pilot Orchestrator
              </h3>
            </div>
            <span className="badge-eco px-2 py-0.5 rounded text-xs font-mono font-bold">
              {podsAvoided > 0 ? `-${podsAvoided} Pods Consolidated` : 'Equilibrium'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-slate-400 block text-[10px]">Tuned CPU</span>
              <span className="text-lg font-bold text-emerald-300 block mt-0.5">
                {latestExplanationTrace?.observedCpuPercent || baseCpuTarget}%
              </span>
              <span className="text-[10px] text-emerald-400/80">Dynamic</span>
            </div>
            <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-slate-400 block text-[10px]">Active Pods</span>
              <span className="text-lg font-bold text-white block mt-0.5">{currentReplicas}</span>
              <span className="text-[10px] text-emerald-400">Optimized</span>
            </div>
            <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-slate-400 block text-[10px]">P99 Latency</span>
              <span className="text-lg font-bold text-cyan-300 block mt-0.5">
                {latestExplanationTrace?.sloGuardrailCheck.estimatedLatencyP99 || 95} ms
              </span>
              <span className="text-[10px] text-emerald-400">SLO Safe</span>
            </div>
          </div>

          {/* Pod Visualizer */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-[10px]">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">
                Carbon-Optimized Allocation ({currentReplicas} Active):
              </span>
              <span className="font-mono text-emerald-400">
                Saved {latestExplanationTrace?.energyEmissionsImpact.carbonSavedGramsPerMin || 0} gCO₂e/min
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-[#070c18] border border-emerald-500/25 min-h-[55px]">
              {Array.from({ length: currentReplicas }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-300"
                  title={`Active Eco Pod #${i + 1}`}
                >
                  <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              ))}
              {Array.from({ length: podsAvoided }).map((_, i) => (
                <div
                  key={`avoided-${i}`}
                  className="w-6 h-6 rounded border border-dashed border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center text-[9px] font-mono text-emerald-500/60"
                  title="Emissions avoided by pod consolidation"
                >
                  Eco
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded bg-emerald-950/15 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              SLO Slack: {latestExplanationTrace?.sloGuardrailCheck.latencySlackMs || 50}ms before ceiling.
            </span>
            <span className="font-mono text-[11px] font-bold">0 Violations</span>
          </div>
        </div>

      </div>

      {/* 6-Point Decision Explanation Trace Card */}
      {latestExplanationTrace && (
        <div className="enterprise-panel p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e293b]">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Deterministic Decision Explanation Trace (Phase 3 Audit Trace)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="p-2 rounded enterprise-subtle">
              <span className="text-[10px] text-slate-400 block">1. Workload / CPU</span>
              <span className="font-bold text-white block mt-0.5">
                {latestExplanationTrace.workloadRps} RPS ({latestExplanationTrace.observedCpuPercent}%)
              </span>
            </div>
            <div className="p-2 rounded enterprise-subtle">
              <span className="text-[10px] text-slate-400 block">2. Grid Intensity</span>
              <span className="font-bold text-amber-400 block mt-0.5">
                {latestExplanationTrace.gridCarbonIntensityGCO2} gCO₂e/kWh
              </span>
            </div>
            <div className="p-2 rounded enterprise-subtle">
              <span className="text-[10px] text-slate-400 block">3. Replicas</span>
              <span className="font-bold text-white block mt-0.5">
                {latestExplanationTrace.replicaCounts.desired} / {latestExplanationTrace.replicaCounts.baselineStandardHpa} base
              </span>
            </div>
            <div className="p-2 rounded enterprise-subtle">
              <span className="text-[10px] text-slate-400 block">4. Power Savings</span>
              <span className="font-bold text-emerald-400 block mt-0.5">
                -{latestExplanationTrace.energyEmissionsImpact.savedPowerWatts} Watts
              </span>
            </div>
            <div className="p-2 rounded enterprise-subtle">
              <span className="text-[10px] text-slate-400 block">5. Latency / SLO Slack</span>
              <span className="font-bold text-cyan-300 block mt-0.5">
                {latestExplanationTrace.sloGuardrailCheck.latencySlackMs} ms margin
              </span>
            </div>
            <div className="p-2 rounded enterprise-subtle">
              <span className="text-[10px] text-slate-400 block">6. SLO Guardrail</span>
              <span className="font-bold text-emerald-400 block mt-0.5">
                {latestExplanationTrace.sloGuardrailCheck.isCompliant ? '100% Compliant' : 'Warning'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#090f1d] border border-[#1e293b] text-xs text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Policy Justification: </strong>
              <span>{latestExplanationTrace.justification}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reconciler Event Log Stream */}
      <div className="enterprise-panel p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Operator Reconciler Audit Log Feed
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Target: {currentService.name} • Controller: carbonpolicy-controller
          </span>
        </div>

        <div className="rounded-lg bg-[#050811] border border-[#1e293b] p-3 font-mono text-xs space-y-2 max-h-52 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-slate-500 italic p-2">Initializing reconciliation loop...</div>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="flex items-start gap-2.5 text-[11px]">
                <span className="text-slate-500 flex-shrink-0">[{evt.timestamp}]</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-bold flex-shrink-0 ${
                    evt.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : evt.severity === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {evt.type}
                </span>
                <span className="text-slate-300">{evt.message}</span>
                <span className="ml-auto text-slate-500 hidden sm:inline flex-shrink-0">
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
