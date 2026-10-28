import React, { useState } from 'react';
import { ARCHITECTURE_COMPONENTS, DATA_FLOW_STEPS } from '../data/mockData';
import { ArchitectureComponent } from '../types';
import { 
  Zap, 
  Radio, 
  Cpu, 
  RotateCw, 
  FileCode2, 
  Activity, 
  Layers, 
  Boxes, 
  Server, 
  LayoutDashboard, 
  Database, 
  Play, 
  Pause, 
  RotateCcw, 
  Code, 
  Check, 
  Copy, 
  Info,
  ArrowRight
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [selectedComponentId, setSelectedComponentId] = useState<string>('policy-engine');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Auto-play through data flow steps
  React.useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % (DATA_FLOW_STEPS.length + 1));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const selectedComponent = ARCHITECTURE_COMPONENTS.find(
    (c) => c.id === selectedComponentId
  ) || ARCHITECTURE_COMPONENTS[2];

  const handleCopyCode = () => {
    if (selectedComponent?.codeSnippet) {
      navigator.clipboard.writeText(selectedComponent.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Step Controls */}
      <div className="glass-panel rounded-2xl p-6 border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30">
                Figure 1 Interactive Architectural Model
              </span>
              <span className="text-xs text-slate-400">4 Cooperating Layers & 7 Real-time Flow Pathways</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 font-sans">
              System Architecture & Control Loop Explorer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Click any architecture node below to inspect its Go controller implementation, CRD YAML manifest, and live telemetry inputs. Or start the Flow Stepper to trace decisions from grid carbon API down to Kubernetes HPA pod tuning.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-white/10 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md ${
                isAutoPlaying
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause Stepper' : 'Auto Play Flow'}</span>
            </button>

            <button
              onClick={() => setActiveStep(0)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              title="Reset flow"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-cyan-300 px-2 font-bold">
              {activeStep === 0 ? 'Full Overview' : `Step ${activeStep}/${DATA_FLOW_STEPS.length}`}
            </span>
          </div>
        </div>

        {/* Step details banner when a step is active */}
        {activeStep > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/95 border border-emerald-500/40 flex items-start sm:items-center justify-between gap-4 shadow-xl animate-beacon">
            <div className="flex items-center gap-3.5">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md">
                {activeStep}
              </span>
              <div>
                <span className="text-sm font-bold text-white block">
                  {DATA_FLOW_STEPS[activeStep - 1].title}
                </span>
                <span className="text-xs text-slate-300 mt-0.5 block leading-normal">
                  {DATA_FLOW_STEPS[activeStep - 1].description}
                </span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <span className="text-emerald-400 font-semibold">{DATA_FLOW_STEPS[activeStep - 1].source}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">{DATA_FLOW_STEPS[activeStep - 1].target}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Architecture Visual Diagram (Mirrors Figure 1 Exactly) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-5">
          <div className="glass-panel rounded-2xl p-6 border-slate-800 relative overflow-hidden bg-slate-950/70">
            {/* Legend & Layer Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> External API
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Control Plane
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> K8s Cluster
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Observability
                </span>
              </div>
              <span className="text-[11px] text-slate-400 italic">Click any component to inspect code & metrics</span>
            </div>

            {/* Architecture SVG Canvas Diagram */}
            <div className="relative w-full overflow-x-auto pb-4">
              <div className="min-w-[720px] max-w-4xl mx-auto space-y-4">
                
                {/* 1. TOP LAYER: Grid Carbon-Intensity API */}
                <div className="flex justify-center">
                  <div
                    onClick={() => setSelectedComponentId('grid-api')}
                    className={`cursor-pointer transition-all rounded-2xl p-4 text-center w-80 border-2 shadow-lg ${
                      selectedComponentId === 'grid-api'
                        ? 'border-rose-400 bg-rose-950/40 glow-rose scale-[1.02]'
                        : 'border-rose-500/40 bg-rose-950/20 hover:border-rose-400/80 hover:bg-rose-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span className="font-bold text-xs sm:text-sm text-rose-200">
                        Grid Carbon-Intensity API
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-300/80 mt-0.5 font-medium">
                      (Electricity Maps / WattTime)
                    </p>
                  </div>
                </div>

                {/* Connecting Arrow: Grid API -> Signal Collector */}
                <div className="flex justify-start pl-36 -my-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-0.5 h-6 ${activeStep === 1 ? 'bg-emerald-400 animate-pulse w-1' : 'bg-rose-500/60'}`} />
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-rose-400" />
                  </div>
                </div>

                {/* MIDDLE CONTAINER: Grid of Control Plane (left/center) + Observability (right) */}
                <div className="grid grid-cols-12 gap-4 items-start">
                  
                  {/* LAYER 2: Carbon Pilot Control Plane (Kubernetes Operator) */}
                  <div className="col-span-8 rounded-2xl p-4 bg-blue-950/20 border-2 border-blue-500/40 relative">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-500/20">
                      <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-400" />
                        Carbon Pilot Control Plane (Kubernetes Operator)
                      </span>
                      <span className="text-[10px] font-mono text-blue-400/80">Namespace: carbon-pilot-system</span>
                    </div>

                    {/* Operator Internal Pipeline: Collector -> Policy Engine -> Reconciler */}
                    <div className="grid grid-cols-3 gap-2.5 items-center">
                      
                      {/* Sub-node: Carbon Signal Collector */}
                      <div
                        onClick={() => setSelectedComponentId('signal-collector')}
                        className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                          selectedComponentId === 'signal-collector'
                            ? 'border-blue-400 bg-blue-900/50 glow-blue scale-105'
                            : 'border-blue-500/30 bg-blue-950/40 hover:border-blue-400/70 hover:bg-blue-900/30'
                        }`}
                      >
                        <Radio className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-white block leading-tight">
                          Carbon Signal Collector
                        </span>
                        <span className="text-[9px] text-blue-300 block mt-1">60s Ingestion</span>
                      </div>

                      {/* Sub-node: Policy Engine (SLO + Carbon) */}
                      <div
                        onClick={() => setSelectedComponentId('policy-engine')}
                        className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                          selectedComponentId === 'policy-engine'
                            ? 'border-emerald-400 bg-emerald-950/60 glow-emerald scale-105 ring-2 ring-emerald-500/40'
                            : 'border-emerald-500/40 bg-emerald-950/30 hover:border-emerald-400/70'
                        }`}
                      >
                        <Cpu className="w-4 h-4 text-emerald-400 mx-auto mb-1 animate-pulse" />
                        <span className="text-[11px] font-bold text-emerald-200 block leading-tight">
                          Policy Engine
                        </span>
                        <span className="text-[9px] text-emerald-300 block mt-0.5">(SLO + Carbon)</span>
                      </div>

                      {/* Sub-node: CRD Controller / Reconciler */}
                      <div
                        onClick={() => setSelectedComponentId('crd-controller')}
                        className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                          selectedComponentId === 'crd-controller'
                            ? 'border-blue-400 bg-blue-900/50 glow-blue scale-105'
                            : 'border-blue-500/30 bg-blue-950/40 hover:border-blue-400/70'
                        }`}
                      >
                        <RotateCw className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-white block leading-tight">
                          CRD Controller / Reconciler
                        </span>
                        <span className="text-[9px] text-blue-300 block mt-1">HPA Mutator</span>
                      </div>
                    </div>

                    {/* Sub-node: CarbonPolicy CRD (Green Pill underneath Policy Engine) */}
                    <div className="mt-4 flex justify-center">
                      <div
                        onClick={() => setSelectedComponentId('carbon-policy-crd')}
                        className={`cursor-pointer px-4 py-2 rounded-full border text-center transition-all flex items-center gap-2 ${
                          selectedComponentId === 'carbon-policy-crd'
                            ? 'border-emerald-400 bg-emerald-900/60 glow-emerald scale-105'
                            : 'border-emerald-500/40 bg-emerald-950/40 hover:border-emerald-400/80 hover:bg-emerald-900/30'
                        }`}
                      >
                        <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">
                          CarbonPolicy CRD
                        </span>
                        <span className="text-[10px] text-emerald-400/80 font-mono">v1alpha1</span>
                      </div>
                    </div>
                  </div>

                  {/* LAYER 4: Observability & Dashboard (Right side) */}
                  <div className="col-span-4 rounded-2xl p-4 bg-purple-950/20 border-2 border-purple-500/40 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        Observability & Dashboard
                      </span>
                    </div>

                    {/* REST API */}
                    <div
                      onClick={() => setSelectedComponentId('rest-api')}
                      className={`cursor-pointer p-2.5 rounded-xl border text-center transition-all ${
                        selectedComponentId === 'rest-api'
                          ? 'border-purple-400 bg-purple-900/50 scale-105'
                          : 'border-purple-500/30 bg-purple-950/40 hover:border-purple-400/70'
                      }`}
                    >
                      <Server className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block">
                        REST API (Backend service)
                      </span>
                      <span className="text-[9px] text-purple-300">Gin / Go Exporter</span>
                    </div>

                    {/* Lower split: Web Dashboard (React) + Time-Series Store */}
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        onClick={() => setSelectedComponentId('web-dashboard')}
                        className={`cursor-pointer p-2 rounded-xl border text-center transition-all ${
                          selectedComponentId === 'web-dashboard'
                            ? 'border-purple-400 bg-purple-900/50 scale-105'
                            : 'border-purple-500/30 bg-purple-950/40 hover:border-purple-400/70'
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                        <span className="text-[10px] font-bold text-white block">
                          Web Dashboard
                        </span>
                        <span className="text-[8px] text-purple-300">(React)</span>
                      </div>

                      <div
                        onClick={() => setSelectedComponentId('time-series-store')}
                        className={`cursor-pointer p-2 rounded-xl border text-center transition-all ${
                          selectedComponentId === 'time-series-store'
                            ? 'border-purple-400 bg-purple-900/50 scale-105'
                            : 'border-purple-500/30 bg-purple-950/40 hover:border-purple-400/70'
                        }`}
                      >
                        <Database className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                        <span className="text-[10px] font-bold text-white block">
                          Time-Series
                        </span>
                        <span className="text-[8px] text-purple-300">Store</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LAYER 3: Kubernetes Cluster (Bottom Layer) */}
                <div className="rounded-2xl p-4 bg-amber-950/15 border-2 border-amber-500/40">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-500/20">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Kubernetes Cluster (Managed Microservices)
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/80">Workload: Online Boutique</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    
                    {/* Metrics Server / Prometheus */}
                    <div
                      onClick={() => setSelectedComponentId('k8s-cluster')}
                      className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                        selectedComponentId === 'k8s-cluster'
                          ? 'border-amber-400 bg-amber-900/40 scale-105'
                          : 'border-amber-500/30 bg-amber-950/30 hover:border-amber-400/70'
                      }`}
                    >
                      <Activity className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block leading-tight">
                        Metrics Server / Prometheus
                      </span>
                      <span className="text-[9px] text-amber-300 block mt-1">CPU, Memory & P99 SLO</span>
                    </div>

                    {/* Horizontal Pod Autoscaler */}
                    <div
                      onClick={() => setSelectedComponentId('hpa-native')}
                      className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                        selectedComponentId === 'hpa-native'
                          ? 'border-amber-400 bg-amber-900/40 scale-105 ring-2 ring-amber-500/40'
                          : 'border-amber-500/30 bg-amber-950/30 hover:border-amber-400/70'
                      }`}
                    >
                      <RotateCw className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block leading-tight">
                        Horizontal Pod Autoscaler
                      </span>
                      <span className="text-[9px] text-amber-300 block mt-1">Tunes Dynamic Thresholds</span>
                    </div>

                    {/* Microservice Deployments (Pods) */}
                    <div
                      onClick={() => setSelectedComponentId('microservices')}
                      className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                        selectedComponentId === 'microservices'
                          ? 'border-amber-400 bg-amber-900/40 scale-105'
                          : 'border-amber-500/30 bg-amber-950/30 hover:border-amber-400/70'
                      }`}
                    >
                      <Boxes className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block leading-tight">
                        Microservice Deployments
                      </span>
                      <span className="text-[9px] text-amber-300 block mt-1">(Pods: 10 Microservices)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Cross-layer Flow Summary */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-300">
                Key Decision Rule:
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">
                TargetCPU = BaseCPU + Δ(CarbonIntensity, SLOMargin)
              </span>
              <span className="text-slate-400">
                Guaranteed: SLO latency ceiling is non-negotiable.
              </span>
            </div>
          </div>
        </div>

        {/* Right Details Panel: Code Snippet & Component Deep Dive */}
        <div className="xl:col-span-4">
          <div className="glass-panel rounded-2xl p-6 border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Code className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedComponent.name}</h3>
                    <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                      Layer: {selectedComponent.layer}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                {selectedComponent.description}
              </p>

              {/* Key Features List */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Key Operational Details:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedComponent.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Tags */}
              <div className="mt-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Technology Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedComponent.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Snippet Box */}
            {selectedComponent.codeSnippet && (
              <div className="mt-6 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px]">
                  <span className="font-mono text-emerald-400 truncate max-w-[200px]">
                    {selectedComponent.codeSnippet.filename}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-all text-[10px]"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56 leading-tight">
                  <code>{selectedComponent.codeSnippet.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
