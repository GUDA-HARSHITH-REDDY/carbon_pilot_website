/**
 * Carbon Pilot Core Decision Engine & Carbon/Energy Calculation Library
 * 
 * Mathematical Formulation:
 * 1. Power Model (per container instance):
 *    P_idle = 40 Watts (0.040 kW) base runtime overhead
 *    P_dynamic = 80 Watts (0.080 kW) at 100% CPU utilization
 *    P_pod(u) = P_idle + (P_dynamic * (u / 100))
 * 
 * 2. Energy Consumption (kWh):
 *    Energy_kWh = (Total_Power_Watts / 1000) * (Duration_Seconds / 3600)
 * 
 * 3. Operational Emissions (gCO2e):
 *    Emissions_g = Energy_kWh * Carbon_Intensity_gCO2e_per_kWh
 * 
 * 4. Carbon-Aware Scaling Policy:
 *    - SLO Guardrail: If Latency_P99 >= (SLO_Ceiling - Safety_Margin), Target_CPU reverts to Base_CPU.
 *    - Eco-Tuning: Target_CPU = Base_CPU + (Max_Allowed_CPU - Base_CPU) * Normalized_Carbon * Alpha
 *    - Desired Replicas: Ceil(Current_Load_Workload / Target_Capacity_Per_Pod) bounded by [Min_Replicas, Max_Replicas]
 */

export const POWER_MODEL = {
  IDLE_WATTS_PER_POD: 40,
  MAX_DYNAMIC_WATTS_PER_POD: 80,
  CONTAINER_MEMORY_WATTS_PER_GB: 3,
};

/**
 * Calculates estimated instantaneous power consumption in Watts for a set of pods
 * @param {number} replicas - Number of running pod instances
 * @param {number} cpuUtilPercent - Average CPU utilization percentage (0 - 100)
 * @returns {number} Power in Watts
 */
export function calculatePowerWatts(replicas, cpuUtilPercent) {
  if (replicas <= 0) return 0;
  const clampedCpu = Math.max(0, Math.min(100, cpuUtilPercent));
  const podWatts = POWER_MODEL.IDLE_WATTS_PER_POD + 
    (POWER_MODEL.MAX_DYNAMIC_WATTS_PER_POD * (clampedCpu / 100));
  return Number((replicas * podWatts).toFixed(2));
}

/**
 * Converts power (Watts) and duration (seconds) into Energy (kWh)
 * @param {number} powerWatts - Power in Watts
 * @param {number} durationSeconds - Duration of observation in seconds
 * @returns {number} Energy in kilowatt-hours (kWh)
 */
export function calculateEnergyKWh(powerWatts, durationSeconds) {
  if (powerWatts <= 0 || durationSeconds <= 0) return 0;
  const hours = durationSeconds / 3600;
  const kW = powerWatts / 1000;
  return Number((kW * hours).toFixed(6));
}

/**
 * Calculates operational carbon emissions in grams of CO2 equivalent (gCO2e)
 * @param {number} energyKWh - Energy in kWh
 * @param {number} carbonIntensityGCO2PerKWh - Grid carbon intensity in gCO2e/kWh
 * @returns {number} Carbon emissions in grams CO2e
 */
export function calculateEmissionsGrams(energyKWh, carbonIntensityGCO2PerKWh) {
  if (energyKWh <= 0 || carbonIntensityGCO2PerKWh <= 0) return 0;
  return Number((energyKWh * carbonIntensityGCO2PerKWh).toFixed(4));
}

/**
 * Computes comparative savings between baseline HPA and Carbon Pilot
 * @param {object} baseline - { replicas, cpuPercent }
 * @param {object} optimized - { replicas, cpuPercent }
 * @param {number} durationSeconds - Observation window
 * @param {number} carbonIntensity - Current grid carbon intensity (gCO2e/kWh)
 */
