export interface Vendor {
  id: string;
  name: string;
  category: 'IT Services' | 'Raw Materials' | 'Logistics' | 'Consulting' | 'Marketing' | 'Facilities' | 'Legal' | 'HR Services' | 'Manufacturing' | 'Other';
  status: 'Active' | 'Pending' | 'Inactive' | 'Blocked' | 'Under Review';
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  country: string;
  countryFlag: string;
  city: string;
  address: string;
  website: string;
  phone: string;
  email: string;
  taxId: string;
  registeredDate: string;
  onboardedBy: string;
  riskScore: number; // 0-100
  contractValue: number;
  performanceScore: number; // 0-100
  onboardedDate: string;
  description: string;
  avatarColor: string;
  bankName: string;
  branchName: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber: string;
  iban: string;
  swift: string;
  currency: string;
  creditLimit: number;
  primaryContact: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    department: string;
  };
  secondaryContact?: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    department: string;
  };
  accountsPayableContact: {
    name: string;
    email: string;
    phone: string;
  };
  esgScore: number;
  esgDetails: {
    environmental: number;
    social: number;
    governance: number;
  };
  countryCode?: string;
  riskDetails?: {
    financial: number;
    operational: number;
    compliance: number;
    cyber: number;
    geopolitical: number;
  };
  performanceHistory?: Array<{ month: string; score: number }>;
  performanceMetrics?: {
    onTimeDelivery: number;
    defectRate: number;
    responseTime: number;
    invoiceAccuracy: number;
    priceVariance: number;
  };
  totalSpend?: number;
  activeContracts?: number;
  posCount?: number;
  invoiceCount?: number;
  paymentTerms?: string;
  bankInfo?: {
    bankName: string;
    branchName: string;
    accountHolder: string;
    accountNumber: string;
    routingNumber: string;
    iban: string;
    swift: string;
    currency: string;
  };
}

export interface PurchaseOrder {
  id: string; // PO-2024-XXXX
  vendorId: string;
  vendorName: string;
  category: string;
  title: string;
  itemsCount: number;
  poValue: number;
  createdDate: string;
  requiredBy: string;
  approvedBy: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent' | 'Received' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  deliveryAddress: string;
  paymentTerms: string;
  notes: string;
  items: Array<{
    code: string;
    description: string;
    qty: number;
    unit: string;
    unitPrice: number;
    discount: number; // percentage
    taxRate: number; // percentage
    total: number;
  }>;
}

export interface Contract {
  id: string; // CTR-XXXX
  vendorId: string;
  vendorName: string;
  title: string;
  type: 'Procurement' | 'Service' | 'NDA' | 'MSA' | 'SLA' | 'Lease' | 'License' | 'Framework';
  value: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  status: 'Draft' | 'Active' | 'Expiring Soon' | 'Expired' | 'Terminated';
  owner: string;
  autoRenew: boolean;
  paymentTerms: string;
  noticePeriodDays: number;
  governingLaw: string;
  jurisdiction: string;
  specialTerms: string;
  milestones: Array<{
    name: string;
    dueDate: string;
    status: 'Pending' | 'Completed' | 'Overdue';
    amount: number;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    uploadedBy: string;
  }>;
}

