import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, AlertTriangle, HelpCircle, ArrowLeft } from 'lucide-react';
import { Vendor, PurchaseOrder } from '../dataStore';

export interface PurchaseReceipt {
  id: string;
  poId: string;
  vendorName: string;
  receivedDate: string;
  itemsReceived: string;
  status: 'Completed' | 'Partial' | 'Inspected' | 'Pending Review';
  receivedBy: string;
  notes: string;
}

interface PurchaseReceivedViewProps {
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  isDark: boolean;
}

export function PurchaseReceivedView({ vendors, purchaseOrders, isDark }: PurchaseReceivedViewProps) {
  const [receipts, setReceipts] = useState<PurchaseReceipt[]>([
    {
      id: 'RCV-3001',
      poId: 'PO-2026-0001',
      vendorName: 'Apex Technology Partners',
      receivedDate: '2026-06-01',
      itemsReceived: '2x AMD EPYC Server Processor',
      status: 'Completed',
      receivedBy: 'Alex Mercer',
      notes: 'Inspected server CPUs, clean tags, fully certified serials.'
    },
    {
      id: 'RCV-3002',
      poId: 'PO-2026-0002',
      vendorName: 'Global Shipping Solutions',
      receivedDate: '2026-06-03',
      itemsReceived: '10x Office Ergonomic Mesh Chair',
      status: 'Completed',
      receivedBy: 'Sarah Connor',
      notes: 'Delivered to HQ room 3B. No defect marks found.'
    },
    {
      id: 'RCV-3003',
      poId: 'PO-2026-0003',
      vendorName: 'Pioneer Metal Casters',
      receivedDate: '2026-06-05',
      itemsReceived: '500x Custom Die Cast Aluminium Cover',
      status: 'Inspected',
      receivedBy: 'John Doe',
      notes: 'Dimensional tolerances within limits. Quality checked.'
    },
    {
      id: 'RCV-3004',
      poId: 'PO-2026-0004',
      vendorName: 'Apex Technology Partners',
      receivedDate: '2026-06-06',
      itemsReceived: '1x Cloud Hosting Subscription - Enterprise',
      status: 'Completed',
      receivedBy: 'Alex Mercer',
      notes: 'Tenant subscription activated, user limits configured.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');

  // Form states
  const [poId, setPoId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [receivedDate, setReceivedDate] = useState('2026-06-07');
  const [itemsReceived, setItemsReceived] = useState('');
  const [status, setStatus] = useState<'Completed' | 'Partial' | 'Inspected' | 'Pending Review'>('Completed');
  const [receivedBy, setReceivedBy] = useState('Alex Mercer');
  const [notes, setNotes] = useState('');

  const openAddForm = () => {
    setPoId(purchaseOrders[0]?.id || '');
    setVendorName(purchaseOrders[0]?.vendorName || vendors[0]?.name || '');
    setReceivedDate(new Date().toISOString().split('T')[0]);
    setItemsReceived('');
    setStatus('Completed');
    setReceivedBy('Alex Mercer');
    setNotes('');
    setView('form');
  };

  const handlePoChange = (selectedPoId: string) => {
    setPoId(selectedPoId);
    const po = purchaseOrders.find((x) => x.id === selectedPoId);
    if (po) {
      setVendorName(po.vendorName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poId || !itemsReceived || !receivedBy) return;

    const newReceipt: PurchaseReceipt = {
      id: `RCV-${3000 + receipts.length + 1}`,
      poId,
      vendorName,
      receivedDate,
      itemsReceived,
      status,
      receivedBy,
      notes
    };

    setReceipts([...receipts, newReceipt]);
    setView('list');
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Completed':
        return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Inspected':
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'Partial':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-250 dark:border-amber-800';
      case 'Pending Review':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-355 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'Completed':
      case 'Inspected':
        return <CheckCircle2 size={12} className="inline mr-1" />;
      case 'Partial':
        return <AlertTriangle size={12} className="inline mr-1" />;
      default:
        return <HelpCircle size={12} className="inline mr-1" />;
    }
  };

  const filteredReceipts = receipts.filter((rc) =>
    rc.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rc.poId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rc.itemsReceived.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Delivery Logs & Warehousing Receipt</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Log Purchase Receipt</h1>
          </div>
        </div>

        {/* FORM BOX */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Purchase Order Reference *</label>
                <select
                  value={poId}
                  onChange={(e) => handlePoChange(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
                >
                  <option value="" disabled>Select PO Ref</option>
                  {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.id} - {po.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Supply Vendor</label>
                <input
                  type="text"
                  disabled
                  value={vendorName}
                  className="w-full text-sm text-slate-505 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-202 dark:border-slate-750 rounded-lg px-4 py-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Received Date *</label>
                <input
                  type="date"
                  required
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Received By *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Received Items Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2x Core CPUs, 5x SFP Modules"
                value={itemsReceived}
                onChange={(e) => setItemsReceived(e.target.value)}
                className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inspection Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
              >
                <option value="Completed">Completed (Fully Received)</option>
                <option value="Partial">Partial Delivery</option>
                <option value="Inspected">Inspected & Quality Checked</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remarks & Notes</label>
              <textarea
                placeholder="Add any discrepancy notes, seal tags details, or box condition remarks..."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                Log Receipt
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
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Delivery Logs & Warehousing Receipt</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Purchase Received</h1>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-[10px] uppercase shadow-md transition-all self-start md:self-auto"
        >
          <Plus size={14} /> Log Purchase Receipt
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search receipts, PO numbers, items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-855 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded text-xs outline-none focus:border-orange-600"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {filteredReceipts.length} Shipment Deliveries Logged
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-550 dark:text-slate-350 uppercase text-[9.5px] tracking-wider">
                <th className="p-4">Receipt ID</th>
                <th className="p-4">PO Ref</th>
                <th className="p-4">Supply Vendor</th>
                <th className="p-4">Date Received</th>
                <th className="p-4">Received Items Description</th>
                <th className="p-4">Inspection Status</th>
                <th className="p-4">Received By</th>
                <th className="p-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-orange-50/10 dark:hover:bg-slate-800/30 font-medium">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{receipt.id}</td>
                    <td className="p-4 font-mono font-bold text-orange-600 dark:text-orange-400">{receipt.poId}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{receipt.vendorName}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">{receipt.receivedDate}</td>
                    <td className="p-4 text-slate-900 dark:text-white font-bold">{receipt.itemsReceived}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 border text-[9px] font-black uppercase rounded ${getStatusBadge(receipt.status)}`}>
                        {getStatusIcon(receipt.status)}
                        {receipt.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{receipt.receivedBy}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 italic max-w-xs truncate">{receipt.notes || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">
                    No receipts match query
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
