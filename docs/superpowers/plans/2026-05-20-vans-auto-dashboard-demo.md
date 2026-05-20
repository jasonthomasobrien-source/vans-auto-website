# Van's Auto Dashboard Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hosted, interactive business dashboard demo for Van's Auto Repair in Van's branding — seeded with realistic fake data, an 8-step guided tour, and a full customer database page — to serve as a sales pitch for a custom shop management tool.

**Architecture:** Static multi-file site (no build step, no backend). All data lives in `dashboard/data/demo.json` and is loaded by vanilla JS. Charts via Chart.js CDN. Guided tour via Driver.js CDN. Two HTML pages: `index.html` (dashboard) and `customers.html` (customer database).

**Tech Stack:** Vanilla HTML/CSS/JS · Chart.js 4.4 · Driver.js 1.3 · canvas-confetti 1.9 · Google Fonts (Inter + Oswald) · Netlify (deploy)

---

## File Map

| File | Responsibility |
|------|---------------|
| `dashboard/index.html` | Dashboard page — imports all JS/CSS, defines HTML skeleton |
| `dashboard/customers.html` | Customer database page |
| `dashboard/data/demo.json` | All seeded fake data (single source of truth) |
| `dashboard/css/dashboard.css` | Full stylesheet — Van's branding, layout, components |
| `dashboard/js/dashboard.js` | Loads demo.json, renders all dashboard modules, wires KPI animation |
| `dashboard/js/customers.js` | Customer table render, live search, sort, vehicle history panel, due-for-service |
| `dashboard/js/tour.js` | Driver.js guided tour — 8 steps + confetti |
| `dashboard/tests/data.test.js` | Node-runnable assertions for pure data functions |

---

## Task 1: Project Scaffold + Demo Data