export interface Invoice {
  id: string; // INV-XXXX
  vendorId: string;
  vendorName: string;
  poRef: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  total: number;
  status: 'Received' | 'Under Review' | 'Approved' | 'Disputed' | 'Paid' | 'Overdue';
  paymentStatus: 'Unpaid' | 'Under Review' | 'Paid' | 'Processing';
  threeWayMatch: {
    po: boolean;
    grn: boolean;
    invoice: boolean;
  };
  disputeReason?: string;
  disputeDescription?: string;
  items: Array<{
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
}

export interface RiskAssessment {
  vendorId: string;
  vendorName: string;
  overallScore: number; // 0-100
  assessedDate: string;
  assessor: string;
  financial: {
    rating: string;
    stability: number; // 1-5
    yearsInBusiness: number;
    isPublic: boolean;
    outstandingLitigation: boolean;
    outstandingLitigationNotes?: string;
  };
  operational: {
    singleSource: boolean;
    geographicConcentration: string;
    disasterRecovery: boolean;
    keyPersonnelDependency: 'Low' | 'Medium' | 'High';
    capacityUtilization: number; // %
  };
  compliance: {
    certifications: string[]; // ISO 9001 etc
    violationsPast3Years: boolean;
    antiBriberyPolicy: boolean;
    sanctionsCheck: 'Pass' | 'Fail' | 'Pending';
    laborPractice: number; // 1-5
  };
  cybersecurity: {
    dataAccessLevel: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
    lastPenTestDate: string;
    encryptionAtRest: boolean;
    encryptionInTransit: boolean;
    incidentResponse: boolean;
    mfaEnforced: boolean;
  };
  geopolitical: {
    countriesOfOperations: string;
    sanctionedCountryExposure: boolean;
    politicalStability: number; // 1-5
    exportControls: boolean;
  };
  recommendations: string;
}

export interface ESGScorecard {
  vendorId: string;
  vendorName: string;
  overallScore: number; // 0-100
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Needs Improvement';
  eScore: number;
  sScore: number;
  gScore: number;
  lastAssessed: string;
  yoyChange: number;
  environmental: {
    carbonEmissionsReporting: boolean;
    scope1: number;
    scope2: number;
    scope3: number;
    renewableEnergyPercent: number;
    environmentalPolicy: boolean;
    iso14001Certified: boolean;
    wasteReduction: boolean;
    waterStewardship: boolean;
    supplyChainAudits: boolean;
    incidents2Years: number;
  };
  social: {
    livingWage: boolean;
    noChildLabor: boolean;
    injuryRate: number;
    turnoverRate: number;
    womenInLeadership: number;
    diversityPolicy: boolean;
    communityPrograms: boolean;
    avgTrainingHours: number;
    humanRightsDueDiligence: boolean;
    socialAudits: boolean;
  };
  governance: {
    codeOfEthics: boolean;
    antiCorruption: boolean;
    whistleblower: boolean;
    boardIndependencePercent: number;
    externalAuditCompleted: boolean;
    dpoAppointed: boolean;
    gdprCompliant: boolean;
    conflictsPolicy: boolean;
    execCompensationTrans: boolean;
    violations3Years: number;
  };
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Contract Renewal' | 'Payment Due' | 'Document Expiry' | 'Review Meeting' | 'Audit Date' | 'Onboarding Deadline' | 'PO Delivery' | 'Risk Assessment';
  vendorId?: string;
  vendorName?: string;
  entityId?: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  remindMe: string;
  assignTo: string[];
  notes?: string;
  colorOverride?: string;
}

export interface SavingsInitiative {
  id: string; // SAV-XXXX
  title: string;
  category: string;
  vendorId: string;
  vendorName: string;
  savingType: 'Negotiation' | 'Volume Discount' | 'Process' | 'Demand Reduction' | 'Specification Change' | 'Payment Terms';
  baselineCost: number;
  negotiatedCost: number;
  baseline?: number;
  negotiated?: number;
  savingAmount: number;
  savingPercent: number;
  status: 'Realized' | 'Projected' | 'Pipeline' | 'On Hold';
  owner: string;
  targetDate: string;
  verifiedBy?: string;
}

export interface AuditLog {
  id: string; // LOG-XXXX
  timestamp: string;
  user: string;
  role: string;
  ipAddress: string;
  module: 'Vendors' | 'Contracts' | 'POs' | 'Invoices' | 'Risk' | 'Users' | 'System' | 'Calendar' | 'Finance' | 'Savings' | 'ESG' | 'Procurement' | 'Sourcing';
  action: 'Create' | 'Update' | 'Delete' | 'Login' | 'Export' | 'Approve';
  entityId: string;
  description: string;
  status: 'Success' | 'Failed';
  details?: {
    before?: any;
    after?: any;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Procurement Manager' | 'Finance Analyst' | 'Compliance Officer' | 'Viewer' | 'Vendor Portal User';
  department: string;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Pending Invite';
  twoFactorEnabled: boolean;
}

// SEED MOCK DATA HELPER
export function generateSeedData() {
  const users: User[] = [
    { id: "USR-01", name: "Alex Mercer", email: "alex.mercer@vendorflow.com", role: "Procurement Manager", department: "Procurement", lastLogin: "2026-06-06 14:32", status: "Active", twoFactorEnabled: true },
    { id: "USR-02", name: "Sarah Connor", email: "sarah.connor@vendorflow.com", role: "Admin", department: "IT", lastLogin: "2026-06-06 15:10", status: "Active", twoFactorEnabled: true },
    { id: "USR-03", name: "Michael Chang", email: "michael.c@vendorflow.com", role: "Finance Analyst", department: "Finance", lastLogin: "2026-06-05 09:20", status: "Active", twoFactorEnabled: false },
    { id: "USR-04", name: "Elena Rostova", email: "elena.r@vendorflow.com", role: "Compliance Officer", department: "Legal", lastLogin: "2026-06-06 11:05", status: "Active", twoFactorEnabled: true },
    { id: "USR-05", name: "Jim Halpert", email: "jim.h@vendorflow.com", role: "Viewer", department: "Sales", lastLogin: "2026-06-01 16:45", status: "Active", twoFactorEnabled: false },
    { id: "USR-06", name: "Dwight Schrute", email: "dwight.s@vendorflow.com", role: "Procurement Manager", department: "Procurement", lastLogin: "2026-06-06 08:15", status: "Active", twoFactorEnabled: true },
    { id: "USR-07", name: "Pam Beezly", email: "pam.b@vendorflow.com", role: "Viewer", department: "Operations", lastLogin: "2026-06-03 10:00", status: "Active", twoFactorEnabled: true },
    { id: "USR-08", name: "Angela Martin", email: "angela.m@vendorflow.com", role: "Finance Analyst", department: "Finance", lastLogin: "2026-06-06 12:40", status: "Active", twoFactorEnabled: true },
    { id: "USR-09", name: "Oscar Martinez", email: "oscar.m@vendorflow.com", role: "Finance Analyst", department: "Finance", lastLogin: "2026-06-05 17:30", status: "Active", twoFactorEnabled: true },
    { id: "USR-10", name: "Ryan Howard", email: "ryan.h@vendorflow.com", role: "Vendor Portal User", department: "External Relations", lastLogin: "2026-05-29 11:15", status: "Inactive", twoFactorEnabled: false },
    { id: "USR-11", name: "Kelly Kapoor", email: "kelly.k@vendorflow.com", role: "Viewer", department: "Marketing", lastLogin: "2026-06-04 14:02", status: "Active", twoFactorEnabled: false },
    { id: "USR-12", name: "Toby Flenderson", email: "toby.f@vendorflow.com", role: "Compliance Officer", department: "HR", lastLogin: "2026-06-06 09:30", status: "Active", twoFactorEnabled: true },
    { id: "USR-13", name: "Creed Bratton", email: "creed.b@vendorflow.com", role: "Compliance Officer", department: "Quality Assurance", lastLogin: "2026-06-05 15:55", status: "Active", twoFactorEnabled: false },
    { id: "USR-14", name: "Robert California", email: "robert.c@vendorflow.com", role: "Admin", department: "Executive Office", lastLogin: "2026-06-02 11:11", status: "Active", twoFactorEnabled: true },
    { id: "USR-15", name: "Andy Bernard", email: "andy.b@vendorflow.com", role: "Viewer", department: "Customer Success", lastLogin: "2026-06-06 15:20", status: "Pending Invite", twoFactorEnabled: false }
  ];

  const vendorNames = [
    "Apex Technologies Ltd", "GlobalTrade GmbH", "Meridian Supplies Inc", "NovaStar Logistics", "ClearPath IT Solutions",
    "Matrix Manufacturing", "Vortex Consulting", "Titan Steel Corp", "Zeta Marketing Agency", "Beacon Facilities",
    "Orion HR Partners", "Aether Legal Partners", "Equinox Biotech", "Summit Global Services", "Pinnacle Infotech",
    "Quantum Hardware", "Spectra Materials Corp", "Helix Services Group", "Integra Enterprise", "Alpha Energy Co",
    "Beta Telecom", "Gamma Creative Labs", "Delta Agriculture Inc", "Nexus Healthcare Systems", "Stellar Freight",
    "Enigma Security Solutions", "Legacy Paper Co", "Dynamic Software Inc", "Astra Aviation Group", "TrueNorth Advisors",
    "Frontier Industrial Parts", "Vanguard Security Services", "Core Medical Systems", "BlueSky Marine Products", "GreenLeaf AgriTech",
    "Oasis Beverage Dist", "Summit Textiles Ltd", "Pioneer Polymers LLC", "United Logistics Corp", "National Power & Light",
    "GlobeTech IT Solutions", "Innovate Advisory Partners", "Swift Packaging Supply", "Precision Valves Inc", "Benchmark Quality",
    "Evolve Digital Agency", "Premier Logistics Corp", "Vivid Media Relations", "Enterprise Tech Support", "Allied Labs LLC"
  ];

  const categories: Vendor['category'][] = [
    'IT Services', 'Raw Materials', 'Logistics', 'Consulting', 'Marketing',
    'Facilities', 'Legal', 'HR Services', 'Manufacturing', 'Other'
  ];

  const countries = [
    { name: "United States", flag: "🇺🇸" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "India", flag: "🇮🇳" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "France", flag: "🇫🇷" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Singapore", flag: "🇸🇬" }
  ];

  const citiesByCountry: Record<string, string[]> = {
    "United States": ["New York", "San Francisco", "Austin", "Seattle", "Chicago"],
    "Germany": ["Munich", "Frankfurt", "Berlin", "Hamburg", "Stuttgart"],
    "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    "India": ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Leeds"],
    "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    "Brazil": ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Belo Horizonte"],
    "Singapore": ["Singapore", "Jurong", "Changi", "Bedok", "Seng Kang"]
  };

