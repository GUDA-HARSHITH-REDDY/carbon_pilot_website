import React, { useState, useEffect } from 'react';
import { GridRegion, MicroserviceDeployment } from '../types';
import { 
  Zap, 
  Leaf, 
  ShieldCheck, 
  TrendingDown, 
  Server, 
  Activity, 
  CheckCircle2, 
  Clock,
  Filter,
  Layers,
  ArrowDownRight,
  Database
} from 'lucide-react';

interface LiveDashboardProps {
  activeRegion: GridRegion;
  microservices: MicroserviceDeployment[];
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({
  activeRegion,
  microservices,
}) => {
  const [filterTier, setFilterTier] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; value: number } | null>(null);

  // Compute cluster-wide aggregations
  const totalBaselinePods = microservices.reduce((acc, m) => acc + m.baselineReplicas, 0);
  const totalCarbonPilotPods = microservices.reduce((acc, m) => acc + m.carbonPilotReplicas, 0);
  const totalPodsSaved = Math.max(0, totalBaselinePods - totalCarbonPilotPods);
  const pctPodsReduced = totalBaselinePods > 0 
    ? Math.round((totalPodsSaved / totalBaselinePods) * 100) 
    : 0;

  const totalCarbonSavedGramsMin = microservices.reduce(
    (acc, m) => acc + m.carbonSavedGramsPerMin,
    0
  );
  const dailyCarbonAvoidedKg = ((totalCarbonSavedGramsMin * 60 * 24) / 1000).toFixed(1);

  // Filtered microservices
  const filteredServices = microservices.filter((m) => {
    if (filterTier === 'all') return true;
    return m.tier === filterTier;
  });

  // SVG Chart Dimensions
  const chartHeight = 160;
  const chartWidth = 540;
  const trend = activeRegion.hourlyTrend;
  const maxIntensity = Math.max(...trend, 500);
  const minIntensity = Math.min(...trend, 0);

