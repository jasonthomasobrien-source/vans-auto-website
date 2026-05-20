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

/* === NAVIGATION === */

function navigateToProfile(id) {
  window.location.href = 'customer-profile.html?id=' + id;
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
  document.getElementById('customer-count-header').textContent = `${customers.length} customers`;

  tbody.innerHTML = customers.map(c => {
    const due = isDueForService(c.lastVisit, now);
    return `
      <tr class="${due ? 'overdue' : ''}" onclick="navigateToProfile(${c.id})" style="cursor:pointer">
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