  const statuses: Vendor['status'][] = ['Active', 'Active', 'Active', 'Pending', 'Under Review', 'Inactive', 'Blocked'];
  const tiers: Vendor['tier'][] = ['Tier 1', 'Tier 2', 'Tier 2', 'Tier 3', 'Tier 3'];
  const avatarColors = ["#2563EB", "#7C3AED", "#16A34A", "#D97706", "#DC2626", "#0891B2", "#4F46E5", "#059669", "#B45309", "#DB2777"];

  const vendors: Vendor[] = [];
  const esgScorecards: ESGScorecard[] = [];
  const riskAssessments: RiskAssessment[] = [];

  for (let i = 0; i < 50; i++) {
    const id = `VND-${String(40 + i).padStart(4, '0')}`;
    const name = vendorNames[i];
    const category = categories[i % categories.length];
    const status = i < 5 ? 'Pending' : i === 12 ? 'Blocked' : i === 31 ? 'Under Review' : i === 44 ? 'Inactive' : 'Active';
    const tier = i % 4 === 0 ? 'Tier 1' : i % 3 === 0 ? 'Tier 2' : 'Tier 3';
    const countryObj = countries[i % countries.length];
    const cities = citiesByCountry[countryObj.name] || ["Capital City"];
    const city = cities[i % cities.length];
    const color = avatarColors[i % avatarColors.length];
    
    const performanceScore = Math.floor(65 + Math.random() * 32);
    const riskScore = Math.floor(10 + Math.random() * 75);
    const contractValue = Math.floor(15000 + Math.random() * 950000);

    const firstName = ["John", "Emily", "Wei", "Abe", "Raj", "David", "Clara", "Min", "Marcus", "Klaus"][i % 10];
    const lastName = ["Smith", "Gomez", "Chen", "Sato", "Patel", "Johnson", "Dubois", "Kim", "Vance", "Müller"][i % 10];

    // Seed corresponding ESG Scorecard values upfront
    const eScore = Math.floor(55 + Math.random() * 43);
    const sScore = Math.floor(60 + Math.random() * 38);
    const gScore = Math.floor(62 + Math.random() * 36);
    const overallESG = Math.round(eScore * 0.35 + sScore * 0.35 + gScore * 0.30);
    const esgTier = overallESG >= 90 ? 'Platinum' : overallESG >= 75 ? 'Gold' : overallESG >= 60 ? 'Silver' : overallESG >= 45 ? 'Bronze' : 'Needs Improvement';

    vendors.push({
      id,
      name,
      category,
      status,
      tier,
      country: countryObj.name,
      countryFlag: countryObj.flag,
      city,
      address: `Industrial Zone Rd ${101 + i}, Building B1, ${city}`,
      website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: `+${(1 + (i % 9)) * 10}-${i * 123 + 4567}`,
      email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      taxId: `TXID-${3829000 + i}`,
      registeredDate: `2021-04-${String((i % 25) + 1).padStart(2, '0')}`,
      onboardedBy: users[i % users.length].name,
      riskScore,
      contractValue,
      performanceScore,
      onboardedDate: `${2022 + (i % 4)}-0${1 + (i % 9)}-${String((i % 28) + 1).padStart(2, '0')}`,
      description: `${name} is an enterprise-class provider specializing in high-quality ${category.toLowerCase()} with global delivery operations, compliant with top certification bodies.`,
      avatarColor: color,
      bankName: ["Chase Manhattan", "Deutsche Bank", "Mitsubishi Financial", "Barclays", "HSBC", "HDFC Bank"][i % 6],
      branchName: `${city} Central Plaza`,
      accountHolder: name,
      accountNumber: `•••• •••• •••• ${5420 + i}`,
      routingNumber: `RT-${209348 + i}`,
      iban: `DE${21} 5003 4002 1293 8472 ${String(i).padStart(2, '0')}`,
      swift: `SWFT${countryObj.name.substring(0, 3).toUpperCase()}XX`,
      currency: countryObj.name === 'Germany' || countryObj.name === 'France' ? 'EUR' : countryObj.name === 'United Kingdom' ? 'GBP' : countryObj.name === 'Japan' ? 'JPY' : countryObj.name === 'India' ? 'INR' : 'USD',
      creditLimit: Math.floor(50000 + Math.random() * 450000),
      primaryContact: {
        firstName,
        lastName,
        jobTitle: "Key Account Director",
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: `+${(1 + (i % 9)) * 10}-984-${(i * 11) + 21}`,
        department: "Enterprise Accounts"
      },
      secondaryContact: i % 2 === 0 ? {
        firstName: "Robert",
        lastName: "Paulson",
        jobTitle: "Technical Lead",
        email: `tech-support@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: `+1-800-410-123`,
        department: "Customer Success"
      } : undefined,
      accountsPayableContact: {
        name: `Billing Manager (${firstName})`,
        email: `accounts-receivable@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: `+33 9 84 92 10`
      },
      esgScore: overallESG,
      esgDetails: {
        environmental: eScore,
        social: sScore,
        governance: gScore
      },
      totalSpend: Math.floor(50000 + Math.random() * 850000),
      activeContracts: Math.floor(1 + Math.random() * 5),
      posCount: Math.floor(5 + Math.random() * 15),
      invoiceCount: Math.floor(8 + Math.random() * 25),
      paymentTerms: ["Net 30", "Net 45", "Net 60", "Net 15"][i % 4],
      performanceMetrics: {
        onTimeDelivery: Math.floor(75 + Math.random() * 24),
        defectRate: Number((0.2 + Math.random() * 4).toFixed(1)),
        responseTime: Math.floor(2 + Math.random() * 8),
        invoiceAccuracy: Math.floor(88 + Math.random() * 11),
        priceVariance: Number((Math.random() * 5).toFixed(1))
      },
      performanceHistory: [
        { month: 'Jan', score: Math.floor(70 + Math.random() * 28) },
        { month: 'Feb', score: Math.floor(70 + Math.random() * 28) },
        { month: 'Mar', score: Math.floor(70 + Math.random() * 28) },
        { month: 'Apr', score: Math.floor(70 + Math.random() * 28) },
        { month: 'May', score: Math.floor(70 + Math.random() * 28) },
        { month: 'Jun', score: Math.floor(70 + Math.random() * 28) }
      ]
    });

    esgScorecards.push({
      vendorId: id,
      vendorName: name,
      overallScore: overallESG,
      tier: esgTier,
      eScore,
      sScore,
      gScore,
      lastAssessed: "2025-10-12",
      yoyChange: Number((Math.random() * 8 - 3).toFixed(1)),
      environmental: {
        carbonEmissionsReporting: i % 3 !== 0,
        scope1: Math.floor(50 + Math.random() * 1200),
        scope2: Math.floor(100 + Math.random() * 2400),
        scope3: Math.floor(300 + Math.random() * 5000),
        renewableEnergyPercent: Math.floor(20 + Math.random() * 80),
        environmentalPolicy: i % 4 !== 0,
        iso14001Certified: i % 5 !== 0,
        wasteReduction: i % 3 === 0,
        waterStewardship: i % 4 === 0,
        supplyChainAudits: i % 2 === 0,
        incidents2Years: i % 10 === 0 ? 1 : 0
      },
      social: {
        livingWage: i % 6 !== 0,
        noChildLabor: true,
        injuryRate: Number((Math.random() * 2.5).toFixed(2)),
        turnoverRate: Math.floor(5 + Math.random() * 15),
        womenInLeadership: Math.floor(10 + Math.random() * 60),
        diversityPolicy: i % 4 !== 0,
        communityPrograms: i % 5 === 0,
        avgTrainingHours: Math.floor(15 + Math.random() * 30),
        humanRightsDueDiligence: i % 3 !== 0,
        socialAudits: i % 2 === 0
      },
      governance: {
        codeOfEthics: true,
        antiCorruption: true,
        whistleblower: i % 4 !== 0,
        boardIndependencePercent: Math.floor(50 + Math.random() * 45),
        externalAuditCompleted: i % 3 !== 0,
        dpoAppointed: i % 2 === 0,
        gdprCompliant: i % 4 !== 0,
        conflictsPolicy: true,
        execCompensationTrans: i % 5 === 0,
        violations3Years: i % 15 === 0 ? 1 : 0
      }
    });

    // Seed Risk Assessments
    riskAssessments.push({
      vendorId: id,
      vendorName: name,
      overallScore: riskScore,
      assessedDate: "2026-02-14",
      assessor: users[i % users.length].name,
      financial: {
        rating: ["AAA", "AA", "A", "BBB", "BBB", "BB", "B", "CCC"][i % 8],
        stability: Math.floor(2 + Math.random() * 4),
        yearsInBusiness: 6 + (i % 25),
        isPublic: i % 3 === 0,
        outstandingLitigation: i % 15 === 0,
        outstandingLitigationNotes: i % 15 === 0 ? "Undergoing compliance review regarding contract overlap in EU." : undefined
      },
      operational: {
        singleSource: i % 5 === 0,
        geographicConcentration: countryObj.name,
        disasterRecovery: i % 4 !== 0,
        keyPersonnelDependency: i % 7 === 0 ? 'High' : i % 3 === 0 ? 'Medium' : 'Low',
        capacityUtilization: Math.floor(60 + Math.random() * 35)
      },
      compliance: {
        certifications: [["ISO 9001", "ISO 27001"], ["ISO 9001"], ["ISO 27001", "SOC2"], ["SOC2", "GDPR"]][i % 4],
        violationsPast3Years: i % 18 === 0,
        antiBriberyPolicy: true,
        sanctionsCheck: 'Pass',
        laborPractice: Math.floor(3 + Math.random() * 3)
      },
      cybersecurity: {
        dataAccessLevel: (['None', 'Low', 'Medium', 'High', 'Critical'] as const)[i % 5],
        lastPenTestDate: "2025-11-05",
        encryptionAtRest: i % 4 !== 0,
        encryptionInTransit: i % 3 !== 0,
        incidentResponse: i % 2 === 0,
        mfaEnforced: i % 5 !== 0
      },
      geopolitical: {
        countriesOfOperations: countryObj.name,
        sanctionedCountryExposure: i === 12,
        politicalStability: Math.floor(3 + Math.random() * 3),
        exportControls: i % 8 === 0
      },
      recommendations: `Overall risk is quantified at level ${riskScore < 30 ? "LOW" : riskScore < 60 ? "MEDIUM" : "HIGH"}. Recommended actions include: periodic audit, secure data logs, and establishing ${i % 5 === 0 ? 'secondary source supply channels' : 'standard SLAs'}.`
    });
  }

