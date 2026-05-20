# Dashboard Sidebar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent 220px dark navy sidebar to all dashboard pages, upgrade every page header to a gradient dark bar, and add a new customer profile page with vehicles, full service history, contact info, and staff notes.

**Architecture:** Shared sidebar HTML block copy-pasted into each page with the active nav item's `class="nav-item active"`. New CSS classes in `dashboard.css` handle the shell layout and override card colors to a light theme within `.page-body`. A shared `js/add-customer-modal.js` injects the Add Customer modal and exposes `openAddCustomerModal()` globally.

**Tech Stack:** Vanilla HTML/CSS/JS, no build step. Data from `data/demo.json`. Existing `dashboard.css` extended with new classes.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `css/dashboard.css` | Modify | Add sidebar, shell, page-header, light-theme, modal, profile CSS |
| `data/demo.json` | Modify | Add `address`, `vehicles`, `preferredContact`, `notes` per customer; add `vehicle` field to each history entry |
| `js/add-customer-modal.js` | Create | Shared modal: inject HTML, open/close, toast on save |
| `customer-profile.html` | Create | Full profile page — vehicles, history, contact, notes |
| `js/customer-profile.js` | Create | Load demo.json, parse ?id= param, render all sections |
| `index.html` | Modify | Wrap in app-shell, remove old header, add sidebar (Overview active) |
| `revenue-analytics.html` | Modify | Wrap in app-shell, remove color hacks, add sidebar (Revenue active) |
| `customers.html` | Modify | Wrap in app-shell, navigate rows to profile, add sidebar (Customers active) |
| `inventory.html` | Modify | Wrap in app-shell, add sidebar (Inventory active) |
| `workorders.html` | Modify | Wrap in app-shell, add sidebar (Work Orders active) |
| `technicians.html` | Modify | Wrap in app-shell, add sidebar (Technicians active) |
| `settings.html` | Modify | Replace custom sticky-header with app-shell, add sidebar (Settings active) |

---

## Sidebar HTML Reference

Every page uses this exact sidebar block. Only the `active` class changes per page.

```html
<aside class="sidebar">
  <div class="sidebar-brand">
    <div class="sidebar-wordmark">VAN'S AUTO</div>
    <div class="sidebar-tagline">Staff Dashboard</div>
  </div>
  <nav class="sidebar-nav">
    <a href="index.html"             class="nav-item [active on Overview]">   <span class="nav-icon">🏠</span> Overview</a>
    <a href="revenue-analytics.html" class="nav-item [active on Revenue]">    <span class="nav-icon">📊</span> Revenue</a>
    <a href="customers.html"         class="nav-item [active on Customers]">  <span class="nav-icon">👥</span> Customers</a>
    <a href="index.html"             class="nav-item [active on Schedule]">   <span class="nav-icon">📅</span> Schedule</a>
    <a href="workorders.html"        class="nav-item [active on Work Orders]"><span class="nav-icon">🔧</span> Work Orders</a>
    <a href="inventory.html"         class="nav-item [active on Inventory]">  <span class="nav-icon">📦</span> Inventory</a>
    <a href="technicians.html"       class="nav-item [active on Technicians]"><span class="nav-icon">👨‍🔧</span> Technicians</a>
    <a href="settings.html"          class="nav-item [active on Settings]">   <span class="nav-icon">⚙️</span> Settings</a>
  </nav>
  <div class="sidebar-footer">
    <button class="sidebar-add-btn" id="open-add-customer">+ Add Customer</button>
    <a href="/" class="sidebar-website-link">← Back to Website</a>
  </div>
</aside>
```

Replace `[active on X]` with `active` on the current page's item and leave the brackets off on all others.

---

## Task 1: CSS — Add all new classes to dashboard.css

**Files:**
- Modify: `css/dashboard.css`

- [ ] **Step 1: Append sidebar shell CSS**

Add to the bottom of `css/dashboard.css`:

