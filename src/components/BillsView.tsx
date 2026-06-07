import React, { useState } from 'react';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Vendor } from '../dataStore';

export interface Bill {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  dueDate: string;
  billingDate: string;
  status: 'Unpaid' | 'Paid' | 'Overdue' | 'Approved';
  description: string;
}

interface BillsViewProps {
  vendors: Vendor[];
  isDark: boolean;
}

export function BillsView({ vendors, isDark }: BillsViewProps) {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 'BIL-4001',
      invoiceNumber: 'INV-9021',
      vendorName: 'Apex Technology Partners',
      amount: 18500,
      dueDate: '2026-06-20',
      billingDate: '2026-06-01',
      status: 'Unpaid',
      description: 'Consulting services and infrastructure upgrade fee'
    },
    {
      id: 'BIL-4002',
      invoiceNumber: 'INV-9022',
      vendorName: 'Global Shipping Solutions',
      amount: 7420,
      dueDate: '2026-06-25',
      billingDate: '2026-06-02',
      status: 'Approved',
      description: 'Freight and logistic delivery fees for shipment #X-801'
    },
    {
      id: 'BIL-4003',
      invoiceNumber: 'INV-9023',
      vendorName: 'Pioneer Metal Casters',
      amount: 32000,
      dueDate: '2026-06-15',
      billingDate: '2026-06-04',
      status: 'Paid',
      description: 'Aluminium sheet covers casting run batch A'
    },
    {
      id: 'BIL-4004',
      invoiceNumber: 'INV-9024',
      vendorName: 'Vertex Consultancies Group',
      amount: 45000,
      dueDate: '2026-06-10',
      billingDate: '2026-06-05',
      status: 'Overdue',
      description: 'Strategic board governance auditing retainer fee'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');

  // Form states
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [status, setStatus] = useState<'Unpaid' | 'Paid' | 'Overdue' | 'Approved'>('Unpaid');
  const [description, setDescription] = useState('');

  const openAddForm = () => {
    setInvoiceNumber('');
    setVendorName(vendors[0]?.name || '');
    setAmount('');
    const today = new Date().toISOString().split('T')[0];
    setBillingDate(today);
    // default due date: 30 days from now
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    setDueDate(thirtyDays.toISOString().split('T')[0]);
    setStatus('Unpaid');
    setDescription('');
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber || !vendorName || !amount || !dueDate || !billingDate) return;

    const newBill: Bill = {
      id: `BIL-${4000 + bills.length + 1}`,
      invoiceNumber,
      vendorName,
      amount: parseFloat(amount) || 0,
      dueDate,
      billingDate,
      status,
      description
    };

    setBills([...bills, newBill]);
    setView('list');
  };

  const getStatusClass = (s: string) => {
    switch (s) {
      case 'Paid':
        return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Approved':
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'Unpaid':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-250 dark:border-amber-800';
      case 'Overdue':
        return 'bg-red-50 dark:bg-red-950/20 text-red-755 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const filteredBills = bills.filter((b) =>
    b.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Corporate Accounts Payable Console</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Record New Bill</h1>
          </div>
        </div>

        {/* FORM BOX */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INV-1234"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Supply Vendor *</label>
                <select
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Billing Date *</label>
                <input
                  type="date"
                  required
                  value={billingDate}
                  onChange={(e) => setBillingDate(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verification Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
                >
                  <option value="Unpaid">Unpaid (Awaiting Approval)</option>
                  <option value="Approved">Approved (Ready for Pay)</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill Description</label>
              <textarea
                placeholder="Record PO numbers description, work specifications details..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
              />
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
                Record Bill
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
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Corporate Accounts Payable Console</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Bills Ledger</h1>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-[10px] uppercase shadow-md transition-all self-start md:self-auto"
        >
          <Plus size={14} /> Add New Bill
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search bills, vendors, invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-855 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded text-xs outline-none focus:border-orange-600"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Total Liabilities: ${bills.reduce((acc, curr) => curr.status !== 'Paid' ? acc + curr.amount : acc, 0).toLocaleString('en-US')} Pending
        </div>
      </div>

      {/* BILLS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-550 dark:text-slate-350 uppercase text-[9.5px] tracking-wider">
                <th className="p-4">Bill ID</th>
                <th className="p-4">Invoice No.</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Billing Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-orange-50/10 dark:hover:bg-slate-800/30 font-medium">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{bill.id}</td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400 font-bold">{bill.invoiceNumber}</td>
                    <td className="p-4 text-slate-900 dark:text-white font-bold">{bill.vendorName}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">{bill.billingDate}</td>
                    <td className="p-4 text-slate-550 dark:text-slate-400 font-mono">{bill.dueDate}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded ${getStatusClass(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">{bill.description || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">
                    No bills match query
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
