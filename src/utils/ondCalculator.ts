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

  if (!hasRealMetrics || stressBefore === null || stressAfter === null || energyBefore === null || energyAfter === null) {
    return {
      completionOnd: Math.round(completionOnd * 100) / 100,
      performanceOnd: 0,
      totalOnd: Math.round(completionOnd * 100) / 100,
      completionPercent: Math.round(completionRatio * 100),
      performancePercent: 0
    };
  }

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
    performancePercent: Math.round(((stressScore + energyScore) / 2) * 100)
  };
}
