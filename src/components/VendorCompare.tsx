/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  X, Plus, Star, Award, TrendingUp, Check, ShieldAlert, FileText, ShoppingCart, 
  Search, ArrowRight, GitCompare, Building2, HelpCircle
} from 'lucide-react';
import { Vendor } from '../dataStore';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface VendorCompareProps {
  vendors: Vendor[];
  selectedVendorIds: string[];
  onAddVendorToCompare: (id: string) => void;
  onRemoveVendorFromCompare: (id: string) => void;
  onClearComparison: () => void;
  onNavigateToPage: (page: string, itemId?: string) => void;
  dark: boolean;
}

export const VendorCompare: React.FC<VendorCompareProps> = ({
  vendors,
  selectedVendorIds,
  onAddVendorToCompare,
  onRemoveVendorFromCompare,
  onClearComparison,
  onNavigateToPage,
  dark
}) => {
  const [dropdownOpenSlot, setDropdownOpenSlot] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');

  // Selected vendors up to 4
  const comparedVendors = useMemo(() => {
    return selectedVendorIds
      .map(id => vendors.find(v => v.id === id))
      .filter((v): v is Vendor => !!v)
      .slice(0, 4);
  }, [selectedVendorIds, vendors]);

  const uncomparedVendors = useMemo(() => {
    return vendors.filter(v => !selectedVendorIds.includes(v.id));
  }, [vendors, selectedVendorIds]);

  const filteredUncompared = useMemo(() => {
    if (!searchVal) return uncomparedVendors;
    return uncomparedVendors.filter(v => 
      v.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      v.id.toLowerCase().includes(searchVal.toLowerCase()) ||
      v.category.toLowerCase().includes(searchVal.toLowerCase())
    );
  }, [uncomparedVendors, searchVal]);

  // Find winner values helper
  const getWinnerInfo = (metric: keyof Vendor['performanceMetrics'] | 'totalSpend' | 'esgScore' | 'performanceScore' | 'yearsActive', numericLogic: 'high' | 'low' = 'high') => {
    if (comparedVendors.length < 2) return { bestId: '', worstId: '' };
    
    let bestVal = numericLogic === 'high' ? -Infinity : Infinity;
    let worstVal = numericLogic === 'high' ? Infinity : -Infinity;
    let bestId = '';
    let worstId = '';

    comparedVendors.forEach(v => {
      let val = 0;
      if (metric === 'totalSpend' || metric === 'esgScore' || metric === 'performanceScore') {
        const vendorVal = v[metric];
        if (typeof vendorVal === 'number') {
          val = vendorVal;
        }
      } else if (metric === 'yearsActive') {
        // Parse years active from date
        val = 2026 - parseInt(v.onboardedDate.split('-')[0]) || 4;
      } else {
        const metrics = (v as any).performanceMetrics;
        if (metrics && typeof metrics[metric] === 'number') {
          val = metrics[metric];
        }
      }

      if (numericLogic === 'high') {
        if (val > bestVal) { bestVal = val; bestId = v.id; }
        if (val < worstVal) { worstVal = val; worstId = v.id; }
      } else {
        if (val < bestVal) { bestVal = val; bestId = v.id; }
        if (val > worstVal) { worstVal = val; worstId = v.id; }
      }
    });

    return { bestId, worstId };
  };

  const winnersMap = useMemo(() => {
    return {
      performanceScore: getWinnerInfo('performanceScore'),
      onTimeDelivery: getWinnerInfo('onTimeDelivery' as any),
      defectRate: getWinnerInfo('defectRate' as any, 'low'),
      responseTime: getWinnerInfo('responseTime' as any, 'low'),
      invoiceAccuracy: getWinnerInfo('invoiceAccuracy' as any),
      priceVariance: getWinnerInfo('priceVariance' as any, 'low'),
      esgScore: getWinnerInfo('esgScore'),
      totalSpend: getWinnerInfo('totalSpend' as any),
      yearsActive: getWinnerInfo('yearsActive'),
    };
  }, [comparedVendors]);

  // Chart data
  const groupedBarChartData = useMemo(() => {
    return [
      { name: 'Quality', ...comparedVendors.reduce((acc, v) => ({ ...acc, [v.name]: v.performanceScore }), {}) },
      { name: 'Delivery', ...comparedVendors.reduce((acc, v) => ({ ...acc, [v.name]: Math.round((v as any).performanceMetrics?.onTimeDelivery || 90) }), {}) },
      { name: 'Accuracy', ...comparedVendors.reduce((acc, v) => ({ ...acc, [v.name]: Math.round((v as any).performanceMetrics?.invoiceAccuracy || 95) }), {}) },
      { name: 'Responsiveness', ...comparedVendors.reduce((acc, v) => ({ ...acc, [v.name]: Math.max(10, 100 - (((v as any).performanceMetrics?.responseTime || 12) * 5)) }), {}) },
      { name: 'Compliance', ...comparedVendors.reduce((acc, v) => ({ ...acc, [v.name]: v.riskScore > 0 ? Math.max(10, 100 - v.riskScore) : 80 }), {}) },
    ];
  }, [comparedVendors]);

  const VENDOR_CHART_COLORS = ['#ea580c', '#16A34A', '#7C3AED', '#0891B2'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F5F7] dark:bg-[#0D1117] text-[#111827] dark:text-[#F1F5F9] overflow-y-auto transition-colors duration-200">
      
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-roboto font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <GitCompare className="text-orange-500" /> Vendor Comparison Engine
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Analyze up to 4 registered vendors side by side across performance, risk indices, financials, and ESG ratings.
          </p>
        </div>
        
        {comparedVendors.length > 0 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={onClearComparison}
              className="text-xs text-gray-500 dark:text-gray-400 font-semibold hover:text-red-500 transition"
            >
              Clear Comparison
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded shadow"
            >
              Export Report
            </button>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6">
        
        {/* Selector Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, slotIdx) => {
            const vendor = comparedVendors[slotIdx];
            
            if (vendor) {
              return (
                <div key={vendor.id} className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm flex flex-col items-center text-center relative animate-in zoom-in-95 duration-150">
                  <button 
                    onClick={() => onRemoveVendorFromCompare(vendor.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={14} />
                  </button>
                  
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-base mb-2">
                    {vendor.name.charAt(0)}
                  </div>
                  
                  <h4 className="font-bold text-sm tracking-tight text-gray-900 dark:text-white truncate max-w-[180px]">
                    {vendor.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 mb-2">{vendor.category}</p>
                  
                  <div className="flex gap-1.5 mt-1.5">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {vendor.id}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      vendor.tier === 'Tier 1' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700' : 'bg-green-100 dark:bg-green-900/40 text-green-700'
                    }`}>
                      {vendor.tier}
                    </span>
                  </div>
                </div>
              );
            }

            const dropdownOpen = dropdownOpenSlot === slotIdx;

            return (
              <div 
                key={`empty-${slotIdx}`} 
                className="bg-gray-50/50 dark:bg-gray-900/20 border-2 border-dashed border-gray-200 dark:border-gray-800 p-6 rounded-lg text-center flex flex-col items-center justify-center min-h-[140px] relative"
              >
                <button 
                  onClick={() => setDropdownOpenSlot(dropdownOpen ? null : slotIdx)}
                  className="p-2 border border-gray-300 dark:border-gray-750 rounded-full hover:bg-gray-100 dark:hover:bg-gray-850 text-gray-400 hover:text-orange-500 transition mb-2"
                >
                  <Plus size={18} />
                </button>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500">Slot {slotIdx + 1}: Empty</span>
                <span className="text-[10px] text-gray-400 mt-1">Select vendor to slot</span>

                {/* Dropdown Popover */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-3 text-left">
                    <div className="relative mb-2">
                      <Search size={12} className="absolute left-2.5 top-2 text-gray-400" />
                      <input 
                        type="text" 
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search system registry..."
                        className="w-full bg-transparent border border-gray-200 dark:border-gray-800 pl-8 pr-2.5 py-1 text-xs outline-none focus:border-orange-500 rounded"
                        autoFocus
                      />
                    </div>
                    
                    <div className="max-h-[180px] overflow-y-auto space-y-1">
                      {filteredUncompared.length > 0 ? (
                        filteredUncompared.slice(0, 10).map(v => (
                          <div 
                            key={v.id}
                            onClick={() => {
                              onAddVendorToCompare(v.id);
                              setDropdownOpenSlot(null);
                              setSearchVal('');
                            }}
                            className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="truncate">
                              <p className="font-bold text-gray-800 dark:text-gray-200">{v.name}</p>
                              <span className="text-[10px] text-gray-400">{v.id} • {v.category}</span>
                            </div>
                            <span className="text-[9px] bg-orange-50 dark:bg-orange-900/40 text-orange-600 px-1 rounded font-bold">{v.tier}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-[10px] text-gray-400 py-3">No other vendors</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {comparedVendors.length > 0 ? (
          <div className="space-y-6">
            
            {/* Side-by-Side Comparison Grid */}
            <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden pb-4">
              
              {/* Header Titles */}
              <div className="grid grid-cols-5 border-b border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-[#1C2333] p-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                <div className="col-span-1">Comparison Metric</div>
                {comparedVendors.map((v, i) => (
                  <div key={v.id} className="col-span-1 text-center font-roboto font-extrabold text-[#111827] dark:text-white truncate">
                    {v.name}
                  </div>
                ))}
                {/* Spacers for unfilled slots */}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, idx) => (
                  <div key={`spacer-thead-${idx}`} className="col-span-1 text-center italic text-gray-300 dark:text-gray-700">Empty Lot</div>
                ))}
              </div>

              {/* SECTION: OVERVIEW */}
              <div className="bg-gray-100/50 dark:bg-gray-800/20 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-150 dark:border-gray-800">
                Overview & Background
              </div>

              {/* Rows */}
              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  Overall Score <span title="Comprehensive composite performance marker index"><HelpCircle size={10} className="opacity-50" /></span>
                </div>
                {comparedVendors.map(v => {
                  const isWinner = winnersMap.performanceScore.bestId === v.id;
                  return (
                    <div 
                      key={v.id} 
                      className={`text-center py-2 rounded ${
                        isWinner ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className={`text-base font-roboto font-black ${
                        v.performanceScore >= 80 ? 'text-green-600 dark:text-green-400' : v.performanceScore >= 60 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {v.performanceScore} / 100
                      </span>
                      {isWinner && <Award size={12} className="inline-block ml-1 text-amber-500 pb-0.5" />}
                    </div>
                  );
                })}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r1-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">Onboarding Origin</div>
                {comparedVendors.map(v => (
                  <div key={v.id} className="text-center font-semibold">{v.country}</div>
                ))}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r2-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">Total Contract Value</div>
                {comparedVendors.map(v => {
                  return (
                    <div key={v.id} className="text-center font-bold">
                      ${(v.contractValue / 1000).toFixed(0)}K
                    </div>
                  );
                })}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r3-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              {/* SECTION: PERFORMANCE */}
              <div className="bg-gray-100/50 dark:bg-gray-800/20 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-150 dark:border-gray-800">
                Key Performance Metrics
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">On-Time Delivery Rate</div>
                {comparedVendors.map(v => {
                  const val = (v as any).performanceMetrics?.onTimeDelivery || 90;
                  return (
                    <div key={v.id} className="text-center">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{val}%</span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                        <div 
                          className={`h-full ${val >= 90 ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${val}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r4-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">Defect Rate</div>
                {comparedVendors.map(v => {
                  const val = (v as any).performanceMetrics?.defectRate || 1.2;
                  return (
                    <div key={v.id} className="text-center font-bold text-gray-500">
                      {val}%
                    </div>
                  );
                })}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r5-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">Response Time</div>
                {comparedVendors.map(v => (
                  <div key={v.id} className="text-center font-semibold">
                    {(v as any).performanceMetrics?.responseTime || 12} hrs
                  </div>
                ))}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r6-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              {/* SECTION: RISK AND COMPLIANCE */}
              <div className="bg-gray-100/50 dark:bg-gray-800/20 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-150 dark:border-gray-800">
                Risk Rating & Certifications
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">Overall Risk Factor</div>
                {comparedVendors.map(v => (
                  <div key={v.id} className="text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                      v.riskScore < 35 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                      v.riskScore < 65 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'
                    }`}>
                      {v.riskScore < 35 ? 'Low' : v.riskScore < 65 ? 'Medium' : 'High'} ({v.riskScore})
                    </span>
                  </div>
                ))}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r7-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">ESG Sustainability Pillar</div>
                {comparedVendors.map(v => (
                  <div key={v.id} className="text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                      v.esgScore >= 80 ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700' :
                      v.esgScore >= 65 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 'bg-red-100 dark:bg-red-900/30 text-red-700'
                    }`}>
                      {v.esgScore >= 80 ? 'Gold Star' : v.esgScore >= 65 ? 'Silver Star' : 'Bronze Standard'} ({v.esgScore})
                    </span>
                  </div>
                ))}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r8-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

              <div className="grid grid-cols-5 border-b border-gray-100 dark:border-gray-850 p-4 text-xs items-center">
                <div className="font-medium text-gray-600 dark:text-gray-400">Action Actions</div>
                {comparedVendors.map(v => (
                  <div key={v.id} className="text-center flex justify-center gap-2">
                    <button 
                      onClick={() => onNavigateToPage('vendors', v.id)}
                      className="text-[10px] text-orange-600 hover:underline font-bold"
                    >
                      View Profile
                    </button>
                    <span className="text-gray-300 text-xs">|</span>
                    <button 
                      onClick={() => onNavigateToPage('pos')}
                      className="text-[10px] text-green-600 hover:underline font-bold"
                    >
                      Create PO
                    </button>
                  </div>
                ))}
                {Array.from({ length: 4 - comparedVendors.length }).map((_, i) => (
                  <div key={`spacer-r9-${i}`} className="text-center text-gray-300 dark:text-gray-800">-</div>
                ))}
              </div>

            </div>

            {/* Charts visualization row side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              
              <div>
                <h3 className="font-roboto font-extrabold text-[#111827] dark:text-white text-xs uppercase tracking-widest mb-4">
                  Multi-Dimensional Rating Score
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={groupedBarChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke={dark ? '#94A3B8' : '#6B7280'} fontSize={10} />
                      <YAxis domain={[0, 100]} stroke={dark ? '#94A3B8' : '#6B7280'} fontSize={10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: dark ? '#1E293B' : '#FFFFFF',
                          borderColor: dark ? '#334155' : '#E2E8F0',
                          color: dark ? '#F1F5F9' : '#111827'
                        }} 
                      />
                      <Legend verticalAlign="bottom" height={36} />
                      {comparedVendors.map((v, idx) => (
                        <Bar 
                          key={v.id} 
                          dataKey={v.name} 
                          fill={VENDOR_CHART_COLORS[idx % VENDOR_CHART_COLORS.length]} 
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="font-roboto font-extrabold text-[#111827] dark:text-white text-xs uppercase tracking-widest mb-4">
                  Strategic Matrix Comparison Overlay
                </h3>
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={groupedBarChartData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke={dark ? '#334155' : '#E5E7EB'} />
                      <PolarAngleAxis dataKey="name" stroke={dark ? '#94A3B8' : '#6B7280'} fontSize={10} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={dark ? '#94A3B8' : '#6B7280'} fontSize={10} />
                      {comparedVendors.map((v, idx) => (
                        <Radar 
                          key={v.id}
                          name={v.name}
                          dataKey={v.name}
                          stroke={VENDOR_CHART_COLORS[idx % VENDOR_CHART_COLORS.length]}
                          fill={VENDOR_CHART_COLORS[idx % VENDOR_CHART_COLORS.length]}
                          fillOpacity={0.15}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/40 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GitCompare size={32} />
            </div>
            <h2 className="font-roboto font-extrabold text-[#111827] dark:text-white text-lg tracking-tight mb-2">
              Select Vendors to Compare
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs max-w-sm mx-auto mb-6">
              Choose up to 4 vendors from the principal directory registry to trigger side-by-side strategic performance evaluations.
            </p>
            <button 
              onClick={() => onNavigateToPage('vendors')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded shadow inline-flex items-center gap-2 transition"
            >
              Go to Vendor Directory <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
