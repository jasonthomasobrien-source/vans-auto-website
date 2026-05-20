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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
