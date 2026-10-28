export type ThemeColor = 'emerald' | 'cyan' | 'borealis' | 'amber';

export interface GridRegion {
  id: string;
  name: string;
  code: string;
  country: string;
  currentIntensity: number; // gCO2eq/kWh
  status: 'low' | 'moderate' | 'high' | 'critical';
  renewablePercentage: number;
  energyMix: {
    solar: number;
    wind: number;
    hydro: number;
    nuclear: number;
    gas: number;
    coal: number;
  };
  hourlyTrend: number[]; // 24-hour trace
}

export interface MicroserviceDeployment {
  id: string;
  name: string;
  tier: 'frontend' | 'core' | 'supporting';
  rps: number;
  cpuBaselineUsagePercent: number;
  currentCpuPercent: number;
  baselineReplicas: number;
  carbonPilotReplicas: number;
  minReplicas: number;
  maxReplicas: number;
  targetLatencyMs: number; // SLO ceiling
  baselineLatencyP99: number;
  carbonPilotLatencyP99: number;
  carbonSavedGramsPerMin: number;
  status: 'optimal' | 'throttling-safe' | 'scaling-down' | 'scaling-up';
}

export interface CarbonPolicyConfig {
  serviceName: string;
  namespace: string;
  targetRefKind: string;
  targetRefName: string;
  carbonSource: 'electricity-maps' | 'watttime' | 'synthetic';
  zone: string;
  baseCpuThreshold: number; // default 60%
  maxAllowedCpuThreshold: number; // e.g. 80% under peak carbon
  carbonWeightAlpha: number; // 0.0 - 1.0
  sloLatencyCeilingMs: number; // e.g. 200ms
  latencySafetyMarginPercent: number; // e.g. 25% margin
  dampeningWindowSeconds: number; // cool down window
  ecoLagTolerance: number;
}

export interface ReconcilerEvent {
  id: string;
  timestamp: string;
  service: string;
  type: 'POLICY_UPDATE' | 'HPA_TUNED' | 'SCALE_DOWN' | 'SCALE_UP' | 'SLO_GUARD_ACTIVE' | 'POLL_GRID';
  severity: 'info' | 'success' | 'warning' | 'alert';
  message: string;
  carbonIntensity: number;
  hpaThresholdChange?: string;
  replicaChange?: string;
  sloMarginMs: number;
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  layer: 'external' | 'control-plane' | 'kubernetes' | 'observability';
  icon: string;
  description: string;
  details: string[];
  techStack: string[];
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
}

export interface TechStackItem {
  name: string;
  category: 'Frontend' | 'Backend / Core' | 'DevOps & Infra' | 'Alternative Stack';
  role: string;
  badge: string;
  version?: string;
  keyFeatures: string[];
  codeExample?: string;
}

export interface BenchmarkMetrics {
  metric: string;
  standardHPA: string;
  carbonPilot: string;
  improvement: string;
  verdict: 'superior' | 'equal' | 'acceptable';
  unit: string;
}
