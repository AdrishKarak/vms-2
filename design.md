# VendorFlow — Complete Neomorphism Design System
> Full specification for AI agents. Every component, every state, both themes. No gaps.

---

## 1. CORE NEOMORPHISM RULES

These are absolute. Never break them.

- Every surface (page, sidebar, topbar, card, input, button) shares ONE single base color per theme.
- Elevation is created ONLY via box-shadow — never borders, never background-color differences.
- Two shadow directions always: dark shadow bottom-right, light shadow top-left.
- Raised element = outer shadow (pops out of surface).
- Pressed / active / input = inset shadow (pushed into surface).
- Hover = reduced outer shadow (element "lifts" slightly less aggressively).
- Border-radius minimum 10px on all interactive elements. Cards: 14–16px. Page sections: 16–20px.
- No gradients. No glassmorphism blur. No flat borders used for separation. No border-image.
- Shadows must match the base color family — never pure black shadows on any theme.
- Do NOT use blue anywhere in the dark theme. Not for links, not for accents, not for info states.

---

## 2. LIGHT THEME — FULL TOKEN SET

### 2a. Base Surface
```
--neo-base:           #e0e5ec    /* Applied to: html/body bg, sidebar bg, topbar bg,
                                    card bg, input bg, button bg, modal bg, dropdown bg.
                                    Every single surface is this color. */
--neo-shadow-dark:    #b8bec7    /* Bottom-right shadow on all raised elements */
--neo-shadow-light:   #ffffff    /* Top-left highlight on all raised elements */
```

### 2b. Text Colors
```
--text-primary:       #3d5068    /* Page titles, card values, table data cells,
                                    sidebar logo, topbar page title, modal headings */
--text-secondary:     #6a7f96    /* Body text, descriptions, paragraph content,
                                    form labels, chart section titles */
--text-muted:         #8a9bb0    /* Table header row labels, timestamp text,
                                    placeholder text, stat card labels (above number),
                                    chart axis labels, tooltip secondary lines */
--text-accent:        #c17a3a    /* Active sidebar item text + icon, primary button label,
                                    card sub-text (↑↓ trend indicators), links,
                                    focus ring color, active tab underline,
                                    KPI positive delta, icon hover state */
--text-on-accent:     #ffffff    /* Text placed directly ON a filled accent-colored surface */
```

### 2c. Semantic / Status Colors
```
--color-success:      #3a7a5a    /* Active badge text, success toast text,
                                    positive chart series, success icon */
--color-success-bg:   #e0e5ec    /* Badge background (uses inset neo shadow, not flat fill) */

--color-danger:       #a33a3a    /* Expired/error badge text, danger toast,
                                    negative delta text, delete button label */
--color-danger-bg:    #e0e5ec    /* Badge background (inset neo shadow) */

--color-warning:      #9a6a2a    /* Review/pending badge text, warning toast,
                                    SLA breach indicator */
--color-warning-bg:   #e0e5ec    /* Badge background (inset neo shadow) */

--color-info:         #4a7a9a    /* Info toast, neutral annotation text
                                    (only use in light theme, never dark) */
```

