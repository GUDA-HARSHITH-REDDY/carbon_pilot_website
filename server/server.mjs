import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  evaluateScalingPolicy,
  computeComparativeSavings,
  calculatePowerWatts,
  calculateEnergyKWh,
  calculateEmissionsGrams,
} from './engine.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const POLICIES_FILE = path.join(DATA_DIR, 'policies.json');
const EXPERIMENTS_FILE = path.join(DATA_DIR, 'experiments.json');

// Initial default policies for Google Online Boutique microservices
const DEFAULT_POLICIES = [
  {
    id: 'frontend',
    serviceName: 'frontend',
    namespace: 'boutique',
    targetRefKind: 'Deployment',
    targetRefName: 'frontend',
    carbonSource: 'electricity-maps',
    zone: 'US-VA',
    baseCpuThreshold: 60,
    maxAllowedCpuThreshold: 80,
    carbonWeightAlpha: 0.75,
    sloLatencyCeilingMs: 150,
    safetyMarginMs: 25,
    minReplicas: 3,
    maxReplicas: 30,
    cooldownSeconds: 30,
    nominalRpsPerReplica: 120,
    status: 'active',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cartservice',
    serviceName: 'cartservice',
    namespace: 'boutique',
    targetRefKind: 'Deployment',
    targetRefName: 'cartservice',
    carbonSource: 'electricity-maps',
    zone: 'US-VA',
    baseCpuThreshold: 55,
    maxAllowedCpuThreshold: 75,
    carbonWeightAlpha: 0.70,
    sloLatencyCeilingMs: 120,
    safetyMarginMs: 20,
    minReplicas: 2,
    maxReplicas: 20,
    cooldownSeconds: 30,
    nominalRpsPerReplica: 100,
    status: 'active',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'recommendationservice',
    serviceName: 'recommendationservice',
    namespace: 'boutique',
    targetRefKind: 'Deployment',
    targetRefName: 'recommendationservice',
    carbonSource: 'electricity-maps',
    zone: 'US-VA',
    baseCpuThreshold: 65,
    maxAllowedCpuThreshold: 85,
    carbonWeightAlpha: 0.85,
    sloLatencyCeilingMs: 300,
    safetyMarginMs: 40,
    minReplicas: 2,
    maxReplicas: 25,
    cooldownSeconds: 30,
    nominalRpsPerReplica: 90,
    status: 'active',
    updatedAt: new Date().toISOString(),
  },
];

// Initialize durable files if missing
if (!fs.existsSync(POLICIES_FILE)) {
  fs.writeFileSync(POLICIES_FILE, JSON.stringify(DEFAULT_POLICIES, null, 2));
}

function readPolicies() {
  try {
    return JSON.parse(fs.readFileSync(POLICIES_FILE, 'utf8'));
  } catch {
    return DEFAULT_POLICIES;
  }
}

function writePolicies(policies) {
  fs.writeFileSync(POLICIES_FILE, JSON.stringify(policies, null, 2));
}

// Evaluation Benchmark Scenarios
export const EVALUATION_SCENARIOS = [
  {
    id: 'scenario-diurnal-24h',
    name: '24-Hour Diurnal Web Traffic (Standard Day)',
    description: 'Realistic e-commerce traffic trace mirroring daytime surge and midnight baseload against PJM Virginia grid carbon curve.',
    hours: 24,
    trafficTrace: [
      320, 280, 240, 220, 260, 410, 680, 950, 1240, 1450, 1620, 1680,
      1720, 1690, 1580, 1420, 1310, 1280, 1350, 1420, 1260, 980, 640, 420
    ],
    carbonTrace: [
      380, 395, 410, 430, 450, 465, 455, 435, 420, 390, 370, 355,
      360, 385, 415, 445, 460, 450, 435, 420, 410, 395, 385, 380
    ],
  },
  {
    id: 'scenario-carbon-spike',
    name: 'Sudden Evening Grid Carbon Spike',
    description: 'Cloudy wind-lull during evening peak hours causes carbon intensity to spike from 140 to 620 gCO2e/kWh.',
    hours: 24,
    trafficTrace: [
      500, 500, 500, 500, 600, 700, 900, 1100, 1200, 1200, 1200, 1200,
      1200, 1200, 1200, 1200, 1300, 1400, 1400, 1300, 1100, 900, 700, 500
    ],
    carbonTrace: [
      120, 115, 120, 130, 160, 210, 280, 340, 320, 290, 250, 220,
      210, 240, 310, 420, 580, 640, 650, 620, 510, 420, 280, 180
    ],
  },
  {
    id: 'scenario-flash-sale',
    name: 'Flash Sale Traffic Surge (Performance Stress Test)',
    description: 'Workload triples within minutes to demonstrate that performance & SLO guardrails strictly override carbon savings.',
    hours: 24,
    trafficTrace: [
      400, 400, 400, 400, 500, 600, 800, 1200, 2400, 3200, 3400, 3100,
      2200, 1500, 1200, 1100, 1000, 1000, 1000, 900, 800, 700, 500, 400
    ],
    carbonTrace: [
      420, 420, 420, 420, 420, 420, 450, 480, 510, 550, 540, 520,
      490, 470, 450, 440, 430, 430, 420, 420, 420, 420, 420, 420
    ],
  },
];

