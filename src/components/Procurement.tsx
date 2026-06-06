import React, { useState, useMemo } from 'react';
import { ShoppingCart, FileSearch, FileText, Receipt, CheckCircle, Clock, X, Plus, Play, ChevronRight, Eye, CheckCircle2, AlertTriangle, RotateCcw, Filter, User } from 'lucide-react';
import { PurchaseOrder, Contract, Invoice, Vendor } from '../dataStore';

interface ProcurementProps {
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  contracts: Contract[];
  invoices: Invoice[];
  isDark: boolean;
  onAddPO: (po: PurchaseOrder) => void;
  onUpdatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  onAddContract: (c: Contract) => void;
}

export function Procurement({
  vendors,
  purchaseOrders,
  contracts,
  invoices,
  isDark,
  onAddPO,
  onUpdatePOStatus,
  onAddContract
}: ProcurementProps) {
  const [tab, setTab] = useState<'pos' | 'rfqs' | 'contracts' | 'invoices'>('pos');

  // Interactive Subtab lists
  const [poFilter, setPoFilter] = useState<string>('All');
  const [contractFilter, setContractFilter] = useState<string>('All');
  const [invoiceFilter, setInvoiceFilter] = useState<string>('All');

  // Detail Popups
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Modals & Creation forms
  const [isPoCreateOpen, setIsPoCreateOpen] = useState(false);
  const [isContractCreateOpen, setIsContractCreateOpen] = useState(false);

  // Forms states
  const [poTitle, setPoTitle] = useState('');
  const [poVendorId, setPoVendorId] = useState('');
  const [poReqBy, setPoReqBy] = useState('2026-07-15');
  const [poTerms, setPoTerms] = useState('Net 30');
  const [poNotes, setPoNotes] = useState('');
  const [poItems, setPoItems] = useState<Array<{ code: string; desc: string; qty: number; price: number }>>([
    { code: 'ITM-9021', desc: 'Enterprise Server Node Upgrade', qty: 2, price: 1250 }
  ]);

  // Contract form states
  const [cTitle, setCTitle] = useState('');
  const [cType, setCType] = useState<Contract['type']>('Procurement');
  const [cVendorId, setCVendorId] = useState('');
  const [cVal, setCVal] = useState(150000);
  const [cStart, setCStart] = useState('2026-06-06');
  const [cEnd, setCEnd] = useState('2028-06-06');
  const [cAutoRenew, setCAutoRenew] = useState(true);

  // Bid comparison RFQ mock data (Page 6)
  const [rfqSearch, setRfqSearch] = useState('');
  const [showRfqBidModal, setShowRfqBidModal] = useState(false);
  const [selectedRfqBid, setSelectedRfqBid] = useState<any>(null);

  const mockRfqs = [
    { id: "RFQ-2026-004", title: "Enterprise Database migration services", category: "IT Services", responses: 3, deadline: "2026-06-30", status: "Active", invited: 5 },
    { id: "RFQ-2026-005", title: "Global Logistics Sea Freight pricing", category: "Logistics", responses: 4, deadline: "2026-07-10", status: "Active", invited: 4 },
    { id: "RFQ-2026-006", title: "Special Steel casting parts RFQ", category: "Raw Materials", responses: 2, deadline: "2026-05-15", status: "Completed", invited: 6 }
  ];

  // Helper row background colors
  const statusColors = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Active':
      case 'Paid':
        return 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200';
      case 'Pending Approval':
      case 'Received':
      case 'Under Review':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200';
      case 'Draft':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350';
      case 'Cancelled':
      case 'Expired':
      case 'Terminated':
      case 'Disputed':
      case 'Overdue':
        return 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200';
      default:
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200';
    }
  };

  // PO Line Items Math
  const addPoItemRow = () => {
    setPoItems([...poItems, { code: `ITM-${9022 + poItems.length}`, desc: '', qty: 1, price: 100 }]);
  };

  const updatePoItemRow = (idx: number, field: string, val: any) => {
    const updated = [...poItems];
    (updated[idx] as any)[field] = val;
    setPoItems(updated);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poTitle || !poVendorId) return;

    const vObj = vendors.find(x => x.id === poVendorId);
    if (!vObj) return;

    const seededItems = poItems.map(it => {
      const sub = it.qty * it.price;
      const tax = sub * 0.18;
      return {
        code: it.code,
        description: it.desc,
        qty: it.qty,
        unit: 'Units',
        unitPrice: it.price,
        discount: 0,
        taxRate: 18,
        total: sub + tax
      };
    });

    const valSum = seededItems.reduce((acc, curr) => acc + curr.total, 0);

    const newPO: PurchaseOrder = {
      id: `PO-2026-${String(purchaseOrders.length + 1).padStart(4, '0')}`,
      vendorId: poVendorId,
      vendorName: vObj.name,
      category: vObj.category,
      title: poTitle,
      itemsCount: seededItems.length,
      poValue: valSum,
      createdDate: '2026-06-06',
      requiredBy: poReqBy,
      approvedBy: 'Alex Mercer',
      status: 'Pending Approval',
      paymentStatus: 'Unpaid',
      priority: 'Normal',
      deliveryAddress: 'Chicago Main warehouse, IL USA',
      paymentTerms: poTerms,
      notes: poNotes,
      items: seededItems
    };

    onAddPO(newPO);
    setIsPoCreateOpen(false);
    // clear
    setPoTitle('');
    setPoVendorId('');
    setPoItems([{ code: 'ITM-9021', desc: 'Enterprise Server Node Upgrade', qty: 2, price: 1250 }]);
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle || !cVendorId) return;

    const vObj = vendors.find(x => x.id === cVendorId);
    if (!vObj) return;

    const newC: Contract = {
      id: `CTR-${String(100 + contracts.length + 1).padStart(4, '0')}`,
      vendorId: cVendorId,
      vendorName: vObj.name,
      title: cTitle,
      type: cType,
      value: cVal,
      startDate: cStart,
      endDate: cEnd,
      daysRemaining: 730,
      status: 'Active',
      owner: 'Alex Mercer',
      autoRenew: cAutoRenew,
      paymentTerms: 'Net 30',
      noticePeriodDays: 60,
      governingLaw: 'Delaware, US',
      jurisdiction: 'Delaware court',
      specialTerms: 'Standard SLA applies.',
      milestones: [],
      documents: []
    };

    onAddContract(newC);
    setIsContractCreateOpen(false);
    // clear
    setCTitle('');
    setCVendorId('');
  };

  // RFQ Bid Recommendations Highlight Award Matrix (Page 6)
  const handleAwardRFQ = (bidName: string) => {
    alert(`Successfully awarded Sourcing contract to ${bidName}! Initial Purchase order has been created.`);
    setShowRfqBidModal(false);
  };

  const activeRfqBids = [
    { criteria: "Technical Fit/Compliance", vendorA: "Apex Tech: 94/100", vendorB: "Matrix Mfg: 82/100", vendorC: "ClearPath IT: 90/100", best: "Apex Tech" },
    { criteria: "Pricing Quote (USD)", vendorA: "$120,000", vendorB: "$110,000", vendorC: "$130,005", best: "Matrix Mfg" },
    { criteria: "Logistics / Lead Days", vendorA: "12 Days", vendorB: "18 Days", vendorC: "14 Days", best: "Apex Tech" },
    { criteria: "ESG score", vendorA: "Gold (84)", vendorB: "Silver (68)", vendorC: "Gold (79)", best: "Apex Tech" },
    { criteria: "Calculated Weight Rank", vendorA: "★ 91.2/100 Recommendation", vendorB: "80.5", vendorC: "85.4", best: "Apex Tech" }
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* SECTION BUTTON TABS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4 mb-6 border-slate-205 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Global Procurement Documents Ledger</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Procurement Ledger</h1>
        </div>

        <div className="flex flex-wrap border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-1 shadow-sm">
          <button
            onClick={() => setTab('pos')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'pos' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <ShoppingCart size={13} /> Purchase Orders
          </button>
          <button
            onClick={() => setTab('rfqs')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'rfqs' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <FileSearch size={13} /> RFQ / Sourcing
          </button>
          <button
            onClick={() => setTab('contracts')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'contracts' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <FileText size={13} /> Contracts
          </button>
          <button
            onClick={() => setTab('invoices')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'invoices' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Receipt size={13} /> Invoices
          </button>
        </div>
      </div>

      {/* RENDER PO TAB */}
      {tab === 'pos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 dark:bg-slate-800/40 gap-4">
            <div className="flex border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 rounded">
              {['All', 'Approved', 'Pending Approval', 'Cancelled'].map(f => (
                <button
                  key={f}
                  onClick={() => setPoFilter(f)}
                  className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                    poFilter === f ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setIsPoCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase bg-blue-600 hover:bg-blue-700 text-white rounded shadow cursor-pointer"
            >
              <Plus size={14} /> Create Purchase Order
            </button>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">PO Number</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Vendor</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Items Count</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Total Value</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Status</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {purchaseOrders
                .filter(po => poFilter === 'All' || po.status === poFilter)
                .slice(0, 10)
                .map(po => (
                  <tr key={po.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-xs font-mono font-bold text-slate-900 dark:text-white">{po.id}</td>
                    <td className="p-3 text-13px font-bold text-slate-805 dark:text-slate-205">{po.vendorName}</td>
                    <td className="p-3 text-xs font-mono">{po.itemsCount} items</td>
                    <td className="p-3 text-xs font-bold font-mono">${po.poValue.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 border text-[10.5px] font-black uppercase rounded ${statusColors(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedPO(po)}
                        className="px-2.5 py-1 text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 rounded cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RENDER RFQS TAB */}
      {tab === 'rfqs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 font-roboto tracking-tight">Active sourcing campaigns</h3>
            <p className="text-12px text-slate-400 mb-4">Click "Compare Responses" to display Multi-criteria Vendor scoring</p>

            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">RFQ Ref</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Sourcing Campaign Title</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Responses</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Deadline</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Status</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockRfqs.map(rfq => (
                  <tr key={rfq.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-xs font-mono font-bold text-slate-900 dark:text-white">{rfq.id}</td>
                    <td className="p-3 text-13px font-bold text-slate-800 dark:text-slate-200">{rfq.title}</td>
                    <td className="p-3 text-xs font-mono font-bold text-blue-600">{rfq.responses} Bids Received</td>
                    <td className="p-3 text-12px text-slate-500">{rfq.deadline}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold border border-blue-200/50">
                        {rfq.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedRfqBid(rfq);
                          setShowRfqBidModal(true);
                        }}
                        className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                      >
                        Compare Responses
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER CONTRACTS TAB */}
      {tab === 'contracts' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 dark:bg-slate-800/40 gap-4">
            <div className="flex border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 rounded">
              {['All', 'Active', 'Expiring Soon', 'Expired'].map(f => (
                <button
                  key={f}
                  onClick={() => setContractFilter(f)}
                  className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                    contractFilter === f ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsContractCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase bg-blue-600 hover:bg-blue-700 text-white rounded shadow cursor-pointer"
            >
              <Plus size={14} /> New Contract
            </button>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Contract ID</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Vendor</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Values</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">End Date</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Tracking Status</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {contracts
                .filter(c => contractFilter === 'All' || c.status === contractFilter)
                .slice(0, 10)
                .map(c => (
                  <tr key={c.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-xs font-mono font-bold text-slate-900 dark:text-white">{c.id}</td>
                    <td className="p-3 text-13px font-bold text-slate-800 dark:text-slate-200">{c.vendorName}</td>
                    <td className="p-3 text-xs font-mono font-bold">${c.value.toLocaleString()}</td>
                    <td className="p-3 text-12px text-slate-500">{c.endDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 border text-[10.5px] font-black uppercase rounded ${statusColors(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedContract(c)}
                        className="px-2.5 py-1 text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-800 hover:bg-slate-200 rounded dark:text-white cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RENDER INVOICES TAB */}
      {tab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-205 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 dark:bg-slate-805 gap-4">
            <div className="flex border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 rounded">
              {['All', 'Paid', 'Received', 'Disputed', 'Overdue'].map(f => (
                <button
                  key={f}
                  onClick={() => setInvoiceFilter(f)}
                  className={`px-3 py-1 text-[11px] font-bold uppercase rounded ${
                    invoiceFilter === f ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Invoice ID</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Vendor</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">PO Ref</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Total Sum</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Ledger Status</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices
                .filter(inv => invoiceFilter === 'All' || inv.status === invoiceFilter)
                .slice(0, 10)
                .map(inv => (
                  <tr key={inv.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-xs font-mono font-bold text-slate-900 dark:text-white">{inv.id}</td>
                    <td className="p-3 text-13px font-bold text-slate-800 dark:text-slate-200">{inv.vendorName}</td>
                    <td className="p-3 text-xs font-mono">{inv.poRef}</td>
                    <td className="p-3 text-xs font-mono font-bold">${inv.total.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 border text-[10.5px] font-black uppercase rounded ${statusColors(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 rounded cursor-pointer"
                      >
                        3-Way Match
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PO DETAIL POPUP & APPROVAL CHAIN STEPPER */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-805">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">PO details: {selectedPO.id}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Assigned Vendor: {selectedPO.vendorName}</p>
              </div>
              <button onClick={() => setSelectedPO(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              {/* Stepper Approval levels */}
              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-500 mb-3">Enterprise Governance Stepper</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 border border-green-200 bg-green-50/50 dark:bg-green-950/20 rounded font-bold text-green-700">
                    Requester ✓
                  </div>
                  <div className="p-2 border border-green-200 bg-green-50/50 dark:bg-green-950/20 rounded font-bold text-green-700">
                    Procurement Lead ✓
                  </div>
                  <div className={`p-2 border rounded font-bold ${
                    selectedPO.status === 'Approved' || selectedPO.status === 'Sent' || selectedPO.status === 'Received'
                      ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20 text-green-700'
                      : 'border-amber-200 bg-amber-50/50 text-amber-700'
                  }`}>
                    Finance Audit
                  </div>
                  <div className={`p-2 border rounded font-bold ${
                    selectedPO.status === 'Approved' || selectedPO.status === 'Sent' || selectedPO.status === 'Received'
                      ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20 text-green-700'
                      : 'border-slate-200 text-slate-400'
                  }`}>
                    Final Delivery
                  </div>
                </div>
              </div>

              {/* Items List spec inside detail */}
              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-500 mb-2">Item Specifications</h4>
                <div className="border border-slate-150 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-805 border-b border-slate-150 dark:border-slate-800 font-bold text-slate-700">
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5">UnitPrice</th>
                        <th className="p-2.5 text-right">Ext Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedPO.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-mono">{it.code}</td>
                          <td className="p-2.5 font-semibold text-slate-855">{it.description}</td>
                          <td className="p-2.5">{it.qty}</td>
                          <td className="p-2.5">${it.unitPrice.toLocaleString()}</td>
                          <td className="p-2.5 text-right font-bold font-mono">${it.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Approve / Reject action toggles for PO */}
              {selectedPO.status === 'Pending Approval' && (
                <div className="flex gap-4 p-4 border border-blue-10/50 bg-blue-50/10 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex-1">
                    <h5 className="text-12px font-bold text-blue-700 dark:text-blue-400 uppercase">Awaiting your approval</h5>
                    <p className="text-xs text-slate-500 mt-1">This PO exceeds self-sign limit and is routed for your manual clearance.</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        onUpdatePOStatus(selectedPO.id, 'Approved');
                        setSelectedPO({ ...selectedPO, status: 'Approved' });
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
                    >
                      Approve PO
                    </button>
                    <button
                      onClick={() => {
                        onUpdatePOStatus(selectedPO.id, 'Cancelled');
                        setSelectedPO({ ...selectedPO, status: 'Cancelled' });
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase bg-red-650 hover:bg-red-700 text-white rounded cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-205 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/10">
              <button
                onClick={() => setSelectedPO(null)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTRACTS DETAIL POPUP */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-805">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">Contract profile: {selectedContract.id}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Type: {selectedContract.type} · {selectedContract.vendorName}</p>
              </div>
              <button onClick={() => setSelectedContract(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-405 uppercase">Value benchmark</span>
                  <p className="text-13px font-bold font-mono text-slate-800">${selectedContract.value.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-405 uppercase">Auto Renew Status</span>
                  <p className="text-13px font-bold text-slate-800">{selectedContract.autoRenew ? 'Enabled ✓' : 'Disabled'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-405 uppercase">Start Date</span>
                  <p className="text-13px font-bold text-slate-800">{selectedContract.startDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-405 uppercase">Expiration Date</span>
                  <p className="text-13px font-bold text-slate-800">{selectedContract.endDate}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-805 border border-slate-150 dark:border-slate-800 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Governing SLA Terms</span>
                <p className="text-xs text-slate-600 mt-1 italic">
                  "{selectedContract.specialTerms || 'All SLA parameters map directly into core procurement limits.'}"
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-205 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/20">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THREE WAY MATCH CHECKS FOR INVOICE */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-805">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">3-Way Match Verification</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Invoice: {selectedInvoice.id} · Ref: {selectedInvoice.poRef}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto text-center">
              <p className="text-xs text-slate-500">Comparing Invoice data, Purchase Order line-items, and Goods Receipt notes (GRN).</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border border-green-200 bg-green-50/50 dark:bg-green-950/20 rounded-lg flex flex-col items-center">
                  <CheckCircle2 className="text-green-500 mb-1" size={24} />
                  <span className="text-xs font-bold text-green-700">PO Baseline</span>
                  <span className="text-[10px] uppercase text-slate-400 mt-1">Verified ✓</span>
                </div>

                <div className={`p-4 border rounded-lg flex flex-col items-center ${
                  selectedInvoice.threeWayMatch.grn ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20 text-green-700' : 'border-red-250 bg-red-50/50 text-red-700'
                }`}>
                  {selectedInvoice.threeWayMatch.grn ? <CheckCircle2 className="text-green-500 mb-1" size={24} /> : <AlertTriangle className="text-red-500 mb-1" size={24} />}
                  <span className="text-xs font-bold">Goods Receipt (GRN)</span>
                  <span className="text-[10px] uppercase text-slate-400 mt-1">{selectedInvoice.threeWayMatch.grn ? 'Verified ✓' : 'Discrepancy!'}</span>
                </div>

                <div className="p-4 border border-green-200 bg-green-50/50 dark:bg-green-950/20 rounded-lg flex flex-col items-center">
                  <CheckCircle2 className="text-green-500 mb-1" size={24} />
                  <span className="text-xs font-bold">Invoice Sum</span>
                  <span className="text-[10px] uppercase text-slate-400 mt-1">Verified ✓</span>
                </div>
              </div>

              {!selectedInvoice.threeWayMatch.grn ? (
                <div className="p-4 border border-red-250/50 bg-red-55/10 dark:bg-red-950/20 rounded-lg text-left space-y-1">
                  <h4 className="text-xs font-bold text-red-700 flex items-center gap-1">
                    <AlertTriangle size={14} /> Matching Discrepancy Found!
                  </h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    The Supplier billed amount does not match verified warehouse receipt registries. Auto payment routing has been suspended.
                  </p>
                </div>
              ) : (
                <div className="p-4 border border-green-250/50 bg-green-55/10 dark:bg-green-950/20 rounded-lg text-left space-y-1">
                  <h4 className="text-xs font-bold text-green-700 flex items-center gap-1">
                    <CheckCircle2 size={14} /> 3-Way Match Successful
                  </h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    This document matches PO lines and GRN receipts exactly. Cleared for payments dispatch.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-205 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/10">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
              >
                Close Match Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT RFQ RESPONSE BID MATRIX MODAL (Page 6) */}
      {showRfqBidModal && selectedRfqBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-805">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">Bid Sourcing Response Matrix</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{selectedRfqBid.title}</p>
              </div>
              <button onClick={() => setShowRfqBidModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <p className="text-xs text-slate-500">Evaluated on weights: 40% Pricing, 30% Compliance, 30% Delivery timelines.</p>
              
              <div className="border border-slate-150 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-805 border-b border-slate-150 dark:border-slate-800 font-bold text-slate-700 text-[10px] uppercase">
                      <th className="p-2.5">Evaluation Criteria</th>
                      <th className="p-2.5">Apex Tech (Tier 1)</th>
                      <th className="p-2.5">Matrix Mfg (Tier 2)</th>
                      <th className="p-2.5">ClearPath IT</th>
                      <th className="p-2.5 text-right text-blue-600">Selected Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {activeRfqBids.map((b, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold text-slate-700">{b.criteria}</td>
                        <td className="p-2.5">{b.vendorA}</td>
                        <td className="p-2.5">{b.vendorB}</td>
                        <td className="p-2.5">{b.vendorC}</td>
                        <td className="p-2.5 text-right text-green-600 font-bold">{b.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => handleAwardRFQ('Apex Tech')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-[10px] uppercase"
                >
                  Award Draft to Apex Tech (Verified Winner)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PO CREATION FORM MODAL */}
      {isPoCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-805">
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">Draft General Purchase Order</h3>
              <button onClick={() => setIsPoCreateOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">PO Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server procurement nodes Q3"
                  value={poTitle}
                  onChange={e => setPoTitle(e.target.value)}
                  className="w-full text-xs text-slate-80-0 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Related Vendor *</label>
                  <select
                    value={poVendorId}
                    onChange={e => setPoVendorId(e.target.value)}
                    required
                    className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-2 outline-none focus:border-blue-600"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Payment Terms</label>
                  <select
                    value={poTerms}
                    onChange={e => setPoTerms(e.target.value)}
                    className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-2 outline-none focus:border-blue-600"
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
              </div>

              {/* Editable items list list */}
              <div className="space-y-2 border-t pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Line Items Calculator</label>
                  <button
                    type="button"
                    onClick={addPoItemRow}
                    className="text-[10px] uppercase font-black text-blue-600 flex items-center gap-0.5 hover:underline"
                  >
                    + Add Item Row
                  </button>
                </div>

                {poItems.map((it, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Description"
                      value={it.desc}
                      onChange={e => updatePoItemRow(idx, 'desc', e.target.value)}
                      className="flex-1 text-xs text-slate-850 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={it.qty}
                      onChange={e => updatePoItemRow(idx, 'qty', Number(e.target.value))}
                      className="w-14 text-xs text-slate-850 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-center outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={it.price}
                      onChange={e => updatePoItemRow(idx, 'price', Number(e.target.value))}
                      className="w-20 text-xs text-slate-850 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-center outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Approval Comments / Note Context</label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={e => setPoNotes(e.target.value)}
                  className="w-full text-xs text-slate-850 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-705 rounded px-2.5 py-1.5 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPoCreateOpen(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] uppercase shadow"
                >
                  Submit PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTRACT CREATION FORM */}
      {isContractCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-805">
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">Register Sourcing Contract Profile</h3>
              <button onClick={() => setIsContractCreateOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Contract Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Master Services Frame Agreement SLA"
                  value={cTitle}
                  onChange={e => setCTitle(e.target.value)}
                  className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Related Vendor *</label>
                  <select
                    value={cVendorId}
                    onChange={e => setCVendorId(e.target.value)}
                    required
                    className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-700 rounded px-2.5 py-2 outline-none"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Contract Value ($) *</label>
                  <input
                    type="number"
                    value={cVal}
                    onChange={e => setCVal(Number(e.target.value))}
                    required
                    className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Start Date</label>
                  <input
                    type="date"
                    value={cStart}
                    onChange={e => setCStart(e.target.value)}
                    className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">End Date</label>
                  <input
                    type="date"
                    value={cEnd}
                    onChange={e => setCEnd(e.target.value)}
                    className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="c-auto"
                  checked={cAutoRenew}
                  onChange={e => setCAutoRenew(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="c-auto" className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                  Enable auto-renewal notice (60-day window)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsContractCreateOpen(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] uppercase"
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