### 2d. Shadow Definitions — Light Theme
```
/* CARDS & PANELS */
card-resting:         box-shadow: 6px 6px 14px #b8bec7, -6px -6px 14px #ffffff;
card-hover:           box-shadow: 8px 8px 18px #b0b6be, -8px -8px 18px #ffffff;
card-active:          box-shadow: inset 4px 4px 9px #b8bec7, inset -4px -4px 9px #ffffff;

/* SIDEBAR */
sidebar-container:    box-shadow: 6px 6px 14px #b8bec7, -6px -6px 14px #ffffff;
sidebar-item-hover:   box-shadow: inset 2px 2px 5px #c8cdd4, inset -2px -2px 5px #f8fafc;
sidebar-item-active:  box-shadow: inset 3px 3px 7px #b8bec7, inset -3px -3px 7px #ffffff;

/* TOPBAR */
topbar:               box-shadow: 4px 4px 10px #b8bec7, -4px -4px 10px #ffffff;

/* BUTTONS */
button-resting:       box-shadow: 4px 4px 8px #b8bec7, -4px -4px 8px #ffffff;
button-hover:         box-shadow: 2px 2px 5px #b8bec7, -2px -2px 5px #ffffff;
button-active:        box-shadow: inset 3px 3px 7px #b8bec7, inset -3px -3px 7px #ffffff;

/* INPUTS / SEARCH */
input-resting:        box-shadow: inset 3px 3px 7px #b8bec7, inset -3px -3px 7px #ffffff;
input-focus:          box-shadow: inset 4px 4px 9px #b0b6be, inset -4px -4px 9px #ffffff;

/* ICON BUTTONS (bell, search, avatar) */
icon-btn-resting:     box-shadow: 3px 3px 7px #b8bec7, -3px -3px 7px #ffffff;
icon-btn-hover:       box-shadow: inset 2px 2px 5px #b8bec7, inset -2px -2px 5px #ffffff;
icon-btn-active:      box-shadow: inset 3px 3px 6px #b8bec7, inset -3px -3px 6px #ffffff;

/* BADGES / STATUS PILLS */
badge-all:            box-shadow: inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff;

/* CHART BOX */
chart-container:      box-shadow: 6px 6px 14px #b8bec7, -6px -6px 14px #ffffff;

/* TABLE CONTAINER */
table-container:      box-shadow: 6px 6px 14px #b8bec7, -6px -6px 14px #ffffff;

/* MODAL / DIALOG */
modal:                box-shadow: 10px 10px 24px #b0b6be, -10px -10px 24px #ffffff;

/* DROPDOWN MENU */
dropdown:             box-shadow: 8px 8px 16px #b8bec7, -8px -8px 16px #ffffff;

/* TOOLTIP */
tooltip:              box-shadow: 4px 4px 10px #b8bec7, -4px -4px 10px #ffffff;

/* TOGGLE SWITCH */
toggle-track-off:     box-shadow: inset 3px 3px 6px #b8bec7, inset -3px -3px 6px #ffffff;
toggle-track-on:      box-shadow: inset 3px 3px 6px #a07030, inset -3px -3px 6px #d89050;
toggle-thumb:         box-shadow: 2px 2px 5px #b8bec7, -2px -2px 5px #ffffff;

/* TABS */
tab-inactive:         box-shadow: 3px 3px 6px #b8bec7, -3px -3px 6px #ffffff;
tab-active:           box-shadow: inset 3px 3px 7px #b8bec7, inset -3px -3px 7px #ffffff;

/* AVATAR CIRCLE */
avatar:               box-shadow: 3px 3px 7px #b8bec7, -3px -3px 7px #ffffff;

/* SCROLLBAR THUMB */
scrollbar-thumb:      box-shadow: 2px 2px 4px #b8bec7, -2px -2px 4px #ffffff;

/* NOTIFICATION DOT */
notif-dot:            box-shadow: 2px 2px 4px #b8bec7, -1px -1px 3px #ffffff;
                      background: #c17a3a;
```

---

## 3. DARK THEME — FULL TOKEN SET

### 3a. Base Surface
```
--neo-base:           #1e2330    /* Applied to: html/body bg, sidebar bg, topbar bg,
                                    card bg, input bg, button bg, modal bg, dropdown bg.
                                    Every single surface is this color. */
--neo-shadow-dark:    #12161f    /* Bottom-right shadow — deeper dark */
--neo-shadow-light:   #2a3041    /* Top-left highlight — lighter dark */
```

### 3b. Text Colors
```
--text-primary:       #c8d0e0    /* Page titles, card values, table data cells,
                                    sidebar logo, topbar page title, modal headings */
--text-secondary:     #8a9bb0    /* Body text, descriptions, paragraph content,
                                    form labels, chart section titles */
--text-muted:         #4a5570    /* Table header row labels, timestamp text,
                                    placeholder text, stat card labels,
                                    chart axis labels, tooltip secondary lines */
--text-accent:        #e8a060    /* Active sidebar item text + icon, primary button label,
                                    card sub-text trend indicators, links,
                                    focus ring color, active tab underline,
                                    KPI positive delta, icon hover state.
                                    NO BLUE. This warm amber is the ONLY accent. */
--text-on-accent:     #1e2330    /* Text placed directly ON a filled accent-colored surface */
```

### 3c. Semantic / Status Colors
```
--color-success:      #5ac890    /* Active badge text, success toast text,
                                    positive chart series, success icon */
--color-success-bg:   #1e2330    /* Badge background (inset neo shadow) */

--color-danger:       #e06060    /* Expired/error badge text, danger toast,
                                    negative delta text, delete button label */
--color-danger-bg:    #1e2330    /* Badge background (inset neo shadow) */

--color-warning:      #e8b060    /* Review/pending badge text, warning toast,
                                    SLA breach indicator */
--color-warning-bg:   #1e2330    /* Badge background (inset neo shadow) */

/* NO --color-info in dark theme. Use --text-secondary for neutral annotations. */
```

