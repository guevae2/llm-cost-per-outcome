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

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-1">Cost Per Successful Outcome</h3>
          <p className="text-xs text-slate-400 mb-6">Real financial cost including retry multiplier. Lower is better.</p>
          
          <div className="h-[320px] relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedByCost} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} width={100} />
                <Tooltip content={<CustomBarTooltip />} />
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
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-1">Value Curve: Cost vs. Quality</h3>
          <p className="text-xs text-slate-400 mb-6">X = Quality Score, Y = Cost. Bubble size = Retry Rate. Aim for bottom-right.</p>
          
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-1">Retry Rate Sensitivity Analysis</h3>
          <p className="text-xs text-slate-400 mb-6">X-axis: Retry Rate Multiplier. Y-axis: $/outcome. Shows cost drift behavior.</p>
          
          <div className="h-[320px] relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                <XAxis dataKey="rate" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                <Tooltip />
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
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Cost Stack-up: Input vs Output</h3>
              <p className="text-xs text-slate-400">Comparing base cost allocation by input and output tokens.</p>
            </div>
            {selectedModels.length >= 2 && (
              <div className="mt-2 sm:mt-0 flex gap-2">
                <select
                  value={comparisonPair[0] || ""}
                  onChange={(e) => setComparisonPair([e.target.value, comparisonPair[1] || ""])}
                  className="bg-[#1C2538] text-xs text-white border border-slate-700 px-2 py-1 rounded"
                >
                  {selectedModels.map((m) => (
                    <option key={m} value={m}>{LLM_MODELS[m]?.name || m}</option>
                  ))}
                </select>
                <select
                  value={comparisonPair[1] || ""}
                  onChange={(e) => setComparisonPair([comparisonPair[0] || "", e.target.value])}
                  className="bg-[#1C2538] text-xs text-white border border-slate-700 px-2 py-1 rounded"
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
                <Tooltip />
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
        </div>
      </div>
    </div>
  );
}
