import React, { useState } from 'react';
import { Plus, Edit, Search, Package, ArrowLeft } from 'lucide-react';
import { Vendor } from '../dataStore';

export interface Item {
  id: string;
  name: string;
  description: string;
  purchaseRate: number;
  usageUnit: string;
  company: string;
}

interface ItemsViewProps {
  vendors: Vendor[];
  isDark: boolean;
}

export function ItemsView({ vendors, isDark }: ItemsViewProps) {
  const [items, setItems] = useState<Item[]>([
    {
      id: 'ITM-1001',
      name: 'AMD EPYC Server Processor',
      description: '64-Core high-performance server CPU for rack servers',
      purchaseRate: 4500,
      usageUnit: 'pcs',
      company: 'Apex Technology Partners'
    },
    {
      id: 'ITM-1002',
      name: 'CAT-6 Ethernet Cable (1000ft)',
      description: 'High-speed gigabit copper cable spool for office network setup',
      purchaseRate: 120,
      usageUnit: 'spool',
      company: 'Apex Technology Partners'
    },
    {
      id: 'ITM-1003',
      name: 'Office Ergonomic Mesh Chair',
      description: 'High-back mesh design with adjustable lumbar support',
      purchaseRate: 250,
      usageUnit: 'pcs',
      company: 'Global Shipping Solutions'
    },
    {
      id: 'ITM-1004',
      name: 'Custom Die Cast Aluminium Cover',
      description: 'Enclosure covers fabricated for terminal boxes',
      purchaseRate: 18.5,
      usageUnit: 'pcs',
      company: 'Pioneer Metal Casters'
    },
    {
      id: 'ITM-1005',
      name: 'Cloud Hosting Subscription - Enterprise',
      description: 'Monthly dedicated instance compute and storage hosting',
      purchaseRate: 2400,
      usageUnit: 'month',
      company: 'Apex Technology Partners'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purchaseRate, setPurchaseRate] = useState('');
  const [usageUnit, setUsageUnit] = useState('pcs');
  const [company, setCompany] = useState('');

  const openAddForm = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPurchaseRate('');
    setUsageUnit('pcs');
    setCompany(vendors[0]?.name || '');
    setView('form');
  };

  const openEditForm = (item: Item) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPurchaseRate(String(item.purchaseRate));
    setUsageUnit(item.usageUnit);
    setCompany(item.company);
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchaseRate || !company) return;

    if (editingItem) {
      setItems(
        items.map((it) =>
          it.id === editingItem.id
            ? { ...it, name, description, purchaseRate: parseFloat(purchaseRate) || 0, usageUnit, company }
            : it
        )
      );
    } else {
      const newItem: Item = {
        id: `ITM-${1000 + items.length + 1}`,
        name,
        description,
        purchaseRate: parseFloat(purchaseRate) || 0,
        usageUnit,
        company
      };
      setItems([...items, newItem]);
    }
    setView('list');
  };

  const filteredItems = items.filter((it) =>
    it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    it.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    it.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'form') {
    return (
      <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        {/* FORM HEADER */}
        <div className="flex items-center gap-4 mb-8 border-b pb-4 border-slate-205 dark:border-slate-800">
          <button
            onClick={() => setView('list')}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">
              {editingItem ? 'Modifier' : 'Creation Panel'}
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">
              {editingItem ? `Edit Item: ${editingItem.id}` : 'Add New Purchasing Item'}
            </h1>
          </div>
        </div>

        {/* FORM BOX */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rack Server Chassis v2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</label>
              <textarea
                placeholder="Provide detailed specifications, product catalogs, model numbers, or storage instructions..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Purchase Rate ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 24.50"
                  value={purchaseRate}
                  onChange={(e) => setPurchaseRate(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage Unit *</label>
                <select
                  value={usageUnit}
                  onChange={(e) => setUsageUnit(e.target.value)}
                  className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
                >
                  <option value="pcs">pcs (pieces)</option>
                  <option value="spool">spool</option>
                  <option value="kg">kg (kilograms)</option>
                  <option value="liters">liters</option>
                  <option value="meters">meters</option>
                  <option value="month">month (subscription)</option>
                  <option value="hours">hours (service)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Supply Vendor *</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-sm text-slate-850 dark:text-slate-105 bg-white dark:bg-slate-850 border border-slate-202 dark:border-slate-707 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 outline-none transition cursor-pointer"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
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
                {editingItem ? 'Save Updates' : 'Add Item'}
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
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Purchasing & Material Registry</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Items Directory</h1>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-[10px] uppercase shadow-md transition-all self-start md:self-auto"
        >
          <Plus size={14} /> Add Purchasing Item
        </button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search items, vendors, specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-855 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded text-xs outline-none focus:border-orange-600"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Showing {filteredItems.length} of {items.length} Registered Items
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-550 dark:text-slate-350 uppercase text-[9.5px] tracking-wider">
                <th className="p-4 w-28">Item ID</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Purchase Rate</th>
                <th className="p-4">Usage Unit</th>
                <th className="p-4">Supply Vendor</th>
                <th className="p-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/10 dark:hover:bg-slate-800/30 font-medium">
                    <td className="p-4 font-mono font-bold text-orange-600 dark:text-orange-400">{item.id}</td>
                    <td className="p-4 text-slate-900 dark:text-white font-bold">{item.name}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">{item.description || '—'}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ${item.purchaseRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-bold uppercase text-[9px]">
                        {item.usageUnit}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">{item.company}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 rounded transition"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">
                    No items match query
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