```css
/* === SIDEBAR SHELL === */
.app-shell { display: flex; height: 100vh; overflow: hidden; }

.sidebar {
  width: 220px;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.06);
  overflow-y: auto;
}
.sidebar-brand {
  padding: 20px 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.sidebar-wordmark {
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
}
.sidebar-tagline {
  font-size: 10px;
  color: rgba(255,255,255,0.35);
  margin-top: 3px;
}
.sidebar-nav { flex: 1; padding: 10px 0; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  border-left: 3px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-item:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
.nav-item.active {
  color: #fff;
  background: rgba(230,57,70,0.15);
  border-left-color: #e63946;
  font-weight: 600;
}
.nav-icon { width: 18px; text-align: center; font-style: normal; }
.sidebar-footer {
  padding: 14px 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.sidebar-add-btn {
  background: #e63946;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  display: block;
  width: 100%;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.15s;
}
.sidebar-add-btn:hover { opacity: 0.85; }
.sidebar-website-link {
  color: rgba(255,255,255,0.3);
  font-size: 11px;
  text-align: center;
  display: block;
  text-decoration: none;
  transition: color 0.15s;
}
.sidebar-website-link:hover { color: rgba(255,255,255,0.6); }

/* === PAGE CONTENT SHELL === */
.page-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.page-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.page-header h1 { color: #fff; font-size: 20px; font-weight: 700; margin: 0; line-height: 1.2; }
.page-subtitle { color: rgba(255,255,255,0.45); font-size: 12px; margin-top: 4px; }
.page-header-actions { display: flex; align-items: center; gap: 8px; }
.breadcrumb { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 5px; display: block; }
.breadcrumb a { color: rgba(255,255,255,0.4); text-decoration: none; }
.breadcrumb a:hover { color: rgba(255,255,255,0.7); }
.btn-header-ghost {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 5px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background 0.15s;
}
.btn-header-ghost:hover { background: rgba(255,255,255,0.14); }
.btn-header-primary {
  background: #e63946;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.15s;
}
.btn-header-primary:hover { opacity: 0.85; }

/* === LIGHT CONTENT AREA (inside .page-body) === */
.page-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f4f5f7;
  color: #212529;
}
.page-body .card {
  background: #fff;
  color: #212529;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.page-body .card-title .label,
.page-body .label { color: #6b7280; }
.page-body .value { color: #1a1a2e; }
.page-body .subtitle { color: #6b7280; }
.page-body .kpi-card { background: #fff; color: #212529; border-left: 3px solid #e63946; }
.page-body .kpi-card.yellow { border-left-color: #facc15; }
.page-body .kpi-card.blue   { border-left-color: #60a5fa; }
.page-body .kpi-card.green  { border-left-color: #4ade80; }
.page-body .delta-up   { color: #16a34a; }
.page-body .delta-down { color: #dc2626; }
.page-body .delta-warn { color: #d97706; }
.page-body .schedule-item { background: #f8f9fa; color: #212529; }
.page-body .btn-ghost {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}
.page-body .btn-ghost:hover { opacity: 0.85; }
.page-body canvas { filter: none; }
.page-body table { color: #212529; }
.page-body th, .page-body td { color: #374151; border-bottom-color: #e5e7eb; }
.page-body th { color: #6b7280; }
.page-body .customer-table tr:hover td { background: #f8f9fa; }
.page-body .progress-bar { background: #e5e7eb; }
.page-body .history-row { border-bottom-color: #e5e7eb; }
.page-body .history-service { color: #1a1a2e; }
.page-body .history-cost { color: #16a34a; }
.page-body .due-banner {
  background: rgba(250,204,21,0.1);
  border-color: rgba(250,204,21,0.3);
}
.page-body .search-input {
  background: #fff;
  border-color: #e5e7eb;
  color: #212529;
}
.page-body .search-input:focus { border-color: #e63946; }
.page-body .search-input::placeholder { color: #9ca3af; }
.page-body .inventory-item.inventory-low {
  background: rgba(220,38,38,0.08);
  color: #dc2626;
}
.page-body .inventory-item.inventory-ok {
  background: rgba(22,163,74,0.08);
  color: #16a34a;
}
.page-body .status-done { background: rgba(22,163,74,0.12); color: #16a34a; }
.page-body .status-in-progress { background: rgba(217,119,6,0.12); color: #d97706; }
.page-body .status-upcoming { background: rgba(156,163,175,0.12); color: #6b7280; }

/* === ADD CUSTOMER MODAL === */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}
.modal-backdrop.open { opacity: 1; visibility: visible; }
.modal-box {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.35);
  overflow: hidden;
  transform: translateY(12px);
  transition: transform 0.2s;
}
.modal-backdrop.open .modal-box { transform: translateY(0); }
.modal-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-header h2 { color: #fff; font-size: 15px; font-weight: 700; margin: 0; }
.modal-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.modal-close:hover { color: #fff; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.form-field { display: flex; flex-direction: column; gap: 4px; }
.form-label {
  font-size: 10px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.form-input {
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  padding: 9px 12px;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  color: #212529;
  outline: none;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: #e63946; }
.form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.modal-footer {
  padding: 0 20px 20px;
  display: flex;
  gap: 10px;
}
.btn-modal-cancel {
  flex: 1;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.btn-modal-save {
  flex: 2;
  background: #e63946;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.15s;
}
.btn-modal-save:hover { opacity: 0.85; }

/* === CUSTOMER PROFILE === */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
}
.profile-col { display: flex; flex-direction: column; gap: 16px; }
.profile-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  overflow: hidden;
}
.profile-card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.profile-card-title {
  font-size: 11px;
  font-weight: 700;
  color: #1a1a2e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.profile-card-action {
  font-size: 11px;
  color: #e63946;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
.profile-card-body { padding: 16px; }

/* Profile hero */
.profile-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 20px 16px;
}
.avatar-circle {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1a1a2e, #e63946);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  flex-shrink: 0;
}
.profile-name { font-size: 17px; font-weight: 800; color: #1a1a2e; margin: 0; }
.profile-since { font-size: 12px; color: #9ca3af; }
.vip-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #fce7f3;
  color: #be185d;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}
.profile-stat {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 10px 8px;
  text-align: center;
}
.profile-stat-val { font-size: 16px; font-weight: 800; color: #1a1a2e; }
.profile-stat-val.red { color: #e63946; }
.profile-stat-lbl { font-size: 9px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 2px; }

/* Contact info rows */
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}
.info-row:last-child { border-bottom: none; }
.info-icon {
  width: 30px;
  height: 30px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.info-lbl { font-size: 10px; color: #9ca3af; margin-bottom: 1px; }
.info-val { font-size: 12px; color: #1a1a2e; font-weight: 500; }

/* Vehicles */
.vehicle-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 11px 14px;
  margin-bottom: 8px;
}
.vehicle-item:last-child { margin-bottom: 0; }
.vehicle-icon { font-size: 22px; }
.vehicle-name { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.vehicle-detail { font-size: 11px; color: #9ca3af; margin-top: 1px; }
.vehicle-primary {
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 10px;
  background: #dcfce7;
  color: #16a34a;
  white-space: nowrap;
}

/* Service history */
.history-entry {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}
.history-entry:last-child { border-bottom: none; }
.history-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #e63946;
  margin-top: 4px;
  flex-shrink: 0;
}
.history-dot.muted { background: #d1d5db; }
.history-service-name { font-size: 13px; font-weight: 600; color: #1a1a2e; }
.history-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.history-entry-cost { margin-left: auto; font-size: 13px; font-weight: 700; color: #1a1a2e; white-space: nowrap; }
.history-view-all {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  color: #e63946;
  font-weight: 600;
  cursor: pointer;
}

/* Notes */
.notes-text {
  font-size: 12px;
  color: #6b7280;
  background: #f8f9fa;
  border-radius: 5px;
  padding: 10px 12px;
  line-height: 1.6;
  font-style: italic;
}
.notes-empty { color: #9ca3af; font-size: 12px; font-style: italic; }
```

- [ ] **Step 2: Verify CSS file is valid — open any dashboard page in browser and check for console errors**

- [ ] **Step 3: Commit**

