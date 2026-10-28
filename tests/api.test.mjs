import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApiServer } from '../server/server.mjs';

describe('Carbon Pilot REST API Endpoints', () => {
  let server;
  let baseUrl;
  const PORT = 8011; // test port

  before(async () => {
    server = createApiServer();
    await new Promise((resolve) => {
      server.listen(PORT, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${PORT}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  async function request(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, options);
    const contentType = res.headers.get('content-type') || '';
    let body;
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    return { status: res.status, headers: res.headers, body };
  }

  test('GET /api/health returns system status and operating mode', async () => {
    const res = await request('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
    assert.equal(res.body.operatingMode, 'simulation');
    assert.ok(res.body.timestamp);
  });

  test('GET /api/policies returns list of configured policies', async () => {
    const res = await request('/api/policies');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
    assert.equal(res.body[0].serviceName, 'frontend');
  });

  test('PUT /api/policies/:id rejects invalid guardrail parameters with 422', async () => {
    const res = await request('/api/policies/frontend', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseCpuThreshold: 20, // Invalid: < 30%
        maxAllowedCpuThreshold: 80,
        sloLatencyCeilingMs: 150,
        safetyMarginMs: 25,
      }),
    });
    assert.equal(res.status, 422);
    assert.ok(res.body.error);
  });

  test('PUT /api/policies/:id updates and persists valid policy', async () => {
    const res = await request('/api/policies/frontend', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseCpuThreshold: 58,
        maxAllowedCpuThreshold: 78,
        carbonWeightAlpha: 0.8,
        sloLatencyCeilingMs: 160,
        safetyMarginMs: 30,
      }),
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.baseCpuThreshold, 58);
    assert.equal(res.body.maxAllowedCpuThreshold, 78);

    // Verify persistence with a subsequent GET
    const verify = await request('/api/policies');
    const updated = verify.body.find((p) => p.id === 'frontend');
    assert.equal(updated.baseCpuThreshold, 58);
  });

  test('POST /api/simulator/step executes single decision step with explanation trace', async () => {
    const res = await request('/api/simulator/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentRps: 1100,
        currentReplicas: 9,
        currentLatencyP99: 90,
        carbonIntensity: 450,
      }),
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.decisionAction);
    assert.ok(res.body.explanationTrace);
    assert.equal(res.body.explanationTrace.workloadRps, 1100);
    assert.ok(res.body.explanationTrace.sloGuardrailCheck);
  });

  test('GET /api/experiments/scenarios returns predefined scenarios', async () => {
    const res = await request('/api/experiments/scenarios');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 3);
    assert.equal(res.body[0].id, 'scenario-diurnal-24h');
  });

  test('POST /api/experiments/run evaluates scenario and returns comparative metrics', async () => {
    const res = await request('/api/experiments/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId: 'scenario-diurnal-24h',
      }),
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.scenarioId, 'scenario-diurnal-24h');
    assert.ok(res.body.summary);
    assert.ok(res.body.summary.netCarbonAvoidedKg >= 0);
    assert.ok(res.body.summary.sloComplianceRate > 90);
    assert.equal(res.body.hourlyTrace.length, 24);
  });

  test('GET /api/experiments/export returns downloadable CSV with appropriate headers', async () => {
    const res = await request('/api/experiments/export?scenarioId=scenario-diurnal-24h&format=csv');
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('text/csv'));
    assert.ok(res.body.startsWith('Hour,Timestamp,Workload_RPS'));
    assert.ok(res.body.includes('Standard_HPA_Replicas'));
  });

  test('GET /api/experiments/export returns valid JSON when requested', async () => {
    const res = await request('/api/experiments/export?scenarioId=scenario-diurnal-24h&format=json');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body === 'object');
    assert.ok(res.body.summary);
  });
});
