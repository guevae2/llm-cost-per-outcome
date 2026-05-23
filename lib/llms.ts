export interface Provenance {
  pricingUrl: string;
  lastVerified: string;
}

export interface LLMModel {
  name: string;
  inputCostPerM: number;
  outputCostPerM: number;
  qualityScore: number;
  qualityScoreSource: string;
  provenance: Provenance;
}

export interface TokenEstimate {
  inputTokens: number;
  outputTokens: number;
  source: 'aider' | 'swe-bench' | 'agentnoah-owasp' | 'user-input';
}

export interface TaskCategory {
  name: string;
  defaultRetryRate: number;
  tokenEstimates: Record<string, TokenEstimate>;
}

export const LLM_MODELS: Record<string, LLMModel> = {
  'claude-opus-4-7': {
    name: 'Claude 4.7 Opus',
    inputCostPerM: 15.0,
    outputCostPerM: 75.0,
    qualityScore: 86.8,
    qualityScoreSource: 'https://aider.chat/docs/leaderboards/',
    provenance: {
      pricingUrl: 'https://www.anthropic.com/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'claude-sonnet-4-6': {
    name: 'Claude 4.6 Sonnet',
    inputCostPerM: 3.0,
    outputCostPerM: 15.0,
    qualityScore: 85.2,
    qualityScoreSource: 'https://aider.chat/docs/leaderboards/',
    provenance: {
      pricingUrl: 'https://www.anthropic.com/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'claude-haiku-4-5': {
    name: 'Claude 4.5 Haiku',
    inputCostPerM: 0.8,
    outputCostPerM: 4.0,
    qualityScore: 79.1,
    qualityScoreSource: 'https://aider.chat/docs/leaderboards/',
    provenance: {
      pricingUrl: 'https://www.anthropic.com/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'gpt-4o': {
    name: 'GPT-4o',
    inputCostPerM: 2.5,
    outputCostPerM: 10.0,
    qualityScore: 84.8,
    qualityScoreSource: 'https://aider.chat/docs/leaderboards/',
    provenance: {
      pricingUrl: 'https://openai.com/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'gpt-4o-mini': {
    name: 'GPT-4o mini',
    inputCostPerM: 0.15,
    outputCostPerM: 0.6,
    qualityScore: 76.5,
    qualityScoreSource: 'https://aider.chat/docs/leaderboards/',
    provenance: {
      pricingUrl: 'https://openai.com/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'o3-mini': {
    name: 'o3-mini',
    inputCostPerM: 1.1,
    outputCostPerM: 4.4,
    qualityScore: 85.6,
    qualityScoreSource: 'https://aider.chat/docs/leaderboards/',
    provenance: {
      pricingUrl: 'https://openai.com/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'gemini-pro-3-1': {
    name: 'Gemini 3.1 Pro',
    inputCostPerM: 1.25,
    outputCostPerM: 5.0,
    qualityScore: 83.5,
    qualityScoreSource: 'https://chat.lmsys.org/?arena',
    provenance: {
      pricingUrl: 'https://ai.google.dev/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'gemini-flash-3-5': {
    name: 'Gemini 3.5 Flash',
    inputCostPerM: 0.075,
    outputCostPerM: 0.3,
    qualityScore: 78.9,
    qualityScoreSource: 'https://chat.lmsys.org/?arena',
    provenance: {
      pricingUrl: 'https://ai.google.dev/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'gemini-flash-3': {
    name: 'Gemini 3 Flash',
    inputCostPerM: 0.075,
    outputCostPerM: 0.3,
    qualityScore: 74.0,
    qualityScoreSource: 'https://chat.lmsys.org/?arena',
    provenance: {
      pricingUrl: 'https://ai.google.dev/pricing',
      lastVerified: '2026-05-23'
    }
  },
  'deepseek-v3': {
    name: 'DeepSeek V3',
    inputCostPerM: 0.55,
    outputCostPerM: 2.19,
    qualityScore: 82.1,
    qualityScoreSource: 'https://chat.lmsys.org/?arena',
    provenance: {
      pricingUrl: 'https://api-docs.deepseek.com/pricing',
      lastVerified: '2026-05-23'
    }
  }
};

export const TASK_CATEGORIES: Record<string, TaskCategory> = {
  'unit-test': {
    name: 'Write a unit test',
    defaultRetryRate: 1.1,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 4200, outputTokens: 2200, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 4000, outputTokens: 1800, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 3800, outputTokens: 1300, source: 'aider' },
      'gpt-4o': { inputTokens: 4100, outputTokens: 1900, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 3900, outputTokens: 1400, source: 'aider' },
      'o3-mini': { inputTokens: 4500, outputTokens: 2500, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 4300, outputTokens: 2000, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 3850, outputTokens: 1450, source: 'aider' },
      'gemini-flash-3': { inputTokens: 3800, outputTokens: 1200, source: 'aider' },
      'deepseek-v3': { inputTokens: 4000, outputTokens: 1850, source: 'aider' }
    }
  },
  'security-audit': {
    name: 'Audit 500-line file for security bugs',
    defaultRetryRate: 1.5,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 14000, outputTokens: 3800, source: 'agentnoah-owasp' },
      'claude-sonnet-4-6': { inputTokens: 13000, outputTokens: 3200, source: 'agentnoah-owasp' },
      'claude-haiku-4-5': { inputTokens: 12000, outputTokens: 2200, source: 'agentnoah-owasp' },
      'gpt-4o': { inputTokens: 13500, outputTokens: 3400, source: 'agentnoah-owasp' },
      'gpt-4o-mini': { inputTokens: 12500, outputTokens: 2400, source: 'agentnoah-owasp' },
      'o3-mini': { inputTokens: 15000, outputTokens: 4800, source: 'agentnoah-owasp' },
      'gemini-pro-3-1': { inputTokens: 14500, outputTokens: 3500, source: 'agentnoah-owasp' },
      'gemini-flash-3-5': { inputTokens: 12800, outputTokens: 2500, source: 'agentnoah-owasp' },
      'gemini-flash-3': { inputTokens: 12500, outputTokens: 2000, source: 'agentnoah-owasp' },
      'deepseek-v3': { inputTokens: 13000, outputTokens: 3300, source: 'agentnoah-owasp' }
    }
  },
  'pr-summary': {
    name: 'Summarize a PR',
    defaultRetryRate: 1.1,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 18000, outputTokens: 1100, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 16000, outputTokens: 950, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 14000, outputTokens: 650, source: 'aider' },
      'gpt-4o': { inputTokens: 17000, outputTokens: 1000, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 15000, outputTokens: 700, source: 'aider' },
      'o3-mini': { inputTokens: 19000, outputTokens: 1500, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 20000, outputTokens: 1200, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 15500, outputTokens: 750, source: 'aider' },
      'gemini-flash-3': { inputTokens: 15000, outputTokens: 600, source: 'aider' },
      'deepseek-v3': { inputTokens: 16500, outputTokens: 900, source: 'aider' }
    }
  },
  'generate-docs': {
    name: 'Generate API docs',
    defaultRetryRate: 1.2,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 9000, outputTokens: 3200, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 8500, outputTokens: 2800, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 7500, outputTokens: 1800, source: 'aider' },
      'gpt-4o': { inputTokens: 8800, outputTokens: 2900, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 8000, outputTokens: 1950, source: 'aider' },
      'o3-mini': { inputTokens: 9500, outputTokens: 3600, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 9200, outputTokens: 3000, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 8200, outputTokens: 2100, source: 'aider' },
      'gemini-flash-3': { inputTokens: 8000, outputTokens: 1700, source: 'aider' },
      'deepseek-v3': { inputTokens: 8400, outputTokens: 2700, source: 'aider' }
    }
  },
  'debug-stack': {
    name: 'Debug a stack trace',
    defaultRetryRate: 1.6,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 7000, outputTokens: 2800, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 6500, outputTokens: 2400, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 5800, outputTokens: 1500, source: 'aider' },
      'gpt-4o': { inputTokens: 6800, outputTokens: 2500, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 6000, outputTokens: 1600, source: 'aider' },
      'o3-mini': { inputTokens: 8000, outputTokens: 3500, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 7500, outputTokens: 2600, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 6200, outputTokens: 1750, source: 'aider' },
      'gemini-flash-3': { inputTokens: 6000, outputTokens: 1400, source: 'aider' },
      'deepseek-v3': { inputTokens: 6400, outputTokens: 2300, source: 'aider' }
    }
  },
  'refactor-func': {
    name: 'Refactor a function',
    defaultRetryRate: 1.4,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 6000, outputTokens: 2500, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 5500, outputTokens: 2100, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 4800, outputTokens: 1300, source: 'aider' },
      'gpt-4o': { inputTokens: 5800, outputTokens: 2200, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 5000, outputTokens: 1400, source: 'aider' },
      'o3-mini': { inputTokens: 6500, outputTokens: 3000, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 6200, outputTokens: 2300, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 5200, outputTokens: 1500, source: 'aider' },
      'gemini-flash-3': { inputTokens: 5000, outputTokens: 1200, source: 'aider' },
      'deepseek-v3': { inputTokens: 5400, outputTokens: 2000, source: 'aider' }
    }
  }
};

