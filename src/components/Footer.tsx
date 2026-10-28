import React from 'react';
import { Leaf, Github, Globe, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">Carbon Pilot</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  v1alpha1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Carbon-Aware Auto-Scaling Orchestrator for Cloud-Native Microservices
              </p>
            </div>
          </div>

          <div className="text-xs text-center md:text-right text-slate-400 space-y-1">
            <p>CNAD Project Review • Cloud-Native Architecture & Design</p>
            <p className="text-[11px] text-slate-500">
              Kubernetes-Native Control Plane • Electricity Maps & WattTime Integration
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% SLO Guaranteed
            </span>
            <span>•</span>
            <span>Apache 2.0 License</span>
            <span>•</span>
            <span>Google Cloud Online Boutique Benchmark</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Carbon Pilot Web Dashboard & Simulation Engine
          </div>
        </div>
      </div>
    </footer>
  );
};
