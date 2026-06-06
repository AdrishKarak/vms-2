/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, FormEvent } from 'react';
import { 
  LayoutDashboard, Building2, UserPlus, BarChart3, Star, ShoppingCart, 
  FileSearch, FileText, Receipt, ShieldAlert, FolderLock, ClipboardList, 
  Wallet, TrendingUp, Users, Settings, Bell, Search, Moon, Sun, 
  Plus, X, Clock, ArrowUpRight, ArrowDownRight, Calendar as LucideCalendar, 
  PiggyBank, Leaf, ChevronLeft, ChevronRight, Minimize2, Check, 
  AlertTriangle, Eye, Edit2, Trash2, Info, RefreshCw, Send, 
  CheckSquare, Download, Filter, Columns, GripVertical, HelpCircle, 
  FileCheck, DollarSign, Award, Grid, List, GitCompare, Sparkles
} from 'lucide-react';

import { 
  generateInitialMockData, generateSeedData, Vendor, PurchaseOrder, Contract, Invoice, 
  RiskAssessment, ESGScorecard as ESGScorecardType, CalendarEvent, 
  SavingsInitiative, AuditLog, User, ComplianceDoc 
} from './dataStore';

// Subcomponents
import { CalendarView } from './components/CalendarView';
import { VendorCompare } from './components/VendorCompare';
import { ESGScorecard } from './components/ESGScorecard';
import { SavingsTracker } from './components/SavingsTracker';
import { Onboarding } from './components/Onboarding';
import { Performance } from './components/Performance';
import { Procurement } from './components/Procurement';
import { FinanceAndAdmin } from './components/FinanceAndAdmin';
import { RiskAssessmentView } from './components/RiskAssessmentView';
import { ComplianceDocsView } from './components/ComplianceDocsView';
import { AuditLogsView } from './components/AuditLogsView';

const MONTHLY_SPEND_DATA = [
  { month: 'Jul 25', Spend: 280000 },
  { month: 'Aug 25', Spend: 340000 },
  { month: 'Sep 25', Spend: 310000 },
  { month: 'Oct 25', Spend: 390000 },
  { month: 'Nov 25', Spend: 420000 },
  { month: 'Dec 25', Spend: 480000 },
  { month: 'Jan 26', Spend: 450000 },
  { month: 'Feb 26', Spend: 490000 },
  { month: 'Mar 26', Spend: 520000 },
  { month: 'Apr 26', Spend: 510000 },
  { month: 'May 26', Spend: 580000 },
  { month: 'Jun 26', Spend: 610000 }
];

const CATEGORY_SPEND_SERIES = [
  { name: 'IT Services', value: 1450000, fill: '#3B82F6' },
  { name: 'Logistics', value: 890000, fill: '#10B981' },
  { name: 'Raw Materials', value: 1250000, fill: '#F59E0B' },
  { name: 'Consulting', value: 410000, fill: '#8B5CF6' },
  { name: 'Facilities', value: 240000, fill: '#14B8A6' }
];

const DASHBOARD_RADAR_DATA = [
  { subject: 'ESG Score', A: 78, B: 85, fullMark: 100 },
  { subject: 'Delivery Rate', A: 92, B: 88, fullMark: 100 },
  { subject: 'Risk Index', A: 45, B: 35, fullMark: 100 },
  { subject: 'Invoice Accuracy', A: 85, B: 90, fullMark: 100 },
  { subject: 'Cost Savings', A: 70, B: 82, fullMark: 100 },
  { subject: 'Quality SLA', A: 90, B: 84, fullMark: 100 },
];

import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