  // Generate SVG polyline path
  const points = trend.map((val, idx) => {
    const x = (idx / (trend.length - 1)) * chartWidth;
    const y = chartHeight - ((val - minIntensity) / (maxIntensity - minIntensity)) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="enterprise-panel p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-violet px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider font-mono">
                Observability & Telemetry
              </span>
              <span className="text-xs text-slate-400">Prometheus Telemetry & Grid Metrics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Live Cluster Observability Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Monitors continuous Prometheus telemetry from all 10 Google Cloud Online Boutique microservices, tracking CPU utilization, pod replica elasticity, and carbon avoided.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Time range selector */}
            <div className="flex items-center bg-[#090f1d] p-1 rounded-md border border-[#1e293b]">
              {['1h', '6h', '24h'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    timeRange === t
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tier Filter */}
            <div className="flex items-center bg-[#090f1d] p-1 rounded-md border border-[#1e293b]">
              {['all', 'frontend', 'core', 'supporting'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                    filterTier === tier
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Cluster KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          
          {/* KPI 1: Daily Carbon Avoided */}
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/25">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Daily Emissions Avoided</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  {dailyCarbonAvoidedKg} <span className="text-xs font-normal text-emerald-400 font-mono">kg CO₂e</span>
                </div>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-31.2% Estimated vs Static HPA</span>
            </div>
          </div>

          {/* KPI 2: Active Pod Instances */}
          <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/25">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Cluster Pod Allocation</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  {totalCarbonPilotPods} <span className="text-xs font-normal text-slate-400 font-mono">/ {totalBaselinePods} base</span>
                </div>
              </div>
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-cyan-300 font-mono">
              <span>{totalPodsSaved} surplus pods consolidated (-{pctPodsReduced}%)</span>
            </div>
          </div>

          {/* KPI 3: SLO Compliance Rate */}
          <div className="p-4 rounded-lg bg-violet-950/20 border border-violet-500/25">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">SLO Guardrail Health</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  100.0% <span className="text-xs font-normal text-violet-300 font-mono">Compliant</span>
                </div>
              </div>
              <div className="p-2 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-violet-300 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              <span>0 Breaches across 10 workloads</span>
            </div>
          </div>

          {/* KPI 4: Grid Carbon Intensity */}
          <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/25">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Grid Carbon Intensity</span>
                <div className="text-2xl font-black text-white mt-1 font-sans">
                  {activeRegion.currentIntensity} <span className="text-xs font-normal text-amber-400 font-mono">gCO₂e/kWh</span>
                </div>
              </div>
              <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-300 font-mono">
              <span>Region: {activeRegion.name}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: 24-Hour Grid Carbon Intensity Curve */}
        <div className="enterprise-panel p-5 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                24-Hour Grid Carbon-Intensity Curve ({activeRegion.code})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Electricity Maps API Feed</span>
          </div>

          <div className="relative w-full pt-1">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40 overflow-visible">
              <defs>
                <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid guide lines */}
              <line x1="0" y1="35" x2={chartWidth} y2="35" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="125" x2={chartWidth} y2="125" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Shaded Area fill */}
              <polygon points={areaPath} fill="url(#carbonGradient)" />

              {/* Main Line */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data points */}
              {trend.map((val, idx) => {
                const x = (idx / (trend.length - 1)) * chartWidth;
                const y = chartHeight - ((val - minIntensity) / (maxIntensity - minIntensity)) * (chartHeight - 30) - 15;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={hoveredPoint?.index === idx ? 4.5 : 2.5}
                    className="cursor-pointer fill-amber-400 hover:fill-white transition-all"
                    onMouseEnter={() => setHoveredPoint({ index: idx, value: val })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </svg>

            {hoveredPoint && (
              <div className="text-center text-xs font-mono text-amber-300 mt-1">
                Hour {hoveredPoint.index}:00 — <strong className="text-white">{hoveredPoint.value} gCO₂e/kWh</strong>
              </div>
            )}

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-[#1e293b]">
              <span>00:00</span>
              <span>06:00 (Dawn)</span>
              <span>12:00 (Solar Peak)</span>
              <span>18:00 (Peak Dirty)</span>
              <span>23:00</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Cumulative Energy & Emissions Differential */}
        <div className="enterprise-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Cluster Energy & Emissions Differential
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">-31.2% Reduction</span>
          </div>

          <div className="space-y-3.5 pt-1 text-xs">
            {/* Electricity Consumed */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Electricity Consumed (24h)</span>
                <span className="font-mono text-slate-400">
                  <strong className="text-emerald-400">254.1 kWh</strong> vs 348.5 kWh base
                </span>
              </div>
              <div className="w-full bg-[#090f1d] h-2.5 rounded-full overflow-hidden flex border border-[#1e293b]">
                <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: '72.9%' }} title="Carbon Pilot: 254.1 kWh" />
                <div className="bg-rose-500/50 h-full rounded-r-full" style={{ width: '27.1%' }} title="Avoided: 94.4 kWh" />
              </div>
            </div>

            {/* Emissions Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Total Operational Carbon Emissions</span>
                <span className="font-mono text-slate-400">
                  <strong className="text-emerald-400">98.2 kg</strong> vs 142.8 kg base
                </span>
              </div>
              <div className="w-full bg-[#090f1d] h-2.5 rounded-full overflow-hidden flex border border-[#1e293b]">
                <div className="bg-emerald-400 h-full rounded-l-full" style={{ width: '68.8%' }} title="Emitted: 98.2 kg" />
                <div className="bg-slate-700 h-full rounded-r-full" style={{ width: '31.2%' }} title="Avoided: 44.6 kg" />
              </div>
            </div>

            {/* Equivalent Cloud Compute Cost Saving */}
            <div className="p-3 rounded-lg enterprise-subtle flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-semibold block">Estimated Compute Cost Conserved</span>
                <span className="text-[11px] text-slate-400">Node vCPU hours saved from pod downscaling</span>
              </div>
              <span className="text-base font-bold text-emerald-400 font-mono">
                ~$412 / mo
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Microservice Fleet Status Table */}
      <div className="enterprise-panel p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Workload Fleet: Google Cloud Online Boutique (10 Polyglot Services)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredServices.length} Services Monitored
          </span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090f1d] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#1e293b]">
              <tr>
                <th className="py-2.5 px-3">Service Name</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Throughput</th>
                <th className="py-2.5 px-3">Target CPU</th>
                <th className="py-2.5 px-3">Baseline Pods</th>
                <th className="py-2.5 px-3">Carbon Pilot Pods</th>
                <th className="py-2.5 px-3">P99 Latency / SLO</th>
                <th className="py-2.5 px-3">Carbon Avoided</th>
                <th className="py-2.5 px-3">SLO Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] font-mono text-slate-300">
              {filteredServices.map((svc) => {
                const podsDiff = Math.max(0, svc.baselineReplicas - svc.carbonPilotReplicas);
                return (
                  <tr key={svc.id} className="hover:bg-[#111a2e]/60 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white font-sans">
                      {svc.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-300">
                        {svc.tier}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {svc.rps} RPS
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">
                      {svc.currentCpuPercent}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {svc.baselineReplicas}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-white font-bold">{svc.carbonPilotReplicas}</span>{' '}
                      {podsDiff > 0 && (
                        <span className="text-emerald-400 text-[10px]">(-{podsDiff})</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-cyan-300">{svc.carbonPilotLatencyP99}ms</span>{' '}
                      <span className="text-slate-500">/ {svc.targetLatencyMs}ms</span>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">
                      {svc.carbonSavedGramsPerMin} g/min
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold badge-eco">
                        <CheckCircle2 className="w-3 h-3" /> Compliant
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