/**
 * Runs a comparative experiment over a given scenario trace
 */
export function executeExperiment(scenarioId, policy = DEFAULT_POLICIES[0]) {
  const scenario = EVALUATION_SCENARIOS.find((s) => s.id === scenarioId) || EVALUATION_SCENARIOS[0];
  const results = [];

  let cumBaseKWh = 0;
  let cumOptKWh = 0;
  let cumBaseEmissionsGrams = 0;
  let cumOptEmissionsGrams = 0;
  let totalSloChecks = 0;
  let sloCompliantChecks = 0;

  for (let i = 0; i < scenario.hours; i++) {
    const rps = scenario.trafficTrace[i];
    const intensity = scenario.carbonTrace[i];
    const latencyBase = Math.round(55 + (rps / (policy.nominalRpsPerReplica * 8)) * 30);

    const decision = evaluateScalingPolicy({
      currentRps: rps,
      currentReplicas: Math.max(policy.minReplicas, Math.ceil(rps / policy.nominalRpsPerReplica)),
      currentLatencyP99: latencyBase,
      carbonIntensity: intensity,
      policy,
      lastScaleTimestamp: 0,
      now: Date.now() + i * 3600000,
    });

    const actualBaseCpu = Math.min(100, Math.max(15, Math.round((rps / (decision.baselineReplicas * policy.nominalRpsPerReplica)) * policy.baseCpuThreshold)));
    const actualOptCpu = Math.min(100, Math.max(15, Math.round((rps / (decision.targetReplicas * policy.nominalRpsPerReplica)) * policy.baseCpuThreshold)));

    const comparative = computeComparativeSavings(
      { replicas: decision.baselineReplicas, cpuPercent: actualBaseCpu },
      { replicas: decision.targetReplicas, cpuPercent: actualOptCpu },
      3600, // 1 hour window
      intensity
    );

    cumBaseKWh += comparative.baseKWh;
    cumOptKWh += comparative.optKWh;
    cumBaseEmissionsGrams += comparative.baseEmissionsGrams;
    cumOptEmissionsGrams += comparative.optEmissionsGrams;

    totalSloChecks++;
    if (decision.explanationTrace.sloGuardrailCheck.isCompliant) {
      sloCompliantChecks++;
    }

    results.push({
      hour: i,
      timestamp: `${String(i).padStart(2, '0')}:00`,
      workloadRps: rps,
      carbonIntensityGCO2: intensity,
      standardHpaReplicas: decision.baselineReplicas,
      carbonPilotReplicas: decision.targetReplicas,
      replicasAvoided: decision.baselineReplicas - decision.targetReplicas,
      targetCpuPercent: decision.targetCpuThreshold,
      p99LatencyMs: decision.explanationTrace.sloGuardrailCheck.estimatedLatencyP99,
      sloCeilingMs: policy.sloLatencyCeilingMs,
      baseKWh: Number(comparative.baseKWh.toFixed(3)),
      optKWh: Number(comparative.optKWh.toFixed(3)),
      emissionsSavedGrams: Number(comparative.emissionsAvoidedGrams.toFixed(1)),
      guardrailActive: decision.guardrailActive,
      decisionAction: decision.decisionAction,
      justification: decision.reason,
    });
  }

  const netCarbonAvoidedKg = Number(((cumBaseEmissionsGrams - cumOptEmissionsGrams) / 1000).toFixed(2));
  const netEnergySavedKWh = Number((cumBaseKWh - cumOptKWh).toFixed(2));
  const netPercentageAvoided = Number((((cumBaseEmissionsGrams - cumOptEmissionsGrams) / cumBaseEmissionsGrams) * 100).toFixed(1));
  const sloComplianceRate = Number(((sloCompliantChecks / totalSloChecks) * 100).toFixed(2));

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    totalHours: scenario.hours,
    summary: {
      baselineTotalEmissionsKg: Number((cumBaseEmissionsGrams / 1000).toFixed(2)),
      carbonPilotTotalEmissionsKg: Number((cumOptEmissionsGrams / 1000).toFixed(2)),
      netCarbonAvoidedKg,
      netPercentageAvoided,
      baselineTotalEnergyKWh: Number(cumBaseKWh.toFixed(2)),
      carbonPilotTotalEnergyKWh: Number(cumOptKWh.toFixed(2)),
      netEnergySavedKWh,
      sloComplianceRate,
      sloViolationsCount: totalSloChecks - sloCompliantChecks,
    },
    hourlyTrace: results,
  };
}

