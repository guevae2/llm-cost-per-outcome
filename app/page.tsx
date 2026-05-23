'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Info, Calculator, Sparkles, ShieldAlert } from 'lucide-react';
import { LLM_MODELS, TASK_CATEGORIES, calculateOutcomeCost } from '../lib/llms';
import CostCharts from '../components/CostCharts';

export default function Home() {
  const [selectedTask, setSelectedTask] = useState('unit-test');
  const [selectedModels, setSelectedModels] = useState<string[]>(Object.keys(LLM_MODELS));
  const [retryRate, setRetryRate] = useState(1.3);

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

      return {
        id,
        name: model.name,
        cost,
        quality: model.qualityScore,
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
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 text-center relative py-6">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-emerald-500/5 to-amber-500/10 blur-3xl -z-10 rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-accentTeal mb-4 shadow-lg shadow-emerald-950/20">
          <Sparkles className="h-3 w-3" />
          <span>Cheap per token ≠ Cheap per outcome</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight leading-tight">
          LLM Cost-Per-Outcome Calculator
        </h1>
        
        <p className="mt-3 text-slate-400 text-sm max-w-2xl mx-auto sm:text-base">
          Stop counting raw millions. Compare the actual financial impact of completes by factoring in pricing, baseline token usage, quality scores, and custom retries.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 px-4 py-2 rounded-xl"
          >
            <Info className="h-4.5 w-4.5" />
            <span>Methodology & Data Sources</span>
          </Link>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-12">
        <section className="xl:col-span-4 bg-[#161C2C]/50 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Calculator className="h-5 w-5 text-accentTeal" />
            <span>Calculator Parameters</span>
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Task Category
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full bg-[#1C2538] text-sm text-slate-200 border border-slate-700/80 focus:border-accentTeal rounded-xl px-4 py-3 outline-none transition duration-200"
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
              <span className="text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded">
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
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accentTeal"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>0.5x (Optimistic)</span>
              <span>1.3x (Default)</span>
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
                className="text-[10px] text-accentTeal hover:underline"
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
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition duration-200 ${
                      isSelected
                        ? "bg-accentTeal/10 text-emerald-400 border-accentTeal/60"
                        : "bg-slate-900/60 text-slate-400 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    {model.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl text-xs text-slate-400 space-y-2 leading-relaxed">
            <div className="flex items-center gap-1 text-slate-300 font-semibold mb-1">
              <ShieldAlert className="h-4 w-4 text-emerald-500" />
              <span>Calculation Formula</span>
            </div>
            <p>
              Base cost is calculated per million tokens. The total outcome cost =
            </p>
            <div className="p-2 bg-black/30 rounded font-mono text-[10px] text-emerald-400 text-center">
              (in_tokens × $/M + out_tokens × $/M) × retry_rate
            </div>
          </div>
        </section>

        <section className="xl:col-span-8 space-y-8">
          <div className="bg-[#161C2C]/50 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Stack-Ranked Outcomes</h3>
              <span className="text-xs text-slate-400 font-medium">Sorted by cost ascending</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
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
                    <th className="px-6 py-3">Source Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {finalResults.map((item, index) => {
                    const isCheapest = index === 0;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-900/20 transition duration-150 ${
                          isCheapest ? "bg-emerald-950/10" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-slate-200">
                          {item.name}
                          {isCheapest && (
                            <span className="ml-2 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded-full font-bold">
                              Cheapest
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          <div>In: {(item.inputTokens).toLocaleString()}</div>
                          <div>Out: {(item.outputTokens).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-amber-500 h-full" style={{ width: `${item.quality}%` }} />
                            </div>
                            <span className="text-slate-300 font-bold">{item.quality}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">
                          ${item.cost.toFixed(4)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            item.source === 'agentnoah-owasp'
                              ? 'bg-purple-950/40 text-purple-400 border-purple-900/40'
                              : item.source === 'aider'
                              ? 'bg-blue-950/40 text-blue-400 border-blue-900/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {item.source}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <CostCharts data={finalResults} selectedModels={selectedModels} sliderValue={retryRate} />
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-900 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <div>
          <span>© 2026 llm-cost-per-outcome. Built autonomously by </span>
          <a href="https://agentnoah.dev" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
            AgentNoah BUILD ⚡
          </a>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">About</Link>
          <a href="https://github.com/guevae2/llm-cost-per-outcome/issues" target="_blank" rel="noopener noreferrer" className="hover:underline">
            GitHub Issues
          </a>
        </div>
      </footer>
    </div>
  );
}