### 3d. Shadow Definitions — Dark Theme
```
/* CARDS & PANELS */
card-resting:         box-shadow: 5px 5px 12px #12161f, -5px -5px 12px #2a3041;
card-hover:           box-shadow: 7px 7px 16px #0e1118, -7px -7px 16px #2e3648;
card-active:          box-shadow: inset 4px 4px 9px #12161f, inset -4px -4px 9px #2a3041;

/* SIDEBAR */
sidebar-container:    box-shadow: 5px 5px 12px #12161f, -5px -5px 12px #2a3041;
sidebar-item-hover:   box-shadow: inset 2px 2px 5px #161a25, inset -2px -2px 5px #262c3b;
sidebar-item-active:  box-shadow: inset 3px 3px 7px #12161f, inset -3px -3px 7px #2a3041;

/* TOPBAR */
topbar:               box-shadow: 4px 4px 10px #12161f, -4px -4px 10px #2a3041;

/* BUTTONS */
button-resting:       box-shadow: 4px 4px 8px #12161f, -4px -4px 8px #2a3041;
button-hover:         box-shadow: 2px 2px 5px #12161f, -2px -2px 5px #2a3041;
button-active:        box-shadow: inset 3px 3px 7px #12161f, inset -3px -3px 7px #2a3041;

/* INPUTS / SEARCH */
input-resting:        box-shadow: inset 3px 3px 7px #12161f, inset -3px -3px 7px #2a3041;
input-focus:          box-shadow: inset 4px 4px 9px #0e1118, inset -4px -4px 9px #2e3648;

/* ICON BUTTONS */
icon-btn-resting:     box-shadow: 3px 3px 7px #12161f, -3px -3px 7px #2a3041;
icon-btn-hover:       box-shadow: inset 2px 2px 5px #12161f, inset -2px -2px 5px #2a3041;
icon-btn-active:      box-shadow: inset 3px 3px 6px #12161f, inset -3px -3px 6px #2a3041;

/* BADGES / STATUS PILLS */
badge-all:            box-shadow: inset 2px 2px 4px #12161f, inset -2px -2px 4px #2a3041;

/* CHART BOX */
chart-container:      box-shadow: 5px 5px 12px #12161f, -5px -5px 12px #2a3041;

/* TABLE CONTAINER */
table-container:      box-shadow: 5px 5px 12px #12161f, -5px -5px 12px #2a3041;

/* MODAL / DIALOG */
modal:                box-shadow: 10px 10px 24px #0e1118, -10px -10px 24px #2e3648;

/* DROPDOWN MENU */
dropdown:             box-shadow: 8px 8px 16px #12161f, -8px -8px 16px #2a3041;

/* TOOLTIP */
tooltip:              box-shadow: 4px 4px 10px #12161f, -4px -4px 10px #2a3041;

/* TOGGLE SWITCH */
toggle-track-off:     box-shadow: inset 3px 3px 6px #12161f, inset -3px -3px 6px #2a3041;
toggle-track-on:      box-shadow: inset 3px 3px 6px #c07030, inset -3px -3px 6px #f0b070;
toggle-thumb:         box-shadow: 2px 2px 5px #12161f, -2px -2px 5px #2a3041;

/* TABS */
tab-inactive:         box-shadow: 3px 3px 6px #12161f, -3px -3px 6px #2a3041;
tab-active:           box-shadow: inset 3px 3px 7px #12161f, inset -3px -3px 7px #2a3041;

/* AVATAR CIRCLE */
avatar:               box-shadow: 3px 3px 7px #12161f, -3px -3px 7px #2a3041;

/* SCROLLBAR THUMB */
scrollbar-thumb:      box-shadow: 2px 2px 4px #12161f, -2px -2px 4px #2a3041;

/* NOTIFICATION DOT */
notif-dot:            box-shadow: 2px 2px 4px #12161f, -1px -1px 3px #2a3041;
                      background: #e8a060;
```

---

## 4. COMPONENT SPECIFICATIONS

