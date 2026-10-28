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
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
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

  // Status mapping to ensure we honestly state integration status
  const getComponentStatus = (id: string) => {
    switch (id) {
      case 'grid-api':
        return { label: 'Simulated Feed (Electricity Maps API Spec)', type: 'simulated' };
      case 'signal-collector':
        return { label: 'Active (Go / Node Signal Processor)', type: 'active' };
      case 'policy-engine':
        return { label: 'Active (SLO-Bounded Decision Core)', type: 'active' };
      case 'carbon-policy-crd':
        return { label: 'Specification Ready (CRD v1alpha1 Manifest)', type: 'spec' };
      case 'crd-controller':
        return { label: 'Controller Code (Kubebuilder Reconciler)', type: 'code' };
      case 'k8s-cluster':
        return { label: 'Telemetry Stream (Prometheus Metrics)', type: 'active' };
      case 'hpa-native':
        return { label: 'Target Model (k8s autoscaling/v2)', type: 'spec' };
      case 'microservices':
        return { label: 'Online Boutique (10 Polyglot Services)', type: 'active' };
      case 'rest-api':
        return { label: 'Active (REST Endpoints /api/*)', type: 'active' };
      case 'web-dashboard':
        return { label: 'Active (React Enterprise Dashboard)', type: 'active' };
      case 'time-series-store':
        return { label: 'Durable Local Store (JSON / InfluxDB schema)', type: 'active' };
      default:
        return { label: 'Operational', type: 'active' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Step Controls */}
      <div className="enterprise-panel p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-info px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider font-mono">
                Architecture Explorer (Figure 1)
              </span>
              <span className="text-xs text-slate-400">4 Cooperating Layers & 7 Flow Pathways</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Carbon Pilot System Architecture & Data Flow
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Inspect how external grid carbon data, Prometheus SLO metrics, and the custom CarbonPolicy resource flow through the operator reconciler to tune Kubernetes HPA thresholds.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2 bg-[#090f1d] p-1.5 rounded-lg border border-[#1e293b] self-start md:self-auto">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause Stepper' : 'Auto Play Flow'}</span>
            </button>

            <button
              onClick={() => setActiveStep(0)}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs cursor-pointer"
              title="Reset flow to all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-mono text-cyan-300 px-2 font-medium">
              {activeStep === 0 ? 'All Steps' : `Step ${activeStep}/7`}
            </span>
          </div>
        </div>

        {/* Step details banner when a step is active */}
        {activeStep > 0 && (
          <div className="mt-4 p-3.5 rounded-lg bg-[#090f1d] border border-cyan-500/30 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-xs font-mono">
                {activeStep}
              </span>
              <div>
                <span className="text-xs font-bold text-white block">
                  {DATA_FLOW_STEPS[activeStep - 1].title}
                </span>
                <span className="text-xs text-slate-300">
                  {DATA_FLOW_STEPS[activeStep - 1].description}
                </span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-emerald-400">{DATA_FLOW_STEPS[activeStep - 1].source}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="text-cyan-300">{DATA_FLOW_STEPS[activeStep - 1].target}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Diagram & Side Detail Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Diagram Area */}
        <div className="xl:col-span-8 space-y-4">
          <div className="enterprise-panel p-5 relative overflow-hidden">
            
            {/* Diagram Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#1e293b] text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> External API
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Control Plane (Operator)
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> K8s Cluster
                </span>
                <span className="flex items-center gap-1.5 text-violet-300">
                  <span className="w-2 h-2 rounded-full bg-violet-500" /> Observability
                </span>
              </div>
              <span className="text-[11px] text-slate-400 italic">Select any component for inputs & code</span>
            </div>

            {/* Visual Layers Structure */}
            <div className="space-y-4 overflow-x-auto pb-2">
              <div className="min-w-[680px] space-y-4">

                {/* LAYER 1: External Carbon Signal */}
                <div className="flex justify-center">
                  <div
                    onClick={() => setSelectedComponentId('grid-api')}
                    className={`cursor-pointer transition-all rounded-xl p-3.5 text-center w-80 border shadow-md ${
                      selectedComponentId === 'grid-api'
                        ? 'border-rose-400 bg-rose-950/40 ring-1 ring-rose-400/50'
                        : 'border-rose-500/30 bg-rose-950/20 hover:border-rose-400/60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-rose-400" />
                      <span className="font-bold text-xs sm:text-sm text-rose-200">
                        Grid Carbon-Intensity API
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-300/80 mt-0.5">
                      Electricity Maps / WattTime (gCO₂e/kWh)
                    </p>
                  </div>
                </div>

                {/* Arrow down from Grid API to Signal Collector */}
                <div className="flex justify-start pl-36 -my-2.5">
                  <div className="flex flex-col items-center">
                    <div className={`w-0.5 h-6 ${activeStep === 1 ? 'bg-emerald-400 w-1' : 'bg-rose-500/50'}`} />
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-rose-400" />
                  </div>
                </div>

                {/* MIDDLE SPLIT: Operator Control Plane (Left) + Observability (Right) */}
                <div className="grid grid-cols-12 gap-4 items-start">
                  
                  {/* LAYER 2: Operator Control Plane */}
                  <div className="col-span-8 rounded-xl p-4 bg-cyan-950/15 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        Carbon Pilot Control Plane (Kubernetes Operator)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">carbon-pilot-system</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      {/* Signal Collector */}
                      <div
                        onClick={() => setSelectedComponentId('signal-collector')}
                        className={`cursor-pointer p-2.5 rounded-lg border transition-all ${
                          selectedComponentId === 'signal-collector'
                            ? 'border-cyan-400 bg-cyan-900/40 ring-1 ring-cyan-400'
                            : 'border-cyan-500/30 bg-[#0d172c] hover:border-cyan-400/60'
                        }`}
                      >
                        <Radio className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-white block">
                          Signal Collector
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Smoothing & Ingestion</span>
                      </div>

                      {/* Policy Engine */}
                      <div
                        onClick={() => setSelectedComponentId('policy-engine')}
                        className={`cursor-pointer p-2.5 rounded-lg border transition-all ${
                          selectedComponentId === 'policy-engine'
                            ? 'border-emerald-400 bg-emerald-950/50 ring-1 ring-emerald-400'
                            : 'border-emerald-500/30 bg-[#0d172c] hover:border-emerald-400/60'
                        }`}
                      >
                        <Cpu className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-emerald-200 block">
                          Policy Engine
                        </span>
                        <span className="text-[9px] text-emerald-300/80 block mt-0.5">(SLO + Carbon)</span>
                      </div>

                      {/* Reconciler */}
                      <div
                        onClick={() => setSelectedComponentId('crd-controller')}
                        className={`cursor-pointer p-2.5 rounded-lg border transition-all ${
                          selectedComponentId === 'crd-controller'
                            ? 'border-cyan-400 bg-cyan-900/40 ring-1 ring-cyan-400'
                            : 'border-cyan-500/30 bg-[#0d172c] hover:border-cyan-400/60'
                        }`}
                      >
                        <RotateCw className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-white block">
                          CRD Reconciler
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">HPA Tuner</span>
                      </div>
                    </div>

                    {/* CarbonPolicy CRD Pill */}
                    <div className="pt-2 flex justify-center">
                      <div
                        onClick={() => setSelectedComponentId('carbon-policy-crd')}
                        className={`cursor-pointer px-4 py-1.5 rounded-full border text-center transition-all flex items-center gap-2 ${
                          selectedComponentId === 'carbon-policy-crd'
                            ? 'border-emerald-400 bg-emerald-950/60 ring-1 ring-emerald-400'
                            : 'border-emerald-500/30 bg-emerald-950/30 hover:border-emerald-400/60'
                        }`}
                      >
                        <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">
                          CarbonPolicy CRD
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">v1alpha1</span>
                      </div>
                    </div>
                  </div>

                  {/* LAYER 4: Observability */}
                  <div className="col-span-4 rounded-xl p-4 bg-violet-950/15 border border-violet-500/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-violet-500/20">
                      <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-violet-400" />
                        Observability Layer
                      </span>
                    </div>

                    {/* REST API */}
                    <div
                      onClick={() => setSelectedComponentId('rest-api')}
                      className={`cursor-pointer p-2.5 rounded-lg border text-center transition-all ${
                        selectedComponentId === 'rest-api'
                          ? 'border-violet-400 bg-violet-950/50 ring-1 ring-violet-400'
                          : 'border-violet-500/30 bg-[#0d172c] hover:border-violet-400/60'
                      }`}
                    >
                      <Server className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block">
                        REST API (Backend)
                      </span>
                      <span className="text-[9px] text-slate-400">Gin / Node.js Engine</span>
                    </div>

                    {/* Sub-split: Dashboard & Time Series */}
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        onClick={() => setSelectedComponentId('web-dashboard')}
                        className={`cursor-pointer p-2 rounded-lg border text-center transition-all ${
                          selectedComponentId === 'web-dashboard'
                            ? 'border-violet-400 bg-violet-950/50'
                            : 'border-violet-500/30 bg-[#0d172c] hover:border-violet-400/60'
                        }`}
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-violet-400 mx-auto mb-1" />
                        <span className="text-[10px] font-bold text-white block">Dashboard</span>
                        <span className="text-[8px] text-slate-400">(React)</span>
                      </div>

                      <div
                        onClick={() => setSelectedComponentId('time-series-store')}
                        className={`cursor-pointer p-2 rounded-lg border text-center transition-all ${
                          selectedComponentId === 'time-series-store'
                            ? 'border-violet-400 bg-violet-950/50'
                            : 'border-violet-500/30 bg-[#0d172c] hover:border-violet-400/60'
                        }`}
                      >
                        <Database className="w-3.5 h-3.5 text-violet-400 mx-auto mb-1" />
                        <span className="text-[10px] font-bold text-white block">Time-Series</span>
                        <span className="text-[8px] text-slate-400">Store</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* LAYER 3: Kubernetes Cluster */}
                <div className="rounded-xl p-4 bg-amber-950/15 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Kubernetes Cluster (Managed Microservices)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Workload: Online Boutique</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div
                      onClick={() => setSelectedComponentId('k8s-cluster')}
                      className={`cursor-pointer p-2.5 rounded-lg border text-center transition-all ${
                        selectedComponentId === 'k8s-cluster'
                          ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400'
                          : 'border-amber-500/30 bg-[#0d172c] hover:border-amber-400/60'
                      }`}
                    >
                      <Activity className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block">
                        Prometheus Telemetry
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">CPU & P99 Latency</span>
                    </div>

                    <div
                      onClick={() => setSelectedComponentId('hpa-native')}
                      className={`cursor-pointer p-2.5 rounded-lg border text-center transition-all ${
                        selectedComponentId === 'hpa-native'
                          ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400'
                          : 'border-amber-500/30 bg-[#0d172c] hover:border-amber-400/60'
                      }`}
                    >
                      <RotateCw className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block">
                        Horizontal Pod Autoscaler
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Native k8s HPA v2</span>
                    </div>

                    <div
                      onClick={() => setSelectedComponentId('microservices')}
                      className={`cursor-pointer p-2.5 rounded-lg border text-center transition-all ${
                        selectedComponentId === 'microservices'
                          ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400'
                          : 'border-amber-500/30 bg-[#0d172c] hover:border-amber-400/60'
                      }`}
                    >
                      <Boxes className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-white block">
                        Microservice Pods
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Elastic Deployments</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg enterprise-subtle flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Design Rule:</span>
              <span className="font-mono text-emerald-400 text-[11px]">
                TargetCPU = BaseCPU + Δ(Carbon, LatencySlack)
              </span>
              <span>SLO performance takes precedence over carbon optimization.</span>
            </div>
          </div>
        </div>

        {/* Right Detail Panel: Inputs, Outputs, Status & Actual Manifest Code */}
        <div className="xl:col-span-4">
          <div className="enterprise-panel p-5 h-full flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedComponent.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    Layer: {selectedComponent.layer}
                  </span>
                </div>
                <span className="badge-info px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                  {getComponentStatus(selectedComponent.id).label}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedComponent.description}
              </p>

              {/* Responsibilities */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Operational Responsibilities:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedComponent.details.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technology Stack Tags */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Component Technologies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedComponent.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#090f1d] border border-[#1e293b] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Snippet Box */}
            {selectedComponent.codeSnippet && (
              <div className="rounded-lg bg-[#050811] border border-[#1e293b] overflow-hidden mt-4">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#090f1d] border-b border-[#1e293b] text-[10px]">
                  <span className="font-mono text-emerald-400 truncate max-w-[180px]">
                    {selectedComponent.codeSnippet.filename}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
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
