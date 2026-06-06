Build a fully functional, zero-backend, mock Vendor Management System (VMS) web application using React with all state managed in-memory (useState, useReducer, useContext). This is a complete, production-grade enterprise UI. No real API calls. All data is hardcoded mock data and you prepare even more mock data with full interactivity, working filters, working forms, working modals, working charts, and all UI states covered.

═══════════════════════════════════════════════════════════════
TYPOGRAPHY & FONTS
═══════════════════════════════════════════════════════════════

- Primary font: Inter (import from Google Fonts)
- Secondary/display font: Roboto (import from Google Fonts)
- Apply Inter across all body text, labels, inputs, table cells, sidebar nav, badges, and paragraphs.
- Apply Roboto Bold/Black for all large headings (H1, H2, page titles, section headers, KPI metric numbers).
- Font size scale strictly as follows:
    - 11px: table column headers, meta labels, breadcrumb text
    - 12px: badge text, tag labels, helper text, timestamps, tooltips
    - 13px: table row data, sidebar nav items, small descriptions
    - 14px: body text, form labels, input placeholder text, button text
    - 16px: card titles, section subheadings, modal titles
    - 20px: page titles, panel headers
    - 28px: KPI metric numbers, big stat values on dashboard
    - 36px: hero numbers on overview dashboard cards
- Line height: 1.5 for body, 1.2 for headings
- Letter spacing: -0.02em for headings, 0 for body
- Font weight usage: 400 regular for body, 500 medium for labels and nav, 600 semibold for card titles and table headers, 700 bold for page titles, 800 extrabold for KPI big numbers

═══════════════════════════════════════════════════════════════
COLOR SCHEME — STRICT PALETTE
═══════════════════════════════════════════════════════════════

Background colors:
- Page background: #F4F5F7 (light cool grey)
- Sidebar background: #0F1729 (very dark navy)
- Card/panel background: #FFFFFF
- Table header background: #F8F9FB
- Input background: #FFFFFF
- Modal overlay: rgba(0,0,0,0.45)
- Modal background: #FFFFFF
- Hover row: #F0F4FF

Primary brand:
- Primary: #2563EB (strong blue)
- Primary hover: #1D4ED8
- Primary light tint: #EFF6FF (blue tint background for highlights)

Accent/secondary:
- Accent green (success/active): #16A34A
- Accent green light: #DCFCE7
- Accent amber (warning/pending): #D97706
- Accent amber light: #FEF3C7
- Accent red (danger/expired/critical): #DC2626
- Accent red light: #FEE2E2
- Accent purple (analytics): #7C3AED
- Accent purple light: #EDE9FE
- Accent teal (info): #0891B2
- Accent teal light: #CFFAFE

Text colors:
- Primary text: #111827
- Secondary text: #6B7280
- Muted/placeholder: #9CA3AF
- Sidebar nav text: #CBD5E1
- Sidebar nav active text: #FFFFFF
- Sidebar nav active bg: #2563EB
- Sidebar nav hover bg: #1E293B
- Link text: #2563EB

Borders:
- Default border: #E5E7EB
- Input border: #D1D5DB
- Input focus border: #2563EB
- Divider: #F3F4F6

Sidebar icons tint: #94A3B8

Status badge colors (exact):
- Active: bg #DCFCE7, text #15803D, dot #16A34A
- Pending: bg #FEF3C7, text #B45309, dot #D97706
- Inactive: bg #F3F4F6, text #6B7280, dot #9CA3AF
- Blocked: bg #FEE2E2, text #B91C1C, dot #DC2626
- Under Review: bg #EDE9FE, text #6D28D9, dot #7C3AED
- Expired: bg #FEE2E2, text #991B1B, dot #EF4444
- Draft: bg #F3F4F6, text #374151, dot #6B7280
- Approved: bg #DCFCE7, text #166534, dot #16A34A
- Rejected: bg #FEE2E2, text #991B1B, dot #DC2626
- Sent: bg #DBEAFE, text #1D4ED8, dot #2563EB

═══════════════════════════════════════════════════════════════
GLOBAL DESIGN RULES
═══════════════════════════════════════════════════════════════

- Border radius: 4px for all buttons. 6px for cards, modals, inputs, dropdowns, tags. 3px for table rows. 8px for large modals. 2px for badges/pills. NEVER use rounded-full or pill-shaped buttons.
- Box shadow for cards: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)
- Box shadow for modals: 0 20px 60px rgba(0,0,0,0.18)
- Box shadow for dropdowns: 0 4px 16px rgba(0,0,0,0.10)
- Spacing system: 4px base unit. All padding/margin in multiples of 4 (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- Card padding: 24px
- Page content padding: 32px
- Table cell padding: 12px 16px vertical and horizontal
- Input height: 38px
- Button height: 36px (default), 32px (small), 40px (large)
- Button padding: 0 16px (default), 0 12px (small), 0 20px (large)
- Sidebar width: 240px, fixed, full height
- Top header height: 60px, sticky, border-bottom: 1px solid #E5E7EB
- Section spacing between cards on a page: 24px gap
- All icons: use Lucide React icons throughout. Size 16px in buttons/tables, 18px in sidebar, 20px in section headers, 24px in KPI cards.
- All form inputs have a left-aligned label above them, 6px gap between label and input.
- Transitions: 150ms ease for hover states, 200ms ease for modals opening.
- No gradients anywhere except in the dashboard hero stat cards (subtle: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) for primary, etc.).
- Scrollbars: thin, #D1D5DB track, #9CA3AF thumb.

═══════════════════════════════════════════════════════════════
APP SHELL & NAVIGATION
═══════════════════════════════════════════════════════════════