### 4a. Page / Body
```
BOTH THEMES:
  background:         var(--neo-base)
  font-family:        'Inter', -apple-system, BlinkMacSystemFont, sans-serif
  font-size:          14px
  line-height:        1.65
  color:              var(--text-secondary)
  padding:            0
  margin:             0
  overflow-x:         hidden
```

### 4b. Sidebar
```
STRUCTURE:
  width:              220px (collapsed: 64px)
  height:             100vh
  padding:            24px 14px
  border-radius:      0 20px 20px 0  (right side rounds into page)
  background:         var(--neo-base)
  box-shadow:         [theme sidebar-container shadow]
  position:           sticky, top: 0

LOGO / BRAND:
  font-size:          16px
  font-weight:        700
  color:              var(--text-primary)
  margin-bottom:      32px
  padding-left:       8px

SECTION LABEL (e.g. "Main", "Settings"):
  font-size:          10px
  font-weight:        600
  letter-spacing:     1.2px
  text-transform:     uppercase
  color:              var(--text-muted)
  padding:            0 8px
  margin:             16px 0 6px

NAV ITEM — resting:
  display:            flex, align-items center, gap 10px
  padding:            10px 12px
  border-radius:      12px
  font-size:          13px
  font-weight:        400
  color:              var(--text-secondary)
  background:         var(--neo-base)
  box-shadow:         none (flat, no elevation when resting)
  cursor:             pointer
  transition:         all 0.2s ease

NAV ITEM — hover:
  box-shadow:         [theme sidebar-item-hover]
  color:              var(--text-primary)

NAV ITEM — active (current page):
  box-shadow:         [theme sidebar-item-active]
  color:              var(--text-accent)
  font-weight:        500
  icon color:         var(--text-accent)

ICON SIZE (in nav):   16px, inherits nav item color

BOTTOM USER SECTION:
  margin-top:         auto
  padding-top:        16px
  border-top:         1px solid rgba(neo-shadow-dark, 0.3)
  user name:          13px, var(--text-primary), font-weight 500
  user role:          11px, var(--text-muted)
```

### 4c. Topbar
```
STRUCTURE:
  height:             60px
  padding:            0 28px
  border-radius:      0 0 16px 16px  (rounds at bottom into content)
  background:         var(--neo-base)
  box-shadow:         [theme topbar shadow]
  display:            flex, align-items center, justify-content space-between

PAGE TITLE:
  font-size:          16px
  font-weight:        600
  color:              var(--text-primary)

BREADCRUMB (below title):
  font-size:          11px
  color:              var(--text-muted)
  separator:          "/" in var(--text-muted)

SEARCH BAR:
  width:              220px
  height:             36px
  border-radius:      10px
  background:         var(--neo-base)
  box-shadow:         [theme input-resting]
  padding:            0 14px 0 36px  (icon left)
  font-size:          13px
  color:              var(--text-primary)
  placeholder-color:  var(--text-muted)
  border:             none
  outline:            none
  focus shadow:       [theme input-focus]
  focus caret-color:  var(--text-accent)

ICON BUTTONS (bell, filter, help):
  width / height:     34px × 34px
  border-radius:      10px
  background:         var(--neo-base)
  box-shadow:         [theme icon-btn-resting]
  icon color:         var(--text-muted)
  icon size:          16px
  hover box-shadow:   [theme icon-btn-hover]
  hover icon color:   var(--text-accent)
  active box-shadow:  [theme icon-btn-active]

NOTIFICATION BADGE ON BELL:
  width / height:     8px × 8px
  border-radius:      50%
  background:         var(--color-danger) in respective theme
  position:           absolute top-right of bell icon

AVATAR:
  width / height:     34px × 34px
  border-radius:      50%
  background:         var(--neo-base)
  box-shadow:         [theme avatar shadow]
  initials font:      12px, font-weight 600
  initials color:     var(--text-accent)

THEME TOGGLE (light/dark switcher):
  shape:              pill, 52px × 26px
  track:              inset neo shadow (sunken)
  thumb:              raised neo shadow, 20px circle
  transition:         0.25s ease
```