export const SECURITY_AUDIT_QUALITY_OVERRIDES: Record<string, { qualityScore: number; qualityScoreSource: string }> = {
  'claude-opus-4-7': {
    qualityScore: 100.0,
    qualityScoreSource: 'https://agentnoah.dev/blog/3-model-byol-evidence'
  },
  'claude-sonnet-4-6': {
    qualityScore: 82.1,
    qualityScoreSource: 'https://agentnoah.dev/blog/3-model-byol-evidence'
  },
  'gemini-pro-3-1': {
    qualityScore: 80.2,
    qualityScoreSource: 'https://agentnoah.dev/blog/3-model-byol-evidence'
  },
  'gemini-flash-3-5': {
    qualityScore: 100.0,
    qualityScoreSource: 'https://agentnoah.dev/blog/3-model-byol-evidence'
  },
  'gemini-flash-3': {
    qualityScore: 75.0,
    qualityScoreSource: 'https://agentnoah.dev/blog/3-model-byol-evidence'
  }
};

export function getModelQuality(modelId: string, taskId: string): { qualityScore: number; qualityScoreSource: string } {
  if (taskId === 'security-audit' && SECURITY_AUDIT_QUALITY_OVERRIDES[modelId]) {
    return SECURITY_AUDIT_QUALITY_OVERRIDES[modelId];
  }
  const model = LLM_MODELS[modelId];
  return {
    qualityScore: model?.qualityScore || 0,
    qualityScoreSource: model?.qualityScoreSource || ''
  };
}

export function calculateOutcomeCost(modelId: string, taskId: string, retryRate: number): number {
  const model = LLM_MODELS[modelId];
  const category = TASK_CATEGORIES[taskId];
  if (!model || !category) return 0;
  const estimate = category.tokenEstimates[modelId];
  if (!estimate) return 0;
  
  const inCost = (estimate.inputTokens / 1000000) * model.inputCostPerM;
  const outCost = (estimate.outputTokens / 1000000) * model.outputCostPerM;
  return (inCost + outCost) * retryRate;
}
