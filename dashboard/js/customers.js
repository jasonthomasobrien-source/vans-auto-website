/* === STATE === */

let allCustomers = [];
let filteredCustomers = [];
let currentPage = 1;
let itemsPerPage = 15;
let activeFilter = 'all';
let searchQuery = '';
let sortColumn = null;
let sortDirection = 'asc';

/* === UTILITY FUNCTIONS === */

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getCustomerInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getCustomerColor(id) {
  const colors = ['#e63946', '#60a5fa', '#a78bfa', '#f59e0b', '#10b981', '#ec4899'];
  return colors[id % colors.length];
}

function getCustomerStatus(customer) {
  const lastVisitDate = new Date(customer.lastVisit);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if (lastVisitDate < sixMonthsAgo) return 'overdue';
  if (customer.history.length === 1) return 'new';
  return 'returning';
}

function meetsFilter(customer) {
  if (activeFilter === 'all') return true;
  return getCustomerStatus(customer) === activeFilter;
}

function matchesSearch(customer) {
  if (!searchQuery) return true;
  const q = searchQuery.toLowerCase();
  return (
    customer.name.toLowerCase().includes(q) ||
    customer.phone.includes(q) ||
    customer.email.toLowerCase().includes(q) ||
    customer.vehicle.toLowerCase().includes(q)
  );
}

/* === DATA LOADING === */

async function loadData() {
  const res = await fetch('data/demo.json');
  return res.json();
}

/* === FILTERING & SORTING === */

function applyFilters() {
  filteredCustomers = allCustomers
    .filter(meetsFilter)
    .filter(matchesSearch);

  if (sortColumn) {
    filteredCustomers.sort((a, b) => {
      let aVal, bVal;

      switch (sortColumn) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'vehicle':
          aVal = a.vehicle;
          bVal = b.vehicle;
          break;
        case 'lastVisit':
          aVal = new Date(a.lastVisit);
          bVal = new Date(b.lastVisit);
          break;
        case 'totalSpent':
          aVal = a.totalSpent;
          bVal = b.totalSpent;
          break;
        case 'visits':
          aVal = a.history.length;
          bVal = b.history.length;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  currentPage = 1;
  render();
}

/* === RENDERING === */

function render() {
  renderTable();
  renderPagination();
}

function renderTable() {
  const tbody = document.getElementById('customers-tbody');
  const empty = document.getElementById('empty-state');

  if (filteredCustomers.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageCustomers = filteredCustomers.slice(start, end);

  tbody.innerHTML = pageCustomers.map(c => {
    const status = getCustomerStatus(c);
    const statusLabel = status === 'overdue' ? 'Overdue' : status === 'new' ? 'New' : 'Returning';
    const statusClass = `status-${status}`;

    return `
      <tr onclick="openModal(${c.id})">
        <td>
          <div class="customer-name">
            <div class="customer-avatar" style="background:${getCustomerColor(c.id)}">${getCustomerInitials(c.name)}</div>
            <span>${c.name}</span>
          </div>
        </td>
        <td>${c.vehicle}</td>
        <td>${formatDate(c.lastVisit)}</td>
        <td><span class="currency">${formatCurrency(c.totalSpent)}</span></td>
        <td>${c.history.length}</td>
        <td><span class="customer-status ${statusClass}">${statusLabel}</span></td>
      </tr>
    `;
  }).join('');
}

function renderPagination() {
  const container = document.getElementById('pagination');
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  // Previous button
  html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="previousPage()">← Prev</button>`;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="pagination-info">...</span>`;
    }
  }

  // Next button
  html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="nextPage()">Next →</button>`;

  container.innerHTML = html;
}

/* === PAGINATION HANDLERS === */

function goToPage(page) {
  currentPage = page;
  render();
  document.querySelector('.customers-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function previousPage() {
  if (currentPage > 1) goToPage(currentPage - 1);
}

function nextPage() {
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  if (currentPage < totalPages) goToPage(currentPage + 1);
}

/* === MODAL === */

function openModal(customerId) {
  const customer = allCustomers.find(c => c.id === customerId);
  if (!customer) return;

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const overlay = document.getElementById('modal-overlay');

  modalTitle.textContent = customer.name;

  const status = getCustomerStatus(customer);
  const statusLabel = status === 'overdue' ? 'Overdue for Service' : status === 'new' ? 'New Customer' : 'Returning Customer';

  modalBody.innerHTML = `
    <div class="detail-section">
      <div class="detail-section-title">Contact Information</div>
      <div class="detail-row">
        <div class="detail-label">Phone</div>
        <div class="detail-value"><a href="tel:${customer.phone}" style="color:var(--red)">${customer.phone}</a></div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Email</div>
        <div class="detail-value"><a href="mailto:${customer.email}" style="color:var(--red)">${customer.email}</a></div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Vehicle & History</div>
      <div class="detail-row">
        <div class="detail-label">Vehicle</div>
        <div class="detail-value">${customer.vehicle}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Total Visits</div>
        <div class="detail-value">${customer.history.length}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Total Spent</div>
        <div class="detail-value"><span class="currency">${formatCurrency(customer.totalSpent)}</span></div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Last Visit</div>
        <div class="detail-value">${formatDate(customer.lastVisit)}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Status</div>
        <div class="detail-value"><span class="customer-status status-${status}" style="display:inline-block">${statusLabel}</span></div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Service History</div>
      <div class="service-history">
        ${customer.history.map(h => `
          <div class="history-item">
            <div class="history-date">${formatDate(h.date)}</div>
            <div class="history-service">${h.service}</div>
            <div class="history-details">
              <span style="color:var(--green)">${formatCurrency(h.cost)}</span> · Tech: <span style="color:var(--text-muted)">${h.tech}</span>
              ${h.notes ? `<div style="margin-top:4px;color:var(--text-dim);font-style:italic">"${h.notes}"</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  overlay.classList.add('show');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

/* === EVENT LISTENERS === */

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  allCustomers = data.customers;

  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    applyFilters();
  });

  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.dataset.filter;
      applyFilters();
    });
  });

  // Sorting
  document.querySelectorAll('.customers-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (sortColumn === col) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = col;
        sortDirection = 'asc';
      }
      applyFilters();
    });
  });

  // Close modal on overlay click
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  // Initial render
  applyFilters();
});
