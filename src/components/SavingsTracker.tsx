/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  PiggyBank, ArrowDown, HelpCircle, Plus, Search, Trash2, Edit, Check, Upload, X 
} from 'lucide-react';
import { SavingsInitiative, Vendor } from '../dataStore';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SavingsTrackerProps {
  vendors: Vendor[];
  savings: SavingsInitiative[];
  onAddSaving: (newSaving: Omit<SavingsInitiative, 'id'>) => void;
  dark: boolean;
}

export const SavingsTracker: React.FC<SavingsTrackerProps> = ({
  vendors,
  savings,
  onAddSaving,
  dark
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Full Year');
  const [activeTab, setActiveTab] = useState<'All' | 'Realized' | 'Projected' | 'Pipeline' | 'On Hold'>('All');
  const [searchVal, setSearchVal] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Saving Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSavingType, setNewSavingType] = useState('Negotiation');
  const [newCategory, setNewCategory] = useState('IT Services');
  const [newVendorId, setNewVendorId] = useState('');
  const [newBaseline, setNewBaseline] = useState(100000);
  const [newNegotiated, setNewNegotiated] = useState(85000);
  const [newStatus, setNewStatus] = useState<'Realized' | 'Projected' | 'Pipeline' | 'On Hold'>('Realized');
  const [newTargetDate, setNewTargetDate] = useState('2026-06-30');

  const filteredInitiatives = useMemo(() => {
    return savings.filter(s => {
      const matchTab = activeTab === 'All' || s.status === activeTab;
      const matchSearch = s.title.toLowerCase().includes(searchVal.toLowerCase()) || s.vendorName.toLowerCase().includes(searchVal.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [savings, activeTab, searchVal]);

  const totalSavings = useMemo(() => {
    return savings.filter(s => s.status === 'Realized').reduce((acc, s) => acc + s.savingAmount, 0);
  }, [savings]);

  const targetSavings = 2500000; // Annual goal
  const progressPercent = Math.min(100, Math.round((totalSavings / targetSavings) * 100));

  const waterfallData = useMemo(() => {
    return [
      { name: 'Baseline', value: 3800, fill: '#3B82F6' },
      { name: 'Consolidation', value: 3400, fill: '#10B981' },
      { name: 'Volume Disc.', value: 3100, fill: '#10B981' },
      { name: 'SLA Penalties', value: 2950, fill: '#10B981' },
      { name: 'Early Pay Disc.', value: 2750, fill: '#10B981' },
      { name: 'Automation credit', value: 2600, fill: '#10B981' },
      { name: 'Final Spend YTD', value: 2600, fill: '#475569' },
    ];
  }, []);

  const monthlySavingsChartData = useMemo(() => {
    return [
      { month: 'Jan', Actual: 140000, Target: 180000 },
      { month: 'Feb', Actual: 165000, Target: 180000 },
      { month: 'Mar', Actual: 210000, Target: 180000 },
      { month: 'Apr', Actual: 195000, Target: 200000 },
      { month: 'May', Actual: 240000, Target: 200000 },
      { month: 'Jun', Actual: 220000, Target: 200000 },
    ];
  }, []);

  const computedSavingsVal = Math.max(0, newBaseline - newNegotiated);
  const computedSavingsPercent = newBaseline > 0 ? Math.round((computedSavingsVal / newBaseline) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newVendorId) return;

    const selectedVendor = vendors.find(v => v.id === newVendorId);

    onAddSaving({
      title: newTitle,
      category: newCategory,
      vendorId: newVendorId,
      vendorName: selectedVendor?.name || 'Sovereign Solutions Ltd',
      contractRef: `CTR-${Math.floor(Math.random() * 200) + 1000}`,
      savingType: newSavingType,
      baseline: newBaseline,
      negotiated: newNegotiated,
      savingAmount: computedSavingsVal,
      savingPercent: computedSavingsPercent,
      status: newStatus,
      owner: 'Alex Mercer',
      targetDate: newTargetDate,
      verifiedBy: 'Alex Mercer'
    });

    // Reset fields
    setNewTitle('');
    setAddModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F5F7] dark:bg-[#0D1117] text-[#111827] dark:text-[#F1F5F9] overflow-y-auto transition-colors duration-200">
      
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-roboto font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <PiggyBank className="text-green-600" /> Cost Savings Procurement Tracker
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track negotiated procurement price improvements, early payment rebates, and consolidated supplier credits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-xs border border-gray-300 dark:border-gray-750 rounded px-2.5 py-1.5 focus:border-green-500"
          >
            <option value="All Period">All Time Periods</option>
            <option value="Full Year">Strategic Goal Year</option>
          </select>
          <button 
            onClick={() => setAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <Plus size={14} /> Add Initiative log
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        
        {/* KPI Row (Row 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Realized Savings YTD</span>
              <p className="text-2xl font-roboto font-black text-green-600 dark:text-green-450 mt-1">
                ${(totalSavings / 1000000).toFixed(2)}M
              </p>
            </div>
            <span className="text-[10px] text-green-500 font-bold block mt-3">↑ 23.4% vs prior baseline</span>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Annual Savings Goal</span>
              <p className="text-2xl font-roboto font-black text-gray-800 dark:text-white mt-1">
                $2.50M
              </p>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            <span className="text-[10px] text-blue-500 font-bold mt-1.5">{progressPercent}% Achieved</span>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Cost Avoidance</span>
              <p className="text-2xl font-roboto font-black text-purple-600 mt-1">$620K</p>
            </div>
            <span className="text-[10px] text-purple-500 font-bold mt-3">↑ 11% vs annualized targets</span>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Early Rebate Terms</span>
              <p className="text-2xl font-roboto font-black text-cyan-600 mt-1">$280K</p>
            </div>
            <span className="text-[9px] text-gray-400 mt-3">Sustained Net-15 incentive rate</span>
          </div>

          <div className="bg-white dark:bg-[#161B27] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">Active renegotiations</span>
              <p className="text-2xl font-roboto font-black text-amber-500 mt-1">
                {savings.filter(s => s.status === 'Pipeline').length}
              </p>
            </div>
            <span className="text-[9px] text-gray-400 mt-3">Awaiting manager validation checks</span>
          </div>

        </div>

        {/* Charts row (Composed Charts targets vs actuals) */}
        <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-850 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-roboto font-extrabold text-xs uppercase tracking-widest text-[#111827] dark:text-white">
              Sustained Month-by-Month Cost Gains vs Target
            </h3>
            <span className="text-[10px] bg-green-100 dark:bg-green-950/20 text-green-700 font-bold px-2 py-0.5 rounded">
              High Realization
            </span>
          </div>
          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlySavingsChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke={dark ? '#94A3B8' : '#6B7280'} />
                <YAxis unit="$" stroke={dark ? '#94A3B8' : '#6B7280'} fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: dark ? '#1E293B' : '#FFFFFF',
                    borderColor: dark ? '#334155' : '#E2E8F0',
                  }} 
                />
                <Legend />
                <Bar dataKey="Actual" fill="#10B981" barSize={34} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="Target" stroke="#D97706" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings initiative checklist Ledger TABLE */}
        <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-850 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1C2333] flex-wrap gap-3">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-md border border-gray-200 dark:border-gray-700">
              {(['All', 'Realized', 'Projected', 'Pipeline', 'On Hold'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${activeTab === tab ? 'bg-white dark:bg-[#111827] text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search initiative..."
                className="bg-transparent text-xs border border-gray-300 dark:border-gray-700 px-3 py-1 rounded outline-none"
              />
            </div>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/30 dark:bg-gray-850/10 border-b border-gray-200 dark:border-gray-800 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  <th className="p-4">Initiative Ref</th>
                  <th className="p-4">Supplier Partner</th>
                  <th className="p-4">Reduction Vector</th>
                  <th className="p-4 text-right">Baseline Cost</th>
                  <th className="p-4 text-right">Negotiated Cost</th>
                  <th className="p-4 text-right">Net Saved</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                {filteredInitiatives.map(ini => (
                  <tr key={ini.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1C2333]/30">
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-gray-850 dark:text-gray-200">{ini.title}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{ini.id} • {ini.category}</p>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{ini.vendorName}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 dark:text-gray-300">
                        {ini.savingType}
                      </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-500">${(ini.baselineCost ?? ini.baseline ?? 0).toLocaleString()}</td>
                    <td className="p-4 text-right font-semibold text-gray-700 dark:text-gray-200">${(ini.negotiatedCost ?? ini.negotiated ?? 0).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span className="text-green-600 font-black flex items-center justify-end gap-1">
                        <ArrowDown size={11} />
                        ${ini.savingAmount.toLocaleString()} ({ini.savingPercent}%)
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded ${
                        ini.status === 'Realized' ? 'bg-green-155 text-green-700 bg-green-50' : 
                        ini.status === 'Projected' ? 'bg-blue-50 text-blue-700' : 
                        ini.status === 'Pipeline' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ini.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-400">{ini.targetDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Add Initiative Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 dark:bg-[#1C2333] px-6 py-4 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-roboto font-extrabold text-sm uppercase tracking-wider">
                Log New Cost Savings Metric
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-sans">Reduction Initiative Title *</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AWS Multi-Region Node Consolidation plan"
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 text-xs outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Target Supplier Partner</label>
                  <select
                    value={newVendorId}
                    onChange={(e) => setNewVendorId(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 text-xs outline-none focus:border-green-500"
                  >
                    <option value="">Select Partner...</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Reduction Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs outline-none"
                  >
                    <option value="IT Services">IT Services</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Baseline Cost ($) *</label>
                  <input 
                    type="number"
                    value={newBaseline}
                    onChange={(e) => setNewBaseline(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Negotiated Cost ($) *</label>
                  <input 
                    type="number"
                    value={newNegotiated}
                    onChange={(e) => setNewNegotiated(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Dynamic computed parameters */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded flex justify-between text-xs items-center">
                <div>
                  <span className="block text-[10px] text-gray-400">Projected Instant Net Saving</span>
                  <span className="font-extrabold text-green-600 text-sm">${computedSavingsVal.toLocaleString()}</span>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black">
                  -{computedSavingsPercent}% Credit
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status Code</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs outline-none"
                  >
                    <option value="Realized">Realized</option>
                    <option value="Projected">Projected</option>
                    <option value="Pipeline">Pipeline</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Realization Target Date</label>
                  <input 
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-750 hover:bg-gray-50 rounded font-semibold text-xs text-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded shadow"
                >
                  Seal Saving Metric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