### 4d. Stat / KPI Cards
```
STRUCTURE:
  border-radius:      14px
  padding:            18px 20px
  background:         var(--neo-base)
  box-shadow:         [theme card-resting]
  transition:         box-shadow 0.2s ease
  hover box-shadow:   [theme card-hover]

LABEL (above number):
  font-size:          11px
  font-weight:        600
  text-transform:     uppercase
  letter-spacing:     0.8px
  color:              var(--text-muted)
  margin-bottom:      6px

VALUE (the big number):
  font-size:          28px
  font-weight:        700
  color:              var(--text-primary)
  line-height:        1.1

TREND / SUB-TEXT (below number):
  font-size:          11px
  color:              var(--text-accent) for positive delta
  color:              var(--color-danger) for negative delta
  arrow:              ↑ or ↓ inline before text
  margin-top:         4px

ICON (top-right corner of card, optional):
  size:               22px
  color:              var(--text-accent) at 60% opacity
  background:         var(--neo-base)
  box-shadow:         [theme icon-btn-resting]
  border-radius:      8px
  padding:            6px

GRID LAYOUT:
  display:            grid
  columns:            repeat(auto-fit, minmax(160px, 1fr))
  gap:                16px
```

### 4e. Chart Box
```
CONTAINER:
  border-radius:      16px
  padding:            20px 22px
  background:         var(--neo-base)
  box-shadow:         [theme chart-container shadow]

HEADER ROW:
  display:            flex, justify-content space-between, align-items center
  margin-bottom:      16px

CHART TITLE:
  font-size:          13px
  font-weight:        600
  color:              var(--text-secondary)

CHART SUBTITLE / DATE RANGE:
  font-size:          11px
  color:              var(--text-muted)

LEGEND DOTS:
  width / height:     8px × 8px
  border-radius:      50%
  display:            inline-block, gap 6px from label

FILTER / PERIOD BUTTON:
  font-size:          11px
  color:              var(--text-muted)
  box-shadow:         [theme button-resting]
  border-radius:      8px
  padding:            4px 10px
  hover:              [theme button-hover], color var(--text-accent)

CHART AREA BG:
  background:         var(--neo-base)   /* no inner tint — flat base */
  inner lines:        1px solid rgba(neo-shadow-dark, 0.25)

AXIS LABELS:
  font-size:          10px
  color:              var(--text-muted)

DATA SERIES COLORS:
  Primary series:     var(--text-accent)        [amber/orange]
  Secondary series:   var(--color-success)      [green]
  Tertiary series:    LIGHT: #9a6a9a (muted purple) | DARK: #a080c0
  Negative / loss:    var(--color-danger)
  Grid lines:         rgba(neo-shadow-dark, 0.3)
  Tooltip bg:         var(--neo-base), box-shadow [theme tooltip]
  Tooltip text:       var(--text-primary)
  Tooltip label:      var(--text-muted)

BAR CHARTS:
  bar border-radius:  6px 6px 0 0 (top corners only)
  bar active hover:   opacity 1.0 (non-hovered bars dim to 0.5)

LINE CHARTS:
  line stroke-width:  2px
  dot radius:         4px
  dot fill:           var(--neo-base)
  dot stroke:         series color, 2px
```

### 4f. Data Table
```
CONTAINER:
  border-radius:      16px
  padding:            20px 22px
  background:         var(--neo-base)
  box-shadow:         [theme table-container shadow]
  overflow:           hidden

TABLE ELEMENT:
  width:              100%
  border-collapse:    collapse
  table-layout:       fixed

TABLE HEADER ROW:
  background:         transparent (same as base)
  font-size:          10px
  font-weight:        600
  text-transform:     uppercase
  letter-spacing:     0.8px
  color:              var(--text-muted)
  padding:            0 0 12px 0
  border-bottom:      1.5px solid rgba(neo-shadow-dark, 0.5)

TABLE BODY ROW — resting:
  border-bottom:      1px solid rgba(neo-shadow-dark, 0.3)
  background:         transparent

TABLE BODY ROW — hover:
  LIGHT: background rgba(255,255,255, 0.35)
  DARK:  background rgba(42,48,65, 0.45)
  transition:         background 0.15s ease

TABLE CELL:
  padding:            11px 0
  font-size:          13px
  color:              var(--text-primary)       /* primary data */
  vertical-align:     middle

TABLE CELL — secondary info (category, date):
  color:              var(--text-muted)

TABLE CELL — currency / numeric:
  font-weight:        500
  color:              var(--text-primary)
  text-align:         right

TABLE CELL — vendor name (first col):
  font-weight:        500
  color:              var(--text-primary)

SORT ICON (in header):
  size:               12px
  color:              var(--text-muted)
  active sort color:  var(--text-accent)

PAGINATION:
  button shape:       neo raised, 32px × 32px, border-radius 8px
  current page btn:   inset shadow + color var(--text-accent)
  font-size:          12px
  color:              var(--text-secondary)
```