  // 80 Purchase Orders
  const purchaseOrders: PurchaseOrder[] = [];
  const poStatuses: PurchaseOrder['status'][] = ['Approved', 'Sent', 'Received', 'Received', 'Pending Approval', 'Cancelled', 'Draft'];
  const pStatusOptions: PurchaseOrder['paymentStatus'][] = ['Paid', 'Unpaid', 'Partially Paid', 'Overdue'];

  for (let i = 1; i <= 80; i++) {
    const id = `PO-2024-${String(i).padStart(4, '0')}`;
    const vendorIndex = (i * 7) % 50;
    const vendor = vendors[vendorIndex];
    const status = i < 4 ? 'Pending Approval' : i === 12 ? 'Cancelled' : i === 25 ? 'Draft' : i < 30 ? 'Sent' : i < 50 ? 'Approved' : 'Received';
    const paymentStatus = status === 'Received' ? (i % 5 === 0 ? 'Partially Paid' : 'Paid') : status === 'Sent' || status === 'Approved' ? (i % 7 === 0 ? 'Overdue' : 'Unpaid') : 'Unpaid';
    const itemsCount = 1 + (i % 4);
    const itemUnitPrice = Math.floor(100 + (i * 35));
    const qty = 5 + (i * 3) % 25;
    const poValue = qty * itemUnitPrice * itemsCount;

    const itemsList = Array.from({ length: itemsCount }).map((_, itemI) => {
      const code = `ITM-${1000 + itemI + i}`;
      const nameSpec = `${vendor.category} Component / Service Alpha-${itemI}`;
      const rowPrice = itemUnitPrice * (1 - (itemI * 0.05));
      const rowQty = qty;
      const sub = rowQty * rowPrice;
      const discountVal = i % 5 === 0 ? 10 : 0;
      const taxRateVal = 18;
      const discountAmt = sub * (discountVal / 100);
      const rowTax = (sub - discountAmt) * (taxRateVal / 100);
      const total = sub - discountAmt + rowTax;
      
      return {
        code,
        description: nameSpec,
        qty: rowQty,
        unit: 'Units',
        unitPrice: rowPrice,
        discount: discountVal,
        taxRate: taxRateVal,
        total: Math.round(total * 100) / 100
      };
    });

    purchaseOrders.push({
      id,
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      title: `Procurement of ${vendor.category} materials-${i}`,
      itemsCount,
      poValue: itemsList.reduce((acc, curr) => acc + curr.total, 0),
      createdDate: `2026-05-${String(1 + (i % 25)).padStart(2, '0')}`,
      requiredBy: `2026-07-${String(1 + (i % 28)).padStart(2, '0')}`,
      approvedBy: users[i % users.length].name,
      status,
      paymentStatus,
      priority: i % 10 === 0 ? 'Urgent' : i % 5 === 0 ? 'High' : 'Normal',
      deliveryAddress: `Warehouse Node 3, Dock ${2 + (i % 5)}, Chicago IL US`,
      paymentTerms: 'Net 30',
      notes: "Ensure materials are certified under standard specifications.",
      items: itemsList
    });
  }