export function computeComparativeSavings(baseline, optimized, durationSeconds, carbonIntensity) {
  const baseWatts = calculatePowerWatts(baseline.replicas, baseline.cpuPercent);
  const optWatts = calculatePowerWatts(optimized.replicas, optimized.cpuPercent);

  const baseKWh = calculateEnergyKWh(baseWatts, durationSeconds);
  const optKWh = calculateEnergyKWh(optWatts, durationSeconds);

  const baseEmissions = calculateEmissionsGrams(baseKWh, carbonIntensity);
  const optEmissions = calculateEmissionsGrams(optKWh, carbonIntensity);

  const emissionsAvoidedGrams = Math.max(0, Number((baseEmissions - optEmissions).toFixed(4)));
  const energySavedKWh = Math.max(0, Number((baseKWh - optKWh).toFixed(6)));
  const percentageAvoided = baseEmissions > 0 
    ? Number(((emissionsAvoidedGrams / baseEmissions) * 100).toFixed(1)) 
    : 0;

  return {
    baseWatts,
    optWatts,
    baseKWh,
    optKWh,
    baseEmissionsGrams: baseEmissions,
    optEmissionsGrams: optEmissions,
    emissionsAvoidedGrams,
    energySavedKWh,
    percentageAvoided,
  };
}

/**
 * Carbon-Aware Scaling Decision Engine
 * Prioritizes SLO and workload integrity over carbon conservation.
 * 
 * @param {object} params
 * @param {number} params.currentRps - Workload requests per second
 * @param {number} params.currentReplicas - Current pod count
 * @param {number} params.currentLatencyP99 - Live P99 latency in ms
 * @param {number} params.carbonIntensity - Grid carbon intensity in gCO2e/kWh
 * @param {object} params.policy - CarbonPolicy specification
 * @param {number} params.lastScaleTimestamp - Timestamp of previous scaling event
 * @param {number} params.now - Current timestamp in ms
 * @returns {object} Decision output with full 6-point explanation trace
 */
