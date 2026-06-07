import React, { useState, useMemo } from 'react';
import { Award, ShieldAlert, Star, Compass, Download, Edit, RefreshCw, X, ChevronRight, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Vendor, generateSeedData } from '../dataStore';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PerformanceProps {
  vendors: Vendor[];
  isDark: boolean;
  onNavigateToDetail: (vendorId: string) => void;
}

export function Performance({
  vendors,
  isDark,
  onNavigateToDetail
}: PerformanceProps) {
  const [period, setPeriod] = useState('2026');

  // Performance Tab state
  const [selectedScorecardVendor, setSelectedScorecardVendor] = useState<Vendor | null>(null);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [perfCategoryFilter, setPerfCategoryFilter] = useState('All');
  const [perfTierFilter, setPerfTierFilter] = useState('All');

  const getPerformanceRatingBadge = (score: number) => {
    if (score >= 85) return { text: 'Green', bg: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200' };
    if (score >= 65) return { text: 'Amber', bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200' };
    return { text: 'Red', bg: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-450 border-red-200' };
  };

  // Quadrant categorization for Scatter Plot (Cost vs Quality Matrix)
  const scatterData = useMemo(() => {
    return vendors.map(v => {
      return {
        id: v.id,
        name: v.name,
        performanceScore: v.performanceScore,
        spend: v.contractValue / 1000, // in thousands
        tier: v.tier,
        contracts: 2
      };
    });
  }, [vendors]);

  // Grouped comparative performance specs (Top 10)
  const groupedPerformanceData = useMemo(() => {
    return vendors
      .slice(0, 10)
      .map(v => ({
        name: v.name.split(' ')[0], // short name
        Quality: v.performanceScore,
        Delivery: Math.min(100, v.performanceScore + 3),
        Pricing: Math.max(50, 110 - v.performanceScore),
        tier: v.tier
      }));
  }, [vendors]);

  // Performance rankings
  const rankedVendors = useMemo(() => {
    return vendors
      .filter(v => {
        if (perfCategoryFilter !== 'All' && v.category !== perfCategoryFilter) return false;
        if (perfTierFilter !== 'All' && v.tier !== perfTierFilter) return false;
        return true;
      })
      .sort((a, b) => b.performanceScore - a.performanceScore);
  }, [vendors, perfCategoryFilter, perfTierFilter]);

  const sparklineD = "M 0 10 L 10 15 L 20 8 L 30 18 L 40 5 L 50 14 L 60 7 L 70 12";

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* SECTION NAVIGATION TOP */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4 mb-6 border-slate-205 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Performance Evaluations</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">KPI Performance Directory</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* KPI METRIC TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Portfolio Performance Average', val: '84.2 / 100', color: 'text-orange-600', trend: '↓ -0.8% From Last Month' },
            { label: 'On-Time Delivery Rate', val: '91.4%', color: 'text-green-600', trend: '↑ +1.2%' },
            { label: 'Average Defect Rate', val: '1.8%', color: 'text-red-500', trend: '↑ -0.2% optimal' },
            { label: 'Invoice Matching Accuracy', val: '97.6%', color: 'text-cyan-600', trend: '↑ +0.4%' },
            { label: 'Average SLA Response Window', val: '5.1 hours', color: 'text-amber-600', trend: 'Stable' }
          ].map((k, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{k.label}</span>
              <p className={`text-28px font-black font-roboto ${k.color} tracking-tight mt-1`}>{k.val}</p>
              <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{k.trend}</div>
            </div>
          ))}
        </div>

        {/* TWO GRAPH COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grouped Bar performance chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 font-roboto tracking-tight">Top Vendors Comparative Breakdown</h3>
            <p className="text-12px text-slate-400 mb-4">SLA compliance mappings across 3 dimensions</p>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupedPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                  <YAxis stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: '#e2e8f0' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Quality" fill="#f97316" name="Quality Score" />
                  <Bar dataKey="Delivery" fill="#10b981" name="Delivery Reliability" />
                  <Bar dataKey="Pricing" fill="#f59e0b" name="Pricing Index" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Scatter plotting */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 font-roboto tracking-tight">Cost vs Quality Matrix</h3>
            <p className="text-12px text-slate-400 mb-4">Strategic quadrant plotting of registered vendors</p>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} />
                  <XAxis type="number" dataKey="spend" name="Spend" unit="K" domain={[0, 1000]} stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                  <YAxis type="number" dataKey="performanceScore" name="Performance" unit="pts" domain={[40, 100]} stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: '#e2e8f0' }} />
                  <Scatter name="Rating" data={scatterData} fill="#f97316" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PERFORMANCE RANKINGS TABLE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 dark:bg-slate-800/40 gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">KPI Rankings & Compliance</h3>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={perfCategoryFilter}
                onChange={e => setPerfCategoryFilter(e.target.value)}
                className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-2 py-1 outline-none text-slate-800 dark:text-white rounded"
              >
                <option value="All">All Categories</option>
                <option value="IT Services">IT Services</option>
                <option value="Logistics">Logistics</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Consulting">Consulting</option>
              </select>

              <select
                value={perfTierFilter}
                onChange={e => setPerfTierFilter(e.target.value)}
                className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-2 py-1 outline-none text-slate-800 dark:text-white rounded"
              >
                <option value="All">All Tiers</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400 w-16">Rank</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Vendor ID</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Company Name</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">KPI Performance</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">8-Week Trend</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400 w-[140px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rankedVendors.slice(0, 10).map((v, rankIdx) => {
                const rating = getPerformanceRatingBadge(v.performanceScore);
                return (
                  <tr key={v.id} className="hover:bg-orange-50/10 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-serif italic text-base font-bold text-slate-900 dark:text-slate-300">
                      {rankIdx === 0 ? '🏆 1' : rankIdx === 1 ? '🥈 2' : rankIdx === 2 ? '🥉 3' : `#${rankIdx + 1}`}
                    </td>
                    <td className="p-3 text-[11px] font-bold font-mono text-orange-600 dark:text-orange-400 cursor-pointer" onClick={() => onNavigateToDetail(v.id)}>
                      {v.id}
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{v.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase rounded ${rating.bg}`}>
                        {v.performanceScore}/100 Rating
                      </span>
                    </td>
                    <td className="p-3 align-middle">
                      <svg className="w-[100px] h-[20px]" viewBox="0 0 70 20">
                        <path
                          d={sparklineD}
                          fill="none"
                          stroke={v.performanceScore >= 85 ? '#10b981' : '#f59e0b'}
                          strokeWidth="1.5"
                        />
                      </svg>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedScorecardVendor(v);
                          setIsPerformanceModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-[10px] font-black uppercase bg-orange-600 hover:bg-orange-700 text-white rounded cursor-pointer"
                      >
                        Scorecard
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: PERFORMANCE SCORECARD DETAILED COMPARATIVE REVIEW */}
      {isPerformanceModalOpen && selectedScorecardVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">Scorecard Metrics: {selectedScorecardVendor.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">SLA Evaluations Period: {period}</p>
              </div>
              <button onClick={() => setIsPerformanceModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* RADAR CHART */}
                <div className="w-[220px] h-[220px] mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                      { subject: 'Quality', score: selectedScorecardVendor.performanceScore },
                      { subject: 'Delivery', score: Math.min(100, selectedScorecardVendor.performanceScore + 3) },
                      { subject: 'Pricing', score: Math.max(50, 110 - selectedScorecardVendor.performanceScore) },
                      { subject: 'Responsiveness', score: Math.min(100, selectedScorecardVendor.performanceScore - 4) },
                      { subject: 'Compliance', score: Math.max(40, 100 - selectedScorecardVendor.riskScore) },
                      { subject: 'Innovation', score: Math.min(100, selectedScorecardVendor.performanceScore + 2) }
                    ]}>
                      <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar
                        name={selectedScorecardVendor.name}
                        dataKey="score"
                        stroke="#ea580c"
                        fill="#ea580c"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* SLAS STATS TABLE */}
                <div className="space-y-3">
                  {[
                    { label: 'Quality Acceptance Metric', val: selectedScorecardVendor.performanceScore, weight: '30%' },
                    { label: 'On-Time Logistics SLA', val: Math.min(100, selectedScorecardVendor.performanceScore + 3), weight: '25%' },
                    { label: 'Price Variance Benchmark', val: Math.max(50, 110 - selectedScorecardVendor.performanceScore), weight: '20%' },
                    { label: 'Support Window SLA', val: Math.min(100, selectedScorecardVendor.performanceScore - 4), weight: '15%' },
                    { label: 'Contract Integrity Score', val: Math.max(40, 100 - selectedScorecardVendor.riskScore), weight: '10%' }
                  ].map((m, mI) => (
                    <div key={mI}>
                      <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                        <span>{m.label} ({m.weight})</span>
                        <span className="font-mono">{m.val}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-orange-600 h-2" style={{ width: `${m.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-805 border border-slate-150 dark:border-slate-800 rounded-lg space-y-2">
                <h4 className="text-12px font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Strategic Performance Statement</h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Vendor {selectedScorecardVendor.name} displays a performance rating of {selectedScorecardVendor.performanceScore}/100. Operational parameters reveal {selectedScorecardVendor.performanceScore >= 85 ? 'an excellent' : 'a balanced'} compliance layout, with strong delivery scores relative to the segment industry benchmarks.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-205 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/20">
              <button
                onClick={() => setIsPerformanceModalOpen(false)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsPerformanceModalOpen(false);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-[10px] uppercase"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
