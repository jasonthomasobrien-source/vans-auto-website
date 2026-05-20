# SERVICES.md — Services & Pricing

This file defines the services shown on the website. Update prices and descriptions to match the shop's actual offerings, then apply changes to the services grid in `index.html`.

---

## Service Cards (shown on website)

Each card has: **Icon** | **Title** | **Short Description** | **Price Range**

| # | Icon (Font Awesome) | Title                | Description                                                    | Price Range       |
|---|---------------------|----------------------|----------------------------------------------------------------|-------------------|
| 1 | `fa-oil-can`        | Oil Change           | Full synthetic, conventional, or high-mileage oil change with filter replacement. | From $49          |
| 2 | `fa-car-burst`      | Brake Service        | Brake pad replacement, rotor resurfacing or replacement, brake fluid flush.        | From $149/axle    |
| 3 | `fa-tire`           | Tire Services        | Mount & balance, rotation, flat repair, TPMS reset.                               | From $20/tire     |
| 4 | `fa-engine`         | Engine Diagnostics   | Check engine light scan, full diagnostic report, no-charge estimate.               | Free estimate     |
| 5 | `fa-snowflake`      | A/C & Heating        | Refrigerant recharge, compressor, heater core, cabin air filter replacement.       | From $89          |
| 6 | `fa-battery-full`   | Battery & Electrical | Battery test and replacement, alternator, starter, wiring diagnosis.               | From $129         |
| 7 | `fa-wrench`         | Suspension & Steering| Shocks, struts, ball joints, tie rods, wheel alignment.                            | From $99          |
| 8 | `fa-gears`          | Transmission Service | Fluid change, filter replacement, full rebuild referrals.                          | From $149         |

---

## Extended Services (not on homepage but offered)

List these in a secondary "We also service:" section or a separate services page if desired.

- Timing belt / timing chain replacement
- Coolant system flush and repair
- Fuel system cleaning
- Pre-purchase vehicle inspection
- State emissions testing (if applicable in MI)
- Fleet vehicle maintenance
- Towing arrangement (partner referral)

---

## Pricing Notes

- All prices are **starting prices** — final cost depends on vehicle make/model and parts required
- **Free estimates** on all work before any repair is started
- **Warranty:** 12 months / 12,000 miles on parts and labor (update if different)
- Accepts: Cash, all major credit cards, Apple Pay, financing available through Snap Finance

---

## Updating Services in index.html

Each service card in `index.html` follows this pattern:

```html
<div class="service-card">
  <div class="service-icon">
    <i class="fas fa-oil-can"></i>
  </div>
  <h3>Oil Change</h3>
  <p>Full synthetic, conventional, or high-mileage oil change with filter replacement.</p>
  <span class="service-price">From $49</span>
</div>
```

To add a new service, copy this block and update the icon class, heading, description, and price. Find the full list of Font Awesome icons at https://fontawesome.com/icons.
