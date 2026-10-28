import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Server, 
  Activity, 
  Layers, 
  Cpu, 
  TrendingDown,
  Info,
  Sliders,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { GridRegion } from '../types';

interface HeroSectionProps {
  onExploreArchitecture: () => void;
  onLaunchSimulator: () => void;
  onOpenDashboard: () => void;
  onOpenEvaluation: () => void;
  activeRegion: GridRegion;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreArchitecture,
  onLaunchSimulator,
  onOpenDashboard,
  onOpenEvaluation,
  activeRegion,
}) => {
  return (
    <section className="relative pt-6 pb-10 border-b border-[#1e293b] bg-[#070c18] bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Operational Context Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              CNAD Review Project
            </span>
            <span className="text-xs text-slate-400">
              Carbon-Aware Kubernetes Auto-Scaling Orchestrator
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Engine: <strong className="text-white">Deterministic Model</strong>
            </span>
            <span>•</span>
            <span>Region: <strong className="text-emerald-400">{activeRegion.code}</strong></span>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Carbon-Aware <span className="text-emerald-400">Kubernetes Auto-Scaling</span> for Cloud-Native Microservices
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              <strong>Carbon Pilot</strong> augments the native Kubernetes Horizontal Pod Autoscaler (HPA) with real-time grid carbon-intensity awareness. Every scaling decision dynamically tunes target utilization thresholds while strictly enforcing microservice Service Level Objectives (SLOs)—capturing carbon reductions without performance risk.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchSimulator}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
                <span>Launch Operator Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreArchitecture}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0d1527] hover:bg-[#111a2e] border border-[#1e293b] text-slate-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Architecture (Figure 1)</span>
              </button>

              <button
                onClick={onOpenEvaluation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0d1527] hover:bg-[#111a2e] border border-[#1e293b] text-slate-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-violet-400" />
                <span>Experiment Results</span>
              </button>
            </div>

            {/* 4 Architecture Layers Quick Breadcrumbs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
              <div className="p-2.5 rounded-lg enterprise-subtle">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Layer 1</span>
                <span className="text-xs font-bold text-rose-300 block">Grid Carbon API</span>
                <span className="text-[10px] text-slate-400 block truncate">Electricity Maps / WattTime</span>
              </div>
              <div className="p-2.5 rounded-lg enterprise-subtle">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Layer 2</span>
                <span className="text-xs font-bold text-cyan-300 block">Control Plane</span>
                <span className="text-[10px] text-slate-400 block truncate">Operator & Reconciler</span>
              </div>
              <div className="p-2.5 rounded-lg enterprise-subtle">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Layer 3</span>
                <span className="text-xs font-bold text-amber-300 block">K8s Cluster</span>
                <span className="text-[10px] text-slate-400 block truncate">Prometheus, HPA, Pods</span>
              </div>
              <div className="p-2.5 rounded-lg enterprise-subtle">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Layer 4</span>
                <span className="text-xs font-bold text-violet-300 block">Observability</span>
                <span className="text-[10px] text-slate-400 block truncate">REST API & Dashboard</span>
              </div>
            </div>
          </div>

          {/* Right Status Card */}
          <div className="lg:col-span-4">
            <div className="enterprise-panel p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Benchmark Telemetry
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Online Boutique
                </span>
              </div>

              {/* Verified KPI 1: Estimated Carbon Reduction */}
              <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/25">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Estimated Emissions Avoided</span>
                  <span className="font-mono font-bold text-emerald-400">~31.2%</span>
                </div>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  44.6 <span className="text-xs font-normal text-slate-400 font-mono">kg CO₂e / day</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Model-based estimate over 24h diurnal benchmark against static 60% CPU baseline.
                </p>
              </div>

              {/* Verified KPI 2: Zero SLO Breaches */}
              <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/25">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">SLO Guardrail Health</span>
                  <span className="font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 100.0%
                  </span>
                </div>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  0 <span className="text-xs font-normal text-slate-400 font-mono">SLA Breaches</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Latency ceiling is strictly non-negotiable; carbon tuning halts if latency margin decreases.
                </p>
              </div>

              {/* Current Grid Intensity */}
              <div className="p-3.5 rounded-lg enterprise-subtle flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Current Grid Intensity</span>
                  <span className="text-base font-bold text-white font-mono mt-0.5 block">
                    {activeRegion.currentIntensity} gCO₂e/kWh
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-medium block">
                    {activeRegion.renewablePercentage}% Renewable
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {activeRegion.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
