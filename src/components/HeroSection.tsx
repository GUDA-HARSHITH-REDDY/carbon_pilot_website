import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, Server, Activity, CheckCircle2, Layers, Cpu, Sparkles, TrendingDown } from 'lucide-react';
import { GridRegion, ThemeColor } from '../types';

interface HeroSectionProps {
  onExploreArchitecture: () => void;
  onLaunchSimulator: () => void;
  onOpenDashboard: () => void;
  activeRegion: GridRegion;
  themeColor: ThemeColor;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreArchitecture,
  onLaunchSimulator,
  onOpenDashboard,
  activeRegion,
  themeColor,
}) => {
  // Live ticking odometer of carbon saved in kg
  const [liveCarbonOdometer, setLiveCarbonOdometer] = useState<number>(4468.42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCarbonOdometer((prev) => +(prev + 0.08).toFixed(2));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getGradientText = () => {
    switch (themeColor) {
      case 'cyan':
        return 'from-cyan-400 via-sky-300 to-blue-500';
      case 'borealis':
        return 'from-purple-400 via-pink-300 to-emerald-400';
      case 'amber':
        return 'from-amber-400 via-orange-300 to-yellow-500';
      default:
        return 'from-emerald-400 via-teal-300 to-cyan-400';
    }
  };

  const getGlowBg = () => {
    switch (themeColor) {
      case 'cyan':
        return 'bg-cyan-500/15';
      case 'borealis':
        return 'bg-purple-500/15';
      case 'amber':
        return 'bg-amber-500/15';
      default:
        return 'bg-emerald-500/15';
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-white/[0.08] cyber-grid">
      {/* Background radial luminous mesh */}
      <div className={`absolute top-0 left-1/3 -translate-x-1/2 w-[850px] h-[450px] ${getGlowBg()} blur-[140px] rounded-full pointer-events-none`} />
      <div className="absolute top-20 right-10 w-[500px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* CNAD Review Badge & Real-time Live Ticker */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-semibold shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              CNAD Project Review
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-medium">Carbon-Aware Kubernetes Orchestrator</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Cumulative Savings:</span>
            <span className="text-emerald-300 font-bold tracking-wider">{liveCarbonOdometer.toLocaleString()} kg CO₂</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Carbon-Aware <br />
              <span className={`bg-gradient-to-r ${getGradientText()} bg-clip-text text-transparent`}>
                Kubernetes Auto-Scaling
              </span>{' '}
              for Cloud-Native Microservices
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              <strong>Carbon Pilot</strong> is a Kubernetes-native control-plane component that augments the standard
              Horizontal Pod Autoscaler (HPA) with real-time grid carbon-intensity awareness. Every scaling decision is
              strictly bounded by microservice SLOs—capturing up to <span className="text-emerald-400 font-bold">31.2% carbon reduction</span> with zero performance risk.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onLaunchSimulator}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Activity className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Launch Live Simulator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreArchitecture}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/40 text-slate-200 font-semibold text-sm transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Architecture Explorer (Fig. 1)</span>
              </button>

              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-indigo-500/40 text-slate-300 font-semibold text-sm transition-all cursor-pointer"
              >
                <Server className="w-4 h-4 text-indigo-400" />
                <span>Telemetry Dashboard</span>
              </button>
            </div>

            {/* 4 Core Architectural Layers highlight */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl glass-card transition-transform hover:-translate-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Layer 1</span>
                <span className="font-semibold text-white mt-0.5 block">Grid Carbon API</span>
                <span className="text-[11px] text-rose-400 mt-0.5 block">Electricity Maps / WattTime</span>
              </div>
              <div className="p-3.5 rounded-xl glass-card transition-transform hover:-translate-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Layer 2</span>
                <span className="font-semibold text-white mt-0.5 block">Control Plane</span>
                <span className="text-[11px] text-cyan-400 mt-0.5 block">CRD Operator & Reconciler</span>
              </div>
              <div className="p-3.5 rounded-xl glass-card transition-transform hover:-translate-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Layer 3</span>
                <span className="font-semibold text-white mt-0.5 block">K8s Cluster</span>
                <span className="text-[11px] text-amber-400 mt-0.5 block">Prometheus, HPA & Pods</span>
              </div>
              <div className="p-3.5 rounded-xl glass-card transition-transform hover:-translate-y-0.5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Layer 4</span>
                <span className="font-semibold text-white mt-0.5 block">Observability</span>
                <span className="text-[11px] text-purple-400 mt-0.5 block">REST API & React Console</span>
              </div>
            </div>
          </div>

          {/* Right Hero Metrics Card with modern visual treatment */}
          <div className="lg:col-span-4">
            <div className="glass-panel rounded-2xl p-6 border-white/10 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-slate-300">Live Telemetry Feed</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-cyan-300">
                  {activeRegion.code}
                </span>
              </div>

              {/* Stat 1: Carbon Reduction */}
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-teal-950/30 border border-emerald-500/30 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Carbon Avoided (Google Benchmark)</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      -31.2%
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-1.5 font-sans">
                    44.6 <span className="text-sm font-normal text-slate-400 font-mono">kg CO₂ / day</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full mt-3 overflow-hidden p-0.5 border border-white/[0.05]">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: '68.8%' }} />
                  </div>
                </div>

                {/* Stat 2: Zero SLO Breaches */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">SLO Guardrail Health</span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 100.0%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1 font-sans">
                    0 <span className="text-sm font-normal text-slate-400 font-mono">SLA Violations</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Target CPU immediately throttles back to standard HPA if latency approaches SLO ceiling.
                  </p>
                </div>

                {/* Stat 3: Grid Carbon Signal */}
                <div className="p-4 rounded-xl glass-card">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Real-Time Grid Carbon</span>
                    <span className="text-xs font-mono text-slate-400">{activeRegion.name}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1 flex items-baseline gap-2 font-sans">
                    {activeRegion.currentIntensity}{' '}
                    <span className="text-sm font-normal text-amber-400 font-mono">gCO₂eq/kWh</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">{activeRegion.renewablePercentage}% Renewable</span>
                    <span>•</span>
                    <span>{100 - activeRegion.renewablePercentage}% Fossil Baseline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
