async function init() {
  const res = await fetch('data/demo.json');
  const data = await res.json();

  const tbody = document.getElementById('schedule-tbody');
  const today = new Date();

  const appointments = data.customers.flatMap((c, i) => ({
    time: `${9 + (i % 8)}:${i % 2 === 0 ? '00' : '30'} AM`,
    customer: c.name,
    service: 'Oil Change',
    technician: ['Mike', 'Sarah', 'John'][i % 3],
    status: ['Confirmed', 'Pending', 'Completed'][i % 3],
    id: i
  })).slice(0, 8);

  document.getElementById('appts-count').textContent = `${appointments.length} appointments`;
  document.getElementById('appts-today').textContent = Math.floor(appointments.length / 2);
  document.getElementById('appts-week').textContent = appointments.length;
  document.getElementById('appts-util').textContent = `${Math.round(appointments.length * 12.5)}%`;

  tbody.innerHTML = appointments.map(a => {
    const statusColor = a.status === 'Confirmed' ? '#4ade80' : a.status === 'Pending' ? '#facc15' : '#60a5fa';
    const statusBg = a.status === 'Confirmed' ? 'rgba(74,222,128,0.15)' : a.status === 'Pending' ? 'rgba(250,204,21,0.15)' : 'rgba(96,165,250,0.15)';

    return `
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:16px 15px;color:var(--text);font-weight:500">${a.time}</td>
        <td style="padding:16px 15px;color:var(--text)">${a.customer}</td>
        <td style="padding:16px 15px;color:var(--text-muted)">${a.service}</td>
        <td style="padding:16px 15px;color:var(--text-muted)">${a.technician}</td>
        <td style="padding:16px 15px;text-align:center">
          <span style="background:${statusBg};color:${statusColor};padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600">${a.status}</span>
        </td>
      </tr>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', init);
