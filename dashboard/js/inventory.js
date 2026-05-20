/* === PURE FUNCTIONS === */

function filterInventory(items, query) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(i => i.item.toLowerCase().includes(q));
}

function getStatusLabel(item) {
  return item.low ? 'Low Stock' : 'Adequate';
}

function getStatusColor(item) {
  return item.low ? '#f97316' : '#10b981';
}

function getReorderLevel(item) {
  if (item.reorderLevel) return item.reorderLevel;
  // Default reorder levels based on item criticality
  if (item.item.includes('Filter') || item.item.includes('Pad')) return 3;
  if (item.item.includes('Fluid') || item.item.includes('Oil')) return 5;
  return 2;
}

function getReorderQuantity(item) {
  if (item.reorderQty) return item.reorderQty;
  // Default: order enough to reach 2x reorder level
  return getReorderLevel(item) * 2;
}

function getSupplier(item) {
  if (item.supplier) return item.supplier;
  // Default suppliers based on item type
  if (item.item.includes('Filter') || item.item.includes('Oil')) return 'NAPA Auto Parts';
  if (item.item.includes('Pad') || item.item.includes('Rotor')) return 'AutoZone';
  if (item.item.includes('Spark')) return 'Advance Auto Parts';
  return 'Various';
}

function getUnitCost(item) {
  if (item.cost) return item.cost;
  // Estimated unit costs
  if (item.item.includes('Filter')) return 8.50;
  if (item.item.includes('Pad')) return 35.00;
  if (item.item.includes('Plug')) return 2.50;
  if (item.item.includes('Blade')) return 12.00;
  if (item.item.includes('Fluid')) return 15.00;
  return 10.00;
}

function getTotalValue(item) {
  return item.qty * getUnitCost(item);
}

function getLastOrderDate(item) {
  if (item.lastOrder) return item.lastOrder;
  // Simulate recent orders
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 45) + 5;
  const lastOrder = new Date(today);
  lastOrder.setDate(lastOrder.getDate() - daysAgo);
  return lastOrder.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isDaysUntilReorder(item) {
  const reorderLevel = getReorderLevel(item);
  if (item.qty <= reorderLevel) return 0;
  // Estimate days until reorder needed (assuming 2 units used per day on average)
  return Math.ceil((item.qty - reorderLevel) / 2);
}

/* === STATE === */

let allInventory = [];
let sortKey = 'item';
let sortAsc = true;
let currentFilter = 'all';

/* === RENDER === */

function renderTable(items) {
  const tbody = document.getElementById('inventory-tbody');
  document.getElementById('item-count').textContent = `${items.length} items`;

  tbody.innerHTML = items.map((item, idx) => {
    const statusColor = getStatusColor(item);
    const statusBg = item.low ? 'rgba(249, 115, 22, 0.15)' : 'rgba(74, 222, 128, 0.15)';
    const statusLabel = getStatusLabel(item);
    const reorderLevel = getReorderLevel(item);
    const bgColor = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';

    return `
      <tr onclick="openDetail('${item.item}')" style="background:${bgColor};border-bottom:1px solid var(--border);cursor:pointer;transition:background 150ms">
        <td style="padding:16px 15px;font-weight:600;color:var(--text)">${item.item}</td>
        <td style="padding:16px 15px;color:var(--text);font-weight:500">${item.qty} unit${item.qty !== 1 ? 's' : ''}</td>
        <td style="padding:16px 15px">
          <span style="background:${statusBg};color:${statusColor};padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600">${statusLabel}</span>
        </td>
        <td style="padding:16px 15px;color:var(--text-muted)">${reorderLevel} units</td>
      </tr>
    `;
  }).join('');
}