export function evaluateScalingPolicy({
  currentRps,
  currentReplicas,
  currentLatencyP99,
  carbonIntensity,
  policy,
  lastScaleTimestamp = 0,
  now = Date.now(),
}) {
  const {
    baseCpuThreshold = 60,
    maxAllowedCpuThreshold = 80,
    carbonWeightAlpha = 0.75,
    sloLatencyCeilingMs = 150,
    safetyMarginMs = 25,
    minReplicas = 2,
    maxReplicas = 25,
    cooldownSeconds = 30,
    nominalRpsPerReplica = 120,
  } = policy;

  // 1. Calculate Standard Baseline HPA Desired Replicas (fixed at baseCpuThreshold)
  const baselineDesiredPods = Math.max(
    minReplicas,
    Math.min(maxReplicas, Math.ceil(currentRps / nominalRpsPerReplica))
  );

  // 2. Assess Latency Slack & Performance Risk
  const latencySlack = sloLatencyCeilingMs - currentLatencyP99;
  const isSloThreatened = latencySlack <= safetyMarginMs;
  const isHighTrafficSurge = currentRps > (currentReplicas * nominalRpsPerReplica * 0.95);

  let targetCpu = baseCpuThreshold;
  let decisionAction = 'MAINTAIN';
  let targetReplicas = baselineDesiredPods;
  let reason = '';
  let guardrailActive = false;

  // 3. Performance First Decision Logic
  if (isSloThreatened) {
    // Latency is dangerously close to SLO ceiling: Immediate back-off!
    guardrailActive = true;
    targetCpu = baseCpuThreshold;
    targetReplicas = Math.max(currentReplicas, baselineDesiredPods);
    decisionAction = targetReplicas > currentReplicas ? 'SCALE_UP' : 'MAINTAIN';
    reason = `SLO Guardrail Activated: P99 latency (${currentLatencyP99}ms) within safety margin (${safetyMarginMs}ms) of ${sloLatencyCeilingMs}ms ceiling. Carbon optimization suspended. Reverting to base target ${baseCpuThreshold}% CPU.`;
  } else if (isHighTrafficSurge) {
    // Traffic surge: scale up promptly to protect performance
    targetCpu = baseCpuThreshold;
    targetReplicas = Math.max(currentReplicas + 1, baselineDesiredPods);
    decisionAction = 'SCALE_UP';
    reason = `Workload Demand Surge: Load (${currentRps} RPS) exceeds 95% capacity of current ${currentReplicas} pods. Scaling up promptly to safeguard latency.`;
  } else {
    // Performance is safe: Evaluate whether carbon intensity justifies higher CPU density
    // Normalize grid intensity (e.g. 80 gCO2/kWh = 0.0, 600 gCO2/kWh = 1.0)
    const normalizedCarbon = Math.min(1.0, Math.max(0.0, (carbonIntensity - 80) / 520));
    const allowedBoost = (maxAllowedCpuThreshold - baseCpuThreshold) * normalizedCarbon * carbonWeightAlpha;
    targetCpu = Math.round(baseCpuThreshold + allowedBoost);

    // Compute pods required under tuned target CPU
    const effectivePodCapacity = nominalRpsPerReplica * (targetCpu / baseCpuThreshold);
    const calculatedPods = Math.ceil(currentRps / effectivePodCapacity);
    targetReplicas = Math.max(minReplicas, Math.min(maxReplicas, calculatedPods));

    // Check anti-flapping stabilization cooldown for scale-down
    const elapsedSeconds = (now - lastScaleTimestamp) / 1000;
    if (targetReplicas < currentReplicas) {
      if (elapsedSeconds < cooldownSeconds) {
        targetReplicas = currentReplicas;
        decisionAction = 'MAINTAIN';
        reason = `Stabilization Window Active: Carbon-aware downscaling held for cooldown period (${Math.round(cooldownSeconds - elapsedSeconds)}s remaining) to prevent replica oscillation.`;
      } else {
        decisionAction = 'SCALE_DOWN';
        reason = `Eco-Consolidation: High grid carbon intensity (${carbonIntensity} gCO2e/kWh) with safe latency buffer (${latencySlack}ms). Safely increased target CPU to ${targetCpu}%, trimming ${currentReplicas - targetReplicas} surplus replicas.`;
      }
    } else if (targetReplicas > currentReplicas) {
      decisionAction = 'SCALE_UP';
      reason = `Proactive Scaling: Increased workload (${currentRps} RPS) requires scaling from ${currentReplicas} to ${targetReplicas} pods.`;
    } else {
      decisionAction = 'MAINTAIN';
      reason = `Balanced Equilibrium: Current ${currentReplicas} replicas perfectly match target CPU of ${targetCpu}% at ${carbonIntensity} gCO2e/kWh.`;
    }
  }

  // 4. Expected latency under target CPU
  const estimatedLatencyP99 = Math.min(
    sloLatencyCeilingMs - 2,
    Math.round(45 + (targetCpu / 100) * 80 + (currentRps / (targetReplicas * nominalRpsPerReplica)) * 30)
  );

  // 5. Environmental & Energy Impact
  const actualBaseCpu = Math.min(100, Math.max(15, Math.round((currentRps / (baselineDesiredPods * nominalRpsPerReplica)) * baseCpuThreshold)));
  const actualOptCpu = Math.min(100, Math.max(15, Math.round((currentRps / (targetReplicas * nominalRpsPerReplica)) * baseCpuThreshold)));

  const comparative = computeComparativeSavings(
    { replicas: baselineDesiredPods, cpuPercent: actualBaseCpu },
    { replicas: targetReplicas, cpuPercent: actualOptCpu },
    60, // 1-minute rate
    carbonIntensity
  );

  return {
    timestamp: new Date(now).toISOString(),
    decisionAction,
    targetCpuThreshold: targetCpu,
    currentReplicas,
    targetReplicas,
    replicasDelta: targetReplicas - currentReplicas,
    baselineReplicas: baselineDesiredPods,
    guardrailActive,
    reason,
    explanationTrace: {
      workloadRps: currentRps,
      observedCpuPercent: targetCpu,
      gridCarbonIntensityGCO2: carbonIntensity,
      replicaCounts: {
        current: currentReplicas,
        desired: targetReplicas,
        baselineStandardHpa: baselineDesiredPods,
      },
      energyEmissionsImpact: {
        powerWatts: comparative.optWatts,
        baselinePowerWatts: comparative.baseWatts,
        savedPowerWatts: Math.max(0, comparative.baseWatts - comparative.optWatts),
        carbonSavedGramsPerMin: comparative.emissionsAvoidedGrams,
        percentageCarbonReduction: comparative.percentageAvoided,
      },
      sloGuardrailCheck: {
        currentLatencyP99,
        estimatedLatencyP99,
        sloLatencyCeilingMs,
        safetyMarginMs,
        latencySlackMs: latencySlack,
        isCompliant: estimatedLatencyP99 <= sloLatencyCeilingMs,
      },
      justification: reason,
    },
  };
}
