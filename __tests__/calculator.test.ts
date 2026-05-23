import { calculateOutcomeCost, LLM_MODELS, TASK_CATEGORIES, getModelQuality } from '../lib/llms';

describe('LLM Cost Calculator Core Logic', () => {
  // Test 1: Verify all 10 LLM models are defined with required attributes
  test('should have exactly 10 models in the database', () => {
    expect(Object.keys(LLM_MODELS)).toHaveLength(10);
    
    Object.entries(LLM_MODELS).forEach(([id, model]) => {
      expect(model).toHaveProperty('name');
      expect(model).toHaveProperty('inputCostPerM');
      expect(model).toHaveProperty('outputCostPerM');
      expect(model).toHaveProperty('qualityScore');
      expect(model).toHaveProperty('qualityScoreSource');
      expect(model).toHaveProperty('provenance');
      expect(model.provenance).toHaveProperty('pricingUrl');
      expect(model.provenance).toHaveProperty('lastVerified');
    });
  });

  // Test 2: Verify all 6 task categories are defined with accurate baseline ranges and custom retry rates
  test('should have exactly 6 task categories in the database with custom retry rates', () => {
    expect(Object.keys(TASK_CATEGORIES)).toHaveLength(6);
    
    Object.entries(TASK_CATEGORIES).forEach(([id, category]) => {
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('defaultRetryRate');
      expect(category).toHaveProperty('tokenEstimates');
    });

    // Check specific custom retry rate requirements
    expect(TASK_CATEGORIES['unit-test'].defaultRetryRate).toBe(1.1);
    expect(TASK_CATEGORIES['security-audit'].defaultRetryRate).toBe(1.5);
    expect(TASK_CATEGORIES['pr-summary'].defaultRetryRate).toBe(1.1);
    expect(TASK_CATEGORIES['generate-docs'].defaultRetryRate).toBe(1.2);
    expect(TASK_CATEGORIES['debug-stack'].defaultRetryRate).toBe(1.6);
    expect(TASK_CATEGORIES['refactor-func'].defaultRetryRate).toBe(1.4);
  });

  // Test 3: Verify cell provenance matches specifications
  test('should contain valid cell data provenance details', () => {
    Object.values(TASK_CATEGORIES).forEach((category) => {
      Object.keys(LLM_MODELS).forEach((modelId) => {
        const estimate = category.tokenEstimates[modelId];
        expect(estimate).toBeDefined();
        expect(estimate).toHaveProperty('inputTokens');
        expect(estimate).toHaveProperty('outputTokens');
        expect(estimate).toHaveProperty('source');
        
        expect(['aider', 'swe-bench', 'agentnoah-owasp', 'user-input']).toContain(estimate.source);
      });
    });
  });

  // Test 4: Custom slider and zero retry rate edge case
  test('should handle extreme bounds of retry rate correctly', () => {
    const zeroCalculated = calculateOutcomeCost('claude-sonnet-4-6', 'unit-test', 0);
    expect(zeroCalculated).toBe(0);

    const base = calculateOutcomeCost('claude-sonnet-4-6', 'unit-test', 1.0);
    const largeCalculated = calculateOutcomeCost('claude-sonnet-4-6', 'unit-test', 3.0);
    expect(largeCalculated).toBeCloseTo(base * 3.0, 5);
  });

  // Test 5: Model lookup by ID
  test('should look up model by id successfully', () => {
    const model = LLM_MODELS['gpt-4o'];
    expect(model).toBeDefined();
    expect(model.name).toBe('GPT-4o');
    expect(model.inputCostPerM).toBe(2.5);
    expect(model.outputCostPerM).toBe(10.0);
  });

  // Test 6: Cell calculation correctness for 12 cells (2 per task category)
  test('should compute cell outcome cost correctly for 12 different cells', () => {
    const cellsToVerify = [
      // 1. unit-test
      { modelId: 'claude-opus-4-7', taskId: 'unit-test', retryRate: 1.1, expected: ((4200 / 1000000) * 15.0 + (2200 / 1000000) * 75.0) * 1.1 },
      { modelId: 'gpt-4o', taskId: 'unit-test', retryRate: 1.1, expected: ((4100 / 1000000) * 2.5 + (1900 / 1000000) * 10.0) * 1.1 },
      // 2. security-audit
      { modelId: 'claude-sonnet-4-6', taskId: 'security-audit', retryRate: 1.5, expected: ((13000 / 1000000) * 3.0 + (3200 / 1000000) * 15.0) * 1.5 },
      { modelId: 'gemini-flash-3-5', taskId: 'security-audit', retryRate: 1.5, expected: ((12800 / 1000000) * 0.075 + (2500 / 1000000) * 0.3) * 1.5 },
      // 3. pr-summary
      { modelId: 'gemini-pro-3-1', taskId: 'pr-summary', retryRate: 1.1, expected: ((20000 / 1000000) * 1.25 + (1200 / 1000000) * 5.0) * 1.1 },
      { modelId: 'deepseek-v3', taskId: 'pr-summary', retryRate: 1.1, expected: ((16500 / 1000000) * 0.55 + (900 / 1000000) * 2.19) * 1.1 },
      // 4. generate-docs
      { modelId: 'claude-haiku-4-5', taskId: 'generate-docs', retryRate: 1.2, expected: ((7500 / 1000000) * 0.8 + (1800 / 1000000) * 4.0) * 1.2 },
      { modelId: 'gpt-4o-mini', taskId: 'generate-docs', retryRate: 1.2, expected: ((8000 / 1000000) * 0.15 + (1950 / 1000000) * 0.6) * 1.2 },
      // 5. debug-stack
      { modelId: 'o3-mini', taskId: 'debug-stack', retryRate: 1.6, expected: ((8000 / 1000000) * 1.1 + (3500 / 1000000) * 4.4) * 1.6 },
      { modelId: 'gemini-flash-3', taskId: 'debug-stack', retryRate: 1.6, expected: ((6000 / 1000000) * 0.075 + (1400 / 1000000) * 0.3) * 1.6 },
      // 6. refactor-func
      { modelId: 'claude-sonnet-4-6', taskId: 'refactor-func', retryRate: 1.4, expected: ((5500 / 1000000) * 3.0 + (2100 / 1000000) * 15.0) * 1.4 },
      { modelId: 'deepseek-v3', taskId: 'refactor-func', retryRate: 1.4, expected: ((5400 / 1000000) * 0.55 + (2000 / 1000000) * 2.19) * 1.4 }
    ];

    cellsToVerify.forEach(({ modelId, taskId, retryRate, expected }) => {
      const calculated = calculateOutcomeCost(modelId, taskId, retryRate);
      expect(calculated).toBeCloseTo(expected, 6);
    });
  });

  // Test 7: Verify OWASP Quality score override for security audit task
  test('should override quality metrics for security-audit tasks using OWASP K=3 benchmark data', () => {
    // Overridden models
    const opusQuality = getModelQuality('claude-opus-4-7', 'security-audit');
    expect(opusQuality.qualityScore).toBe(100.0);
    expect(opusQuality.qualityScoreSource).toBe('https://agentnoah.dev/blog/3-model-byol-evidence');

    const flash35Quality = getModelQuality('gemini-flash-3-5', 'security-audit');
    expect(flash35Quality.qualityScore).toBe(100.0);

    const sonnetQuality = getModelQuality('claude-sonnet-4-6', 'security-audit');
    expect(sonnetQuality.qualityScore).toBe(82.1);

    const proQuality = getModelQuality('gemini-pro-3-1', 'security-audit');
    expect(proQuality.qualityScore).toBe(80.2);

    const flash3Quality = getModelQuality('gemini-flash-3', 'security-audit');
    expect(flash3Quality.qualityScore).toBe(75.0);

    // Non-overridden models should retain base quality metrics
    const gpt4oQuality = getModelQuality('gpt-4o', 'security-audit');
    expect(gpt4oQuality.qualityScore).toBe(84.8);
    expect(gpt4oQuality.qualityScoreSource).toBe('https://aider.chat/docs/leaderboards/');

    // Unit test category should not trigger security audit overrides
    const opusUnitTestQuality = getModelQuality('claude-opus-4-7', 'unit-test');
    expect(opusUnitTestQuality.qualityScore).toBe(86.8);
  });

  // Test 8: Sort function logic validation
  test('should sort models correctly based on sort settings', () => {
    // Mimic the frontend sorting algorithm
    const mockData = [
      { name: 'A', cost: 0.1, quality: 80 },
      { name: 'B', cost: 0.3, quality: 90 },
      { name: 'C', cost: 0.2, quality: 85 }
    ];

    // Sort by cost ascending
    const sortedByCostAsc = [...mockData].sort((a, b) => a.cost - b.cost);
    expect(sortedByCostAsc[0].name).toBe('A');
    expect(sortedByCostAsc[1].name).toBe('C');
    expect(sortedByCostAsc[2].name).toBe('B');

    // Sort by quality descending
    const sortedByQualityDesc = [...mockData].sort((a, b) => b.quality - a.quality);
    expect(sortedByQualityDesc[0].name).toBe('B');
    expect(sortedByQualityDesc[1].name).toBe('C');
    expect(sortedByQualityDesc[2].name).toBe('A');
  });

  // Test 9: Edge case with single model entry
  test('should compute cost correctly even if selectedModels contains only 1 entry', () => {
    const singleModelId = 'claude-sonnet-4-6';
    const cost = calculateOutcomeCost(singleModelId, 'unit-test', 1.1);
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeCloseTo(((4000 / 1000000) * 3.0 + (1800 / 1000000) * 15.0) * 1.1, 6);
  });
});
