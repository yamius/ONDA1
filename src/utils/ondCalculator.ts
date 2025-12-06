interface PracticeMetrics {
  actualDurationSeconds: number;
  expectedDurationSeconds: number;
  stressBefore: number | null;
  stressAfter: number | null;
  energyBefore: number | null;
  energyAfter: number | null;
  baseOndReward: number;
  hasRealMetrics: boolean;
}

interface OndReward {
  completionOnd: number;
  performanceOnd: number;
  totalOnd: number;
  completionPercent: number;
  performancePercent: number;
  isSimulated?: boolean;
}

export function calculatePracticeOnd(metrics: PracticeMetrics): OndReward {
  const {
    actualDurationSeconds,
    expectedDurationSeconds,
    stressBefore,
    stressAfter,
    energyBefore,
    energyAfter,
    baseOndReward,
    hasRealMetrics
  } = metrics;

  const completionRatio = Math.min(actualDurationSeconds / expectedDurationSeconds, 1);
  const completionOnd = baseOndReward * 0.15 * completionRatio;

  // If no real metrics, simulate gradual improvement based on practice completion
  if (!hasRealMetrics || stressBefore === null || stressAfter === null || energyBefore === null || energyAfter === null) {
    // Simulate improvement: stress decreases by 3%, energy increases by 3%
    // The effect scales with completion ratio for realism
    const simulatedStressReduction = 3 * completionRatio; // 0-3% reduction based on time spent
    const simulatedEnergyIncrease = 3 * completionRatio;  // 0-3% increase based on time spent
    
    // Add slight randomness for realism (±0.5%)
    const stressVariance = (Math.random() - 0.5) * 1;
    const energyVariance = (Math.random() - 0.5) * 1;
    
    const finalStressReduction = Math.max(0, simulatedStressReduction + stressVariance);
    const finalEnergyIncrease = Math.max(0, simulatedEnergyIncrease + energyVariance);
    
    // Calculate scores (target is 10% change for full score)
    const stressTarget = 10;
    const energyTarget = 10;
    const stressScore = Math.min(finalStressReduction / stressTarget, 1);
    const energyScore = Math.min(finalEnergyIncrease / energyTarget, 1);
    
    // Calculate simulated performance OND (same weights as real metrics)
    const stressOnd = baseOndReward * 0.40 * stressScore;
    const energyOnd = baseOndReward * 0.45 * energyScore;
    const simulatedPerformanceOnd = stressOnd + energyOnd;
    
    const totalOnd = completionOnd + simulatedPerformanceOnd;
    
    return {
      completionOnd: Math.round(completionOnd * 100) / 100,
      performanceOnd: Math.round(simulatedPerformanceOnd * 100) / 100,
      totalOnd: Math.round(totalOnd * 100) / 100,
      completionPercent: Math.round(completionRatio * 100),
      performancePercent: Math.round(((stressScore + energyScore) / 2) * 100),
      isSimulated: true
    };
  }

  // Real metrics calculation
  const stressChange = ((stressBefore - stressAfter) / stressBefore) * 100;
  const stressTarget = 10;
  const stressScore = Math.min(Math.max(stressChange / stressTarget, 0), 1);
  const stressOnd = baseOndReward * 0.40 * stressScore;

  const energyChange = ((energyAfter - energyBefore) / energyBefore) * 100;
  const energyTarget = 10;
  const energyScore = Math.min(Math.max(energyChange / energyTarget, 0), 1);
  const energyOnd = baseOndReward * 0.45 * energyScore;

  const performanceOnd = stressOnd + energyOnd;
  const totalOnd = completionOnd + performanceOnd;

  return {
    completionOnd: Math.round(completionOnd * 100) / 100,
    performanceOnd: Math.round(performanceOnd * 100) / 100,
    totalOnd: Math.round(totalOnd * 100) / 100,
    completionPercent: Math.round(completionRatio * 100),
    performancePercent: Math.round(((stressScore + energyScore) / 2) * 100),
    isSimulated: false
  };
}
