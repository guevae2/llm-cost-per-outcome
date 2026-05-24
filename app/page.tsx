'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Info, Calculator, Sparkles, ShieldAlert } from 'lucide-react';
import { LLM_MODELS, TASK_CATEGORIES, calculateOutcomeCost, getModelQuality } from '../lib/llms';
import CostCharts from '../components/CostCharts';

export default function Home() {
  const [selectedTask, setSelectedTask] = useState('unit-test');
  const [selectedModels, setSelectedModels] = useState<string[]>(Object.keys(LLM_MODELS));
  const [retryRate, setRetryRate] = useState(1.1);

  // Sorting state for table
  const [sortField, setSortField] = useState<'name' | 'cost' | 'quality'>('cost');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const activeCategory = TASK_CATEGORIES[selectedTask];

  const calculatedResults = useMemo(() => {
    return Object.entries(LLM_MODELS).map(([id, model]) => {
      const estimate = activeCategory?.tokenEstimates[id] || { inputTokens: 0, outputTokens: 0, source: 'user-input' };
      const cost = calculateOutcomeCost(id, selectedTask, retryRate);
      
      const baseInCost = ((estimate?.inputTokens || 0) / 1000000) * model.inputCostPerM;
      const baseOutCost = ((estimate?.outputTokens || 0) / 1000000) * model.outputCostPerM;

      const { qualityScore, qualityScoreSource } = getModelQuality(id, selectedTask);

      return {
        id,
        name: model.name,
        cost,
        quality: qualityScore,
        qualitySource: qualityScoreSource,
        retryRate,
        inputCost: baseInCost,
        outputCost: baseOutCost,
        inputTokens: estimate?.inputTokens || 0,
        outputTokens: estimate?.outputTokens || 0,
        source: estimate?.source || 'user-input'
      };
    });
  }, [selectedTask, retryRate]);

  const finalResults = useMemo(() => {
    const filtered = calculatedResults.filter(r => selectedModels.includes(r.id));
    return filtered.sort((a, b) => {
      let multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return a.name.localeCompare(b.name) * multiplier;
      }
      return (a[sortField] - b[sortField]) * multiplier;
    });
  }, [calculatedResults, selectedModels, sortField, sortOrder]);

  // Dynamic Narrative Insight logic
  const narrativeInsight = useMemo(() => {
    if (finalResults.length === 0) {
      return "Please select at least one LLM model to calculate comparison metrics.";
    }

    const cheapest = finalResults[0];
    const mostExpensive = finalResults[finalResults.length - 1];

    // Find a premium tier model in the list for a striking narrative anchor
    const hasOpus = finalResults.find(r => r.id === 'claude-opus-4-7');
    const hasSonnet = finalResults.find(r => r.id === 'claude-sonnet-4-6');
    const premiumModel = hasOpus || hasSonnet || mostExpensive;

    const premiumRatio = cheapest.cost > 0 ? (premiumModel.cost / cheapest.cost).toFixed(0) : '0';

    return (
      <span>
        For <strong>{activeCategory?.name}</strong>, <strong>{cheapest.name}</strong> is currently the most cost-effective option, completing the outcome for <strong>${cheapest.cost.toFixed(4)}</strong>. In comparison, the high-capacity <strong>{premiumModel.name}</strong> costs <strong>${premiumModel.cost.toFixed(4)}</strong> per success—making it <strong>{premiumRatio}x more expensive</strong> for this specific workload. Adjusting the task dropdown or the retry rate slider on the left will instantly re-calculate these economic tipping points in real-time.
      </span>
    );
  }, [finalResults, activeCategory]);

  const toggleModel = (id: string) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== id));
      }
    } else {
      setSelectedModels([...selectedModels, id]);
    }
  };

  const handleSort = (field: 'name' | 'cost' | 'quality') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative overflow-x-hidden">
      {/* Decorative ambient backgrounds */}
      <div className="fixed inset-0 ambient-bg -z-20 pointer-events-none" aria-hidden="true" />
      
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none" aria-hidden="true">
        {/* Violet mesh sphere top-left */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] opacity-40 blur-3xl transform rotate-12 transition-transform duration-1000">
          <Image
            src="/mesh-sphere-1.png"
            alt=""
            fill
            sizes="600px"
            priority={false}
            loading="lazy"
            className="object-contain"
          />
        </div>
        
        {/* Emerald mesh sphere bottom-right */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] opacity-40 blur-3xl transition-transform duration-1000">
          <Image
            src="/mesh-sphere-2.png"
            alt=""
            fill
            sizes="600px"
            priority={false}
            loading="lazy"
            className="object-contain"
          />
        </div>
      </div>

      <header className="mb-10 text-center relative py-6">
        <div className="flex justify-center items-center gap-3 mb-4">
          <a
            href="https://agentnoah.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-light)] border border-[var(--border-light)] text-xs font-semibold text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition duration-200 shadow-lg shadow-black/20 group"
          >
            <Image
              src="/agentnoah-icon.png"
              alt="AgentNoah Icon"
              width={16}
              height={16}
              className="object-contain shrink-0"
            />
            <Sparkles className="h-3 w-3 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
            <span>Cheap per token ≠ Cheap per outcome</span>
          </a>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient tracking-tight leading-tight">
          LLM Cost-Per-Outcome Calculator
        </h1>
        
        <p className="mt-3 text-slate-400 text-sm max-w-2xl mx-auto sm:text-base leading-relaxed">
          Most AI cost calculators show $X per million tokens. This one shows what you actually pay to finish a real developer task — like writing a unit test or auditing code — across 10 popular LLMs. The cost gaps will surprise you.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 bg-[var(--surface-light)] border border-[var(--border-light)] hover:border-violet-500/50 px-4 py-2 rounded-xl"
          >
            <Info className="h-4 w-4" />
            <span>Methodology & Data Sources</span>
          </Link>
        </div>
      </header>

      {/* Dynamic Narrative Insight Box */}
      <div className="mb-8 glass-strong rounded-2xl p-5 shadow-xl border border-emerald-500/20 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="flex gap-4 items-start relative z-10">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl shrink-0">
            <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick example:</h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans mt-0.5">{narrativeInsight}</p>
          </div>
        </div>
      </div>

      <main className="space-y-12 mb-12 relative z-10">
        {/* Top Split Section: Control Panel + Chapter 02 Outcome Cost */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Parameter Card */}
          <section className="xl:col-span-4 xl:sticky xl:top-8 glass-strong p-6 rounded-2xl shadow-xl space-y-6 self-start">
          <div className="space-y-1 pb-3 border-b border-[var(--border)]">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">01 / Control Panel</span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-violet-400" />
              <span>Calculator Parameters</span>
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Task Category
            </label>
            <select
              value={selectedTask}
              onChange={(e) => {
                const newTaskId = e.target.value;
                setSelectedTask(newTaskId);
                const cat = TASK_CATEGORIES[newTaskId];
                if (cat) {
                  setRetryRate(cat.defaultRetryRate);
                }
              }}
              className="w-full bg-[var(--surface-light)] text-sm text-slate-200 border border-[var(--border-light)] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 outline-none transition duration-200"
            >
              {Object.entries(TASK_CATEGORIES).map(([id, cat]) => (
                <option key={id} value={id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Retry Rate Multiplier
              </label>
              <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                {retryRate.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={retryRate}
              onChange={(e) => setRetryRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>0.5x (Optimistic)</span>
              <span>{activeCategory?.defaultRetryRate.toFixed(1)}x (Task Default)</span>
              <span>3.0x (Pessimistic)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Compare Models
              </label>
              <button
                onClick={() => setSelectedModels(Object.keys(LLM_MODELS))}
                className="text-[10px] text-violet-400 hover:underline"
              >
                Reset All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(LLM_MODELS).map(([id, model]) => {
                const isSelected = selectedModels.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleModel(id)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition duration-200 hover:scale-105 ${
                      isSelected
                        ? "bg-violet-500/10 text-violet-300 border-violet-500/50 ring-1 ring-violet-500/40"
                        : "bg-slate-900/60 text-slate-400 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    {model.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl text-xs text-slate-300 space-y-2 leading-relaxed">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              <span>Calculation Formula</span>
            </div>
            <p>
              Base cost is calculated per million tokens. The total outcome cost =
            </p>
            <div className="p-2 bg-emerald-950/30 rounded font-mono text-[10px] text-emerald-400 text-center border border-emerald-500/20">
              (in_tokens × $/M + out_tokens × $/M) × retry_rate
            </div>
          </div>
        </section>

        {/* Chapter 02 Outcome Cost Chart (Maximized within its 8-column split) */}
        <section className="xl:col-span-8">
          <CostCharts data={finalResults} selectedModels={selectedModels} sliderValue={retryRate} view="chapter2" />
        </section>
      </div>

      {/* Bottom Full-Width Section: Chapters 03, 04, and 05 */}
      <div className="w-full space-y-12 mt-12">
        {/* Chapters 03 and 04 */}
        <CostCharts data={finalResults} selectedModels={selectedModels} sliderValue={retryRate} view="remaining" />

          {/* Chapter 05 / Ground Evidence */}
          <div className="glass-strong rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
            <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-black/10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">05 / Ground Evidence</span>
                <h3 className="text-lg font-bold text-white">Stack-Ranked Outcomes</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Sorted by cost ascending</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/20 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-[var(--border)]">
                  <tr>
                    <th onClick={() => handleSort('name')} className="px-6 py-3 cursor-pointer hover:text-white transition">
                      LLM Model {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-6 py-3">Estimated Tokens</th>
                    <th onClick={() => handleSort('quality')} className="px-6 py-3 cursor-pointer hover:text-white transition">
                      Quality Score {sortField === 'quality' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('cost')} className="px-6 py-3 cursor-pointer hover:text-white transition">
                      Outcome Cost {sortField === 'cost' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="px-6 py-3">Token Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/40">
                  {finalResults.map((item, index) => {
                    const isCheapest = index === 0;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-violet-500/5 transition-colors duration-150 ${
                          isCheapest ? "bg-emerald-500/10" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-slate-200">
                          {item.name}
                          {isCheapest && (
                            <span className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                              Cheapest
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          <div>In: {(item.inputTokens).toLocaleString()}</div>
                          <div>Out: {(item.outputTokens).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-violet-500 h-full" style={{ width: `${item.quality}%` }} />
                              </div>
                              <span className="text-slate-300 font-bold">{item.quality}%</span>
                            </div>
                            {item.qualitySource && (
                              <a
                                href={item.qualitySource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-emerald-400 hover:underline hover:text-emerald-300 transition duration-150 truncate max-w-[120px]"
                                title={item.qualitySource}
                              >
                                {item.qualitySource.includes('agentnoah.dev')
                                  ? 'AgentNoah OWASP'
                                  : item.qualitySource.includes('lmsys')
                                  ? 'LMSys Arena'
                                  : 'Aider Leaderboard'}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">
                          ${item.cost.toFixed(4)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border ${
                            item.source === 'agentnoah-owasp'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                              : item.source === 'aider'
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              : 'bg-slate-850 text-slate-400 border-slate-700'
                          }`}>
                            {item.source === 'agentnoah-owasp'
                              ? 'OWASP Workload'
                              : item.source === 'aider'
                              ? 'Aider Workload'
                              : item.source === 'swe-bench'
                              ? 'SWE-Bench'
                              : 'User Workload'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border)]/30 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-violet-400 font-semibold uppercase tracking-wider text-[10px]">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                The Ground Truth Registry (⬇️ Sorted by True Cost)
              </div>
              <p className="text-slate-400 leading-relaxed">
                <strong className="text-slate-200">What is measured:</strong> The raw underlying calculations proving the final costs. It maps the workload token counts, verified accuracy (Quality Score), and the calculated True Cost.
              </p>
              <p className="text-slate-500 text-[11px] leading-relaxed pt-0.5">
                <strong className="text-slate-400">Verifiability & Dual Sourcing:</strong> (1) <strong className="text-slate-300">Quality Source:</strong> Click any highlighted link under Quality Score to audit the accuracy evaluation (e.g. LMSys battles or AgentNoah OWASP audits). (2) <strong className="text-slate-300">Token Source:</strong> The rightmost badge identifies the benchmark workload used to audit raw input/output token counts.
              </p>
            </div>
          </div>
        </div>
      </main>

      <section className="my-12 glass-strong rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 ambient-bg opacity-50 -z-10" aria-hidden="true" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gradient mb-4">
          Want this methodology on your own audits?
        </h2>
        <p className="text-slate-300 mb-2 max-w-2xl mx-auto leading-relaxed">
          AgentNoah BUILD uses the same 16-phase pipeline + cross-audit memory + provenance discipline shown in this calculator — except on YOUR repo, not someone else&apos;s pricing data.
        </p>
        <p className="text-slate-400 text-sm mb-6 max-w-2xl mx-auto">
          Free 14-day trial · No credit card · Bring your own IDE LLM (Claude Code, Cursor, Gemini CLI, Antigravity)
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="https://agentnoah.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition duration-200 shadow-lg shadow-violet-500/20">
            Start free trial →
          </a>
          <a href="https://agentnoah.dev/blog/guided-build-flash35-evidence" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-light)] hover:border-violet-500/50 text-slate-300 hover:text-white rounded-xl font-semibold transition duration-200">
            Read how this was built →
          </a>
        </div>
      </section>

      <footer className="mt-auto border-t border-[var(--border)] pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <div>
          <span>© 2026 llm-cost-per-outcome. Built by </span>
          <a
            href="https://agentnoah.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium transition"
          >
            AgentNoah BUILD ⚡
          </a>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline hover:text-slate-300 transition">About</Link>
          <a
            href="https://github.com/guevae2/llm-cost-per-outcome"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-slate-300 transition"
          >
            GitHub
          </a>
          <a
            href="https://agentnoah.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-slate-300 transition"
          >
            AgentNoah
          </a>
        </div>
      </footer>
    </div>
  );
}
