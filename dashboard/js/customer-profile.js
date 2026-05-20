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
