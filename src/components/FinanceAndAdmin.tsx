import React, { useState, useMemo } from 'react';
import { DollarSign, Shield, Users, RefreshCw, Layers, TrendingUp, AlertCircle, Plus, Mail, CheckCircle2, ChevronRight, X, Trash2 } from 'lucide-react';
import { Vendor, SavingsInitiative, AuditLog, User } from '../dataStore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface FinanceAndAdminProps {
  vendors: Vendor[];
  savings: SavingsInitiative[];
  logs: AuditLog[];
  users: User[];
  isDark: boolean;
  onInviteUser: (u: User) => void;
  onDeleteUser: (email: string) => void;
  initialTab?: 'payments' | 'spend' | 'users' | 'savings' | 'logs';
}

export function FinanceAndAdmin({
  vendors,
  savings,
  logs,
  users,
  isDark,
  onInviteUser,
  onDeleteUser,
  initialTab
}: FinanceAndAdminProps) {
  const [tab, setTab] = useState<'payments' | 'spend' | 'users' | 'savings' | 'logs'>(initialTab || 'spend');

  React.useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  // Payments status states
  const [authorizedPayments, setAuthorizedPayments] = useState<string[]>([]);
  const [paymentVendorFilter, setPaymentVendorFilter] = useState('All');

  // Invite user Form state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newUName, setNewUName] = useState('');
  const [newUEmail, setNewUEmail] = useState('');
  const [newURole, setNewURole] = useState<'Administrator' | 'Finance Broker' | 'Auditor' | 'Sourcing Specialist'>('Sourcing Specialist');

  const paymentItems = [
    { id: "PAY-9014", vendor: "Apex Technology Partners", value: 18500, date: "2026-06-15", status: "Scheduled", costCenter: "HQ IT infrastructure" },
    { id: "PAY-9015", vendor: "Global Shipping Solutions", value: 7420, date: "2026-06-18", status: "Scheduled", costCenter: "Supply Chain Supply Logistics" },
    { id: "PAY-9016", vendor: "Vertex Consultancies Group", value: 45000, date: "2026-06-25", status: "Awaiting Auth", costCenter: "Strategic Management Legal advisory" },
    { id: "PAY-9017", vendor: "Pioneer Metal Casters", value: 32000, date: "2026-06-30", status: "Awaiting Auth", costCenter: "Operational Production Materials" }
  ];

  // Spend analytics monthly timeline (hq IT, Logistics, Consultancy)
  const spendTimeline = [
    { month: 'Jan', 'IT Services': 120, Logistics: 45, Manufacturing: 85, Consulting: 30 },
    { month: 'Feb', 'IT Services': 130, Logistics: 50, Manufacturing: 90, Consulting: 35 },
    { month: 'Mar', 'IT Services': 115, Logistics: 55, Manufacturing: 105, Consulting: 42 },
    { month: 'Apr', 'IT Services': 140, Logistics: 48, Manufacturing: 110, Consulting: 50 },
    { month: 'May', 'IT Services': 155, Logistics: 62, Manufacturing: 95, Consulting: 48 },
    { month: 'Jun', 'IT Services': 165, Logistics: 70, Manufacturing: 125, Consulting: 55 }
  ];

  // Waterfall Chart formatted savings
  const savingsChartData = useMemo(() => {
    let runningSum = 0;
    return savings.map((s, idx) => {
      const prev = runningSum;
      runningSum += s.savingAmount;
      return {
        name: s.title.split(' ')[0], // short name
        prevSum: prev,
        realized: s.savingAmount,
        target: Math.round(s.savingAmount * 1.2),
        status: s.status
      };
    });
  }, [savings]);

  const handleAuthorizePayment = (payId: string) => {
    setAuthorizedPayments([...authorizedPayments, payId]);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUName || !newUEmail) return;

    const newUse: User = {
      id: `USR-${Date.now()}`,
      name: newUName,
      email: newUEmail,
      role: newURole === 'Administrator' ? 'Admin' : newURole === 'Finance Broker' ? 'Finance Analyst' : newURole === 'Auditor' ? 'Compliance Officer' : 'Procurement Manager',
      department: 'Sourcing Operations',
      lastLogin: 'Never Logged In',
      status: 'Pending Invite',
      twoFactorEnabled: false
    };

    onInviteUser(newUse);
    setIsInviteOpen(false);
    setNewUName('');
    setNewUEmail('');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* SECTION TABS SYSTEM */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4 mb-6 border-slate-205 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Corporate Finance, Access Control & Audits</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Finance & Administration</h1>
        </div>

        <div className="flex flex-wrap border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-850 rounded p-1 shadow-sm">
          <button
            onClick={() => setTab('spend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'spend' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <TrendingUp size={13} /> Spend Analytics
          </button>
          <button
            onClick={() => setTab('payments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'payments' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <DollarSign size={13} /> Payments
          </button>
          <button
            onClick={() => setTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'users' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Users size={13} /> Team & Roles
          </button>
          <button
            onClick={() => setTab('savings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'savings' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-355'
            }`}
          >
            <Layers size={13} /> Savings Tracker
          </button>
          <button
            onClick={() => setTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase rounded ${
              tab === 'logs' ? 'bg-blue-600 text-white shadow' : 'text-slate-650 dark:text-slate-355'
            }`}
          >
            <Shield size={13} /> Security Audits
          </button>
        </div>
      </div>

      {/* RENDER SPEND ANALYTICS TAB */}
      {tab === 'spend' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Year To Date Spend', val: '$1.48M', color: 'text-blue-600' },
              { label: 'Active Cost Center Caps', val: '4 Centers Active', color: 'text-purple-600' },
              { label: 'Monthly Run Rate', val: '$245.8K', color: 'text-cyan-600' },
              { label: 'Direct PO Inflow', val: '94% Compliance', color: 'text-green-600' }
            ].map((k, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{k.label}</span>
                <p className={`text-28px font-black font-roboto ${k.color} mt-1`}>{k.val}</p>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">FY 2026 Q2 Limit Baseline</div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 font-roboto tracking-tight">Category Spend stacked timeline</h3>
            <p className="text-12px text-slate-400 mb-4">Values represented in thousands of USD ($000k)</p>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendTimeline} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorLog" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorMan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="month" stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                  <YAxis stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: '#e2e8f0' }} />
                  <Area type="monotone" dataKey="IT Services" stroke="#2563eb" fillOpacity={1} fill="url(#colorIT)" />
                  <Area type="monotone" dataKey="Logistics" stroke="#10b981" fillOpacity={1} fill="url(#colorLog)" />
                  <Area type="monotone" dataKey="Manufacturing" stroke="#d97706" fillOpacity={1} fill="url(#colorMan)" />
                  <Area type="monotone" dataKey="Consulting" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCons)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* RENDER PAYMENTS LIST TAB */}
      {tab === 'payments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-202 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">Scheduled Operational Payments</h3>
            <span className="text-xs text-slate-500 font-bold uppercase">{authorizedPayments.length} Authorizations dispatched YTD</span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Payment ID</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Supplying Vendor</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Scheduled Date</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Charge CostCenter</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Disbursed Value</th>
                <th className="p-3 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paymentItems.map(pay => {
                const isAuth = authorizedPayments.includes(pay.id);
                return (
                  <tr key={pay.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40 text-xs">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{pay.id}</td>
                    <td className="p-3 font-bold text-slate-855 dark:text-slate-205">{pay.vendor}</td>
                    <td className="p-3 text-slate-500">{pay.date}</td>
                    <td className="p-3 text-slate-450">{pay.costCenter}</td>
                    <td className="p-3 font-bold font-mono text-green-700">${pay.value.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      {isAuth ? (
                        <span className="px-2.5 py-1 bg-green-105 border border-green-200 text-green-700 rounded text-[10px] font-black uppercase">
                          Authorized ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAuthorizePayment(pay.id)}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                        >
                          Decline & Authorize Dispatch
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* RENDER TEAM & ROLES MEMBER TAB */}
      {tab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-202 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">Corporate Access Control Directory</h3>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
            >
              <Plus size={12} /> Invite Member
            </button>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-450">
                <th className="p-3">User Name</th>
                <th className="p-3">Assigned Email</th>
                <th className="p-3">Governance Role Policy</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u, uiIdx) => (
                <tr key={uiIdx} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40 font-medium">
                  <td className="p-3 font-bold text-slate-855 dark:text-slate-205">{u.name}</td>
                  <td className="p-3 font-mono">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 text-blue-705 dark:text-blue-300 rounded text-[9px] font-black uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-950/20 text-green-700 rounded text-[9px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">{u.lastLogin}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteUser(u.email)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={u.email === 'alex.mercer@corporate.com'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RENDER WATERFALL SAVINGS TRACKER TAB */}
      {tab === 'savings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Targeted Capital Savings', val: '$189,000', color: 'text-blue-600' },
              { label: 'Realized Net Cash Savings', val: '$116,000', color: 'text-green-600' },
              { label: 'Active Initiatives', val: `${savings.length} Campaigns Active`, color: 'text-purple-650' }
            ].map((k, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{k.label}</span>
                <p className={`text-28px font-black font-roboto ${k.color} mt-1`}>{k.val}</p>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sourcing Optimization metrics</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Savings tracking bar list */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1 font-roboto tracking-tight">Realized vs Target waterfall index</h3>
              <p className="text-12px text-slate-400 mb-4">Tracking optimization campaigns targets values</p>

              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#f1f5f9'} />
                    <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                    <YAxis stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: '#e2e8f0' }} />
                    <Bar dataKey="realized" fill="#10b981" name="Realized Net Cash Savings" />
                    <Bar dataKey="target" fill="#3b82f6" name="Target Optimization Goal" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Savings detail campaign profiles */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-lg shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">Savings Sourcing Campaigns</h3>
              
              <div className="space-y-3">
                {savings.map((s, idx) => (
                  <div key={idx} className="p-3 border rounded-lg bg-slate-50/50 dark:bg-slate-850/10 text-xs">
                    <h4 className="font-extrabold text-slate-855 dark:text-slate-250 mb-1">{s.title}</h4>
                    <div className="flex justify-between text-slate-500 font-bold mb-1.5 uppercase text-[10px]">
                      <span>Target: ${(s.savingAmount * 1.2).toLocaleString()}</span>
                      <span className="text-green-600">Saved: ${s.savingAmount.toLocaleString()}</span>
                    </div>
                    {/* progress block */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-green-500 h-1.5" style={{ width: `${(s.savingAmount / (s.savingAmount * 1.2)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER SECURITY AUDIT LOGS TAB */}
      {tab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-slate-202 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">Administrative Security Audit Loop</h3>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-450 uppercase text-[9.5px]">
                <th className="p-3">Reference ID</th>
                <th className="p-3">Operational Action Event</th>
                <th className="p-3">Signatory Actor</th>
                <th className="p-3">Audit Details Summary</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.slice(0, 15).map(log => (
                <tr key={log.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40 font-medium">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{log.id}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 text-purple-705 dark:text-purple-300 rounded text-[9.5px] font-black uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-800 dark:text-slate-200">{log.user}</td>
                  <td className="p-3 text-slate-505 dark:text-slate-400 font-semibold">
                    {typeof log.details === 'object' && log.details !== null ? (
                      <div className="text-[11px] font-medium space-y-0.5">
                        {Object.keys(log.details.before || {}).map((key) => (
                          <div key={key} className="flex gap-1.5 items-center flex-wrap">
                            <span className="font-bold text-slate-500 uppercase text-[9px]">{key}:</span>
                            <span className="line-through text-slate-400">{String(log.details.before[key])}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-green-600 dark:text-green-400 font-bold">{String(log.details.after[key])}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      null
                    )}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-400">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* INVITE USER DIALOG POPUP */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-805">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">Invite Team Member</h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Member Name</label>
                <input
                  type="text"
                  required
                  placeholder="Steve Rogers"
                  value={newUName}
                  onChange={e => setNewUName(e.target.value)}
                  className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-707 rounded px-2.5 py-1.5 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Assigned Email</label>
                <input
                  type="email"
                  required
                  placeholder="steve.rogers@corporate.com"
                  value={newUEmail}
                  onChange={e => setNewUEmail(e.target.value)}
                  className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-707 rounded px-2.5 py-1.5 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Governance Role Policy</label>
                <select
                  value={newURole}
                  onChange={e => setNewURole(e.target.value as any)}
                  className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-707 rounded px-2.5 py-2 outline-none focus:border-blue-600"
                >
                  <option value="Sourcing Specialist">Sourcing Specialist</option>
                  <option value="Finance Broker">Finance Broker</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] uppercase"
                >
                  Invite Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
