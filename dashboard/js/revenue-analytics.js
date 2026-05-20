/* === PURE UTILITY FUNCTIONS === */

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function calculateRevenueByService(customers, topServices) {
  const serviceRevenue = {};
  const serviceJobCount = {};

  customers.forEach(c => {
    c.history.forEach(h => {
      const svc = h.service.split('(')[0].trim();
      if (!serviceRevenue[svc]) {
        serviceRevenue[svc] = 0;
        serviceJobCount[svc] = 0;
      }
      serviceRevenue[svc] += h.cost;
      serviceJobCount[svc] += 1;
    });
  });

  return { serviceRevenue, serviceJobCount };
}

function calculateCustomerSegments(customers) {
  const highValue = customers.filter(c => c.totalSpent >= 2000);
  const midValue = customers.filter(c => c.totalSpent >= 1000 && c.totalSpent < 2000);
  const lowValue = customers.filter(c => c.totalSpent < 1000);

  const calcSegment = (segment) => ({
    count: segment.length,
    totalRevenue: segment.reduce((sum, c) => sum + c.totalSpent, 0),
    avgSpend: segment.length > 0 ? Math.round(segment.reduce((sum, c) => sum + c.totalSpent, 0) / segment.length) : 0,
    avgFrequency: segment.length > 0 ? (segment.reduce((sum, c) => sum + c.history.length, 0) / segment.length).toFixed(1) : 0
  });

  return {
    highValue: calcSegment(highValue),
    midValue: calcSegment(midValue),
    lowValue: calcSegment(lowValue)
  };
}

function calculateMonthlyComparison(revenueHistory) {
  return revenueHistory.map((curr, i) => {
    const prior = i > 0 ? revenueHistory[i - 1] : null;
    const growth = prior ? Math.round(((curr.amount - prior.amount) / prior.amount) * 100) : 0;
    return { ...curr, growth };
  });
}

function getMonthGrowth(growth) {
  if (growth === 0) return '→';
  return growth > 0 ? '↑' : '↓';
}

function getTrendColor(growth) {
  if (growth === 0) return '#6b7280';
  return growth > 0 ? '#10b981' : '#ef4444';
}

/* === STATE === */

let allData = null;

/* === RENDER === */

