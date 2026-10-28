import React from 'react';
import { Leaf, Activity, Globe, Zap, Palette, Sparkles, ExternalLink } from 'lucide-react';
import { GridRegion, ThemeColor } from '../types';

interface NavbarProps {
  regions: GridRegion[];
  activeRegion: GridRegion;
  onSelectRegion: (region: GridRegion) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  regions,
  activeRegion,
  onSelectRegion,
  activeTab,
  setActiveTab,
  isSimulating,
  toggleSimulation,
  themeColor,
  setThemeColor,
}) => {
  const getIntensityBadge = (intensity: number) => {
    if (intensity < 100) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (intensity < 300) return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
    if (intensity < 500) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  };

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'architecture', label: 'Architecture (Fig. 1)' },
    { id: 'simulator', label: 'Operator Simulator' },
    { id: 'dashboard', label: 'Live Dashboard' },
    { id: 'crd', label: 'CarbonPolicy CRD' },
    { id: 'techstack', label: 'Tech Stack' },
    { id: 'benchmark', label: 'Evaluation' },
  ];

  const themeOptions: { id: ThemeColor; label: string; dotClass: string }[] = [
    { id: 'emerald', label: 'Neo Mint', dotClass: 'bg-emerald-400 shadow-emerald-400/50' },
    { id: 'cyan', label: 'Azure Cyan', dotClass: 'bg-cyan-400 shadow-cyan-400/50' },
    { id: 'borealis', label: 'Borealis', dotClass: 'bg-purple-400 shadow-purple-400/50' },
    { id: 'amber', label: 'Solar Amber', dotClass: 'bg-amber-400 shadow-amber-400/50' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/80 border-b border-white/[0.08] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and CNAD Tag */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-white/20">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center font-sans">
                  Carbon<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 ml-0.5">Pilot</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
                  K8s Operator
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                CNAD Review — Carbon-Aware Auto-Scaling Orchestrator
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/[0.06]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === link.id
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Controls: Theme Switcher, Region Selector, Live Intensity Pill, Engine Live Button */}
          <div className="flex items-center gap-2.5">
            {/* Color Palette Switcher */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-white/10" title="Switch UI Accent Palette">
              <Palette className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeColor(t.id)}
                  className={`w-4 h-4 rounded-full transition-all relative ${t.dotClass} ${
                    themeColor === t.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'
                  }`}
                  title={`Switch to ${t.label} palette`}
                />
              ))}
            </div>

            {/* Region Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={activeRegion.id}
                onChange={(e) => {
                  const reg = regions.find((r) => r.id === e.target.value);
                  if (reg) onSelectRegion(reg);
                }}
                className="bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none hover:border-slate-600 transition-colors"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-slate-100">
                    {r.code} — {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Intensity Pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${getIntensityBadge(
                activeRegion.currentIntensity
              )}`}
              title="Real-time electricity grid carbon intensity"
            >
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span className="font-bold">{activeRegion.currentIntensity}</span>
              <span className="text-[10px] text-slate-400">gCO₂/kWh</span>
            </div>

            {/* Simulation Status / Pause button */}
            <button
              onClick={toggleSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
                isSimulating
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSimulating ? 'Live Engine' : 'Paused'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
