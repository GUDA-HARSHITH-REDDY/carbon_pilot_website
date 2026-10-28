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
  DEFAULT_POLICIES,
  EVALUATION_SCENARIOS,
  executeExperiment,
} from './engine.mjs';

export { DEFAULT_POLICIES, EVALUATION_SCENARIOS, executeExperiment };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const POLICIES_FILE = path.join(DATA_DIR, 'policies.json');
const EXPERIMENTS_FILE = path.join(DATA_DIR, 'experiments.json');

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

    // ROUTE: Get single policy by ID
    if (pathname.startsWith('/api/policies/') && req.method === 'GET') {
      const policyId = pathname.replace('/api/policies/', '');
      const policies = readPolicies();
      const policy = policies.find((p) => p.id === policyId || p.serviceName === policyId);
      if (!policy) {
        return sendJson(404, { error: `Policy ${policyId} not found` });
      }
      return sendJson(200, policy);
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
