import React, { useState, useMemo } from 'react';
import { Leaf, Award, ShieldAlert, Star, Compass, Download, Edit, RefreshCw, X, ChevronRight, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Vendor, ESGScorecard, generateSeedData } from '../dataStore';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PerformanceProps {
  vendors: Vendor[];
  scorecards: ESGScorecard[];
  isDark: boolean;
  onUpdateScorecard: (sc: ESGScorecard) => void;
  onNavigateToDetail: (vendorId: string) => void;
}

export function Performance({
  vendors,
  scorecards,
  isDark,
  onUpdateScorecard,
  onNavigateToDetail
}: PerformanceProps) {
  const [subTab, setSubTab] = useState<'esg' | 'scorecards'>('esg');
  const [selectedEsgId, setSelectedEsgId] = useState<string | null>(null);
  const [isEsgAssessorOpen, setIsEsgAssessorOpen] = useState(false);
  const [period, setPeriod] = useState('2026');

  // Performance Tab state
  const [selectedScorecardVendor, setSelectedScorecardVendor] = useState<Vendor | null>(null);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [perfCategoryFilter, setPerfCategoryFilter] = useState('All');
  const [perfTierFilter, setPerfTierFilter] = useState('All');

  // Form Assessment ESG elements
  const [eReporting, setEReporting] = useState(true);
  const [eScope1, setEScope1] = useState(450);
  const [eRenewable, setERenewable] = useState(45);
  const [sLivingWage, setSLivingWage] = useState(true);
  const [sWomenInLeadership, setSWomenInLeadership] = useState(35);
  const [gBoardIndependence, setGBoardIndependence] = useState(65);
  const [gGdpr, setGGdpr] = useState(true);
  const [gEthics, setGEthics] = useState(true);
  const [esgNotes, setEsgNotes] = useState('');

  // Semicircle gauge details
  const avgEsgScore = 72.4;
  
  // Calculate polar coordinates for Gauge needle
  const needleAngle = 180 - (avgEsgScore / 100) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleX = 100 + 70 * Math.cos(needleRad);
  const needleY = 100 - 70 * Math.sin(needleRad);

  const esgTiers = [
    { title: 'Platinum', bg: 'bg-indigo-100 dark:bg-indigo-950/40 border-indigo-200 text-indigo-700 dark:text-indigo-400', min: 90 },
    { title: 'Gold', bg: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-250 text-yellow-800 dark:text-yellow-400', min: 75 },
    { title: 'Silver', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-700 dark:text-slate-350', min: 60 },
    { title: 'Bronze', bg: 'bg-amber-100 dark:bg-amber-950/40 border-amber-250 text-amber-800 dark:text-amber-400', min: 45 },
    { title: 'Needs Improvement', bg: 'bg-red-100 dark:bg-red-950/40 border-red-200 text-red-700 dark:text-red-400', min: 0 }
  ];

  const getEsgTierBadge = (score: number) => {
    const tier = esgTiers.find(x => score >= x.min);
    return tier ? tier : esgTiers[4];
  };

  const getPerformanceRatingBadge = (score: number) => {
    if (score >= 85) return { text: 'Green', bg: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200' };
    if (score >= 65) return { text: 'Amber', bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200' };
    return { text: 'Red', bg: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-450 border-red-200' };
  };

  // Quadrant categorization for Scatter Plot
  const scatterData = useMemo(() => {
    return scorecards.map(sc => {
      const v = vendors.find(x => x.id === sc.vendorId);
      return {
        id: sc.vendorId,
        name: sc.vendorName,
        esgScore: sc.overallScore,
        spend: v ? v.contractValue / 1000 : 250, // in thousands
        tier: sc.tier,
        contracts: v ? 2 : 1
      };
    });
  }, [scorecards, vendors]);

  // CSS Heatmap categories
  const categoriesList = ['IT Services', 'Logistics', 'Manufacturing', 'Consulting', 'Raw Materials', 'Facilities', 'Legal'];
  const esgDimensions = [
    { label: 'Carbon Footprint', group: 'E', weight: 45 },
    { label: 'Energy Management', group: 'E', weight: 25 },
    { label: 'Whistleblower Protocol', group: 'G', weight: 30 },
    { label: 'Data Privacy Standards', group: 'G', weight: 35 },
    { label: 'Labor Protections', group: 'S', weight: 40 },
    { label: 'Senior Diversity %', group: 'S', weight: 60 }
  ];

  const getHeatmapColor = (val: number) => {
    if (val >= 90) return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
    if (val >= 75) return 'bg-[#BBF7D0] text-[#166534] border-[#86EFAC]';
    if (val >= 60) return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    if (val >= 45) return 'bg-[#FECACA] text-[#991B1B] border-[#FCA5A5]';
    return 'bg-[#FCA5A5] text-[#7F1D1D] border-[#FECACA]';
  };

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

  const handleOpenAssessForm = (sc: ESGScorecard) => {
    setSelectedEsgId(sc.vendorId);
    setEReporting(sc.environmental.carbonEmissionsReporting);
    setEScope1(sc.environmental.scope1);
    setERenewable(sc.environmental.renewableEnergyPercent);
    setSLivingWage(sc.social.livingWage);
    setSWomenInLeadership(sc.social.womenInLeadership);
    setGBoardIndependence(sc.governance.boardIndependencePercent);
    setGGdpr(sc.governance.gdprCompliant);
    setGEthics(sc.governance.codeOfEthics);
    setEsgNotes(sc.notes || '');
    setIsEsgAssessorOpen(true);
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEsgId) return;

    const oldSc = scorecards.find(x => x.vendorId === selectedEsgId);
    if (!oldSc) return;

    // Recalculate scores
    const calcE = (eReporting ? 40 : 10) + (eRenewable * 0.6);
    const calcS = (sLivingWage ? 40 : 10) + (sWomenInLeadership * 0.6);
    const calcG = (gEthics ? 30 : 0) + (gGdpr ? 30 : 0) + (gBoardIndependence * 0.4);
    
    const rawOverall = (calcE * 0.35 + calcS * 0.35 + calcG * 0.30);
    const nextOverall = Math.round(Math.min(100, rawOverall));
    const nextTier = nextOverall >= 90 ? 'Platinum' : nextOverall >= 75 ? 'Gold' : nextOverall >= 60 ? 'Silver' : nextOverall >= 45 ? 'Bronze' : 'Needs Improvement';

    const updatedSc: ESGScorecard = {
      ...oldSc,
      overallScore: nextOverall,
      tier: nextTier,
      eScore: Math.round(calcE),
      sScore: Math.round(calcS),
      gScore: Math.round(calcG),
      lastAssessed: '2026-06-06',
      notes: esgNotes,
      environmental: {
        ...oldSc.environmental,
        carbonEmissionsReporting: eReporting,
        scope1: eScope1,
        renewableEnergyPercent: eRenewable
      },
      social: {
        ...oldSc.social,
        livingWage: sLivingWage,
        womenInLeadership: sWomenInLeadership
      },
      governance: {
        ...oldSc.governance,
        codeOfEthics: gEthics,
        gdprCompliant: gGdpr,
        boardIndependencePercent: gBoardIndependence
      }
    };

    onUpdateScorecard(updatedSc);
    setIsEsgAssessorOpen(false);
  };

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
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Performance Evaluations & ESG</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Corporate ESG & Audit</h1>
        </div>

        <div className="flex border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-1 shadow-sm">
          <button
            onClick={() => setSubTab('esg')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase rounded ${
              subTab === 'esg' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Leaf size={14} /> ESG & Sustainability
          </button>
          <button
            onClick={() => setSubTab('scorecards')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase rounded ${
              subTab === 'scorecards' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Star size={14} /> KPI Scorecards
          </button>
        </div>
      </div>

      {subTab === 'esg' ? (
        /* MAIN FEATURE D: ESG DASHBOARD */
        <div className="space-y-6">
          {/* KPI METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Average ESG Score</span>
              <div className="relative w-[140px] h-[75px] mb-2 overflow-hidden flex items-end justify-center">
                <svg className="absolute inset-0 w-full h-full">
                  <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="url(#esgGrad)" strokeWidth="12" strokeDasharray="188" strokeDashoffset={`${188 - (avgEsgScore / 100) * 188}`} />
                  <defs>
                    <linearGradient id="esgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-xl font-black text-slate-900 dark:text-white font-roboto z-10 leading-none">
                  {avgEsgScore} <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
              </div>
              <span className="text-[10px] text-green-600 font-extrabold flex items-center gap-0.5">
                <ArrowUpRight size={10} /> +4.2 pts YoY
              </span>
            </div>

            {[
              { label: 'Environmental (E)', val: '68.1', color: 'text-green-600 bg-green-50/50 dark:bg-green-950/20 border-green-200/50', desc: 'Carbon & Renewables' },
              { label: 'Social (S)', val: '74.8', color: 'text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50', desc: 'Labor & Safety Standards' },
              { label: 'Governance (G)', val: '73.9', color: 'text-purple-600 bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/50', desc: 'Transparency & Code' },
              { label: 'Assessed Coverage', val: '186 / 248', color: 'text-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-200/50', desc: '75.0% Portfolio Coverage' }
            ].map((k, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{k.label}</span>
                  <p className="text-28px font-black text-slate-900 dark:text-white font-roboto tracking-tight mt-1">{k.val}</p>
                </div>
                <div className={`mt-2 p-1 border rounded text-[9.5px] font-bold uppercase text-center ${k.color}`}>
                  {k.desc}
                </div>
              </div>
            ))}
          </div>

          {/* ROW 2: CHARTS Scatter / Stacked Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Scatter analysis quadrant */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 tracking-tight font-roboto">ESG Score vs Spend Quadrant</h3>
              <p className="text-12px text-slate-400 mb-4">Highlighting strategic exposure risk sectors</p>

              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} />
                    <XAxis type="number" dataKey="esgScore" name="ESG Score" unit="pts" domain={[40, 100]} stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                    <YAxis type="number" dataKey="spend" name="Spend" unit="K" domain={[0, 1000]} stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: '#e2e8f0' }}
                    />
                    <Scatter name="Vendors" data={scatterData} fill="#10b981" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RIGHT: ESG Grouped bars */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 tracking-tight font-roboto">Score Breakdown by Pillar</h3>
              <p className="text-12px text-slate-400 mb-4">Pillar evaluations of average ratings</p>

              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Environmental', 'Tier 1': 74, 'Tier 2': 66, 'Tier 3': 52 },
                    { name: 'Social', 'Tier 1': 81, 'Tier 2': 71, 'Tier 3': 60 },
                    { name: 'Governance', 'Tier 1': 85, 'Tier 2': 73, 'Tier 3': 68 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} />
                    <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Tier 1" fill="#2563eb" />
                    <Bar dataKey="Tier 2" fill="#16a34a" />
                    <Bar dataKey="Tier 3" fill="#d97706" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ROW 3: HEATMAP */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 tracking-tight font-roboto">ESG Category Performance Heatmap</h3>
            <p className="text-12px text-slate-400 mb-4">Average verified scores aggregated by category and indicator dimensions</p>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-12px">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left p-3 text-[10px] uppercase font-black tracking-widest text-slate-450 w-[180px]">Vendor Sector</th>
                    {esgDimensions.map((d, dIdx) => (
                      <th key={dIdx} className="p-3">
                        <div className="text-[10px] font-extrabold uppercase text-slate-700 dark:text-slate-300">{d.label}</div>
                        <span className="text-[9px] font-black uppercase text-slate-400">({d.group})</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categoriesList.map((cat, catIdx) => {
                    return (
                      <tr key={catIdx}>
                        <td className="text-left p-3 font-bold text-slate-800 dark:text-slate-250 truncate bg-slate-50/50 dark:bg-slate-850/10">
                          {cat}
                        </td>
                        {esgDimensions.map((d, dIdx) => {
                          // mock a stable score
                          const baseScore = 65 + (catIdx * 4) + (dIdx * 3) % 25;
                          const scoreVal = baseScore > 98 ? 98 : baseScore;
                          return (
                            <td key={dIdx} className="p-1 px-2">
                              <div className={`p-2 border text-[11px] font-bold font-mono rounded text-center shadow-sm ${getHeatmapColor(scoreVal)}`}>
                                {scoreVal}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROW 4: ESG SCORECARD DIRECTORY */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 dark:bg-slate-800/40 gap-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">Verified ESG Scorecard Directory</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded border border-slate-250 dark:border-slate-700">
                  Run Bulk Reassess
                </button>
              </div>
            </div>

            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Vendor ID</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Company Name</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Pillar Scores (E | S | G)</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Overall Rating</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Last Assessed</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scorecards.slice(0, 10).map(sc => {
                  const badge = getEsgTierBadge(sc.overallScore);
                  return (
                    <tr key={sc.vendorId} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-[11px] font-black font-mono text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => onNavigateToDetail(sc.vendorId)}>
                        {sc.vendorId}
                      </td>
                      <td className="p-3 text-13px font-bold text-slate-800 dark:text-slate-200">{sc.vendorName}</td>
                      <td className="p-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold">{sc.eScore}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{sc.sScore}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-purple-600 dark:text-purple-400 font-bold">{sc.gScore}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 border text-[10px] font-black uppercase rounded ${badge.bg}`}>
                          {sc.tier} ({sc.overallScore})
                        </span>
                      </td>
                      <td className="p-3 text-12px text-slate-500">{sc.lastAssessed || '2026-02-14'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenAssessForm(sc)}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                        >
                          Assess
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VENDOR PERFORMANCE & SCORECARDS TAB */
        <div className="space-y-6">
          {/* KPI METRIC TIERS */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { label: 'Portfolio Performance Average', val: '84.2 / 100', color: 'text-blue-600', trend: '↓ -0.8% From Last Month' },
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
                    <Bar dataKey="Quality" fill="#3b82f6" name="Quality Score" />
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
                    <YAxis type="number" dataKey="esgScore" name="Performance" unit="pts" domain={[40, 100]} stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: '#e2e8f0' }} />
                    <Scatter name="Rating" data={scatterData} fill="#3b82f6" />
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
                    <tr key={v.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-serif italic text-base font-bold text-slate-900 dark:text-slate-300">
                        {rankIdx === 0 ? '🏆 1' : rankIdx === 1 ? '🥈 2' : rankIdx === 2 ? '🥉 3' : `#${rankIdx + 1}`}
                      </td>
                      <td className="p-3 text-[11px] font-bold font-mono text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => onNavigateToDetail(v.id)}>
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
                          className="px-2.5 py-1 text-[10px] font-black uppercase bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
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
      )}

      {/* MODAL: ESG ASSESSMENT MANAGER */}
      {isEsgAssessorOpen && selectedEsgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">Analyze ESG Checklist Criteria</h3>
              <button onClick={() => setIsEsgAssessorOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {/* Environmental Accordion element */}
                <div className="p-3 bg-green-50/20 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50 rounded-lg">
                  <h4 className="text-xs font-black uppercase text-green-700 dark:text-green-400 mb-2">Environmental Dimensions</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-700 dark:text-slate-350 font-semibold">Carbon Emissions Reporting</label>
                      <input
                        type="checkbox"
                        checked={eReporting}
                        onChange={e => setEReporting(e.target.checked)}
                        className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    {eReporting && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Est Scope 1 Emissions (tCO2e)</label>
                        <input
                          type="number"
                          value={eScope1}
                          onChange={e => setEScope1(Number(e.target.value))}
                          className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none text-slate-800 dark:text-white"
                        />
                      </div>
                    )}
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                        <span>Renewable Energy Usage</span>
                        <span>{eRenewable}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eRenewable}
                        onChange={e => setERenewable(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-250 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Accordion element */}
                <div className="p-3 bg-blue-50/20 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50 rounded-lg">
                  <h4 className="text-xs font-black uppercase text-blue-700 dark:text-blue-400 mb-2">Social Parameters</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-700 dark:text-slate-350 font-semibold">Living Wage Verification</label>
                      <input
                        type="checkbox"
                        checked={sLivingWage}
                        onChange={e => setSLivingWage(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                        <span>Women in Senior Leadership</span>
                        <span>{sWomenInLeadership}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sWomenInLeadership}
                        onChange={e => setSWomenInLeadership(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-250 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Governance Accordion element */}
                <div className="p-3 bg-purple-50/20 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/50 rounded-lg">
                  <h4 className="text-xs font-black uppercase text-purple-700 dark:text-purple-400 mb-2">Governance Profiles</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-700 dark:text-slate-350 font-semibold">Code of Ethics Published</label>
                      <input
                        type="checkbox"
                        checked={gEthics}
                        onChange={e => setGEthics(e.target.checked)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <label className="text-xs text-slate-700 dark:text-slate-350">GDPR Compliance Declared</label>
                      <input
                        type="checkbox"
                        checked={gGdpr}
                        onChange={e => setGGdpr(e.target.checked)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                        <span>Board Independence</span>
                        <span>{gBoardIndependence}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={gBoardIndependence}
                        onChange={e => setGBoardIndependence(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-250 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Audit Assessor Remarks</label>
                  <textarea
                    rows={2}
                    value={esgNotes}
                    onChange={e => setEsgNotes(e.target.value)}
                    placeholder="Enter compliance references, certification audits, or findings..."
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-201 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEsgAssessorOpen(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] uppercase"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                        stroke="#2563eb"
                        fill="#2563eb"
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
                        <div className="bg-blue-600 h-2" style={{ width: `${m.val}%` }}></div>
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] uppercase"
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