**Files:**
- Create: `dashboard/data/demo.json`
- Create directory structure: `dashboard/css/`, `dashboard/js/`, `dashboard/data/`, `dashboard/tests/`

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p "dashboard/css" "dashboard/js" "dashboard/data" "dashboard/tests"
```

- [ ] **Step 2: Write demo.json**

Create `dashboard/data/demo.json`:

```json
{
  "shop": {
    "name": "Van's Auto Repair",
    "tagline": "Kalamazoo's Most Trusted Mechanic",
    "location": "1842 Portage St, Kalamazoo, MI 49001",
    "phone": "(269) 555-0147",
    "rating": 4.8,
    "reviewCount": 71
  },
  "kpis": {
    "revenueThisMonth": 24180,
    "revenueLastMonth": 21450,
    "openWorkOrders": 7,
    "workOrdersWaitingParts": 2,
    "appointmentsToday": 9,
    "baysAvailable": 2,
    "newReviewsThisWeek": 3,
    "totalCustomers": 312,
    "newCustomersThisMonth": 14,
    "returningRate": 78,
    "overdueForService": 47
  },
  "revenueHistory": [
    { "month": "Dec", "amount": 19400 },
    { "month": "Jan", "amount": 21800 },
    { "month": "Feb", "amount": 18900 },
    { "month": "Mar", "amount": 22500 },
    { "month": "Apr", "amount": 20100 },
    { "month": "May", "amount": 24180 }
  ],
  "topServices": [
    { "name": "Oil Change", "pct": 38 },
    { "name": "Brake Service", "pct": 24 },
    { "name": "Tire Rotation", "pct": 18 },
    { "name": "Diagnostics", "pct": 12 },
    { "name": "Other", "pct": 8 }
  ],
  "schedule": [
    { "time": "8:00 AM", "service": "Oil Change", "tech": "Mike", "customer": "Randy Kowalski", "status": "done" },
    { "time": "9:30 AM", "service": "Tire Rotation", "tech": "Sarah", "customer": "Linda Perkins", "status": "done" },
    { "time": "10:00 AM", "service": "Brake Service", "tech": "Dave", "customer": "Tom Harrington", "status": "in-progress" },
    { "time": "11:00 AM", "service": "Oil Change", "tech": "Mike", "customer": "Greta Vandenberg", "status": "in-progress" },
    { "time": "12:30 PM", "service": "Diagnostics", "tech": "Sarah", "customer": "Bill Nowak", "status": "upcoming" },
    { "time": "1:00 PM", "service": "Oil Change", "tech": "Dave", "customer": "Cindy Morrow", "status": "upcoming" },
    { "time": "2:00 PM", "service": "Alignment", "tech": "Mike", "customer": "Pete Szabo", "status": "upcoming" },
    { "time": "3:00 PM", "service": "Battery Replace", "tech": "Sarah", "customer": "Janet Fox", "status": "upcoming" },
    { "time": "4:00 PM", "service": "AC Recharge", "tech": "Dave", "customer": "Marcus Webb", "status": "upcoming" }
  ],
  "technicians": [
    { "name": "Mike", "initial": "M", "color": "#e63946", "jobsToday": 5, "efficiency": 85 },
    { "name": "Dave", "initial": "D", "color": "#60a5fa", "jobsToday": 4, "efficiency": 70 },
    { "name": "Sarah", "initial": "S", "color": "#a78bfa", "jobsToday": 3, "efficiency": 60 }
  ],
  "inventory": [
    { "item": "Oil Filter 5W-30", "qty": 2, "low": true },
    { "item": "Brake Pads (Front)", "qty": 1, "low": true },
    { "item": "Air Filter (Standard)", "qty": 3, "low": true },
    { "item": "Spark Plugs (NGK)", "qty": 24, "low": false },
    { "item": "Wiper Blades (22\")", "qty": 12, "low": false },
    { "item": "Transmission Fluid", "qty": 8, "low": false }
  ],
  "pos": [
    { "name": "Stripe", "color": "#635bff", "connected": false },
    { "name": "Square", "color": "#3e9c45", "connected": false },
    { "name": "Mitchell 1", "color": "#0055a5", "connected": false },
    { "name": "Tekmetric", "color": "#ff6b35", "connected": false },
    { "name": "Shopmonkey", "color": "#444", "connected": false },
    { "name": "NAPA TRACS", "color": "#444", "connected": false }
  ],
  "reviews": {
    "average": 4.8,
    "total": 71,
    "distribution": [55, 11, 3, 1, 1],
    "responseRate": 100,
    "newThisWeek": 3,
    "recent": [
      { "author": "Randy K.", "rating": 5, "date": "May 18, 2026", "text": "Van's is the only shop I trust. Fair prices, honest work, done right the first time." },
      { "author": "Linda P.", "rating": 5, "date": "May 15, 2026", "text": "Brought my Tahoe in for brakes — in and out in 2 hours. Couldn't be happier." },
      { "author": "Tom H.", "rating": 5, "date": "May 12, 2026", "text": "Great communication throughout. Called me with an update before doing any extra work." }
    ]
  },
  "customers": [
    {
      "id": 1, "name": "Randy Kowalski", "phone": "(269) 555-0201", "email": "randy.k@email.com",
      "vehicle": "2019 Chevy Silverado", "lastVisit": "2026-05-18", "totalSpent": 1840,
      "history": [
        { "date": "2026-05-18", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "Topped off washer fluid" },
        { "date": "2026-02-10", "service": "Tire Rotation", "cost": 45, "tech": "Sarah", "notes": "" },
        { "date": "2025-11-03", "service": "Brake Service (Front)", "cost": 320, "tech": "Dave", "notes": "Replaced rotors and pads" },
        { "date": "2025-07-20", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" },
        { "date": "2025-03-15", "service": "AC Recharge", "cost": 140, "tech": "Sarah", "notes": "System was low, no leak found" }
      ]
    },
    {
      "id": 2, "name": "Linda Perkins", "phone": "(269) 555-0342", "email": "lindap@webmail.net",
      "vehicle": "2021 Chevy Tahoe", "lastVisit": "2026-05-15", "totalSpent": 2210,
      "history": [
        { "date": "2026-05-15", "service": "Tire Rotation", "cost": 45, "tech": "Sarah", "notes": "" },
        { "date": "2026-01-08", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" },
        { "date": "2025-09-22", "service": "Brake Service (All 4)", "cost": 580, "tech": "Dave", "notes": "Full brake job, all corners" },
        { "date": "2025-05-11", "service": "Battery Replacement", "cost": 185, "tech": "Mike", "notes": "OEM battery, 3yr warranty" }
      ]
    },
    {
      "id": 3, "name": "Tom Harrington", "phone": "(269) 555-0118", "email": "tharrington@gmail.com",
      "vehicle": "2018 Ford F-150", "lastVisit": "2026-05-10", "totalSpent": 3450,
      "history": [
        { "date": "2026-05-10", "service": "Brake Service (Front)", "cost": 310, "tech": "Dave", "notes": "" },
        { "date": "2025-12-02", "service": "Oil Change", "cost": 75, "tech": "Mike", "notes": "Full synthetic 5W-30" },
        { "date": "2025-08-14", "service": "Transmission Service", "cost": 220, "tech": "Dave", "notes": "Flush and fill" },
        { "date": "2025-04-29", "service": "Alignment", "cost": 95, "tech": "Sarah", "notes": "Front end only" }
      ]
    },
    {
      "id": 4, "name": "Greta Vandenberg", "phone": "(269) 555-0477", "email": "greta.v@outlook.com",
      "vehicle": "2020 Honda CR-V", "lastVisit": "2026-05-11", "totalSpent": 890,
      "history": [
        { "date": "2026-05-11", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" },
        { "date": "2025-11-18", "service": "Tire Rotation", "cost": 45, "tech": "Sarah", "notes": "" },
        { "date": "2025-06-07", "service": "Air Filter Replacement", "cost": 35, "tech": "Mike", "notes": "" }
      ]
    },
    {
      "id": 5, "name": "Bill Nowak", "phone": "(269) 555-0589", "email": "billnowak@yahoo.com",
      "vehicle": "2016 Dodge Ram 1500", "lastVisit": "2025-10-30", "totalSpent": 1540,
      "history": [
        { "date": "2025-10-30", "service": "Diagnostics", "cost": 95, "tech": "Sarah", "notes": "Check engine light — O2 sensor" },
        { "date": "2025-07-14", "service": "O2 Sensor Replacement", "cost": 185, "tech": "Dave", "notes": "" },
        { "date": "2025-03-05", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" }
      ]
    },
    {
      "id": 6, "name": "Cindy Morrow", "phone": "(269) 555-0623", "email": "cindym@gmail.com",
      "vehicle": "2022 Toyota Camry", "lastVisit": "2025-11-05", "totalSpent": 410,
      "history": [
        { "date": "2025-11-05", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" },
        { "date": "2025-05-22", "service": "Tire Rotation", "cost": 45, "tech": "Sarah", "notes": "" }
      ]
    },
    {
      "id": 7, "name": "Pete Szabo", "phone": "(269) 555-0731", "email": "pszabo@hotmail.com",
      "vehicle": "2017 Ford Escape", "lastVisit": "2025-09-19", "totalSpent": 720,
      "history": [
        { "date": "2025-09-19", "service": "Alignment", "cost": 95, "tech": "Sarah", "notes": "" },
        { "date": "2025-05-01", "service": "Brake Service (Rear)", "cost": 265, "tech": "Dave", "notes": "" },
        { "date": "2025-01-12", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" }
      ]
    },
    {
      "id": 8, "name": "Janet Fox", "phone": "(269) 555-0844", "email": "janetfox@email.com",
      "vehicle": "2020 Subaru Outback", "lastVisit": "2025-08-27", "totalSpent": 650,
      "history": [
        { "date": "2025-08-27", "service": "Battery Replacement", "cost": 185, "tech": "Mike", "notes": "" },
        { "date": "2025-04-14", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" }
      ]
    },
    {
      "id": 9, "name": "Marcus Webb", "phone": "(269) 555-0966", "email": "marcus.webb@gmail.com",
      "vehicle": "2019 GMC Sierra", "lastVisit": "2025-07-03", "totalSpent": 1180,
      "history": [
        { "date": "2025-07-03", "service": "AC Recharge", "cost": 140, "tech": "Sarah", "notes": "Refrigerant only, no leak" },
        { "date": "2025-02-18", "service": "Brake Service (Front)", "cost": 310, "tech": "Dave", "notes": "" },
        { "date": "2024-10-09", "service": "Oil Change", "cost": 75, "tech": "Mike", "notes": "Full synthetic" }
      ]
    },
    {
      "id": 10, "name": "Donna Craft", "phone": "(269) 555-1012", "email": "donnac@outlook.com",
      "vehicle": "2018 Jeep Grand Cherokee", "lastVisit": "2025-06-15", "totalSpent": 980,
      "history": [
        { "date": "2025-06-15", "service": "Diagnostics", "cost": 95, "tech": "Sarah", "notes": "Rough idle — found vacuum leak" },
        { "date": "2025-01-28", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" },
        { "date": "2024-08-20", "service": "Tire Rotation", "cost": 45, "tech": "Sarah", "notes": "" }
      ]
    },
    {
      "id": 11, "name": "Steve Holton", "phone": "(269) 555-1133", "email": "s.holton@gmail.com",
      "vehicle": "2015 Ford Mustang", "lastVisit": "2025-05-22", "totalSpent": 2890,
      "history": [
        { "date": "2025-05-22", "service": "Exhaust Repair", "cost": 420, "tech": "Dave", "notes": "Welded mid-pipe" },
        { "date": "2024-12-10", "service": "Oil Change", "cost": 75, "tech": "Mike", "notes": "Full synthetic, 5W-20" },
        { "date": "2024-07-04", "service": "Brake Service (All 4)", "cost": 590, "tech": "Dave", "notes": "Performance pads" }
      ]
    },
    {
      "id": 12, "name": "Rosa Delgado", "phone": "(269) 555-1244", "email": "rosa.delgado@email.com",
      "vehicle": "2023 Toyota RAV4", "lastVisit": "2026-04-30", "totalSpent": 330,
      "history": [
        { "date": "2026-04-30", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "New customer" },
        { "date": "2026-02-14", "service": "Tire Rotation", "cost": 45, "tech": "Sarah", "notes": "" }
      ]
    },
    {
      "id": 13, "name": "Greg Tuttle", "phone": "(269) 555-1358", "email": "gregtuttle@yahoo.com",
      "vehicle": "2014 Chevy Impala", "lastVisit": "2024-11-01", "totalSpent": 1650,
      "history": [
        { "date": "2024-11-01", "service": "Transmission Service", "cost": 220, "tech": "Dave", "notes": "Slipping between 2nd and 3rd" },
        { "date": "2024-06-19", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" },
        { "date": "2023-12-05", "service": "Brake Service (Rear)", "cost": 265, "tech": "Dave", "notes": "" }
      ]
    },
    {
      "id": 14, "name": "Amy Strickland", "phone": "(269) 555-1471", "email": "amystrick@gmail.com",
      "vehicle": "2021 Kia Sorento", "lastVisit": "2024-10-14", "totalSpent": 540,
      "history": [
        { "date": "2024-10-14", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" },
        { "date": "2024-04-09", "service": "Air Filter Replacement", "cost": 35, "tech": "Mike", "notes": "" }
      ]
    },
    {
      "id": 15, "name": "Dale Hutchins", "phone": "(269) 555-1583", "email": "dale.h@hotmail.com",
      "vehicle": "2016 Ford Explorer", "lastVisit": "2024-09-05", "totalSpent": 1920,
      "history": [
        { "date": "2024-09-05", "service": "Brake Service (All 4)", "cost": 580, "tech": "Dave", "notes": "" },
        { "date": "2024-03-18", "service": "Alignment", "cost": 95, "tech": "Sarah", "notes": "All 4 corners" },
        { "date": "2023-10-22", "service": "Oil Change", "cost": 65, "tech": "Mike", "notes": "" }
      ]
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/
git commit -m "feat: scaffold dashboard demo project with seeded demo data"
```

---

## Task 2: CSS Foundation

**Files:**
- Create: `dashboard/css/dashboard.css`

- [ ] **Step 1: Write dashboard.css**

Create `dashboard/css/dashboard.css`:

```css
/* === TOKENS === */
:root {
  --bg: #0f1117;
  --surface: #1e2130;
  --surface-2: #161922;
  --navy: #1a1a2e;
  --red: #e63946;
  --red-dark: #c1121f;
  --green: #4ade80;
  --yellow: #facc15;
  --blue: #60a5fa;
  --purple: #a78bfa;
  --text: #ffffff;
  --text-muted: #9ca3af;
  --text-dim: #6b7280;
  --border: #2d3148;
  --danger-bg: rgba(127, 29, 29, 0.5);
  --danger-text: #fca5a5;
  --success-bg: rgba(20, 83, 45, 0.4);
  --success-text: #86efac;
  --radius: 8px;
  --radius-sm: 4px;
  --shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* === RESET === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  line-height: 1.5;
}
a { color: inherit; text-decoration: none; }

/* === TYPOGRAPHY === */
.heading { font-family: 'Oswald', sans-serif; font-weight: 700; letter-spacing: 0.5px; }
.label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); }
.value { font-size: 22px; font-weight: 700; margin: 4px 0; }
.delta-up { color: var(--green); font-size: 12px; }
.delta-down { color: var(--red); font-size: 12px; }
.delta-warn { color: var(--yellow); font-size: 12px; }
.subtitle { color: var(--text-muted); font-size: 13px; }

/* === LAYOUT === */
.header {
  background: var(--navy);
  border-bottom: 2px solid var(--red);
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-logo { display: flex; align-items: center; gap: 12px; }
.logo-badge {
  background: var(--red);
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
  padding: 5px 12px;
  border-radius: var(--radius-sm);
}
.header-subtitle { color: var(--text-muted); font-size: 13px; }
.header-actions { display: flex; gap: 10px; align-items: center; }

.main { padding: 24px; display: flex; flex-direction: column; gap: 16px; max-width: 1400px; margin: 0 auto; }

/* === CARDS === */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow);
}
.card-title { margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }

/* === KPI GRID === */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.kpi-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 16px;
  border-left: 3px solid var(--red);
  box-shadow: var(--shadow);
}
.kpi-card.yellow { border-left-color: var(--yellow); }
.kpi-card.blue { border-left-color: var(--blue); }
.kpi-card.green { border-left-color: var(--green); }

/* === TWO-COL GRID === */
.grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }

/* === BUTTONS === */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 600; cursor: pointer;
  border: none; transition: opacity 0.15s;
}
.btn:hover { opacity: 0.85; }
.btn-primary { background: var(--red); color: #fff; }
.btn-ghost { background: var(--surface); color: var(--text-muted); border: 1px solid var(--border); }
.btn-back { background: var(--surface); color: var(--text-muted); border: 1px solid var(--border); font-size: 12px; }

/* === SCHEDULE LIST === */
.schedule-item {
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
}
.schedule-item:last-child { margin-bottom: 0; }
.status-badge {
  padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
}
.status-done { background: rgba(74, 222, 128, 0.15); color: var(--green); }
.status-in-progress { background: rgba(250, 204, 21, 0.15); color: var(--yellow); }
.status-upcoming { background: rgba(156, 163, 175, 0.1); color: var(--text-muted); }

/* === TECHNICIAN ROW === */
.tech-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.tech-row:last-child { margin-bottom: 0; }
.tech-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.tech-info { flex: 1; }
.tech-name { font-size: 12px; color: var(--text); margin-bottom: 3px; }
.progress-bar { background: var(--border); border-radius: 2px; height: 5px; }
.progress-fill { background: var(--green); height: 100%; border-radius: 2px; transition: width 0.6s ease; }

/* === INVENTORY === */
.inventory-item {
  border-radius: var(--radius-sm); padding: 7px 10px; margin-bottom: 6px; font-size: 12px;
}
.inventory-item:last-child { margin-bottom: 0; }
.inventory-low { background: var(--danger-bg); color: var(--danger-text); }
.inventory-ok { background: var(--success-bg); color: var(--success-text); }

/* === POS GRID === */
.pos-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.pos-btn {
  padding: 5px 12px; border-radius: var(--radius-sm);
  font-size: 11px; font-weight: 600; color: #fff; cursor: pointer;
  border: none; transition: opacity 0.15s;
}
.pos-btn:hover { opacity: 0.8; }
.pos-btn.dim { background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border); }

/* === REVIEW STARS === */
.stars { color: var(--yellow); letter-spacing: 1px; }
.review-card {
  background: var(--surface-2); border-radius: var(--radius-sm);
  padding: 10px 12px; margin-bottom: 8px; font-size: 12px;
}
.review-card:last-child { margin-bottom: 0; }
.review-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.review-author { font-weight: 600; color: var(--text); }
.review-date { color: var(--text-dim); font-size: 11px; }
.review-text { color: var(--text-muted); line-height: 1.5; }

/* === CUSTOMER TABLE === */
.customer-table-wrap { overflow-x: auto; }
.customer-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.customer-table th {
  text-align: left; padding: 10px 12px; font-size: 10px; font-weight: 600;
  letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted);
  border-bottom: 1px solid var(--border); cursor: pointer; white-space: nowrap;
}
.customer-table th:hover { color: var(--text); }
.customer-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text-muted); }
.customer-table td.name { color: var(--text); font-weight: 500; }
.customer-table td.ltv { color: var(--green); font-weight: 600; }
.customer-table tr { cursor: pointer; transition: background 0.1s; }
.customer-table tr:hover td { background: var(--surface); }
.customer-table tr.overdue td { border-left: 2px solid var(--yellow); }

/* === SEARCH === */
.search-input {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--text); padding: 8px 12px; font-size: 13px; font-family: 'Inter', sans-serif;
  width: 260px; outline: none; transition: border-color 0.15s;
}
.search-input:focus { border-color: var(--red); }
.search-input::placeholder { color: var(--text-dim); }

/* === HISTORY PANEL === */
.history-panel {
  position: fixed; right: 0; top: 0; bottom: 0; width: 380px;
  background: var(--surface); border-left: 1px solid var(--border);
  box-shadow: -4px 0 20px rgba(0,0,0,0.4); z-index: 200;
  display: flex; flex-direction: column;
  transform: translateX(100%); transition: transform 0.25s ease;
}
.history-panel.open { transform: translateX(0); }
.history-panel-header {
  padding: 16px 20px; border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: flex-start;
}
.history-panel-body { padding: 16px 20px; overflow-y: auto; flex: 1; }
.history-row {
  padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px;
}
.history-row:last-child { border-bottom: none; }
.history-service { color: var(--text); font-weight: 500; }
.history-meta { color: var(--text-muted); font-size: 12px; margin-top: 2px; }
.history-cost { color: var(--green); font-weight: 600; }
.close-btn { background: none; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer; padding: 0; line-height: 1; }
.close-btn:hover { color: var(--text); }

/* === DUE FOR SERVICE === */
.due-banner {
  background: rgba(250, 204, 21, 0.08); border: 1px solid rgba(250, 204, 21, 0.25);
  border-radius: var(--radius); padding: 14px 16px; margin-bottom: 16px;
}
.due-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px;
}
.due-row:last-child { border-bottom: none; }

/* === TOAST === */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 500;
  background: var(--surface); border: 1px solid var(--green);
  border-radius: var(--radius); padding: 12px 18px; font-size: 13px;
  color: var(--green); box-shadow: var(--shadow);
  opacity: 0; transform: translateY(8px); transition: all 0.25s ease;
}
.toast.show { opacity: 1; transform: translateY(0); }

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .grid-2-1 { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .header-actions { gap: 6px; }
  .main { padding: 14px; }
  .history-panel { width: 100%; }
  .search-input { width: 100%; }
}
```

- [ ] **Step 2: Commit**

```bash
git add dashboard/css/dashboard.css
git commit -m "feat: add dashboard CSS with Van's Auto branding tokens and layout"
```

---

## Task 3: index.html Skeleton

**Files:**
- Create: `dashboard/index.html`

- [ ] **Step 1: Write index.html**

Create `dashboard/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Van's Auto Repair — Business Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Oswald:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css">
  <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <div class="header-logo">
      <span class="logo-badge">VAN'S AUTO</span>
      <span class="header-subtitle">Business Dashboard</span>
    </div>
    <div class="header-actions">
      <button class="btn btn-ghost" id="btn-connect-pos">Connect POS ↗</button>
      <button class="btn btn-primary" id="btn-start-tour">▶ Start Tour</button>
    </div>
  </header>

  <main class="main">

    <!-- ROW 1: KPI CARDS -->
    <div class="kpi-grid" id="kpi-grid">
      <div class="kpi-card" id="kpi-revenue">
        <div class="label">Revenue This Month</div>
        <div class="value" id="val-revenue">—</div>
        <div id="delta-revenue" class="delta-up"></div>
      </div>
      <div class="kpi-card yellow" id="kpi-orders">
        <div class="label">Open Work Orders</div>
        <div class="value" id="val-orders">—</div>
        <div id="delta-orders" class="delta-warn"></div>
      </div>
      <div class="kpi-card blue" id="kpi-appts">
        <div class="label">Appointments Today</div>
        <div class="value" id="val-appts">—</div>
        <div id="delta-appts" class="delta-up" style="color:var(--blue)"></div>
      </div>
      <div class="kpi-card green" id="kpi-rating">
        <div class="label">Google Rating</div>
        <div class="value" id="val-rating">—</div>
        <div id="delta-rating" class="delta-up"></div>
      </div>
    </div>

    <!-- ROW 2: CHARTS -->
    <div class="grid-2-1">
      <div class="card" id="card-revenue-chart">
        <div class="card-title">
          <span class="label">💰 Revenue — Last 6 Months</span>
        </div>
        <canvas id="chart-revenue" height="90"></canvas>
      </div>
      <div class="card" id="card-services">
        <div class="card-title">
          <span class="label">🔧 Top Services</span>
        </div>
        <div id="services-list"></div>
      </div>
    </div>

    <!-- ROW 3: OPERATIONS -->
    <div class="grid-3">
      <div class="card" id="card-schedule">
        <div class="card-title"><span class="label">📅 Today's Schedule</span></div>
        <div id="schedule-list"></div>
      </div>
      <div class="card" id="card-technicians">
        <div class="card-title"><span class="label">👨‍🔧 Technician Performance</span></div>
        <div id="tech-list"></div>
      </div>
      <div class="card" id="card-inventory">
        <div class="card-title"><span class="label">📦 Inventory Alerts</span></div>
        <div id="inventory-list"></div>
      </div>
    </div>

    <!-- ROW 4: CUSTOMERS + POS -->
    <div class="grid-2">
      <div class="card" id="card-customers" style="cursor:pointer" onclick="window.location='customers.html'">
        <div class="card-title"><span class="label">👥 Customer Database</span></div>
        <div id="customer-snapshot"></div>
        <div style="margin-top:12px">
          <span class="btn btn-ghost" style="font-size:12px">View All Customers →</span>
        </div>
      </div>
      <div class="card" id="card-pos">
        <div class="card-title"><span class="label">💳 Connect Your POS</span></div>
        <div id="pos-grid" class="pos-grid"></div>
        <p class="subtitle" style="margin-top:8px">Connect your existing system to auto-import sales, invoices &amp; customer data.</p>
      </div>
    </div>

    <!-- ROW 5: REVIEWS -->
    <div class="card" id="card-reviews">
      <div class="card-title"><span class="label">📣 Google Reviews</span></div>
      <div id="reviews-section"></div>
    </div>

  </main>

  <div class="toast" id="toast"></div>

  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.iife.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
  <script src="js/dashboard.js"></script>
  <script src="js/tour.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open index.html in browser**

Open `dashboard/index.html` directly in Chrome. You should see the header with the Van's Auto logo badge and two buttons. The content sections are empty — that's expected.

- [ ] **Step 3: Commit**

```bash
git add dashboard/index.html
git commit -m "feat: add dashboard HTML skeleton with header and section placeholders"
```

---

## Task 4: dashboard.js — Data Loading + KPI Cards + Services

**Files:**
- Create: `dashboard/js/dashboard.js`
- Create: `dashboard/tests/data.test.js`

- [ ] **Step 1: Write the failing test for KPI formatting**

Create `dashboard/tests/data.test.js`:

```js
// Run with: node dashboard/tests/data.test.js

function formatCurrency(n) { /* placeholder */ }
function revenueChangePct(current, previous) { /* placeholder */ }

// Tests
let passed = 0, failed = 0;
function assert(desc, actual, expected) {
  if (actual === expected) { console.log(`✓ ${desc}`); passed++; }
  else { console.error(`✗ ${desc}\n  Expected: ${expected}\n  Got:      ${actual}`); failed++; }
}

assert('formatCurrency whole number', formatCurrency(24180), '$24,180');
assert('formatCurrency zero', formatCurrency(0), '$0');
assert('revenueChangePct increase', revenueChangePct(24180, 21450), 13);
assert('revenueChangePct decrease', revenueChangePct(18000, 20000), -10);
assert('revenueChangePct no change', revenueChangePct(21450, 21450), 0);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run test — confirm it fails**

```bash
node dashboard/tests/data.test.js
```

Expected: errors about functions returning undefined.

- [ ] **Step 3: Write dashboard.js with working implementations**

Create `dashboard/js/dashboard.js`:

```js
/* === PURE UTILITY FUNCTIONS (exported for tests) === */

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function revenueChangePct(current, previous) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/* === DATA LOADING === */

async function loadData() {
  const res = await fetch('data/demo.json');
  return res.json();
}

/* === KPI CARDS === */

function renderKPIs(data) {
  const { kpis, shop } = data;
  const pct = revenueChangePct(kpis.revenueThisMonth, kpis.revenueLastMonth);
  const sign = pct >= 0 ? '↑' : '↓';
  const cls = pct >= 0 ? 'delta-up' : 'delta-down';

  document.getElementById('val-revenue').textContent = formatCurrency(kpis.revenueThisMonth);
  document.getElementById('delta-revenue').textContent = `${sign} ${Math.abs(pct)}% vs last month`;
  document.getElementById('delta-revenue').className = cls;

  document.getElementById('val-orders').textContent = kpis.openWorkOrders;
  document.getElementById('delta-orders').textContent = `${kpis.workOrdersWaitingParts} waiting on parts`;

  document.getElementById('val-appts').textContent = kpis.appointmentsToday;
  document.getElementById('delta-appts').textContent = `${kpis.baysAvailable} bays available`;

  document.getElementById('val-rating').textContent = `${shop.rating} ★`;
  document.getElementById('delta-rating').textContent = `${shop.reviewCount} reviews · +${kpis.newReviewsThisWeek} this week`;
}

/* === REVENUE CHART === */

function renderRevenueChart(data) {
  const ctx = document.getElementById('chart-revenue').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.revenueHistory.map(r => r.month),
      datasets: [{
        data: data.revenueHistory.map(r => r.amount),
        backgroundColor: data.revenueHistory.map((_, i, arr) =>
          i === arr.length - 1 ? '#e63946' : 'rgba(230,57,70,0.45)'
        ),
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: {
        callbacks: { label: ctx => formatCurrency(ctx.parsed.y) }
      }},
      scales: {
        x: { grid: { display: false }, ticks: { color: '#6b7280' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: {
          color: '#6b7280', callback: v => formatCurrency(v)
        }}
      }
    }
  });
}