  // 40 Contracts
  const contracts: Contract[] = [];
  const cStatuses: Contract['status'][] = ['Active', 'Active', 'Active', 'Expiring Soon', 'Expired', 'Draft', 'Terminated'];
  const cTypes: Contract['type'][] = ['MSA', 'SLA', 'NDA', 'Procurement', 'Service', 'Framework'];

  for (let i = 1; i <= 40; i++) {
    const id = `CTR-${String(100 + i).padStart(4, '0')}`;
    const vendorIndex = (i * 11) % 50;
    const vendor = vendors[vendorIndex];
    let status: Contract['status'] = 'Active';
    if (i === 4 || i === 18) status = 'Expiring Soon';
    else if (i === 10) status = 'Expired';
    else if (i === 15) status = 'Draft';
    else if (i === 32) status = 'Terminated';

    const value = Math.floor(50000 + (i * 35000));
    const startYear = 2024 + (i % 2);
    const startM = String(1 + (i % 11)).padStart(2, '0');
    const endYear = startYear + 2 + (i % 2);
    const endM = startM;
    const daysRemaining = status === 'Expired' ? 0 : status === 'Expiring Soon' ? 25 : 300 + (i * 10);

    contracts.push({
      id,
      vendorId: vendor.id,
      vendorName: vendor.name,
      title: `Master Services Agreement for ${vendor.category}`,
      type: cTypes[i % cTypes.length],
      value,
      startDate: `${startYear}-${startM}-15`,
      endDate: `${endYear}-${endM}-15`,
      daysRemaining,
      status,
      owner: users[i % users.length].name,
      autoRenew: i % 2 === 0,
      paymentTerms: i % 3 === 0 ? 'Net 60' : 'Net 30',
      noticePeriodDays: 60,
      governingLaw: "Delaware, US",
      jurisdiction: "State of Delaware",
      specialTerms: "Supplier warrants a 99.9% availability for system components and standard operational efficiency.",
      milestones: [
        { name: "Initial Implementation", dueDate: `${startYear}-${startM}-30`, status: 'Completed', amount: value * 0.25 },
        { name: "Quarterly Audit 1", dueDate: `${startYear}-${String(Number(startM)+3).padStart(2, '0')}-30`, status: 'Completed', amount: value * 0.25 },
        { name: "SLA Evaluation", dueDate: `${endYear}-${endM}-10`, status: 'Pending', amount: value * 0.5 }
      ],
      documents: [
        { id: `DOC-${i}-1`, name: "Signed_Contract_Main.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2025-01-14", uploadedBy: "Elena Rostova" },
        { id: `DOC-${i}-2`, name: "Annexure_A_SLA_Specs.pdf", type: "pdf", size: "1.1 MB", uploadedAt: "2025-01-14", uploadedBy: "Elena Rostova" }
      ]
    });
  }