```bash
git add dashboard/css/dashboard.css
git commit -m "feat: add sidebar shell, page-header, light-theme, modal, and profile CSS"
```

---

## Task 2: Enrich demo.json with profile fields

**Files:**
- Modify: `dashboard/data/demo.json`

- [ ] **Step 1: Add address, vehicles, preferredContact, notes fields to each customer**

For each customer object in the `"customers"` array, add the fields below. Also add a `"vehicle"` field to each history entry so the profile page can show which car was serviced. Here is the complete enriched data to merge in:

**Customer 1 — Randy Kowalski** (after existing fields, before the closing `}`):
```json
"address": "1204 Portage Rd, Kalamazoo, MI 49001",
"preferredContact": "Phone",
"notes": "Prefers early morning appointments. Always check tire pressure before close.",
"vehicles": [
  { "year": "2019", "make": "Chevy", "model": "Silverado", "vin": "1GCRYDED0KZ248301", "color": "White", "primary": true }
]
```
Update each history entry to add `"vehicle": "2019 Chevy Silverado"`.

**Customer 2 — Linda Perkins** (add after existing fields):
```json
"address": "3318 Stadium Dr, Kalamazoo, MI 49008",
"preferredContact": "Text",
"notes": "Texting is best — she works during the day. Always bring in her Tahoe.",
"vehicles": [
  { "year": "2021", "make": "Chevy", "model": "Tahoe", "vin": "1GNSKCKD5MR123789", "color": "Black", "primary": true },
  { "year": "2018", "make": "Honda", "model": "CR-V", "vin": "2HKRW2H84JH547821", "color": "Blue", "primary": false }
]
```
Update history entries: first two use "2021 Chevy Tahoe", last two use "2021 Chevy Tahoe".

**Customer 3 — Tom Harrington** (add after existing fields):
```json
"address": "742 N Westnedge Ave, Kalamazoo, MI 49007",
"preferredContact": "Email",
"notes": "Long-time customer since 2022. Works at Stryker. Very particular about oil brands — uses full synthetic only.",
"vehicles": [
  { "year": "2018", "make": "Ford", "model": "F-150", "vin": "1FTEW1E59JKE10022", "color": "Silver", "primary": true }
]
```
Update each history entry to add `"vehicle": "2018 Ford F-150"`.

**Customer 4 — Greta Vandenberg** (add after existing fields):
```json
"address": "5521 Lovers Ln, Portage, MI 49002",
"preferredContact": "Phone",
"notes": "",
"vehicles": [
  { "year": "2020", "make": "Honda", "model": "CR-V", "vin": "2HKRW2H57LH614833", "color": "Red", "primary": true }
]
```
Update each history entry to add `"vehicle": "2020 Honda CR-V"`.

**Customer 5 — Bill Nowak** (add after existing fields):
```json
"address": "901 Gull Rd, Kalamazoo, MI 49048",
"preferredContact": "Phone",
"notes": "Check engine light returns intermittently. O2 sensor was replaced May 2025 — monitor.",
"vehicles": [
  { "year": "2016", "make": "Dodge", "model": "Ram 1500", "vin": "1C6RR6LT9GS155421", "color": "Blue", "primary": true }
]
```
Update each history entry to add `"vehicle": "2016 Dodge Ram 1500"`.

**Customer 6 — Cindy Morrow** (add after existing fields):
```json
"address": "2140 Ravine Rd, Kalamazoo, MI 49004",
"preferredContact": "Text",
"notes": "",
"vehicles": [
  { "year": "2022", "make": "Toyota", "model": "Camry", "vin": "4T1C11AK3NU064229", "color": "White", "primary": true }
]
```
Update each history entry to add `"vehicle": "2022 Toyota Camry"`.

**Customer 7 — Pete Szabo** (add after existing fields):
```json
"address": "631 Alcott St, Kalamazoo, MI 49001",
"preferredContact": "Phone",
"notes": "",
"vehicles": [
  { "year": "2017", "make": "Ford", "model": "Escape", "vin": "1FMCU0GD0HUA34561", "color": "Gray", "primary": true }
]
```
Update each history entry to add `"vehicle": "2017 Ford Escape"`.

**Customer 8 — Janet Fox** (add after existing fields):
```json
"address": "4803 W Main St, Kalamazoo, MI 49006",
"preferredContact": "Email",
"notes": "Retired teacher. Very friendly. Prefers appointments before noon.",
"vehicles": [
  { "year": "2020", "make": "Subaru", "model": "Outback", "vin": "4S4BTACC5L3251047", "color": "Green", "primary": true }
]
```
Update each history entry to add `"vehicle": "2020 Subaru Outback"`.

**Customer 9 — Marcus Webb** (add after existing fields):
```json
"address": "1755 Howard St, Kalamazoo, MI 49008",
"preferredContact": "Text",
"notes": "AC recharge done July 2025 — no leak found. If it returns, check compressor.",
"vehicles": [
  { "year": "2019", "make": "GMC", "model": "Sierra", "vin": "3GTU9CED8KG248771", "color": "Black", "primary": true }
]
```
Update each history entry to add `"vehicle": "2019 GMC Sierra"`.

**Customer 10 — Donna Craft** (add after existing fields):
```json
"address": "3290 Crosstown Pkwy, Portage, MI 49024",
"preferredContact": "Phone",
"notes": "Rough idle was a vacuum leak (June 2025). Watch for return.",
"vehicles": [
  { "year": "2018", "make": "Jeep", "model": "Grand Cherokee", "vin": "1C4RJFBG5JC278832", "color": "Silver", "primary": true }
]
```
Update each history entry to add `"vehicle": "2018 Jeep Grand Cherokee"`.

**Customer 11 — Steve Holton** (add after existing fields):
```json
"address": "812 Vine St, Kalamazoo, MI 49001",
"preferredContact": "Email",
"notes": "Performance enthusiast. Prefers OEM+ or performance parts. Knows his stuff.",
"vehicles": [
  { "year": "2015", "make": "Ford", "model": "Mustang", "vin": "1FA6P8TH7F5395622", "color": "Red", "primary": true }
]
```
Update each history entry to add `"vehicle": "2015 Ford Mustang"`.

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('dashboard/data/demo.json','utf8')); console.log('Valid JSON')"
```

Expected output: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add dashboard/data/demo.json
git commit -m "feat: enrich customer data with address, vehicles, preferredContact, and notes"
```