/* === TOP SERVICES === */

function renderServices(data) {
  const el = document.getElementById('services-list');
  el.innerHTML = data.topServices.map(s => `
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:4px">
        <span>${s.name}</span><span>${s.pct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${s.pct}%;background:var(--red)"></div>
      </div>
    </div>
  `).join('');
}

/* === SCHEDULE === */

function renderSchedule(data) {
  const el = document.getElementById('schedule-list');
  const statusMap = { done: 'status-done', 'in-progress': 'status-in-progress', upcoming: 'status-upcoming' };
  const labelMap = { done: 'Done', 'in-progress': 'In Progress', upcoming: 'Upcoming' };
  el.innerHTML = data.schedule.map(s => `
    <div class="schedule-item">
      <div>
        <span style="color:var(--text-muted);font-size:11px">${s.time}</span>
        <span style="margin-left:8px;color:var(--text)">${s.service}</span>
        <span style="margin-left:6px;color:var(--text-dim);font-size:11px">· ${s.tech}</span>
      </div>
      <span class="status-badge ${statusMap[s.status]}">${labelMap[s.status]}</span>
    </div>
  `).join('');
}

/* === TECHNICIANS === */

function renderTechnicians(data) {
  const el = document.getElementById('tech-list');
  el.innerHTML = data.technicians.map(t => `
    <div class="tech-row">
      <div class="tech-avatar" style="background:${t.color}">${t.initial}</div>
      <div class="tech-info">
        <div class="tech-name">${t.name} · ${t.jobsToday} jobs today</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${t.efficiency}%"></div>
        </div>
      </div>
      <span style="font-size:11px;color:var(--text-muted)">${t.efficiency}%</span>
    </div>
  `).join('');
}

