import { GridRegion, MicroserviceDeployment, CarbonPolicyConfig, ArchitectureComponent, TechStackItem, BenchmarkMetrics } from '../types';

export const INITIAL_REGIONS: GridRegion[] = [
  {
    id: 'us-east-va',
    name: 'US East (N. Virginia)',
    code: 'US-VA / PJM',
    country: 'United States',
    currentIntensity: 435, // gCO2/kWh
    status: 'high',
    renewablePercentage: 21,
    energyMix: {
      solar: 7,
      wind: 4,
      hydro: 10,
      nuclear: 33,
      gas: 35,
      coal: 11
    },
    hourlyTrend: [380, 395, 410, 430, 450, 465, 455, 435, 420, 390, 370, 355, 360, 385, 415, 445, 460, 450, 435, 420, 410, 395, 385, 380]
  },
  {
    id: 'eu-west-de',
    name: 'Europe Central (Frankfurt)',
    code: 'DE-LU',
    country: 'Germany',
    currentIntensity: 310,
    status: 'moderate',
    renewablePercentage: 48,
    energyMix: {
      solar: 18,
      wind: 24,
      hydro: 6,
      nuclear: 0,
      gas: 22,
      coal: 30
    },
    hourlyTrend: [340, 350, 360, 355, 340, 310, 260, 210, 185, 170, 180, 215, 265, 310, 345, 370, 360, 330, 310, 315, 325, 335, 340, 340]
  },
  {
    id: 'eu-north-se',
    name: 'Europe North (Stockholm)',
    code: 'SE-1 / NordPool',
    country: 'Sweden',
    currentIntensity: 28,
    status: 'low',
    renewablePercentage: 94,
    energyMix: {
      solar: 2,
      wind: 28,
      hydro: 64,
      nuclear: 6,
      gas: 0,
      coal: 0
    },
    hourlyTrend: [24, 25, 26, 25, 27, 28, 29, 31, 30, 28, 27, 26, 25, 26, 27, 29, 30, 29, 28, 27, 26, 25, 24, 24]
  },
  {
    id: 'us-west-ca',
    name: 'US West (California)',
    code: 'US-CA / CAISO',
    country: 'United States',
    currentIntensity: 185,
    status: 'low',
    renewablePercentage: 62,
    energyMix: {
      solar: 42,
      wind: 12,
      hydro: 8,
      nuclear: 11,
      gas: 27,
      coal: 0
    },
    hourlyTrend: [280, 295, 310, 320, 290, 220, 150, 95, 75, 65, 80, 110, 145, 185, 240, 310, 340, 330, 310, 295, 285, 280, 275, 280]
  },
  {
    id: 'ap-south-in',
    name: 'Asia South (Mumbai)',
    code: 'IN-WEST',
    country: 'India',
    currentIntensity: 620,
    status: 'critical',
    renewablePercentage: 19,
    energyMix: {
      solar: 11,
      wind: 6,
      hydro: 2,
      nuclear: 2,
      gas: 8,
      coal: 71
    },
    hourlyTrend: [590, 600, 610, 625, 640, 650, 630, 610, 580, 560, 550, 565, 590, 620, 645, 660, 650, 640, 630, 620, 610, 600, 595, 590]
  }
];

