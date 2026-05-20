// Run with: node dashboard/tests/data.test.js

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
function revenueChangePct(current, previous) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

let passed = 0, failed = 0;
function assert(desc, actual, expected) {
  if (actual === expected) { console.log(`✓ ${desc}`); passed++; }
  else { console.error(`✗ ${desc}\n  Expected: ${expected}\n  Got:      ${actual}`); failed++; }
}

assert('formatCurrency whole number', formatCurrency(24180), '$24,180');
assert('formatCurrency zero', formatCurrency(0), '$0');
assert('revenueChangePct increase', revenueChangePct(24180, 21450), 13);
assert('revenueChangePct decrease', revenueChangePct(18000, 20000), -10);
assert('revenueChangePct no change', revenueChangePct(21450, 21450), 0);

// Customer search filter
function filterCustomers(customers, query) {
  if (!query) return customers;
  const q = query.toLowerCase();
  return customers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.vehicle.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q)
  );
}

// Customer due-for-service check
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 180;
function isDueForService(lastVisit, referenceDate) {
  return (referenceDate - new Date(lastVisit).getTime()) > SIX_MONTHS_MS;
}

const testCustomers = [
  { id: 1, name: 'Randy Kowalski', vehicle: '2019 Chevy Silverado', email: 'randy.k@email.com', lastVisit: '2026-05-18' },
  { id: 2, name: 'Bill Nowak', vehicle: '2016 Dodge Ram', email: 'billnowak@yahoo.com', lastVisit: '2025-10-30' },
  { id: 3, name: 'Greg Tuttle', vehicle: '2014 Chevy Impala', email: 'greg@yahoo.com', lastVisit: '2024-11-01' },
];

const now = new Date('2026-05-20').getTime();
assert('filterCustomers by name', filterCustomers(testCustomers, 'randy').length, 1);
assert('filterCustomers by vehicle', filterCustomers(testCustomers, 'chevy').length, 2);
assert('filterCustomers empty query returns all', filterCustomers(testCustomers, '').length, 3);
assert('filterCustomers no match returns empty', filterCustomers(testCustomers, 'zzz').length, 0);
assert('isDueForService — recent visit is NOT due', isDueForService('2026-05-18', now), false);
assert('isDueForService — 18 months ago IS due', isDueForService('2024-11-01', now), true);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
