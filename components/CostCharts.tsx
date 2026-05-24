'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
  Legend,
  TooltipProps
} from 'recharts';
import { LLM_MODELS } from '../lib/llms';

interface ChartDataPoint {
  id: string;
  name: string;
  cost: number;
  quality: number;
  retryRate: number;
  inputCost: number;
  outputCost: number;
}

interface CostChartsProps {
  data: ChartDataPoint[];
  selectedModels: string[];
  sliderValue: number;
}

export default function CostCharts({ data, selectedModels, sliderValue }: CostChartsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [comparisonPair, setComparisonPair] = useState<string[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (selectedModels.length >= 2) {
      setComparisonPair([selectedModels[0], selectedModels[1]]);
    } else {
      setComparisonPair(selectedModels);
    }

    // Detect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [selectedModels]);

  if (!isMounted) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
        Loading interactive visualizations...
      </div>
    );
  }

  const sortedByCost = [...data].sort((a, b) => a.cost - b.cost);

  const sensitivityRates = [0.5, 1.0, 1.3, 2.0, 2.5, 3.0];
  const sensitivityData = sensitivityRates.map((rate) => {
    const point: Record<string, any> = { rate: `${rate}x` };
    data.forEach((d) => {
      const baseCost = d.retryRate > 0 ? d.cost / d.retryRate : 0;
      point[d.name] = Number((baseCost * rate).toFixed(4));
    });
    return point;
  });

  const comparisonData = data.filter((d) => comparisonPair.includes(d.id));

  const CustomBarTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-[var(--surface-light)] border border-[var(--border-light)] backdrop-blur-md p-3 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-white mb-1">{dataPoint.name}</p>
          <p className="text-emerald-400 font-medium">Outcome Cost: ${dataPoint.cost.toFixed(4)}</p>
          <p className="text-slate-400">Quality score: {dataPoint.quality}%</p>
          <p className="text-slate-400">Retry multiplier: {dataPoint.retryRate}x</p>
        </div>
      );
    }
    return null;
  };

  const CustomScatterTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-[var(--surface-light)] border border-[var(--border-light)] backdrop-blur-md p-3 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-white mb-1">{dataPoint.name}</p>
          <p className="text-emerald-400 font-medium">Outcome Cost: ${dataPoint.cost.toFixed(4)}</p>
          <p className="text-amber-400">Quality score: {dataPoint.quality}%</p>
          <p className="text-slate-400">Retry rate: {dataPoint.retryRate}x</p>
        </div>
      );
    }
    return null;
  };

  const CustomStackTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-[var(--surface-light)] border border-[var(--border-light)] backdrop-blur-md p-3 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-white mb-1">{dataPoint.name}</p>
          <p className="text-violet-300 font-medium">Input Base Cost: ${dataPoint.inputCost.toFixed(4)}</p>
          <p className="text-emerald-400 font-medium">Output Base Cost: ${dataPoint.outputCost.toFixed(4)}</p>
          <p className="text-slate-300 font-bold border-t border-[var(--border)]/30 mt-1.5 pt-1.5 flex justify-between">
            <span>Total Base Cost:</span>
            <span>${(dataPoint.inputCost + dataPoint.outputCost).toFixed(4)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface-light)] border border-[var(--border-light)] backdrop-blur-md p-3 rounded-lg shadow-xl text-xs min-w-[200px]">
          <p className="font-semibold text-white mb-1.5 border-b border-[var(--border)]/30 pb-1.5">
            Retry Multiplier: {label}
          </p>
          <div className="space-y-1.5">
            {payload.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center gap-4">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono text-white font-medium">${Number(item.value).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12">
      {/* Chapter 02 / The Real Cost (outcome cost horizontal bar chart) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md w-full shadow-lg">
        <div className="space-y-1 mb-6 border-b border-[var(--border)]/40 pb-3">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">02 / The Real Cost</span>
          <h3 className="text-lg font-bold text-white">Cost Per Successful Outcome</h3>
          <p className="text-xs text-slate-400">Real financial cost including retry multiplier. Lower is better.</p>
        </div>
        
        <div className="h-[320px] relative w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedByCost} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `$${v.toFixed(3)}`} />
              <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} width={100} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
              <Bar
                dataKey="cost"
                fill="#8b5cf6"
                radius={[0, 4, 4, 0]}
                barSize={14}
                isAnimationActive={!reduceMotion}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="sr-only">
          <h4>Cost Per Successful Outcome Table Fallback</h4>
          <table>
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Cost per Outcome</th>
                <th>Quality Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedByCost.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.cost.toFixed(4)}</td>
                  <td>{item.quality}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)]/30 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-violet-400 font-semibold uppercase tracking-wider text-[10px]">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Understanding Outcome Cost (⬇️ Lower is better)
          </div>
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-slate-200">The Core Idea:</strong> Raw token prices lie. This chart measures the <strong className="text-slate-200">True Price</strong> you actually pay to get one correct answer. If a cheap model makes frequent mistakes and has to retry, its True Price spikes.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-slate-500 text-[11px] pt-1">
            <span><strong className="text-slate-400">Formula:</strong> <code className="text-violet-300 font-mono">(Base Cost to Run) × Retry Multiplier = True Outcome Cost</code></span>
            <span><strong className="text-slate-400">Mistake Penalty (Retry Rate):</strong> Think of this as an accuracy tax. A model that costs $0.01 per run but fails half the time requires 2.0x runs ($0.02) to succeed.</span>
          </div>
        </div>
      </div>

      {/* Chapter 03 / The Landscape (value curve cost vs quality scatter chart) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md w-full shadow-lg">
        <div className="space-y-1 mb-6 border-b border-[var(--border)]/40 pb-3">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">03 / The Landscape</span>
          <h3 className="text-lg font-bold text-white">Value Curve: Cost vs. Quality</h3>
          <p className="text-xs text-slate-400">X = Quality Score, Y = Cost. Bubble size = Retry Rate. Aim for bottom-right.</p>
        </div>
        
        <div className="h-[320px] relative w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis type="number" dataKey="quality" name="Quality Score" unit="%" stroke="#64748B" fontSize={10} domain={[70, 100]} />
              <YAxis type="number" dataKey="cost" name="Outcome Cost" stroke="#64748B" fontSize={10} tickFormatter={(v) => `$${v.toFixed(3)}`} />
              <ZAxis type="number" dataKey="retryRate" range={[50, 400]} />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter
                name="Models"
                data={data}
                fill="#8b5cf6"
                isAnimationActive={!reduceMotion}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="sr-only">
          <h4>Value Curve Table Fallback</h4>
          <table>
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Quality Score</th>
                <th>Cost per Outcome</th>
                <th>Retry Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quality}%</td>
                  <td>${item.cost.toFixed(4)}</td>
                  <td>{item.retryRate}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)]/30 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-violet-400 font-semibold uppercase tracking-wider text-[10px]">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Finding the Sweet Spot (🎯 Bottom-Right is best)
          </div>
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-slate-200">How to read:</strong> We want high accuracy (<strong className="text-slate-200">⬆️ Higher is better</strong> on X-axis) and low cost (<strong className="text-slate-200">⬇️ Lower is better</strong> on Y-axis). The bubble size shows how often the model makes mistakes (larger bubbles = more retries needed).
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-slate-500 text-[11px] pt-1">
            <span><strong className="text-slate-400">Target Zone:</strong> The **Bottom-Right** represents high-accuracy models that don't drain your wallet.</span>
            <span><strong className="text-slate-400">Cost Traps:</strong> Large bubbles far to the left represent models that look cheap but fail too often to be economical.</span>
          </div>
        </div>
      </div>

      {/* Explanatory Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chapter 04a / Sensitivity Drift */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="space-y-1 mb-6 border-b border-[var(--border)]/40 pb-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">04a / Sensitivity Drift</span>
            <h3 className="text-lg font-bold text-white">Retry Rate Sensitivity Analysis</h3>
            <p className="text-xs text-slate-400">X-axis: Retry Rate Multiplier. Y-axis: $/outcome. Shows cost drift behavior.</p>
          </div>
          
          <div className="h-[320px] relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                <XAxis dataKey="rate" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <Tooltip
                  content={<CustomLineTooltip />}
                  cursor={{ stroke: 'rgba(139, 92, 246, 0.25)', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                />
                <Legend wrapperStyle={{ fontSize: 9, marginTop: 10 }} />
                {data.slice(0, 5).map((d, index) => {
                  const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];
                  return (
                    <Line
                      key={d.id}
                      type="monotone"
                      dataKey={d.name}
                      stroke={colors[index % colors.length]}
                      activeDot={{ r: 4 }}
                      strokeWidth={2}
                      isAnimationActive={!reduceMotion}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="sr-only">
            <h4>Retry Rate Sensitivity Table Fallback</h4>
            <table>
              <thead>
                <tr>
                  <th>Retry Rate</th>
                  {data.slice(0, 5).map((d) => (
                    <th key={d.id}>{d.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sensitivityRates.map((rate) => (
                  <tr key={rate}>
                    <td>{rate}x</td>
                    {data.slice(0, 5).map((d) => {
                      const baseCost = d.retryRate > 0 ? d.cost / d.retryRate : 0;
                      return <td key={d.id}>${(baseCost * rate).toFixed(4)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)]/30 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cost Stability under Pressure (⬇️ Flatter is better)
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-slate-200">What is measured:</strong> How fast your bills scale as task difficulty increases. As tasks get harder, AI models make more mistakes (higher Retry Multiplier on X-axis).
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed pt-0.5">
              <strong className="text-slate-400">The Trend:</strong> Steeper lines indicate models that break the bank when tasks get complex. Flat lines indicate smart, resilient models that keep your costs stable and predictable.
            </p>
          </div>
        </div>

        {/* Chapter 04b / Token Distribution */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="space-y-4 mb-4 border-b border-[var(--border)]/40 pb-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">04b / Token Distribution</span>
              <h3 className="text-lg font-bold text-white">Cost Stack-up: Input vs Output</h3>
              <p className="text-xs text-slate-400">Comparing base cost allocation by input and output tokens.</p>
            </div>
            
            {/* Dedicated Comparison Filters Row */}
            {selectedModels.length >= 2 && (
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Compare:</span>
                <select
                  value={comparisonPair[0] || ""}
                  onChange={(e) => setComparisonPair([e.target.value, comparisonPair[1] || ""])}
                  className="bg-[var(--surface-light)] text-xs text-slate-200 border border-[var(--border-light)] px-3 py-1.5 rounded-xl outline-none focus:border-violet-500 transition duration-200"
                >
                  {selectedModels.map((m) => (
                    <option key={m} value={m}>{LLM_MODELS[m]?.name || m}</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">vs</span>
                <select
                  value={comparisonPair[1] || ""}
                  onChange={(e) => setComparisonPair([comparisonPair[0] || "", e.target.value])}
                  className="bg-[var(--surface-light)] text-xs text-slate-200 border border-[var(--border-light)] px-3 py-1.5 rounded-xl outline-none focus:border-violet-500 transition duration-200"
                >
                  {selectedModels.map((m) => (
                    <option key={m} value={m}>{LLM_MODELS[m]?.name || m}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="h-[320px] relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <Tooltip content={<CustomStackTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar
                  dataKey="inputCost"
                  name="Input Base Cost"
                  stackId="a"
                  fill="#8b5cf6"
                  isAnimationActive={!reduceMotion}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="outputCost"
                  name="Output Base Cost"
                  stackId="a"
                  fill="#10b981"
                  isAnimationActive={!reduceMotion}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="sr-only">
            <h4>Cost Stack-up Table Fallback</h4>
            <table>
              <thead>
                <tr>
                  <th>Model Name</th>
                  <th>Input Base Cost</th>
                  <th>Output Base Cost</th>
                  <th>Total Base Cost</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>${item.inputCost.toFixed(4)}</td>
                    <td>${item.outputCost.toFixed(4)}</td>
                    <td>${(item.inputCost + item.outputCost).toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)]/30 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reading vs. Writing Costs
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-slate-200">What is measured:</strong> A single run's baseline cost split between "Reading" (Input tokens) and "Writing" (Output tokens).
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed pt-0.5">
              <strong className="text-slate-400">Optimization:</strong> If a model's cost is dominated by Output (green), we can save massive amounts of money by instructing the AI to keep its answers short and concise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