export const INITIAL_MICROSERVICES: MicroserviceDeployment[] = [
  {
    id: 'frontend',
    name: 'frontend',
    tier: 'frontend',
    rps: 1240,
    cpuBaselineUsagePercent: 62,
    currentCpuPercent: 74,
    baselineReplicas: 14,
    carbonPilotReplicas: 10,
    minReplicas: 3,
    maxReplicas: 30,
    targetLatencyMs: 150,
    baselineLatencyP99: 98,
    carbonPilotLatencyP99: 114,
    carbonSavedGramsPerMin: 148.2,
    status: 'optimal'
  },
  {
    id: 'cartservice',
    name: 'cartservice',
    tier: 'core',
    rps: 890,
    cpuBaselineUsagePercent: 55,
    currentCpuPercent: 72,
    baselineReplicas: 10,
    carbonPilotReplicas: 7,
    minReplicas: 2,
    maxReplicas: 20,
    targetLatencyMs: 120,
    baselineLatencyP99: 45,
    carbonPilotLatencyP99: 62,
    carbonSavedGramsPerMin: 112.5,
    status: 'throttling-safe'
  },
  {
    id: 'productcatalogservice',
    name: 'productcatalogservice',
    tier: 'core',
    rps: 1650,
    cpuBaselineUsagePercent: 58,
    currentCpuPercent: 76,
    baselineReplicas: 12,
    carbonPilotReplicas: 9,
    minReplicas: 2,
    maxReplicas: 25,
    targetLatencyMs: 80,
    baselineLatencyP99: 32,
    carbonPilotLatencyP99: 44,
    carbonSavedGramsPerMin: 120.0,
    status: 'optimal'
  },
  {
    id: 'checkoutservice',
    name: 'checkoutservice',
    tier: 'core',
    rps: 310,
    cpuBaselineUsagePercent: 48,
    currentCpuPercent: 65,
    baselineReplicas: 8,
    carbonPilotReplicas: 6,
    minReplicas: 2,
    maxReplicas: 15,
    targetLatencyMs: 250,
    baselineLatencyP99: 130,
    carbonPilotLatencyP99: 158,
    carbonSavedGramsPerMin: 85.4,
    status: 'optimal'
  },
  {
    id: 'recommendationservice',
    name: 'recommendationservice',
    tier: 'supporting',
    rps: 920,
    cpuBaselineUsagePercent: 68,
    currentCpuPercent: 82,
    baselineReplicas: 16,
    carbonPilotReplicas: 10,
    minReplicas: 2,
    maxReplicas: 30,
    targetLatencyMs: 300,
    baselineLatencyP99: 140,
    carbonPilotLatencyP99: 195,
    carbonSavedGramsPerMin: 215.8,
    status: 'throttling-safe'
  },
  {
    id: 'paymentservice',
    name: 'paymentservice',
    tier: 'core',
    rps: 240,
    cpuBaselineUsagePercent: 42,
    currentCpuPercent: 58,
    baselineReplicas: 6,
    carbonPilotReplicas: 5,
    minReplicas: 2,
    maxReplicas: 12,
    targetLatencyMs: 200,
    baselineLatencyP99: 85,
    carbonPilotLatencyP99: 98,
    carbonSavedGramsPerMin: 42.0,
    status: 'optimal'
  },
  {
    id: 'shippingservice',
    name: 'shippingservice',
    tier: 'supporting',
    rps: 410,
    cpuBaselineUsagePercent: 51,
    currentCpuPercent: 69,
    baselineReplicas: 7,
    carbonPilotReplicas: 5,
    minReplicas: 2,
    maxReplicas: 15,
    targetLatencyMs: 220,
    baselineLatencyP99: 90,
    carbonPilotLatencyP99: 112,
    carbonSavedGramsPerMin: 68.3,
    status: 'optimal'
  },
  {
    id: 'adservice',
    name: 'adservice',
    tier: 'supporting',
    rps: 750,
    cpuBaselineUsagePercent: 54,
    currentCpuPercent: 78,
    baselineReplicas: 9,
    carbonPilotReplicas: 6,
    minReplicas: 1,
    maxReplicas: 15,
    targetLatencyMs: 150,
    baselineLatencyP99: 65,
    carbonPilotLatencyP99: 94,
    carbonSavedGramsPerMin: 98.7,
    status: 'optimal'
  }
];

