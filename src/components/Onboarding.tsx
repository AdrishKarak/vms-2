import React, { useState, useMemo } from 'react';
import { UserPlus, CheckCircle2, ChevronRight, X, ClipboardCheck, ArrowRight, Settings, Sparkles, Building, Briefcase } from 'lucide-react';
import { Vendor } from '../dataStore';

interface OnboardingProps {
  vendors: Vendor[];
  isDark: boolean;
  onAddVendor: (v: Vendor) => void;
}

export function Onboarding({ vendors, isDark, onAddVendor }: OnboardingProps) {
  const [pipelineState, setPipelineState] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [successSubmit, setSuccessSubmit] = useState(false);

  // Kanban mock data pipeline
  const pipelineStages = [
    { name: 'New Request', count: 4, color: 'border-blue-500' },
    { name: 'Doc Collection', count: 3, color: 'border-purple-500' },
    { name: 'Compliance Rev', count: 2, color: 'border-amber-500' },
    { name: 'Risk Eval', count: 2, color: 'border-red-500' },
    { name: 'Approval Pend', count: 3, color: 'border-indigo-505' },
    { name: 'Onboarded', count: 36, color: 'border-green-500' }
  ];

  const pipelineCards = [
    { id: "APP-004", name: "Apex Logistics Europe", category: "Logistics", stage: "Doc Collection", day: "Day 3", reviewer: "Elena R" },
    { id: "APP-005", name: "Cortex Software Labs", category: "IT Services", stage: "New Request", day: "Day 1", reviewer: "Alex M" },
    { id: "APP-006", name: "Pioneer Steel Works", category: "Raw Materials", stage: "Risk Eval", day: "Day 12", reviewer: "Dwight S" },
    { id: "APP-007", name: "Beacon Security GmbH", category: "Facilities", stage: "Compliance Rev", day: "Day 5", reviewer: "Elena R" },
    { id: "APP-008", name: "Zeta Translations Co", category: "Consulting", stage: "Approval Pend", day: "Day 8", reviewer: "Sarah c" }
  ];

  // Onboarding 5-step form states
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState<any>('it');
  const [vTier, setVTier] = useState<any>('Tier 2');
  const [vCountry, setVCountry] = useState('United States');
  const [vAddress, setVAddress] = useState('');
  const [vContactFirst, setVContactFirst] = useState('');
  const [vContactLast, setVContactLast] = useState('');
  const [vContactEmail, setVContactEmail] = useState('');
  const [vContactPhone, setVContactPhone] = useState('');
  const [vBankName, setVBankName] = useState('');
  const [vAccountNum, setVAccountNum] = useState('');
  const [vDocChecked1, setVDocChecked1] = useState(false);
  const [vDocChecked2, setVDocChecked2] = useState(false);
  const [vDocChecked3, setVDocChecked3] = useState(false);

  const handleNextStep = () => {
    if (vName === '' && currentStep === 1) {
      alert("Please fill out the Company Legal Name.");
      return;
    }
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitOnboarding = (e: React.FormEvent) => {
    e.preventDefault();

    const newV: Vendor = {
      id: `VND-${String(40 + vendors.length + 1).padStart(4, '0')}`,
      name: vName,
      category: vCategory === 'it' ? 'IT Services' : vCategory === 'materials' ? 'Raw Materials' : vCategory === 'logistics' ? 'Logistics' : 'Other',
      status: 'Pending',
      tier: vTier,
      country: vCountry,
      countryFlag: '🇺🇸',
      city: 'Chicago',
      address: vAddress,
      website: `https://www.${vName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: vContactPhone,
      email: vContactEmail,
      taxId: 'TXID-883921',
      registeredDate: '2026-06-06',
      onboardedBy: 'Alex Mercer',
      riskScore: 28,
      contractValue: 40000,
      performanceScore: 82,
      onboardedDate: '2026-06-06',
      description: 'Newly registered vendor in the pipeline awaiting risk audit and certifications collection.',
      avatarColor: '#2563EB',
      bankName: vBankName,
      branchName: 'Downtown Loop Branch',
      accountHolder: vName,
      accountNumber: vAccountNum,
      routingNumber: 'RT-2839100',
      iban: 'US29 1902 3847 A',
      swift: 'SWFTHY',
      currency: 'USD',
      creditLimit: 150000,
      primaryContact: {
        firstName: vContactFirst,
        lastName: vContactLast,
        jobTitle: 'Onboarding Lead',
        email: vContactEmail,
        phone: vContactPhone,
        department: 'Operations'
      },
      accountsPayableContact: {
        name: `${vContactFirst} ${vContactLast}`,
        email: vContactEmail,
        phone: vContactPhone
      },
      esgScore: 70,
      esgDetails: {
        environmental: 70,
        social: 70,
        governance: 70
      }
    };

    onAddVendor(newV);
    setSuccessSubmit(true);
    setTimeout(() => {
      setIsFormOpen(false);
      setSuccessSubmit(false);
      setCurrentStep(1);
      // clear
      setVName('');
      setVAddress('');
      setVContactFirst('');
      setVContactLast('');
      setVContactEmail('');
    }, 1800);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4 mb-6 border-slate-205 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-roboto">Pipeline Board & New Registrations</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-roboto">Vendor Onboarding Hub</h1>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded shadow cursor-pointer"
        >
          <UserPlus size={14} /> New Onboarding Form
        </button>
      </div>

      {/* PIPELINE STAGES KANBAN BOARD (Section A) */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        {pipelineStages.map((stage, idx) => {
          const cards = pipelineCards.filter(c => c.stage === stage.name);
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-180 dark:border-slate-800 rounded-lg p-3 min-h-[340px] flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <h4 className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-350 tracking-wide truncate">{stage.name}</h4>
                  <span className="px-1.5 py-0.5 bg-slate-120 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded">
                    {stage.count}
                  </span>
                </div>

                <div className="space-y-3 max-h-[260px] overflow-y-auto">
                  {cards.map(c => (
                    <div key={c.id} className="p-2.5 bg-slate-50 dark:bg-slate-805 border border-slate-150 dark:border-slate-800 rounded shadow-sm hover:border-blue-500 cursor-grab">
                      <span className="text-[9px] font-bold uppercase text-slate-400">{c.id}</span>
                      <h5 className="text-xs font-bold text-slate-850 dark:text-slate-250 mt-0.5 truncate">{c.name}</h5>
                      
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded">
                          {c.category}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 font-mono">{c.day}</span>
                      </div>
                      <div className="text-[9.5px] text-slate-400 mt-1">Reviewer: {c.reviewer}</div>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div className="text-center text-[10px] text-slate-400 py-8 italic border-2 border-dashed border-slate-100 dark:border-slate-800 rounded">
                      Move items here
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION C: PIPELINE STATUS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-202 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-roboto">In-Progress Onboarding Applications</h3>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Application ID</th>
              <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Vendor Candidate</th>
              <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Workflow Segment</th>
              <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Assigned Reviewer</th>
              <th className="p-3 text-[10px] font-bold uppercase text-slate-400">Days in Pipe</th>
              <th className="p-3 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pipelineCards.map(c => (
              <tr key={c.id} className="hover:bg-blue-50/10 dark:hover:bg-slate-800/40 text-xs">
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{c.id}</td>
                <td className="p-3 font-bold text-slate-855 dark:text-slate-205">{c.name}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 rounded text-[9.5px] font-extrabold uppercase">
                    {c.stage}
                  </span>
                </td>
                <td className="p-3 text-slate-505 dark:text-slate-405 font-bold">{c.reviewer}</td>
                <td className="p-3 font-mono">{c.day}</td>
                <td className="p-3 text-right">
                  <button className="px-2.5 py-1 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 rounded">
                    Audit File
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MULTI-STEP FULL ONBOARDING FORM MODAL (Section B) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden">
            
            {/* Header layout */}
            <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-808">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-roboto">Corporate Onboarding Registration</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Please fill details completely across 5 steps</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Stepper Wizard Progress dots */}
            <div className="p-4 bg-slate-50 dark:bg-slate-805/40 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center text-xs px-12">
              {[1, 2, 3, 4, 5].map(stepNum => (
                <div key={stepNum} className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    currentStep === stepNum
                      ? 'bg-blue-600 text-white shadow'
                      : currentStep > stepNum
                      ? 'bg-green-500 text-white'
                      : 'border border-slate-300 text-slate-400 bg-white dark:bg-slate-800'
                  }`}>
                    {currentStep > stepNum ? '✓' : stepNum}
                  </span>
                  <span className={`text-[10.5px] uppercase font-bold tracking-wider hidden sm:inline ${currentStep === stepNum ? 'text-blue-600' : 'text-slate-400'}`}>
                    {stepNum === 1 ? 'Profile' : stepNum === 2 ? 'Contacts' : stepNum === 3 ? 'Banking' : stepNum === 4 ? 'Documents' : 'Summary'}
                  </span>
                </div>
              ))}
            </div>

            {/* Form Content Steps */}
            {successSubmit ? (
              <div className="p-12 text-center space-y-3">
                <CheckCircle2 size={48} className="mx-auto text-green-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase font-roboto">Onboarding Submitted Successfully!</h3>
                <p className="text-xs text-slate-500">Candidate vendor folder is compiled and dispatched to legal. Loading...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOnboarding} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {/* STEP 1: Basic profiles */}
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Company Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Apex Steel Works LLC or similar"
                        value={vName}
                        onChange={e => setVName(e.target.value)}
                        className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Operational Category</label>
                        <select
                          value={vCategory}
                          onChange={e => setVCategory(e.target.value)}
                          className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-2 outline-none focus:border-blue-600"
                        >
                          <option value="it">IT Services</option>
                          <option value="materials">Raw Materials</option>
                          <option value="logistics">Logistics</option>
                          <option value="facilities">Facilities & support</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Segment Tier</label>
                        <select
                          value={vTier}
                          onChange={e => setVTier(e.target.value)}
                          className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-2 outline-none focus:border-blue-600"
                        >
                          <option value="Tier 1">Tier 1 - Strategic Partner</option>
                          <option value="Tier 2">Tier 2 - Preferred</option>
                          <option value="Tier 3">Tier 3 - Transactional</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Business Address</label>
                      <textarea
                        rows={2}
                        placeholder="HQ primary address details completely..."
                        value={vAddress}
                        onChange={e => setVAddress(e.target.value)}
                        className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Contacts info */}
                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">First Name</label>
                        <input
                          type="text"
                          placeholder="Raj"
                          value={vContactFirst}
                          onChange={e => setVContactFirst(e.target.value)}
                          className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-70)7 rounded px-2.5 py-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Last Name</label>
                        <input
                          type="text"
                          placeholder="Patel"
                          value={vContactLast}
                          onChange={e => setVContactLast(e.target.value)}
                          className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-707 rounded px-2.5 py-1.5"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Assigned Email</label>
                      <input
                        type="email"
                        placeholder="raj.patel@corporate.com"
                        value={vContactEmail}
                        onChange={e => setVContactEmail(e.target.value)}
                        className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-707 rounded px-2.5 py-1.5"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Telephone / Phone</label>
                      <input
                        type="text"
                        placeholder="+1-312-902188"
                        value={vContactPhone}
                        onChange={e => setVContactPhone(e.target.value)}
                        className="w-full text-xs text-slate-855 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-70)7 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Banking */}
                {currentStep === 3 && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Corporate Bank Name</label>
                      <input
                        type="text"
                        placeholder="Chase Federal or HSBC"
                        value={vBankName}
                        onChange={e => setVBankName(e.target.value)}
                        className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-707 rounded px-2.5 py-1.5"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Account Routing Number</label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 9214"
                        value={vAccountNum}
                        onChange={e => setVAccountNum(e.target.value)}
                        className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-850 border border-slate-201 dark:border-slate-707 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Certifications verification checklist Table */}
                {currentStep === 4 && (
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black uppercase text-slate-500">Required compliance files checklists</h4>
                    
                    <div className="p-4 border border-slate-150 dark:border-slate-800 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">Business license certificate</label>
                        <input
                          type="checkbox"
                          checked={vDocChecked1}
                          onChange={e => setVDocChecked1(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 select-all"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-355">Signed Non-Disclosure Agreement (NDA)</label>
                        <input
                          type="checkbox"
                          checked={vDocChecked2}
                          onChange={e => setVDocChecked2(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-355">Banking and W-9 information</label>
                        <input
                          type="checkbox"
                          checked={vDocChecked3}
                          onChange={e => setVDocChecked3(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Summary */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase text-slate-500">Candidate review application folder</h4>
                    
                    <div className="space-y-2 border p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900 border-slate-200">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-450 font-medium">Candidate Name:</span>
                        <span className="font-bold text-slate-800 dark:text-white uppercase">{vName}</span>
                      </div>
                      <div className="flex justify-between text-xs border-t pt-2">
                        <span className="text-slate-450 font-medium">Category:</span>
                        <span className="font-bold text-slate-800 dark:text-white uppercase">{vCategory}</span>
                      </div>
                      <div className="flex justify-between text-xs border-t pt-2">
                        <span className="text-slate-450 font-medium">Focal Contact:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{vContactEmail}</span>
                      </div>
                      <div className="flex justify-between text-xs border-t pt-2">
                        <span className="text-slate-450 font-medium">Bank Details:</span>
                        <span className="font-bold text-green-700">{vBankName || 'Awaiting verify'}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] uppercase shadow"
                      >
                        Submit For Audit Review
                      </button>
                    </div>
                  </div>
                )}

                {/* Wizard controls footer */}
                {currentStep < 5 && (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-110 dark:border-slate-800">
                    <button
                      type="button"
                      disabled={currentStep === 1}
                      onClick={handlePrevStep}
                      className="px-4 py-2 border border-slate-201 dark:border-slate-707 disabled:opacity-30 text-slate-700 dark:text-slate-350 rounded font-bold text-[10px] uppercase"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-blue-605 hover:bg-blue-70)0 text-white rounded font-bold text-[10px] uppercase"
                    >
                      Next
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