---

## Task 3: Create js/add-customer-modal.js

**Files:**
- Create: `dashboard/js/add-customer-modal.js`

- [ ] **Step 1: Create the file**

```javascript
(function () {
  // Inject modal HTML into body
  const backdrop = document.createElement('div');
  backdrop.id = 'add-customer-backdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h2 id="modal-title">Add New Customer</h2>
        <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-field">
          <label class="form-label" for="modal-name">Full Name</label>
          <input class="form-input" id="modal-name" type="text" placeholder="e.g. Jane Smith">
        </div>
        <div class="form-field">
          <label class="form-label" for="modal-phone">Phone</label>
          <input class="form-input" id="modal-phone" type="tel" placeholder="(269) 555-0000">
        </div>
        <div class="form-field">
          <label class="form-label" for="modal-email">Email</label>
          <input class="form-input" id="modal-email" type="email" placeholder="jane@email.com">
        </div>
        <div class="form-field">
          <label class="form-label" for="modal-address">Address</label>
          <input class="form-input" id="modal-address" type="text" placeholder="123 Main St, Kalamazoo MI">
        </div>
        <div class="form-field">
          <label class="form-label">Vehicle</label>
          <div class="form-row">
            <input class="form-input" id="modal-year"  type="text" placeholder="Year">
            <input class="form-input" id="modal-make"  type="text" placeholder="Make">
            <input class="form-input" id="modal-model" type="text" placeholder="Model">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-modal-cancel" id="modal-cancel-btn">Cancel</button>
        <button class="btn-modal-save"   id="modal-save-btn">Save Customer</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  function openAddCustomerModal() {
    backdrop.classList.add('open');
    document.getElementById('modal-name').focus();
  }

  function closeAddCustomerModal() {
    backdrop.classList.remove('open');
    // Reset fields
    ['modal-name','modal-phone','modal-email','modal-address','modal-year','modal-make','modal-model']
      .forEach(id => { document.getElementById(id).value = ''; });
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Wire up trigger button (sidebar "+" button)
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'open-add-customer') openAddCustomerModal();
  });

  document.getElementById('modal-close-btn').addEventListener('click', closeAddCustomerModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeAddCustomerModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeAddCustomerModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeAddCustomerModal();
  });

  document.getElementById('modal-save-btn').addEventListener('click', function () {
    const name = document.getElementById('modal-name').value.trim();
    if (!name) {
      document.getElementById('modal-name').focus();
      return;
    }
    closeAddCustomerModal();
    showToast('✓ Customer added: ' + name);
  });

  // Expose globally so pages can call it directly if needed
  window.openAddCustomerModal = openAddCustomerModal;
})();
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/js/add-customer-modal.js
git commit -m "feat: add shared Add Customer modal script"
```

---

## Task 4: Create customer-profile.html and js/customer-profile.js

**Files:**
- Create: `dashboard/customer-profile.html`
- Create: `dashboard/js/customer-profile.js`

- [ ] **Step 1: Write a pure helper — create dashboard/js/customer-profile.js**