### 4g. Badges / Status Pills
```
SHAPE:
  border-radius:      20px (full pill)
  padding:            3px 10px
  font-size:          10px
  font-weight:        600
  display:            inline-flex, align-items center, gap 5px
  background:         var(--neo-base) — ALWAYS same base
  box-shadow:         [theme badge inset shadow] — ALWAYS inset (pressed look)

STATUS DOT (inside badge, optional):
  width / height:     6px × 6px
  border-radius:      50%

ACTIVE / SUCCESS:
  text color:         var(--color-success)
  dot color:          var(--color-success)

PENDING / REVIEW / WARNING:
  text color:         var(--color-warning)
  dot color:          var(--color-warning)

EXPIRED / ERROR / DANGER:
  text color:         var(--color-danger)
  dot color:          var(--color-danger)

INACTIVE / DRAFT:
  text color:         var(--text-muted)
  dot color:          var(--text-muted)
```

### 4h. Buttons
```
PRIMARY BUTTON:
  background:         var(--neo-base)
  box-shadow:         [theme button-resting]
  border:             none
  border-radius:      12px
  padding:            10px 22px
  font-size:          13px
  font-weight:        600
  color:              var(--text-accent)
  cursor:             pointer
  transition:         all 0.15s ease
  hover box-shadow:   [theme button-hover]
  hover color:        var(--text-accent) (unchanged)
  active box-shadow:  [theme button-active]  ← pressed-in feel

DEFAULT / SECONDARY BUTTON:
  same as primary but color: var(--text-secondary)
  hover color: var(--text-primary)

DANGER BUTTON:
  same structure but color: var(--color-danger)

GHOST / TEXT BUTTON:
  no box-shadow
  background: transparent
  color: var(--text-secondary)
  hover: color var(--text-accent), underline

ICON-ONLY BUTTON:
  width / height:     36px × 36px
  border-radius:      10px
  box-shadow:         [theme icon-btn-resting]
  icon size:          16–18px
  icon color:         var(--text-muted)
  hover box-shadow:   [theme icon-btn-hover]
  hover icon color:   var(--text-accent)
```

### 4i. Form Inputs
```
TEXT INPUT / TEXTAREA:
  background:         var(--neo-base)
  box-shadow:         [theme input-resting]  ← always inset (sunken)
  border:             none
  border-radius:      12px
  height:             42px  (textarea: auto)
  padding:            0 16px
  font-size:          13px
  color:              var(--text-primary)
  placeholder-color:  var(--text-muted)
  outline:            none
  caret-color:        var(--text-accent)
  focus box-shadow:   [theme input-focus]

SELECT / DROPDOWN TRIGGER:
  same as text input
  chevron icon:       16px, var(--text-muted), right side

DROPDOWN PANEL:
  background:         var(--neo-base)
  border-radius:      12px
  box-shadow:         [theme dropdown shadow]
  padding:            6px
  
DROPDOWN ITEM:
  padding:            9px 12px
  border-radius:      8px
  font-size:          13px
  color:              var(--text-secondary)
  hover box-shadow:   [theme sidebar-item-hover]
  hover color:        var(--text-primary)
  selected color:     var(--text-accent)
  selected shadow:    [theme sidebar-item-active]

CHECKBOX / RADIO:
  width / height:     18px × 18px
  border-radius:      5px (checkbox) / 50% (radio)
  box-shadow:         [theme input-resting] — inset
  checked fill:       var(--text-accent), inset shadow removed, outer shadow added
  check icon:         white, 12px

LABEL TEXT:
  font-size:          13px
  color:              var(--text-secondary)
  margin-bottom:      6px

HELPER TEXT:
  font-size:          11px
  color:              var(--text-muted)

ERROR TEXT:
  font-size:          11px
  color:              var(--color-danger)
```

### 4j. Modal / Dialog
```
OVERLAY:
  background:         rgba(neo-shadow-dark, 0.6) for light
                      rgba(10,12,18, 0.75) for dark

MODAL BOX:
  background:         var(--neo-base)
  border-radius:      20px
  box-shadow:         [theme modal shadow]
  padding:            28px 32px
  max-width:          560px
  width:              90%

MODAL HEADER:
  title font-size:    17px, font-weight 600, var(--text-primary)
  subtitle font-size: 13px, var(--text-muted)
  close button:       icon-btn style (neo raised), top-right

MODAL BODY:
  font-size:          14px
  color:              var(--text-secondary)
  padding:            20px 0

MODAL FOOTER:
  display:            flex, gap 10px, justify-content flex-end
  border-top:         1px solid rgba(neo-shadow-dark, 0.3)
  padding-top:        16px
```