  // 60 Invoices
  const invoices: Invoice[] = [];
  for (let i = 1; i <= 60; i++) {
    const id = `INV-${String(2024 + i).padStart(4, '0')}`;
    const vendorIndex = (i * 13) % 50;
    const vendor = vendors[vendorIndex];
    const poRef = `PO-2024-${String(1 + (i % 30)).padStart(4, '0')}`;
    const amount = Math.floor(1000 + (i * 300));
    const taxAmount = Math.round(amount * 0.18 * 100) / 100;
    const total = amount + taxAmount;
    
    let status: Invoice['status'] = 'Received';
    let paymentStatus: Invoice['paymentStatus'] = 'Unpaid';
    if (i < 20) {
      status = 'Paid';
      paymentStatus = 'Paid';
    } else if (i < 30) {
      status = 'Approved';
      paymentStatus = 'Processing';
    } else if (i % 7 === 0) {
      status = 'Disputed';
      paymentStatus = 'Under Review';
    } else if (i % 9 === 0) {
      status = 'Overdue';
      paymentStatus = 'Unpaid';
    } else if (i % 4 === 0) {
      status = 'Under Review';
      paymentStatus = 'Under Review';
    }

    invoices.push({
      id,
      vendorId: vendor.id,
      vendorName: vendor.name,
      poRef,
      invoiceDate: `2026-05-${String(1 + (i % 25)).padStart(2, '0')}`,
      dueDate: `2026-06-${String(15 + (i % 14)).padStart(2, '0')}`,
      amount,
      taxAmount,
      total,
      status,
      paymentStatus,
      threeWayMatch: {
        po: true,
        grn: i % 10 !== 0,
        invoice: true
      },
      disputeReason: i % 7 === 0 ? "Price Discrepancy" : undefined,
      disputeDescription: i % 7 === 0 ? "The units are charged at a rate 10% higher than renegotiated terms in Master Contract." : undefined,
      items: [
        { description: `Standard delivery of ${vendor.category} equipment`, qty: 25, unitPrice: amount / 25, total: amount }
      ],
      notes: "Invoice received electronically via integration portal."
    });
  }

