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

function renderInventorySnapshot(data) {
  const { inventory } = data;
  const lowStock = inventory.filter(i => i.low).length;
  const totalItems = inventory.length;
  const totalQty = inventory.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById('inventory-list');
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px">
      <div><div class="label">Total Items</div><div class="value">${totalItems}</div></div>
      <div><div class="label">Total Units</div><div class="value">${totalQty}</div></div>
      <div>
        <div class="label">Low Stock Items</div>
        <div class="value" style="color:#f97316">${lowStock}</div>
      </div>
      <div>
        <div class="label">Stock Health</div>
        <div class="value" style="color:${lowStock > 2 ? '#ef4444' : lowStock > 0 ? '#f59e0b' : '#10b981'}">${lowStock === 0 ? '✓ Good' : lowStock < 3 ? 'Fair' : 'Critical'}</div>
        ${lowStock > 2 ? '<div class="delta-warn" style="font-size:11px">Order supplies</div>' : ''}
      </div>
    </div>
  `;
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

/* === WORK ORDER SNAPSHOT === */

function renderWorkOrderSnapshot(data) {
  const { kpis, workOrders } = data;
  const overdue = workOrders.filter(wo => wo.status === 'overdue').length;
  const waitingParts = workOrders.filter(wo => wo.status === 'waiting-parts').length;
  const el = document.getElementById('workorder-snapshot');
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px">
      <div><div class="label">Open Work Orders</div><div class="value">${kpis.openWorkOrders}</div></div>
      <div><div class="label">In Progress</div><div class="value">${workOrders.filter(wo => wo.status === 'in-progress').length}</div></div>
      <div>
        <div class="label">Waiting for Parts</div>
        <div class="value" style="color:#f97316">${waitingParts}</div>
      </div>
      <div>
        <div class="label">Overdue</div>
        <div class="value" style="color:var(--red)">${overdue}</div>
        <div class="delta-warn" style="font-size:11px">Needs attention</div>
      </div>
    </div>
  `;
}

/* === TECHNICIAN SNAPSHOT === */

function renderTechnicianSnapshot(data) {
  const { technicians } = data;
  const topPerformers = technicians.filter(t => t.efficiency >= 85).length;
  const needsSupport = technicians.filter(t => t.efficiency < 70).length;
  const totalJobs = technicians.reduce((sum, t) => sum + t.jobsToday, 0);
  const el = document.getElementById('technician-snapshot');
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px">
      <div><div class="label">Team Size</div><div class="value">${technicians.length}</div></div>
      <div><div class="label">Jobs Today</div><div class="value">${totalJobs}</div></div>
      <div>
        <div class="label">Top Performers</div>
        <div class="value" style="color:var(--green)">${topPerformers}</div>
      </div>
      <div>
        <div class="label">Needs Support</div>
        <div class="value" style="color:var(--red)">${needsSupport}</div>
        ${needsSupport > 0 ? '<div class="delta-warn" style="font-size:11px">Consider training</div>' : ''}
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
  renderInventorySnapshot(data);
  renderCustomerSnapshot(data);
  renderWorkOrderSnapshot(data);
  renderTechnicianSnapshot(data);
  renderPOS(data);
  renderReviews(data);
}

document.addEventListener('DOMContentLoaded', init);