### 4k. Toast / Notifications
```
CONTAINER:
  border-radius:      14px
  padding:            14px 18px
  background:         var(--neo-base)
  box-shadow:         [theme card-resting]
  display:            flex, align-items center, gap 12px
  min-width:          280px

ICON AREA:
  width / height:     32px × 32px
  border-radius:      10px
  background:         var(--neo-base)
  box-shadow:         [theme icon-btn-resting]
  icon size:          16px

SUCCESS TOAST:  icon color var(--color-success)
WARNING TOAST:  icon color var(--color-warning)
DANGER TOAST:   icon color var(--color-danger)

TITLE:          font-size 13px, font-weight 600, var(--text-primary)
MESSAGE:        font-size 12px, var(--text-muted)
```

---

## 5. TYPOGRAPHY SCALE

```
Font family:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Font weights:   400 (regular), 500 (medium), 600 (semibold), 700 (bold)

H1 — Page title:        28px / weight 700 / var(--text-primary) / line-height 1.2
H2 — Section heading:   20px / weight 600 / var(--text-primary) / line-height 1.3
H3 — Card heading:      16px / weight 600 / var(--text-primary) / line-height 1.4
H4 — Sub-section:       14px / weight 600 / var(--text-secondary)
Body:                   14px / weight 400 / var(--text-secondary) / line-height 1.65
Body small:             12px / weight 400 / var(--text-secondary)
Label (uppercase):      10px / weight 600 / var(--text-muted) / letter-spacing 0.8px / uppercase
Caption:                11px / weight 400 / var(--text-muted)
Stat number:            28px / weight 700 / var(--text-primary)
Monospace (code/ID):    13px / font-family monospace / var(--text-secondary)
```

---

## 6. SPACING & LAYOUT GRID

```
Base unit:              4px
Page padding:           24px (desktop) / 16px (mobile)
Sidebar width:          220px (expanded) / 64px (collapsed)
Topbar height:          60px
Content area:           calc(100vw - 220px - 48px)
Card gap:               16px
Section gap:            24px
Inner card padding:     18px–22px
Component gap:          12px
```

---

## 7. BORDER RADIUS SCALE

```
Small (badges, tags):   20px (full pill)
Input / button:         10–12px
Card / panel:           14–16px
Page section:           16–20px
Modal:                  20px
Avatar:                 50%
Icon button:            10px
Chart container:        16px
```

---

## 8. TRANSITION & ANIMATION

```
Standard:               all 0.2s ease
Fast (hover flicker):   all 0.12s ease
Shadow transition:      box-shadow 0.2s ease
Color transition:       color 0.15s ease
Page fade-in:           opacity 0 → 1, 0.3s ease
Card appear:            translateY(8px) → 0, opacity 0 → 1, 0.25s ease
```

---

## 9. SCROLLBAR STYLING

```
LIGHT:
  width: 6px
  track: #e0e5ec (same as base)
  thumb: box-shadow [theme scrollbar-thumb], border-radius 3px, background #c8cdd4

DARK:
  width: 6px
  track: #1e2330 (same as base)
  thumb: box-shadow [theme scrollbar-thumb], border-radius 3px, background #2e3648
```

---

## 10. DO NOT LIST

```
- Do NOT use any border (border: 1px solid) for visual separation. Use shadows only.
- Do NOT use background-color differences to create depth. One base color per theme.
- Do NOT use blue (#0000ff or any hue 210–260) in the dark theme anywhere.
- Do NOT use gradients (linear-gradient, radial-gradient) on any surface.
- Do NOT use glassmorphism (backdrop-filter, blur).
- Do NOT use box-shadow: none on raised elements — always define shadow state.
- Do NOT use font-weight below 400 or above 700.
- Do NOT use font-size below 10px.
- Do NOT mix inset and outer shadow on the same element simultaneously.
- Do NOT use hard-coded black (#000) or white (#fff) for text on either theme.
- Do NOT use pure white (#ffffff) as a surface background on light theme — use #e0e5ec.
- Do NOT use pure black (#000000 or #111111) as base on dark theme — use #1e2330.
```