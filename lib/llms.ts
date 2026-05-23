export interface Provenance {
  pricingUrl: string;
  lastVerified: string;
}

export interface LLMModel {
  name: string;
  inputCostPerM: number;
  outputCostPerM: number;
  qualityScore: number;
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
    provenance: {
      pricingUrl: 'https://api-docs.deepseek.com/pricing',
      lastVerified: '2026-05-23'
    }
  }
};

export const TASK_CATEGORIES: Record<string, TaskCategory> = {
  'unit-test': {
    name: 'Write a unit test',
    defaultRetryRate: 1.3,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'gpt-4o': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'o3-mini': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'gemini-flash-3': { inputTokens: 4000, outputTokens: 1500, source: 'aider' },
      'deepseek-v3': { inputTokens: 4000, outputTokens: 1500, source: 'aider' }
    }
  },
  'security-audit': {
    name: 'Audit 500-line file for security bugs',
    defaultRetryRate: 1.3,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'claude-sonnet-4-6': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'claude-haiku-4-5': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'gpt-4o': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'gpt-4o-mini': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'o3-mini': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'gemini-pro-3-1': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'gemini-flash-3-5': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'gemini-flash-3': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' },
      'deepseek-v3': { inputTokens: 12000, outputTokens: 3000, source: 'agentnoah-owasp' }
    }
  },
  'pr-summary': {
    name: 'Summarize a PR',
    defaultRetryRate: 1.3,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'gpt-4o': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'o3-mini': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'gemini-flash-3': { inputTokens: 15000, outputTokens: 800, source: 'aider' },
      'deepseek-v3': { inputTokens: 15000, outputTokens: 800, source: 'aider' }
    }
  },
  'generate-docs': {
    name: 'Generate API docs',
    defaultRetryRate: 1.3,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'gpt-4o': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'o3-mini': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'gemini-flash-3': { inputTokens: 8000, outputTokens: 2500, source: 'aider' },
      'deepseek-v3': { inputTokens: 8000, outputTokens: 2500, source: 'aider' }
    }
  },
  'debug-stack': {
    name: 'Debug a stack trace',
    defaultRetryRate: 1.3,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'gpt-4o': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'o3-mini': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'gemini-flash-3': { inputTokens: 6000, outputTokens: 2000, source: 'aider' },
      'deepseek-v3': { inputTokens: 6000, outputTokens: 2000, source: 'aider' }
    }
  },
  'refactor-func': {
    name: 'Refactor a function',
    defaultRetryRate: 1.3,
    tokenEstimates: {
      'claude-opus-4-7': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'claude-sonnet-4-6': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'claude-haiku-4-5': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'gpt-4o': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'gpt-4o-mini': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'o3-mini': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'gemini-pro-3-1': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'gemini-flash-3-5': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'gemini-flash-3': { inputTokens: 5000, outputTokens: 1800, source: 'aider' },
      'deepseek-v3': { inputTokens: 5000, outputTokens: 1800, source: 'aider' }
    }
  }
};

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