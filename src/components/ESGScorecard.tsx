/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Leaf, Award, Sparkles, X, Search
} from 'lucide-react';
import { Vendor, ESGScorecard as ESGScorecardType } from '../dataStore';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, BarChart, Bar, CartesianGrid } from 'recharts';

interface ESGScorecardProps {
  vendors: Vendor[];
  esgScorecards: ESGScorecardType[];
  onUpdateVendorESG: (vendorId: string, updatedScorecard: ESGScorecardType) => void;
  dark: boolean;
}

export const ESGScorecard: React.FC<ESGScorecardProps> = ({
  vendors,
  esgScorecards,
  onUpdateVendorESG,
  dark
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedScorecardDetail, setSelectedScorecardDetail] = useState<ESGScorecardType | null>(null);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  // Interactive Form State (for selected vendor assessment)
  const [assessedVendorId, setAssessedVendorId] = useState('');
  const [formE, setFormE] = useState({ carbonReporting: true, renewableEnergy: 65, iso14001: true, wasteProg: true });
  const [formS, setFormS] = useState({ livingWage: true, noChildLabor: true, diversityScore: 40, communityInvest: true });
  const [formG, setFormG] = useState({ codeEthics: true, antiBribery: true, boardIndependence: 60, gdprCompliance: true });

  const [activeAccordion, setActiveAccordion] = useState<'E' | 'S' | 'G'>('E');

  const esgAssessedCount = useMemo(() => {
    return esgScorecards.filter(e => e.overallScore > 30).length;
  }, [esgScorecards]);

  const esgAverage = useMemo(() => {
    if (!esgScorecards.length) return 70;
    return Math.round(esgScorecards.reduce((acc, e) => acc + e.overallScore, 0) / esgScorecards.length);
  }, [esgScorecards]);

  // Scatter plot data mapping
  const scatterData = useMemo(() => {
    return esgScorecards.map(sc => {
      const v = vendors.find(vend => vend.id === sc.vendorId);
      return {
        name: sc.vendorName,
        esgScore: sc.overallScore,
        spend: v ? Math.round(v.contractValue / 1000) : 100, // standard value
        tier: sc.tier,
        category: v ? v.category : 'IT Services'
      };
    });
  }, [esgScorecards, vendors]);

  // Interactive computed overall score from form
  const computedFormScore = useMemo(() => {
    let eVal = (formE.carbonReporting ? 30 : 0) + (formE.renewableEnergy * 0.4) + (formE.iso14001 ? 15 : 0) + (formE.wasteProg ? 15 : 0);
    let sVal = (formS.livingWage ? 30 : 0) + (formS.noChildLabor ? 30 : 0) + (formS.diversityScore * 0.2) + (formS.communityInvest ? 20 : 0);
    let gVal = (formG.codeEthics ? 25 : 0) + (formG.antiBribery ? 30 : 0) + (formG.boardIndependence * 0.3) + (formG.gdprCompliance ? 20 : 0);
    
    // Scale out of 100
    eVal = Math.min(100, eVal);
    sVal = Math.min(100, sVal);
    gVal = Math.min(100, gVal);

    const overall = eVal * 0.35 + sVal * 0.35 + gVal * 0.30;
    return {
      E: Math.round(eVal),
      S: Math.round(sVal),
      G: Math.round(gVal),
      overall: Math.round(overall)
    };
  }, [formE, formS, formG]);

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessedVendorId) return;

    const targetVendor = vendors.find(v => v.id === assessedVendorId);
    const overallESGTier = computedFormScore.overall >= 90 ? 'Platinum' : computedFormScore.overall >= 75 ? 'Gold' : computedFormScore.overall >= 60 ? 'Silver' : computedFormScore.overall >= 45 ? 'Bronze' : 'Needs Improvement';

    const updatedScorecard: ESGScorecardType = {
      vendorId: assessedVendorId,
      vendorName: targetVendor?.name || 'Assessed Vendor',
      overallScore: computedFormScore.overall,
      tier: overallESGTier as any,
      eScore: computedFormScore.E,
      sScore: computedFormScore.S,
      gScore: computedFormScore.G,
      lastAssessed: new Date().toISOString().split('T')[0],
      yoyChange: 1.5,
      environmental: {
        carbonEmissionsReporting: formE.carbonReporting,
        scope1: 240,
        scope2: 480,
        scope3: 1100,
        renewableEnergyPercent: formE.renewableEnergy,
        environmentalPolicy: true,
        iso14001Certified: formE.iso14001,
        wasteReduction: formE.wasteProg,
        waterStewardship: true,
        supplyChainAudits: true,
        incidents2Years: 0
      },
      social: {
        livingWage: formS.livingWage,
        noChildLabor: formS.noChildLabor,
        injuryRate: 0.2,
        turnoverRate: 8,
        womenInLeadership: formS.diversityScore,
        diversityPolicy: true,
        communityPrograms: true,
        avgTrainingHours: 24,
        humanRightsDueDiligence: true,
        socialAudits: true
      },
      governance: {
        codeOfEthics: formG.codeEthics,
        antiCorruption: formG.antiBribery,
        whistleblower: true,
        boardIndependencePercent: formG.boardIndependence,
        externalAuditCompleted: true,
        dpoAppointed: true,
        gdprCompliant: formG.gdprCompliance,
        conflictsPolicy: true,
        execCompensationTrans: true,
        violations3Years: 0
      }
    };

    onUpdateVendorESG(assessedVendorId, updatedScorecard);
    setAssessmentModalOpen(false);
  };

  const getESGBadge = (score: number) => {
    if (score >= 90) return { label: 'Platinum Pillar', bg: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700' };
    if (score >= 75) return { label: 'Gold Standard', bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700' };
    if (score >= 60) return { label: 'Silver Level', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700' };
    if (score >= 45) return { label: 'Bronze Level', bg: 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700' };
    return { label: 'Needs Improvement', bg: 'bg-red-100 dark:bg-red-950/20 text-red-700' };
  };

  const categoryBarChartData = useMemo(() => {
    return [
      { name: 'Environmental', 'Tier 1': 74, 'Tier 2': 68, 'Tier 3': 52 },
      { name: 'Social', 'Tier 1': 81, 'Tier 2': 75, 'Tier 3': 60 },
      { name: 'Governance', 'Tier 1': 78, 'Tier 2': 72, 'Tier 3': 65 },
    ];
  }, []);

  const filteredScorecards = useMemo(() => {
    return esgScorecards.filter(sc => {
      const matchSearch = sc.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      const v = vendors.find(vend => vend.id === sc.vendorId);
      const matchTier = tierFilter === 'All' || (v && v.tier === tierFilter);
      return matchSearch && matchTier;
    });
  }, [esgScorecards, vendors, searchQuery, tierFilter]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F5F7] dark:bg-[#0D1117] text-[#111827] dark:text-[#F1F5F9] overflow-y-auto transition-colors duration-200">
      
      {/* Top Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] flex justify-between items-center flex-wrap gap-4 select-none">
        <div>
          <h1 className="font-roboto font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Leaf className="text-green-500 animate-pulse" /> ESG & Sustainability Compliance
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tracking Carbon Footprint records, human rights indexes, whistleblower certifications, and compliance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-xs border border-gray-300 dark:border-gray-750 rounded px-2.5 py-1.5 focus:border-green-500"
          >
            <option value="2024">Period Year: 2024</option>
            <option value="2025">Period Year: 2025</option>
          </select>
          <button 
            onClick={() => setAssessmentModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <Sparkles size={14} /> Assess Vendor ESG
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Avg ESG Score</span>
              <p className="text-2xl font-roboto font-black text-gray-800 dark:text-white mt-1">{esgAverage} / 100</p>
            </div>
            <div className="mt-3">
              <span className="text-[10px] text-green-500 font-bold">↑ 4.2 pts overall vs 2023</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Environmental Pillar</span>
              <p className="text-2xl font-roboto font-black text-green-600 dark:text-green-450 mt-1">71.0</p>
            </div>
            <span className="text-[9px] text-gray-400 mt-2">Renewable energy metric bias</span>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Social Pillar</span>
              <p className="text-2xl font-roboto font-black text-blue-600 dark:text-blue-400 mt-1">74.5</p>
            </div>
            <span className="text-[9px] text-gray-400 mt-2">Living wage standard tracking</span>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Governance Pillar</span>
              <p className="text-2xl font-roboto font-black text-purple-600 dark:text-purple-400 mt-1">75.1</p>
            </div>
            <span className="text-[9px] text-gray-400 mt-2">Certified whistleblower active logs</span>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">ESG Audit Coverage</span>
              <p className="text-2xl font-roboto font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {esgAssessedCount} / {esgScorecards.length}
              </p>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${(esgAssessedCount/esgScorecards.length)*100}%` }}></div>
            </div>
          </div>

        </div>

        {/* Charts: Quadrant Scatter & Grouped Bar chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="font-roboto font-extrabold text-[#111827] dark:text-white text-xs uppercase tracking-widest mb-4">
              Pillar Scatter Matrix (ESG Score vs Spend)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis type="number" dataKey="esgScore" name="ESG Score" domain={[30, 100]} label={{ value: 'ESG Score (Higher = Safer)', position: 'insideBottom', offset: -5 }} stroke={dark ? '#94A3B8' : '#6B7280'} />
                  <YAxis type="number" dataKey="spend" name="Total Spend ($)" unit="k" label={{ value: 'Total Spend ($k)', angle: -90, position: 'insideLeft' }} stroke={dark ? '#94A3B8' : '#6B7280'} />
                  <ZAxis type="category" dataKey="name" name="Vendor Company" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Vendors Portfolio" data={scatterData} fill="#16A34A" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="font-roboto font-extrabold text-[#111827] dark:text-white text-xs uppercase tracking-widest mb-4">
              Tier Breakdown performance index target
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBarChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke={dark ? '#94A3B8' : '#6B7280'} />
                  <YAxis domain={[0, 100]} stroke={dark ? '#94A3B8' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: dark ? '#1E293B' : '#FFFFFF',
                      borderColor: dark ? '#334155' : '#E2E8F0',
                      color: dark ? '#F1F5F9' : '#111827'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="Tier 1" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Tier 2" fill="#16A34A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Tier 3" fill="#D97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ESG breakdown list TABLE */}
        <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1C2333]">
            <h3 className="font-roboto font-extrabold text-xs uppercase tracking-widest text-[#111827] dark:text-white">
              ESG Vendor Portfolio Ledger
            </h3>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registry..."
                className="bg-transparent text-xs border border-gray-300 dark:border-gray-700 px-3 py-1 rounded outline-none"
              />
              <select 
                value={tierFilter} 
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-transparent text-xs border border-gray-300 dark:border-gray-750 rounded px-2"
              >
                <option value="All">All Tiers</option>
                <option value="Tier 1">Tier 1 Only</option>
                <option value="Tier 2">Tier 2 Only</option>
                <option value="Tier 3">Tier 3 Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/50 dark:bg-gray-800/15 border-b border-gray-200 dark:border-gray-800 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Tier Status</th>
                  <th className="p-4">Rating Division</th>
                  <th className="p-4 text-center">E Score</th>
                  <th className="p-4 text-center">S Score</th>
                  <th className="p-4 text-center">G Score</th>
                  <th className="p-4 text-center">Overall</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                {filteredScorecards.slice(0, 15).map(sc => {
                  const badge = getESGBadge(sc.overallScore);
                  const v = vendors.find(vend => vend.id === sc.vendorId);
                  return (
                    <tr key={sc.vendorId} className="hover:bg-gray-50/50 dark:hover:bg-[#1E273A]/45">
                      <td className="p-4 font-bold text-gray-805 dark:text-gray-100">{sc.vendorName}</td>
                      <td className="p-4">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-black ${
                          (v ? v.tier : 'Tier 2') === 'Tier 1' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700' : 'bg-green-50 dark:bg-green-900/40 text-green-700'
                        }`}>
                          {v ? v.tier : 'Tier 2'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-green-600">{sc.eScore}</td>
                      <td className="p-4 text-center font-bold text-blue-600">{sc.sScore}</td>
                      <td className="p-4 text-center font-bold text-purple-600">{sc.gScore}</td>
                      <td className="p-4 text-center font-roboto font-extrabold text-[#111827] dark:text-white text-sm">{sc.overallScore}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedScorecardDetail(sc)}
                          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 dark:bg-[#1B2135] dark:hover:bg-[#252E46] text-[#111827] dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-800 rounded transition"
                        >
                          Detail Metrics
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Slide-out detail View Panel from Right */}
      {selectedScorecardDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-[500px] bg-white dark:bg-[#161B27] h-full shadow-2xl overflow-y-auto p-8 relative animate-in slide-in-from-right duration-250">
            <button 
              onClick={() => setSelectedScorecardDetail(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <header className="mb-6">
              <span className="text-[10px] text-green-600 dark:text-green-450 uppercase font-bold tracking-widest flex items-center gap-1 mb-1.5">
                <Leaf size={12} /> ESG REPORT CARD
              </span>
              <h2 className="font-roboto font-black text-[#111827] dark:text-white text-xl">
                {selectedScorecardDetail.vendorName}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Vendor ID Reference: {selectedScorecardDetail.vendorId}</p>
            </header>

            <div className="space-y-6">
              
              {/* Overall Score Circle Gauge */}
              <div className="bg-gray-50 dark:bg-[#1C2030]/50 p-6 rounded-lg text-center flex flex-col items-center">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Composite ESG Score</p>
                <div className="w-28 h-28 rounded-full border-8 border-green-500 flex items-center justify-center mb-3">
                  <span className="text-3xl font-roboto font-black text-gray-800 dark:text-white">{selectedScorecardDetail.overallScore}</span>
                </div>
                <span className={`px-3 py-1 font-black rounded uppercase text-xs ${getESGBadge(selectedScorecardDetail.overallScore).bg}`}>
                  {getESGBadge(selectedScorecardDetail.overallScore).label}
                </span>
              </div>

              {/* Breakdown Grid E / S / G */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm border-b border-gray-150 dark:border-gray-800 pb-2">Compliance Breakdown Values</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Environmental Dimension</span>
                      <span className="text-green-600 font-bold">{selectedScorecardDetail.eScore} / 100</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${selectedScorecardDetail.eScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Social Dimension</span>
                      <span className="text-blue-600 font-bold">{selectedScorecardDetail.sScore} / 100</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${selectedScorecardDetail.sScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Governance Dimension</span>
                      <span className="text-purple-600 font-bold">{selectedScorecardDetail.gScore} / 100</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${selectedScorecardDetail.gScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulleted recommendations */}
              <div className="bg-green-50/50 dark:bg-green-950/10 p-5 rounded-lg border border-green-150 dark:border-green-800/40 text-xs">
                <h4 className="font-bold text-green-700 dark:text-green-455 mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} /> Optimization Plan Suggestions
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-350 list-disc list-inside">
                  <li>Incentivize local supplier scope carbon tracking compliance systems.</li>
                  <li>Incorporate formal SLA performance penalties aligned to human rights certifications.</li>
                  <li>Schedule next annual executive board transparency compliance review.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Interactive Assessment modal dialog form */}
      {assessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gray-50 dark:bg-[#1C2333] px-6 py-4 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-roboto font-extrabold text-sm uppercase tracking-wider">
                Vendor ESG Compliance Assessment Form
              </h3>
              <button onClick={() => setAssessmentModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssessmentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Target Assessment Vendor *</label>
                <select 
                  required
                  value={assessedVendorId}
                  onChange={(e) => setAssessedVendorId(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 text-xs outline-none focus:border-green-500 text-slate-800 dark:text-white"
                >
                  <option value="" className="text-slate-800">Choose Registry Supplier...</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id} className="text-slate-850">{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              {/* Tab Selector Accordions */}
              <div className="flex border-b border-gray-100 dark:border-gray-800 py-1.5 gap-2">
                <button 
                  type="button"
                  onClick={() => setActiveAccordion('E')}
                  className={`px-3 py-1 text-xs font-bold rounded ${activeAccordion === 'E' ? 'bg-green-100 text-green-800' : 'text-gray-400'}`}
                >
                  E: Environmental
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveAccordion('S')}
                  className={`px-3 py-1 text-xs font-bold rounded ${activeAccordion === 'S' ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}
                >
                  S: Social
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveAccordion('G')}
                  className={`px-3 py-1 text-xs font-bold rounded ${activeAccordion === 'G' ? 'bg-purple-100 text-purple-800' : 'text-gray-400'}`}
                >
                  G: Governance
                </button>
              </div>

              {/* Accordion Panels */}
              {activeAccordion === 'E' && (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-[#1E2333]/30 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Carbon Scope 1 & 2 Emissions Reporting</span>
                    <input 
                      type="checkbox" 
                      checked={formE.carbonReporting}
                      onChange={(e) => setFormE({ ...formE, carbonReporting: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Renewable Energy Usage Target: {formE.renewableEnergy}%</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={formE.renewableEnergy}
                      onChange={(e) => setFormE({ ...formE, renewableEnergy: parseInt(e.target.value) })}
                      className="w-full accent-green-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">ISO 14001 Environmental System Certification</span>
                    <input 
                      type="checkbox" 
                      checked={formE.iso14001}
                      onChange={(e) => setFormE({ ...formE, iso14001: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                </div>
              )}

              {activeAccordion === 'S' && (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-[#1E2333]/30 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Fair Living Wage Policy Enforced</span>
                    <input 
                      type="checkbox" 
                      checked={formS.livingWage}
                      onChange={(e) => setFormS({ ...formS, livingWage: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">No Forced/Child Labor Systemic Audit Pass</span>
                    <input 
                      type="checkbox" 
                      checked={formS.noChildLabor}
                      onChange={(e) => setFormS({ ...formS, noChildLabor: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">D&I Minority Representation: {formS.diversityScore}%</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={formS.diversityScore}
                      onChange={(e) => setFormS({ ...formS, diversityScore: parseInt(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              )}

              {activeAccordion === 'G' && (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-[#1E2333]/30 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Code of Ethics Formally Published</span>
                    <input 
                      type="checkbox" 
                      checked={formG.codeEthics}
                      onChange={(e) => setFormG({ ...formG, codeEthics: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Anti-Bribery Whistleblower Program Active</span>
                    <input 
                      type="checkbox" 
                      checked={formG.antiBribery}
                      onChange={(e) => setFormG({ ...formG, antiBribery: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Board of Directors Independence: {formG.boardIndependence}%</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={formG.boardIndependence}
                      onChange={(e) => setFormG({ ...formG, boardIndependence: parseInt(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Computed Scores Footer Preview */}
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center text-xs">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-450">Predicted Composition Rating</span>
                  <span className="text-sm font-roboto font-black text-green-700 dark:text-green-450 mr-2">Overall ESG: {computedFormScore.overall}</span>
                  <span className="text-[10px] text-gray-400">E:{computedFormScore.E} S:{computedFormScore.S} G:{computedFormScore.G}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getESGBadge(computedFormScore.overall).bg}`}>
                  {getESGBadge(computedFormScore.overall).label}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setAssessmentModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-755 hover:bg-gray-50 rounded font-semibold text-xs text-slate-500"
                >
                  Discard Assessment
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded shadow"
                >
                  Seal Assessment Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
