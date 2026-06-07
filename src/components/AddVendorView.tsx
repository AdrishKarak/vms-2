/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, ArrowLeft, Save, Globe, Phone, Mail, Landmark, 
  ShieldCheck, FileText, User, MapPin, DollarSign, Calendar, Star,
  Briefcase, CheckCircle2, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { Vendor } from '../dataStore';

interface AddVendorViewProps {
  vendors: Vendor[];
  onAddVendor: (v: Vendor) => void;
  onNavigateToPage: (page: 'dashboard' | 'vendors' | 'performance' | 'pos' | 'invoices' | 'risk' | 'payments' | 'analytics' | 'compare' | 'savings' | 'calendar' | 'audit' | 'items' | 'purchasereceived' | 'bills' | 'batchpayments') => void;
  dark: boolean;
}

export const AddVendorView: React.FC<AddVendorViewProps> = ({
  vendors,
  onAddVendor,
  onNavigateToPage,
  dark
}) => {
  // Navigation / Success State
  const [submittedVendor, setSubmittedVendor] = useState<Vendor | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [dealsWith, setDealsWith] = useState('');
  const [category, setCategory] = useState<Vendor['category']>('IT Services');
  const [type, setType] = useState('');
  const [tier, setTier] = useState<Vendor['tier']>('Tier 3');
  const [symbol, setSymbol] = useState('');
  const [startingDate, setStartingDate] = useState(new Date().toISOString().split('T')[0]);
  const [website, setWebsite] = useState('');
  
  // Contact
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
  const [countryOfRegistration, setCountryOfRegistration] = useState('United States');
  
  // Financials
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [creditLimit, setCreditLimit] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  
  // Primary Contact
  const [contactFirst, setContactFirst] = useState('');
  const [contactLast, setContactLast] = useState('');
  const [contactJob, setContactJob] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactDept, setContactDept] = useState('');

  // Status & Operational
  const [status, setStatus] = useState<Vendor['status']>('Pending');
  const [description, setDescription] = useState('');

  // Bank Info
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [iban, setIban] = useState('');
  const [swift, setSwift] = useState('');

  // Active form section tab for organized flow on smaller screens or visual structure
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'financial' | 'banking'>('general');

  // Form Pre-fill for testing/demo
  const handlePrefill = () => {
    setName('Quantum Labs & Robotics');
    setDealsWith('AI Powered Supply Chain Logistics');
    setCategory('IT Services');
    setType('Artificial Intelligence Hardware');
    setTier('Tier 1');
    setSymbol('QLAB');
    setStartingDate('2026-06-01');
    setWebsite('https://quantumlabs-robotics.io');
    
    setEmail('partners@quantumlabs-robotics.io');
    setPhone('+1 (555) 482-9901');
    setAddress('820 Tech Parkway, Suite 400');
    setCity('Austin');
    setCountry('United States');
    setCountryOfRegistration('United States');
    
    setRegistrationNumber('REG-99210-TX');
    setAmount(250000);
    setCreditLimit(500000);
    setCurrency('USD');
    
    setContactFirst('Elena');
    setContactLast('Vasiliev');
    setContactJob('Director of Strategic Alliances');
    setContactEmail('elena.v@quantumlabs-robotics.io');
    setContactPhone('+1 (555) 482-9902');
    setContactDept('Business Development');
    
    setStatus('Active');
    setDescription('High-performance research lab delivering enterprise AI hardware accelerators and automated robotics integrations for global warehouse distribution hubs.');
    
    setBankName('Silicon Valley Commerce Bank');
    setBranchName('Austin Downtown Branch');
    setAccountHolder('Quantum Labs & Robotics Inc');
    setAccountNumber('99281002931');
    setRoutingNumber('121000248');
    setIban('US89SVCB12100024899281002931');
    setSwift('SVCBUS44XXX');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    // Generate standard/mock fields that are not in the form
    const avatarColors = ['#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    // Calculate next vendor ID VND-XXXX
    const ids = vendors
      .map(v => parseInt(v.id.replace('VND-', '')))
      .filter(n => !isNaN(n));
    const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 90;
    const newId = `VND-${String(nextIdNum).padStart(4, '0')}`;

    // Get country flag emoji
    const countryFlags: Record<string, string> = {
      'United States': '🇺🇸',
      'Germany': '🇩🇪',
      'Japan': '🇯🇵',
      'Canada': '🇨🇦',
      'India': '🇮🇳',
      'United Kingdom': '🇬🇧',
      'France': '🇫🇷',
      'Australia': '🇦🇺',
      'Brazil': '🇧🇷',
      'Singapore': '🇸🇬'
    };
    const countryFlag = countryFlags[country] || '🌐';

    const newVendor: Vendor = {
      id: newId,
      name,
      category,
      status,
      tier,
      country,
      countryFlag,
      city,
      address,
      website,
      phone,
      email,
      taxId: registrationNumber || 'TAX-TEMP-000',
      registeredDate: startingDate,
      onboardedBy: 'Alex Mercer',
      riskScore: Math.floor(Math.random() * 30) + 10, // Default baseline risk score
      contractValue: amount,
      performanceScore: 80, // Default baseline performance score
      onboardedDate: startingDate,
      description,
      avatarColor: randomColor,
      
      // Financials
      creditLimit,
      currency,
      symbol,
      registrationNumber,
      dealsWith,
      type,
      countryOfRegistration,
      startingDate,
      amount,
      mobileNo: phone,

      // Banking
      bankName,
      branchName,
      accountHolder,
      accountNumber,
      routingNumber,
      iban,
      swift,

      // Primary Contact
      primaryContact: {
        firstName: contactFirst || 'Not Provided',
        lastName: contactLast || '',
        jobTitle: contactJob || 'Representative',
        email: contactEmail || email,
        phone: contactPhone || phone,
        department: contactDept || 'Management'
      },
      accountsPayableContact: {
        name: `${contactFirst} ${contactLast}`.trim() || 'Accounts Team',
        email: contactEmail || email,
        phone: contactPhone || phone
      },

      esgScore: 75,
      esgDetails: {
        environmental: 72,
        social: 78,
        governance: 75
      },
      riskDetails: {
        financial: 12,
        operational: 22,
        compliance: 15,
        cyber: 18,
        geopolitical: 10
      },
      performanceMetrics: {
        onTimeDelivery: 96,
        defectRate: 0.8,
        responseTime: 2.1,
        invoiceAccuracy: 99,
        priceVariance: 1.2
      }
    };

    onAddVendor(newVendor);
    setSubmittedVendor(newVendor);
  };

  const handleReset = () => {
    setName('');
    setDealsWith('');
    setCategory('IT Services');
    setType('');
    setTier('Tier 3');
    setSymbol('');
    setStartingDate(new Date().toISOString().split('T')[0]);
    setWebsite('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setCountry('United States');
    setCountryOfRegistration('United States');
    setRegistrationNumber('');
    setAmount(0);
    setCreditLimit(0);
    setCurrency('USD');
    setContactFirst('');
    setContactLast('');
    setContactJob('');
    setContactEmail('');
    setContactPhone('');
    setContactDept('');
    setStatus('Pending');
    setDescription('');
    setBankName('');
    setBranchName('');
    setAccountHolder('');
    setAccountNumber('');
    setRoutingNumber('');
    setIban('');
    setSwift('');
    setSubmittedVendor(null);
    setActiveTab('general');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateToPage('vendors')}
            className="p-2 bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-750 text-gray-500 dark:text-gray-400 rounded-lg shadow-sm transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-500 uppercase tracking-widest font-roboto block">Vendor Registry Module</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase font-roboto flex items-center gap-2">
              <Building2 className="text-orange-600 dark:text-orange-500" /> Onboard New Vendor Partner
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrefill}
            className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-lg text-xs font-bold transition font-roboto"
            title="Populates form with realistic mock vendor details for instant validation."
          >
            <RefreshCw size={14} className="animate-spin-slow" />
            Prefill Demo Data
          </button>
        </div>
      </div>

      {submittedVendor ? (
        <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-950/40 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase font-roboto tracking-tight">
              Vendor Onboarded Successfully
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {submittedVendor.name} has been registry cataloged as <span className="font-bold text-orange-500">{submittedVendor.id}</span> in the VMS core database maps.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-150 dark:border-gray-850 text-left max-w-lg mx-auto grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block uppercase tracking-wider text-[9px] font-bold">Vendor ID</span>
              <span className="font-bold text-orange-600 dark:text-orange-500">{submittedVendor.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase tracking-wider text-[9px] font-bold">Category</span>
              <span className="font-bold text-gray-700 dark:text-gray-200">{submittedVendor.category}</span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase tracking-wider text-[9px] font-bold">Contact Person</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {submittedVendor.primaryContact.firstName} {submittedVendor.primaryContact.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block uppercase tracking-wider text-[9px] font-bold">Starting Date</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{submittedVendor.registeredDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-750 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Add Another Vendor
            </button>
            <button
              onClick={() => onNavigateToPage('vendors')}
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-lg shadow-orange-600/10 hover:shadow-orange-600/20 transition"
            >
              View Vendor Directory
            </button>
          </div>
        </div>
      ) : (
        /* Main Form Box */
        <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Form Section Navigation Tab List */}
          <div className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-150 dark:border-gray-850 px-6 py-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'general'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <Building2 size={14} />
              General & Deals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'contact'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <MapPin size={14} />
              Place & Contact
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('financial')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'financial'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <DollarSign size={14} />
              Financials & Contact Person
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('banking')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'banking'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <Landmark size={14} />
              Bank & Account Details
            </button>
          </div>

          {/* Big Form element */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* TAB: GENERAL DETAILS */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gray-150 dark:border-gray-800 pb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-orange-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    General Company Profile Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Vendor Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Apex Technologies Ltd"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Deals With (Business Scope / Specialization)
                    </label>
                    <input
                      type="text"
                      value={dealsWith}
                      onChange={(e) => setDealsWith(e.target.value)}
                      placeholder="e.g. Cloud infrastructure hosting, SaaS management tools"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Category (System Segment) *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Vendor['category'])}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white dark:bg-[#161B27]"
                    >
                      <option value="IT Services">IT Services</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Legal">Legal</option>
                      <option value="HR Services">HR Services</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Vendor Partner Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as Vendor['tier'])}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white dark:bg-[#161B27]"
                    >
                      <option value="Tier 1">Tier 1 (Strategic Partner)</option>
                      <option value="Tier 2">Tier 2 (Preferred Supplier)</option>
                      <option value="Tier 3">Tier 3 (Tactical Vendor)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Specific Business Type Description
                    </label>
                    <input
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="e.g. Hardware Distributor, Advisory Firm"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Stock/Identity Symbol (Ticker)
                    </label>
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g. APEX, GLOB-DE"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Starting / Onboarding Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={startingDate}
                      onChange={(e) => setStartingDate(e.target.value)}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white dark:bg-[#161B27]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Company Website
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. https://apextech-ltd.com"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Business Entity Description / Executive Summary
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Summarize the vendor's main services, strategic capabilities, reputation, and core service offerings..."
                    rows={4}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-bold shadow-md shadow-orange-600/10 hover:shadow-orange-600/20 transition"
                  >
                    Continue to Contact Details
                  </button>
                </div>
              </div>
            )}

            {/* TAB: CONTACT & PLACE */}
            {activeTab === 'contact' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gray-150 dark:border-gray-800 pb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Corporate Locations & Communication Channels
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Primary Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. procurement@apextech.com"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Mobile No / Corporate Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 100 Technology Drive, Suite 250"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      City / Place *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Boston"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Operational Country *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        // Sync country of registration by default to make onboarding quicker
                        if (countryOfRegistration === country) {
                          setCountryOfRegistration(e.target.value);
                        }
                      }}
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white dark:bg-[#161B27]"
                    >
                      <option value="United States">United States</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                      <option value="Canada">Canada</option>
                      <option value="India">India</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Australia">Australia</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Country of Legal Registration *
                    </label>
                    <input
                      type="text"
                      required
                      value={countryOfRegistration}
                      onChange={(e) => setCountryOfRegistration(e.target.value)}
                      placeholder="e.g. Germany, United States"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className="px-5 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-bold transition"
                  >
                    Back to Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('financial')}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-bold shadow-md shadow-orange-600/10 hover:shadow-orange-600/20 transition"
                  >
                    Continue to Financials & Contacts
                  </button>
                </div>
              </div>
            )}

            {/* TAB: FINANCIAL & CONTACT PERSON */}
            {activeTab === 'financial' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Section 1: Financial & Legal Registry */}
                <div className="space-y-6">
                  <div className="border-b border-gray-150 dark:border-gray-800 pb-3 flex items-center gap-2">
                    <DollarSign size={16} className="text-orange-500" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                      Financial Limits & Legal Identifiers
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Company Registration / Tax Number (Tax ID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="e.g. EU-990812-TAX or DE-399201"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1 col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Contract Amount / Value
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={amount || ''}
                          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Contract baseline value"
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white dark:bg-[#161B27]"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="INR">INR (₹)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="AUD">AUD ($)</option>
                          <option value="SGD">SGD ($)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Credit Limit ({currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={creditLimit || ''}
                        onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
                        placeholder="Credit limit allowed by vendor"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Onboarding Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Vendor['status'])}
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white dark:bg-[#161B27]"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending Approval</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Main Contact Person */}
                <div className="space-y-6">
                  <div className="border-b border-gray-150 dark:border-gray-800 pb-3 flex items-center gap-2">
                    <User size={16} className="text-orange-500" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                      Primary / Main Contact Person details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactFirst}
                        onChange={(e) => setContactFirst(e.target.value)}
                        placeholder="e.g. Sarah"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactLast}
                        onChange={(e) => setContactLast(e.target.value)}
                        placeholder="e.g. Connor"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Job Title / Role
                      </label>
                      <input
                        type="text"
                        value={contactJob}
                        onChange={(e) => setContactJob(e.target.value)}
                        placeholder="e.g. Key Account Manager"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. s.connor@apextech.com"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Contact Direct Phone
                      </label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 019-2899"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Corporate Department
                      </label>
                      <input
                        type="text"
                        value={contactDept}
                        onChange={(e) => setContactDept(e.target.value)}
                        placeholder="e.g. Customer Success, Enterprise Sales"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="px-5 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-bold transition"
                  >
                    Back to Location
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('banking')}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-bold shadow-md shadow-orange-600/10 hover:shadow-orange-600/20 transition"
                  >
                    Continue to Banking Details
                  </button>
                </div>
              </div>
            )}

            {/* TAB: BANK & ACCOUNT DETAILS */}
            {activeTab === 'banking' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-gray-150 dark:border-gray-800 pb-3 flex items-center gap-2">
                  <Landmark size={16} className="text-orange-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Bank Registry & Remittance Accounts
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. JPMorgan Chase Bank"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Branch / Address of Bank
                    </label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      placeholder="e.g. Boston Corporate Branch"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Bank Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      placeholder="Name matching company bank record"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account number or ID"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Routing Transit Number (ABA / Fed)
                    </label>
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="9-digit routing number"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      IBAN (International Account Number)
                    </label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value.toUpperCase())}
                      placeholder="For global bank wire transfers"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                      SWIFT / BIC Code
                    </label>
                    <input
                      type="text"
                      value={swift}
                      onChange={(e) => setSwift(e.target.value.toUpperCase())}
                      placeholder="e.g. CHASUS33XXX"
                      className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-150 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('financial')}
                    className="px-5 py-2 border border-gray-300 dark:border-gray-750 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-bold transition"
                  >
                    Back to Financials
                  </button>
                  
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-black shadow-lg shadow-green-600/10 hover:shadow-green-600/20 transition"
                  >
                    <Save size={14} />
                    Onboard & Save Vendor
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      )}

      {/* Quick Tips Box */}
      <div className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/50 dark:border-orange-900/30 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-orange-500 mt-0.5 shrink-0" size={16} />
        <div>
          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Onboarding Data Verification</h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed font-roboto">
            All submitted vendor partner records are cataloged in memory, triggering background security audits, risk scoring algorithms, and general ledger compliance rules. You can edit their profiles or perform audits instantly in other panels once onboarded.
          </p>
        </div>
      </div>

    </div>
  );
};