```javascript
/* === PURE HELPERS === */

function getCustomerById(customers, id) {
  return customers.find(c => c.id === id) || null;
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getCustomerSince(history) {
  if (!history || history.length === 0) return '—';
  const oldest = history[history.length - 1].date;
  return new Date(oldest).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getAvgJob(totalSpent, historyLength) {
  if (!historyLength) return '$0';
  return formatCurrency(totalSpent / historyLength);
}

/* === RENDER === */

function renderProfile(customer) {
  const visits = customer.history ? customer.history.length : 0;
  const since = getCustomerSince(customer.history);
  const isVip = customer.totalSpent > 1000;

  // Page header
  document.getElementById('profile-breadcrumb').innerHTML = '<a href="customers.html">← All Customers</a>';
  document.getElementById('profile-title').textContent = customer.name;
  document.getElementById('profile-subtitle').textContent = `Customer since ${since} · ${visits} visit${visits !== 1 ? 's' : ''}`;

  // Avatar + hero
  document.getElementById('profile-avatar').textContent = getInitials(customer.name);
  document.getElementById('hero-name').textContent = customer.name;
  document.getElementById('hero-since').textContent = `Customer since ${since}`;
  document.getElementById('hero-vip').style.display = isVip ? 'inline-flex' : 'none';

  // Stats
  document.getElementById('stat-spent').textContent = formatCurrency(customer.totalSpent);
  document.getElementById('stat-visits').textContent = visits;
  document.getElementById('stat-avg').textContent = getAvgJob(customer.totalSpent, visits);
  document.getElementById('stat-last').textContent = customer.lastVisit ? formatDate(customer.lastVisit) : '—';

  // Contact
  document.getElementById('info-phone').textContent = customer.phone || '—';
  document.getElementById('info-email').textContent = customer.email || '—';
  document.getElementById('info-address').textContent = customer.address || '—';
  document.getElementById('info-contact').textContent = customer.preferredContact || 'Phone';

  // Notes
  const notesEl = document.getElementById('notes-text');
  if (customer.notes) {
    notesEl.textContent = customer.notes;
    notesEl.className = 'notes-text';
  } else {
    notesEl.textContent = 'No notes yet.';
    notesEl.className = 'notes-empty';
  }

  // Vehicles
  const vehiclesEl = document.getElementById('vehicles-list');
  const vehicles = customer.vehicles || [];
  if (vehicles.length === 0) {
    vehiclesEl.innerHTML = '<p class="notes-empty">No vehicles on file.</p>';
  } else {
    vehiclesEl.innerHTML = vehicles.map(v => `
      <div class="vehicle-item">
        <span class="vehicle-icon">🚗</span>
        <div>
          <div class="vehicle-name">${v.year} ${v.make} ${v.model}</div>
          <div class="vehicle-detail">${v.vin ? 'VIN: ' + v.vin : ''} ${v.color ? '· ' + v.color : ''}</div>
        </div>
        ${v.primary ? '<span class="vehicle-primary">Primary</span>' : ''}
      </div>
    `).join('');
  }

  // Service history
  const historyEl = document.getElementById('history-list');
  const history = customer.history || [];
  if (history.length === 0) {
    historyEl.innerHTML = '<p class="notes-empty">No service history.</p>';
  } else {
    historyEl.innerHTML = history.slice(0, 5).map((h, i) => `
      <div class="history-entry">
        <div class="history-dot ${i === 0 ? '' : 'muted'}"></div>
        <div style="flex:1;min-width:0">
          <div class="history-service-name">${h.service}</div>
          <div class="history-meta">${formatDate(h.date)}${h.tech ? ' · ' + h.tech : ''}${h.vehicle ? ' · ' + h.vehicle : ''}</div>
        </div>
        <div class="history-entry-cost">${formatCurrency(h.cost)}</div>
      </div>
    `).join('');

    if (history.length > 5) {
      historyEl.innerHTML += `<div class="history-view-all">View all ${history.length} visits →</div>`;
    }
  }
}

/* === INIT === */

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  if (!id) {
    window.location.href = 'customers.html';
    return;
  }

  const res = await fetch('data/demo.json');
  const data = await res.json();
  const customer = getCustomerById(data.customers, id);

  if (!customer) {
    window.location.href = 'customers.html';
    return;
  }

  renderProfile(customer);
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 2: Create dashboard/customer-profile.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customer Profile — Van's Auto Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Oswald:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
  <div class="app-shell">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-wordmark">VAN'S AUTO</div>
        <div class="sidebar-tagline">Staff Dashboard</div>
      </div>
      <nav class="sidebar-nav">
        <a href="index.html"             class="nav-item"><span class="nav-icon">🏠</span> Overview</a>
        <a href="revenue-analytics.html" class="nav-item"><span class="nav-icon">📊</span> Revenue</a>
        <a href="customers.html"         class="nav-item active"><span class="nav-icon">👥</span> Customers</a>
        <a href="index.html"             class="nav-item"><span class="nav-icon">📅</span> Schedule</a>
        <a href="workorders.html"        class="nav-item"><span class="nav-icon">🔧</span> Work Orders</a>
        <a href="inventory.html"         class="nav-item"><span class="nav-icon">📦</span> Inventory</a>
        <a href="technicians.html"       class="nav-item"><span class="nav-icon">👨‍🔧</span> Technicians</a>
        <a href="settings.html"          class="nav-item"><span class="nav-icon">⚙️</span> Settings</a>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-add-btn" id="open-add-customer">+ Add Customer</button>
        <a href="/" class="sidebar-website-link">← Back to Website</a>
      </div>
    </aside>

    <!-- PAGE CONTENT -->
    <div class="page-content">
      <header class="page-header">
        <div>
          <span class="breadcrumb" id="profile-breadcrumb"></span>
          <h1 id="profile-title">Loading…</h1>
          <div class="page-subtitle" id="profile-subtitle"></div>
        </div>
        <div class="page-header-actions">
          <button class="btn-header-ghost">📞 Call</button>
          <button class="btn-header-ghost">✉️ Email</button>
          <button class="btn-header-primary">+ New Work Order</button>
        </div>
      </header>

      <main class="page-body">
        <div class="profile-grid">

          <!-- LEFT COLUMN -->
          <div class="profile-col">

            <!-- Hero -->
            <div class="profile-card">
              <div class="profile-hero">
                <div class="avatar-circle" id="profile-avatar"></div>
                <div>
                  <div class="profile-name" id="hero-name"></div>
                  <div class="profile-since" id="hero-since"></div>
                </div>
                <span class="vip-badge" id="hero-vip">⭐ VIP Customer</span>
                <div class="profile-stats">
                  <div class="profile-stat">
                    <div class="profile-stat-val red" id="stat-spent">—</div>
                    <div class="profile-stat-lbl">Total Spent</div>
                  </div>
                  <div class="profile-stat">
                    <div class="profile-stat-val" id="stat-visits">—</div>
                    <div class="profile-stat-lbl">Visits</div>
                  </div>
                  <div class="profile-stat">
                    <div class="profile-stat-val" id="stat-avg">—</div>
                    <div class="profile-stat-lbl">Avg Job</div>
                  </div>
                  <div class="profile-stat">
                    <div class="profile-stat-val" id="stat-last">—</div>
                    <div class="profile-stat-lbl">Last Visit</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact -->
            <div class="profile-card">
              <div class="profile-card-header">
                <span class="profile-card-title">Contact Info</span>
                <span class="profile-card-action">Edit</span>
              </div>
              <div class="profile-card-body">
                <div class="info-row">
                  <div class="info-icon">📞</div>
                  <div><div class="info-lbl">Phone</div><div class="info-val" id="info-phone">—</div></div>
                </div>
                <div class="info-row">
                  <div class="info-icon">✉️</div>
                  <div><div class="info-lbl">Email</div><div class="info-val" id="info-email">—</div></div>
                </div>
                <div class="info-row">
                  <div class="info-icon">📍</div>
                  <div><div class="info-lbl">Address</div><div class="info-val" id="info-address">—</div></div>
                </div>
                <div class="info-row">
                  <div class="info-icon">💬</div>
                  <div><div class="info-lbl">Preferred Contact</div><div class="info-val" id="info-contact">—</div></div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="profile-card">
              <div class="profile-card-header">
                <span class="profile-card-title">Staff Notes</span>
                <span class="profile-card-action">Add Note</span>
              </div>
              <div class="profile-card-body">
                <div id="notes-text" class="notes-text"></div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN -->
          <div class="profile-col">

            <!-- Vehicles -->
            <div class="profile-card">
              <div class="profile-card-header">
                <span class="profile-card-title">🚗 Vehicles</span>
                <span class="profile-card-action">+ Add Vehicle</span>
              </div>
              <div class="profile-card-body" id="vehicles-list"></div>
            </div>

            <!-- Service History -->
            <div class="profile-card">
              <div class="profile-card-header">
                <span class="profile-card-title">🔧 Service History</span>
              </div>
              <div class="profile-card-body" id="history-list"></div>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>

  <div id="toast" class="toast"></div>
  <script src="js/add-customer-modal.js"></script>
  <script src="js/customer-profile.js"></script>
</body>
</html>
```

