/* === PURE FUNCTIONS === */

function filterWorkOrders(orders, query) {
  if (!query) return orders;
  const q = query.toLowerCase();
  return orders.filter(wo =>
    wo.id.toLowerCase().includes(q) ||
    wo.customer.toLowerCase().includes(q) ||
    wo.vehicle.toLowerCase().includes(q) ||
    wo.service.toLowerCase().includes(q)
  );
}

function navigateToCustomerProfile(customerId, event) {
  event.stopPropagation();
  window.location.href = 'customer-profile.html?id=' + customerId;
}

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatusColor(status) {
  const colors = {
    'open': '#fbbf24',
    'in-progress': '#60a5fa',
    'waiting-parts': '#f97316',
    'completed': '#4ade80',
    'overdue': '#ef4444'
  };
  return colors[status] || '#6b7280';
}

function getStatusLabel(status) {
  const labels = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'waiting-parts': 'Waiting for Parts',
    'completed': 'Completed',
    'overdue': 'Overdue'
  };
  return labels[status] || status;
}

function calculateTotal(wo) {
  const partsTotal = wo.parts.reduce((sum, p) => sum + (p.cost * p.qty), 0);
  const laborTotal = wo.labor.reduce((sum, l) => sum + (l.hours * l.rate), 0);
  return partsTotal + laborTotal;
}

/* === STATE === */

let allWorkOrders = [];
let sortKey = 'dateDue';
let sortAsc = true;
const now = Date.now();

/* === RENDER === */

function renderTable(orders) {
  const tbody = document.getElementById('workorder-tbody');
  document.getElementById('order-count').textContent = `${orders.length} orders`;

  tbody.innerHTML = orders.map(wo => {
    const total = calculateTotal(wo);
    const color = getStatusColor(wo.status);
    const label = getStatusLabel(wo.status);
    const customerId = wo.customerId || '';
    const customerLink = customerId ? `<span class="customer-name-link" onclick="navigateToCustomerProfile(${customerId}, event)">${wo.customer}</span>` : wo.customer;
    return `
      <tr class="${wo.status === 'overdue' ? 'overdue' : ''}" onclick="openDetail('${wo.id}')">
        <td style="font-weight:600;font-size:13px">${wo.id}</td>
        <td>${customerLink}</td>
        <td>${wo.vehicle}</td>
        <td>${wo.service}</td>
        <td><span style="background:${color};color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500">${label}</span></td>
        <td>${formatDate(wo.dateDue)}</td>
        <td class="ltv">${formatCurrency(total)}</td>
      </tr>
    `;
  }).join('');
}

function renderAlerts(orders) {
  const overdue = orders.filter(wo => wo.status === 'overdue');
  const waitingParts = orders.filter(wo => wo.status === 'waiting-parts');
  const inProgress = orders.filter(wo => wo.status === 'in-progress');

  if (!overdue.length && !waitingParts.length) return;

  const el = document.getElementById('alerts-section');
  let html = '';

  if (overdue.length) {
    html += `
      <div class="due-banner" style="border-left:4px solid var(--red)">
        <div class="label" style="color:var(--red);margin-bottom:10px">🚨 ${overdue.length} Work Order${overdue.length > 1 ? 's' : ''} Overdue</div>
        ${overdue.slice(0, 3).map(wo => `
          <div class="due-row">
            <div>
              <span style="color:#1f2937;font-weight:500">${wo.id} — ${wo.customer}</span>
              <span class="subtitle" style="margin-left:8px;color:#1f2937">${wo.vehicle}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="subtitle" style="color:#1f2937">Due: ${formatDate(wo.dateDue)}</span>
            </div>
          </div>
        `).join('')}
        ${overdue.length > 3 ? `<div class="subtitle" style="margin-top:8px;color:#1f2937">+ ${overdue.length - 3} more</div>` : ''}
      </div>
    `;
  }

  if (waitingParts.length) {
    html += `
      <div class="due-banner" style="border-left:4px solid #f97316">
        <div class="label" style="color:#f97316;margin-bottom:10px">⏳ ${waitingParts.length} Order${waitingParts.length > 1 ? 's' : ''} Waiting for Parts</div>
        ${waitingParts.slice(0, 3).map(wo => `
          <div class="due-row">
            <div>
              <span style="color:#1f2937;font-weight:500">${wo.id} — ${wo.customer}</span>
              <span class="subtitle" style="margin-left:8px;color:#1f2937">${wo.vehicle}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="subtitle" style="color:#1f2937">Due: ${formatDate(wo.dateDue)}</span>
            </div>
          </div>
        `).join('')}
        ${waitingParts.length > 3 ? `<div class="subtitle" style="margin-top:8px;color:#1f2937">+ ${waitingParts.length - 3} more</div>` : ''}
      </div>
    `;
  }

  el.innerHTML = html;
}

/* === DETAIL PANEL === */

function openDetail(id) {
  const wo = allWorkOrders.find(w => w.id === id);
  if (!wo) return;

  const total = calculateTotal(wo);
  document.getElementById('detail-order-id').textContent = wo.id;
  document.getElementById('detail-customer').textContent = wo.customer;

  const color = getStatusColor(wo.status);
  document.getElementById('detail-status').innerHTML = `<span style="background:${color};color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:500">${getStatusLabel(wo.status)}</span>`;
  document.getElementById('detail-tech').textContent = wo.tech || '—';
  document.getElementById('detail-due').textContent = formatDate(wo.dateDue);

  document.getElementById('detail-service-desc').innerHTML = `
    <div><strong>${wo.service}</strong></div>
    <div style="margin-top:6px">${wo.vehicle}</div>
  `;

  if (wo.parts.length) {
    document.getElementById('detail-parts').innerHTML = wo.parts.map(p => `
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span>${p.name} (qty: ${p.qty})</span>
        <span>${formatCurrency(p.cost * p.qty)}</span>
      </div>
    `).join('');
  } else {
    document.getElementById('detail-parts').textContent = 'No parts required';
  }

  document.getElementById('detail-labor').innerHTML = wo.labor.map(l => `
    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
      <span>${l.type} (${l.hours}h @ $${l.rate}/h)</span>
      <span>${formatCurrency(l.hours * l.rate)}</span>
    </div>
  `).join('');

  document.getElementById('detail-total').textContent = formatCurrency(total);
  document.getElementById('detail-notes').textContent = wo.notes || 'No additional notes';

  document.getElementById('detail-panel').classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
}

/* === SORT === */

function sortWorkOrders(orders) {
  return [...orders].sort((a, b) => {
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
    const filtered = filterWorkOrders(allWorkOrders, query);
    renderTable(sortWorkOrders(filtered));
  });
});

/* === SEARCH === */

document.getElementById('search-input').addEventListener('input', e => {
  const filtered = filterWorkOrders(allWorkOrders, e.target.value);
  renderTable(sortWorkOrders(filtered));
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
  allWorkOrders = data.workOrders;
  renderAlerts(allWorkOrders);
  renderTable(sortWorkOrders(allWorkOrders));
}

document.addEventListener('DOMContentLoaded', init);
