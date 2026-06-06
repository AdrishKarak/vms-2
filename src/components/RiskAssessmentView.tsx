import React, { useState, useMemo } from 'react';
import { ShieldAlert, Info, ArrowRight, Play, Eye, FileText, CheckCircle2, ChevronRight, X, AlertTriangle, Filter, Search } from 'lucide-react';
import { Vendor, RiskAssessment } from '../dataStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface RiskAssessmentViewProps {
  vendors: Vendor[];
  riskAssessments: RiskAssessment[];
  isDark: boolean;
  onNavigateToDetail: (vendorId: string) => void;
  onAddRiskAssessment: (ra: RiskAssessment) => void;
}

export function RiskAssessmentView({
  vendors,
  riskAssessments,
  isDark,
  onNavigateToDetail,
  onAddRiskAssessment
}: RiskAssessmentViewProps) {
  const [searchVal, setSearchVal] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  
  // Matrix modal
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [selectedCellCoords, setSelectedCellCoords] = useState<{ l: number; i: number } | null>(null);

  // Form Assessment ESG elements
  const [creditRating, setCreditRating] = useState('A');
  const [finStability, setFinStability] = useState(4);
  const [yearsInBusiness, setYearsInBusiness] = useState(8);
  const [isPublic, setIsPublic] = useState(true);
  const [outstandingLitigation, setOutstandingLitigation] = useState(false);

  const [singleSource, setSingleSource] = useState(false);
  const [drPlan, setDrPlan] = useState(true);
  const [keyPersonnel, setKeyPersonnel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [capacity, setCapacity] = useState(70);

  const [violations, setViolations] = useState(false);
  const [antiBribery, setAntiBribery] = useState(true);
  const [sanctions, setSanctions] = useState<'Pass' | 'Fail' | 'Pending'>('Pass');

  const [dataAccess, setDataAccess] = useState<'None' | 'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [encryptionAtRest, setEncryptionAtRest] = useState(true);
  const [mfa, setMfa] = useState(true);

  const [polStability, setPolStability] = useState(4);
  const [exportControls, setExportControls] = useState(false);

  const [recommendations, setRecommendations] = useState('');

  // Auto-calculated score
  const computedScore = useMemo(() => {
    let score = 50;
    if (outstandingLitigation) score += 15;
    if (singleSource) score += 15;
    if (keyPersonnel === 'High') score += 10;
    if (!drPlan) score += 10;
    if (violations) score += 15;
    if (sanctions === 'Fail') score += 30;
    if (dataAccess === 'Critical' || dataAccess === 'High') score += 15;
    if (!encryptionAtRest || !mfa) score += 15;
    if (polStability < 3) score += 15;
    
    return Math.min(100, Math.max(10, score));
  }, [outstandingLitigation, singleSource, keyPersonnel, drPlan, violations, sanctions, dataAccess, encryptionAtRest, mfa, polStability]);

  // Overall counters
  const metrics = useMemo(() => {
    let critical = 0, high = 0, medium = 0, low = 0;
    vendors.forEach(v => {
      if (v.riskScore >= 75) critical++;
      else if (v.riskScore >= 55) high++;
      else if (v.riskScore >= 30) medium++;
      else low++;
    });
    return { critical, high, medium, low, unassessed: vendors.filter(v => !v.riskScore).length };
  }, [vendors]);

  // Chart Data: Risk by Tier
  const tierRiskData = useMemo(() => {
    const data = [
      { name: 'Tier 1', Critical: 0, High: 0, Medium: 0, Low: 0 },
      { name: 'Tier 2', Critical: 0, High: 0, Medium: 0, Low: 0 },
      { name: 'Tier 3', Critical: 0, High: 0, Medium: 0, Low: 0 }
    ];

    vendors.forEach(v => {
      const idx = v.tier === 'Tier 1' ? 0 : v.tier === 'Tier 2' ? 1 : 2;
      if (v.riskScore >= 75) data[idx].Critical++;
      else if (v.riskScore >= 55) data[idx].High++;
      else if (v.riskScore >= 30) data[idx].Medium++;
      else data[idx].Low++;
    });

    return data;
  }, [vendors]);

  // Chart Data: Risk by Category
  const categoryRiskData = [
    { name: 'Financial', value: 35, fill: '#ef4444' },
    { name: 'Operational', value: 25, fill: '#f97316' },
    { name: 'Compliance', value: 20, fill: '#eab308' },
    { name: 'Cybersecurity', value: 15, fill: '#3b82f6' },
    { name: 'Geopolitical', value: 5, fill: '#10b981' }
  ];

  // Map vendors to 5x5 grid cells
  // cell coordinate l (likelihood: 1 to 5) and i (impact: 1 to 5)
  const getCellVendors = (l: number, i: number) => {
    return vendors.filter(v => {
      // Deterministic mapping based on risk score & id for seed consistency
      const score = v.riskScore || 30;
      const computedL = Math.min(5, Math.max(1, Math.floor(score / 20) + (parseInt(v.id.replace('VND-', '')) % 2)));
      const computedI = Math.min(5, Math.max(1, Math.floor(v.contractValue / 200000) + 1));
      return computedL === l && computedI === i;
    });
  };

  // Cell Background class
  const getCellBgClass = (l: number, i: number) => {
    const score = l * i;
    if (score >= 15) return 'bg-red-500/25 hover:bg-red-500/40 text-red-700 dark:text-red-300';
    if (score >= 8) return 'bg-amber-500/25 hover:bg-amber-500/40 text-amber-700 dark:text-amber-300';
    return 'bg-green-500/25 hover:bg-green-500/40 text-green-700 dark:text-green-300';
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(searchVal.toLowerCase()) || v.id.toLowerCase().includes(searchVal.toLowerCase());
      const matchTier = selectedTier === 'All' || v.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [vendors, searchVal, selectedTier]);

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendorId) return;

    const vendor = vendors.find(v => v.id === selectedVendorId);
    if (!vendor) return;

    const newRA: RiskAssessment = {
      vendorId: selectedVendorId,
      vendorName: vendor.name,
      overallScore: computedScore,
      assessedDate: new Date().toISOString().split('T')[0],
      assessor: 'Alex Mercer',
      financial: {
        rating: creditRating,
        stability: finStability,
        yearsInBusiness,
        isPublic,
        outstandingLitigation
      },
      operational: {
        singleSource,
        geographicConcentration: vendor.country,
        disasterRecovery: drPlan,
        keyPersonnelDependency: keyPersonnel,
        capacityUtilization: capacity
      },
      compliance: {
        certifications: ['ISO 9001', 'SOC2'],
        violationsPast3Years: violations,
        antiBriberyPolicy: antiBribery,
        sanctionsCheck: sanctions,
        laborPractice: 4
      },
      cybersecurity: {
        dataAccessLevel: dataAccess,
        lastPenTestDate: '2026-02-15',
        encryptionAtRest,
        encryptionInTransit: true,
        incidentResponse: true,
        mfaEnforced: mfa
      },
      geopolitical: {
        countriesOfOperations: vendor.country,
        sanctionedCountryExposure: false,
        politicalStability: polStability,
        exportControls
      },
      recommendations
    };

    onAddRiskAssessment(newRA);
    setAssessmentModalOpen(false);
    setSelectedVendorId('');
    setRecommendations('');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4 border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Corporate Risk Audit & Assessment Matrices</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Risk Assessment Engine</h1>
        </div>

        <button
          onClick={() => setAssessmentModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded shadow cursor-pointer"
        >
          <ShieldAlert size={14} /> Run New Assessment
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-neo-base shadow-neo-card p-4 rounded-[14px]">
          <span className="text-[10px] uppercase font-bold text-red-500">Critical Risk</span>
          <h3 className="text-2xl font-black text-neo-primary mt-1">{metrics.critical}</h3>
          <p className="text-[10px] text-neo-muted mt-1">Score &ge; 75 / 100</p>
        </div>
        <div className="bg-neo-base shadow-neo-card p-4 rounded-[14px]">
          <span className="text-[10px] uppercase font-bold text-orange-500">High Risk</span>
          <h3 className="text-2xl font-black text-neo-primary mt-1">{metrics.high}</h3>
          <p className="text-[10px] text-neo-muted mt-1">Score 55 - 74</p>
        </div>
        <div className="bg-neo-base shadow-neo-card p-4 rounded-[14px]">
          <span className="text-[10px] uppercase font-bold text-yellow-600">Medium Risk</span>
          <h3 className="text-2xl font-black text-neo-primary mt-1">{metrics.medium}</h3>
          <p className="text-[10px] text-neo-muted mt-1">Score 30 - 54</p>
        </div>
        <div className="bg-neo-base shadow-neo-card p-4 rounded-[14px]">
          <span className="text-[10px] uppercase font-bold text-green-600">Low Risk</span>
          <h3 className="text-2xl font-black text-neo-primary mt-1">{metrics.low}</h3>
          <p className="text-[10px] text-neo-muted mt-1">Score &lt; 30</p>
        </div>
        <div className="bg-neo-base shadow-neo-card p-4 rounded-[14px]">
          <span className="text-[10px] uppercase font-bold text-neo-muted">Unassessed</span>
          <h3 className="text-2xl font-black text-neo-primary mt-1">{metrics.unassessed}</h3>
          <p className="text-[10px] text-neo-muted mt-1">Pending first audit</p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neo-base shadow-neo-card p-6 rounded-[16px]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neo-primary mb-4">Risk Level Distribution by Vendor Tier</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierRiskData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#8a9bb0" fontSize={11} />
                <YAxis stroke="#8a9bb0" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Low" stackId="a" fill="#10b981" />
                <Bar dataKey="Medium" stackId="a" fill="#eab308" />
                <Bar dataKey="High" stackId="a" fill="#f97316" />
                <Bar dataKey="Critical" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neo-base shadow-neo-card p-6 rounded-[16px] flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neo-primary mb-2">Primary Risk Drivers by Category</h4>
          <div className="flex-1 h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryRiskData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3}>
                  {categoryRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] text-neo-muted uppercase font-bold">Risk Weight</span>
              <p className="text-lg font-black text-neo-primary">Categories</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 flex-wrap text-[11px] font-bold">
            {categoryRiskData.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.fill }}></span>
                <span>{cat.name} ({cat.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5x5 RISK MATRIX */}
      <div className="bg-neo-base shadow-neo-card p-6 rounded-[16px]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neo-primary mb-1">Interactive Likelihood vs Impact Matrix</h4>
        <p className="text-[11px] text-neo-muted mb-4">Click any quadrant block to view the specific vendors allocated to that threat level.</p>
        
        <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold max-w-3xl mx-auto border-t border-l border-slate-300 dark:border-slate-800 p-2">
          {/* Top empty cell */}
          <div className="p-2 border-r border-b border-slate-300 dark:border-slate-800 text-[10px] text-neo-muted">L \ I</div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={`i-head-${i}`} className="p-2 border-r border-b border-slate-300 dark:border-slate-800 uppercase text-[9px] text-neo-muted">Impact {i}</div>
          ))}

          {/* Rows 5 down to 1 */}
          {[5, 4, 3, 2, 1].map(l => (
            <React.Fragment key={`l-row-${l}`}>
              <div className="p-2 border-r border-b border-slate-300 dark:border-slate-800 flex items-center justify-center text-[9px] text-neo-muted uppercase">Like {l}</div>
              {[1, 2, 3, 4, 5].map(i => {
                const cellVendors = getCellVendors(l, i);
                return (
                  <div
                    key={`cell-${l}-${i}`}
                    onClick={() => {
                      setSelectedCellCoords({ l, i });
                      setMatrixModalOpen(true);
                    }}
                    className={`p-4 rounded border border-transparent flex flex-col justify-between items-center cursor-pointer transition min-h-[70px] ${getCellBgClass(l, i)}`}
                  >
                    <span className="text-xs font-black">{l * i}</span>
                    <span className="text-[10px] font-bold">{cellVendors.length} Chips</span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* RISK TABLE */}
      <div className="bg-neo-base shadow-neo-card rounded-[16px] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neo-primary">Vendor Risk Registries</h4>
          <div className="flex gap-3 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-2.5 text-neo-muted" size={14} />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search vendor risk details..."
                className="w-full pl-9 pr-4 h-[34px] text-xs bg-neo-base shadow-neo-input border-0 rounded-[10px]"
              />
            </div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="h-[34px] text-xs bg-neo-base shadow-neo-input border-0 rounded-[10px] px-2"
            >
              <option value="All">All Tiers</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-250 dark:border-gray-800 font-bold uppercase tracking-widest text-[9px] text-neo-muted">
                <th className="p-4">Vendor ID</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4 text-center">Overall Risk</th>
                <th className="p-4 text-center">Financial</th>
                <th className="p-4 text-center">Operational</th>
                <th className="p-4 text-center">Compliance</th>
                <th className="p-4 text-center">Cybersecurity</th>
                <th className="p-4 text-center">Geopolitical</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredVendors.map(v => {
                const fRisk = v.riskDetails?.financial || Math.round(v.riskScore * 0.9);
                const oRisk = v.riskDetails?.operational || Math.round(v.riskScore * 1.1) % 100;
                const cRisk = v.riskDetails?.compliance || Math.round(v.riskScore * 0.8) % 100;
                const cyRisk = v.riskDetails?.cyber || Math.round(v.riskScore * 1.2) % 100;
                const gRisk = v.riskDetails?.geopolitical || Math.round(v.riskScore * 0.75) % 100;

                const getScoreClass = (sc: number) => {
                  if (sc >= 75) return 'text-red-600 font-bold';
                  if (sc >= 45) return 'text-orange-500 font-bold';
                  return 'text-green-600 font-bold';
                };

                return (
                  <tr key={v.id} className="hover:bg-slate-50/10 dark:hover:bg-[#1E2333]/50">
                    <td className="p-4 font-mono font-bold">{v.id}</td>
                    <td className="p-4 font-bold text-neo-primary cursor-pointer hover:underline" onClick={() => onNavigateToDetail(v.id)}>{v.name}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        v.riskScore >= 75 ? 'text-red-700 bg-red-100 dark:bg-red-950/40' : v.riskScore >= 55 ? 'text-orange-700 bg-orange-100 dark:bg-orange-950/40' : 'text-green-700 bg-green-100 dark:bg-green-950/40'
                      }`}>
                        {v.riskScore}
                      </span>
                    </td>
                    <td className={`p-4 text-center ${getScoreClass(fRisk)}`}>{fRisk}</td>
                    <td className={`p-4 text-center ${getScoreClass(oRisk)}`}>{oRisk}</td>
                    <td className={`p-4 text-center ${getScoreClass(cRisk)}`}>{cRisk}</td>
                    <td className={`p-4 text-center ${getScoreClass(cyRisk)}`}>{cyRisk}</td>
                    <td className={`p-4 text-center ${getScoreClass(gRisk)}`}>{gRisk}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onNavigateToDetail(v.id)}
                        className="text-neo-accent hover:underline font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MATRIX CELL DETAILS MODAL */}
      {matrixModalOpen && selectedCellCoords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55">
          <div className="w-full max-w-lg bg-neo-base shadow-neo-modal rounded-[20px] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neo-primary">
                Matrix Cell Details: Likelihood {selectedCellCoords.l} & Impact {selectedCellCoords.i}
              </h3>
              <button onClick={() => setMatrixModalOpen(false)} className="text-neo-muted hover:text-neo-primary">
                <X size={16} />
              </button>
            </div>
            
            <div className="divide-y divide-slate-150 dark:divide-slate-800 max-h-96 overflow-y-auto pr-2">
              {getCellVendors(selectedCellCoords.l, selectedCellCoords.i).length === 0 ? (
                <p className="p-4 text-center text-xs text-neo-muted italic">No vendors mapped to this cell coordinates.</p>
              ) : (
                getCellVendors(selectedCellCoords.l, selectedCellCoords.i).map(v => (
                  <div key={v.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-neo-primary">{v.name}</p>
                      <span className="text-[10px] text-neo-muted">{v.id} • {v.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-neo-primary">Risk: {v.riskScore}</span>
                      <button
                        onClick={() => {
                          setMatrixModalOpen(false);
                          onNavigateToDetail(v.id);
                        }}
                        className="bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active px-2.5 py-1 text-[10px] font-bold text-neo-accent rounded-[8px]"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* RUN NEW RISK ASSESSMENT FORM MODAL */}
      {assessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55">
          <form onSubmit={handleAssessmentSubmit} className="w-full max-w-2xl bg-neo-base shadow-neo-modal rounded-[20px] p-6 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-800 pb-3 shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neo-primary">
                Audit Risk Assessment Form
              </h3>
              <button type="button" onClick={() => setAssessmentModalOpen(false)} className="text-neo-muted hover:text-neo-primary">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neo-secondary mb-1">Select Vendor</label>
                  <select
                    required
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs outline-none focus:shadow-neo-input-focus"
                  >
                    <option value="">Choose Registry...</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.id} - {v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neo-secondary mb-1">Financial stability scale (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={finStability}
                    onChange={(e) => setFinStability(parseInt(e.target.value))}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs outline-none focus:shadow-neo-input-focus"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-neo-base shadow-neo-card rounded-[12px]">
                  <div>
                    <span className="text-xs font-bold text-neo-primary block">Litigation Risk</span>
                    <span className="text-[10px] text-neo-muted">Outstanding lawsuit case ongoing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={outstandingLitigation}
                    onChange={(e) => setOutstandingLitigation(e.target.checked)}
                    className="w-5 h-5 bg-neo-base shadow-neo-input rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center p-3 bg-neo-base shadow-neo-card rounded-[12px]">
                  <div>
                    <span className="text-xs font-bold text-neo-primary block">Single Source Dependency</span>
                    <span className="text-[10px] text-neo-muted">Critical operational lock-in</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={singleSource}
                    onChange={(e) => setSingleSource(e.target.checked)}
                    className="w-5 h-5 bg-neo-base shadow-neo-input rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Cybersecurity / GDPR */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neo-secondary mb-1">System Data Access Level</label>
                  <select
                    value={dataAccess}
                    onChange={(e) => setDataAccess(e.target.value as any)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs outline-none"
                  >
                    <option>None</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neo-secondary mb-1">Geopolitical Stability index (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={polStability}
                    onChange={(e) => setPolStability(parseInt(e.target.value))}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Textarea recommendations */}
              <div>
                <label className="block text-xs font-semibold text-neo-secondary mb-1">Mitigation Recommendations</label>
                <textarea
                  rows={3}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="e.g. Demand ISO-27001 recertification within 30 days..."
                  className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] p-3 text-xs outline-none"
                />
              </div>

              <div className="p-4 bg-neo-base shadow-neo-card rounded-[12px] flex justify-between items-center font-bold">
                <span className="text-xs text-neo-secondary">Calculated Overall Score:</span>
                <span className={`text-sm px-3 py-1 rounded shadow-neo-badge ${
                  computedScore >= 75 ? 'text-red-700' : computedScore >= 45 ? 'text-orange-600' : 'text-green-700'
                }`}>
                  {computedScore} / 100
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-300 dark:border-slate-800 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => setAssessmentModalOpen(false)}
                className="px-4 py-2 bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active text-xs font-bold text-neo-secondary rounded-[12px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active text-xs font-bold text-neo-accent rounded-[12px]"
              >
                Submit Audit
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
