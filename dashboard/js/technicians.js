/* === PURE FUNCTIONS === */

function filterTechnicians(techs, query) {
  if (!query) return techs;
  const q = query.toLowerCase();
  return techs.filter(t => t.name.toLowerCase().includes(q));
}

function getTechScheduleForDay(tech, schedule) {
  return schedule.filter(s => s.tech === tech.name);
}

function calculateTechRating(tech, customers) {
  const jobsWithCustomers = customers.filter(c =>
    c.history.some(h => h.tech === tech.name)
  );
  if (jobsWithCustomers.length === 0) return 4.5;
  // Simple: average based on number of repeat customers
  const repeatCount = jobsWithCustomers.filter(c => c.history.length > 1).length;
  const baseRating = 4.5 + (repeatCount * 0.05);
  return Math.min(5, baseRating);
}

function calculateTechRevenue(tech, customers, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  let total = 0;
  customers.forEach(c => {
    c.history.forEach(h => {
      if (h.tech === tech.name && new Date(h.date) >= cutoffDate) {
        total += h.cost;
      }
    });
  });
  return total;
}

function calculateTechJobs(tech, customers, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  let count = 0;
  customers.forEach(c => {
    c.history.forEach(h => {
      if (h.tech === tech.name && new Date(h.date) >= cutoffDate) {
        count++;
      }
    });
  });
  return count;
}

function getStatusColor(efficiency) {
  if (efficiency >= 85) return '#10b981';
  if (efficiency >= 70) return '#f59e0b';
  return '#ef4444';
}

function getStatusLabel(efficiency) {
  if (efficiency >= 85) return 'Top Performer';
  if (efficiency >= 70) return 'On Track';
  return 'Needs Support';
}

/* === STATE === */

let allTechnicians = [];
let allSchedule = [];
let allCustomers = [];
let sortKey = 'jobsToday';
let sortAsc = false;

/* === RENDER === */

function renderTable(techs) {
  const tbody = document.getElementById('tech-tbody');
  document.getElementById('tech-count').textContent = `${techs.length} technicians`;

  tbody.innerHTML = techs.map(tech => {
    const rating = calculateTechRating(tech, allCustomers);
    const statusColor = getStatusColor(tech.efficiency);
    const statusLabel = getStatusLabel(tech.efficiency);

    return `
      <tr onclick="openDetail('${tech.name}')" style="border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background 150ms">
        <td style="padding:12px 15px;font-weight:600">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:32px;height:32px;background:${tech.color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:14px">${tech.initial}</div>
            <span>${tech.name}</span>
          </div>
        </td>
        <td style="padding:12px 15px">${tech.jobsToday} jobs</td>
        <td style="padding:12px 15px">${tech.efficiency}%</td>
        <td style="padding:12px 15px">${rating.toFixed(1)} ★</td>
        <td style="padding:12px 15px">
          <span style="background:${statusColor};color:white;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:500">${statusLabel}</span>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAlerts(techs) {
  const overbooked = techs.filter(t => t.jobsToday > 5);
  const underperforming = techs.filter(t => t.efficiency < 70);

  if (!overbooked.length && !underperforming.length) return;

  const el = document.getElementById('alerts-section');
  let html = '';

  if (overbooked.length) {
    html += `
      <div class="due-banner" style="border-left:4px solid var(--yellow)">
        <div class="label" style="color:var(--yellow);margin-bottom:10px">⚠ ${overbooked.length} Tech${overbooked.length > 1 ? 's' : ''} Over-Booked</div>
        ${overbooked.map(t => `
          <div class="due-row">
            <span style="color:var(--text);font-weight:500">${t.name}</span>
            <span class="subtitle">${t.jobsToday} jobs assigned</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (underperforming.length) {
    html += `
      <div class="due-banner" style="border-left:4px solid #ef4444">
        <div class="label" style="color:#ef4444;margin-bottom:10px">📈 ${underperforming.length} Tech${underperforming.length > 1 ? 's' : ''} Need Support</div>
        ${underperforming.map(t => `
          <div class="due-row">
            <span style="color:var(--text);font-weight:500">${t.name}</span>
            <span class="subtitle">${t.efficiency}% efficiency — consider mentoring</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  el.innerHTML = html;
}

/* === DETAIL PANEL === */

function openDetail(name) {
  const tech = allTechnicians.find(t => t.name === name);
  if (!tech) return;

  const rating = calculateTechRating(tech, allCustomers);
  const revenue = calculateTechRevenue(tech, allCustomers, 30);
  const schedule = getTechScheduleForDay(tech, allSchedule);

  document.getElementById('detail-name').textContent = tech.name;
  document.getElementById('detail-jobs').textContent = tech.jobsToday;
  document.getElementById('detail-efficiency').textContent = tech.efficiency + '%';
  document.getElementById('detail-rating').textContent = rating.toFixed(1) + ' ★';
  document.getElementById('detail-revenue').textContent = '$' + Math.round(revenue).toLocaleString('en-US');

  // Schedule
  if (schedule.length) {
    document.getElementById('detail-schedule').innerHTML = schedule.map(s => `
      <div style="background:#f8f9fa;padding:10px;border-radius:4px;font-size:12px">
        <div style="font-weight:500">${s.time} — ${s.service}</div>
        <div style="color:var(--text-muted);margin-top:3px">${s.customer}</div>
      </div>
    `).join('');
  } else {
    document.getElementById('detail-schedule').innerHTML = '<div style="color:var(--text-muted);font-size:12px">No jobs assigned today</div>';
  }

  // Trend (6-month efficiency simulation)
  const trend = [62, 68, 72, 70, 80, tech.efficiency];
  document.getElementById('detail-trend').innerHTML = trend.map((eff, i) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return `
      <div style="text-align:center">
        <div style="height:40px;background:linear-gradient(to top, ${getStatusColor(eff)}, ${getStatusColor(eff)}77);border-radius:3px;margin-bottom:5px"></div>
        <div style="font-size:10px;color:var(--text-muted)">${months[i]}</div>
        <div style="font-size:11px;font-weight:600">${eff}%</div>
      </div>
    `;
  }).join('');

  // Feedback
  const feedback = [
    'Great communication with customers',
    'Consistent work quality',
    'Customers request them by name'
  ];
  document.getElementById('detail-feedback').innerHTML = feedback.map(f => `<div>✓ ${f}</div>`).join('');

  document.getElementById('detail-panel').classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
}

/* === SORT === */

function sortTechnicians(techs) {
  return [...techs].sort((a, b) => {
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
    else { sortKey = key; sortAsc = false; }
    const query = document.getElementById('search-input').value;
    const filtered = filterTechnicians(allTechnicians, query);
    renderTable(sortTechnicians(filtered));
  });
});

/* === SEARCH === */

document.getElementById('search-input').addEventListener('input', e => {
  const filtered = filterTechnicians(allTechnicians, e.target.value);
  renderTable(sortTechnicians(filtered));
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
  allTechnicians = data.technicians;
  allSchedule = data.schedule;
  allCustomers = data.customers;
  renderAlerts(allTechnicians);
  renderTable(sortTechnicians(allTechnicians));
}

document.addEventListener('DOMContentLoaded', init);
