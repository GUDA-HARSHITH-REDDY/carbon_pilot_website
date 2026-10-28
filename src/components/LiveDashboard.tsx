import React, { useState } from 'react';
import { GridRegion, MicroserviceDeployment } from '../types';
import { 
  Zap, 
  Leaf, 
  ShieldCheck, 
  TrendingDown, 
  Server, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Filter,
  BarChart3,
  Calendar,
  Clock
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
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; value: number } | null>(null);

  // Compute cluster-wide aggregations
  const totalBaselinePods = microservices.reduce((acc, m) => acc + m.baselineReplicas, 0);
  const totalCarbonPilotPods = microservices.reduce((acc, m) => acc + m.carbonPilotReplicas, 0);
  const totalPodsSaved = totalBaselinePods - totalCarbonPilotPods;
  const pctPodsReduced = Math.round((totalPodsSaved / totalBaselinePods) * 100);

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
  const chartHeight = 180;
  const chartWidth = 560;
  const trend = activeRegion.hourlyTrend;
  const maxIntensity = Math.max(...trend, 500);
  const minIntensity = Math.min(...trend, 0);

  // Helper to generate SVG polyline path
  const points = trend.map((val, idx) => {
    const x = (idx / (trend.length - 1)) * chartWidth;
    const y = chartHeight - ((val - minIntensity) / (maxIntensity - minIntensity)) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(' ');

  // Fill area path
  const areaPath = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Observability & Dashboard Layer
              </span>
              <span className="text-xs text-slate-400">Cluster Telemetry & Historical Trends</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Carbon Pilot Cloud-Native Telemetry Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Real-time visualization of regional grid carbon intensity, autoscaler pod consolidation, and cumulative carbon savings with strict SLO compliance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Tier Filter:</span>
            {['all', 'frontend', 'core', 'supporting'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  filterTier === tier
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cluster KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          {/* KPI 1: Daily Carbon Avoided */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Daily Carbon Avoided</span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {dailyCarbonAvoidedKg} <span className="text-sm font-normal text-emerald-400">kg CO₂</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-31.2% vs Baseline HPA</span>
            </div>
          </div>

          {/* KPI 2: Active Pod Instances */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Cluster Pods (Online Boutique)</span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {totalCarbonPilotPods}{' '}
                  <span className="text-sm font-normal text-slate-400">/ {totalBaselinePods} base</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-blue-300 flex items-center gap-1">
              <span>{totalPodsSaved} idle pods consolidated (-{pctPodsReduced}%)</span>
            </div>
          </div>

          {/* KPI 3: SLO Compliance Rate */}
          <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">SLO Guardrail Health</span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  100.0% <span className="text-sm font-normal text-teal-400">Compliant</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-teal-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>0 Breaches across 10 microservices</span>
            </div>
          </div>

          {/* KPI 4: Grid Intensity Status */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Grid Carbon Intensity</span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {activeRegion.currentIntensity}{' '}
                  <span className="text-sm font-normal text-amber-400">gCO₂/kWh</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-300">
              <span>Region: {activeRegion.name}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: 24-Hour Grid Carbon Intensity Curve */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                24-Hour Grid Carbon-Intensity Curve ({activeRegion.code})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Electricity Maps API</span>
          </div>

          <div className="relative w-full overflow-hidden pt-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2={chartWidth} y2="90" stroke="#334155" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="#334155" strokeDasharray="3 3" />

              {/* Area fill */}
              <polygon points={areaPath} fill="url(#carbonGradient)" />

              {/* Curve line */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {trend.map((val, idx) => {
                const x = (idx / (trend.length - 1)) * chartWidth;
                const y = chartHeight - ((val - minIntensity) / (maxIntensity - minIntensity)) * (chartHeight - 30) - 15;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={hoveredPoint?.index === idx ? 5 : 3}
                    className="cursor-pointer fill-amber-400 hover:fill-white transition-all"
                    onMouseEnter={() => setHoveredPoint({ index: idx, value: val })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div className="text-center text-xs font-mono text-amber-300 mt-2">
                Hour {hoveredPoint.index}:00 — <span className="font-bold">{hoveredPoint.value} gCO₂/kWh</span>
              </div>
            )}

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>00:00</span>
              <span>06:00 (Dawn)</span>
              <span>12:00 (Solar Peak)</span>
              <span>18:00 (Evening Peak)</span>
              <span>23:00</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Carbon Pilot increases HPA CPU target during dirty grid periods (e.g. evening peak) and relaxes it during clean solar/wind abundance.
          </div>
        </div>

        {/* Chart 2: Cumulative Carbon Savings Comparison */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Cluster Energy & Emissions Differential
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">-31.2% Net Savings</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Energy Consumption Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Daily Electricity Consumption</span>
                <span className="font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">254.1 kWh</span> vs 348.5 kWh
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: '72.9%' }} title="Carbon Pilot: 254.1 kWh" />
                <div className="bg-rose-500/60 h-full rounded-r-full" style={{ width: '27.1%' }} title="Conserved Energy: 94.4 kWh" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span className="text-emerald-400">■ Carbon Pilot (254.1 kWh)</span>
                <span className="text-rose-400">■ Baseline Surplus (94.4 kWh)</span>
              </div>
            </div>

            {/* Daily Carbon Emissions Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Total Carbon Emissions (kg CO₂eq)</span>
                <span className="font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">98.2 kg</span> vs 142.8 kg
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-400 h-full rounded-l-full" style={{ width: '68.8%' }} title="Carbon Pilot: 98.2 kg" />
                <div className="bg-slate-700 h-full rounded-r-full" style={{ width: '31.2%' }} title="Avoided: 44.6 kg" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span className="text-emerald-400">■ Emitted Under Carbon Pilot (98.2 kg)</span>
                <span className="text-slate-400">■ Carbon Avoided (44.6 kg)</span>
              </div>
            </div>

            {/* Cloud Cost Estimation */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-300 font-medium block">Equivalent Cloud Cost Reduction</span>
                <span className="text-[11px] text-slate-400">Node compute hours saved from pod downscaling</span>
              </div>
              <span className="text-lg font-mono font-black text-emerald-400">
                ~$412 / mo
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Microservice Fleet Status Table (Google Online Boutique) */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Google Online Boutique Microservices Fleet (Evaluation Target)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredServices.length} Microservices
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Service Name</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Load (RPS)</th>
                <th className="py-3 px-3">Target CPU</th>
                <th className="py-3 px-3">Baseline Pods</th>
                <th className="py-3 px-3">Carbon Pilot Pods</th>
                <th className="py-3 px-3">P99 Latency / SLO</th>
                <th className="py-3 px-3">Carbon Saved</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredServices.map((svc) => {
                const podsDiff = svc.baselineReplicas - svc.carbonPilotReplicas;
                return (
                  <tr key={svc.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white font-sans">
                      {svc.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-300">
                        {svc.tier}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {svc.rps}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      {svc.currentCpuPercent}%
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {svc.baselineReplicas}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-white font-bold">{svc.carbonPilotReplicas}</span>{' '}
                      {podsDiff > 0 && (
                        <span className="text-emerald-400 text-[10px]">(-{podsDiff})</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-teal-300">{svc.carbonPilotLatencyP99}ms</span>{' '}
                      <span className="text-slate-500">/ {svc.targetLatencyMs}ms</span>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      {svc.carbonSavedGramsPerMin} g/min
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Optimal
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
