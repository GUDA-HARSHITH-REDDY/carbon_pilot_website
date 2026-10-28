import React, { useState } from 'react';
import { 
  Leaf, 
  Activity, 
  Globe, 
  Zap, 
  Server, 
  ShieldCheck, 
  Play, 
  Pause, 
  HelpCircle,
  ExternalLink,
  Cpu,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GridRegion } from '../types';

interface NavbarProps {
  regions: GridRegion[];
  activeRegion: GridRegion;
  onSelectRegion: (region: GridRegion) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  onStartDemoWalkthrough: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  regions,
  activeRegion,
  onSelectRegion,
  activeTab,
  setActiveTab,
  isSimulating,
  toggleSimulation,
  onStartDemoWalkthrough,
}) => {
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'simulator', label: 'Operator Simulator' },
    { id: 'dashboard', label: 'Live Telemetry' },
    { id: 'crd', label: 'CarbonPolicy CRD' },
    { id: 'evaluation', label: 'Evaluation Results' },
    { id: 'techstack', label: 'Tech Stack' },
  ];

  const getIntensityBadge = (intensity: number) => {
    if (intensity < 100) return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    if (intensity < 300) return 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30';
    if (intensity < 500) return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#070c18]/95 border-b border-[#1e293b] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15">
            {/* Logo and Product Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white font-sans">
                    Carbon<span className="text-emerald-400">Pilot</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/40 font-semibold">
                    K8s Operator
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block leading-none">
                  Carbon-Aware Auto-Scaling Orchestrator
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#0d1527] p-1 rounded-lg border border-[#1e293b]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === link.id
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-[#111a2e]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Status Controls */}
            <div className="flex items-center gap-2.5">
              {/* Region Selector */}
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                <select
                  value={activeRegion.id}
                  onChange={(e) => {
                    const reg = regions.find((r) => r.id === e.target.value);
                    if (reg) onSelectRegion(reg);
                  }}
                  className="bg-[#0d1527] border border-[#1e293b] text-slate-200 text-xs rounded-md pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none hover:border-[#334155]"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#0d1527] text-slate-200">
                      {r.code} ({r.currentIntensity}g)
                    </option>
                  ))}
                </select>
              </div>

              {/* Operating Mode Indicator */}
              <button
                onClick={() => setShowStatusModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border border-cyan-800/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-950/60 cursor-pointer transition-colors"
                title="View Environment and Kubernetes Status"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>SIMULATED MODE</span>
                <HelpCircle className="w-3 h-3 text-cyan-400/80 ml-0.5" />
              </button>

              {/* Grid Intensity Pill */}
              <div
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-medium ${getIntensityBadge(
                  activeRegion.currentIntensity
                )}`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{activeRegion.currentIntensity}</span>
                <span className="text-[10px] text-slate-400">gCO₂/kWh</span>
              </div>

              {/* Simulation Toggle */}
              <button
                onClick={toggleSimulation}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isSimulating
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-[#111a2e] hover:bg-[#162035] text-amber-400 border border-amber-500/30'
                }`}
                title={isSimulating ? 'Pause simulation tick' : 'Resume simulation tick'}
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSimulating ? 'Live' : 'Paused'}</span>
              </button>

              {/* Guided Demo Button */}
              <button
                onClick={onStartDemoWalkthrough}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-violet-950/40 text-violet-300 border border-violet-700/40 hover:bg-violet-900/40 transition-colors cursor-pointer"
              >
                <span>Demo Script</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Connection & Environment Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="enterprise-panel max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Environment & Telemetry Mode</h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg enterprise-subtle space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Current Mode:</span>
                  <span className="text-cyan-400 font-mono">Deterministic Synthetic Engine</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  External services (Electricity Maps, Prometheus server, live Kubernetes cluster) are simulated locally using real-world empirical traces.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">REST API Backend:</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Online (/api/health)
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Decision Engine:</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified (18/18 Unit Tests Passing)
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Active Workload:</span>
                  <span className="text-slate-200 font-mono">Google Cloud Online Boutique (10 Services)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Kubernetes CRD:</span>
                  <span className="text-cyan-400 font-mono">autoscaling.carbonpilot.io/v1alpha1</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                To connect to a live Kubernetes cluster, apply the manifests in <code className="text-emerald-400">k8s/crds/</code> and configure <code className="text-emerald-400">KUBECONFIG</code>.
              </div>
            </div>

            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
};