  // Savings initiatives YTD
  const savingsInitiatives: SavingsInitiative[] = [
    { id: "SAV-0001", title: "Cloud Services Consolidation", category: "IT Services", vendorId: "VND-0040", vendorName: "Apex Technologies Ltd", savingType: "Demand Reduction", baselineCost: 450000, negotiatedCost: 320000, savingAmount: 130000, savingPercent: 28.8, status: "Realized", owner: "Alex Mercer", targetDate: "2026-01-10", verifiedBy: "Michael Chang" },
    { id: "SAV-0002", title: "Global Logistics Volume Repricing", category: "Logistics", vendorId: "VND-0043", vendorName: "NovaStar Logistics", savingType: "Volume Discount", baselineCost: 800000, negotiatedCost: 680000, savingAmount: 120000, savingPercent: 15.0, status: "Realized", owner: "Alex Mercer", targetDate: "2026-02-15", verifiedBy: "Michael Chang" },
    { id: "SAV-0003", title: "Steel Tariff Mitigation Contract", category: "Raw Materials", vendorId: "VND-0047", vendorName: "Titan Steel Corp", savingType: "Negotiation", baselineCost: 1500000, negotiatedCost: 1350000, savingAmount: 150000, savingPercent: 10.0, status: "Realized", owner: "Dwight Schrute", targetDate: "2026-03-01", verifiedBy: "Michael Chang" },
    { id: "SAV-0004", title: "Facilities Management Automation", category: "Facilities", vendorId: "VND-0049", vendorName: "Beacon Facilities", savingType: "Process", baselineCost: 300000, negotiatedCost: 260000, savingAmount: 40000, savingPercent: 13.3, status: "Realized", owner: "Alex Mercer", targetDate: "2026-04-20", verifiedBy: "Oscar Martinez" },
    { id: "SAV-0005", title: "Legal Counsel Framework Repricing", category: "Legal", vendorId: "VND-0051", vendorName: "Aether Legal Partners", savingType: "Payment Terms", baselineCost: 250000, negotiatedCost: 220000, savingAmount: 30000, savingPercent: 12.0, status: "Projected", owner: "Elena Rostova", targetDate: "2026-06-30" },
    { id: "SAV-0006", title: "Packaging Standard Specification Shift", category: "Other", vendorId: "VND-0082", vendorName: "Swift Packaging Supply", savingType: "Specification Change", baselineCost: 180000, negotiatedCost: 150000, savingAmount: 30000, savingPercent: 16.6, status: "Pipeline", owner: "Ryan Howard", targetDate: "2026-08-15" },
    { id: "SAV-0007", title: "Recruiting Agency Fees Cap", category: "HR Services", vendorId: "VND-0050", vendorName: "Orion HR Partners", savingType: "Negotiation", baselineCost: 400000, negotiatedCost: 340000, savingAmount: 60000, savingPercent: 15.0, status: "On Hold", owner: "Alex Mercer", targetDate: "2026-09-01" },
    { id: "SAV-0008", title: "Marketing Campaign Consolidation", category: "Marketing", vendorId: "VND-0048", vendorName: "Zeta Marketing Agency", savingType: "Demand Reduction", baselineCost: 650000, negotiatedCost: 550000, savingAmount: 100000, savingPercent: 15.3, status: "Realized", owner: "Elena Rostova", targetDate: "2026-04-12", verifiedBy: "Michael Chang" }
  ];

  // 100+ Activity Logs
  const auditLogs: AuditLog[] = [];
  const logModules = ["Vendors", "Contracts", "POs", "Invoices", "Risk", "Users", "System"] as const;
  const logActions = ["Create", "Update", "Delete", "Login", "Export", "Approve"] as const;
  
  for (let i = 1; i <= 105; i++) {
    const id = `LOG-${String(i).padStart(4, '0')}`;
    const userObj = users[i % users.length];
    const module = logModules[i % logModules.length];
    const action = logActions[i % logActions.length];
    const hour = String(8 + (i % 10)).padStart(2, '0');
    const minute = String((i * 13) % 60).padStart(2, '0');
    const day = String(1 + (i % 5)).padStart(2, '0');
    const timestamp = `2026-06-0${day} ${hour}:${minute}`;

    auditLogs.push({
      id,
      timestamp,
      user: userObj.name,
      role: userObj.role,
      ipAddress: `192.168.1.${10 + i}`,
      module,
      action,
      entityId: module === 'Vendors' ? `VND-00${10 + i % 40}` : module === 'POs' ? `PO-2024-00${10 + i % 40}` : `CTR-01${10 + i % 20}`,
      description: `${action} operation completed successfully in ${module}. Affected ID: ${module === 'Vendors' ? 'VND' : module === 'POs' ? 'PO' : 'CTR'}-${10 + i % 40}.`,
      status: i % 20 === 0 ? 'Failed' : 'Success',
      details: i % 3 === 0 ? {
        before: { status: "Draft", value: 12000 },
        after: { status: "Active", value: 25000 }
      } : undefined
    });
  }