/* === INVENTORY === */

function renderInventory(data) {
  const el = document.getElementById('inventory-list');
  el.innerHTML = data.inventory.map(i => `
    <div class="inventory-item ${i.low ? 'inventory-low' : 'inventory-ok'}">
      ${i.low ? '⚠' : '✓'} ${i.item} — ${i.qty} ${i.qty === 1 ? 'unit' : 'units'}
    </div>
  `).join('');
}

/* === CUSTOMER SNAPSHOT === */

function renderCustomerSnapshot(data) {
  const { kpis } = data;
  const el = document.getElementById('customer-snapshot');
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px">
      <div><div class="label">Total Customers</div><div class="value">${kpis.totalCustomers}</div></div>
      <div><div class="label">New This Month</div><div class="value">${kpis.newCustomersThisMonth}</div></div>
      <div><div class="label">Returning Rate</div><div class="value">${kpis.returningRate}%</div></div>
      <div>
        <div class="label">Overdue for Service</div>
        <div class="value" style="color:var(--yellow)">${kpis.overdueForService}</div>
        <div class="delta-warn" style="font-size:11px">Need a follow-up call</div>
      </div>
    </div>
  `;
}

/* === POS PANEL === */

function renderPOS(data) {
  const el = document.getElementById('pos-grid');
  el.innerHTML = data.pos.map(p => `
    <button class="pos-btn ${p.color === '#444' ? 'dim' : ''}"
      style="${p.color !== '#444' ? `background:${p.color}` : ''}"
      onclick="showToast('Demo: ${p.name} connection flow would open here')">
      ${p.name}
    </button>
  `).join('');
}

/* === REVIEWS === */

function renderReviews(data) {
  const { reviews } = data;
  const el = document.getElementById('reviews-section');
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:start;margin-bottom:16px">
      <div style="text-align:center">
        <div style="font-size:36px;font-weight:700">${reviews.average}</div>
        <div class="stars">${stars(5)}</div>
        <div class="subtitle">${reviews.total} reviews</div>
      </div>
      <div style="padding-top:6px">
        ${[5,4,3,2,1].map((star, i) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
            <span style="font-size:11px;color:var(--text-muted);width:14px">${star}★</span>
            <div class="progress-bar" style="flex:1">
              <div class="progress-fill" style="width:${Math.round(reviews.distribution[i]/reviews.total*100)}%;background:var(--yellow)"></div>
            </div>
            <span style="font-size:11px;color:var(--text-dim);width:20px">${reviews.distribution[i]}</span>
          </div>
        `).join('')}
      </div>
      <div style="text-align:right;padding-top:4px">
        <div class="delta-up">+${reviews.newThisWeek} this week</div>
        <div class="subtitle">${reviews.responseRate}% response rate</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      ${reviews.recent.map(r => `
        <div class="review-card">
          <div class="review-header">
            <span class="review-author">${r.author}</span>
            <span class="review-date">${r.date}</span>
          </div>
          <div class="stars" style="font-size:11px;margin-bottom:4px">${stars(r.rating)}</div>
          <div class="review-text">"${r.text}"</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* === TOAST === */

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* === INIT === */

async function init() {
  const data = await loadData();
  window.__dashData = data;
  renderKPIs(data);
  renderRevenueChart(data);
  renderServices(data);
  renderSchedule(data);
  renderTechnicians(data);
  renderInventory(data);
  renderCustomerSnapshot(data);
  renderPOS(data);
  renderReviews(data);
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 4: Update test file with real implementations and run**

Update `dashboard/tests/data.test.js` to inline the implementations:

```js
// Run with: node dashboard/tests/data.test.js

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
function revenueChangePct(current, previous) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

let passed = 0, failed = 0;
function assert(desc, actual, expected) {
  if (actual === expected) { console.log(`✓ ${desc}`); passed++; }
  else { console.error(`✗ ${desc}\n  Expected: ${expected}\n  Got:      ${actual}`); failed++; }
}

assert('formatCurrency whole number', formatCurrency(24180), '$24,180');
assert('formatCurrency zero', formatCurrency(0), '$0');
assert('revenueChangePct increase', revenueChangePct(24180, 21450), 13);
assert('revenueChangePct decrease', revenueChangePct(18000, 20000), -10);
assert('revenueChangePct no change', revenueChangePct(21450, 21450), 0);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

Run: `node dashboard/tests/data.test.js`
Expected output:
```
✓ formatCurrency whole number
✓ formatCurrency zero
✓ revenueChangePct increase
✓ revenueChangePct decrease
✓ revenueChangePct no change

5 passed, 0 failed
```

- [ ] **Step 5: Open dashboard in browser and verify**

Open `dashboard/index.html` in Chrome using a local server (required for `fetch`):

```bash
cd dashboard && python3 -m http.server 3000
```

Open `http://localhost:3000`. Verify:
- All 4 KPI cards show real numbers ($24,180, 7 orders, 9 appointments, 4.8★)
- Revenue chart renders with 6 red bars
- Top Services list shows 5 items with bars
- Schedule shows 9 appointments with color-coded status badges
- 3 technicians with efficiency bars
- 3 low-stock inventory alerts + 3 OK items
- Customer snapshot shows 312 / 14 / 78% / 47
- POS buttons visible (Stripe, Square, Mitchell 1, Tekmetric, Shopmonkey, NAPA TRACS)
- Clicking a POS button shows a toast message
- Reviews section shows 4.8★, distribution bars, 3 review cards

- [ ] **Step 6: Commit**

```bash
git add dashboard/js/dashboard.js dashboard/tests/data.test.js
git commit -m "feat: add dashboard.js with all 8 module renderers and Chart.js integration"
```

---

## Task 5: customers.html + customers.js

**Files:**
- Create: `dashboard/customers.html`
- Create: `dashboard/js/customers.js`

- [ ] **Step 1: Write the failing test for customer search**

Add to `dashboard/tests/data.test.js` (append below existing tests, before the summary lines):

```js
// Customer search filter
function filterCustomers(customers, query) {
  if (!query) return customers;
  const q = query.toLowerCase();
  return customers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.vehicle.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q)
  );
}

// Customer due-for-service check
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 180;
function isDueForService(lastVisit, referenceDate) {
  return (referenceDate - new Date(lastVisit).getTime()) > SIX_MONTHS_MS;
}

const testCustomers = [
  { id: 1, name: 'Randy Kowalski', vehicle: '2019 Chevy Silverado', email: 'randy.k@email.com', lastVisit: '2026-05-18' },
  { id: 2, name: 'Bill Nowak', vehicle: '2016 Dodge Ram', email: 'billnowak@yahoo.com', lastVisit: '2025-10-30' },
  { id: 3, name: 'Greg Tuttle', vehicle: '2014 Chevy Impala', email: 'greg@yahoo.com', lastVisit: '2024-11-01' },
];

const now = new Date('2026-05-20').getTime();
assert('filterCustomers by name', filterCustomers(testCustomers, 'randy').length, 1);
assert('filterCustomers by vehicle', filterCustomers(testCustomers, 'chevy').length, 2);
assert('filterCustomers empty query returns all', filterCustomers(testCustomers, '').length, 3);
assert('filterCustomers no match returns empty', filterCustomers(testCustomers, 'zzz').length, 0);
assert('isDueForService — recent visit is NOT due', isDueForService('2026-05-18', now), false);
assert('isDueForService — 18 months ago IS due', isDueForService('2024-11-01', now), true);
```

Run: `node dashboard/tests/data.test.js`
Expected: 5 pass, 6 fail (new tests fail because functions are placeholders).

- [ ] **Step 2: Write customers.html**

Create `dashboard/customers.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Van's Auto — Customer Database</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Oswald:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
  <header class="header">
    <div class="header-logo">
      <a href="index.html" class="btn btn-back">← Dashboard</a>
      <span class="logo-badge">VAN'S AUTO</span>
      <span class="header-subtitle">Customer Database</span>
    </div>
    <div class="header-actions">
      <input type="text" class="search-input" id="search-input" placeholder="Search by name, vehicle, email…">
    </div>
  </header>

  <main class="main">
    <div id="due-section"></div>
    <div class="card">
      <div class="card-title" style="justify-content:space-between">
        <span class="label">All Customers</span>
        <span class="subtitle" id="customer-count"></span>
      </div>
      <div class="customer-table-wrap">
        <table class="customer-table" id="customer-table">
          <thead>
            <tr>
              <th data-sort="name">Customer ↕</th>
              <th data-sort="vehicle">Vehicle ↕</th>
              <th>Last Visit ↕</th>
              <th data-sort="totalSpent">Total Spent ↕</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody id="customer-tbody"></tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- HISTORY PANEL -->
  <div class="history-panel" id="history-panel">
    <div class="history-panel-header">
      <div>
        <div id="history-name" style="font-weight:600;font-size:15px"></div>
        <div id="history-vehicle" class="subtitle"></div>
      </div>
      <button class="close-btn" onclick="closeHistory()">×</button>
    </div>
    <div class="history-panel-body">
      <div id="history-ltv" style="margin-bottom:14px"></div>
      <div class="label" style="margin-bottom:10px">Service History</div>
      <div id="history-list"></div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script src="js/customers.js"></script>
</body>
</html>
```

- [ ] **Step 3: Write customers.js**

Create `dashboard/js/customers.js`:

```js
/* === PURE FUNCTIONS === */

function filterCustomers(customers, query) {
  if (!query) return customers;
  const q = query.toLowerCase();
  return customers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.vehicle.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q)
  );
}

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 180;
function isDueForService(lastVisit, referenceDate) {
  return (referenceDate - new Date(lastVisit).getTime()) > SIX_MONTHS_MS;
}

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* === STATE === */

let allCustomers = [];
let sortKey = 'name';
let sortAsc = true;
const now = Date.now();

/* === RENDER === */

function renderTable(customers) {
  const tbody = document.getElementById('customer-tbody');
  document.getElementById('customer-count').textContent = `${customers.length} customers`;

  tbody.innerHTML = customers.map(c => {
    const due = isDueForService(c.lastVisit, now);
    return `
      <tr class="${due ? 'overdue' : ''}" onclick="openHistory(${c.id})">
        <td class="name">${c.name} ${due ? '<span style="color:var(--yellow);font-size:11px">⚠ Due</span>' : ''}</td>
        <td>${c.vehicle}</td>
        <td>${formatDate(c.lastVisit)}</td>
        <td class="ltv">${formatCurrency(c.totalSpent)}</td>
        <td style="font-size:12px">${c.phone}<br><span style="color:var(--text-dim)">${c.email}</span></td>
      </tr>
    `;
  }).join('');
}

function renderDueSection(customers) {
  const due = customers.filter(c => isDueForService(c.lastVisit, now));
  if (due.length === 0) return;
  const el = document.getElementById('due-section');
  el.innerHTML = `
    <div class="due-banner">
      <div class="label" style="color:var(--yellow);margin-bottom:10px">⚠ ${due.length} Customers Overdue for Service</div>
      ${due.slice(0, 5).map(c => `
        <div class="due-row">
          <div>
            <span style="color:var(--text);font-weight:500">${c.name}</span>
            <span class="subtitle" style="margin-left:8px">${c.vehicle}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="subtitle">Last visit: ${formatDate(c.lastVisit)}</span>
            <button class="btn btn-ghost" style="font-size:11px;padding:4px 10px"
              onclick="event.stopPropagation(); showToast('Demo: Reminder SMS sent to ${c.name}')">
              Send Reminder
            </button>
          </div>
        </div>
      `).join('')}
      ${due.length > 5 ? `<div class="subtitle" style="margin-top:8px">+ ${due.length - 5} more — search to find them</div>` : ''}
    </div>
  `;
}

/* === HISTORY PANEL === */

function openHistory(id) {
  const customer = allCustomers.find(c => c.id === id);
  if (!customer) return;
  document.getElementById('history-name').textContent = customer.name;
  document.getElementById('history-vehicle').textContent = customer.vehicle;
  document.getElementById('history-ltv').innerHTML = `
    <div style="display:flex;gap:20px">
      <div><div class="label">Lifetime Value</div><div style="font-size:20px;font-weight:700;color:var(--green)">${formatCurrency(customer.totalSpent)}</div></div>
      <div><div class="label">Visits</div><div style="font-size:20px;font-weight:700">${customer.history.length}</div></div>
    </div>
  `;
  document.getElementById('history-list').innerHTML = customer.history.map(h => `
    <div class="history-row">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <span class="history-service">${h.service}</span>
        <span class="history-cost">${formatCurrency(h.cost)}</span>
      </div>
      <div class="history-meta">${formatDate(h.date)} · ${h.tech}${h.notes ? ' · ' + h.notes : ''}</div>
    </div>
  `).join('');
  document.getElementById('history-panel').classList.add('open');
}

function closeHistory() {
  document.getElementById('history-panel').classList.remove('open');
}

/* === SORT === */

function sortCustomers(customers) {
  return [...customers].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });
}

document.querySelectorAll('[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) sortAsc = !sortAsc;
    else { sortKey = key; sortAsc = true; }
    const query = document.getElementById('search-input').value;
    const filtered = filterCustomers(allCustomers, query);
    renderTable(sortCustomers(filtered));
  });
});

/* === SEARCH === */

document.getElementById('search-input').addEventListener('input', e => {
  const filtered = filterCustomers(allCustomers, e.target.value);
  renderTable(sortCustomers(filtered));
});

/* === TOAST === */

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* === INIT === */

async function init() {
  const res = await fetch('data/demo.json');
  const data = await res.json();
  allCustomers = data.customers;
  renderDueSection(allCustomers);
  renderTable(sortCustomers(allCustomers));
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 4: Run full test suite — all pass**

Run: `node dashboard/tests/data.test.js`
Expected:
```
✓ formatCurrency whole number
✓ formatCurrency zero
✓ revenueChangePct increase
✓ revenueChangePct decrease
✓ revenueChangePct no change
✓ filterCustomers by name
✓ filterCustomers by vehicle
✓ filterCustomers empty query returns all
✓ filterCustomers no match returns empty
✓ isDueForService — recent visit is NOT due
✓ isDueForService — 18 months ago IS due

11 passed, 0 failed
```

- [ ] **Step 5: Browser verify customers.html**

With local server running (`python3 -m http.server 3000` from `dashboard/`), open `http://localhost:3000/customers.html`. Verify:
- "← Dashboard" back button navigates to index.html
- Due for service banner shows overdue customers (Greg Tuttle, Bill Nowak, etc.)
- All 15 customers appear in the table
- Overdue rows have yellow left border and "⚠ Due" badge
- Lifetime value column shows green dollar amounts
- Typing in search box filters the table in real time (try "chevy")
- Clicking a customer row opens the history panel from the right
- History panel shows service history with dates, costs, tech
- Clicking × closes the history panel
- "Send Reminder" button shows a toast
- Clicking column headers sorts (click Name, click again to reverse)
- "View All Customers →" button on dashboard navigates here

- [ ] **Step 6: Commit**

```bash
git add dashboard/customers.html dashboard/js/customers.js dashboard/tests/data.test.js
git commit -m "feat: add customer database page with search, sort, history panel and due-for-service"
```

---

## Task 6: Guided Tour (Driver.js)

**Files:**
- Create: `dashboard/js/tour.js`

- [ ] **Step 1: Write tour.js**

Create `dashboard/js/tour.js`:

```js
function startTour() {
  const driver = window.driver.js.driver;

  const tour = driver({
    animate: true,
    smoothScroll: true,
    showProgress: true,
    progressText: 'Step {{current}} of {{total}}',
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Explore Dashboard',
    onDestroyStarted: () => {
      tour.destroy();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    },
    steps: [
      {
        element: '#kpi-revenue',
        popover: {
          title: '💰 Your Monthly Revenue',
          description: 'This is your total revenue at a glance. Connect your POS and it updates automatically — no manual entry required.',
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#card-revenue-chart',
        popover: {
          title: '📈 Revenue Over Time',
          description: 'See your revenue trend over 6 months. Spot slow seasons before they sneak up on you — and plan promotions accordingly.',
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#kpi-orders',
        popover: {
          title: '🔧 Open Work Orders',
          description: 'Every open job in the shop, live. See what\'s waiting on parts before a customer calls to ask.',
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#card-schedule',
        popover: {
          title: '📅 Today\'s Schedule',
          description: 'Your full day in one view — who\'s working on what, and what\'s still open. No more whiteboard chaos.',
          side: 'top', align: 'start'
        }
      },
      {
        element: '#card-technicians',
        popover: {
          title: '👨‍🔧 Technician Performance',
          description: 'See your team\'s output and efficiency. Know your top performers every month and schedule accordingly.',
          side: 'top', align: 'center'
        }
      },
      {
        element: '#card-inventory',
        popover: {
          title: '📦 Inventory Alerts',
          description: 'Low-stock warnings before you run out mid-job. Never turn a customer away because you\'re missing a filter.',
          side: 'top', align: 'end'
        }
      },
      {
        element: '#card-customers',
        popover: {
          title: '👥 Your Customer Database',
          description: '312 customers. 47 are overdue for service — that\'s booked revenue just waiting for a phone call. Click in to see the full list.',
          side: 'bottom', align: 'start'
        }
      },
      {
        element: '#card-pos',
        popover: {
          title: '💳 Connect Your Existing System',
          description: 'Already using Stripe, Square, Mitchell 1, or Tekmetric? Connect it here and your sales data imports automatically. No double entry.',
          side: 'bottom', align: 'end'
        }
      }
    ]
  });

  tour.drive();
}

document.getElementById('btn-start-tour').addEventListener('click', startTour);
document.getElementById('btn-connect-pos').addEventListener('click', () => {
  document.getElementById('card-pos').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => showToast('Demo: POS connection flow would open here'), 400);
});
```

- [ ] **Step 2: Browser verify the tour**

Open `http://localhost:3000` and click "▶ Start Tour". Verify:
- Spotlight highlights #kpi-revenue with tooltip on step 1
- "Next →" advances through all 8 steps in correct order
- "← Back" goes back
- Progress shows "Step X of 8"
- On "Explore Dashboard" (final step), confetti fires
- After tour ends, dashboard is fully usable
- "Connect POS ↗" button scrolls to the POS section and shows a toast

- [ ] **Step 3: Commit**

```bash
git add dashboard/js/tour.js
git commit -m "feat: add 8-step Driver.js guided tour with confetti finish"
```

---

## Task 7: Final Polish + Deploy

**Files:**
- Modify: `dashboard/css/dashboard.css` (add .gitignore entry)
- Create: `.gitignore` entry for `.DS_Store`

- [ ] **Step 1: Add .gitignore**

```bash
echo ".DS_Store\ndashboard/.DS_Store" >> .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"
```

- [ ] **Step 2: Full browser verification checklist**

With `python3 -m http.server 3000` running from `dashboard/`:

- [ ] All 4 KPI cards render with correct data
- [ ] Revenue bar chart visible with 6 months
- [ ] Top Services bars render
- [ ] Schedule shows 9 items with correct status badges
- [ ] Technician efficiency bars animate on load
- [ ] Inventory shows 3 red alerts + 3 green OK
- [ ] Customer snapshot shows 312 / 14 / 78% / 47
- [ ] Clicking Customer card navigates to customers.html
- [ ] POS buttons all visible, clicking shows toast
- [ ] Reviews shows 4.8★, distribution bars, 3 review cards
- [ ] "▶ Start Tour" runs all 8 steps + confetti
- [ ] Customer table: 15 rows, overdue rows yellow-highlighted
- [ ] Search filters live as you type
- [ ] Column headers sort the table
- [ ] Click a customer → history panel slides in from right
- [ ] "Send Reminder" shows toast
- [ ] Back button returns to dashboard
- [ ] Responsive at 768px — grid collapses to 1 col
- [ ] No console errors

- [ ] **Step 3: Run tests one final time**

```bash
node tests/data.test.js
```

Expected: `11 passed, 0 failed`

- [ ] **Step 4: Deploy to Netlify**

Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `dashboard/` folder into the drop zone. Netlify will assign a URL (e.g. `https://random-name-12345.netlify.app`).

Verify the deployed URL works in an incognito browser window — all modules load, tour works, customer page loads.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Van's Auto dashboard demo — complete and deployed"
```