export const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: 'grid-api',
    name: 'Grid Carbon-Intensity API',
    layer: 'external',
    icon: 'Zap',
    description: 'External real-time carbon data source providing regional grid intensity feeds (Electricity Maps & WattTime).',
    details: [
      'Polls electricity generation fuel mix (solar, wind, hydro, gas, coal)',
      'Provides marginal and average emissions signals in gCO2eq/kWh',
      'Supports automated regional fallback and offline trend caching'
    ],
    techStack: ['Electricity Maps REST API', 'WattTime V3 Grid API', 'HTTPS / JSON Client'],
    codeSnippet: {
      language: 'go',
      filename: 'collector/provider_electricitymaps.go',
      code: `type CarbonIntensityResponse struct {
    Zone      string    \`json:"zone"\`
    CarbonIntensity float64 \`json:"carbonIntensity"\`
    Datetime  time.Time \`json:"datetime"\`
    Updated   time.Time \`json:"updatedAt"\`
    IsEstimated bool   \`json:"isEstimated"\`
}

func (c *Collector) FetchLiveIntensity(ctx context.Context, zone string) (float64, error) {
    req, _ := http.NewRequestWithContext(ctx, "GET", 
        fmt.Sprintf("https://api.electricitymap.org/v3/carbon-intensity/latest?zone=%s", zone), nil)
    req.Header.Set("auth-token", c.apiKey)
    resp, err := c.httpClient.Do(req)
    // ... parse & normalize reading
    return data.CarbonIntensity, nil
}`
    }
  },
  {
    id: 'signal-collector',
    name: 'Carbon Signal Collector',
    layer: 'control-plane',
    icon: 'Radio',
    description: 'Polls the carbon API on fixed interval, normalizes the signal, and injects moving averages into the Policy Engine.',
    details: [
      'Configurable polling interval (default: 60s, adaptive under high volatility)',
      'Exponential Moving Average (EMA) smoothing to prevent micro-fluctuations',
      'Emits Prometheus metrics: carbonpilot_grid_intensity_gco2_kwh'
    ],
    techStack: ['Go goroutines', 'Sync mutex caches', 'Prometheus client_golang'],
    codeSnippet: {
      language: 'go',
      filename: 'operator/signal_collector.go',
      code: `func (sc *SignalCollector) Start(ctx context.Context) {
    ticker := time.NewTicker(sc.PollInterval)
    defer ticker.Stop()
    for {
        select {
        case <-ctx.Done():
            return
        case <-ticker.C:
            reading, err := sc.provider.FetchLiveIntensity(ctx, sc.Zone)
            if err == nil {
                sc.smoothedIntensity = (sc.alpha * reading) + ((1 - sc.alpha) * sc.smoothedIntensity)
                sc.channel <- sc.smoothedIntensity
                metrics.GridCarbonIntensityGauge.Set(sc.smoothedIntensity)
            }
        }
    }
}`
    }
  },
  {
    id: 'policy-engine',
    name: 'Policy Engine (SLO + Carbon)',
    layer: 'control-plane',
    icon: 'Cpu',
    description: 'The decision-making core. Calculates optimal HPA target CPU thresholds by blending carbon penalty with strict SLO latency constraints.',
    details: [
      'Mathematical formulation: TargetCPU = BaseCPU + Δ(Carbon, LatencySlack)',
      'Enforces non-negotiable SLO ceiling: if P99 latency approaches margin, eco-tuning backs off',
      'Calculates replica bounds and hysteresis dampening windows'
    ],
    techStack: ['Go Algorithm Engine', 'SLO Guardrail Evaluator', 'Math model'],
    codeSnippet: {
      language: 'go',
      filename: 'policy/evaluator.go',
      code: `// ComputeCarbonAwareTarget computes dynamic HPA CPU target
func (pe *PolicyEngine) ComputeTarget(policy *v1alpha1.CarbonPolicy, liveMetrics ServiceMetrics) int32 {
    latencySlack := policy.Spec.SloLatencyCeilingMs - liveMetrics.P99LatencyMs
    if latencySlack <= float64(policy.Spec.SloSafetyMarginMs) {
        // Latency at risk: prioritize SLO over carbon savings immediately
        return policy.Spec.BaseCpuThreshold
    }
    // High carbon intensity allows raising CPU threshold to reduce replica bloat
    normalizedCarbon := math.Min(1.0, liveMetrics.GridIntensity / 600.0)
    allowedBoost := float64(policy.Spec.MaxCpuThreshold - policy.Spec.BaseCpuThreshold)
    adjusted := float64(policy.Spec.BaseCpuThreshold) + (allowedBoost * normalizedCarbon * policy.Spec.WeightAlpha)
    return int32(math.Round(adjusted))
}`
    }
  },
  {
    id: 'carbon-policy-crd',
    name: 'CarbonPolicy CRD',
    layer: 'control-plane',
    icon: 'FileCode2',
    description: 'Kubernetes Custom Resource Definition storing declarative autoscaling rules, SLO ceilings, and carbon weighting for each microservice.',
    details: [
      'Group: autoscaling.carbonpilot.io/v1alpha1',
      'TargetRef to existing Deployment / HPA objects',
      'Fully declarative, GitOps-compatible (ArgoCD / Flux)'
    ],
    techStack: ['CRD OpenAPI v3 schema', 'Kubebuilder markers', 'YAML Manifests'],
    codeSnippet: {
      language: 'yaml',
      filename: 'config/samples/carbonpolicy_boutique.yaml',
      code: `apiVersion: autoscaling.carbonpilot.io/v1alpha1
kind: CarbonPolicy
metadata:
  name: frontend-carbon-policy
  namespace: boutique
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  carbonSource:
    provider: ElectricityMaps
    zone: US-VA
  thresholds:
    baseCpuPercent: 60
    maxAllowedCpuPercent: 80
    carbonWeightAlpha: 0.75
  sloGuardrails:
    latencyCeilingMs: 150
    safetyMarginMs: 25
    metricQuery: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{app="frontend"}[2m])) by (le))`
    }
  },
  {
    id: 'crd-controller',
    name: 'CRD Controller / Reconciler',
    layer: 'control-plane',
    icon: 'RotateCw',
    description: 'Kubernetes controller reconciliation loop. Watches CarbonPolicy and HPA objects, continuously applying dynamic threshold changes.',
    details: [
      'Reconciles desired state with cluster reality',
      'Patches HPA targetAverageUtilization without restarting pods',
      'Dispatches events to REST API and Kubernetes event recorder'
    ],
    techStack: ['Go (Golang)', 'Kubebuilder / Operator SDK', 'client-go'],
    codeSnippet: {
      language: 'go',
      filename: 'controllers/carbonpolicy_controller.go',
      code: `func (r *CarbonPolicyReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    var policy carbonv1alpha1.CarbonPolicy
    if err := r.Get(ctx, req.NamespacedName, &policy); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    // Fetch live SLO metrics & grid carbon
    targetCpu := r.PolicyEngine.ComputeTarget(&policy, r.getLiveMetrics(ctx, &policy))
    
    // Patch existing HorizontalPodAutoscaler
    var hpa autoscalingv2.HorizontalPodAutoscaler
    if err := r.Get(ctx, types.NamespacedName{Namespace: policy.Namespace, Name: policy.Spec.TargetRef.Name}, &hpa); err == nil {
        hpa.Spec.Metrics[0].Resource.Target.AverageUtilization = &targetCpu
        r.Update(ctx, &hpa)
        r.RecordEvent(&policy, "Normal", "HPATuned", fmt.Sprintf("Adjusted target CPU to %d%%", targetCpu))
    }
    return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
}`
    }
  },
  {
    id: 'k8s-cluster',
    name: 'Metrics Server / Prometheus',
    layer: 'kubernetes',
    icon: 'Activity',
    description: 'Continuous telemetry pipeline providing CPU, memory, request rates, and P95/P99 latency feedback to both HPA and Carbon Pilot.',
    details: [
      'Scrapes pod metrics every 15 seconds via Prometheus operator',
      'Exposes custom metrics API for Kubernetes HPA v2',
      'Feeds SLO compliance verification loops in real time'
    ],
    techStack: ['Prometheus Server', 'Kubernetes Metrics Server', 'PromQL / HTTP API'],
    codeSnippet: {
      language: 'shell',
      filename: 'telemetry/promql_queries.promql',
      code: `# Real-time P99 Latency per microservice
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le, service))

# Instant CPU utilization per pod
sum(rate(container_cpu_usage_seconds_total{container!=""}[1m])) by (pod) 
  / sum(kube_pod_container_resource_limits{resource="cpu"}) by (pod) * 100`
    }
  },
  {
    id: 'hpa-native',
    name: 'Horizontal Pod Autoscaler (HPA)',
    layer: 'kubernetes',
    icon: 'Scaling',
    description: 'Kubernetes native autoscaler. Carbon Pilot dynamically tunes its target thresholds rather than replacing its battle-tested scaling logic.',
    details: [
      'Preserves Kubernetes native stability, cooldowns, and downscale stabilization',
      'Zero proprietary agent needed on nodes or application pods',
      'Tuned dynamically: Target CPU shifts from 55% (clean energy) to 78% (carbon peak)'
    ],
    techStack: ['k8s autoscaling/v2', 'HPA Controller', 'ReplicaSet controller'],
    codeSnippet: {
      language: 'yaml',
      filename: 'manifests/hpa_tuned.yaml',
      code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend
  namespace: boutique
  annotations:
    carbonpilot.io/managed-by: "carbon-pilot-operator"
    carbonpilot.io/last-grid-intensity: "435gCO2/kWh"
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 3
  maxReplicas: 30
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 74 # Dynamic carbon-aware threshold (baseline was 60)`
    }
  },
  {
    id: 'microservices',
    name: 'Microservice Deployments (Pods)',
    layer: 'kubernetes',
    icon: 'Boxes',
    description: 'Application container pods running on worker nodes (benchmarked using Google Cloud Online Boutique microservices).',
    details: [
      '10 polyglot microservices (Go, Java, Python, C#, Node.js)',
      'Stateless services scale elastically under carbon guidance',
      'Continuous synthetic load generation via Locust / k6'
    ],
    techStack: ['Google Online Boutique', 'Docker / containerd', 'Kubernetes Deployments'],
    codeSnippet: {
      language: 'yaml',
      filename: 'manifests/deployments.yaml',
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: boutique
spec:
  replicas: 10 # Scaled down from 14 by Carbon Pilot during high carbon intensity
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: server
        image: gcr.io/google-samples/microservices-demo/frontend:v0.8.0
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 250m
            memory: 128Mi`
    }
  },
  {
    id: 'rest-api',
    name: 'REST API (Backend Service)',
    layer: 'observability',
    icon: 'Server',
    description: 'High-performance Gin REST backend aggregating scaling events, carbon emissions avoided, and SLO telemetry for web dashboards.',
    details: [
      'Exposes streaming endpoints: /api/v1/carbon/savings, /api/v1/slo/status',
      'Asynchronously persists decision traces into Time-Series store',
      'Provides Prometheus exporter for long-term Grafana dashboards'
    ],
    techStack: ['Go (Golang)', 'Gin Web Framework', 'Prometheus Exporter', 'CORS / JWT'],
    codeSnippet: {
      language: 'go',
      filename: 'api/server.go',
      code: `func SetupRouter(store *storage.TimeSeriesStore) *gin.Engine {
    r := gin.Default()
    v1 := r.Group("/api/v1")
    {
        v1.GET("/metrics/live", liveMetricsHandler(store))
        v1.GET("/carbon/savings", carbonSavingsHandler(store))
        v1.GET("/slo/compliance", sloComplianceHandler(store))
        v1.GET("/events/reconciler", eventsStreamHandler(store))
    }
    return r
}`
    }
  },
  {
    id: 'web-dashboard',
    name: 'Web Dashboard (React)',
    layer: 'observability',
    icon: 'LayoutDashboard',
    description: 'Interactive single-page browser dashboard providing real-time visibility into grid carbon intensity, replica adjustments, and net savings.',
    details: [
      'Live synchronized charts for carbon intensity, pod count, and P99 latency',
      'Interactive CarbonPolicy CRD configurator with instant preview',
      'Simulation controls for synthetic load testing and grid carbon spikes'
    ],
    techStack: ['React 19 / TypeScript', 'Tailwind CSS', 'Recharts / SVG', 'Lucide Icons'],
    codeSnippet: {
      language: 'typescript',
      filename: 'frontend/src/components/LiveDashboard.tsx',
      code: `export const LiveDashboard: React.FC = () => {
  const { liveData, regions, activeRegion } = useCarbonPilot();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <CarbonIntensityCard current={liveData.intensity} trend={liveData.trend} />
      <ReplicaSavingsCard baseline={liveData.basePods} tuned={liveData.tunedPods} />
      <SloGuardrailCard p99={liveData.p99Latency} targetSlo={liveData.targetSlo} />
    </div>
  );
};`
    }
  },
  {
    id: 'time-series-store',
    name: 'Time-Series Store',
    layer: 'observability',
    icon: 'Database',
    description: 'Persists historical scaling decisions, energy calculations, and emissions data for academic evaluation and auditability.',
    details: [
      'Stores 1-second resolution metrics during load testing runs',
      'Enables historical playback and baseline vs carbon-pilot differential queries',
      'Supports InfluxDB time-series retention policies and PostgreSQL relational metadata'
    ],
    techStack: ['PostgreSQL 16', 'TimescaleDB / InfluxDB', 'SQLAlchemy / GORM'],
    codeSnippet: {
      language: 'sql',
      filename: 'db/schema.sql',
      code: `CREATE TABLE scaling_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    service_name VARCHAR(64) NOT NULL,
    grid_intensity_gco2_kwh NUMERIC(6,2),
    hpa_target_cpu_previous INT,
    hpa_target_cpu_new INT,
    baseline_replicas INT,
    carbon_pilot_replicas INT,
    p99_latency_ms NUMERIC(6,2),
    carbon_saved_grams NUMERIC(10,2)
);
CREATE INDEX idx_scaling_timestamp ON scaling_events (timestamp DESC);`
    }
  }
];

export const TECH_STACK_DATA: TechStackItem[] = [
  // Frontend
  {
    name: 'React.js (v18/19)',
    category: 'Frontend',
    role: 'Core Single-Page Application engine for the interactive dashboard and control console.',
    badge: 'UI Framework',
    version: '19.2',
    keyFeatures: ['Declarative component state', 'Real-time WebSocket/polling updates', 'Smooth micro-interactions'],
    codeExample: 'import { useState, useEffect } from "react";'
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    role: 'End-to-end type safety across telemetry schemas, CRD specifications, and chart datasets.',
    badge: 'Language',
    version: '5.7',
    keyFeatures: ['Eliminates runtime undefined errors', 'Strict interface enforcement', 'IDE autocomplete for CRD types'],
    codeExample: 'interface CarbonPolicySpec { targetRef: TargetRef; ... }'
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    role: 'Modern utility-first styling with high-tech eco-palette, dark mode, and responsive layout.',
    badge: 'Styling',
    version: '4.3',
    keyFeatures: ['JIT compilation', 'Emerald & cyan eco accents', 'Glassmorphism panels'],
    codeExample: 'className="glass-panel border-emerald-500/20 text-slate-100"'
  },
  {
    name: 'Recharts & Canvas',
    category: 'Frontend',
    role: 'Real-time visual rendering of carbon curves, pod replicas, and SLO latency guardrails.',
    badge: 'Data Viz',
    version: 'Latest',
    keyFeatures: ['Interactive SVG/Canvas charts', 'Multi-axis baseline comparison', 'Zero external heavy dependencies'],
    codeExample: '<ResponsiveContainer><LineChart data={series}/></ResponsiveContainer>'
  },
  {
    name: 'Axios / Fetch API',
    category: 'Frontend',
    role: 'Asynchronous communication with the Operator REST backend and external grid APIs.',
    badge: 'Networking',
    version: 'ESNext',
    keyFeatures: ['Streaming event buffer', 'Automatic retry with exponential backoff', 'Token authentication'],
    codeExample: 'const response = await fetch("/api/v1/carbon/savings");'
  },
  // Backend / Core
  {
    name: 'Go (Golang)',
    category: 'Backend / Core',
    role: 'Primary language for the Carbon Pilot Kubernetes Operator, reconciler loops, and high-throughput REST API.',
    badge: 'Operator Core',
    version: '1.23',
    keyFeatures: ['Native Kubernetes ecosystem alignment', 'Sub-millisecond reconciler latency', 'Lightweight goroutines for streaming'],
    codeExample: 'func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error)'
  },
  {
    name: 'Kubebuilder / Operator SDK',
    category: 'Backend / Core',
    role: 'Scaffolds CRD controllers, watches, and client-go cache managers following cloud-native best practices.',
    badge: 'Kubernetes Framework',
    version: 'v4.2',
    keyFeatures: ['Controller-runtime integration', 'Custom CRD code generators', 'Admission webhooks for validation'],
    codeExample: '// +kubebuilder:rbac:groups=autoscaling,resources=horizontalpodautoscalers,verbs=get;list;watch;update;patch'
  },
  {
    name: 'Kubernetes client-go',
    category: 'Backend / Core',
    role: 'Direct programmatic interaction with Kube-API server to patch HPA objects and observe deployment states.',
    badge: 'K8s Client',
    version: 'v0.31',
    keyFeatures: ['SharedInformer caches', 'Optimistic concurrency locking', 'Server-side apply support'],
    codeExample: 'clientset.AutoscalingV2().HorizontalPodAutoscalers(ns).Update(ctx, hpa, metav1.UpdateOptions{})'
  },
  {
    name: 'CarbonPolicy CRD',
    category: 'Backend / Core',
    role: 'Declarative Kubernetes Custom Resource representing user-configured SLO ceilings and carbon sensitivity.',
    badge: 'Kubernetes API',
    version: 'v1alpha1',
    keyFeatures: ['OpenAPI v3 schema validation', 'Per-service granularity', 'GitOps and Helm chart ready'],
    codeExample: 'apiVersion: autoscaling.carbonpilot.io/v1alpha1\nkind: CarbonPolicy'
  },
  {
    name: 'Electricity Maps / WattTime API',
    category: 'Backend / Core',
    role: 'External data source providing real-time grid carbon intensity signals and generation fuel breakdowns.',
    badge: 'External Signal',
    version: 'v3 REST',
    keyFeatures: ['Regional carbon intensity (gCO2eq/kWh)', '5-minute update cadence', 'Historical data fallback'],
    codeExample: 'GET /v3/carbon-intensity/latest?zone=US-VA'
  },
  {
    name: 'Prometheus & Metrics Server',
    category: 'Backend / Core',
    role: 'Ingests real-time container metrics (CPU, memory, latency) to compute live SLO margins.',
    badge: 'Telemetry',
    version: 'v2.54',
    keyFeatures: ['Sub-second PromQL queries', 'Service monitor scraping', 'Exposes custom HPA metrics'],
    codeExample: 'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))'
  },
  {
    name: 'REST API (Gin Framework, Go)',
    category: 'Backend / Core',
    role: 'Exposes telemetry, decision audit events, and savings summaries to browser and monitoring clients.',
    badge: 'REST Engine',
    version: 'v1.10',
    keyFeatures: ['Ultra-fast HTTP router', 'JSON serialization in microseconds', 'WebSocket event streaming'],
    codeExample: 'router.GET("/api/v1/carbon/savings", handlers.GetSavings)'
  },
  {
    name: 'PostgreSQL / InfluxDB',
    category: 'Backend / Core',
    role: 'Time-series persistence for scaling decisions, carbon curves, and evaluation metrics.',
    badge: 'Persistence',
    version: 'v16 / v2.7',
    keyFeatures: ['Time-series retention policies', 'Fast aggregate queries for reports', 'Academic evaluation logs'],
    codeExample: 'SELECT time_bucket("5m", timestamp), AVG(carbon_saved_grams) FROM scaling_events GROUP BY 1;'
  },
  // DevOps & Infrastructure
  {
    name: 'Docker',
    category: 'DevOps & Infra',
    role: 'Containerizes the operator controller, REST service, and synthetic load generators.',
    badge: 'Containerization',
    version: 'v27',
    keyFeatures: ['Multi-stage scratch builds', 'Minimal attack surface (< 25MB image)', 'Rootless execution'],
    codeExample: 'FROM golang:1.23-alpine AS builder ... ENTRYPOINT ["/carbon-pilot-operator"]'
  },
  {
    name: 'Kubernetes (kind / Minikube)',
    category: 'DevOps & Infra',
    role: 'Local cluster runtime for rapid iteration, unit testing, and demonstration of multi-node scaling.',
    badge: 'Cluster Runtime',
    version: 'v1.31',
    keyFeatures: ['Multi-node local cluster', 'Automated CNI and Metrics Server setup', 'Reproducible CI testing'],
    codeExample: 'kind create cluster --config kind-config.yaml'
  },
  {
    name: 'Helm',
    category: 'DevOps & Infra',
    role: 'Packages Carbon Pilot as a unified, production-ready chart for one-command installation.',
    badge: 'Package Manager',
    version: 'v3.16',
    keyFeatures: ['Installs CRDs, Operator, and RBAC', 'Configurable values.yaml', 'Dry-run release testing'],
    codeExample: 'helm install carbon-pilot ./charts/carbon-pilot -n carbon-pilot-system --create-namespace'
  },
  {
    name: 'GitHub Actions',
    category: 'DevOps & Infra',
    role: 'Continuous Integration & Delivery pipeline executing tests, linting, and container image publishing.',
    badge: 'CI / CD',
    version: 'Workflows',
    keyFeatures: ['Automated e2e kind tests', 'Static code analysis', 'Multi-arch Docker image builds'],
    codeExample: 'uses: engineerd/setup-kind@v0.5.0'
  },
  {
    name: 'Online Boutique (Google Demo)',
    category: 'DevOps & Infra',
    role: 'Industry-standard 10-tier microservices benchmark used to evaluate Carbon Pilot against baseline HPA.',
    badge: 'Benchmark Target',
    version: 'v0.8.0',
    keyFeatures: ['Realistic e-commerce traffic pattern', 'Polyglot microservices stack', 'Locust load injection'],
    codeExample: 'kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/microservices-demo/main/release/kubernetes-manifests.yaml'
  },
  // Alternative Stack
  {
    name: 'Python (Kopf Framework)',
    category: 'Alternative Stack',
    role: 'Alternative Python-based operator framework for data science and research-focused Kubernetes extensions.',
    badge: 'Python Alternative',
    version: 'v1.37',
    keyFeatures: ['Rapid prototyping in Python', 'Native decorators @kopf.on.update', 'Direct Pandas/NumPy integration'],
    codeExample: '@kopf.on.update("autoscaling.carbonpilot.io", "v1alpha1", "carbonpolicies")\ndef reconcile_policy(spec, **kwargs): ...'
  },
  {
    name: 'FastAPI (Python)',
    category: 'Alternative Stack',
    role: 'Alternative Python REST API pairing seamlessly with Kopf for microservice telemetry.',
    badge: 'Python Alternative',
    version: 'v0.115',
    keyFeatures: ['Automatic OpenAPI documentation', 'Asynchronous async/await', 'Pydantic data validation'],
    codeExample: '@app.get("/api/v1/carbon/savings") async def get_savings(): ...'
  }
];

export const BENCHMARK_EVALUATION: BenchmarkMetrics[] = [
  {
    metric: 'Carbon Footprint Reduction',
    standardHPA: '142.8 kg CO2eq / day',
    carbonPilot: '98.2 kg CO2eq / day',
    improvement: '-31.2% Carbon Avoided',
    verdict: 'superior',
    unit: 'kg CO2eq'
  },
  {
    metric: 'P99 Latency SLO Compliance Rate',
    standardHPA: '99.94%',
    carbonPilot: '99.91%',
    improvement: '0.03% variance (0 SLO Breaches)',
    verdict: 'acceptable',
    unit: '%'
  },
  {
    metric: 'Average Pod Replicas (High Carbon Hours)',
    standardHPA: '84.0 pods total',
    carbonPilot: '58.0 pods total',
    improvement: '-30.9% Resource Trimming',
    verdict: 'superior',
    unit: 'pods'
  },
  {
    metric: 'Average CPU Utilization (Cluster)',
    standardHPA: '54.2%',
    carbonPilot: '74.6%',
    improvement: '+20.4% Efficiency Gain',
    verdict: 'superior',
    unit: '%'
  },
  {
    metric: 'Cluster Energy Consumption',
    standardHPA: '348.5 kWh / day',
    carbonPilot: '254.1 kWh / day',
    improvement: '-27.1% kWh Conserved',
    verdict: 'superior',
    unit: 'kWh'
  },
  {
    metric: 'Reconciliation Loop Latency',
    standardHPA: 'N/A (Static HPA)',
    carbonPilot: '18.4 ms avg',
    improvement: 'Sub-second real-time responsiveness',
    verdict: 'superior',
    unit: 'ms'
  }
];

export const DATA_FLOW_STEPS = [
  {
    step: 1,
    title: 'Poll Grid Carbon Intensity',
    source: 'Grid Carbon-Intensity API',
    target: 'Carbon Signal Collector',
    description: 'The Carbon Signal Collector polls Electricity Maps or WattTime on a 60s interval, normalizes the gCO2/kWh reading, and smooths noise via Exponential Moving Average.',
    badge: 'External Ingestion'
  },
  {
    step: 2,
    title: 'Stream Telemetry & SLO Metrics',
    source: 'Prometheus / Metrics Server',
    target: 'Policy Engine',
    description: 'Continuous metrics pipeline provides live CPU, memory, request rates (RPS), and P95/P99 latency feedback from all running microservices.',
    badge: 'Cluster Telemetry'
  },
  {
    step: 3,
    title: 'Compute Carbon-Aware Policy',
    source: 'Policy Engine (Decision Core)',
    target: 'CarbonPolicy CRD',
    description: 'The Policy Engine computes dynamic target CPU thresholds by balancing grid carbon intensity against real-time SLO latency slack. If latency approaches the safety threshold, eco-tuning backs off instantly.',
    badge: 'Algorithmic Optimization'
  },
  {
    step: 4,
    title: 'Persist Desired State in CRD',
    source: 'Policy Engine',
    target: 'CarbonPolicy Custom Resource',
    description: 'The updated scaling parameters and SLO safety bounds are written declaratively to the CarbonPolicy Custom Resource in Kubernetes.',
    badge: 'Declarative State'
  },
  {
    step: 5,
    title: 'Reconcile & Tune HPA Thresholds',
    source: 'CRD Controller / Reconciler',
    target: 'Horizontal Pod Autoscaler (HPA)',
    description: 'The operator controller detects the CRD update and dynamically patches the targetAverageUtilization and replica bounds on the native HPA without terminating existing pods.',
    badge: 'Kubernetes Control Plane'
  },
  {
    step: 6,
    title: 'Execute Pod Autoscaling',
    source: 'Horizontal Pod Autoscaler',
    target: 'Microservice Deployments (Pods)',
    description: 'The native HPA scales the microservice pods up or down smoothly. During peak dirty carbon hours, higher CPU targets safely shed idle replicas without violating latency SLOs.',
    badge: 'Elastic Actuation'
  },
  {
    step: 7,
    title: 'Stream Telemetry to Observability Store',
    source: 'Policy Engine & Controller',
    target: 'REST API & Web Dashboard',
    description: 'Every scaling event, carbon savings calculation, and SLO margin is published to the Gin REST backend, stored in Time-Series DB, and visualized live in the Web Dashboard.',
    badge: 'Real-time Visibility'
  }
];