- [ ] **Step 3: Open in browser — navigate to `dashboard/customer-profile.html?id=1`**

Verify: Randy Kowalski's name appears in header, all 5 history entries render, phone/email/address display correctly, VIP badge shows (totalSpent $1,840 > $1,000), Silverado vehicle card appears.

- [ ] **Step 4: Commit**

```bash
git add dashboard/customer-profile.html dashboard/js/customer-profile.js
git commit -m "feat: add customer profile page with vehicles, history, contact, and notes"
```

---

## Task 5: Update index.html

**Files:**
- Modify: `dashboard/index.html`

- [ ] **Step 1: Replace the `<body>` opening and `<header>` block**

Replace the existing `<header class="header">...</header>` block (lines ~16–27) and the `<body>` opening with:

```html
<body>
<div class="app-shell">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-wordmark">VAN'S AUTO</div>
      <div class="sidebar-tagline">Staff Dashboard</div>
    </div>
    <nav class="sidebar-nav">
      <a href="index.html"             class="nav-item active"><span class="nav-icon">🏠</span> Overview</a>
      <a href="revenue-analytics.html" class="nav-item"><span class="nav-icon">📊</span> Revenue</a>
      <a href="customers.html"         class="nav-item"><span class="nav-icon">👥</span> Customers</a>
      <a href="index.html"             class="nav-item"><span class="nav-icon">📅</span> Schedule</a>
      <a href="workorders.html"        class="nav-item"><span class="nav-icon">🔧</span> Work Orders</a>
      <a href="inventory.html"         class="nav-item"><span class="nav-icon">📦</span> Inventory</a>
      <a href="technicians.html"       class="nav-item"><span class="nav-icon">👨‍🔧</span> Technicians</a>
      <a href="settings.html"          class="nav-item"><span class="nav-icon">⚙️</span> Settings</a>
    </nav>
    <div class="sidebar-footer">
      <button class="sidebar-add-btn" id="open-add-customer">+ Add Customer</button>
      <a href="/" class="sidebar-website-link">← Back to Website</a>
    </div>
  </aside>

  <!-- PAGE CONTENT -->
  <div class="page-content">
    <header class="page-header">
      <div>
        <h1>Overview</h1>
        <div class="page-subtitle">Van's Auto Repair · Kalamazoo, MI</div>
      </div>
      <div class="page-header-actions">
        <button class="btn-header-ghost" id="btn-connect-pos">Connect POS ↗</button>
        <button class="btn-header-primary" id="btn-start-tour">▶ Start Tour</button>
      </div>
    </header>
```

- [ ] **Step 2: Replace `<main class="main">` with `<main class="page-body">` and close the shell**

Change the opening tag from:
```html
<main class="main">
```
to:
```html
<main class="page-body">
```

Before the closing `</body>` tag, close the shell divs. Replace the existing:
```html
  <div class="toast" id="toast"></div>
```
with:
```html
      </main>
    </div><!-- end .page-content -->
  </div><!-- end .app-shell -->

  <div id="toast" class="toast"></div>
```

- [ ] **Step 3: Add the modal script before closing `</body>`**

Add `<script src="js/add-customer-modal.js"></script>` after the existing script tags and before `</body>`.

- [ ] **Step 4: Open in browser — verify**

- Sidebar visible on left, "Overview" item highlighted in red
- All KPI cards, charts, and schedule cards still display correctly
- "Connect POS ↗" and "▶ Start Tour" buttons in page header
- "← Back to Website" in sidebar footer links to root
- Clicking "+ Add Customer" opens the modal

- [ ] **Step 5: Commit**

```bash
git add dashboard/index.html
git commit -m "feat: add sidebar navigation to main dashboard overview"
```

---

## Task 6: Update revenue-analytics.html

**Files:**
- Modify: `dashboard/revenue-analytics.html`

- [ ] **Step 1: Replace the entire `<head>` inline `<style>` block and `<body>` structure**

Remove the existing `<style>` block (the one with `.container`, `table color:#000 !important` overrides — lines ~9–30).

Replace the existing `<body>` and `<header class="sticky-header">` block through `<main class="container">` with:

```html
<body>
<div class="app-shell">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-wordmark">VAN'S AUTO</div>
      <div class="sidebar-tagline">Staff Dashboard</div>
    </div>
    <nav class="sidebar-nav">
      <a href="index.html"             class="nav-item"><span class="nav-icon">🏠</span> Overview</a>
      <a href="revenue-analytics.html" class="nav-item active"><span class="nav-icon">📊</span> Revenue</a>
      <a href="customers.html"         class="nav-item"><span class="nav-icon">👥</span> Customers</a>
      <a href="index.html"             class="nav-item"><span class="nav-icon">📅</span> Schedule</a>
      <a href="workorders.html"        class="nav-item"><span class="nav-icon">🔧</span> Work Orders</a>
      <a href="inventory.html"         class="nav-item"><span class="nav-icon">📦</span> Inventory</a>
      <a href="technicians.html"       class="nav-item"><span class="nav-icon">👨‍🔧</span> Technicians</a>
      <a href="settings.html"          class="nav-item"><span class="nav-icon">⚙️</span> Settings</a>
    </nav>
    <div class="sidebar-footer">
      <button class="sidebar-add-btn" id="open-add-customer">+ Add Customer</button>
      <a href="/" class="sidebar-website-link">← Back to Website</a>
    </div>
  </aside>

  <!-- PAGE CONTENT -->
  <div class="page-content">
    <header class="page-header">
      <div>
        <h1>Revenue Analytics</h1>
        <div class="page-subtitle">6-month performance overview</div>
      </div>
      <div class="page-header-actions">
        <button class="btn-header-ghost">Export CSV</button>
      </div>
    </header>

    <main class="page-body">
```