function CountUp({ end, duration = 1500, prefix = '', suffix = '', decimals = 0 }: { end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const startValue = 0;

    let frameId: number;

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      
      const currentValue = startValue + easeProgress * (end - startValue);
      setCount(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    frameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  return <span>{prefix}{count.toFixed(decimals)}{suffix}</span>;
}

export default function App() {
  // Master state synchronized across views
  const [db, setDb] = useState(() => generateInitialMockData());
  const [activePage, setActivePage] = useState<'dashboard' | 'vendors' | 'onboarding' | 'performance' | 'pos' | 'rfq' | 'contracts' | 'invoices' | 'risk' | 'compliance' | 'payments' | 'analytics' | 'users' | 'settings' | 'compare' | 'savings' | 'calendar' | 'esg' | 'audit'>('dashboard');
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('vms_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Notification Drawer state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'All' | 'Alerts' | 'Approvals'>('All');

  // Cmd+K Spotlight Search state
  const [cmdKOpen, setCmdKOpen] = useState(false);
  const [cmdKSearch, setCmdKSearch] = useState('');
  const [cmdKIndex, setCmdKIndex] = useState(0);

  // Global search top bar state
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalResults, setShowGlobalResults] = useState(false);

  // Vendor detail drill down state
  const [activeVendorId, setActiveVendorId] = useState<string | null>(null);
  const [activeVendorTab, setActiveVendorTab] = useState<'Overview' | 'Performance' | 'Contracts' | 'POs' | 'Invoices' | 'Risk' | 'Documents'>('Overview');

  // Directory visual filters state
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('All');
  const [vendorStatusFilter, setVendorStatusFilter] = useState('All');
  const [vendorTierFilter, setVendorTierFilter] = useState('All');
  const [colVisibility, setColVisibility] = useState({
    id: true, name: true, category: true, tier: true, country: true, status: true, risk: true, spend: true, perf: true
  });
  const [showColMenu, setShowColMenu] = useState(false);

  // Modals status
  const [onboardFormOpen, setOnboardFormOpen] = useState(false);
  const [poFormOpen, setPOFormOpen] = useState(false);
  const [rfqFormOpen, setRfqFormOpen] = useState(false);
  const [contractFormOpen, setContractFormOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [riskAssessmentOpen, setRiskAssessmentOpen] = useState(false);
  const [assessVendorIdState, setAssessVendorIdState] = useState('');
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);

  // Onboarding Stage Form Multi-step State
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardSuccessState, setOnboardSuccessState] = useState(false);
  const [onboardCompany, setOnboardCompany] = useState('');
  const [onboardCategory, setOnboardCategory] = useState<Vendor['category']>('IT Services');
  const [onboardTier, setOnboardTier] = useState<'Tier 1' | 'Tier 2' | 'Tier 3'>('Tier 2');
  const [onboardCountry, setOnboardCountry] = useState('United States');
  const [onboardCity, setOnboardCity] = useState('');
  const [onboardEmail, setOnboardEmail] = useState('');
  const [onboardTerms, setOnboardTerms] = useState('Net 30');
  const [onboardCredit, setOnboardCredit] = useState(100000);

  // PO Multi Line Form editable items
  const [newPoVendorId, setNewPoVendorId] = useState('');
  const [newPoItems, setNewPoItems] = useState<{ code: string; desc: string; qty: number; price: number }[]>([
    { code: 'PRD-102', desc: 'Hardware Server Consolidation components', qty: 2, price: 1400 }
  ]);

  // Toast indicators state
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  // Auto-effects
  useEffect(() => {
    localStorage.setItem('vms_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Key Event triggers for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdKOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCmdKOpen(false);
        setShowGlobalResults(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // State handlers to bubble up
  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = {
      ...event,
      id: `EV-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      calendarEvents: [newEv, ...prev.calendarEvents],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.42',
        module: 'Calendar',
        action: 'Create',
        entityId: newEv.id,
        description: `Created new calendar event notice of type ${event.type}.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));
    addToast('Calendar event created successfully', 'success');
  };

  const handleUpdateVendorESG = (vendorId: string, updatedScorecard: ESGScorecardType) => {
    setDb(prev => {
      const updatedVendors = prev.vendors.map(v => {
        if (v.id === vendorId) {
          return {
            ...v,
            esgScore: updatedScorecard.overallScore,
            esgDetails: {
              environmental: updatedScorecard.eScore,
              social: updatedScorecard.sScore,
              governance: updatedScorecard.gScore
            }
          };
        }
        return v;
      });
      
      const updatedScorecards = prev.esgScorecards.map(sc => {
        if (sc.vendorId === vendorId) {
          return updatedScorecard;
        }
        return sc;
      });
      
      if (!updatedScorecards.some(sc => sc.vendorId === vendorId)) {
        updatedScorecards.push(updatedScorecard);
      }
      
      return {
        ...prev,
        vendors: updatedVendors,
        esgScorecards: updatedScorecards,
        auditLogs: [{
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Alex Mercer',
          role: 'Procurement Manager',
          ipAddress: '192.168.1.18',
          module: 'Risk',
          action: 'Update',
          entityId: vendorId,
          description: `Logged upgraded ESG scorecard parameters for ${updatedScorecard.vendorName}.`,
          status: 'Success'
        }, ...prev.auditLogs]
      };
    });
    addToast(`Upgraded ESG compliance ratings successfully`, 'success');
  };

  const handleAddSaving = (newSaving: Omit<SavingsInitiative, 'id'>) => {
    const s: SavingsInitiative = {
      ...newSaving,
      baselineCost: newSaving.baselineCost ?? newSaving.baseline ?? 0,
      negotiatedCost: newSaving.negotiatedCost ?? newSaving.negotiated ?? 0,
      baseline: newSaving.baseline ?? newSaving.baselineCost,
      negotiated: newSaving.negotiated ?? newSaving.negotiatedCost,
      id: `SAV-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      savings: [s, ...prev.savings],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.144',
        module: 'Finance',
        action: 'Create',
        entityId: s.id,
        description: `Logged a savings credit initiative optimized at ${newSaving.savingPercent}% reduction.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));
    addToast('Negotiated procurement savings logged', 'success');
  };

  // Onboarding Complete Handle
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardCompany || !onboardEmail) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    const newVnd: Vendor = {
      id: `VND-0${db.vendors.length + 1}`,
      name: onboardCompany,
      category: onboardCategory,
      tier: onboardTier,
      countryCode: 'US',
      country: onboardCountry,
      countryFlag: '🇺🇸',
      city: onboardCity || 'San Francisco',
      address: '22 Century Circle',
      website: 'https://conglomerate.net',
      phone: '+1 415-555-1212',
      email: onboardEmail,
      taxId: `US${Math.floor(Math.random() * 90000000) + 10000000}`,
      status: 'Under Review',
      registeredDate: new Date().toISOString().split('T')[0],
      contractValue: 120000,
      description: 'Newly registered vendor in the pipeline awaiting risk audit and certifications collection.',
      avatarColor: '#2563EB',
      bankName: 'JPMorgan Chase',
      branchName: 'HQ Transfer',
      accountHolder: onboardCompany,
      accountNumber: 'XXXX3954',
      routingNumber: '021000021',
      iban: 'US71JPMC3954',
      swift: 'JPMCID44',
      currency: 'USD',
      creditLimit: onboardCredit,
      accountsPayableContact: {
        name: 'Finance Department',
        email: 'billing@conglomerate.net',
        phone: '+1 415-555-1212'
      },
      riskScore: 42,
      riskDetails: { financial: 38, operational: 48, compliance: 30, cyber: 44, geopolitical: 50 },
      esgScore: 68,
      esgDetails: { environmental: 65, social: 70, governance: 70 },
      performanceScore: 80,
      performanceHistory: [{ month: 'Jun 26', score: 80 }],
      performanceMetrics: { onTimeDelivery: 90, defectRate: 1.5, responseTime: 5, invoiceAccuracy: 95, priceVariance: 0 },
      totalSpend: 0,
      activeContracts: 0,
      posCount: 0,
      invoiceCount: 0,
      onboardedDate: new Date().toISOString().split('T')[0],
      onboardedBy: 'Alex Mercer',
      primaryContact: { firstName: 'Robert', lastName: 'Chen', jobTitle: 'Sales Lead', email: onboardEmail, phone: '+1-415-555-1212', department: 'Enterprise Accounts' },
      paymentTerms: onboardTerms,
      bankInfo: { bankName: 'JPMorgan Chase', branchName: 'HQ transfer', accountHolder: onboardCompany, accountNumber: 'XXXX3954', routingNumber: '021000021', iban: 'US71JPMC3954', swift: 'JPMCID44', currency: 'USD' }
    };

    setDb(prev => ({
      ...prev,
      vendors: [newVnd, ...prev.vendors],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.1',
        module: 'Vendors',
        action: 'Create',
        entityId: newVnd.id,
        description: `Successfully onboarded new vendor conglomerate: ${newVnd.name}.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));

    setOnboardSuccessState(true);
    addToast('Onboarding application filed successfully!', 'success');
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoVendorId) return;

    const vndObj = db.vendors.find(v => v.id === newPoVendorId);
    let totalMultiplier = 0;
    const mappedItems = newPoItems.map((itm, idx) => {
      const itmTotal = itm.qty * itm.price;
      totalMultiplier += itmTotal;
      return {
        id: `itm-${idx}`,
        code: itm.code,
        description: itm.desc,
        qty: itm.qty,
        unit: 'Units',
        unitPrice: itm.price,
        discount: 0,
        taxRate: 8,
        total: Math.round(itmTotal * 1.08)
      };
    });

    const newPO: PurchaseOrder = {
      id: `PO-2024-0${db.pos.length + 1}`,
      vendorId: newPoVendorId,
      vendorName: vndObj?.name || 'Sovereign Partners',
      category: vndObj?.category || 'IT Services',
      title: `Procurement for ${vndObj?.category || "IT Supplies"}`,
      itemsCount: newPoItems.length,
      poValue: Math.round(totalMultiplier * 1.08),
      createdDate: new Date().toISOString().split('T')[0],
      requiredBy: '2026-06-30',
      approvedBy: 'Alex Mercer',
      status: 'Pending Approval',
      paymentStatus: 'Unpaid',
      priority: 'Normal',
      deliveryAddress: vndObj?.address || 'Main Logistics Warehouse',
      paymentTerms: vndObj?.primaryContact?.email || 'Net 30',
      notes: 'Generated via onboarding procurement engine request.',
      items: mappedItems
    };

    setDb(prev => ({
      ...prev,
      pos: [newPO, ...prev.pos],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.2',
        module: 'POs',
        action: 'Create',
        entityId: newPO.id,
        description: `Drafted PO ${newPO.id} with overall negotiated credit values.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));

    setPOFormOpen(false);
    addToast(`Purchase Order ${newPO.id} filed for approval chain`, 'success');
  };

  const handleApprovePO = (poId: string) => {
    setDb(prev => {
      const updated = prev.pos.map(po => {
        if (po.id === poId) return { ...po, status: 'Approved' as const };
        return po;
      });
      return {
        ...prev,
        pos: updated,
        auditLogs: [{
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Alex Mercer',
          role: 'Procurement Manager',
          ipAddress: '192.168.1.42',
          module: 'POs',
          action: 'Approve',
          entityId: poId,
          description: `Authorized payment threshold on ${poId}.`,
          status: 'Success'
        }, ...prev.auditLogs]
      };
    });
    addToast(`Purchase Order approved and released`, 'success');
  };

  const handleDisputeInvoice = (invId: string) => {
    setDb(prev => {
      const updated = prev.invoices.map(inv => {
        if (inv.id === invId) return { ...inv, status: 'Disputed' as const };
        return inv;
      });
      return {
        ...prev,
        invoices: updated
      };
    });
    addToast(`Resolved dispute raised for Invoice ${invId}`, 'info');
  };

  const handleAddVendor = (v: Vendor) => {
    setDb(prev => ({
      ...prev,
      vendors: [v, ...prev.vendors],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.1',
        module: 'Vendors',
        action: 'Create',
        entityId: v.id,
        description: `Successfully onboarded new vendor: ${v.name}.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));
    addToast(`Onboarded vendor ${v.name}`, 'success');
  };

  const handleAddPOObj = (po: PurchaseOrder) => {
    setDb(prev => ({
      ...prev,
      pos: [po, ...prev.pos],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.2',
        module: 'POs',
        action: 'Create',
        entityId: po.id,
        description: `Drafted PO ${po.id} with value $${po.poValue.toLocaleString()}.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));
    addToast(`Purchase Order ${po.id} created`, 'success');
  };

  const handleUpdatePOStatus = (id: string, status: PurchaseOrder['status']) => {
    setDb(prev => {
      const updated = prev.pos.map(po => {
        if (po.id === id) return { ...po, status };
        return po;
      });
      return {
        ...prev,
        pos: updated,
        auditLogs: [{
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Alex Mercer',
          role: 'Procurement Manager',
          ipAddress: '192.168.1.42',
          module: 'POs',
          action: status === 'Approved' ? 'Approve' : 'Update',
          entityId: id,
          description: `Updated status of PO ${id} to ${status}.`,
          status: 'Success'
        }, ...prev.auditLogs]
      };
    });
    addToast(`Purchase Order ${id} status updated to ${status}`, 'success');
  };

  const handleAddContract = (c: Contract) => {
    setDb(prev => ({
      ...prev,
      contracts: [c, ...prev.contracts],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.3',
        module: 'Contracts',
        action: 'Create',
        entityId: c.id,
        description: `Created new contract ${c.id} for ${c.vendorName} worth $${c.value.toLocaleString()}.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));
    addToast(`Contract ${c.id} added successfully`, 'success');
  };

  const handleInviteUser = (u: User) => {
    setDb(prev => ({
      ...prev,
      users: [u, ...prev.users],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.4',
        module: 'Users',
        action: 'Create',
        entityId: u.id,
        description: `Invited user ${u.name} (${u.email}) as ${u.role}.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));
    addToast(`Invited user ${u.name} successfully`, 'success');
  };

  const handleDeleteUser = (email: string) => {
    setDb(prev => {
      const targetUser = prev.users.find(u => u.email === email);
      return {
        ...prev,
        users: prev.users.filter(u => u.email !== email),
        auditLogs: [{
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Alex Mercer',
          role: 'Procurement Manager',
          ipAddress: '192.168.1.4',
          module: 'Users',
          action: 'Delete',
          entityId: targetUser?.id || email,
          description: `Deleted/revoked access for user ${targetUser?.name || email}.`,
          status: 'Success'
        }, ...prev.auditLogs]
      };
    });
    addToast(`Deleted user account`, 'info');
  };

  const handleAddRiskAssessment = (ra: RiskAssessment) => {
    setDb(prev => {
      const updatedVendors = prev.vendors.map(v => {
        if (v.id === ra.vendorId) {
          return {
            ...v,
            riskScore: ra.overallScore,
            riskDetails: {
              financial: Math.round(ra.overallScore * 0.9),
              operational: Math.round(ra.overallScore * 0.8),
              compliance: Math.round(ra.overallScore * 0.75),
              cyber: Math.round(ra.overallScore * 1.1),
              geopolitical: Math.round(ra.overallScore * 0.7)
            }
          };
        }
        return v;
      });

      return {
        ...prev,
        vendors: updatedVendors,
        riskAssessments: [ra, ...prev.riskAssessments],
        auditLogs: [{
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Alex Mercer',
          role: 'Procurement Manager',
          ipAddress: '192.168.1.18',
          module: 'Risk',
          action: 'Create',
          entityId: ra.vendorId,
          description: `Created risk assessment audit score for vendor: ${ra.vendorName}. Overall calculated risk score: ${ra.overallScore}/100.`,
          status: 'Success'
        }, ...prev.auditLogs]
      };
    });
    addToast(`Risk assessment for ${ra.vendorName} created.`, 'success');
  };

  const handleAddComplianceDoc = (doc: ComplianceDoc) => {
    setDb(prev => ({
      ...prev,
      complianceDocs: [doc, ...prev.complianceDocs],
      auditLogs: [{
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'Alex Mercer',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.18',
        module: 'System',
        action: 'Create',
        entityId: doc.id,
        description: `Registered compliance certificate: ${doc.name} under Category: ${doc.category}.`,
        status: 'Success'
      }, ...prev.auditLogs]
    }));
  };

  const handleFlagComplianceDoc = (id: string) => {
    setDb(prev => {
      const updatedDocs = prev.complianceDocs.map(d => {
        if (d.id === id) {
          return { ...d, notes: `${d.notes ? d.notes + ' ' : ''}[FLAGGED] Document marked for audit discrepancy review.` };
        }
        return d;
      });
      return {
        ...prev,
        complianceDocs: updatedDocs,
        auditLogs: [{
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Alex Mercer',
          role: 'Procurement Manager',
          ipAddress: '192.168.1.18',
          module: 'System',
          action: 'Update',
          entityId: id,
          description: `Discrepancy flag raised on document ID ${id}. Routed to legal review queues.`,
          status: 'Success'
        }, ...prev.auditLogs]
      };
    });
  };

  const handleBulkStatusChange = (status: Vendor['status']) => {
    if (selectedVendors.length === 0) return;
    setDb(prev => {
      const updated = prev.vendors.map(v => {
        if (selectedVendors.includes(v.id)) return { ...v, status };
        return v;
      });
      return { ...prev, vendors: updated };
    });
    setSelectedVendors([]);
    addToast(`Updated status to ${status} for ${selectedVendors.length} vendors`, 'success');
  };

  // Nav actions
  const handleSpotlightExecute = (action: string, arg?: string) => {
    setCmdKOpen(false);
    if (action === 'navigate') {
      setActivePage(arg as any);
    } else if (action === 'onboard') {
      setOnboardFormOpen(true);
    } else if (action === 'po') {
      setPOFormOpen(true);
    } else if (action === 'assess') {
      setAssessVendorIdState(arg || '');
      setRiskAssessmentOpen(true);
    }
  };

  // Spotlight search mechanism
  const filteredCommandResults = useMemo(() => {
    if (!cmdKSearch) return [];
    const query = cmdKSearch.toLowerCase();
    
    const results: { type: 'Vendor' | 'PO' | 'Page'; title: string; subtitle: string; action: string; arg?: string }[] = [];
    
    // Pages matching
    const pages = [
      { t: 'Dashboard Overview', p: 'dashboard' },
      { t: 'Vendor Directory Registry', p: 'vendors' },
      { t: 'Savings Tracker Ledger', p: 'savings' },
      { t: 'ESG Compliance Scorecards', p: 'esg' },
      { t: 'Dynamic Operational Calendar', p: 'calendar' },
      { t: 'Purchase Orders Overview', p: 'pos' },
      { t: 'Risk Heatmatics Metrics', p: 'risk' }
    ];
    pages.forEach(pg => {
      if (pg.t.toLowerCase().includes(query)) {
        results.push({ type: 'Page', title: pg.t, subtitle: 'Navigate to app section', action: 'navigate', arg: pg.p });
      }
    });

    // Vendors matching
    db.vendors.forEach(v => {
      if (v.name.toLowerCase().includes(query) || v.id.toLowerCase().includes(query)) {
        results.push({ type: 'Vendor', title: v.name, subtitle: `${v.id} • ${v.category}`, action: 'navigate', arg: 'vendors' });
      }
    });

    // PO elements
    db.pos.forEach(po => {
      if (po.id.toLowerCase().includes(query) || po.vendorName.toLowerCase().includes(query)) {
        results.push({ type: 'PO', title: po.id, subtitle: `${po.vendorName} • $${po.poValue}`, action: 'navigate', arg: 'pos' });
      }
    });

    return results.slice(0, 8);
  }, [cmdKSearch, db]);

  // Sidebar list items
  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as const },
        { name: 'Calendar', icon: LucideCalendar, page: 'calendar' as const },
      ]
    },
    {
      group: 'VENDORS',
      items: [
        { name: 'Vendor Directory', icon: Building2, page: 'vendors' as const },
        { name: 'Compare Vendors', icon: GitCompare, page: 'compare' as const },
        { name: 'Onboarding Stage', icon: UserPlus, page: 'onboarding' as const },
        { name: 'Performance Score', icon: BarChart3, page: 'performance' as const },
      ]
    },
    {
      group: 'PROCUREMENT',
      items: [
        { name: 'Purchase Orders', icon: ShoppingCart, page: 'pos' as const },
        { name: 'RFQ / Sourcing', icon: FileSearch, page: 'rfq' as const },
        { name: 'Contracts Master', icon: FileText, page: 'contracts' as const },
        { name: 'Invoices Processing', icon: Receipt, page: 'invoices' as const },
      ]
    },
    {
      group: 'COMPLIANCE & RISK',
      items: [
        { name: 'Risk Assessment', icon: ShieldAlert, page: 'risk' as const },
        { name: 'Compliance Docs', icon: FolderLock, page: 'compliance' as const },
        { name: 'ESG Scorecard', icon: Leaf, page: 'esg' as const },
        { name: 'Audit Logs', icon: ClipboardList, page: 'audit' as const }
      ]
    },
    {
      group: 'FINANCE',
      items: [
        { name: 'Payments Ledger', icon: Wallet, page: 'payments' as const },
        { name: 'Spend Analytics', icon: TrendingUp, page: 'analytics' as const },
        { name: 'Savings Tracker', icon: PiggyBank, page: 'savings' as const },
      ]
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { name: 'User Management', icon: Users, page: 'users' as const },
        { name: 'System Settings', icon: Settings, page: 'settings' as const }
      ]
    }
  ];

  // Category distribution for dashboard pie chart
  const categoryDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    db.vendors.forEach(v => {
      dist[v.category] = (dist[v.category] || 0) + 1;
    });
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#EF4444', '#06B6D4', '#84CC16', '#A855F7'];
    return Object.keys(dist).map((cat, idx) => ({
      name: cat,
      value: dist[cat],
      fill: colors[idx % colors.length]
    }));
  }, [db.vendors]);

  // Heatmap Data (last 140 days) for GitHub contribution chart
  const heatmapData = useMemo(() => {
    const data: { dateStr: string; count: number; dayOfWeek: number }[] = [];
    const endDate = new Date('2026-06-06');
    
    // Group logs by date
    const logCounts: Record<string, number> = {};
    db.auditLogs.forEach(log => {
      const datePart = log.timestamp.split(' ')[0];
      logCounts[datePart] = (logCounts[datePart] || 0) + 1;
    });

    for (let i = 139; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(endDate.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      let count = logCounts[dateStr] || 0;
      
      // Seed realistic, deterministic contribution patterns for past empty dates
      if (count === 0) {
        const hash = (d.getFullYear() * 7 + d.getMonth() * 13 + d.getDate() * 31) % 100;
        if (hash > 45) { // 55% active days
          if (hash > 88) count = 8;     // High
          else if (hash > 70) count = 5; // Medium-High
          else if (hash > 55) count = 3; // Medium
          else count = 1;                // Low
        }
      }

      data.push({
        dateStr,
        count,
        dayOfWeek: d.getDay()
      });
    }
    return data;
  }, [db.auditLogs]);

  // Active vendor record memo
  const activeVendorRecord = useMemo(() => {
    return db.vendors.find(v => v.id === activeVendorId) || null;
  }, [activeVendorId, db.vendors]);

  return (
    <div className={`flex h-screen bg-[#F4F5F7] dark:bg-[#0D1117] p-6 gap-6 text-[#111827] dark:text-[#F1F5F9] font-sans overflow-hidden transition-colors duration-200`}>
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0F1729] dark:bg-[#090E1A] border-r border-[#1E293B] flex flex-col shrink-0 rounded-[8px]">
        
        {/* Sidebar Logo */}
        <div className="p-6 border-b border-[#1E293B]">
          <div className="logo-container">
            <div className="logo-sphere">
              <svg className="w-5.5 h-5.5 text-blue-600 dark:text-amber-500 logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" className="logo-layer-1" />
                <path d="M2 17l10 5 10-5" className="logo-layer-2" />
                <path d="M2 12l10 5 10-5" className="logo-layer-3" />
              </svg>
            </div>
            <div>
              <h2 className="logo-title">VendorFlow</h2>
              <p className="logo-subtitle">Enterprise Console</p>
            </div>
          </div>
        </div>

        {/* Navigation Group Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navGroups.map((gp, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <p className="text-[9px] font-black tracking-widest text-[#475569] dark:text-[#334155] uppercase px-3">
                {gp.group}
              </p>
              <ul className="space-y-0.5">
                {gp.items.map((it, iIdx) => {
                  const isActive = activePage === it.page;
                  return (
                    <li key={iIdx}>
                      <button
                        onClick={() => {
                          setActivePage(it.page);
                          setActiveVendorId(null);
                        }}
                        className={`w-full h-9 flex items-center gap-3 px-3 rounded text-xs transition duration-150 font-medium ${
                          isActive 
                            ? 'bg-blue-600 dark:bg-blue-700 text-white font-bold' 
                            : 'text-gray-300 hover:bg-[#1E293B]/60 dark:hover:bg-[#1E293B]/40 hover:text-white'
                        }`}
                      >
                        <it.icon size={15} className={isActive ? 'text-white' : 'text-slate-450'} />
                        <span className="truncate">{it.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User detail */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-extrabold text-white text-xs">
               AM
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white">Alex Mercer</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">HQ Admin Authority</p>
            </div>
          </div>
          <button 
            onClick={() => addToast('Authorized secure lockout triggered', 'info')}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-450 dark:hover:text-white transition p-1"
          >
            <X size={14} className="opacity-70 rotate-45" />
          </button>
        </div>

      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden gap-6">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-gray-250 dark:border-gray-800 bg-white dark:bg-[#111827] flex items-center justify-between px-8 shrink-0 rounded-[8px]">
          
          <div className="flex items-center gap-4">
            <h1 className="font-roboto font-extrabold text-[#111827] dark:text-white text-base uppercase tracking-wider">
              {activePage.replace('-', ' ')}
            </h1>
            <span className="text-xs text-gray-400 hidden sm:inline">|</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase hidden sm:inline">
              VMS Consolidation / Active session
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Cmd+K shortcut wrapper Search */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setCmdKOpen(true)}
                className="w-68 h-9 bg-[#F4F5F7] dark:bg-[#1C2333] border border-gray-300 dark:border-gray-750 rounded px-3 text-left text-xs text-gray-400 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Search size={13} className="text-gray-400" />
                  Quick cmd portal...
                </span>
                <span className="bg-gray-200 dark:bg-gray-800 text-[9px] font-black rounded px-1.5 py-0.5 border dark:border-gray-700">
                  ⌘K
                </span>
              </button>
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="p-2 bg-[#F4F5F7] dark:bg-[#1C2333] rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Toggle Theme Presets"
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} className="text-amber-400" />}
            </button>

            {/* Notification triggers */}
            <button 
              onClick={() => setNotifOpen(prev => !prev)}
              className="p-2 bg-[#F4F5F7] dark:bg-[#1C2333] rounded border border-gray-300 dark:border-gray-750 hover:bg-gray-200 dark:hover:bg-gray-700 relative transition"
            >
              <Bell size={15} />
              <div className="notif-dot absolute top-1 right-1"></div>
            </button>

            <span className="border-r border-gray-200 dark:border-gray-800 h-6"></span>

            {/* User profile capsule display */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold hidden lg:inline">Alex Mercer</span>
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-350 px-2 py-0.5 rounded text-[10px] font-bold">
                Manager Authority
              </span>
            </div>

          </div>

        </header>

        {/* CONTAINER CONTENT ROUTING */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          
          {/* Active Vendor Detail screen drills-down (OVERLAYS ALL PAGES ON MATCH) */}
          {activeVendorId && activeVendorRecord ? (
            <div className="flex-1 flex overflow-hidden bg-[#F4F5F7] dark:bg-[#0D1117] text-[#111827] dark:text-[#F1F5F9] animate-in slide-in-from-bottom-6 duration-200">
              
              {/* Left sidebar card of vendor */}
              <div className="w-80 bg-white dark:bg-[#161B27] border-r border-gray-200 dark:border-gray-800 p-6 overflow-y-auto flex flex-col gap-6">
                <div>
                  <button 
                    onClick={() => setActiveVendorId(null)}
                    className="text-xs text-blue-600 hover:underline font-bold mb-4 flex items-center gap-1"
                  >
                    ← Back to List
                  </button>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-700 text-xl font-bold rounded-full flex items-center justify-center mb-4 shadow">
                    {activeVendorRecord.name.charAt(0)}
                  </div>
                  <h2 className="font-roboto font-black text-lg tracking-tight leading-tight">{activeVendorRecord.name}</h2>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{activeVendorRecord.id} • {activeVendorRecord.category}</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-400">Country Origin:</span>
                    <span className="font-semibold">{activeVendorRecord.country}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-400">Onboarded Date:</span>
                    <span className="font-semibold">{activeVendorRecord.onboardedDate}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-400">Representative:</span>
                    <span className="font-semibold">{activeVendorRecord.primaryContact.firstName} {activeVendorRecord.primaryContact.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-400">Registered Email:</span>
                    <span className="font-semibold text-blue-600 block max-w-[150px] truncate" title={activeVendorRecord.email}>{activeVendorRecord.email}</span>
                  </div>
                </div>

                <div className="mt-auto space-y-2">
                  <button 
                    onClick={() => {
                      setAssessVendorIdState(activeVendorRecord.id);
                      setRiskAssessmentOpen(true);
                    }}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition shadow"
                  >
                    Quick Risk assessment
                  </button>
                </div>
              </div>

              {/* Main detailed tabs pane */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white dark:bg-[#111827] border-b border-gray-250 dark:border-gray-800 px-8 flex items-center gap-6 overflow-x-auto shrink-0">
                  {['Overview', 'Performance', 'Contracts', 'POs', 'Invoices', 'Risk', 'Documents'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveVendorTab(tab as any)}
                      className={`h-12 border-b-2 text-xs font-semibold px-2 transition ${
                        activeVendorTab === tab 
                          ? 'border-blue-600 text-blue-600 font-bold' 
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                  
                  {/* TAB: OVERVIEW */}
                  {activeVendorTab === 'Overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-[#161B27] p-5 rounded border border-gray-200 dark:border-gray-800">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold text-slate-500">Total spend metrics</span>
                          <span className="text-xl font-roboto font-black text-gray-800 dark:text-white mt-1">
                            {activeVendorRecord.totalSpend ? `$${(activeVendorRecord.totalSpend / 1000).toFixed(0)}K` : '$0K'}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-[#161B27] p-5 rounded border border-gray-200 dark:border-gray-800">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold text-slate-500">Active Contracts limit</span>
                          <span className="text-xl font-roboto font-black text-gray-800 dark:text-white mt-1">
                            {activeVendorRecord.activeContracts ?? 0} SLA Agreements
                          </span>
                        </div>
                        <div className="bg-white dark:bg-[#161B27] p-5 rounded border border-gray-200 dark:border-gray-800">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold text-slate-500">Defect metrics index</span>
                          <span className="text-xl font-roboto font-black text-[#EF4444] mt-1">
                            {activeVendorRecord.performanceMetrics?.defectRate !== undefined ? `${activeVendorRecord.performanceMetrics.defectRate}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-[#161B27] p-5 rounded border border-gray-200 dark:border-gray-800">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold text-slate-500">On-Time delivery rate</span>
                          <span className="text-xl font-roboto font-black text-[#10B981] mt-1">
                            {activeVendorRecord.performanceMetrics?.onTimeDelivery !== undefined ? `${activeVendorRecord.performanceMetrics.onTimeDelivery}%` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-200 dark:border-gray-855">
                        <h4 className="font-roboto font-extrabold text-xs uppercase tracking-widest text-[#111827] dark:text-white mb-3">Enterprise description</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                          Operating as a tier partner client within {activeVendorRecord.category} delivery groups since {activeVendorRecord.onboardedDate}. Authorized by procurement officer {activeVendorRecord.onboardedBy}, this entity undergoes monthly evaluations and periodic compliance reviews.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB: PERFORMANCE CHART */}
                  {activeVendorTab === 'Performance' && (
                    <div className="bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-roboto font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-4">
                        Historical Performance tracker
                      </h4>
                      <div className="h-68">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activeVendorRecord.performanceHistory || []}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="month" />
                            <YAxis domain={[50, 100]} />
                            <Tooltip />
                            <Area type="monotone" dataKey="score" stroke="#2563EB" fill="#EFF6FF" fillOpacity={0.4} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* TAB: CONTRACTS */}
                  {activeVendorTab === 'Contracts' && (
                    <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-100/30 dark:bg-gray-800/10 border-b border-gray-200 dark:border-gray-800 font-bold uppercase tracking-widest text-[10px]">
                            <th className="p-4">Contract ID</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Agreement Type</th>
                            <th className="p-4 text-right">Value Amount</th>
                            <th className="p-4 text-right">End Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {db.contracts.filter(c => c.vendorId === activeVendorId).map(c => (
                            <tr key={c.id}>
                              <td className="p-4 font-bold text-gray-850 dark:text-gray-200">{c.id}</td>
                              <td className="p-4">{c.title}</td>
                              <td className="p-4"><span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px]">{c.type}</span></td>
                              <td className="p-4 text-right font-semibold">${c.value.toLocaleString()}</td>
                              <td className="p-4 text-right text-gray-400">{c.endDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB: PO LIST */}
                  {activeVendorTab === 'POs' && (
                    <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-850 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-100/10 border-b border-gray-200 dark:border-gray-800 font-bold uppercase tracking-widest text-[9px]">
                            <th className="p-4">PO Code</th>
                            <th className="p-4">Creation Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Credit Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {db.pos.filter(po => po.vendorId === activeVendorId).slice(0, 8).map(po => (
                            <tr key={po.id}>
                              <td className="p-4 font-bold">{po.id}</td>
                              <td className="p-4">{po.createdDate}</td>
                              <td className="p-4">
                                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{po.status}</span>
                              </td>
                              <td className="p-4 text-right font-black">${po.poValue.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB: INVOICES MATCHING */}
                  {activeVendorTab === 'Invoices' && (
                    <div className="bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-850 overflow-hidden">
                      <div className="p-4 bg-gray-50 dark:bg-[#1C2030] font-bold text-[10px] uppercase tracking-wider">Matched Invoices Checklist</div>
                      
                      <div className="divide-y divide-gray-150 dark:divide-gray-800 text-xs">
                        {db.invoices.filter(inv => inv.vendorId === activeVendorId).slice(0, 6).map(inv => (
                          <div key={inv.id} className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-100">{inv.id}</p>
                              <span className="text-[10px] text-gray-400">PO Ref: {inv.poRef}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                              <span className="font-semibold text-gray-600">${inv.total.toLocaleString()}</span>
                              <span className="text-[10px] bg-green-50 text-green-700 font-bold px-1.5 rounded">{inv.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          ) : (
            <>
              {/* PAGE CONTENT ROUTER SWITCH */}
              {activePage === 'dashboard' && (
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  
                  {/* KPI ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Card 1 — Total Vendors */}
                    <div className="bg-neo-base shadow-neo-card hover:shadow-neo-card-hover rounded-[14px] p-[18px] relative transition-shadow duration-200">
                      <div className="absolute top-[18px] right-[20px] w-9 h-9 flex items-center justify-center bg-neo-base shadow-neo-icon-btn rounded-[8px] text-neo-accent">
                        <Building2 size={18} />
                      </div>
                      <span className="block text-[10px] font-bold text-neo-muted uppercase tracking-wider">Total Vendors</span>
                      <h3 className="text-3xl font-roboto font-extrabold text-neo-primary mt-1">
                        <CountUp end={248} />
                      </h3>
                      <p className="text-[11px] text-neo-success font-bold mt-2 flex items-center gap-1">
                        <span>↑</span> 12 this month
                      </p>
                    </div>

                    {/* Card 2 — Active Contracts */}
                    <div className="bg-neo-base shadow-neo-card hover:shadow-neo-card-hover rounded-[14px] p-[18px] relative transition-shadow duration-200">
                      <div className="absolute top-[18px] right-[20px] w-9 h-9 flex items-center justify-center bg-neo-base shadow-neo-icon-btn rounded-[8px] text-neo-accent">
                        <FileText size={18} />
                      </div>
                      <span className="block text-[10px] font-bold text-neo-muted uppercase tracking-wider">Active Contracts</span>
                      <h3 className="text-3xl font-roboto font-extrabold text-neo-primary mt-1">
                        <CountUp end={134} />
                      </h3>
                      <p className="text-[11px] text-neo-warning font-bold mt-2 flex items-center gap-1">
                        <span>↑</span> 8 renewed
                      </p>
                    </div>

                    {/* Card 3 — Pending Approvals */}
                    <div className="bg-neo-base shadow-neo-card hover:shadow-neo-card-hover rounded-[14px] p-[18px] relative transition-shadow duration-200">
                      <div className="absolute top-[18px] right-[20px] w-9 h-9 flex items-center justify-center bg-neo-base shadow-neo-icon-btn rounded-[8px] text-neo-accent">
                        <Clock size={18} />
                      </div>
                      <span className="block text-[10px] font-bold text-neo-muted uppercase tracking-wider">Pending Approvals</span>
                      <h3 className="text-3xl font-roboto font-extrabold text-neo-primary mt-1">
                        <CountUp end={27} />
                      </h3>
                      <p className="text-[11px] text-neo-danger font-bold mt-2 flex items-center gap-1">
                        <span>↓</span> 4 from last week
                      </p>
                    </div>

                    {/* Card 4 — Spend This Month */}
                    <div className="bg-neo-base shadow-neo-card hover:shadow-neo-card-hover rounded-[14px] p-[18px] relative transition-shadow duration-200">
                      <div className="absolute top-[18px] right-[20px] w-9 h-9 flex items-center justify-center bg-neo-base shadow-neo-icon-btn rounded-[8px] text-neo-accent">
                        <DollarSign size={18} />
                      </div>
                      <span className="block text-[10px] font-bold text-neo-muted uppercase tracking-wider">Spend This Month</span>
                      <h3 className="text-3xl font-roboto font-extrabold text-neo-primary mt-1">
                        <CountUp end={4.2} decimals={1} prefix="$" suffix="M" />
                      </h3>
                      <p className="text-[11px] text-neo-success font-bold mt-2 flex items-center gap-1">
                        <span>↑</span> 6.4% vs last month
                      </p>
                    </div>

                    {/* Card 5 — Open Risk Issues */}
                    <div className="bg-neo-base shadow-neo-card hover:shadow-neo-card-hover rounded-[14px] p-[18px] relative transition-shadow duration-200">
                      <div className="absolute top-[18px] right-[20px] w-9 h-9 flex items-center justify-center bg-neo-base shadow-neo-icon-btn rounded-[8px] text-neo-accent">
                        <ShieldAlert size={18} />
                      </div>
                      <span className="block text-[10px] font-bold text-neo-muted uppercase tracking-wider">Open Risk Issues</span>
                      <h3 className="text-3xl font-roboto font-extrabold text-neo-primary mt-1">
                        <CountUp end={11} />
                      </h3>
                      <p className="text-[11px] text-neo-danger font-bold mt-2 flex items-center gap-1">
                        3 critical, 8 medium
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Double Panels charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* Monthly Spend area chart */}
                    <div className="lg:col-span-3 bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-250 dark:border-gray-800 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-roboto font-bold text-sm tracking-tight">Consolidated Spend Trend vs Budget</h4>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-gray-500 px-2 rounded">Rolling 12 Months</span>
                      </div>
                      <div className="h-68">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MONTHLY_SPEND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="month" stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'} />
                            <YAxis stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'} fontSize={10} />
                            <Tooltip />
                            <Area type="monotone" dataKey="Spend" stroke="#2563EB" fill="#EFF6FF" fillOpacity={0.4} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Donut distribution chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-250 dark:border-gray-800 shadow-sm">
                      <h4 className="font-roboto font-bold text-sm tracking-tight mb-4">System Registry Distribution</h4>
                      <div className="h-68">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryDistribution.slice(0, 5)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {categoryDistribution.slice(0, 5).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} Vendors`, 'Count']} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>

                  {/* Dynamic Metrics: Radar (Web) Chart and Activity Heatmap */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Radar (Web) Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-250 dark:border-gray-800 shadow-sm">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-150 dark:border-gray-800 pb-2">
                        <h4 className="font-roboto font-bold text-sm tracking-tight text-neo-primary">Strategic Category Balance</h4>
                        <span className="text-[10px] bg-neo-base shadow-neo-badge text-neo-muted px-2 py-0.5 rounded font-black">Radar Evaluation</span>
                      </div>
                      <div className="h-68">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={DASHBOARD_RADAR_DATA}>
                            <PolarGrid stroke={theme === 'dark' ? '#2A3041' : '#B8BEC7'} />
                            <PolarAngleAxis dataKey="subject" stroke={theme === 'dark' ? '#8A9BB0' : '#3D5068'} fontSize={10} fontWeight="bold" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={theme === 'dark' ? '#4A5570' : '#8A9BB0'} fontSize={8} />
                            <Radar name="Current Year" dataKey="A" stroke="var(--text-accent)" fill="var(--text-accent)" fillOpacity={0.4} />
                            <Radar name="Benchmark" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                            <Legend fontSize={10} wrapperStyle={{ paddingTop: '10px' }} />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* GitHub-like Contribution Heatmap */}
                    <div className="lg:col-span-3 bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-250 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-150 dark:border-gray-800 pb-2">
                        <h4 className="font-roboto font-bold text-sm tracking-tight text-neo-primary">Continuous Integration Activity Logs</h4>
                        <span className="text-[10px] bg-neo-base shadow-neo-badge text-neo-muted px-2 py-0.5 rounded font-black">20-Week Rolling</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div className="flex items-start gap-4">
                          {/* Weekday labels */}
                          <div className="grid grid-rows-7 gap-2 text-[9px] font-black text-neo-muted uppercase pt-1 shrink-0">
                            <span>Sun</span>
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                          </div>
                          
                          {/* Heatmap Grid */}
                          <div className="flex-1 overflow-x-auto">
                            <div className="grid grid-flow-col grid-rows-7 gap-2 pb-2 min-w-[380px]">
                              {heatmapData.map((day, idx) => {
                                let bgClass = 'bg-neo-base shadow-neo-input';
                                if (day.count > 0) {
                                  if (day.count <= 2) bgClass = 'bg-neo-accent/20 shadow-neo-badge border border-neo-accent/30';
                                  else if (day.count <= 4) bgClass = 'bg-neo-accent/40 shadow-neo-badge border border-neo-accent/50';
                                  else if (day.count <= 6) bgClass = 'bg-neo-accent/70 shadow-neo-badge text-neo-on-accent';
                                  else bgClass = 'bg-neo-accent shadow-neo-badge text-neo-on-accent';
                                }
                                
                                return (
                                  <div 
                                    key={idx}
                                    className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-150 hover:scale-125 cursor-pointer ${bgClass}`}
                                    title={`${day.dateStr}: ${day.count} database operations`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Legends */}
                        <div className="flex justify-between items-center text-[10px] font-bold text-neo-muted border-t border-gray-200 dark:border-gray-800/60 pt-4">
                          <span>Operations count from dynamically loaded logs</span>
                          <div className="flex items-center gap-1.5 font-sans">
                            <span>Less</span>
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-neo-base shadow-neo-input" />
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-neo-accent/20 shadow-neo-badge" />
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-neo-accent/40 shadow-neo-badge" />
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-neo-accent/70 shadow-neo-badge" />
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-neo-accent shadow-neo-badge" />
                            <span>More</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Operational checklists table & logs widgets */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Top performing vendors list */}
                    <div className="bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-250 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                      <h4 className="font-roboto font-bold text-xs uppercase tracking-widest text-slate-450 mb-3">Top Partners Performance Index</h4>
                      <div className="divide-y divide-gray-100 dark:divide-gray-850 text-xs">
                        {db.vendors.slice(0, 5).map((v, idx) => (
                          <div key={v.id} className="py-2.5 flex justify-between items-center">
                            <span className="font-bold text-gray-800 dark:text-gray-150">{idx + 1}. {v.name}</span>
                            <span className="bg-green-50 text-green-700 font-extrabold px-1.5 py-0.5 rounded text-[10px]">{v.performanceScore}/100</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick logs audit list widget */}
                    <div className="bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-250 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                      <h4 className="font-roboto font-bold text-xs uppercase tracking-widest text-slate-450 mb-3">Continuous Audit Chronology</h4>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px]">
                        {db.auditLogs.slice(0, 4).map(log => (
                          <div key={log.id} className="text-[11px] leading-tight">
                            <span className="text-gray-400 block">{log.timestamp}</span>
                            <p className="font-serif italic text-gray-800 dark:text-gray-250">{log.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick action checklist panel */}
                    <div className="bg-white dark:bg-[#161B27] p-6 rounded-lg border border-gray-250 dark:border-gray-800 shadow-sm">
                      <h4 className="font-roboto font-bold text-xs uppercase tracking-widest text-[#111827] dark:text-white mb-3">SaaS Action Modules</h4>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <button 
                          onClick={() => setOnboardFormOpen(true)}
                          className="p-3 border border-blue-200 dark:border-blue-900/40 rounded hover:bg-blue-50 dark:hover:bg-slate-800 text-xs flex flex-col items-center gap-1 font-bold text-blue-750 dark:text-blue-350"
                        >
                          <UserPlus size={16} /> Use Onboarding
                        </button>
                        <button 
                          onClick={() => setPOFormOpen(true)}
                          className="p-3 border border-green-200 dark:border-green-900/40 rounded hover:bg-green-50 dark:hover:bg-slate-800 text-xs flex flex-col items-center gap-1 font-bold text-green-750 dark:text-green-350"
                        >
                          <ShoppingCart size={16} /> Log PO
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ROUTE: DYNAMIC CALENDAR */}
              {activePage === 'calendar' && (
                <CalendarView 
                  vendors={db.vendors}
                  contracts={db.contracts}
                  pos={db.pos}
                  invoices={db.invoices}
                  events={db.calendarEvents}
                  onAddEvent={handleAddEvent}
                  dark={theme === 'dark'}
                />
              )}

              {/* ROUTE: REGISTRY DIRECTORY */}
              {activePage === 'vendors' && (
                <div className="flex-1 flex flex-col overflow-hidden p-8 space-y-6">
                  
                  {/* Top bar controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 shrink-0 bg-white dark:bg-[#161B27] p-4 rounded border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-wrap gap-3 items-center">
                      <select 
                        value={vendorCategoryFilter}
                        onChange={(e) => setVendorCategoryFilter(e.target.value)}
                        className="bg-transparent border border-gray-300 dark:border-gray-700 text-xs px-2.5 py-1.5 rounded"
                      >
                        <option value="All">All Categories</option>
                        <option value="IT Services">IT Services</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Raw Materials">Raw Materials</option>
                      </select>

                      <select 
                        value={vendorStatusFilter}
                        onChange={(e) => setVendorStatusFilter(e.target.value)}
                        className="bg-transparent border border-gray-300 dark:border-gray-700 text-xs px-2.5 py-1.5 rounded"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active Only</option>
                        <option value="Blocked">Blocked Only</option>
                      </select>

                      <button 
                        onClick={() => {
                          setVendorCategoryFilter('All');
                          setVendorStatusFilter('All');
                        }}
                        className="text-xs text-gray-500 font-bold"
                      >
                        Reset Filter
                      </button>
                    </div>

                    <button 
                      onClick={() => setOnboardFormOpen(true)}
                      className="bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs px-4 py-2 rounded shadow"
                    >
                      + Onboard New Vendor
                    </button>
                  </div>

                  {/* Standard Main Directory Listing */}
                  <div className="flex-1 bg-white dark:bg-[#161B27] rounded-lg border border-gray-205 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-100/50 dark:bg-gray-850/15 border-b border-gray-250 dark:border-gray-800 font-bold uppercase tracking-widest text-[9px] text-[#475569]">
                            <th className="p-4">Vendor ID</th>
                            <th className="p-4">Company Name</th>
                            <th className="p-4">Category Category</th>
                            <th className="p-4">Onboarding Date</th>
                            <th className="p-4">Status Tag</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                          {db.vendors
                            .filter(v => {
                              const matchCat = vendorCategoryFilter === 'All' || v.category === vendorCategoryFilter;
                              const matchStat = vendorStatusFilter === 'All' || v.status === vendorStatusFilter;
                              return matchCat && matchStat;
                            })
                            .map(v => (
                              <tr key={v.id} className="hover:bg-gray-55/40 dark:hover:bg-[#1C2030]/20">
                                <td className="p-4 font-bold text-blue-600 cursor-pointer" onClick={() => setActiveVendorId(v.id)}>
                                  {v.id}
                                </td>
                                <td className="p-4 font-bold text-[#111827] dark:text-white" onClick={() => setActiveVendorId(v.id)}>
                                  {v.name}
                                </td>
                                <td className="p-4">
                                  <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-655 font-bold">{v.category}</span>
                                </td>
                                <td className="p-4 text-gray-400">{v.onboardedDate}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                    v.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {v.status}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <button 
                                    onClick={() => setActiveVendorId(v.id)}
                                    className="text-blue-600 dark:text-blue-400 font-black hover:underline"
                                  >
                                    Review Profile
                                  </button>
                                </td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ROUTE: COMPARE VENDORS */}
              {activePage === 'compare' && (
                <VendorCompare 
                  vendors={db.vendors}
                  selectedVendorIds={selectedVendors}
                  onAddVendorToCompare={(id) => setSelectedVendors(prev => [...prev, id])}
                  onRemoveVendorFromCompare={(id) => setSelectedVendors(prev => prev.filter(item => item !== id))}
                  onClearComparison={() => setSelectedVendors([])}
                  onNavigateToPage={(page, id) => {
                    setActivePage(page as any);
                    if (id) setActiveVendorId(id);
                  }}
                  dark={theme === 'dark'}
                />
              )}

              {/* ROUTE: SAVINGS TRACKER */}
              {activePage === 'savings' && (
                <SavingsTracker 
                  vendors={db.vendors}
                  savings={db.savings}
                  onAddSaving={handleAddSaving}
                  dark={theme === 'dark'}
                />
              )}

              {/* ROUTE: ESG SCORECARD */}
              {activePage === 'esg' && (
                <ESGScorecard 
                  vendors={db.vendors}
                  esgScorecards={db.esgScorecards}
                  onUpdateVendorESG={handleUpdateVendorESG}
                  dark={theme === 'dark'}
                />
              )}

              {/* ROUTE: VENDOR ONBOARDING */}
              {activePage === 'onboarding' && (
                <Onboarding
                  vendors={db.vendors}
                  isDark={theme === 'dark'}
                  onAddVendor={handleAddVendor}
                />
              )}

              {/* ROUTE: PERFORMANCE */}
              {activePage === 'performance' && (
                <Performance
                  vendors={db.vendors}
                  scorecards={db.esgScorecards}
                  isDark={theme === 'dark'}
                  onUpdateScorecard={(sc) => handleUpdateVendorESG(sc.vendorId, sc)}
                  onNavigateToDetail={(vendorId) => {
                    setActivePage('vendors');
                    setActiveVendorId(vendorId);
                  }}
                />
              )}

              {/* ROUTE: PROCUREMENT (PO, RFQ, CONTRACTS, INVOICES) */}
              {['pos', 'rfq', 'contracts', 'invoices'].includes(activePage) && (
                <Procurement
                  vendors={db.vendors}
                  purchaseOrders={db.pos}
                  contracts={db.contracts}
                  invoices={db.invoices}
                  isDark={theme === 'dark'}
                  onAddPO={handleAddPOObj}
                  onUpdatePOStatus={handleUpdatePOStatus}
                  onAddContract={handleAddContract}
                  initialTab={activePage === 'rfq' ? 'rfqs' : activePage as any}
                />
              )}

              {/* ROUTE: FINANCE & ADMIN (PAYMENTS, SPEND, USERS) */}
              {['payments', 'analytics', 'users'].includes(activePage) && (
                <FinanceAndAdmin
                  vendors={db.vendors}
                  savings={db.savings}
                  logs={db.auditLogs}
                  users={db.users}
                  isDark={theme === 'dark'}
                  onInviteUser={handleInviteUser}
                  onDeleteUser={handleDeleteUser}
                  initialTab={activePage === 'analytics' ? 'spend' : activePage as any}
                />
              )}

              {/* ROUTE: RISK ASSESSMENT */}
              {activePage === 'risk' && (
                <RiskAssessmentView 
                  vendors={db.vendors}
                  riskAssessments={db.riskAssessments}
                  isDark={theme === 'dark'}
                  onNavigateToDetail={(id) => {
                    setActivePage('vendors');
                    setActiveVendorId(id);
                  }}
                  onAddRiskAssessment={handleAddRiskAssessment}
                />
              )}

              {/* ROUTE: COMPLIANCE DOCUMENTS */}
              {activePage === 'compliance' && (
                <ComplianceDocsView
                  vendors={db.vendors}
                  documents={db.complianceDocs}
                  isDark={theme === 'dark'}
                  onAddDocument={handleAddComplianceDoc}
                  onFlagDocument={handleFlagComplianceDoc}
                />
              )}

              {/* ROUTE: AUDIT LOGS */}
              {activePage === 'audit' && (
                <AuditLogsView
                  logs={db.auditLogs}
                  isDark={theme === 'dark'}
                />
              )}

              {/* ROUTE: SYSTEM SETTINGS */}
              {activePage === 'settings' && (
                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-roboto">System Settings & Configuration</span>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Global Configurations</h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <div className="bg-neo-base shadow-neo-card rounded-[16px] p-6 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neo-primary border-b border-gray-300 dark:border-gray-800 pb-2">General Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-neo-secondary mb-1">Company Name</label>
                          <input type="text" className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none" defaultValue="VendorFlow Corp." />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neo-secondary mb-1">Fiscal Year Start</label>
                          <select className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none">
                            <option>January 1st</option>
                            <option>April 1st</option>
                            <option>July 1st</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neo-secondary mb-1">Default Currency</label>
                          <select className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Security & Access */}
                    <div className="bg-neo-base shadow-neo-card rounded-[16px] p-6 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neo-primary border-b border-gray-300 dark:border-gray-800 pb-2">Security & Access</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-neo-primary">Enforce Two-Factor Authentication (2FA)</p>
                            <p className="text-[10px] text-neo-muted">Require all administrator and manager accounts to use 2FA.</p>
                          </div>
                          <div className="w-10 h-6 bg-neo-base shadow-neo-input rounded-full p-1 cursor-pointer flex items-center justify-start">
                            <div className="w-4 h-4 rounded-full bg-neo-accent shadow-neo-btn"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-neo-primary">Single Sign-On (SSO)</p>
                            <p className="text-[10px] text-neo-muted">Enable SAML 2.0 or Okta identity provider authentication.</p>
                          </div>
                          <div className="w-10 h-6 bg-neo-base shadow-neo-input rounded-full p-1 cursor-pointer flex items-center justify-end">
                            <div className="w-4 h-4 rounded-full bg-neo-accent shadow-neo-btn"></div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neo-secondary mb-1">IP Allowlist Range</label>
                          <input type="text" className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[38px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none" defaultValue="192.168.1.1/24, 10.0.0.1/16" />
                        </div>
                      </div>
                    </div>

                    {/* Integrations */}
                    <div className="bg-neo-base shadow-neo-card rounded-[16px] p-6 space-y-4 md:col-span-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neo-primary border-b border-gray-300 dark:border-gray-800 pb-2">ERP & Workflow Integrations</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { name: 'SAP Integration', status: 'Connected', desc: 'Sync POs & Invoices' },
                          { name: 'Oracle ERP', status: 'Disconnected', desc: 'Sync vendor registries' },
                          { name: 'QuickBooks Online', status: 'Connected', desc: 'Sync ledger details' },
                          { name: 'DocuSign', status: 'Connected', desc: 'E-sign contracts' }
                        ].map((erp, idx) => (
                          <div key={idx} className="bg-neo-base shadow-neo-card p-4 rounded-[14px] flex flex-col justify-between h-32">
                            <div>
                              <p className="text-xs font-bold text-neo-primary">{erp.name}</p>
                              <p className="text-[10px] text-neo-muted mt-1">{erp.desc}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-neo-badge ${erp.status === 'Connected' ? 'text-neo-success' : 'text-neo-muted'}`}>{erp.status}</span>
                              <button className="bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active text-[10px] font-bold text-neo-accent px-2 py-1 rounded-[8px]">
                                {erp.status === 'Connected' ? 'Disconnect' : 'Connect'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Fallback Screen (Renders clean informational dashboard cards if matches pages) */}
              {!['dashboard', 'calendar', 'vendors', 'compare', 'savings', 'esg', 'onboarding', 'performance', 'pos', 'rfq', 'contracts', 'invoices', 'payments', 'analytics', 'users', 'audit', 'settings', 'compliance', 'risk'].includes(activePage) && (
                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                  
                  <div className="bg-white dark:bg-[#161B27] p-8 rounded border border-gray-200 dark:border-gray-800 text-center shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LayoutDashboard size={32} />
                    </div>
                    <h2 className="font-roboto font-extrabold text-lg text-gray-800 dark:text-white capitalize">
                      Module: {activePage.replace('-', ' ')} Active Setup
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs max-w-sm mx-auto mt-2 mb-6">
                      This enterprise panel compiles dynamic data queries directly from shared state maps. Run actions to interact with core registries.
                    </p>
                    
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => {
                          setActivePage('vendors');
                          addToast('Checking operational schema registries', 'info');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 px-4 rounded shadow"
                      >
                        Inspect Primary Registry
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </>
          )}

        </div>

      </div>

      {/* TOAST SYSTEM WRAPPER */}
      <div className="fixed bottom-6 right-6 z-55 space-y-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`p-4 rounded shadow-xl text-white font-bold text-xs flex items-center gap-2.5 animate-in slide-in-from-right pointer-events-auto ${
              t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-650' : 'bg-blue-600'
            }`}
          >
            {t.type === 'success' && <Check size={16} />}
            {t.type === 'error' && <AlertTriangle size={16} />}
            {t.type === 'info' && <Info size={16} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* NOTIFICATION CENTER SIDE-IN DRAWER */}
      {notifOpen && (
        <div className="fixed inset-0 z-45 flex justify-end">
          <div onClick={() => setNotifOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>
          <div className="w-96 bg-white dark:bg-[#161B27] h-full shadow-2xl border-l border-gray-200 dark:border-gray-800 p-6 shrink-0 relative flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-150 dark:border-gray-800 mb-4">
                <h3 className="font-roboto font-extrabold text-[#111827] dark:text-white text-sm uppercase tracking-widest">
                  Notifications Registry
                </h3>
                <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded">
                  <span className="font-bold text-red-700 dark:text-red-400 block mb-0.5">Critical Risk Rating Alert</span>
                  <p className="text-gray-500">Cybersecurity audit failed for VND-1014. Action requested.</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded">
                  <span className="font-bold text-blue-700 block mb-0.5">Contract SLA Due for signature</span>
                  <p className="text-gray-500">Apex Master SLA is pending executive sign-off.</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/20 rounded">
                  <span className="font-semibold block mb-0.5">Integration sync successful</span>
                  <p className="text-gray-400">SAP synchronization completed without errors.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setNotifOpen(false);
                addToast('All message parameters marked check', 'success');
              }}
              className="w-full bg-[#111827] text-white font-bold p-2.5 rounded text-xs mt-6"
            >
              Mark all items read
            </button>
          </div>
        </div>
      )}

      {/* SpotLight Cmd+K Keyboard Popover search palette */}
      {cmdKOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md p-4">
          <div onClick={() => setCmdKOpen(false)} className="absolute inset-0"></div>
          <div className="relative bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mt-16 overflow-hidden flex flex-col md:flex-row h-[420px] animate-in zoom-in-95 duration-150">
            
            {/* Search list inputs */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="sticky top-0 bg-white dark:bg-[#161B27] border-b border-gray-150 dark:border-gray-800 p-4 flex items-center gap-3">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  value={cmdKSearch}
                  onChange={(e) => setCmdKSearch(e.target.value)}
                  placeholder="Type to search page directories, vendor ID, PO keys..."
                  className="w-full bg-transparent text-sm border-0 focus:ring-0 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cmdKSearch ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2">
                      Grouped Query Results
                    </p>
                    {filteredCommandResults.map((res, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleSpotlightExecute(res.action, res.arg)}
                        className={`p-2.5 rounded cursor-pointer transition flex items-center justify-between text-xs hover:bg-gray-50 dark:hover:bg-[#1C2030]`}
                      >
                        <div>
                          <p className="font-bold text-gray-850 dark:text-gray-100">{res.title}</p>
                          <span className="text-[10px] text-gray-400">{res.subtitle}</span>
                        </div>
                        <span className="bg-gray-100 dark:bg-gray-800 text-[10px] px-1.5 py-0.5 rounded text-gray-500">{res.type}</span>
                      </div>
                    ))}
                    {filteredCommandResults.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-12">No matching registry matches found</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Suggestions / Quick actions</p>
                    <div 
                      onClick={() => handleSpotlightExecute('onboard')}
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded cursor-pointer text-xs font-bold text-blue-600 block pl-3"
                    >
                      → New Vendor Onboarding Multi-step Form
                    </div>
                    <div 
                      onClick={() => handleSpotlightExecute('po')}
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded cursor-pointer text-xs font-bold text-green-600 block pl-3"
                    >
                      → Create Purchase Order Lines
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right widget help guide */}
            <div className="w-68 hidden md:block border-l border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 p-5 text-xs text-gray-400 self-stretch flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Search Operators Portal</h4>
                <p className="leading-relaxed font-sans mb-4">
                  Run spotlight operations instantly using shortcut commands. Filter vendors, audit PO milestones, or navigate across active compliance pages.
                </p>
              </div>
              <div className="text-[10px] text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-3">
                Press <b>ESC</b> anytime to dismiss this spotlight deck.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* JSON DISPATCH AUDIT LOG DRAWER INTERACTIVE MODAL */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-850 rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col h-[480px]">
            <div className="bg-gray-50 dark:bg-[#1C2333] px-6 py-4 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-roboto font-extrabold text-sm uppercase tracking-wider text-slate-455">
                Audit Diff State Inspector [{selectedAuditLog.id}]
              </h3>
              <button onClick={() => setSelectedAuditLog(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-gray-400 dark:text-gray-550 block text-[10px] uppercase font-bold tracking-widest mb-1">Trigger Event</p>
                <p className="font-semibold text-gray-700 dark:text-gray-150">{selectedAuditLog.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] text-red-500 font-bold uppercase mb-2">Before State State</span>
                  <pre className="p-3 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-400 rounded max-h-[220px] overflow-auto">
                    {JSON.stringify(selectedAuditLog.details?.before || {}, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="block text-[10px] text-green-500 font-bold uppercase mb-2">After State State</span>
                  <pre className="p-3 bg-green-50/50 dark:bg-green-950/20 text-green-800 dark:text-green-400 rounded max-h-[220px] overflow-auto">
                    {JSON.stringify(selectedAuditLog.details?.after || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#1C2333] border-t border-gray-150 text-right">
              <button 
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-1.5 bg-[#111827] text-white font-bold text-xs rounded"
              >
                Seal Diff Log Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC NEW ONBOARDING MULTISTEP MODAL DIALOG */}
      {onboardFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden">
            <div className="bg-gray-50 dark:bg-[#1C2333] px-6 py-4 border-b border-gray-150 dark:border-gray-850 flex justify-between items-center">
              <div>
                <h3 className="font-roboto font-extrabold text-xs uppercase tracking-widest">
                  Vendor Onboarding Pipeline Form
                </h3>
                <p className="text-[10px] text-gray-400">Step {onboardStep} of 3 evaluations</p>
              </div>
              <button onClick={() => {
                setOnboardFormOpen(false);
                setOnboardStep(1);
                setOnboardSuccessState(false);
              }} className="text-gray-400 hover:text-gray-650">
                <X size={18} />
              </button>
            </div>

            {onboardSuccessState ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h3 className="font-roboto font-black text-lg text-gray-805 dark:text-white">Submission complete</h3>
                <p className="text-gray-500 dark:text-gray-405 text-xs max-w-xs mx-auto">
                  Onboarding ticket filed for executive manager review. Status will update inside directory within 3-5 days.
                </p>
                <button 
                  onClick={() => {
                    setOnboardFormOpen(false);
                    setOnboardStep(1);
                    setOnboardSuccessState(false);
                  }}
                  className="px-4 py-2 bg-[#111827] text-white font-bold text-xs rounded"
                >
                  Close Pipeline Form
                </button>
              </div>
            ) : (
              <form onSubmit={handleOnboardingSubmit} className="p-6 space-y-4 text-xs font-sans">
                {onboardStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Company Legal Partnership Name *</label>
                      <input 
                        type="text" 
                        required
                        value={onboardCompany}
                        onChange={(e) => setOnboardCompany(e.target.value)}
                        placeholder="e.g. Acme Logistics conglomerate"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Vendor Category Specialty</label>
                        <select 
                          value={onboardCategory}
                          onChange={(e) => setOnboardCategory(e.target.value as Vendor['category'])}
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 outline-none"
                        >
                          <option>IT Services</option>
                          <option>Logistics</option>
                          <option>Raw Materials</option>
                          <option>Consulting</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Vetting Tier Assignment</label>
                        <select 
                          value={onboardTier}
                          onChange={(e) => setOnboardTier(e.target.value as any)}
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 outline-none"
                        >
                          <option>Tier 1</option>
                          <option>Tier 2</option>
                          <option>Tier 3</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button 
                        type="button" 
                        onClick={() => setOnboardStep(2)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                )}

                {onboardStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Contact Email *</label>
                        <input 
                          type="email" 
                          required
                          value={onboardEmail}
                          onChange={(e) => setOnboardEmail(e.target.value)}
                          placeholder="salesteam@conglomerate.com"
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Country of Registry</label>
                        <input 
                          type="text" 
                          value={onboardCountry}
                          onChange={(e) => setOnboardCountry(e.target.value)}
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">Headquarters City Origin</label>
                      <input 
                        type="text" 
                        value={onboardCity}
                        onChange={(e) => setOnboardCity(e.target.value)}
                        placeholder="e.g. Munich, Germany"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 outline-none"
                      />
                    </div>
                    <div className="flex justify-between pt-4">
                      <button 
                        type="button" 
                        onClick={() => setOnboardStep(1)}
                        className="px-4 py-2 border border-gray-300 rounded font-bold"
                      >
                        ← Back
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setOnboardStep(3)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                )}

                {onboardStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Requested Terms</label>
                        <select 
                          value={onboardTerms}
                          onChange={(e) => setOnboardTerms(e.target.value)}
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 outline-none"
                        >
                          <option>Net 15</option>
                          <option>Net 30</option>
                          <option>Net 60</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Credit Limit Requested ($)</label>
                        <input 
                          type="number" 
                          value={onboardCredit}
                          onChange={(e) => setOnboardCredit(parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 outline-none"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50/50 rounded border border-blue-100 flex items-center gap-2">
                      <Info size={14} className="text-blue-600" />
                      <span>Completing files compliance check and authorization triggers automatically.</span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button 
                        type="button" 
                        onClick={() => setOnboardStep(2)}
                        className="px-4 py-2 border border-gray-300 rounded font-bold"
                      >
                        ← Back
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow"
                      >
                        Submit Pipeline Request
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* PO MULTILINE EDIT FORM CREATOR MODAL */}
      {poFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-850 rounded-lg shadow-2xl max-w-xl w-full overflow-hidden">
            <div className="bg-gray-50 dark:bg-[#1C2333] px-6 py-4 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-roboto font-extrabold text-xs uppercase tracking-widest">
                Create Purchase Order Line Draft
              </h3>
              <button onClick={() => setPOFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Target Vendor Supplier Partner *</label>
                <select 
                  required
                  value={newPoVendorId}
                  onChange={(e) => setNewPoVendorId(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 outline-none focus:border-green-500"
                >
                  <option value="">Choose Supplier...</option>
                  {db.vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
              </div>

              {/* Editable Multi line table items fields */}
              <div>
                <span className="block text-gray-400 font-bold uppercase text-[9px] mb-2 tracking-widest">Purchase Line Item Details</span>
                {newPoItems.map((itm, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-3 items-center mb-2">
                    <input 
                      type="text" 
                      placeholder="Code (e.g. PRD-102)"
                      value={itm.code}
                      onChange={(e) => {
                        const next = [...newPoItems];
                        next[idx].code = e.target.value;
                        setNewPoItems(next);
                      }}
                      className="bg-transparent border border-gray-300 rounded px-2"
                    />
                    <input 
                      type="text" 
                      placeholder="Description details"
                      value={itm.desc}
                      onChange={(e) => {
                        const next = [...newPoItems];
                        next[idx].desc = e.target.value;
                        setNewPoItems(next);
                      }}
                      className="bg-transparent border border-gray-300 rounded px-2"
                    />
                    <input 
                      type="number" 
                      placeholder="Quantity"
                      value={itm.qty}
                      onChange={(e) => {
                        const next = [...newPoItems];
                        next[idx].qty = parseInt(e.target.value) || 0;
                        setNewPoItems(next);
                      }}
                      className="bg-transparent border border-gray-300 rounded px-2"
                    />
                    <input 
                      type="number" 
                      placeholder="Unit cost ($)"
                      value={itm.price}
                      onChange={(e) => {
                        const next = [...newPoItems];
                        next[idx].price = parseFloat(e.target.value) || 0;
                        setNewPoItems(next);
                      }}
                      className="bg-transparent border border-gray-300 rounded px-2"
                    />
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={() => setNewPoItems(prev => [...prev, { code: 'PRD-100', desc: 'Hardware extra Consolidation pack', qty: 1, price: 100 }])}
                  className="text-blue-600 hover:underline font-bold mt-2 inline-block"
                >
                  + Add Line Item Field Row
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <button 
                  type="button" 
                  onClick={() => setPOFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow"
                >
                  Seal PO line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
