# Van's Auto Repair — Business Dashboard Demo

**Date:** 2026-05-20
**Status:** Design approved, ready for implementation

---

## Context

This is a sales/pitch demo to present to Van's Auto Repair in Kalamazoo, MI. The goal is to show them what a custom business management dashboard could do for their shop — tracking revenue, work orders, customers, appointments, inventory, technician performance, POS integrations, and reviews. It includes a guided tour mode for in-person presentations. The demo uses realistic fake data (seeded JSON) so it looks and feels real without requiring a live backend.

**Delivery:** Hosted online (Netlify or similar). Multi-file is fine.

---

## Format

**Hybrid static demo** — HTML/CSS/JS frontend powered by a local `data/demo.json` file. No real backend. Interactive charts, animated numbers, clickable sections. Deployable to Netlify with drag-and-drop.

---

## Visual Style

Full Van's Auto branding:
- Background: `#0f1117` (near-black)
- Surface: `#1e2130` (dark card)
- Primary: `#1a1a2e` (navy)
- Accent: `#e63946` (red)
- Success: `#4ade80` (green)
- Warning: `#facc15` (yellow)
- Info: `#60a5fa` (blue)
- Typography: Oswald (headings) + Inter (body) — matches existing website

---

## File Structure

```
dashboard/
├── index.html              ← main dashboard view
├── customers.html          ← customer database detail view
├── data/
│   └── demo.json           ← all seeded fake data
├── css/
│   └── dashboard.css       ← styles (Van's Auto branding)
└── js/
    ├── dashboard.js        ← loads data, renders all modules, animates numbers
    ├── customers.js        ← customer table, search, vehicle history panel
    └── tour.js             ← guided tour logic (Driver.js)
```

---

## Dependencies (CDN, no build step)

| Library | Purpose |
|---------|---------|
| Chart.js | Revenue bar chart, review rating chart |
| Driver.js | Spotlight guided tour |
| Google Fonts (Inter + Oswald) | Typography matching main site |

---

## Dashboard Modules (index.html)

### Row 1 — KPI Cards (4 across)
| Card | Metric | Color accent |
|------|--------|-------------|
| Revenue This Month | $24,180 · ↑12% | Red |
| Open Work Orders | 7 · 2 waiting on parts | Yellow |
| Appointments Today | 9 · 2 bays available | Blue |
| Google Rating | 4.8★ · 71 reviews · +3 this week | Green |

### Row 2 — Charts
- **Left (2/3 width):** Revenue last 6 months — Chart.js bar chart with Van's red bars
- **Right (1/3 width):** Top Services breakdown — horizontal bar chart (Oil Change 38%, Brakes 24%, Tires 18%, Diagnostics 12%, Other 8%)

### Row 3 — Operations
- **Today's Schedule:** List of 9 appointments with tech assignment and status (Done / In Progress / Upcoming)
- **Technician Performance:** 3 techs (Mike, Dave, Sarah) with jobs completed + efficiency bar
- **Inventory Alerts:** Low-stock warnings in red, healthy stock in green

### Row 4 — Customer Snapshot + Integrations
- **Customer Snapshot card:** Total customers (312), new this month (14), returning rate (78%), overdue for service (47) — links to `customers.html`
- **POS Integration panel:** Branded buttons for Stripe, Square, Mitchell 1, Tekmetric, Shopmonkey, NAPA TRACS with "Connect" affordance and helper text

### Row 5 — Reviews
- **Google Reviews:** 4.8★ aggregate, star distribution chart, +3 new this week, 100% response rate

---

## Customer Database (customers.html)

Full-page view accessible by clicking the Customer Snapshot card.

### Features
1. **Searchable customer table** — name, phone, email, vehicle, last visit, total spend. Columns sortable. Live search filters as you type.
2. **Vehicle history panel** — click any customer row to expand a side panel showing every job: date, service, cost, technician, notes.
3. **Due for Service list** — top of page highlights customers 6+ months overdue. Shows vehicle, last service, and a "Send Reminder" button (demo only — shows confirmation toast).
4. **Lifetime value column** — total amount spent displayed on each row, sortable. Summary stat at top: avg customer LTV = $847.

### Demo Data (15 customers)
Realistic Kalamazoo-area names, local vehicles (pickup trucks, SUVs), plausible service history spanning 2–3 years.

---

## Guided Tour (Driver.js)

**Entry point:** "▶ Start Tour" button in the dashboard header.

**8 steps:**

| Step | Element | Tooltip copy |
|------|---------|-------------|
| 1 | Revenue KPI card | "This is your monthly revenue at a glance. Connect your POS and it updates automatically." |
| 2 | Revenue chart | "See your revenue trend over time. Spot your slow months before they sneak up on you." |
| 3 | Work Orders panel | "Every open job in your shop, live. See what's waiting on parts before a customer calls." |
| 4 | Today's Schedule | "Your full day in one view — who's working on what, and what's still open." |
| 5 | Technician Performance | "See your team's output. Know who your top performers are every month." |
| 6 | Inventory Alerts | "Low stock warnings before you run out mid-job. Never turn a customer away for a missing part." |
| 7 | Customer Snapshot | "312 customers in your database. 47 are overdue for service — that's a phone call away from booked revenue." |
| 8 | POS Integration | "Connect Stripe, Square, Mitchell 1 — or whatever you're already using. Your data comes in automatically." |

After step 8: tour ends with a brief confetti burst, then dashboard is freely explorable.

---

## Demo Data (data/demo.json)

Key seeded values:
- **Shop:** Van's Auto Repair, Kalamazoo MI, 4.8★, 71 reviews
- **Revenue:** $24,180 this month; 6-month history: $19,400 / $21,800 / $18,900 / $22,500 / $20,100 / $24,180
- **Work orders:** 7 open (2 waiting on parts, 3 in progress, 2 pending)
- **Technicians:** Mike (5 jobs, 85% efficiency), Dave (4 jobs, 70%), Sarah (3 jobs, 60%)
- **Inventory:** Oil Filter 5W-30 (2 remaining — alert), Brake Pads Front (1 set — alert), Spark Plugs (24 — OK)
- **POS:** Demo-only buttons (no real API calls)
- **Customers:** 15 records with full service history, vehicles, lifetime value
- **Reviews:** 71 total, 4.8★ avg, 78% five-star, +3 this week

---

## Deployment

1. Build all files locally
2. Drag `dashboard/` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Share URL with Van's Auto

No server, no database, no env vars needed.

---

## Verification

- [ ] Open `index.html` — all 8 modules visible, no console errors
- [ ] Click "Start Tour" — spotlight advances through all 8 steps
- [ ] Click Customer Snapshot card — navigates to `customers.html`
- [ ] Search field filters customer table in real time
- [ ] Click a customer row — vehicle history panel opens
- [ ] "Due for Service" section shows customers 6+ months overdue
- [ ] Revenue chart renders with Chart.js
- [ ] All POS buttons present and labeled correctly
- [ ] Looks correct on 1440px, 1024px, and 768px widths
- [ ] Deploys to Netlify without errors