function renderKPIs(data) {
  const { kpis, revenueHistory, customers } = data;
  const sixMonthTotal = revenueHistory.reduce((sum, r) => sum + r.amount, 0);
  const avgPerMonth = Math.round(sixMonthTotal / 6);
  const avgCustomerLTV = customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length) : 0;
  const lastMonthRevenue = revenueHistory[revenueHistory.length - 2]?.amount || 0;
  const growth = lastMonthRevenue > 0 ? Math.round(((kpis.revenueThisMonth - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;

  document.getElementById('kpi-this-month').textContent = formatCurrency(kpis.revenueThisMonth);
  const sign = growth >= 0 ? '+' : '';
  const color = growth >= 0 ? '#10b981' : '#ef4444';
  document.getElementById('kpi-this-month-delta').innerHTML = `<span style="color:${color}">${sign}${growth}% vs last month</span>`;

  document.getElementById('kpi-last-month').textContent = formatCurrency(lastMonthRevenue);
  document.getElementById('kpi-six-month').textContent = formatCurrency(avgPerMonth);
  document.getElementById('kpi-customer-ltv').textContent = formatCurrency(avgCustomerLTV);
}

function renderAlerts(data) {
  const { revenueHistory } = data;
  const el = document.getElementById('alerts-section');

  let html = '';

  const trendingUp = revenueHistory[revenueHistory.length - 1].amount > revenueHistory[revenueHistory.length - 2].amount;
  const trendingUp2 = revenueHistory[revenueHistory.length - 2].amount > revenueHistory[revenueHistory.length - 3].amount;

  if (trendingUp && trendingUp2) {
    html += `
      <div class="due-banner" style="border-left:4px solid #10b981">
        <div class="label" style="color:#10b981;margin-bottom:10px">📈 Revenue Trending Up</div>
        <div class="due-row">
          <span style="color:var(--text);font-weight:500">Last 2 Months Positive</span>
          <span class="subtitle">May +${Math.round(((revenueHistory[5].amount - revenueHistory[4].amount) / revenueHistory[4].amount) * 100)}%</span>
        </div>
      </div>
    `;
  } else if (!trendingUp && !trendingUp2) {
    html += `
      <div class="due-banner" style="border-left:4px solid #f97316">
        <div class="label" style="color:#f97316;margin-bottom:10px">⚠ Revenue Declining</div>
        <div class="due-row">
          <span style="color:var(--text);font-weight:500">Last 2 Months Negative</span>
          <span class="subtitle">Monitor trends and review marketing efforts</span>
        </div>
      </div>
    `;
  }

  if (html) el.innerHTML = html;
}

function renderTrendChart(data) {
  const { revenueHistory } = data;
  const maxRevenue = Math.max(...revenueHistory.map(r => r.amount));
  const el = document.getElementById('trend-chart');

  el.innerHTML = revenueHistory.map((r, i) => {
    const heightPct = (r.amount / maxRevenue) * 100;
    const growth = i > 0 ? Math.round(((r.amount - revenueHistory[i - 1].amount) / revenueHistory[i - 1].amount) * 100) : 0;
    const growthColor = growth > 0 ? '#10b981' : growth < 0 ? '#ef4444' : '#6b7280';

    return `
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;justify-content:flex-end;height:100%">
        <div style="background:linear-gradient(to top, #e63946, #e63946cc);width:100%;height:${heightPct}%;border-radius:4px;transition:all 150ms"></div>
        <div style="font-size:10px;color:var(--text-muted);font-weight:500">${r.month}</div>
        <div style="font-size:11px;font-weight:600;color:${growthColor}">${growth > 0 ? '+' : ''}${growth}%</div>
      </div>
    `;
  }).join('');
}

function renderTopServices(data) {
  const { topServices } = data;
  const el = document.getElementById('top-services-list');

  el.innerHTML = topServices.map(s => `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:4px">
        <span style="font-weight:500">${s.name}</span><span>${s.pct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${s.pct}%;background:var(--red)"></div>
      </div>
    </div>
  `).join('');
}

function renderServiceProfitability(data) {
  const { customers, revenueHistory } = data;
  const { serviceRevenue, serviceJobCount } = calculateRevenueByService(customers, data.topServices);
  const totalRevenue = Object.values(serviceRevenue).reduce((sum, r) => sum + r, 0);

  const tbody = document.getElementById('service-tbody');
  const services = Object.keys(serviceRevenue).sort((a, b) => serviceRevenue[b] - serviceRevenue[a]);

  tbody.innerHTML = services.map(svc => {
    const revenue = serviceRevenue[svc];
    const jobs = serviceJobCount[svc];
    const pct = Math.round((revenue / totalRevenue) * 100);
    const avgJobValue = Math.round(revenue / jobs);

    return `
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:12px 15px;font-weight:500">${svc}</td>
        <td style="padding:12px 15px;text-align:right">${formatCurrency(revenue)}</td>
        <td style="padding:12px 15px;text-align:right;color:var(--text-muted)">${pct}%</td>
        <td style="padding:12px 15px;text-align:right">${jobs}</td>
        <td style="padding:12px 15px;text-align:right">${formatCurrency(avgJobValue)}</td>
      </tr>
    `;
  }).join('');
}

function renderCustomerMetrics(data) {
  const { customers } = data;
  const segments = calculateCustomerSegments(customers);

  const tbody = document.getElementById('customer-tbody');
  tbody.innerHTML = `
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:12px 15px;font-weight:500">High Value (≥$2k)</td>
      <td style="padding:12px 15px;text-align:right">${segments.highValue.count}</td>
      <td style="padding:12px 15px;text-align:right">${formatCurrency(segments.highValue.totalRevenue)}</td>
      <td style="padding:12px 15px;text-align:right">${formatCurrency(segments.highValue.avgSpend)}</td>
      <td style="padding:12px 15px;text-align:right">${segments.highValue.avgFrequency}x</td>
    </tr>
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:12px 15px;font-weight:500">Mid Value ($1k–$2k)</td>
      <td style="padding:12px 15px;text-align:right">${segments.midValue.count}</td>
      <td style="padding:12px 15px;text-align:right">${formatCurrency(segments.midValue.totalRevenue)}</td>
      <td style="padding:12px 15px;text-align:right">${formatCurrency(segments.midValue.avgSpend)}</td>
      <td style="padding:12px 15px;text-align:right">${segments.midValue.avgFrequency}x</td>
    </tr>
    <tr style="border-bottom:1px solid #f3f4f6">
      <td style="padding:12px 15px;font-weight:500">Low Value (<$1k)</td>
      <td style="padding:12px 15px;text-align:right">${segments.lowValue.count}</td>
      <td style="padding:12px 15px;text-align:right">${formatCurrency(segments.lowValue.totalRevenue)}</td>
      <td style="padding:12px 15px;text-align:right">${formatCurrency(segments.lowValue.avgSpend)}</td>
      <td style="padding:12px 15px;text-align:right">${segments.lowValue.avgFrequency}x</td>
    </tr>
  `;
}

function renderMonthlyComparison(data) {
  const { revenueHistory } = data;
  const comparison = calculateMonthlyComparison(revenueHistory);

  const tbody = document.getElementById('monthly-tbody');
  tbody.innerHTML = comparison.map((m, i) => {
    const trend = getMonthGrowth(m.growth);
    const color = getTrendColor(m.growth);
    const growthDisplay = m.growth !== 0 ? `${m.growth > 0 ? '+' : ''}${m.growth}%` : '—';

    return `
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:12px 15px;font-weight:500">${m.month}</td>
        <td style="padding:12px 15px;text-align:right">${formatCurrency(m.amount)}</td>
        <td style="padding:12px 15px;text-align:right;color:${color}">${growthDisplay}</td>
        <td style="padding:12px 15px;text-align:right;color:${color};font-weight:600">${trend}</td>
      </tr>
    `;
  }).join('');
}

/* === INIT === */

async function init() {
  const res = await fetch('data/demo.json');
  allData = await res.json();

  renderKPIs(allData);
  renderAlerts(allData);
  renderTrendChart(allData);
  renderTopServices(allData);
  renderServiceProfitability(allData);
  renderCustomerMetrics(allData);
  renderMonthlyComparison(allData);
}

document.addEventListener('DOMContentLoaded', init);
