export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  inputCostPerM: number,
  outputCostPerM: number,
  retryRate: number
): number {
  const baseCost = (inputTokens / 1000000) * inputCostPerM + (outputTokens / 1000000) * outputCostPerM;
  return baseCost * retryRate;
}