import React, { useState } from 'react';
import { FileCode2, Copy, Check, Download, Terminal, Settings2, Sliders } from 'lucide-react';

export const CrdInspector: React.FC = () => {
  const [serviceName, setServiceName] = useState<string>('frontend');
  const [namespace, setNamespace] = useState<string>('boutique');
  const [provider, setProvider] = useState<string>('ElectricityMaps');
  const [zone, setZone] = useState<string>('US-VA');
  const [baseCpu, setBaseCpu] = useState<number>(60);
  const [maxCpu, setMaxCpu] = useState<number>(80);
  const [carbonAlpha, setCarbonAlpha] = useState<number>(0.75);
  const [sloCeiling, setSloCeiling] = useState<number>(150);
  const [safetyMargin, setSafetyMargin] = useState<number>(25);
  const [cooldownSec, setCooldownSec] = useState<number>(300);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate dynamic YAML
  const generatedYaml = `apiVersion: autoscaling.carbonpilot.io/v1alpha1
kind: CarbonPolicy
metadata:
  name: ${serviceName}-carbon-policy
  namespace: ${namespace}
  labels:
    app.kubernetes.io/managed-by: carbon-pilot-operator
    app.kubernetes.io/component: autoscaler-policy
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${serviceName}
  
  carbonSignal:
    provider: ${provider}
    zone: ${zone}
    cacheTtlSeconds: 60
    smoothingFactorEma: 0.25
  
  scalingTuning:
    baseCpuUtilizationPercent: ${baseCpu}
    maxAllowedCpuUtilizationPercent: ${maxCpu}
    carbonSensitivityAlpha: ${carbonAlpha.toFixed(2)}
    dampeningCooldownSeconds: ${cooldownSec}
  
  sloGuardrails:
    latencyCeilingMs: ${sloCeiling}
    safetyMarginMs: ${safetyMargin}
    metricQuery: >-
      histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{app="${serviceName}"}[2m])) by (le))
    backoffThresholdPercent: 90 # Restores baseline if within 10% of ceiling`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serviceName}-carbonpolicy.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Kubernetes Native Custom Resource
          </span>
          <span className="text-xs text-slate-400">Declarative GitOps Configuration</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          CarbonPolicy CRD Configurator & Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          The <code className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded font-mono text-xs">CarbonPolicy</code> CRD
          stores desired carbon-aware autoscaling parameters in a declarative, Kubernetes-native schema compatible with ArgoCD and Helm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Controls */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Settings2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Policy Parameters</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Service & Namespace */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Service Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Namespace</label>
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Provider & Zone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Carbon Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ElectricityMaps">ElectricityMaps</option>
                  <option value="WattTime">WattTime</option>
                  <option value="SyntheticGrid">SyntheticGrid</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Grid Zone Code</label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Base & Max CPU */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Base CPU Target: <span className="text-emerald-400 font-mono">{baseCpu}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="70"
                  value={baseCpu}
                  onChange={(e) => setBaseCpu(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Max Eco CPU: <span className="text-emerald-400 font-mono">{maxCpu}%</span>
                </label>
                <input
                  type="range"
                  min="65"
                  max="90"
                  value={maxCpu}
                  onChange={(e) => setMaxCpu(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            {/* Carbon Sensitivity Alpha */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-semibold">Carbon Sensitivity Weight (α)</label>
                <span className="font-mono text-emerald-400">{carbonAlpha.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={carbonAlpha}
                onChange={(e) => setCarbonAlpha(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* SLO Guardrails */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  SLO Ceiling: <span className="text-teal-400 font-mono">{sloCeiling}ms</span>
                </label>
                <input
                  type="range"
                  min="60"
                  max="300"
                  step="10"
                  value={sloCeiling}
                  onChange={(e) => setSloCeiling(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Safety Margin: <span className="text-teal-400 font-mono">{safetyMargin}ms</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={safetyMargin}
                  onChange={(e) => setSafetyMargin(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>
            </div>

            {/* Dampening Cooldown */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-semibold">Hysteresis Cooldown</label>
                <span className="font-mono text-slate-300">{cooldownSec}s (5 min)</span>
              </div>
              <input
                type="range"
                min="60"
                max="900"
                step="60"
                value={cooldownSec}
                onChange={(e) => setCooldownSec(Number(e.target.value))}
                className="w-full accent-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Right YAML Code Manifest */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {serviceName}-carbonpolicy.yaml (Generated Manifest)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy YAML'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed max-h-[380px]">
              <code>{generatedYaml}</code>
            </pre>
          </div>

          {/* Quick Apply CLI Snippet */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">kubectl apply -f {serviceName}-carbonpolicy.yaml</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`kubectl apply -f ${serviceName}-carbonpolicy.yaml`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-emerald-400 hover:text-emerald-300 flex-shrink-0 text-[11px]"
            >
              Copy Command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
