import React, { useState } from 'react';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Vendor } from '../dataStore';

export interface BatchPayment {
  id: string;
  batchName: string;
  paymentDate: string;
  totalAmount: number;
  paymentMethod: 'ACH' | 'Wire Transfer' | 'Credit Card';
  vendorCount: number;
  status: 'Scheduled' | 'Processing' | 'Completed' | 'Failed';
  approver: string;
}

interface BatchPaymentsViewProps {
  vendors: Vendor[];
  isDark: boolean;
}

export function BatchPaymentsView({ vendors, isDark }: BatchPaymentsViewProps) {
  const [batches, setBatches] = useState<BatchPayment[]>([
    {
      id: 'BAT-2001',
      batchName: 'Q2 Vendor Pay Run A',
      paymentDate: '2026-06-01',
      totalAmount: 120500,
      paymentMethod: 'ACH',
      vendorCount: 5,
      status: 'Completed',
      approver: 'Alex Mercer'
    },
    {
      id: 'BAT-2002',
      batchName: 'European Warehousing Wire Run',
      paymentDate: '2026-06-03',
      totalAmount: 45000,
      paymentMethod: 'Wire Transfer',
      vendorCount: 2,
      status: 'Completed',
      approver: 'Alex Mercer'
    },
    {
      id: 'BAT-2003',
      batchName: 'Weekly Logistics Retainer Batch',
      paymentDate: '2026-06-08',
      totalAmount: 7420,
      paymentMethod: 'ACH',
      vendorCount: 1,
      status: 'Scheduled',
      approver: 'Sarah Connor'
    },
    {
      id: 'BAT-2004',
      batchName: 'Emergency Hardware Procurement Card',
      paymentDate: '2026-06-06',
      totalAmount: 12500,
      paymentMethod: 'Credit Card',
      vendorCount: 3,
      status: 'Processing',
      approver: 'Alex Mercer'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');

  // Form states
  const [batchName, setBatchName] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ACH' | 'Wire Transfer' | 'Credit Card'>('ACH');
  const [vendorCount, setVendorCount] = useState('1');
  const [status, setStatus] = useState<'Scheduled' | 'Processing' | 'Completed' | 'Failed'>('Scheduled');
  const [approver, setApprover] = useState('Alex Mercer');

  const openAddForm = () => {
    setBatchName('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setTotalAmount('');
    setPaymentMethod('ACH');
    setVendorCount('1');
    setStatus('Scheduled');
    setApprover('Alex Mercer');
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName || !totalAmount || !approver) return;

    const newBatch: BatchPayment = {
      id: `BAT-${2000 + batches.length + 1}`,
      batchName,
      paymentDate,
      totalAmount: parseFloat(totalAmount) || 0,
      paymentMethod,
      vendorCount: parseInt(vendorCount, 10) || 1,
      status,
      approver
    };

    setBatches([...batches, newBatch]);
    setView('list');
  };

  const getStatusClass = (s: string) => {
    switch (s) {
      case 'Completed':
        return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Processing':
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'Scheduled':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-250 dark:border-amber-800';
      case 'Failed':
        return 'bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-700';
    }
  };

  const filteredBatches = batches.filter((b) =>
    b.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.approver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'form') {
    return (
      <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8 border-b pb-4 border-slate-205 dark:border-slate-800">
          <button
            onClick={() => setView('list')}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Corporate Bulk Disbursement Console</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Initiate Payment Run</h1>
          </div>
        </div>

        {/* FORM BOX */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment Run Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Q2 Operational Payrun #4"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Execution Date *</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approving Authority *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Run Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 75000"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
                >
                  <option value="ACH">ACH (Direct Deposit)</option>
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="Credit Card">Procurement Card (P-Card)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Number of Vendors Paid *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={vendorCount}
                  onChange={(e) => setVendorCount(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Disbursement Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Processing">Processing (Clearing House)</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-5 py-2.5 border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-bold text-xs uppercase transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs uppercase shadow-md transition"
              >
                Queue Batch Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4 mb-6 border-slate-205 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Corporate Bulk Disbursement Console</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Batch Payments</h1>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-[10px] uppercase shadow-md transition-all self-start md:self-auto"
        >
          <Plus size={14} /> Create Payment Run
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search payment runs, methods, approvers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-855 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded text-xs outline-none focus:border-orange-600"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
        <div className="text-[11px] font-bold text-[#ea580c] dark:text-[#f59e0b] uppercase tracking-wider">
          Total Batch Disbursements: ${batches.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString('en-US')} USD
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-550 dark:text-slate-350 uppercase text-[9.5px] tracking-wider">
                <th className="p-4">Batch ID</th>
                <th className="p-4">Payment Run Name</th>
                <th className="p-4">Execution Date</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-center">Vendors Paid</th>
                <th className="p-4">Run Status</th>
                <th className="p-4">Approving Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-orange-50/10 dark:hover:bg-slate-800/30 font-medium">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{batch.id}</td>
                    <td className="p-4 text-slate-900 dark:text-white font-bold">{batch.batchName}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">{batch.paymentDate}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ${batch.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase text-[9px]">
                        {batch.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-700 dark:text-slate-300 font-bold">{batch.vendorCount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded ${getStatusClass(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{batch.approver}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">
                    No batch payments match query
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
