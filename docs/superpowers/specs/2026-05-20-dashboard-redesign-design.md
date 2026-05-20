# Dashboard Redesign — Design Spec
**Date:** 2026-05-20  
**Status:** Approved for implementation

---

## Context

The dashboard sub-pages (Revenue Analytics, Customers, Inventory, Work Orders, Technicians, Settings) each have inconsistent headers, no shared navigation, and scattered "← back" links. The Revenue Analytics page in particular has a raw, unpolished layout. The goal is to unify all pages under a persistent dark sidebar navigation that matches the brand, give every page a polished gradient header, and add a customer profile page with full service history and vehicle tracking.

---

## What We're Building

A global sidebar layout applied to **all** dashboard pages (including the main overview), plus a new `customer-profile.html` page. The Add Customer modal already exists conceptually; we're formalizing it.

---

## Layout System

### Global Shell Structure

Every page uses this structure:

```
<body>
  <div class="app-shell">          <!-- display:flex, height:100vh -->
    <aside class="sidebar">        <!-- 220px fixed, dark navy -->
    <div class="page-content">     <!-- flex:1, flex-direction:column -->
      <header class="page-header"> <!-- gradient dark header, per-page -->
      <main class="page-body">     <!-- light gray, scrollable content -->
```

### Sidebar (shared, identical on every page)

- **Width:** 220px, fixed, full viewport height
- **Background:** `#1a1a2e` (navy)
- **Border-right:** `1px solid rgba(255,255,255,0.06)`

**Sections top to bottom:**

1. **Brand block** — "VAN'S AUTO" wordmark + "Staff Dashboard" tagline
2. **Nav items** — icon + label, with active state
3. **Footer** — "+ Add Customer" red button + "← Back to Website" link

**Nav items and their link targets:**

