import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BookOpen, Scale, FileSpreadsheet } from 'lucide-react';

export const metadata = {
  title: 'Methodology & Data Sources — LLM Cost Calculator',
  description: 'Detailed explanation of outcome cost calculations, model price provenance, and quality benchmarks used in the calculator.',
  alternates: {
    canonical: '/about',
  },
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex-1 flex flex-col font-sans">
      <header className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Calculator</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Methodology & Provenance Data
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Details on how cost per outcome is calculated, model data sources, limitations, and how to contribute.
        </p>
      </header>

      <main className="space-y-10 text-slate-300 leading-relaxed text-sm">
        <section className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between backdrop-blur-md">
          <div className="space-y-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Built by AgentNoah BUILD ⚡</span>
            </h3>
            <p className="text-xs text-slate-400">
              This calculator was built end-to-end using AgentNoah&apos;s
              BYOL BUILD pipeline on Google Antigravity (Gemini 3.5 Flash){" "}
              in one evening.{" "}
              <a
                href="https://agentnoah.dev/blog/guided-build-flash35-evidence"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                Read the full case study →
              </a>{" "}
              including the 6 fabrications the review loop caught before
              this site went live.
            </p>
          </div>
          <a
            href="https://agentnoah.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-xl font-bold transition duration-200 shrink-0"
          >
            Visit AgentNoah
          </a>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-400" />
            <span>The Formula: Cheap ≠ Value</span>
          </h2>
          <p>
            Standard vendor tables show pricing in simple &quot;Dollars per Million input/output tokens&quot;. This promotes models that look extremely inexpensive (e.g. Gemini Flash or GPT-4o mini) while hiding the real economic cost of completing tasks in software development workflows.
          </p>
          <p>
            When a model has lower quality, it makes mistakes, leading to failed builds, lint errors, or broken tests. In practice, a developer or orchestrator must retry the call (often multiple times) until a successful outcome is achieved.
          </p>
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl space-y-2 backdrop-blur-md">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Calculation Formula</p>
            <div className="p-3 bg-black/40 rounded font-mono text-emerald-400 text-xs text-center border border-[var(--border)]">
              Outcome Cost = [ (In_Tokens / 1,000,000) × In_Price + (Out_Tokens / 1,000,000) × Out_Price ] × Retry_Rate
            </div>
            <p className="text-xs text-slate-400">
              Where the <strong>Retry Rate</strong> acts as a linear multiplier representing the average attempts needed to pass a verification loop (tests, compile, manual validation).
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <span>Proven Data & Source URLs</span>
          </h2>
          
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden text-xs backdrop-blur-md">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-slate-400 font-bold uppercase border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3">Vendor / Source</th>
                  <th className="px-4 py-3">Provenance Link</th>
                  <th className="px-4 py-3">Last Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/50">
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">Anthropic Claude</td>
                  <td className="px-4 py-3 text-emerald-400 hover:underline">
                    <a href="https://www.anthropic.com/pricing" target="_blank" rel="noopener noreferrer">anthropic.com/pricing</a>
                  </td>
                  <td className="px-4 py-3">2026-05-23</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">OpenAI GPT & o-series</td>
                  <td className="px-4 py-3 text-emerald-400 hover:underline">
                    <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer">openai.com/pricing</a>
                  </td>
                  <td className="px-4 py-3">2026-05-23</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">Google Gemini</td>
                  <td className="px-4 py-3 text-emerald-400 hover:underline">
                    <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer">ai.google.dev/pricing</a>
                  </td>
                  <td className="px-4 py-3">2026-05-23</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">DeepSeek (V4 Pro)</td>
                  <td className="px-4 py-3 text-emerald-400 hover:underline">
                    <a href="https://api-docs.deepseek.com/quick_start/pricing" target="_blank" rel="noopener noreferrer">api-docs.deepseek.com/quick_start/pricing</a>
                  </td>
                  <td className="px-4 py-3">2026-05-25</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">Aider Leaderboard</td>
                  <td className="px-4 py-3 text-emerald-400 hover:underline">
                    <a href="https://aider.chat/docs/leaderboards/" target="_blank" rel="noopener noreferrer">aider.chat/docs/leaderboards</a>
                  </td>
                  <td className="px-4 py-3">2026-05-23</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">AgentNoah Benchmark</td>
                  <td className="px-4 py-3 text-emerald-400 hover:underline">
                    <a
                      href="https://agentnoah.dev/blog/3-model-byol-evidence"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      AgentNoah OWASP K=3 security sweep
                    </a>
                  </td>
                  <td className="px-4 py-3">2026-05-23</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            <span>Limits + Caveats</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>
              <strong>Token estimate provenance:</strong> Cells tagged{" "}
              <code className="text-emerald-400">aider</code> are calibrated to typical
              patterns from the Aider coding leaderboard — they are our best
              estimate of typical input/output token usage per model per task, NOT
              direct per-cell measurements (Aider does not publish per-task token
              counts in this format). Cells tagged{" "}
              <code className="text-purple-400">agentnoah-owasp</code> for the
              security-audit task come from AgentNoah&apos;s K=3 BYOL benchmark. PRs
              welcome at github.com/guevae2/llm-cost-per-outcome/issues to refine
              specific cells with real measurements.
            </li>
            <li>
              <strong>Token estimates vary:</strong> Real usage varies wildly depending on prompt templates, system instructions, few-shot examples, and framework overhead. The estimates are static baseline measurements.
            </li>
            <li>
              <strong>Retry Rate is a proxy:</strong> In actual systems, failed attempts are not always complete retries. They might be smaller recovery steps, although the overall cost contribution trends similarly.
            </li>
            <li>
              <strong>Open source contributed:</strong> Data is contributed and updated by the community. If you notice any outdated or incorrect price cells, please open an Issue.
            </li>
          </ul>

          <div className="pt-4 text-center">
            <a
              href="https://github.com/guevae2/llm-cost-per-outcome/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:underline font-semibold"
            >
              <span>Submit corrections or suggest models on GitHub Issues</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[var(--border)] pt-8 text-center text-xs text-slate-500">
        <span>© 2026 llm-cost-per-outcome. Deployed to Vercel free tier.</span>
      </footer>
    </div>
  );
}