- [ ] **Step 2: Close the shell at the bottom**

Replace the existing closing:
```html
    </main>

    <!-- TOAST NOTIFICATION -->
    <div id="toast" class="toast"></div>
  </div>
```
with:
```html
    </main>
  </div><!-- end .page-content -->
</div><!-- end .app-shell -->

<div id="toast" class="toast"></div>
```

- [ ] **Step 3: Add modal script**

Add `<script src="js/add-customer-modal.js"></script>` before the existing `<script src="js/revenue-analytics.js"></script>`.

- [ ] **Step 4: Open in browser — verify**

- Sidebar shows "Revenue" item highlighted
- KPI cards, trend chart, top services list, tables all render correctly with readable text (no more `color:#000 !important` needed — `.page-body` CSS handles it)
- "Export CSV" button visible in header

- [ ] **Step 5: Commit**

```bash
git add dashboard/revenue-analytics.html
git commit -m "feat: add sidebar and polish header on revenue analytics page"
```

---

## Task 7: Update customers.html

**Files:**
- Modify: `dashboard/customers.html`
- Modify: `dashboard/js/customers.js`

- [ ] **Step 1: Replace the `<header class="header">` block with sidebar shell**

Replace the existing `<header class="header">...</header>` and the `<style>` block with:

```html
<body>
<div class="app-shell">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-wordmark">VAN'S AUTO</div>
      <div class="sidebar-tagline">Staff Dashboard</div>
    </div>
    <nav class="sidebar-nav">
      <a href="index.html"             class="nav-item"><span class="nav-icon">🏠</span> Overview</a>
      <a href="revenue-analytics.html" class="nav-item"><span class="nav-icon">📊</span> Revenue</a>
      <a href="customers.html"         class="nav-item active"><span class="nav-icon">👥</span> Customers</a>
      <a href="index.html"             class="nav-item"><span class="nav-icon">📅</span> Schedule</a>
      <a href="workorders.html"        class="nav-item"><span class="nav-icon">🔧</span> Work Orders</a>
      <a href="inventory.html"         class="nav-item"><span class="nav-icon">📦</span> Inventory</a>
      <a href="technicians.html"       class="nav-item"><span class="nav-icon">👨‍🔧</span> Technicians</a>
      <a href="settings.html"          class="nav-item"><span class="nav-icon">⚙️</span> Settings</a>
    </nav>
    <div class="sidebar-footer">
      <button class="sidebar-add-btn" id="open-add-customer">+ Add Customer</button>
      <a href="/" class="sidebar-website-link">← Back to Website</a>
    </div>
  </aside>

  <!-- PAGE CONTENT -->
  <div class="page-content">
    <header class="page-header">
      <div>
        <h1>Customers</h1>
        <div class="page-subtitle" id="customer-count-header">Loading…</div>
      </div>
      <div class="page-header-actions">
        <input type="text" class="search-input" id="search-input" placeholder="Search by name, vehicle, email…" style="width:240px;background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.15);color:#fff;">
        <button class="btn-header-ghost">Export</button>
      </div>
    </header>

    <main class="page-body">
```

- [ ] **Step 2: Close the shell at the bottom of customers.html**

Before `</body>`, replace the existing close tags with:

```html
      </main>
    </div><!-- end .page-content -->
  </div><!-- end .app-shell -->

  <!-- HISTORY PANEL (keep for now, profile page is primary) -->
  <div class="history-panel" id="history-panel">
    <!-- existing history panel content stays -->
  </div>

  <div id="toast" class="toast"></div>
  <script src="js/add-customer-modal.js"></script>
  <script src="js/customers.js"></script>
</body>
```

- [ ] **Step 3: Update customers.js — navigate to profile on row click**

In `dashboard/js/customers.js`, find the `renderTable` function. Change the `onclick` on each `<tr>` from `openHistory(${c.id})` to `navigateToProfile(${c.id})`.

Change this line:
```javascript
      <tr class="${due ? 'overdue' : ''}" onclick="openHistory(${c.id})">
```
to:
```javascript
      <tr class="${due ? 'overdue' : ''}" onclick="navigateToProfile(${c.id})">
```

Then add this function near the bottom of `customers.js`, before the `init` function:

```javascript
function navigateToProfile(id) {
  window.location.href = 'customer-profile.html?id=' + id;
}
```

- [ ] **Step 4: Update the customer count subtitle in the page header**

In `renderTable`, find:
```javascript
  document.getElementById('customer-count').textContent = `${customers.length} customers`;
```
Add after it:
```javascript
  const headerCount = document.getElementById('customer-count-header');
  if (headerCount) headerCount.textContent = `${customers.length} customers`;
```

- [ ] **Step 5: Open in browser — verify**

- Sidebar shows "Customers" highlighted
- Customer rows are clickable — clicking Randy Kowalski navigates to `customer-profile.html?id=1`
- Search input in page header filters the table
- Count shows in header subtitle

- [ ] **Step 6: Commit**

```bash
git add dashboard/customers.html dashboard/js/customers.js
git commit -m "feat: add sidebar to customers page and link rows to customer profile"
```

---

## Task 8: Update inventory.html

**Files:**
- Modify: `dashboard/inventory.html`

- [ ] **Step 1: Read the current inventory.html structure to identify the header block**

Open `dashboard/inventory.html` and find the `<header>` element and surrounding structure.

- [ ] **Step 2: Wrap with app-shell — replace the header**

Replace the existing `<header>` block with the sidebar shell. Use this page-header:

```html
    <header class="page-header">
      <div>
        <h1>Inventory</h1>
        <div class="page-subtitle">Parts and supplies stock levels</div>
      </div>
    </header>
```

Sidebar block: same as all other pages, with `active` on the Inventory item:
```html
<a href="inventory.html" class="nav-item active"><span class="nav-icon">📦</span> Inventory</a>
```