function renderAlerts(items) {
  const lowStock = items.filter(i => i.low);

  if (!lowStock.length) return;

  const el = document.getElementById('alerts-section');
  const daysData = lowStock.map(i => ({
    item: i.item,
    days: isDaysUntilReorder(i),
    qty: i.qty
  }));

  let html = `
    <div class="due-banner" style="border-left:4px solid #f97316">
      <div class="label" style="color:#f97316;margin-bottom:10px">⚠ ${lowStock.length} Item${lowStock.length > 1 ? 's' : ''} Low in Stock</div>
      ${daysData.slice(0, 4).map(d => `
        <div class="due-row">
          <span style="color:var(--text);font-weight:500">${d.item}</span>
          <span class="subtitle">${d.qty} units left — order within ${d.days} days</span>
        </div>
      `).join('')}
      ${lowStock.length > 4 ? `<div class="subtitle" style="margin-top:8px">+ ${lowStock.length - 4} more items need attention</div>` : ''}
    </div>
  `;

  el.innerHTML = html;
}

/* === DETAIL PANEL === */

function openDetail(itemName) {
  const item = allInventory.find(i => i.item === itemName);
  if (!item) return;

  const reorderLevel = getReorderLevel(item);
  const reorderQty = getReorderQuantity(item);
  const supplier = getSupplier(item);
  const cost = getUnitCost(item);
  const totalValue = getTotalValue(item);
  const lastOrder = getLastOrderDate(item);
  const statusColor = getStatusColor(item);
  const statusLabel = getStatusLabel(item);

  document.getElementById('detail-item-name').textContent = item.item;
  document.getElementById('detail-qty').textContent = item.qty;
  document.getElementById('detail-status').innerHTML = `<span style="background:${statusColor};color:white;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:500">${statusLabel}</span>`;
  document.getElementById('detail-reorder-level').textContent = reorderLevel;
  document.getElementById('detail-order-qty').textContent = reorderQty;
  document.getElementById('detail-supplier').textContent = supplier;
  document.getElementById('detail-cost').textContent = '$' + cost.toFixed(2);
  document.getElementById('detail-total-value').textContent = '$' + Math.round(totalValue).toLocaleString('en-US');
  document.getElementById('detail-last-order').textContent = lastOrder;

  document.getElementById('detail-panel').classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
}

function markForReorder() {
  showToast('✓ Item marked for ordering. Add to purchase order.');
}

/* === SORT === */

function sortInventory(items) {
  return [...items].sort((a, b) => {
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

    let filtered = filterInventory(allInventory, document.getElementById('search-input').value);
    if (currentFilter === 'low') {
      filtered = filtered.filter(i => i.low);
    }
    renderTable(sortInventory(filtered));
  });
});

/* === FILTER === */

document.getElementById('filter-all').addEventListener('click', () => {
  currentFilter = 'all';
  document.getElementById('filter-all').style.background = '#60a5fa';
  document.getElementById('filter-all').style.color = 'white';
  document.getElementById('filter-all').style.border = 'none';
  document.getElementById('filter-low').style.background = 'transparent';
  document.getElementById('filter-low').style.color = '#f97316';
  document.getElementById('filter-low').style.border = '2px solid #f97316';

  let filtered = filterInventory(allInventory, document.getElementById('search-input').value);
  renderTable(sortInventory(filtered));
});

document.getElementById('filter-low').addEventListener('click', () => {
  currentFilter = 'low';
  document.getElementById('filter-low').style.background = '#f97316';
  document.getElementById('filter-low').style.color = 'white';
  document.getElementById('filter-low').style.border = 'none';
  document.getElementById('filter-all').style.background = 'transparent';
  document.getElementById('filter-all').style.color = '#60a5fa';
  document.getElementById('filter-all').style.border = '2px solid #60a5fa';

  let filtered = filterInventory(allInventory, document.getElementById('search-input').value);
  filtered = filtered.filter(i => i.low);
  renderTable(sortInventory(filtered));
});

/* === SEARCH === */

document.getElementById('search-input').addEventListener('input', e => {
  let filtered = filterInventory(allInventory, e.target.value);
  if (currentFilter === 'low') {
    filtered = filtered.filter(i => i.low);
  }
  renderTable(sortInventory(filtered));
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
  allInventory = data.inventory;
  renderAlerts(allInventory);
  renderTable(sortInventory(allInventory));
}

document.addEventListener('DOMContentLoaded', init);