| Icon | Label | Links to |
|------|-------|----------|
| 🏠 | Overview | `index.html` |
| 📊 | Revenue | `revenue-analytics.html` |
| 👥 | Customers | `customers.html` |
| 📅 | Schedule | `index.html` (today's schedule card) |
| 🔧 | Work Orders | `workorders.html` |
| 📦 | Inventory | `inventory.html` |
| 👨‍🔧 | Technicians | `technicians.html` |
| ⚙️ | Settings | `settings.html` |

**Active state:** red left border (`border-left: 3px solid #e63946`) + subtle red background (`rgba(230,57,70,0.15)`) + white text.

**Inactive state:** `rgba(255,255,255,0.45)` text, transparent border.

**"+ Add Customer" button:** Red (`#e63946`), full width, opens Add Customer modal on click.

**"← Back to Website" link:** `rgba(255,255,255,0.3)` text, centered, links to `/index.html` (the customer-facing website).

### Page Header (per-page, inside `.page-content`)

- **Background:** `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`
- **Padding:** `18px 24px`
- **Border-bottom:** `1px solid rgba(255,255,255,0.06)`
- Contains: page title (white, 18px, 700 weight) + subtitle + right-side action buttons

### Page Body

- **Background:** `#f4f5f7`
- **Padding:** `20px 24px`
- Scrollable; sidebar does not scroll

---

## Pages to Update

### 1. `index.html` — Main Overview
- Replace current `<header class="header">` with the new sidebar shell
- Move logo/brand into sidebar brand block
- Move "← Website", "⚙ Settings" into sidebar footer and nav respectively
- Keep "Connect POS ↗" and "▶ Start Tour" as action buttons in the page header
- Page header title: "Good morning" or "Overview"
- Active nav item: Overview
- Content (KPI cards, charts, schedule) unchanged — just restyled within the new page-body

### 2. `revenue-analytics.html` — Revenue Analytics
- Replace sparse header with new sidebar shell
- Active nav item: Revenue
- Page header title: "Revenue Analytics" + subtitle "6-month performance overview"
- Page header action: "Export CSV" ghost button (non-functional, UI only)
- Apply KPI card top-border accent colors (red for "This Month")
- Remove inline `color: #000 !important` overrides — fix properly with scoped CSS

### 3. `customers.html` — Customer Database
- Replace `<header class="header">` with sidebar shell
- Active nav item: Customers
- Page header: "Customers" + customer count subtitle + "Export" ghost button
- Move search input into page header right side
- Each customer row becomes clickable → navigates to `customer-profile.html?id=<id>` (use name as param for demo)

### 4. `customer-profile.html` — NEW PAGE
See dedicated section below.

### 5. `inventory.html` — Inventory
- Add sidebar shell
- Active nav item: Inventory
- Page header: "Inventory" + subtitle

### 6. `workorders.html` — Work Orders
- Add sidebar shell
- Active nav item: Work Orders
- Page header: "Work Orders" + subtitle

### 7. `technicians.html` — Technicians
- Add sidebar shell
- Active nav item: Technicians
- Page header: "Technicians" + subtitle

### 8. `settings.html` — Settings
- Replace current custom `.sticky-header` with sidebar shell
- Active nav item: Settings
- Keep existing tab content unchanged; just wrap in new shell
- Page header: "Settings & Configuration"

---

## New Page: `customer-profile.html`

### How to reach it
From `customers.html`, clicking any customer row navigates to `customer-profile.html?name=Sarah+Mitchell` (demo: match by name from `demo.json`).

### Layout
Two-column inside page-body: `1fr 2fr` grid.

**Left column:**
- **Profile hero card** — avatar (initials in gradient circle), full name, "Customer since" date, VIP badge (if total spent > $1,000), stats grid (Total Spent in red, Visits, Avg Job, Last Visit)
- **Contact info card** — phone, email, address, preferred contact method. "Edit" link (non-functional for demo).
- **Staff notes card** — freetext note area. "Add Note" link (non-functional for demo).

**Right column:**
- **Vehicles card** — list of vehicles, each showing year/make/model, VIN, color. "Primary" badge on first. "+ Add Vehicle" link (non-functional).
- **Service history card** — chronological list of past jobs. Each row: colored dot, service name, date + technician + vehicle (meta line), cost right-aligned. "View all X visits →" link at bottom (no-op for demo).

**Page header:**
- Breadcrumb: "← All Customers" (links back to `customers.html`)
- Title: customer full name
- Subtitle: "Customer since [date] · [N] visits"
- Action buttons: "📞 Call" (ghost), "✉️ Email" (ghost), "+ New Work Order" (red primary, non-functional)

**Active nav item:** Customers (profile is a sub-page of customers).

### Data source
Pull from `data/demo.json`. Customer records already have: name, vehicle, totalSpent, visits, lastVisit, phone, email. Add `address`, `vehicles` (array), `serviceHistory` (array), `notes`, `preferredContact` fields to the demo data.

---

## Add Customer Modal

Triggered by the "+ Add Customer" button in the sidebar footer. Works on any page.

**Fields:**
- Full Name (text)
- Phone (text)
- Email (text)
- Address (text)
- Vehicle — Year / Make / Model (three text inputs or combined)

**Actions:**
- Cancel — closes modal
- Save Customer — for demo: shows a success toast, closes modal (no persistence)

**Styling:**
- Overlay: `rgba(0,0,0,0.45)` backdrop
- Modal: white, `border-radius: 10px`, dark gradient header matching page headers
- Max-width: `420px`, centered

---

## Shared CSS (`css/dashboard.css` additions)

Add these classes to the shared stylesheet so every page can use them without repeating inline styles:

```css
.app-shell { display: flex; height: 100vh; overflow: hidden; }
.sidebar { width: 220px; background: #1a1a2e; display: flex; flex-direction: column; flex-shrink: 0; border-right: 1px solid rgba(255,255,255,0.06); }
.sidebar-brand { padding: 20px 16px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.sidebar-nav { flex: 1; padding: 12px 0; overflow-y: auto; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; font-size: 13px; color: rgba(255,255,255,0.45); border-left: 3px solid transparent; text-decoration: none; cursor: pointer; transition: all 0.15s; }
.nav-item:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.04); }
.nav-item.active { color: #fff; background: rgba(230,57,70,0.15); border-left-color: #e63946; }
.sidebar-footer { padding: 14px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
.page-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.page-header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
.page-header h1 { color: #fff; font-size: 20px; font-weight: 700; margin: 0; }
.page-header .page-subtitle { color: rgba(255,255,255,0.45); font-size: 12px; margin-top: 3px; }
.page-body { flex: 1; overflow-y: auto; padding: 24px; background: #f4f5f7; }
.sidebar-add-btn { background: #e63946; color: #fff; border-radius: 6px; padding: 10px 12px; font-size: 13px; font-weight: 700; text-align: center; cursor: pointer; display: block; margin-bottom: 10px; }
.sidebar-website-link { color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; display: block; text-decoration: none; }
```

---

## Implementation Order

1. Add sidebar CSS to `css/dashboard.css`
2. Build sidebar HTML as a copy-paste snippet (apply to all pages)
3. Create `customer-profile.html` + `js/customer-profile.js`
4. Update `data/demo.json` with profile fields
5. Update `index.html`
6. Update `revenue-analytics.html`
7. Update `customers.html` (add row click → profile nav)
8. Update `inventory.html`, `workorders.html`, `technicians.html`, `settings.html`
9. Add Add Customer modal to all pages (or include once via JS)

---

## Verification

- Open each page; confirm sidebar is visible and the correct nav item is highlighted
- Click each nav item; confirm it navigates to the right page
- Click "← Back to Website" in sidebar; confirm it opens `/index.html`
- Click a customer row in `customers.html`; confirm navigation to `customer-profile.html`
- On profile page: verify contact info, vehicles, and service history render from demo data
- Click "+ Add Customer" on any page; confirm modal opens, Cancel closes it, Save shows a toast
- Resize to ~1200px wide; confirm sidebar doesn't cause horizontal overflow