Replace `<main class="main">` (or equivalent) with `<main class="page-body">`.

Close the shell before `</body>`, add modal script.

- [ ] **Step 3: Open in browser — verify sidebar shows "Inventory" highlighted**

- [ ] **Step 4: Commit**

```bash
git add dashboard/inventory.html
git commit -m "feat: add sidebar to inventory page"
```

---

## Task 9: Update workorders.html

**Files:**
- Modify: `dashboard/workorders.html`

- [ ] **Step 1: Replace header with sidebar shell**

Page-header title: "Work Orders", subtitle: "Active jobs and service requests".

Sidebar: `active` on Work Orders item:
```html
<a href="workorders.html" class="nav-item active"><span class="nav-icon">🔧</span> Work Orders</a>
```

Replace main wrapper with `<main class="page-body">`. Close shell, add modal script.

- [ ] **Step 2: Open in browser — verify "Work Orders" highlighted in sidebar**

- [ ] **Step 3: Commit**

```bash
git add dashboard/workorders.html
git commit -m "feat: add sidebar to work orders page"
```

---

## Task 10: Update technicians.html

**Files:**
- Modify: `dashboard/technicians.html`

- [ ] **Step 1: Replace header with sidebar shell**

Page-header title: "Technicians", subtitle: "Team performance and scheduling".

Sidebar: `active` on Technicians item:
```html
<a href="technicians.html" class="nav-item active"><span class="nav-icon">👨‍🔧</span> Technicians</a>
```

Replace main wrapper with `<main class="page-body">`. Close shell, add modal script.

- [ ] **Step 2: Open in browser — verify "Technicians" highlighted in sidebar**

- [ ] **Step 3: Commit**

```bash
git add dashboard/technicians.html
git commit -m "feat: add sidebar to technicians page"
```

---

## Task 11: Update settings.html

**Files:**
- Modify: `dashboard/settings.html`

- [ ] **Step 1: Remove the custom `.sticky-header` inline `<style>` block**

Delete the entire `<style>` block that defines `.sticky-header`, `.header-content`, `.back-button`, `.header-content h1`, `.container` (the one at the top of settings.html's `<head>`). The sidebar CSS from `dashboard.css` replaces it.

- [ ] **Step 2: Replace the header and container structure**

Replace the existing `<header class="sticky-header">...</header>` and `<div class="container">` with:

```html
<body>
<div class="app-shell">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-wordmark">VAN'S AUTO</div>
      <div class="sidebar-tagline">Staff Dashboard</div>
    </div>
    <nav class="sidebar-nav">
      <a href="index.html"             class="nav-item"><span class="nav-icon">🏠</span> Overview</a>
      <a href="revenue-analytics.html" class="nav-item"><span class="nav-icon">📊</span> Revenue</a>
      <a href="customers.html"         class="nav-item"><span class="nav-icon">👥</span> Customers</a>
      <a href="index.html"             class="nav-item"><span class="nav-icon">📅</span> Schedule</a>
      <a href="workorders.html"        class="nav-item"><span class="nav-icon">🔧</span> Work Orders</a>
      <a href="inventory.html"         class="nav-item"><span class="nav-icon">📦</span> Inventory</a>
      <a href="technicians.html"       class="nav-item"><span class="nav-icon">👨‍🔧</span> Technicians</a>
      <a href="settings.html"          class="nav-item active"><span class="nav-icon">⚙️</span> Settings</a>
    </nav>
    <div class="sidebar-footer">
      <button class="sidebar-add-btn" id="open-add-customer">+ Add Customer</button>
      <a href="/" class="sidebar-website-link">← Back to Website</a>
    </div>
  </aside>

  <!-- PAGE CONTENT -->
  <div class="page-content">
    <header class="page-header">
      <div>
        <h1>Settings &amp; Configuration</h1>
        <div class="page-subtitle">Business hours, team, services, and permissions</div>
      </div>
    </header>

    <main class="page-body">
      <div class="container" style="max-width:1200px;margin:0 auto">
```

- [ ] **Step 3: Close the shell at the bottom**

Replace the closing `</div>` (container) and `</div>` (page-wrapper) with:

```html
      </div><!-- end container -->
    </main>
  </div><!-- end .page-content -->
</div><!-- end .app-shell -->

<div id="toast" class="toast"></div>
<script src="js/add-customer-modal.js"></script>
<script src="js/settings.js"></script>
</body>
</html>
```

- [ ] **Step 4: Open in browser — verify**

- Sidebar shows "Settings" highlighted
- All 5 tabs (Hours, Team, Services, Notifications, Permissions) still function
- Tab switching still works
- Table content renders correctly

- [ ] **Step 5: Commit**

```bash
git add dashboard/settings.html
git commit -m "feat: add sidebar to settings page, remove custom header CSS"
```

---

## Task 12: Final verification and push

- [ ] **Step 1: Open each page in browser and verify sidebar nav**

| Page | Active item | URL |
|------|-------------|-----|
| `index.html` | Overview | — |
| `revenue-analytics.html` | Revenue | — |
| `customers.html` | Customers | — |
| `customer-profile.html?id=3` | Customers | Tom Harrington |
| `inventory.html` | Inventory | — |
| `workorders.html` | Work Orders | — |
| `technicians.html` | Technicians | — |
| `settings.html` | Settings | — |

- [ ] **Step 2: Verify Add Customer modal**

Click "+ Add Customer" on any page. Modal opens. Fill in a name and click "Save Customer" — toast appears. Cancel closes without saving.

- [ ] **Step 3: Verify customer profile navigation**

On `customers.html`, click any row. Confirm navigation to `customer-profile.html?id=N`. Confirm profile renders with correct name, stats, vehicles, and history. Confirm "← All Customers" breadcrumb returns to `customers.html`.

- [ ] **Step 4: Verify sidebar link — "← Back to Website"**

Clicking the link navigates to `/` (the customer-facing website `index.html`).

- [ ] **Step 5: Push to GitHub**

```bash
git push origin main
```

Expected: all commits push cleanly to remote.