SIDEBAR (fixed left, 240px wide, #0F1729 bg):
- Top: Logo area — "VendorFlow" in Roboto Bold 18px, white, with a small abstract hexagon icon in #2563EB to the left. Below logo: tiny text "Enterprise" in #94A3B8 10px.
- Navigation groups with section labels in #475569 uppercase 10px tracking-widest:
    OVERVIEW
        • Dashboard (LayoutDashboard icon)
    VENDORS
        • Vendor Directory (Building2 icon)
        • Onboarding (UserPlus icon)
        • Performance (BarChart3 icon)
        • Scorecards (Star icon)
    PROCUREMENT
        • Purchase Orders (ShoppingCart icon)
        • RFQ / Sourcing (FileSearch icon)
        • Contracts (FileText icon)
        • Invoices (Receipt icon)
    COMPLIANCE & RISK
        • Risk Assessment (ShieldAlert icon)
        • Compliance Documents (FolderLock icon)
        • Audit Logs (ClipboardList icon)
    FINANCE
        • Payments (Wallet icon)
        • Spend Analytics (TrendingUp icon)
    ADMINISTRATION
        • User Management (Users icon)
        • Settings (Settings icon)
        • Notifications (Bell icon)
- Active state: left border 3px solid #2563EB, bg #2563EB, text white, icon white.
- Hover state: bg #1E293B, text #E2E8F0.
- Each nav item: height 40px, flex row, icon left 18px size, label 13px Inter medium, 12px left padding for icon, 8px gap between icon and label.
- Bottom of sidebar: user avatar area — circular avatar 32px, name "Alex Mercer" in white 13px, role "Procurement Manager" in #94A3B8 11px, and a logout icon button.

TOP HEADER (60px, white, border-bottom #E5E7EB, sticky):
- Left: Page title in Roboto Bold 20px #111827, and breadcrumb below in 11px #9CA3AF (e.g. "VendorFlow / Dashboard")
- Right: Global search bar (width 260px, 38px height, magnifier icon inside, placeholder "Search vendors, POs, contracts..."), then a notification bell icon with a red badge count (e.g. "5"), then a divider, then the user avatar (32px circle) with name and role dropdown.
- The search bar on focus: border becomes #2563EB, subtle blue glow box-shadow.

═══════════════════════════════════════════════════════════════
PAGE 1: DASHBOARD (Overview)
═══════════════════════════════════════════════════════════════

Layout: full-width page, 32px padding all around.

TOP KPI CARDS ROW (5 cards, equal width, flex row, 16px gap):
Each card: white bg, 24px padding, 6px border-radius, shadow, flex column layout.
Card 1 — Total Vendors:
  - Icon box top-right: bg #EFF6FF, icon Building2 #2563EB 20px
  - Big number: "248" in Roboto 800 36px #111827
  - Label: "Total Vendors" 13px #6B7280 Inter
  - Trend below: green up arrow icon + "↑ 12 this month" in 12px #16A34A
Card 2 — Active Contracts:
  - Icon: FileText in #7C3AED on #EDE9FE bg
  - Number: "134"
  - Label: "Active Contracts"
  - Trend: "↑ 8 renewed" amber
Card 3 — Pending Approvals:
  - Icon: Clock in #D97706 on #FEF3C7 bg
  - Number: "27"
  - Label: "Pending Approvals"
  - Trend: "↓ 4 from last week" red
Card 4 — Total Spend (MTD):
  - Icon: DollarSign in #16A34A on #DCFCE7
  - Number: "$4.2M"
  - Label: "Spend This Month"
  - Trend: "↑ 6.4% vs last month"
Card 5 — Open Risk Issues:
  - Icon: ShieldAlert in #DC2626 on #FEE2E2
  - Number: "11"
  - Label: "Open Risk Issues"
  - Trend: "3 critical, 8 medium"

SECOND ROW: Two panels side by side (60/40 split):

LEFT PANEL — "Monthly Spend Trend" (60%):
- Card with title "Spend Overview" 16px semibold, subtitle "Last 12 months · All categories" 12px #6B7280
- Top-right: dropdown filter "All Categories ▾" (small select, 32px height)
- Chart: Recharts AreaChart, dual lines/areas — "Total Spend" (blue #2563EB filled area, low opacity) and "Budget" (dashed line #D97706). X-axis: months Jan–Dec. Y-axis: $0–$6M. Show grid lines in #F3F4F6. Custom tooltip with white bg, shadow, showing month + spend + budget values. Chart height 280px.

RIGHT PANEL — "Vendor Status Distribution" (40%):
- Card with title "Vendor Status" 16px semibold
- Recharts DonutChart (PieChart with innerRadius): slices for Active (148, #2563EB), Pending (42, #D97706), Under Review (31, #7C3AED), Inactive (18, #6B7280), Blocked (9, #DC2626). Center of donut: "248 Total" in Roboto Bold 20px. Legend below chart: each item as a colored dot + label + count + percentage. Height 280px.

THIRD ROW: Three panels (33/33/33):

PANEL A — "Top Performing Vendors" (table-style list):
- Card title "Top Vendors by Score" + "View All →" link right
- List of 6 vendors: rank number, vendor logo placeholder (colored 32px circle with initials), vendor name 14px bold, category tag (e.g. "IT Services"), performance score as a small horizontal bar (green fill) + "94/100" text. Alternate row bg.

PANEL B — "Recent Purchase Orders":
- Card title "Recent POs" + filter tabs "All | Pending | Approved | Rejected" (tab pills, active = blue bg)
- Table rows: PO Number, Vendor, Amount, Status badge, Date. 5 rows. Clickable rows.

PANEL C — "Upcoming Contract Renewals":
- Card title "Renewals Due"
- List of 5 contracts: contract ID, vendor name, days remaining shown as a countdown badge (red if <30 days, amber if 30–90, green if >90), renewal value. Small "Renew" button on each row.

FOURTH ROW: Two panels (50/50):

PANEL D — "Spend by Category" BarChart:
- Horizontal bar chart (Recharts BarChart layout="vertical"). Categories: IT Services, Raw Materials, Logistics, Consulting, Marketing, Facilities, Legal, HR Services. Each bar in a different hue of blue/teal. Values shown at bar end. Height 300px.

PANEL E — "Risk Heatmap by Vendor Tier":
- A CSS grid heatmap (not a chart library — pure CSS). Rows: Tier 1, Tier 2, Tier 3. Columns: Financial Risk, Compliance Risk, Operational Risk, Cybersecurity Risk, Geopolitical Risk. Each cell: colored box from light to dark red based on risk level (0-4 scale → #DCFCE7, #FEF3C7, #FED7AA, #FECACA, #DC2626). Risk score number in center of each cell. Legend below.

BOTTOM ROW: Activity Feed + Quick Actions:

ACTIVITY FEED — "Recent Activity" card (60%):
- Scrollable list of 10 activity items. Each item: colored icon circle (16px) + description text 13px + timestamp 11px #9CA3AF. Types: vendor approved, PO created, contract signed, invoice received, risk flag raised, payment processed, document uploaded, compliance check completed. Alternate subtle bg.

QUICK ACTIONS (40%):
- Card "Quick Actions" with 6 large clickable action buttons in a 2x3 grid:
  + Add New Vendor (blue, UserPlus icon)
  + Create Purchase Order (green, ShoppingCart)
  + Generate RFQ (teal, FileSearch)
  + Upload Document (amber, Upload)
  + Run Risk Assessment (red, ShieldAlert)
  + Schedule Audit (purple, Calendar)
  Each button: 80px height, icon top 24px, label 12px below, subtle hover fill, border 1px solid respective color tint.

═══════════════════════════════════════════════════════════════
PAGE 2: VENDOR DIRECTORY
═══════════════════════════════════════════════════════════════

Page title: "Vendor Directory" + subtitle "248 vendors registered across all categories"

TOP CONTROLS BAR (full width, flex row):
- Left: Search input "Search by name, ID, category..." (40% width)
- Filters row: dropdown "Category ▾" | dropdown "Status ▾" | dropdown "Tier ▾" | dropdown "Country ▾" | date range picker "Onboarded Date"
- Right: "Filter" button (outlined) + "Reset" (text link) + divider + toggle between Grid View and Table View icons + "Export CSV" button + "+ Add Vendor" primary button

TABLE VIEW (default):
Full-width table with sticky header. Columns:
1. Checkbox (select all / individual)
2. Vendor ID (e.g. VND-0042) — monospace 12px, clickable link color
3. Vendor Name — with 36px colored avatar circle (initials) and name bold 14px, category in 11px #6B7280 below
4. Category — tag/badge pill
5. Tier — "Tier 1 / 2 / 3" with colored badge
6. Country — flag emoji + country name 13px
7. Contact — email icon 12px link + phone number 12px
8. Status — status badge (Active/Pending/Blocked etc.)
9. Risk Score — circular progress indicator 32px OR score out of 100, color coded
10. Contract Value — "$XXX,XXX" right-aligned
11. Performance Score — mini star rating (out of 5) + numeric score
12. Onboarded Date — relative date "2 years ago" with full date tooltip
13. Actions — three-dot menu (⋯) expanding to: View, Edit, Deactivate, Run Assessment, Delete (red)

Table has: alternating row bg (#F8F9FB every other), hover row bg #F0F4FF, 1px bottom border #F3F4F6 per row. Sticky top header bg #F8F9FB. Sortable columns — click header to sort asc/desc with arrow icon. Show 25 rows per page. Pagination footer: "Showing 1–25 of 248" + prev/next buttons + page number buttons.

GRID VIEW (toggle):
Cards in 4-column grid, 16px gap. Each card (240px wide, white bg, 6px radius, shadow):
- Top: full-width colored band (category color, 48px height) with vendor initials circle centered
- Body: vendor name 15px bold center, category tag center, star rating center
- Stats row: 3 mini stats (POs: 12 | Spend: $240K | Score: 91)
- Bottom: status badge left + "View →" button right. Border-top #F3F4F6.

BULK ACTIONS BAR (shown when rows selected):
Sticky bar appearing at bottom of screen: "14 vendors selected" + buttons: [Export Selected] [Assign Category] [Change Status] [Delete Selected] — animated slide-up, bg #0F1729, white text.

═══════════════════════════════════════════════════════════════
PAGE 2B: VENDOR DETAIL PAGE (click vendor → drill-down)
═══════════════════════════════════════════════════════════════

Two-column layout: Left 340px sidebar info panel | Right main content with tabs.

LEFT SIDEBAR PANEL (white card, 24px padding):
- Large avatar circle 64px with initials + status dot overlay
- Vendor name H2 Roboto Bold 22px
- Category badge + Tier badge side by side
- Divider
- Info grid (label: value pairs):
    Vendor ID: VND-0042
    Status: [badge]
    Country: 🇩🇪 Germany
    City: Munich
    Address: (full address)
    Website: link icon + domain
    Phone: +49 89 123456
    Primary Email: vendor@email.com
    Tax ID: DE291837465
    Registered: Jan 14, 2022
    Onboarded By: Alex Mercer
- Divider
- "Assigned Contacts" section: 2-3 contact cards (avatar, name, role, email, phone)
- Divider
- "Documents" mini list: 4 uploaded docs with file icon, name, date, download icon
- Action buttons at bottom: [Edit Vendor] [Run Assessment] [Deactivate]

RIGHT MAIN CONTENT — Tabs navigation:
Tab 1: Overview
Tab 2: Performance
Tab 3: Contracts
Tab 4: Purchase Orders
Tab 5: Invoices
Tab 6: Risk & Compliance
Tab 7: Documents
Tab 8: Activity Log

TAB 1 — OVERVIEW:
- 4 mini KPI cards row: Total POs | Total Spend | Active Contracts | Avg Score
- "Vendor Description" text paragraph (mock lorem about vendor)
- Two columns: "Business Information" (table of key-value) + "Financial Details" (bank info, payment terms, credit limit)

TAB 2 — PERFORMANCE:
- Recharts LineChart: Monthly performance score over 12 months. Tooltip. Reference line at 80 (benchmark). Color: #2563EB line, #DCFCE7 fill area.
- KPI breakdown: 5 metrics in horizontal cards: On-Time Delivery Rate 92%, Defect Rate 1.2%, Response Time 4.2 hrs, Invoice Accuracy 98.5%, Price Variance -2.1%
- Recharts RadarChart: 6 dimensions — Quality, Reliability, Communication, Pricing, Compliance, Innovation. Two series: Vendor score (blue) vs Industry avg (dashed grey).
- Performance history table: Date | Review Period | Score | Reviewer | Notes | Status

TAB 3 — CONTRACTS:
- Table of all contracts for this vendor: Contract ID | Title | Value | Start Date | End Date | Days Remaining (countdown badge) | Status | Actions
- "+ New Contract" button top right

TAB 4 — PURCHASE ORDERS:
- Table: PO Number | Date | Items | Total | Status | Delivery Date | Actions
- Status filter tabs above

TAB 5 — INVOICES:
- Table: Invoice Number | PO Ref | Amount | Issue Date | Due Date | Payment Status | Actions

TAB 6 — RISK & COMPLIANCE:
- Risk Score gauge chart (semicircle) showing overall score 67/100 in the center, color bands: red (0-40), amber (40-70), green (70-100)
- Risk categories table: Financial Risk | Operational Risk | Compliance Risk | Cybersecurity Risk | Geopolitical Risk — each with score, level (Low/Medium/High/Critical), last assessed date, next review date
- Compliance checklist: each row has document name, required?, uploaded?, expiry date, status badge, download icon

TAB 7 — DOCUMENTS:
- File list with icons by type (PDF red, DOCX blue, XLSX green, IMG grey), filename, category tag, size, upload date, uploaded by, and actions (Download / Preview / Delete)

TAB 8 — ACTIVITY LOG:
- Timeline-style log. Left vertical line with dot nodes. Each node: timestamp, user avatar + name, action description, affected entity. Filter by action type dropdown.

═══════════════════════════════════════════════════════════════
PAGE 3: VENDOR ONBOARDING
═══════════════════════════════════════════════════════════════

Three sections on this page:

SECTION A — Onboarding Pipeline (top):
Horizontal Kanban-style pipeline board with 6 columns:
1. New Request (count badge)
2. Document Collection
3. Compliance Review
4. Risk Assessment
5. Approval Pending
6. Onboarded

Each column: 220px wide, bg #F8F9FB, 6px radius, scrollable vertically. Cards inside each column: white bg, shadow, 12px padding, vendor name bold, category badge, submitted date, days in stage (e.g. "Day 3"), assigned reviewer, progress bar (% docs uploaded), action buttons "View" + "Move Forward →". Drag and drop visual hint (cursor: grab on card hover).

SECTION B — New Vendor Onboarding Form (multi-step form, full modal):
Triggered by "+ Onboard New Vendor" button.
Step indicator at top: 5 circles connected by line — Step 1, 2, 3, 4, 5 — active = filled blue, complete = green check, upcoming = grey outline.

STEP 1 — Basic Information:
Fields (2-column grid where stated):
- Company Legal Name (full width) — required
- Trading Name / DBA
- Vendor Category [dropdown: IT Services | Raw Materials | Logistics | Consulting | Marketing | Facilities | Legal | HR Services | Manufacturing | Other]
- Vendor Tier [Radio buttons: Tier 1 – Strategic | Tier 2 – Preferred | Tier 3 – Transactional]
- Business Type [dropdown: Corporation | LLC | Partnership | Sole Proprietor | Government | Non-Profit]
- Country of Registration [searchable dropdown with flags]
- State/Province
- Registered Address (full width)
- City | ZIP Code (2 col)
- Website URL
- Year Established | Number of Employees (2 col)
- Annual Revenue Range [dropdown]
- Description / Notes (textarea, 4 rows)
Buttons: [Cancel] [Save Draft] [Next: Contact Info →]

STEP 2 — Contact Information:
- Primary Contact: First Name | Last Name (2 col), Job Title, Email, Phone, Department
- Secondary Contact (same fields, collapsible)
- Accounts Payable Contact: Name, Email, Phone
- Add another contact [+ Add Contact] link
Buttons: [← Back] [Save Draft] [Next: Financial Details →]

STEP 3 — Financial & Banking Details:
- Tax Identification Number (TIN/EIN/VAT)
- Tax Jurisdiction [dropdown]
- Payment Terms [dropdown: Net 15 | Net 30 | Net 45 | Net 60 | Net 90 | Immediate]
- Preferred Payment Method [Radio: Bank Transfer | Check | ACH | Wire | PayPal | Other]
- Bank Name | Branch Name (2 col)
- Account Holder Name (full width)
- Account Number | Routing Number (2 col)
- IBAN | SWIFT/BIC (2 col)
- Currency [dropdown: USD | EUR | GBP | INR | JPY | CAD | AUD]
- Credit Limit Requested [number input with $ prefix]
- W-9 / W-8 form upload dropzone (dashed border, upload icon, "Drag & drop or click to upload", accepted: PDF, max 5MB)
Buttons: [← Back] [Save Draft] [Next: Documents →]

STEP 4 — Document Upload:
List of required documents as a checklist table:
Document | Required | Upload | Status | Notes
- Business License / Registration Certificate | Required | [Upload button] | [Not Uploaded]
- Certificate of Insurance | Required | [Upload] | ...
- W-9 / W-8BEN | Required | [Upload] | ...
- Non-Disclosure Agreement (NDA) | Required | [Upload] | ...
- Bank Account Verification Letter | Required | [Upload] | ...
- SOC 2 / ISO 27001 Certificate | Conditional | [Upload] | ...
- GDPR Compliance Declaration | Conditional | [Upload] | ...
- Financial Statements (Last 2 Years) | Optional | [Upload] | ...
- References / Case Studies | Optional | [Upload] | ...
Each row: doc name, required badge, upload button that opens file picker, status (Not Uploaded / Uploaded ✓ / Rejected ✗), and a notes field.
Progress bar above table: "5 of 9 documents uploaded (4 required remaining)"
Buttons: [← Back] [Save Draft] [Next: Review & Submit →]

STEP 5 — Review & Submit:
Accordion sections showing all entered data for review:
- Basic Information (expand/collapse)
- Contact Information
- Financial Details (bank fields masked: ****1234)
- Documents (list with status)
Declaration checkbox: "I certify that all information provided is accurate and complete."
Submit button (large, full-width, blue): "Submit for Review"
A success state after submission: green checkmark animation, "Application Submitted!", confirmation number, expected review time "3–5 business days".

SECTION C — Onboarding Status Table:
Table below the Kanban: all in-progress onboardings with columns: Application ID | Vendor Name | Category | Stage | Submitted Date | Assigned Reviewer | Docs Complete | Days in Pipeline | Status | Actions

═══════════════════════════════════════════════════════════════
PAGE 4: VENDOR PERFORMANCE & SCORECARDS
═══════════════════════════════════════════════════════════════

CONTROLS BAR:
- Period selector: [Q1 2024] [Q2 2024] [Q3 2024] [Q4 2024] [Full Year] — tab pills
- Category filter dropdown, Tier filter dropdown
- "Generate Report" button + "Schedule Review" button

TOP ROW — 5 KPI CARDS (same style as dashboard):
- Avg Performance Score: 84.2
- On-Time Delivery Rate: 91.4%
- Avg Defect Rate: 1.8%
- Invoice Accuracy: 97.6%
- Response Time Avg: 5.1 hrs

SECOND ROW — Two charts:
LEFT (55%): Recharts GroupedBarChart — Top 10 vendors comparison: grouped bars for Quality Score (blue), Delivery Score (green), Pricing Score (amber) per vendor. X-axis: vendor names. Y-axis: 0–100. Legend top-right. Chart height 300px.

RIGHT (45%): Recharts ScatterPlot — X-axis: Spend ($), Y-axis: Performance Score. Each dot is a vendor, sized by number of POs, colored by tier (blue=Tier1, green=Tier2, amber=Tier3). Reference lines: horizontal at score 80 (benchmark), vertical at spend $500K. Tooltip on dot hover: vendor name, score, spend, POs. Height 300px.

THIRD ROW — Performance Table:
Full-width table. Columns:
Rank | Vendor Name | Category | Tier | Overall Score | Quality | Delivery | Pricing | Responsiveness | Compliance | Trend (sparkline 8 weeks) | Score Change | Last Reviewed | Actions
- Rank: #1, #2... with medal icon for top 3 (gold, silver, bronze small icons)
- Scores as colored numbers: green ≥80, amber 60–79, red <60
- Trend: tiny 8-point sparkline SVG (manual path, not recharts) — green if improving, red if declining
- Score Change: "+3.2" green or "-1.5" red with arrow

SCORECARD MODAL (click "Scorecard" action):
Large modal (740px wide):
- Vendor name header + score badge + period
- RadarChart 6 dimensions (center)
- Below radar: 6 metric breakdown rows (label + horizontal bar + score + weight %)
- Performance Comments textarea (editable)
- Reviewer name + date
- Previous scorecard comparison row
- [Save Scorecard] [Export PDF] [Send to Vendor] buttons

═══════════════════════════════════════════════════════════════
PAGE 5: PURCHASE ORDERS
═══════════════════════════════════════════════════════════════

TABS at top: All POs | Draft | Pending Approval | Approved | Sent | Received | Cancelled

FILTERS BAR: date range | vendor dropdown | category | amount range slider ($0–$5M) | "Advanced Filters" toggle

STATS ROW (4 cards):
- Total POs This Month: 142
- Total PO Value: $8.7M
- Avg PO Processing Time: 2.4 days
- POs Pending Approval: 27

PO TABLE:
Columns: ☐ | PO Number | Vendor | Category | Items Count | PO Value | Created Date | Required By | Approved By | Status | Payment Status | Actions
Monospace PO numbers (e.g. PO-2024-0892). Clickable row → PO detail modal.

PO DETAIL MODAL (720px wide, 2-section layout):

SECTION 1 — PO Header (top):
- PO Number large H2, Status badge, Created/Approved dates
- Two columns: Buyer Info (company name, address, contact) | Vendor Info (same layout)
- Payment Terms | Delivery Address | Notes

SECTION 2 — Line Items Table:
Columns: # | Item Code | Description | Unit | Qty | Unit Price | Discount % | Tax % | Total
Rows: editable when in draft. Footer row: Subtotal | Discount | Tax | Shipping | Grand Total (bold).

Below table: Attachments section, Approval Chain (stepper: Requester ✓ → Manager ✓ → Finance → [Pending] → Director → [Upcoming]), Notes thread.

PO CREATION FORM (full page or large modal):
Fields:
- PO Title (full width)
- Vendor [searchable dropdown — shows vendor name, ID, category in option]
- Delivery Date [date picker]
- Ship To Address [multi-line]
- Payment Terms [dropdown]
- Currency [dropdown]
- Priority [dropdown: Low | Normal | High | Urgent]
- Notes [textarea]
Line Items table (inline editable):
- "Add Item" button adds a new editable row
- Each row: Item Code (autocomplete) | Description | Qty | Unit | Unit Price | Discount | Tax Rate | Total (auto-calculated)
- Totals footer auto-calculates
- Attach Documents dropzone
Submit buttons: [Save as Draft] [Submit for Approval] [Cancel]

═══════════════════════════════════════════════════════════════
PAGE 6: RFQ / SOURCING
═══════════════════════════════════════════════════════════════

Two sub-tabs: Active RFQs | RFQ History | Create New RFQ

RFQ LIST TABLE:
RFQ Number | Title | Category | Vendors Invited | Responses Received | Deadline | Status | Created By | Actions

RFQ CREATION FORM (multi-step, large modal or full page):

Step 1 — RFQ Details:
- RFQ Title | Category | Description (textarea)
- Required Delivery Date | Submission Deadline (date pickers)
- Budget Estimate (hidden from vendors toggle)
- Evaluation Criteria (multi-select checklist: Price, Quality, Delivery Time, After-Sales Support, Technical Capability, References)
- Weightings: slider for each criterion (must total 100%)

Step 2 — Select Vendors:
- Search + filter vendor list (same filters as Vendor Directory)
- Checkbox multi-select table of vendors
- Selected vendors panel on right showing list with remove buttons
- "Invite All Tier 1 in Category" quick action

Step 3 — Line Items / Specifications:
- Table identical to PO line items but with Specification/Details column instead of Price (vendors will fill price in their response)
- Attachments section for specs/docs

Step 4 — Terms & Conditions:
- Standard terms text area (pre-filled with placeholder boilerplate)
- NDA required toggle
- Confidentiality level dropdown
- Questions/Clarifications allowed toggle

Step 5 — Review & Send

RFQ RESPONSE VIEW (modal):
When a vendor responds, show a comparison table:
Columns: Criteria | Vendor A | Vendor B | Vendor C | Best
Row-by-row comparison. Total score row (weighted). Recommendation badge on best.
"Award to Vendor" button opens award confirmation dialog.

═══════════════════════════════════════════════════════════════
PAGE 7: CONTRACTS
═══════════════════════════════════════════════════════════════

STATUS TABS: All | Draft | Active | Expiring Soon | Expired | Terminated

STATS ROW (4 cards):
- Total Active: 134 | Expiring in 30 days: 12 | Avg Contract Value: $320K | Total Contract Value: $42.8M

CONTRACT TABLE:
Contract ID | Title | Vendor | Type | Value | Start Date | End Date | Days Remaining | Status | Owner | Auto-Renew | Actions

CONTRACT DETAIL MODAL/PAGE:
- Full contract header: ID, title, parties, type badge, status badge
- Contract summary: value, payment terms, start/end, notice period, governing law
- Tabs inside: Overview | Milestones | Amendments | Linked POs | Documents | Audit Trail
- Milestone table: milestone name | due date | status | amount tied
- Document list: contract PDF, amendments, annexures

CONTRACT CREATION FORM:
- Contract Title
- Contract Type [dropdown: Procurement | Service | NDA | MSA | SLA | Lease | License | Framework]
- Vendor [searchable]
- Start Date | End Date [date pickers]
- Contract Value | Currency
- Payment Terms
- Renewal Type [dropdown: Manual | Auto-Renew | No Renewal]
- Notice Period Before Expiry [dropdown]
- Governing Law | Jurisdiction
- KPIs / SLAs section: add rows — KPI name, target, measurement frequency, penalty clause
- Special Terms textarea
- Upload signed contract (dropzone)
- Approval Chain configuration
[Save Draft] [Send for Signature] [Submit for Approval]

═══════════════════════════════════════════════════════════════
PAGE 8: INVOICES
═══════════════════════════════════════════════════════════════

STATUS TABS: All | Received | Under Review | Approved | Disputed | Paid | Overdue

STATS (4 cards): Total Invoices | Total Due | Overdue Amount | Avg Processing Time

INVOICE TABLE:
Invoice ID | Vendor | PO Reference | Invoice Date | Due Date | Amount | Tax Amount | Total | Status | Payment Status | Actions

INVOICE DETAIL MODAL:
- Header: Invoice number, dates, status badge
- Vendor + Buyer info side by side
- Line items table (same as PO)
- Totals footer
- Matching status: "3-way match" indicator — PO ✓ | GRN ✓ | Invoice ✓ (or X)
- Dispute section: raise dispute button → opens form with reason dropdown + description
- Payment details section: bank info, payment date if paid
- Audit history below

INVOICE PROCESSING FORM:
- Vendor selector
- PO Reference selector (auto-fills line items)
- Invoice Number | Invoice Date | Due Date
- Line Items table (editable)
- Totals
- Upload invoice document
- Notes

═══════════════════════════════════════════════════════════════
PAGE 9: RISK ASSESSMENT
═══════════════════════════════════════════════════════════════

TOP: Risk Overview Metrics (5 cards): Critical Risks | High Risks | Medium Risks | Low Risks | Vendors Not Yet Assessed

SECOND ROW — Two charts (50/50):
LEFT: Recharts StackedBarChart — Risk by Vendor Tier. X: Tier 1, 2, 3. Stacked bars: Critical (red), High (orange), Medium (amber), Low (green). Shows risk distribution per tier.
RIGHT: Recharts PieChart — Risk by Category (Financial, Operational, Compliance, Cybersecurity, Geopolitical). Color: 5 distinct brand tones.

RISK MATRIX VISUALIZATION:
Classic 5×5 risk matrix grid (Likelihood vs Impact). Cells colored from green (low) to red (critical). Each cell contains small vendor name chips showing which vendors sit in that risk quadrant. Clickable cells → show vendor list modal.

VENDOR RISK TABLE:
Vendor | Overall Risk Score | Financial | Operational | Compliance | Cyber | Geopolitical | Last Assessed | Risk Trend | Actions
- Risk trend: sparkline + "Improving / Stable / Deteriorating" badge
- Color code entire row for critical vendors

RISK ASSESSMENT FORM (modal):
- Vendor selector
- Assessment Date [date]
- Assessor [user dropdown]
5 Risk Category sections (each expandable accordion):
  FINANCIAL RISK:
    - Credit Rating [dropdown: AAA to CCC]
    - Financial Stability Assessment [1–5 radio]
    - Years in Business [number]
    - Publicly Listed? [Y/N toggle]
    - Outstanding Litigation? [Y/N + notes if yes]
  OPERATIONAL RISK:
    - Single Source Dependency? [Y/N]
    - Geographic Concentration [countries input]
    - Disaster Recovery Plan in place? [Y/N]
    - Key Personnel Dependency [Low/Medium/High]
    - Capacity Utilization % [slider]
  COMPLIANCE RISK:
    - Industry Certifications [multi-checkbox: ISO 9001, ISO 27001, SOC2, GDPR, HIPAA, PCI-DSS]
    - Regulatory Violations (last 3 yrs)? [Y/N + notes]
    - Anti-Bribery Policy [Y/N]
    - Sanctions Check [Pass/Fail/Pending]
    - Labor Practice Compliance [1–5]
  CYBERSECURITY RISK:
    - Data Access Level [None/Low/Medium/High/Critical]
    - Last Pen Test Date [date]
    - Encryption at Rest? [Y/N]
    - Encryption in Transit? [Y/N]
    - Incident Response Plan? [Y/N]
    - MFA Required for System Access? [Y/N]
  GEOPOLITICAL RISK:
    - Country of Operations [multi-select]
    - Sanctioned Country Exposure [Y/N]
    - Political Stability Rating [1–5]
    - Export Controls Applicable? [Y/N]
Overall calculated risk score (auto-computed, shown live as form fills).
Recommendations textarea.
[Save Draft] [Submit Assessment] [Generate Report]

═══════════════════════════════════════════════════════════════
PAGE 10: COMPLIANCE DOCUMENTS
═══════════════════════════════════════════════════════════════

DOCUMENT CATEGORIES (left sub-nav): All Documents | Business Licenses | Insurance Certs | Financial Statements | NDAs | Regulatory Certs | Quality Certs | Tax Documents | ESG Reports | Contracts

DOCUMENT TABLE:
Document ID | Document Name | Vendor | Category | Upload Date | Expiry Date | Status (Active/Expiring/Expired) | Verified By | File Size | Actions (Download / Preview / Flag)

Expiry status: color-coded — green (>90 days), amber (30–90 days), red (<30 days / expired).

DOCUMENT UPLOAD FORM (modal):
- Vendor [searchable dropdown]
- Document Type [dropdown list all categories]
- Document Name [text]
- Reference Number [text]
- Issue Date | Expiry Date [date pickers]
- Issuing Authority [text]
- Notes [textarea]
- File Upload [large dropzone: dashed border, icon, accepts PDF/DOCX/JPG/PNG, max 20MB, shows upload progress bar after file selected]
[Upload Document] [Cancel]

═══════════════════════════════════════════════════════════════
PAGE 11: AUDIT LOGS
═══════════════════════════════════════════════════════════════

FILTERS: Date Range | User | Module [dropdown: All, Vendors, Contracts, POs, Invoices, Risk, Users, System] | Action Type [Create / Update / Delete / Login / Export / Approve]

TABLE:
Log ID | Timestamp | User | Role | IP Address | Module | Action | Entity ID | Description | Status (Success/Failed) | Details icon (→ opens log detail)

LOG DETAIL PANEL (slide-in right drawer, 400px):
- Full timestamp
- User info with avatar
- Before/After JSON diff (side-by-side, color diff highlighting: green=added, red=removed, yellow=changed)
- Related entity link

═══════════════════════════════════════════════════════════════
PAGE 12: PAYMENTS
═══════════════════════════════════════════════════════════════

STATUS TABS: All | Scheduled | Processing | Completed | Failed | On Hold

STATS (4 cards): Payments This Month | Total Amount Paid | Pending Payments | Failed/Rejected

PAYMENTS TABLE:
Payment ID | Vendor | Invoice Ref | Amount | Currency | Method | Scheduled Date | Processed Date | Status | Reference Number | Actions

PAYMENT SCHEDULING FORM (modal):
- Vendor selector
- Invoice(s) selector (multi-select with checkboxes, auto-totals)
- Payment Date [date picker]
- Payment Method [Radio: Bank Transfer | ACH | Wire | Check]
- Bank Account [show last 4 digits of saved accounts for vendor]
- Currency
- Exchange Rate (if different currency — shows live mock rate)
- Notes / Reference
- Priority [Normal / Urgent]
[Schedule Payment] [Cancel]

═══════════════════════════════════════════════════════════════
PAGE 13: SPEND ANALYTICS
═══════════════════════════════════════════════════════════════

PERIOD CONTROLS: Date range picker + Compare to Prior Period toggle.

ROW 1 — 5 KPI cards: Total Spend | Spend vs Budget | Cost Savings | Maverick Spend % | Vendor Concentration (top 5 as % of total)

ROW 2 — Two large charts:
LEFT: Recharts AreaChart — Monthly Spend Trend (stacked areas by category: IT, Materials, Logistics etc.) 12 months. Legend. Height 300px.
RIGHT: Recharts BarChart — Budget vs Actual by Department/Category. Grouped bars. Height 300px.

ROW 3 — Three charts:
CHART A (33%): Recharts PieChart — Spend by Payment Terms (Net 30, Net 60, etc.)
CHART B (33%): Recharts LineChart — Price Variance Trend (% above/below benchmark) per month, reference line at 0%
CHART C (33%): Recharts BarChart horizontal — Top 10 Vendors by Spend

ROW 4 — Full width: Recharts ComposedChart — Spend (bars) + Savings (line) over 12 months. Dual Y-axis. Height 280px.

SPEND TABLE (full width, paginated):
Category | Vendor | Department | POs Count | Invoice Count | Total Spend | Budget | Variance | Variance % | QoQ Change | Actions (drill-down)

═══════════════════════════════════════════════════════════════
PAGE 14: USER MANAGEMENT
═══════════════════════════════════════════════════════════════

TABS: All Users | Active | Inactive | Pending Invite

USER TABLE:
Avatar | Name | Email | Role | Department | Last Login | Status | 2FA Enabled | Actions

ROLE BADGES: Admin (purple) | Procurement Manager (blue) | Finance Analyst (green) | Compliance Officer (teal) | Viewer (grey) | Vendor Portal User (amber)

INVITE USER MODAL:
- First Name | Last Name
- Email Address
- Role [dropdown with descriptions for each role]
- Department [dropdown]
- Permissions section: list of modules with Read / Write / None toggles per module
- Send Invite button

ROLE MANAGEMENT SUB-TAB:
Table of roles with permission matrix. Each role row shows which pages they can access (colored dots: full, read-only, none).

═══════════════════════════════════════════════════════════════
PAGE 15: SETTINGS
═══════════════════════════════════════════════════════════════

Left sub-nav tabs:
- General
- Company Profile
- Notifications
- Approval Workflows
- Integrations
- Security
- Data & Export

GENERAL:
- Company name, timezone, language, date format, currency, fiscal year start (all form fields)

COMPANY PROFILE:
- Logo upload (dropzone)
- Company details form

NOTIFICATIONS:
- Toggle list: Email notifications | In-app | SMS for each event type (PO Approved, Contract Expiring, Invoice Overdue, Risk Alert, New Vendor Registered, etc.)
- Notification frequency dropdown per event

APPROVAL WORKFLOWS:
- Visual workflow builder (simplified): drag-drop steps for PO approval, Contract approval, Vendor Onboarding approval. Each step: approver role/user, threshold amount, escalation time.

INTEGRATIONS:
- Cards for: SAP | Oracle | QuickBooks | NetSuite | Salesforce | Slack | MS Teams | DocuSign | Email (SMTP). Each card: logo, status (Connected / Not Connected), Connect/Disconnect button, last sync time.

SECURITY:
- Password policy settings (min length, complexity toggles)
- Session timeout [dropdown]
- 2FA enforcement toggle
- IP allowlist (text input)
- Audit log retention [dropdown]

═══════════════════════════════════════════════════════════════
NOTIFICATION CENTER (slide-in panel, right side)
═══════════════════════════════════════════════════════════════

Click bell icon → 400px right slide-in panel:
- Header: "Notifications" + "Mark All Read" + "Settings" icon
- TABS: All | Unread | Alerts | Approvals | System
- List: avatar/icon + notification text + timestamp + unread dot. Categories color-coded.
- Footer: "View All Notifications" link

═══════════════════════════════════════════════════════════════
GLOBAL MODALS & REUSABLE COMPONENTS
═══════════════════════════════════════════════════════════════

CONFIRMATION DIALOG: Small 400px modal. Warning icon (amber). Title + description. [Cancel] (outlined) + [Confirm Delete] (red filled) buttons. Background blur.

SUCCESS TOAST: Bottom-right toast, green bg, white text, checkmark icon, auto-dismiss 4s, slide-in animation.

ERROR TOAST: Same but red.

INFO TOAST: Same but blue.

LOADING STATES:
- Table loading: skeleton rows (animated shimmer, grey bars at different widths)
- Card loading: skeleton card with shimmer
- Button loading: spinner icon replaces icon, text becomes "Loading..." and button disabled.
- Page loading: top progress bar (blue, 3px height, animated slide from left to right) at top of page.

EMPTY STATES:
- Each table/list has an empty state: centered illustration placeholder (simple SVG of relevant icon, large, muted grey), large "No [items] found" text 16px, small description 13px #6B7280, and a CTA button.

FILTER CHIPS:
When filters applied: show filter chips below filter bar. Each chip: label + value + × remove. "Clear All" link at end.

SEARCH RESULTS HIGHLIGHT:
Search keyword highlighted in yellow bg within table cells.

COLUMN VISIBILITY TOGGLE:
In tables, a "Columns" button (Columns icon) opens a small dropdown with checkboxes to show/hide each column.

TABLE EXPORT:
"Export" button → dropdown: [Export CSV] [Export Excel] [Export PDF] — each triggers a simulated download success toast.

═══════════════════════════════════════════════════════════════
MOCK DATA REQUIREMENTS
═══════════════════════════════════════════════════════════════

Create realistic mock data arrays:
- 50 vendors with varied names, countries, categories, statuses, scores, spend amounts
- 80 purchase orders across various vendors and statuses
- 40 contracts at different stages
- 60 invoices with varied payment statuses
- 30 risk assessments
- 20 compliance documents per vendor (subset)
- 15 users with different roles
- 100+ activity log entries
- Monthly spend data for 12 months across 8 categories
- Performance scores for 12 months per vendor (generate via seed)

All IDs should be formatted: VND-XXXX, PO-2024-XXXX, CTR-XXXX, INV-XXXX, LOG-XXXX, etc.

═══════════════════════════════════════════════════════════════
INTERACTIVITY REQUIREMENTS
═══════════════════════════════════════════════════════════════

ALL of the following must work correctly:
✓ Sidebar navigation switches pages (no real routing needed — conditional render by state)
✓ All filter dropdowns filter the displayed table data in real-time
✓ Search bars filter table rows instantly on input
✓ Column sort on click — toggles asc/desc with arrow indicator
✓ Pagination updates displayed rows
✓ Row checkboxes — select/deselect, select all, bulk action bar shows/hides
✓ All modals open and close (open from button, close via X or Escape key or backdrop click)
✓ Multi-step forms advance/retreat between steps with validation on each step
✓ Form validation: required fields highlighted red with error message below on submit attempt
✓ Add Item buttons add editable rows in line-item tables with auto-calculated totals
✓ Status badge changes on action (e.g. Approve PO → status changes to Approved)
✓ Chart tooltips show on hover
✓ Tab switching within detail page
✓ Toggle between Table View and Grid View on Vendor Directory
✓ Accordion expand/collapse on risk assessment form sections
✓ Notification panel open/close
✓ Kanban column counts update as mock cards are present
✓ Toast notifications appear for: form submit success, form validation error, delete confirmation, export triggered
✓ Dark sidebar active state changes correctly on nav click
✓ All KPI cards, charts, tables pull from the same shared mock data arrays (consistent data)

═══════════════════════════════════════════════════════════════
RESPONSIVE LAYOUT (MINIMUM)
═══════════════════════════════════════════════════════════════

Design for 1440px primary target. At 1280px: sidebar collapses to icon-only (show only icons, tooltip on hover). At <1024px: show hamburger menu that opens sidebar as overlay.

═══════════════════════════════════════════════════════════════
ADDITIONAL MICRO-DETAILS
═══════════════════════════════════════════════════════════════

- All currency values: formatted with commas and 2 decimal places, prefixed with currency symbol
- All dates: "MMM DD, YYYY" format displayed, ISO format for inputs
- Percentage values: always show "%" suffix, color-coded positive/negative
- Long text in table cells: truncate with ellipsis + tooltip on hover showing full text
- Vendor names: never use generic "Vendor 1" — use realistic company names (e.g. "Apex Technologies Ltd", "GlobalTrade GmbH", "Meridian Supplies Inc", "NovaStar Logistics", "ClearPath IT Solutions")
- Category tags: each category has a distinct color (not all blue)
- Tier 1 badge: bg #DBEAFE text #1D4ED8, Tier 2: bg #DCFCE7 text #166534, Tier 3: bg #FEF3C7 text #92400E
- Numbers counting up animation on KPI cards when dashboard first loads (count from 0 to final value, 1.5s duration)
- Page transitions: subtle 150ms fade when switching sidebar pages
- Input autofocus on modal open
- All dropdowns use a custom styled component (no default browser select) with search and keyboard navigation
- The top header global search (when typed into) shows a dropdown popover with grouped results: Vendors (3), POs (2), Contracts (1) — each result row shows relevant info and links to the right page
- Sidebar footer user area: clicking opens a small menu (Profile / My Tasks / Change Password / Logout)
- All table "Actions" dropdown menus close when clicking outside
- All modals have max-height with overflow-y scroll for long content
- Print-friendly: "Export PDF" actions render a clean printable version via window.print() with hidden sidebar/header

This is a COMPLETE enterprise SaaS application UI. Every component, every form, every chart, every interaction must be fully built and functional. No placeholder boxes. No "coming soon" sections. No skeleton-only states without real data. Ship it as if it were a production demo for a Fortune 500 client.


═══════════════════════════════════════════════════════════════
ADDENDUM — ADDITIONAL FEATURES (ADD TO EXISTING VMS)
═══════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════
FEATURE A: VENDOR COMPARISON TOOL
═══════════════════════════════════════════════════════════════

Add "Compare Vendors" to the sidebar under VENDORS section
(GitCompare icon).

ENTRY POINTS:
- Sidebar nav item "Compare Vendors"
- In Vendor Directory table: when 2–4 vendors are checkbox-selected,
  a "Compare Selected" button appears in the bulk action bar
- On Vendor Detail page: "Compare with Another" button

PAGE LAYOUT:
Full-width page. Top bar: page title "Vendor Comparison" + subtitle
"Compare up to 4 vendors side by side". Right side: "Clear All" link
+ "Export Comparison" button.

VENDOR SELECTOR ROW (top of page):
4 selector slots in a flex row (equal width, 24px gap). Each slot:
- Empty state: dashed border 2px #D1D5DB, 6px radius, 180px height,
  centered content — large Plus icon (#9CA3AF 32px) + "Add Vendor"
  text 13px #9CA3AF + "Search to add" 11px #C0C8D0. Click → opens
  searchable dropdown popover showing vendor list with avatar,
  name, category. Selecting fills the slot.
- Filled state: white bg, shadow, 12px padding. Top: colored avatar
  circle 48px centered + vendor name 15px bold center + category
  badge center + status badge center. Bottom: small "×" remove button
  top-right corner of slot (absolute positioned). Slot border:
  1px solid #E5E7EB.
- Slots animate in (fade + scale from 0.95 to 1) when vendor added.

COMPARISON TABLE (below selector row):
Full-width table. First column: metric label (fixed 220px, bg #F8F9FB,
font 13px medium #374151). Subsequent columns: one per selected vendor
(equal width, min 200px). Header row of table shows vendor names again
with small avatar.

ROW GROUPS (each group has a grey section header row spanning full
width, bg #F3F4F6, text 11px uppercase #6B7280 bold, 8px 16px padding):

GROUP: OVERVIEW
- Overall Performance Score | numeric, color-coded + mini circular
  progress ring (32px, stroke 3px, color: green≥80, amber 60-79,
  red<60)
- Vendor Tier | badge
- Category | tag
- Country | flag + name
- Years Active | number + "yrs"
- Employees | formatted number
- Annual Revenue | $XXX range

GROUP: PERFORMANCE METRICS
- On-Time Delivery Rate | percentage + colored bar (full cell width,
  40px height, colored fill left-to-right, % label inside bar)
- Defect Rate | percentage (lower = better, inverse color logic:
  green if <2%, amber 2-5%, red >5%)
- Response Time | "X.X hrs" with color
- Invoice Accuracy | percentage + bar
- Price Variance | "+X.X%" or "-X.X%" with red/green color

GROUP: FINANCIAL
- Contract Value (Current) | $XXX,XXX
- Total Historical Spend | $X.XM
- Payment Terms | badge (Net 30, Net 60 etc.)
- Credit Limit | $XXX,XXX
- Outstanding Invoices | count + $amount

GROUP: RISK & COMPLIANCE
- Overall Risk Score | colored badge (Low/Medium/High/Critical) +
  numeric /100
- Financial Risk | colored dot + level text
- Cybersecurity Risk | colored dot + level text
- Compliance Risk | colored dot + level text
- Certifications | comma-separated tags (ISO 9001, SOC2 etc.) —
  truncate after 2, "+N more" chip

GROUP: CONTRACTS & ORDERS
- Active Contracts | count
- Total POs (All Time) | count
- Avg PO Value | $XXX
- Contract Renewal Date | date + days-remaining badge

GROUP: QUALITATIVE
- Radar chart (one per vendor column, 160px × 160px Recharts
  RadarChart embedded inside table cell): 6 axes — Quality,
  Delivery, Pricing, Communication, Compliance, Innovation.
  Each vendor's chart is its own color.

WINNER HIGHLIGHT LOGIC:
For each numeric/percentage row, the cell with the best value gets
a subtle green tint bg (#F0FDF4) + small trophy/star icon 12px in
top-right of cell. Worst value gets subtle red tint (#FFF5F5). Only
applies when 2+ vendors are selected.

BOTTOM SECTION — "Side-by-Side Charts":
Two Recharts charts in a row (50/50):
LEFT: Grouped BarChart — 6 performance dimensions, one bar group
per vendor, each vendor a different color. X: dimensions. Y: 0-100.
RIGHT: Recharts RadarChart — all selected vendors overlaid on same
radar. 6 axes. Each vendor: different color line + semi-transparent
fill. Legend below.

BOTTOM CTA ROW:
For each vendor column, a button at very bottom of comparison:
[View Full Profile] (outlined blue) + [Create PO] (outlined green)
+ [Start RFQ] (outlined teal). Buttons 32px height, 4px radius.

EMPTY STATE (no vendors selected):
Center of page: large illustration placeholder (two overlapping
document-like rectangles, simple SVG, muted grey/blue tones) +
"Select vendors to compare" H2 + "Choose up to 4 vendors from the
directory to see a detailed side-by-side comparison." 14px #6B7280
+ "Go to Vendor Directory" primary button.

═══════════════════════════════════════════════════════════════
FEATURE B: SAVINGS TRACKER
═══════════════════════════════════════════════════════════════

Add "Savings Tracker" to sidebar under FINANCE section
(PiggyBank icon).

PAGE HEADER:
Title "Savings Tracker" + subtitle "Track negotiated savings vs
baseline pricing across all categories and vendors." Right side:
Period selector tabs [Q1] [Q2] [Q3] [Q4] [Full Year] [Custom] +
"Add Saving" primary button.

ROW 1 — 5 KPI CARDS:
Card 1 — Total Savings YTD:
  Big number: "$1.84M" Roboto 800 36px green (#16A34A)
  Label: "Total Savings This Year"
  Trend: "↑ 23.4% vs last year" green
  Subtext: "Across 38 initiatives" #6B7280 12px
Card 2 — Savings Target:
  Number: "$2.5M" with a thin circular progress arc around it
  (180px donut, shows 73.6% filled in blue)
  Label: "Annual Savings Target"
  Subtext: "73.6% achieved"
Card 3 — Cost Avoidance:
  Number: "$620K" in #7C3AED
  Label: "Cost Avoidance"
  Trend: "↑ 11% vs target"
Card 4 — Negotiated Discounts:
  Number: "$940K" in #0891B2
  Label: "Contract Negotiations"
  Subtext: "18 contracts renegotiated"
Card 5 — Process Efficiency:
  Number: "$280K"
  Label: "Process Savings"
  Subtext: "Reduced admin overhead"

ROW 2 — WATERFALL CHART (full width):
Recharts ComposedChart styled as a waterfall:
X-axis categories: Baseline Spend | Volume Discounts | Contract
Renegotiation | Demand Consolidation | Early Payment Discounts |
Process Automation | Maverick Spend Reduction | Total Savings
Each bar either positive (green, going up from previous) or negative
(the totals bar in blue). Values labeled on top of each bar.
Title "Savings Waterfall — Where Savings Came From" 16px semibold.
Height 320px.

ROW 3 — Two charts (55/45):
LEFT — "Savings vs Target by Month" (55%):
Recharts ComposedChart: bars for Actual Savings (green), line for
Target (dashed #D97706). Dual series. X: months. Y: $0–$300K.
Reference line at monthly target. Area fill under actual line
(low opacity green). Custom tooltip. Height 280px.

RIGHT — "Savings by Category" (45%):
Recharts horizontal BarChart: categories on Y-axis (IT Services,
Raw Materials, Logistics, Consulting, Facilities, Marketing, Legal).
Each bar shows: dark fill = actual savings, light fill extension =
remaining gap to target. Values at bar end. Height 280px.

ROW 4 — SAVINGS INITIATIVES TABLE (full width):
Title "Savings Initiatives" + filter tabs [All | Realized |
Projected | Pipeline | On Hold] + search bar.

Columns:
Initiative ID | Title | Category | Vendor | Saving Type
(dropdown: Negotiation/Volume Discount/Process/Demand Reduction/
Specification Change/Payment Terms) | Baseline Cost | Negotiated
Cost | Saving Amount | Saving % | Status | Owner | Target Date |
Verified By | Actions

- Saving Amount cell: colored green bold + checkmark if verified
- Saving % cell: green badge if ≥10%, amber 5-10%, grey <5%
- Status badges: Realized (green), Projected (blue), Pipeline
  (amber), On Hold (grey)
- Actions: Edit | Verify | Archive | View Details

ADD SAVING MODAL (560px wide):
Fields:
- Initiative Title (full width)
- Saving Type [dropdown]
- Category [dropdown]
- Vendor [searchable dropdown]
- Related Contract / PO [searchable]
- Baseline Cost [number, $ prefix] — "What you were paying before"
  helper text 11px #9CA3AF below
- Negotiated Cost [number, $ prefix] — "New agreed price"
- Saving Amount [auto-calculated, read-only, green text]
- Saving % [auto-calculated, read-only]
- One-Time or Recurring [radio toggle]
- If Recurring: Annualized Value [auto-calculated field shown]
- Evidence / Notes [textarea]
- Status [dropdown]
- Owner [user dropdown]
- Target Realization Date [date picker]
- Supporting Documents [upload dropzone]
[Save Initiative] [Cancel]

BOTTOM: Savings by Vendor mini-table (top 10 vendors by savings
generated). Vendor | Category | Initiatives Count | Total Saved |
% of Total Savings | Avg Saving %.

═══════════════════════════════════════════════════════════════
FEATURE C: CALENDAR VIEW
═══════════════════════════════════════════════════════════════

Add "Calendar" to sidebar under OVERVIEW section (CalendarDays icon).

PAGE LAYOUT:
Full-width. Top controls bar:
- Left: [← Prev] [Today] [Next →] navigation buttons (outlined,
  36px, 4px radius). Current month+year label between them:
  "June 2026" in Roboto Bold 20px.
- Center: View toggle [Month] [Week] [Agenda] — pill tabs, active=
  blue filled.
- Right: Filter dropdown "All Event Types ▾" (multi-select:
  Contract Renewals, Payment Due, Document Expiry, Review Meetings,
  Audit Dates, Onboarding Deadlines, PO Delivery, Risk Assessments)
  + color legend chips matching event type colors.

MONTH VIEW (default):
Full 7-column calendar grid. Each cell: date number top-left 13px
bold. Today's cell: date number in white circle bg #2563EB.
Weekday headers: Mon Tue Wed Thu Fri Sat Sun — 11px uppercase
#9CA3AF, border-bottom #E5E7EB.

EVENT CHIPS inside cells (max 3 visible, "+N more" link):
Each event chip: 100% width of cell, 20px height, 4px radius, 4px
left padding, 11px text truncated. Color by type:
  - Contract Renewal: bg #DBEAFE text #1D4ED8 (blue)
  - Payment Due: bg #DCFCE7 text #166534 (green)
  - Document Expiry: bg #FEE2E2 text #991B1B (red)
  - Review Meeting: bg #EDE9FE text #6D28D9 (purple)
  - Audit Date: bg #FEF3C7 text #B45309 (amber)
  - Onboarding Deadline: bg #CFFAFE text #0E7490 (teal)
  - PO Delivery: bg #F3F4F6 text #374151 (grey)
  - Risk Assessment: bg #FEE2E2 text #DC2626 (red variant)

Cells with many events: subtle light tint bg to indicate busy day.
Weekend cells: very slightly off-white bg (#FAFAFA).

EVENT CLICK → POPOVER (not full modal):
Small popover (320px wide) anchored to the chip, with subtle shadow.
Shows: event type badge, title, vendor name (link), date/time,
description, relevant entity ID (Contract/PO/Invoice with link),
assigned owner. Bottom: [View Details] button + [×] close.

"+N more" click → shows all events for that day in a small modal
list (Event List Modal, 400px wide): title "Events — June 14" +
scrollable list of all events with same chip styling but full text.

WEEK VIEW:
7 columns (days) × time rows (8am–8pm, 1hr slots, 48px height each).
Events shown as vertical blocks spanning their duration (or single
30px block for all-day events in top row). Same color coding.
Left: time labels 11px #9CA3AF. Top: date + weekday label. Today
column: subtle blue tint bg.

AGENDA VIEW:
Flat list grouped by date (date as sticky section header: "Tuesday,
June 10, 2026" in 13px semibold). Each event row: colored left
border 3px | event type badge 80px | title 14px | vendor name link |
entity ID | owner avatar | actions (View / Reschedule). Empty days
not shown. Infinite scroll or load more.

MINI CALENDAR SIDEBAR (right, 280px):
Small compact month calendar on right side of page (in Agenda and
Week views). Clicking a date jumps to it. Days with events show
small colored dot below date number (up to 3 dots of different
colors = different event types).

ADD EVENT BUTTON (floating, bottom-right):
FAB-style button (not circular, 4px radius, 48px height): blue bg,
white "+" icon + "Add Event" text. Hover: slight shadow elevation
increase. Opens Add Event Modal.

ADD EVENT MODAL (520px):
Fields:
- Event Title
- Event Type [dropdown with color preview dot next to each option]
- Related Vendor [searchable]
- Related Entity [searchable — searches contracts, POs, invoices,
  dynamically filtered by event type]
- Date [date picker] + All Day toggle [if off: Start Time | End Time]
- Remind Me [dropdown: 1 day before | 3 days | 1 week | 2 weeks |
  1 month | custom]
- Assign To [user dropdown, multi-select]
- Notes [textarea]
- Color Override [6 color dots to pick custom chip color]
[Save Event] [Cancel]

UPCOMING EVENTS WIDGET (also shown on Dashboard as a new card):
Compact list of next 7 events sorted by date. Each row: colored
dot + event title + vendor name + date badge (shows "Tomorrow",
"In 3 days", or "Jun 14"). Clicking → navigates to Calendar page
on that date. Also make a date changable and fully functional calander .  

═══════════════════════════════════════════════════════════════
FEATURE D: ESG / SUSTAINABILITY SCORECARD
═══════════════════════════════════════════════════════════════

Add "ESG Scorecard" to sidebar under COMPLIANCE & RISK section
(Leaf icon).

PAGE HEADER:
Title "ESG & Sustainability" + subtitle "Environmental, Social &
Governance performance across your vendor base." Right side:
"ESG Assessment Period: 2024 ▾" dropdown + "Run Bulk Assessment"
button + "Download ESG Report" button.

ROW 1 — 5 KPI CARDS:
Card 1: Avg ESG Score
  Big number: "72.4 / 100" Roboto 800 32px
  Gauge arc below number (180° semicircle SVG, 120px wide, colored
  from red→amber→green left to right, needle pointing to score)
  Label: "Portfolio ESG Average"
  Trend: "↑ 4.2 pts vs last year"
Card 2: Environmental Score: "68.1" in green icon bg
Card 3: Social Score: "74.8" in blue icon bg
Card 4: Governance Score: "73.9" in purple icon bg
Card 5: ESG Assessed: "186 / 248" in teal icon bg, small progress
  bar below showing 75% coverage

TIER BADGES FOR ESG:
Platinum: bg #E0E7FF text #3730A3 (score 90+)
Gold: bg #FEF9C3 text #854D0E (score 75-89)
Silver: bg #F3F4F6 text #374151 (score 60-74)
Bronze: bg #FEF3C7 text #92400E (score 45-59)
Needs Improvement: bg #FEE2E2 text #991B1B (score <45)

ROW 2 — Two charts (50/50):
LEFT: Recharts ScatterPlot — X: ESG Score, Y: Spend ($). Dots
colored by ESG tier (Platinum=#6366F1, Gold=#EAB308, Silver=#9CA3AF,
Bronze=#F97316, Red=#EF4444). Size of dot = number of contracts.
Quadrant lines at ESG score 70 and spend $500K creating four
quadrants labeled: "Prioritize" (high spend, low ESG — top-left),
"Maintain" (high spend, high ESG — top-right), "Monitor" (low
spend, low ESG — bottom-left), "Sustain" (low spend, high ESG —
bottom-right). Quadrant bg tints very subtle. Height 300px.

RIGHT: Recharts BarChart grouped — X: ESG categories (E, S, G).
Grouped bars: Tier 1 vendors (blue), Tier 2 (green), Tier 3 (amber).
Shows average score per category per tier. Height 300px.

ROW 3 — ESG BREAKDOWN HEATMAP (full width card):
Title "ESG Category Performance by Vendor Category"
CSS grid heatmap: Rows = vendor categories (IT, Logistics,
Manufacturing, Consulting, Raw Materials, Facilities, Legal).
Columns = ESG sub-dimensions:
  Environmental: Carbon Footprint, Energy Efficiency, Waste Mgmt,
    Water Usage, Biodiversity
  Social: Labor Practices, Health & Safety, Diversity & Inclusion,
    Community Impact, Human Rights
  Governance: Board Structure, Anti-Corruption, Transparency,
    Data Privacy, Regulatory Compliance
Cell value: average score 0-100. Color: same 5-level scale from
#DCFCE7 (90+) → #BBF7D0 (75+) → #FEF3C7 (60+) → #FECACA (45+)
→ #FCA5A5 (<45). Each cell shows score number 12px center. Hover:
shows tooltip with cell name + score + vendor count in category.
Column group headers span across E / S / G sub-sections with
colored top border: green for E, blue for S, purple for G.

ROW 4 — VENDOR ESG TABLE (full width):
Filter bar: ESG Tier filter | Category | Score range slider |
"Show Only Unassessed" toggle | Search by vendor name
Columns:
Vendor | Category | Tier | ESG Tier Badge | E Score | S Score |
G Score | Overall ESG | Last Assessed | Certifications | YoY Change |
Actions (View Scorecard / Reassess / Flag)

ESG SCORE CELLS: Each of E/S/G columns shows score as number + tiny
horizontal bar (full cell width, 6px height, colored fill). Overall
ESG: number bold + ESG tier badge.
YoY Change: +X.X (green with ↑) or -X.X (red with ↓)

ESG ASSESSMENT FORM (large modal, 680px wide, multi-section):
Header: vendor name + assessment period dropdown + assessor name.
Three accordion sections (E / S / G), each expandable:

ENVIRONMENTAL:
- Carbon Emissions Reporting [Y/N toggle] → if Y: Scope 1 | Scope 2
  | Scope 3 (number inputs, tCO2e unit)
- Renewable Energy Usage % [slider 0-100]
- Environmental Policy in Place [Y/N]
- ISO 14001 Certified [Y/N]
- Waste Reduction Program [Y/N]
- Water Stewardship Program [Y/N]
- Supply Chain Environmental Audits [Y/N]
- Environmental Incidents (last 2 yrs) [number input]
- Score Preview [auto-calculated, shown in real-time]: E Score: 74

SOCIAL:
- Living Wage Policy [Y/N]
- No Child/Forced Labor Certification [Y/N]
- Health & Safety Incidents Rate [number per 100 employees]
- Employee Turnover Rate % [number]
- Women in Senior Leadership % [slider 0-100]
- Diversity & Inclusion Policy [Y/N]
- Community Investment Programs [Y/N]
- Worker Training Hours/Year Avg [number]
- Human Rights Due Diligence [Y/N]
- Social Audits Completed [Y/N]
- Score Preview: S Score: 81

GOVERNANCE:
- Code of Ethics Published [Y/N]
- Anti-Bribery / Anti-Corruption Policy [Y/N]
- Whistleblower Program [Y/N]
- Board Independence % [slider]
- External Audit Completed [Y/N]
- Data Protection Officer Appointed [Y/N]
- GDPR / Privacy Policy Compliance [Y/N]
- Conflicts of Interest Policy [Y/N]
- Executive Compensation Transparency [Y/N]
- Regulatory Violations (last 3 yrs) [number]
- Score Preview: G Score: 77

Overall ESG Score (auto-computed weighted average, shown prominently
in form footer as a live updating badge — large colored badge, dark
bg, white number): "Overall ESG: 77 — Gold Tier ★★★"
Weights shown below: E: 35% | S: 35% | G: 30% (editable in
settings)
Notes / Comments [textarea]
[Save Draft] [Submit Assessment] [Export PDF]

ESG VENDOR DETAIL (sub-page / full-screen modal, slide from right):
Header: vendor + ESG tier badge + period
Three equal-width columns: one each for E / S / G.
Each column: score circle (120px, thick stroke donut, colored),
category label, sub-dimension breakdown table (name | score | bar),
improvement suggestions (3 bulleted items based on score gaps).
Below 3 columns: full Recharts RadarChart showing all 15
sub-dimensions (5 per pillar) for this vendor vs industry average.
Historical ESG trend: Recharts LineChart showing 3 years of E, S, G
and Overall scores. 4 lines, 4 colors. Height 200px.

═══════════════════════════════════════════════════════════════
FEATURE E: DARK MODE
═══════════════════════════════════════════════════════════════

Add a dark/light mode toggle in the top header (Moon/Sun icon,
20px, right side of header before notification bell). Clicking
toggles mode. Transition: all color changes via CSS transition
200ms ease on background-color and color properties. Persisted
via mock localStorage (useMemo on initial load to read saved pref).

DARK MODE COLOR OVERRIDES (all exact hex):

Page background: #0D1117
Sidebar background: #090E1A (darker than light mode)
Card / panel background: #161B27
Table header background: #1C2333
Input background: #1C2333
Modal background: #161B27
Hover row: #1E2D45
Top header background: #111827
Top header border: #1F2937

Text:
Primary text: #F1F5F9
Secondary text: #94A3B8
Muted/placeholder: #64748B
Sidebar nav text: #94A3B8 (same as light)
Link text: #60A5FA

Borders:
Default border: #1F2937
Input border: #374151
Input focus border: #3B82F6
Divider: #1F2937

Primary brand in dark: #3B82F6 (slightly lighter blue for contrast)
Primary hover dark: #2563EB

Status badges: same color scheme but with slightly higher opacity
bg (bg opacity goes from the light-mode hex to a darker version
e.g. Active bg: #14532D, text: #4ADE80)

Chart grid lines in dark: #1F2937
Chart axis text in dark: #64748B
Chart tooltip bg dark: #1E293B, border: #334155, text: #F1F5F9

Sidebar section labels dark: #334155
Sidebar active item bg dark: #1D4ED8 (same as light, stays blue)

Scrollbar track dark: #1C2333, thumb: #374151

Code/mono text dark: #34D399 on #0D2D1A

All shadows in dark mode: replace with subtle border glow:
card shadow → box-shadow: 0 0 0 1px rgba(255,255,255,0.05),
              0 4px 12px rgba(0,0,0,0.4)

Donut/radar chart fills: use same hue but lower opacity (0.15-0.20)
for area fills on dark bg to prevent overwhelming brightness.

KPI card gradient bg in dark:
Primary: linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)
Green: linear-gradient(135deg, #166534 0%, #14532D 100%)
etc. (all darkened versions of light mode gradients)

Table alternating row in dark: #161B27 and #1A2035 (very subtle)

Toggle button itself: 36px × 20px pill shape, left side = sun icon
(light mode), right side = moon icon (dark mode). When light: bg
#FEF9C3, icon #F59E0B. When dark: bg #1E3A5F, icon #93C5FD. Smooth
slide of inner circle 200ms.

═══════════════════════════════════════════════════════════════
FEATURE F: COMMAND PALETTE (Cmd+K)
═══════════════════════════════════════════════════════════════

Triggered by: Cmd+K (Mac) / Ctrl+K (Windows). Also: clicking a
"⌘K" keyboard shortcut hint badge in the top search bar right side.
Pressing Escape closes it.

OVERLAY: Full-screen overlay, bg rgba(0,0,0,0.55), backdrop blur
8px. Palette modal: 640px wide, centered, 12px from top (not
vertically centered — sits near top like Spotlight). bg #FFFFFF
(#161B27 in dark mode). Border-radius 8px. shadow: 0 24px 80px
rgba(0,0,0,0.25). Animated: scale from 0.96 + opacity 0 → 1 + 1,
duration 160ms ease-out.

SEARCH INPUT (top of palette):
Full width, 56px height, no border (borderless), 20px font size
Inter, placeholder "Search anything or type a command..."
Left: search icon #9CA3AF 20px. Right: "ESC to close" badge in
#F3F4F6 text #6B7280 10px. Border-bottom: 1px solid #E5E7EB
(#2D3748 dark). No border-radius (sits flush at top of modal).
Cursor blinks immediately on open (autoFocus).

RESULTS AREA (below input, max-height 480px, overflow-y scroll):
When empty (just opened): shows "Suggestions" section with quick
action rows grouped. When typing: shows live filtered results.

EMPTY / DEFAULT STATE — Quick Sections:

SECTION: QUICK ACTIONS (header: "Quick Actions" 10px uppercase
#9CA3AF, 8px 16px padding):
Each row: 44px height, 16px h-padding, flex, icon left (20px,
colored), label 14px Inter, right side: keyboard shortcut badge
(small grey pill e.g. "N V" for new vendor). Hover: bg #F5F7FF
(#1E2D45 dark), 4px radius.
Rows:
  → Create New Vendor (UserPlus, blue)
  → New Purchase Order (ShoppingCart, green)
  → Generate RFQ (FileSearch, teal)
  → New Contract (FileText, purple)
  → Run Risk Assessment (ShieldAlert, red)
  → Upload Document (Upload, amber)
  → Schedule Payment (Wallet, green)

SECTION: RECENT PAGES (header "Recent Pages"):
5 recently visited pages with route breadcrumb:
  → Dashboard (LayoutDashboard icon)
  → Vendor Directory (Building2)
  → PO-2024-0892 — Apex Technologies (ShoppingCart)
  → Contract CTR-0041 — GlobalTrade GmbH (FileText)
  → Risk Assessment (ShieldAlert)

SECTION: RECENT VENDORS:
3 recently viewed vendors with avatar circle + name + category badge

TYPED SEARCH STATE — Results grouped by type:

VENDORS group (max 4 results):
Each row: 48px height. Left: vendor avatar circle 32px. Center:
vendor name 14px bold + category + status badge. Right: "Vendor"
type label 11px #9CA3AF. Arrow icon far right.
Match highlight: typed characters highlighted in bg #FEF9C3 (yellow)
within the result text.

PURCHASE ORDERS group (max 3 results):
Row: PO icon (blue) | PO number monospace | vendor name | amount |
status badge | "Purchase Order" type label

CONTRACTS group (max 3):
Row: contract icon (purple) | contract ID | title | vendor | status

INVOICES group (max 3):
Row: invoice icon (green) | invoice number | vendor | amount | status

ACTIONS group (always shown if query matches action keywords like
"create", "new", "add", "run", "generate"):
Rows with lightning bolt icon (yellow): action label + description.
E.g. typing "new vendor" → "Create New Vendor — Open the vendor
onboarding form"

NAVIGATION group (matches page names):
Pages matching the query with their sidebar icon + page title +
breadcrumb

KEYBOARD NAVIGATION:
Arrow Up/Down: moves highlighted row (highlighted = bg #EFF6FF,
#1E2D45 dark, left border 2px #2563EB). Enter: executes action /
navigates. Tab: jump between sections.

HIGHLIGHTED ROW shows a right-panel PREVIEW (only for vendors,
contracts, POs — not actions/nav):
Right side of palette (280px panel, left border 1px #E5E7EB,
#2D3748 dark, 16px padding): live mini-summary of highlighted
item. For vendor: avatar large + name + status + 3 key stats (Score,
Spend, Contracts). For PO: PO number + vendor + amount + status +
date. For contract: ID + vendor + value + expiry. Renders instantly
as user arrows through results.

FOOTER (palette bottom, 36px, border-top #F3F4F6, #2D3748 dark,
flex, 12px 16px padding):
Left: "↑↓ navigate   ↵ select   esc close" in 11px #9CA3AF with
key icons styled as small grey pill badges (4px radius, bg #F3F4F6,
#2D3748 dark, 1px border #E5E7EB).
Right: "VendorFlow" brand + "⌘K" badge.

COMMAND SHORTCUTS (type these prefixes to filter by type):
> vendor [name] — search only vendors
> po [number] — search only purchase orders
> contract [id] — search only contracts
> go [page] — navigate to page
Show these hints as chips below search input when it's empty:
small grey pill buttons row: [> vendor] [> po] [> contract] [> go]
Clicking a chip inserts it into the search input.

After navigating to a result, palette closes with a 120ms fade-out
and the target page activates / correct modal opens.