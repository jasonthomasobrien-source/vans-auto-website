/* === RENDER FUNCTIONS === */

function renderHours(data) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = [
    { day: 'Monday', open: '8:00 AM', close: '5:00 PM' },
    { day: 'Tuesday', open: '8:00 AM', close: '5:00 PM' },
    { day: 'Wednesday', open: '8:00 AM', close: '5:00 PM' },
    { day: 'Thursday', open: '8:00 AM', close: '5:00 PM' },
    { day: 'Friday', open: '8:00 AM', close: '5:00 PM' },
    { day: 'Saturday', open: '9:00 AM', close: '3:00 PM' },
    { day: 'Sunday', open: 'Closed', close: '' }
  ];

  const tbody = document.getElementById('hours-tbody');
  tbody.innerHTML = hours.map(h => `
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:12px 15px;font-weight:500">${h.day}</td>
      <td style="padding:12px 15px;color:var(--text-muted)">${h.open}</td>
      <td style="padding:12px 15px;color:var(--text-muted)">${h.close}</td>
    </tr>
  `).join('');
}

function renderTeamMembers(data) {
  const { technicians } = data;
  const el = document.getElementById('team-members');

  el.innerHTML = technicians.map(t => `
    <div style="background:#fff;padding:15px;border-radius:6px;border:1px solid #e5e7eb;box-shadow:0 1px 2px rgba(0,0,0,0.05)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="width:40px;height:40px;background:${t.color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:16px">${t.initial}</div>
        <div>
          <div style="font-weight:600">${t.name}</div>
          <div style="font-size:12px;color:var(--text-muted)">Technician</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;background:#f8f9fa;border-radius:4px;margin-bottom:12px;font-size:12px">
        <div><span style="color:var(--text-muted)">Jobs Today:</span> ${t.jobsToday}</div>
        <div><span style="color:var(--text-muted)">Efficiency:</span> ${t.efficiency}%</div>
      </div>
      <div style="display:flex;gap:8px">
        <button style="flex:1;background:transparent;border:1px solid #e5e7eb;padding:8px;border-radius:4px;cursor:pointer;font-size:12px;color:var(--text-muted);transition:all 150ms" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">Edit</button>
        <button style="flex:1;background:transparent;border:1px solid #e5e7eb;padding:8px;border-radius:4px;cursor:pointer;font-size:12px;color:var(--text-muted);transition:all 150ms" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">Remove</button>
      </div>
    </div>
  `).join('');
}

function renderServices(data) {
  const services = [
    { name: 'Oil Change', price: '$45–$85', duration: '30 min', active: true },
    { name: 'Brake Service', price: '$200–$600', duration: '1–2 hrs', active: true },
    { name: 'Tire Rotation', price: '$30–$60', duration: '30 min', active: true },
    { name: 'Diagnostics', price: '$75–$150', duration: '1 hr', active: true },
    { name: 'Battery Replace', price: '$120–$200', duration: '30 min', active: true },
    { name: 'AC Recharge', price: '$100–$200', duration: '1 hr', active: true }
  ];

  const tbody = document.getElementById('services-tbody');
  tbody.innerHTML = services.map(s => `
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:12px 15px;font-weight:500">${s.name}</td>
      <td style="padding:12px 15px;text-align:right;color:var(--text-muted)">${s.price}</td>
      <td style="padding:12px 15px;text-align:right;color:var(--text-muted)">${s.duration}</td>
      <td style="padding:12px 15px;text-align:center">
        <input type="checkbox" ${s.active ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer">
      </td>
    </tr>
  `).join('');
}

function renderPermissions() {
  const roles = [
    { name: 'Admin', viewDash: true, manageJobs: true, editPrice: true, manageUsers: true },
    { name: 'Manager', viewDash: true, manageJobs: true, editPrice: true, manageUsers: false },
    { name: 'Technician', viewDash: true, manageJobs: true, editPrice: false, manageUsers: false },
    { name: 'Receptionist', viewDash: true, manageJobs: false, editPrice: false, manageUsers: false }
  ];

  const tbody = document.getElementById('permissions-tbody');
  tbody.innerHTML = roles.map(r => `
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:12px 15px;font-weight:500">${r.name}</td>
      <td style="padding:12px 15px;text-align:center">${r.viewDash ? '✓' : '—'}</td>
      <td style="padding:12px 15px;text-align:center">${r.manageJobs ? '✓' : '—'}</td>
      <td style="padding:12px 15px;text-align:center">${r.editPrice ? '✓' : '—'}</td>
      <td style="padding:12px 15px;text-align:center">${r.manageUsers ? '✓' : '—'}</td>
    </tr>
  `).join('');
}

/* === TAB SWITCHING === */

document.querySelectorAll('.settings-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;

    document.querySelectorAll('.settings-tab').forEach(b => {
      b.style.borderBottomColor = 'transparent';
      b.style.color = 'var(--text-muted)';
    });
    btn.style.borderBottomColor = '#e63946';
    btn.style.color = 'var(--text)';

    document.querySelectorAll('.settings-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(`tab-${tabName}`).style.display = 'block';
  });
});

/* === INIT === */

async function init() {
  const res = await fetch('data/demo.json');
  const data = await res.json();

  renderHours(data);
  renderTeamMembers(data);
  renderServices(data);
  renderPermissions();
}

document.addEventListener('DOMContentLoaded', init);
