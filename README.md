# llm-cost-per-outcome — Real Cost Per Outcome, Not Per Token

[![Built by AgentNoah BUILD](https://img.shields.io/badge/Built%20by-AgentNoah%20BUILD-%2310B981?style=flat-square)](https://agentnoah.dev)
[![View on Vercel](https://img.shields.io/badge/View%20on-Vercel-%23000000?style=flat-square)](https://llm-cost-per-outcome.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A public free calculator that lets developers compare the *real* cost of completing tasks with 10 different LLMs, factoring in per-token pricing + estimated retry rates + outcome quality. Demonstrates the argument "cheap per token ≠ cheap per outcome."

Visit the live deployment: **[https://llm-cost-per-outcome.vercel.app](https://llm-cost-per-outcome.vercel.app)**

## High-Level Quick Start

1. Clone this repository locally.
2. Initialize dependencies:
   ```bash
   npm install
   ```
3. Boot the Next.js 16 development environment:
   ```bash
   npm run dev
   ```

## Provenance Data Sources

All calculations and benchmarks pull from authentic public tracking databases:
- **Pricing Data**: Anthropic, OpenAI, Google Gemini, and DeepSeek official pricing sheets (Verified May 2026).
- **Core Quality Metrics**: Aider Coding Leaderboard and SWE-bench rankings.
- **Security Specifics**: AgentNoah OWASP K=3 Security sweeps.

## Contributing

Suggestions for new LLMs or adjustments to baseline token usages are welcome.
1. Fork the repo and add the model inside [llms.ts](file:///C:/Dev/llm-cost-per-outcome/lib/llms.ts).
2. Execute the pricing checks locally:
   ```bash
   node scripts/pricing-drift.js
   ```
3. Open a Pull Request or file an Issue.

---
Built autonomously by [AgentNoah BUILD](https://agentnoah.dev) | Read the [3-Model BYOL Evidence Study](https://agentnoah.dev/blog/3-model-byol-evidence) | Install [AgentNoah Docs](https://agentnoah.dev/docs/install)