  // Calendar Events (incorporating correct types, matching calendar events requirements)
  // Calendar items should populate around June 2026
  const calendarEvents: CalendarEvent[] = [
    { id: "EV-001", title: "Apex Contract Renewal Due", type: "Contract Renewal", vendorId: "VND-0040", vendorName: "Apex Technologies Ltd", entityId: "CTR-0101", date: "2026-06-15", allDay: true, remindMe: "1 week before", assignTo: ["Alex Mercer"] },
    { id: "EV-002", title: "Monthly Payment Dispatch", type: "Payment Due", vendorId: "VND-0043", vendorName: "NovaStar Logistics", entityId: "INV-2045", date: "2026-06-25", allDay: false, startTime: "10:00", endTime: "11:00", remindMe: "3 days before", assignTo: ["Michael Chang"] },
    { id: "EV-003", title: "Insurance Cert Expiry Warning", type: "Document Expiry", vendorId: "VND-0047", vendorName: "Titan Steel Corp", entityId: "DOC-3", date: "2026-06-10", allDay: true, remindMe: "2 weeks before", assignTo: ["Elena Rostova"] },
    { id: "EV-004", title: "GlobalTrade Review Meeting", type: "Review Meeting", vendorId: "VND-0041", vendorName: "GlobalTrade GmbH", date: "2026-06-12", allDay: false, startTime: "14:00", endTime: "15:00", remindMe: "1 day before", assignTo: ["Alex Mercer", "Creed Bratton"] },
    { id: "EV-005", title: "NovaStar Regulatory Audit", type: "Audit Date", vendorId: "VND-0043", vendorName: "NovaStar Logistics", date: "2026-06-18", allDay: false, startTime: "09:00", endTime: "17:00", remindMe: "1 month before", assignTo: ["Elena Rostova", "Creed Bratton"] },
    { id: "EV-006", title: "Apex Delivery Deadline", type: "PO Delivery", vendorId: "VND-0040", vendorName: "Apex Technologies Ltd", entityId: "PO-2024-0014", date: "2026-06-08", allDay: true, remindMe: "3 days before", assignTo: ["Alex Mercer"] },
    { id: "EV-007", title: "Matrix Mfg Cybersecurity Assessment", type: "Risk Assessment", vendorId: "VND-0045", vendorName: "Matrix Manufacturing", date: "2026-06-20", allDay: false, startTime: "13:00", endTime: "14:30", remindMe: "1 day before", assignTo: ["Elena Rostova"] },
    { id: "EV-008", title: "Quarterly Audit 1 Review", type: "Review Meeting", date: "2026-06-14", allDay: false, startTime: "11:00", endTime: "12:00", remindMe: "1 day before", assignTo: ["Michael Chang", "Sarah Connor"] },
    { id: "EV-009", title: "W9 Document Verification", type: "Onboarding Deadline", vendorId: "VND-0042", vendorName: "ClearPath IT Solutions", date: "2026-06-14", allDay: true, remindMe: "2 days before", assignTo: ["Dwight Schrute"] }
  ];

  // Compliance Documents YTD
  const complianceDocs: ComplianceDoc[] = [];
  const docCategories = [
    'Business Licenses', 'Insurance Certs', 'Financial Statements', 'NDAs',
    'Regulatory Certs', 'Quality Certs', 'Tax Documents', 'ESG Reports', 'Contracts'
  ] as const;

  for (let i = 1; i <= 35; i++) {
    const v = vendors[i % vendors.length];
    const category = docCategories[i % docCategories.length];
    const id = `DOC-${String(i).padStart(4, '0')}`;
    const uploadDate = `2026-0${1 + (i % 5)}-${String(10 + (i % 18)).padStart(2, '0')}`;
    
    let expiryDate = '';
    let status: 'Active' | 'Expiring' | 'Expired' = 'Active';
    
    if (i % 6 === 0) {
      expiryDate = `2026-04-${String(10 + (i % 15)).padStart(2, '0')}`;
      status = 'Expired';
    } else if (i % 5 === 0) {
      expiryDate = `2026-06-${String(15 + (i % 15)).padStart(2, '0')}`;
      status = 'Expiring';
    } else {
      expiryDate = `2027-0${1 + (i % 9)}-${String(10 + (i % 18)).padStart(2, '0')}`;
      status = 'Active';
    }
    
    complianceDocs.push({
      id,
      name: `${v.name} - ${category} 2026`,
      vendorId: v.id,
      vendorName: v.name,
      category,
      uploadDate,
      expiryDate,
      status,
      verifiedBy: users[i % users.length].name,
      fileSize: `${(1.5 + (i * 0.4)).toFixed(1)} MB`,
      referenceNumber: `REF-${2026000 + i}`,
      issueDate: `2025-12-01`,
      issuingAuthority: category === 'Business Licenses' ? 'State Dept of Commerce' : category === 'Insurance Certs' ? 'Alliance Mutual Insurance' : 'Internal Audit Dept',
      notes: `Periodic document submission for compliance tracking. Verified against standard checklists.`
    });
  }

  return {
    vendors,
    purchaseOrders,
    contracts,
    invoices,
    riskAssessments,
    esgScorecards,
    calendarEvents,
    savingsInitiatives,
    auditLogs,
    users,
    complianceDocs
  };
}

export function generateInitialMockData() {
  const seed = generateSeedData();
  return {
    vendors: seed.vendors,
    pos: seed.purchaseOrders,
    contracts: seed.contracts,
    invoices: seed.invoices,
    riskAssessments: seed.riskAssessments,
    esgScorecards: seed.esgScorecards,
    calendarEvents: seed.calendarEvents,
    savings: seed.savingsInitiatives,
    auditLogs: seed.auditLogs,
    users: seed.users,
    complianceDocs: seed.complianceDocs
  };
}

export interface ComplianceDoc {
  id: string;
  name: string;
  vendorId: string;
  vendorName: string;
  category: 'Business Licenses' | 'Insurance Certs' | 'Financial Statements' | 'NDAs' | 'Regulatory Certs' | 'Quality Certs' | 'Tax Documents' | 'ESG Reports' | 'Contracts';
  uploadDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring' | 'Expired';
  verifiedBy: string;
  fileSize: string;
  referenceNumber: string;
  issueDate?: string;
  issuingAuthority?: string;
  notes?: string;
}

export interface Payment {
  id: string;
}

export const MONTHLY_SPEND_DATA = [
  { name: 'Jan', spend: 450000, savings: 12000 },
  { name: 'Feb', spend: 520000, savings: 15000 },
  { name: 'Mar', spend: 490000, savings: 18005 },
  { name: 'Apr', spend: 610000, savings: 22000 },
  { name: 'May', spend: 580000, savings: 25000 },
  { name: 'Jun', spend: 680000, savings: 31000 },
];

export const CATEGORY_SPEND_SERIES = [
  { name: 'IT Services', value: 1200000 },
  { name: 'Raw Materials', value: 850000 },
  { name: 'Logistics', value: 620000 },
  { name: 'Manufacturing', value: 950000 },
  { name: 'Consulting', value: 410000 },
];
