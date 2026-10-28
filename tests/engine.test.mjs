import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePowerWatts,
  calculateEnergyKWh,
  calculateEmissionsGrams,
  computeComparativeSavings,
  evaluateScalingPolicy,
} from '../server/engine.mjs';

describe('Carbon and Energy Mathematical Calculations', () => {
  test('calculatePowerWatts computes base idle and dynamic watts accurately', () => {
    // 0 replicas -> 0 watts
    assert.equal(calculatePowerWatts(0, 50), 0);
    // 1 pod at 0% CPU = 40W
    assert.equal(calculatePowerWatts(1, 0), 40);
    // 1 pod at 100% CPU = 40 + 80 = 120W
    assert.equal(calculatePowerWatts(1, 100), 120);
    // 10 pods at 50% CPU = 10 * (40 + 40) = 800W
    assert.equal(calculatePowerWatts(10, 50), 800);
  });

  test('calculateEnergyKWh converts power and duration into correct kilowatt-hours', () => {
    // 1000 Watts for 1 hour (3600 seconds) = 1.0 kWh
    const kWh = calculateEnergyKWh(1000, 3600);
    assert.equal(kWh, 1.0);

    // 500 Watts for 30 minutes (1800 seconds) = 0.25 kWh
    const halfHour = calculateEnergyKWh(500, 1800);
    assert.equal(halfHour, 0.25);
  });

  test('calculateEmissionsGrams correctly derives carbon emissions with verified units', () => {
    // 1.0 kWh at 400 gCO2e/kWh = 400 grams CO2e
    const emissions = calculateEmissionsGrams(1.0, 400);
    assert.equal(emissions, 400.0);

    // 0 energy -> 0 emissions
    assert.equal(calculateEmissionsGrams(0, 400), 0);
  });

  test('computeComparativeSavings verifies baseline vs optimized emissions delta', () => {
    const baseline = { replicas: 14, cpuPercent: 60 }; // 14 * (40 + 48) = 1232W
    const optimized = { replicas: 10, cpuPercent: 75 }; // 10 * (40 + 60) = 1000W
    const savings = computeComparativeSavings(baseline, optimized, 3600, 400);

    assert.ok(savings.baseWatts > savings.optWatts, 'Optimized power must be lower than baseline');
    assert.ok(savings.emissionsAvoidedGrams > 0, 'Emissions avoided must be strictly positive');
    assert.ok(savings.percentageAvoided > 0 && savings.percentageAvoided < 100);
  });
});

