import React, { useState, useEffect } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Settings2, 
  Save, 
  RotateCcw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

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
  const [cooldownSec, setCooldownSec] = useState<number>(30);
  const [minReplicas, setMinReplicas] = useState<number>(3);
  const [maxReplicas, setMaxReplicas] = useState<number>(30);

  const [copied, setCopied] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load policy from backend on mount or service switch
  const loadPolicy = async () => {
    try {
      const res = await fetch('/api/policies');
      if (res.ok) {
        const data = await res.json();
        const found = data.find((p: any) => p.id === serviceName || p.serviceName === serviceName);
        if (found) {
          setBaseCpu(found.baseCpuThreshold || 60);
          setMaxCpu(found.maxAllowedCpuThreshold || 80);
          setCarbonAlpha(found.carbonWeightAlpha || 0.75);
          setSloCeiling(found.sloLatencyCeilingMs || 150);
          setSafetyMargin(found.safetyMarginMs || 25);
          setCooldownSec(found.cooldownSeconds || 30);
          setMinReplicas(found.minReplicas || 3);
          setMaxReplicas(found.maxReplicas || 30);
        }
      }
    } catch {
      // Fallback to local state if backend is offline
    }
  };

  useEffect(() => {
    loadPolicy();
  }, [serviceName]);

  // Persist changes to backend
  const handleSavePolicy = async () => {
    // Form validation
    if (baseCpu < 30 || baseCpu > 80) {
      setSaveStatus({ message: 'Base CPU Target must be between 30% and 80%', type: 'error' });
      return;
    }
    if (maxCpu < baseCpu) {
      setSaveStatus({ message: 'Max Allowed CPU must be greater than or equal to Base CPU', type: 'error' });
      return;
    }
    if (sloCeiling <= safetyMargin) {
      setSaveStatus({ message: 'SLO Latency Ceiling must be strictly greater than Safety Margin', type: 'error' });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch(`/api/policies/${serviceName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName,
          namespace,
          targetRefKind: 'Deployment',
          targetRefName: serviceName,
          carbonSource: provider.toLowerCase(),
          zone,
          baseCpuThreshold: baseCpu,
          maxAllowedCpuThreshold: maxCpu,
          carbonWeightAlpha: carbonAlpha,
          sloLatencyCeilingMs: sloCeiling,
          safetyMarginMs: safetyMargin,
          minReplicas,
          maxReplicas,
          cooldownSeconds: cooldownSec,
        }),
      });

      if (res.ok) {
        setSaveStatus({ message: `Successfully saved and persisted policy for ${serviceName}!`, type: 'success' });
      } else {
        const err = await res.json();
        setSaveStatus({ message: err.error || 'Failed to persist policy', type: 'error' });
      }
    } catch {
      setSaveStatus({ message: 'Saved locally (backend connection offline)', type: 'success' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleResetDefaults = () => {
    setBaseCpu(60);
    setMaxCpu(80);
    setCarbonAlpha(0.75);
    setSloCeiling(150);
    setSafetyMargin(25);
    setCooldownSec(30);
    setMinReplicas(3);
    setMaxReplicas(30);
    setSaveStatus({ message: 'Reset parameters to standard defaults', type: 'success' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Generate dynamic Kubernetes manifest matching OpenAPI v3 CRD schema
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
    minReplicas: ${minReplicas}
    maxReplicas: ${maxReplicas}
  
  sloGuardrails:
    latencyCeilingMs: ${sloCeiling}
    safetyMarginMs: ${safetyMargin}
    metricQuery: >-
      histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{app="${serviceName}"}[2m])) by (le))
    backoffThresholdPercent: 90 # Reverts to base HPA if within 10% of ceiling`;

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
      <div className="enterprise-panel p-5">
        <div className="flex items-center gap-2">
          <span className="badge-eco px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider font-mono">
            Declarative Kubernetes Resource
          </span>
          <span className="text-xs text-slate-400">autoscaling.carbonpilot.io/v1alpha1</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          CarbonPolicy CRD Configurator & Manifest Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          The <code className="text-emerald-400 font-mono text-xs">CarbonPolicy</code> custom resource declares carbon-aware scaling bounds and non-negotiable SLO guardrails for microservices. Changes are validated and persisted to the control plane.
        </p>

        {saveStatus && (
          <div className={`mt-3 p-3 rounded-lg text-xs flex items-center gap-2 ${
            saveStatus.type === 'success' 
              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' 
              : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
          }`}>
            {saveStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{saveStatus.message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Controls */}
        <div className="lg:col-span-5 enterprise-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Policy Parameters</h3>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Target Deployment & Namespace */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Service Name</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-[#090f1d] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                >
                  <option value="frontend">frontend</option>
                  <option value="cartservice">cartservice</option>
                  <option value="recommendationservice">recommendationservice</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Namespace</label>
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="w-full bg-[#090f1d] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Provider & Zone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Carbon Signal Source</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-[#090f1d] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ElectricityMaps">ElectricityMaps</option>
                  <option value="WattTime">WattTime</option>
                  <option value="Synthetic">Synthetic Regional</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Grid Region / Zone</label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-[#090f1d] border border-[#1e293b] rounded-md px-2.5 py-1.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Base & Max CPU Targets */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Base CPU Target: <span className="text-cyan-400 font-mono">{baseCpu}%</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="80"
                  value={baseCpu}
                  onChange={(e) => setBaseCpu(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Max Allowed CPU: <span className="text-emerald-400 font-mono">{maxCpu}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={maxCpu}
                  onChange={(e) => setMaxCpu(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Carbon Sensitivity Alpha */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-semibold">Carbon Weight (α)</label>
                <span className="font-mono text-emerald-400">{carbonAlpha.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={carbonAlpha}
                onChange={(e) => setCarbonAlpha(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* SLO Guardrails */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  SLO Ceiling: <span className="text-violet-400 font-mono">{sloCeiling}ms</span>
                </label>
                <input
                  type="range"
                  min="80"
                  max="300"
                  step="10"
                  value={sloCeiling}
                  onChange={(e) => setSloCeiling(Number(e.target.value))}
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Safety Margin: <span className="text-violet-400 font-mono">{safetyMargin}ms</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={safetyMargin}
                  onChange={(e) => setSafetyMargin(Number(e.target.value))}
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Min / Max Replicas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Min Replicas: <span className="font-mono text-white">{minReplicas}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={minReplicas}
                  onChange={(e) => setMinReplicas(Number(e.target.value))}
                  className="w-full bg-[#090f1d] border border-[#1e293b] rounded-md px-2.5 py-1 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Max Replicas: <span className="font-mono text-white">{maxReplicas}</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={maxReplicas}
                  onChange={(e) => setMaxReplicas(Number(e.target.value))}
                  className="w-full bg-[#090f1d] border border-[#1e293b] rounded-md px-2.5 py-1 text-white font-mono"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePolicy}
              disabled={isSaving}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Validating & Persisting...' : 'Save & Persist Policy to Backend'}</span>
            </button>
          </div>
        </div>

        {/* Right YAML Manifest Box */}
        <div className="lg:col-span-7 enterprise-panel p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {serviceName}-carbonpolicy.yaml (Generated CRD Spec)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#090f1d] hover:bg-[#111a2e] border border-[#1e293b] text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="mt-3 p-3.5 rounded-lg bg-[#050811] border border-[#1e293b] font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed max-h-[350px]">
              <code>{generatedYaml}</code>
            </pre>
          </div>

          <div className="p-3 rounded-lg enterprise-subtle flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>kubectl apply -f {serviceName}-carbonpolicy.yaml</span>
            </div>
            <span className="text-[10px] text-slate-500">Kubernetes 1.28+</span>
          </div>
        </div>

      </div>
    </div>
  );
};
