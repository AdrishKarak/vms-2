import { useState, useMemo } from 'react';
import { GitCompare, Plus, X, Award, ChevronRight, Eye, ShoppingCart, Send, LayoutList, Star } from 'lucide-react';
import { Vendor } from '../dataStore';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CompareToolsProps {
  vendors: Vendor[];
  initialSelectedIds: string[];
  onNavigateToDetail: (vendorId: string) => void;
  onOpenCreatePO: (vendorId: string) => void;
  onOpenCreateRFQ: (vendorId: string) => void;
  isDark: boolean;
}

export function CompareTools({
  vendors,
  initialSelectedIds,
  onNavigateToDetail,
  onOpenCreatePO,
  onOpenCreateRFQ,
  isDark
}: CompareToolsProps) {
  // Slots (max 4)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    // Fill up to 4 slots
    const list = [...initialSelectedIds];
    while (list.length < 4) {
      list.push('');
    }
    return list.slice(0, 4);
  });

  const [activeDropdownSlot, setActiveDropdownSlot] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle slot additions
  const handleSelectVendor = (vendorId: string, slotIdx: number) => {
    const updated = [...selectedIds];
    updated[slotIdx] = vendorId;
    setSelectedIds(updated);
    setActiveDropdownSlot(null);
    setSearchTerm('');
  };

  const handleRemoveVendor = (slotIdx: number) => {
    const updated = [...selectedIds];
    updated[slotIdx] = '';
    setSelectedIds(updated);
  };

  const handleClearAll = () => {
    setSelectedIds(['', '', '', '']);
  };

  // Convert array slot IDs back to actual objects
  const selectedVendors = useMemo(() => {
    return selectedIds
      .map(id => vendors.find(v => v.id === id))
      .filter((v): v is Vendor => !!v);
  }, [selectedIds, vendors]);

  // Dropdown list
  const availableVendorsForDropdown = useMemo(() => {
    return vendors.filter(v => {
      // Don't show already selected vendors
      if (selectedIds.includes(v.id)) return false;
      if (searchTerm) {
        return (
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    });
  }, [vendors, selectedIds, searchTerm]);

  // Dynamic Highlight logic for row values (Only if 2+ selected)
  const getWinnerHighlight = (metric: string, val: any, vendorId: string) => {
    if (selectedVendors.length < 2) return null;

    let criterion: 'max' | 'min' = 'max';
    if (metric === 'defectRate' || metric === 'responseTime' || metric === 'riskScore') {
      criterion = 'min';
    }

    const numericalValues = selectedVendors.map(v => {
      if (metric === 'defectRate') return v.id === 'VND-0042' ? 0.8 : v.id === 'VND-0041' ? 1.5 : (v.riskScore / 50); // mock variations
      if (metric === 'responseTime') return v.id === 'VND-0040' ? 3.5 : v.id === 'VND-0041' ? 4.9 : 5.2; // mock
      return (v as any)[metric] || 0;
    });

    const targetVal = criterion === 'max' ? Math.max(...numericalValues) : Math.min(...numericalValues);
    const currentVal = metric === 'defectRate' ? (vendorId === 'VND-0042' ? 0.8 : vendorId === 'VND-0041' ? 1.5 : (vendors.find(x => x.id === vendorId)!.riskScore / 50))
      : metric === 'responseTime' ? (vendorId === 'VND-0040' ? 3.5 : vendorId === 'VND-0041' ? 4.9 : 5.2)
      : (vendors.find(x => x.id === vendorId) as any)[metric] || 0;

    if (currentVal === targetVal) {
      return {
        bg: 'bg-green-50/50 dark:bg-green-950/20',
        text: 'text-green-800 dark:text-green-400 font-bold',
        trophy: true
      };
    }

    // worst gets slight red
    const worstVal = criterion === 'max' ? Math.min(...numericalValues) : Math.max(...numericalValues);
    if (currentVal === worstVal) {
      return {
        bg: 'bg-red-50/30 dark:bg-red-950/10Blank',
        text: 'text-red-700 dark:text-red-400',
        trophy: false
      };
    }

    return null;
  };

  // Embedded individual Recharts Radar Radar data parser
  const getRadarData = (v: Vendor) => {
    return [
      { subject: 'Quality', val: v.performanceScore },
      { subject: 'Delivery', val: Math.min(100, v.performanceScore + 4) },
      { subject: 'Pricing', val: Math.max(50, 110 - v.performanceScore) },
      { subject: 'Services', val: Math.min(100, v.performanceScore - 5) },
      { subject: 'Compliance', val: Math.max(40, 100 - v.riskScore) },
      { subject: 'Innovation', val: Math.min(100, v.performanceScore + 2) }
    ];
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4 mb-6 border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Compare metrics side-by-side</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Vendor Comparison Suite</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearAll}
            className="text-xs text-slate-500 dark:text-slate-400 font-bold hover:underline"
          >
            Clear All
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded border border-slate-250 dark:border-slate-700"
          >
            Export Spec PDF
          </button>
        </div>
      </div>

      {/* VENDOR SELECTOR SLOTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {selectedIds.map((id, slotIdx) => {
          const v = vendors.find(x => x.id === id);

          if (!v) {
            return (
              <div
                key={slotIdx}
                className="relative border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-6 min-h-[160px] flex flex-col items-center justify-center text-center hover:border-orange-500 dark:hover:border-orange-600 transition cursor-pointer"
                onClick={() => setActiveDropdownSlot(activeDropdownSlot === slotIdx ? null : slotIdx)}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                  <Plus size={18} />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Slot {slotIdx + 1}: Empty</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Click to select vendor</p>

                {/* Dropdown Menu popover */}
                {activeDropdownSlot === slotIdx && (
                  <div
                    className="absolute z-35 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl overflow-hidden text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none focus:border-orange-600 text-slate-800 dark:text-white"
                      />
                    </div>
                    
                    <div className="max-h-[220px] overflow-y-auto">
                      {availableVendorsForDropdown.map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectVendor(item.id, slotIdx)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer text-xs transition duration-100 border-b border-slate-50 dark:border-slate-750"
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase"
                            style={{ backgroundColor: item.avatarColor }}
                          >
                            {item.name.substring(0, 2)}
                          </span>
                          <div className="flex-1 truncate">
                            <h5 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h5>
                            <p className="text-[9.5px] text-slate-400 uppercase tracking-tight">{item.id} · {item.category}</p>
                          </div>
                        </div>
                      ))}
                      {availableVendorsForDropdown.length === 0 && (
                        <div className="p-4 text-center text-xs text-slate-400">No matching vendors available</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={slotIdx}
              className="relative bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm flex flex-col items-center text-center"
            >
              <button
                onClick={() => handleRemoveVendor(slotIdx)}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={12} />
              </button>

              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase mb-3 border border-white/10 shadow-inner"
                style={{ backgroundColor: v.avatarColor }}
              >
                {v.name.substring(0, 2)}
              </span>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 uppercase font-roboto">
                {v.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">{v.id}</p>

              <div className="flex gap-1.5 mt-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900 rounded">
                  {v.category}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 rounded">
                  {v.tier}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedVendors.length === 0 ? (
        /* COMPARISON EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center shadow-lg max-w-2xl mx-auto my-12 animate-fade-in">
          <GitCompare size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase font-roboto">Select Vendors to Compare</h2>
          <p className="text-13px text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto mb-6">
            Choose up to 4 registered enterprise vendors in the slots above to display side-by-side evaluations across financial, performance, risk, and compliance criteria.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleSelectVendor('VND-0040', 0)}
              className="text-xs bg-orange-600 hover:bg-orange-700 text-white rounded font-bold px-4 py-2 uppercase"
            >
              Load Demo Vendors
            </button>
          </div>
        </div>
      ) : (
        /* MATRICES GRID COMPARISON TABLE */
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden animate-fade-in">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 text-[11px] font-black uppercase text-slate-500 w-[240px]">Strategic Metric</th>
                {selectedIds.map((id, slotIdx) => {
                  const v = vendors.find(x => x.id === id);
                  return (
                    <th key={slotIdx} className="p-4 text-xs font-bold text-slate-900 dark:text-white uppercase font-roboto">
                      {v ? v.name : <span className="text-slate-300">Slot {slotIdx + 1} empty</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* SECTION: OVERVIEW */}
              <tr className="bg-slate-100 dark:bg-slate-850">
                <td colSpan={5} className="px-4 py-1.5 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                  Operational Profiles
                </td>
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Performance Rating
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  const winner = getWinnerHighlight('performanceScore', v.performanceScore, v.id);

                  return (
                    <td key={idx} className={`p-3 text-13px ${winner?.bg || ''} ${winner?.text || 'text-slate-855 dark:text-slate-250'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold font-mono text-[11px] ${
                          v.performanceScore >= 85 ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'
                        }`}>
                          {v.performanceScore}
                        </span>
                        {winner?.trophy && <Award size={14} className="text-green-500" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Risk Assessment Score
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  const winner = getWinnerHighlight('riskScore', v.riskScore, v.id); // min is best

                  return (
                    <td key={idx} className={`p-3 text-13px ${winner?.bg || ''} ${winner?.text || 'text-slate-855 dark:text-slate-250'}`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`w-2.5 h-2.5 rounded-full ${v.riskScore < 30 ? 'bg-green-500' : v.riskScore < 60 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                        {v.riskScore}/100 Risk
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Origin Country
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  return (
                    <td key={idx} className="p-3 text-13px text-slate-700 dark:text-slate-300 font-medium">
                      {v.countryFlag} {v.country}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Operational City
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  return <td key={idx} className="p-3 text-13px text-slate-500 dark:text-slate-405">{v.city}</td>;
                })}
              </tr>

              {/* SECTION: PERFORMANCE METRICS */}
              <tr className="bg-slate-100 dark:bg-slate-850">
                <td colSpan={5} className="px-4 py-1.5 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                  Quality & Service SLAs
                </td>
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  On-Time Delivery Rate
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  const score = v.performanceScore + 2; // simulated OTD
                  const winner = getWinnerHighlight('performanceScore', score, v.id);

                  return (
                    <td key={idx} className={`p-3 text-13px ${winner?.bg || ''} ${winner?.text || ''}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-green-500 h-1.5" style={{ width: `${score}%` }}></div>
                        </div>
                        <span className="font-mono text-xs">{score}%</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  SLA Defect Rate
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  const rate = v.id === 'VND-0042' ? 0.8 : v.id === 'VND-0041' ? 1.5 : (v.riskScore / 50); // lower is best
                  const winner = getWinnerHighlight('defectRate', rate, v.id);

                  return (
                    <td key={idx} className={`p-3 text-13px ${winner?.bg || ''} ${winner?.text || 'text-slate-800 dark:text-slate-200'}`}>
                      <span className="font-mono">{rate.toFixed(1)}%</span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Response Window (Avg)
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  const hrs = v.id === 'VND-0040' ? 3.5 : v.id === 'VND-0041' ? 4.9 : 5.2; // min is best
                  const winner = getWinnerHighlight('responseTime', hrs, v.id);

                  return (
                    <td key={idx} className={`p-3 text-13px ${winner?.bg || ''} ${winner?.text || 'text-slate-800 dark:text-slate-200'}`}>
                      <span className="font-mono">{hrs.toFixed(1)} hrs</span>
                    </td>
                  );
                })}
              </tr>

              {/* SECTION: FINANCIALS */}
              <tr className="bg-slate-100 dark:bg-slate-850">
                <td colSpan={5} className="px-4 py-1.5 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                  Financial Records
                </td>
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Current Contract Value
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  const winner = getWinnerHighlight('contractValue', v.contractValue, v.id);

                  return (
                    <td key={idx} className={`p-3 text-13px font-mono font-bold ${winner?.bg || ''} ${winner?.text || 'text-slate-800 dark:text-slate-100'}`}>
                      ${v.contractValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Payment Terms
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  return (
                    <td key={idx} className="p-3 text-12px">
                      <span className="px-2 py-0.5 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded font-semibold">
                        {v.country === 'Germany' ? 'Net 15' : 'Net 30'}
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10">
                  Assigned Credit Limit
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;
                  return (
                    <td key={idx} className="p-3 text-13px font-mono text-slate-705 dark:text-slate-355">
                      ${(v.creditLimit || 250000).toLocaleString('en-US')}
                    </td>
                  );
                })}
              </tr>

              {/* SECTION: STRENGTH ANALYSIS RADARS */}
              <tr className="bg-slate-100 dark:bg-slate-850">
                <td colSpan={5} className="px-4 py-1.5 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                  Operational Radar Comparison
                </td>
              </tr>
              <tr>
                <td className="p-3 text-13px font-medium text-slate-800 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-800/10 align-middle">
                  KPI Competency Map
                </td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-3"></td>;

                  const rData = getRadarData(v);
                  return (
                    <td key={idx} className="p-3 align-middle">
                      <div className="w-[180px] h-[180px] mx-auto overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={rData}>
                            <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 8 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                            <Radar
                              name={v.name}
                              dataKey="val"
                              stroke={v.avatarColor}
                              fill={v.avatarColor}
                              fillOpacity={0.25}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* ACTION LINKS ROW */}
              <tr className="bg-slate-50 dark:bg-slate-800/40">
                <td className="p-4 bg-slate-100 dark:bg-slate-800/80"></td>
                {selectedIds.map((id, idx) => {
                  const v = vendors.find(x => x.id === id);
                  if (!v) return <td key={idx} className="p-4 bg-slate-50/50 dark:bg-slate-900/30"></td>;

                  return (
                    <td key={idx} className="p-4 bg-white dark:bg-slate-900 space-y-2">
                      <button
                        onClick={() => onNavigateToDetail(v.id)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 border border-orange-600/20 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded cursor-pointer"
                      >
                        <Eye size={12} /> View Profile
                      </button>
                      <button
                        onClick={() => onOpenCreatePO(v.id)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-50 dark:hover:bg-green-950/20 rounded cursor-pointer"
                      >
                        <ShoppingCart size={12} /> Place Purchase Order
                      </button>
                      <button
                        onClick={() => onOpenCreateRFQ(v.id)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 rounded cursor-pointer"
                      >
                        <Send size={12} /> Start Sourcing
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