export function createApiServer() {
  return http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // Helper for JSON response
    const sendJson = (statusCode, data) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // Helper to parse JSON body
    const parseBody = (callback) => {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          callback(null, parsed);
        } catch (err) {
          callback(err, null);
        }
      });
    };

    // ROUTE: Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(200, {
        status: 'healthy',
        service: 'carbon-pilot-control-plane',
        operatingMode: 'simulation',
        kubernetesCluster: 'connected-simulated',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        telemetrySource: 'Prometheus (Synthetic Benchmark Feed)',
        carbonSignalSource: 'Electricity Maps API (Normalized Regional Feed)',
      });
    }

    // ROUTE: Get all policies
    if (pathname === '/api/policies' && req.method === 'GET') {
      return sendJson(200, readPolicies());
    }

    // ROUTE: Update a policy
    if (pathname.startsWith('/api/policies/') && req.method === 'PUT') {
      const policyId = pathname.replace('/api/policies/', '');
      return parseBody((err, updatedData) => {
        if (err) return sendJson(400, { error: 'Invalid JSON request body' });
        
        const policies = readPolicies();
        const index = policies.findIndex((p) => p.id === policyId);
        if (index === -1) {
          return sendJson(404, { error: `Policy ${policyId} not found` });
        }

        // Validate guardrails
        if (updatedData.baseCpuThreshold < 30 || updatedData.baseCpuThreshold > 80) {
          return sendJson(422, { error: 'baseCpuThreshold must be between 30% and 80%' });
        }
        if (updatedData.maxAllowedCpuThreshold < updatedData.baseCpuThreshold) {
          return sendJson(422, { error: 'maxAllowedCpuThreshold must be greater than or equal to baseCpuThreshold' });
        }
        if (updatedData.sloLatencyCeilingMs <= updatedData.safetyMarginMs) {
          return sendJson(422, { error: 'sloLatencyCeilingMs must be strictly greater than safetyMarginMs' });
        }

        policies[index] = {
          ...policies[index],
          ...updatedData,
          id: policyId,
          updatedAt: new Date().toISOString(),
        };
        writePolicies(policies);
        return sendJson(200, policies[index]);
      });
    }

    // ROUTE: Simulate single decision step
    if (pathname === '/api/simulator/step' && req.method === 'POST') {
      return parseBody((err, payload) => {
        if (err) return sendJson(400, { error: 'Invalid JSON body' });
        const {
          currentRps = 1200,
          currentReplicas = 10,
          currentLatencyP99 = 98,
          carbonIntensity = 435,
          policy = DEFAULT_POLICIES[0],
          lastScaleTimestamp = 0,
        } = payload;

        const decision = evaluateScalingPolicy({
          currentRps,
          currentReplicas,
          currentLatencyP99,
          carbonIntensity,
          policy,
          lastScaleTimestamp,
          now: Date.now(),
        });

        return sendJson(200, decision);
      });
    }

    // ROUTE: Evaluation scenarios list
    if (pathname === '/api/experiments/scenarios' && req.method === 'GET') {
      return sendJson(200, EVALUATION_SCENARIOS);
    }

    // ROUTE: Run experiment
    if (pathname === '/api/experiments/run' && req.method === 'POST') {
      return parseBody((err, payload) => {
        if (err) return sendJson(400, { error: 'Invalid JSON body' });
        const scenarioId = payload.scenarioId || 'scenario-diurnal-24h';
        const policy = payload.policy || DEFAULT_POLICIES[0];
        const experimentResult = executeExperiment(scenarioId, policy);
        return sendJson(200, experimentResult);
      });
    }

    // ROUTE: Export experiment as CSV or JSON
    if (pathname === '/api/experiments/export' && req.method === 'GET') {
      const scenarioId = url.searchParams.get('scenarioId') || 'scenario-diurnal-24h';
      const format = url.searchParams.get('format') || 'json';
      const result = executeExperiment(scenarioId);

      if (format === 'csv') {
        const headers = [
          'Hour', 'Timestamp', 'Workload_RPS', 'Carbon_Intensity_gCO2e_kWh',
          'Standard_HPA_Replicas', 'Carbon_Pilot_Replicas', 'Replicas_Avoided',
          'Target_CPU_Percent', 'P99_Latency_ms', 'SLO_Ceiling_ms',
          'Baseline_kWh', 'CarbonPilot_kWh', 'Emissions_Saved_gCO2e',
          'SLO_Guardrail_Active', 'Decision_Action', 'Justification'
        ];
        const rows = result.hourlyTrace.map((r) => [
          r.hour,
          `"${r.timestamp}"`,
          r.workloadRps,
          r.carbonIntensityGCO2,
          r.standardHpaReplicas,
          r.carbonPilotReplicas,
          r.replicasAvoided,
          r.targetCpuPercent,
          r.p99LatencyMs,
          r.sloCeilingMs,
          r.baseKWh,
          r.optKWh,
          r.emissionsSavedGrams,
          r.guardrailActive,
          `"${r.decisionAction}"`,
          `"${r.justification.replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        res.writeHead(200, {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="carbon-pilot-experiment-${scenarioId}.csv"`,
        });
        return res.end(csvContent);
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="carbon-pilot-experiment-${scenarioId}.json"`,
      });
      return res.end(JSON.stringify(result, null, 2));
    }

    // 404 for unknown routes
    sendJson(404, { error: 'Route not found', path: pathname });
  });
}

// Start server if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 8000;
  const server = createApiServer();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Carbon Pilot API] Server listening on http://0.0.0.0:${PORT}`);
  });
}