describe('Carbon-Aware Scaling Decision Engine', () => {
  const defaultPolicy = {
    baseCpuThreshold: 60,
    maxAllowedCpuThreshold: 80,
    carbonWeightAlpha: 0.75,
    sloLatencyCeilingMs: 150,
    safetyMarginMs: 25,
    minReplicas: 2,
    maxReplicas: 25,
    cooldownSeconds: 30,
    nominalRpsPerReplica: 120,
  };

  test('Prioritizes performance and SLO guardrail when latency is near threshold', () => {
    // Current latency is 135ms (SLO ceiling 150ms - safety margin 25ms = 125ms limit)
    const decision = evaluateScalingPolicy({
      currentRps: 800,
      currentReplicas: 8,
      currentLatencyP99: 135,
      carbonIntensity: 600, // Very dirty grid, but SLO is threatened!
      policy: defaultPolicy,
      lastScaleTimestamp: Date.now() - 60000,
    });

    assert.equal(decision.guardrailActive, true, 'Guardrail must activate when latency risks SLO');
    assert.equal(decision.targetCpuThreshold, 60, 'Must revert to base CPU threshold when SLO at risk');
    assert.ok(decision.reason.includes('SLO Guardrail Activated'), 'Reason must explain SLO protection');
    assert.ok(decision.targetReplicas >= decision.currentReplicas, 'Must not scale down when SLO threatened');
  });

  test('Scales up promptly during traffic surge regardless of carbon intensity', () => {
    // Traffic surge: 2000 RPS on 8 pods
    const decision = evaluateScalingPolicy({
      currentRps: 2000,
      currentReplicas: 8,
      currentLatencyP99: 80,
      carbonIntensity: 650, // Peak dirty carbon
      policy: defaultPolicy,
      lastScaleTimestamp: Date.now() - 60000,
    });

    assert.equal(decision.decisionAction, 'SCALE_UP', 'Must scale up on traffic surge');
    assert.ok(decision.targetReplicas > 8, 'Must allocate more pods');
    assert.ok(decision.reason.includes('Workload Demand Surge'), 'Reason must indicate surge');
  });

  test('Safely consolidates replicas when carbon is high and latency is comfortably low', () => {
    // Traffic 600 RPS on 10 pods, latency very safe (40ms << 150ms)
    const decision = evaluateScalingPolicy({
      currentRps: 600,
      currentReplicas: 10,
      currentLatencyP99: 40,
      carbonIntensity: 520, // Dirty grid allows safe consolidation
      policy: defaultPolicy,
      lastScaleTimestamp: Date.now() - 60000, // Cooldown expired
    });

    assert.equal(decision.decisionAction, 'SCALE_DOWN', 'Should safely consolidate idle replicas');
    assert.ok(decision.targetCpuThreshold > 60, 'Target CPU should be elevated under dirty grid');
    assert.ok(decision.targetReplicas < 10, 'Replicas should be consolidated');
    assert.ok(decision.targetReplicas >= defaultPolicy.minReplicas, 'Must respect minReplicas constraint');
  });

  test('Enforces anti-flapping stabilization cooldown on scale-down', () => {
    // Only 10 seconds since last scale event (cooldown is 30s)
    const decision = evaluateScalingPolicy({
      currentRps: 600,
      currentReplicas: 10,
      currentLatencyP99: 40,
      carbonIntensity: 520,
      policy: defaultPolicy,
      lastScaleTimestamp: Date.now() - 10000, // Only 10s ago
      now: Date.now(),
    });

    assert.equal(decision.decisionAction, 'MAINTAIN', 'Must maintain during cooldown window');
    assert.equal(decision.targetReplicas, 10, 'Replicas must be held during cooldown');
    assert.ok(decision.reason.includes('Stabilization Window Active'));
  });

  test('Generates full 6-point explanation trace for auditability', () => {
    const decision = evaluateScalingPolicy({
      currentRps: 900,
      currentReplicas: 8,
      currentLatencyP99: 60,
      carbonIntensity: 430,
      policy: defaultPolicy,
      lastScaleTimestamp: Date.now() - 60000,
    });

    const trace = decision.explanationTrace;
    assert.ok(trace.workloadRps === 900);
    assert.ok(trace.gridCarbonIntensityGCO2 === 430);
    assert.ok(trace.replicaCounts.current === 8);
    assert.ok(trace.energyEmissionsImpact.powerWatts > 0);
    assert.ok(trace.sloGuardrailCheck.sloLatencyCeilingMs === 150);
    assert.ok(typeof trace.justification === 'string' && trace.justification.length > 10);
  });

  test('Clamps desired replicas strictly within [minReplicas, maxReplicas]', () => {
    // Ultra low load: 10 RPS on minReplicas=2
    const lowDecision = evaluateScalingPolicy({
      currentRps: 10,
      currentReplicas: 2,
      currentLatencyP99: 30,
      carbonIntensity: 600,
      policy: defaultPolicy,
      lastScaleTimestamp: Date.now() - 60000,
    });
    assert.ok(lowDecision.targetReplicas >= defaultPolicy.minReplicas, 'Must not drop below minReplicas');

    // Massive overload: 100,000 RPS
    const highDecision = evaluateScalingPolicy({
      currentRps: 100000,
      currentReplicas: 25,
      currentLatencyP99: 100,
      carbonIntensity: 100,
      policy: defaultPolicy,
      lastScaleTimestamp: Date.now() - 60000,
    });
    assert.ok(highDecision.targetReplicas <= defaultPolicy.maxReplicas, 'Must not exceed maxReplicas');
  });
});

describe('Benchmark Experiment Execution', () => {
  test('executeExperiment computes 24h diurnal benchmark with verified carbon savings', async () => {
    const { executeExperiment, EVALUATION_SCENARIOS } = await import('../server/engine.mjs');
    const result = executeExperiment('scenario-diurnal-24h');
    assert.equal(result.totalHours, 24);
    assert.equal(result.hourlyTrace.length, 24);
    assert.ok(result.summary.netCarbonAvoidedKg >= 0);
    assert.ok(result.summary.netEnergySavedKWh >= 0);
    assert.ok(result.summary.sloComplianceRate >= 95);
  });
});
