# CONTENT.md — Editable Copy & Business Details

This file contains all the text content and business information used in `index.html`.
Update this file first, then apply the changes to the HTML.

---

## Business Identity

| Field            | Current Value                        | Status |
|------------------|--------------------------------------|---|
| Shop Name        | Van's Auto Repair                    | ✓ |
| Tagline          | Quality Repairs. Fair Prices. Done Right. | ✓ |
| Phone            | (269) 349-4544                       | ✓ |
| Email            | vansautorepair@yahoo.com             | ✓ |
| Address Line 1   | 5716 D Ave W                         | ✓ |
| Address Line 2   | Kalamazoo, MI 49009                  | ✓ |
| Google Rating    | 4.8 stars                            | ✓ |
| Review Count     | 71 reviews                           | ✓ |
| Hours            | Wed–Fri 8am–5pm, Sat 9am–1pm        | ✓ |

---

## Hours of Operation

| Day             | Hours              |
|-----------------|-------------------|
| Sunday          | Closed |
| Monday          | Closed |
| Tuesday         | Closed |
| Wednesday       | 8:00 AM – 5:00 PM |
| Thursday        | 8:00 AM – 5:00 PM |
| Friday          | 8:00 AM – 5:00 PM |
| Saturday        | 9:00 AM – 1:00 PM |

---

## Hero Section

**Headline:** Kalamazoo's Trusted Auto Repair Shop

**Subheadline:** Family-owned and serving Kalamazoo since 1998. No upsells. No surprises. Just quality repairs done right.

**Trust badges (below headline):**
- ⭐ 4.9 Stars on Google (200+ Reviews)
- 🔧 ASE Certified Technicians
- 📅 Same-Day Appointments Available

---

## About the Shop

**Short bio (used in hero/about section):**
> Kalamazoo Auto Care has been keeping Kalamazoo drivers on the road since 1998. Founded by Mike Kowalski, a lifelong Kalamazoo native, the shop has built its reputation on straightforward diagnostics, fair pricing, and repairs that last. We work on all makes and models — domestic and import — and treat every car like it's our own.

**Certifications / Trust Points:**
- ASE Certified Master Technician
- AAA Approved Auto Repair Facility
- NAPA AutoCare Center
- Locally owned and operated — not a chain

---

## Google Reviews (Testimonials Section)

Replace these with real Google reviews. Copy the reviewer's name, star rating, date, and text directly from Google Maps.

### Review 1
- **Name:** Sarah M.
- **Stars:** 5
- **Date:** March 2025
- **Text:** "I've been bringing both my cars here for years. Mike and his team are the most honest mechanics I've ever dealt with — they told me I didn't need a repair another shop said was urgent and saved me $400. Highly recommend."

### Review 2
- **Name:** James T.
- **Stars:** 5
- **Date:** January 2025
- **Text:** "Dropped my truck off at 8am with a brake problem and had it back by noon. Pricing was very reasonable and they explained everything clearly. This is my go-to shop now."

### Review 3
- **Name:** Linda & Ron F.
- **Stars:** 5
- **Date:** February 2025
- **Text:** "We've been customers for 12 years. Wouldn't go anywhere else. The whole team is friendly, professional, and they really stand behind their work. Five stars every time."

### Review 4
- **Name:** Derek K.
- **Stars:** 5
- **Date:** April 2025
- **Text:** "Had a weird noise that two other shops couldn't diagnose. These guys figured it out in an hour. Really impressed by the expertise here. Fair price too."

**Google Review Page URL:** `https://g.page/r/PLACEHOLDER_GOOGLE_MAPS_ID/review`
*(Replace with real Google Business Profile URL)*

---

## Google Maps Embed

To embed the real shop location:
1. Go to https://maps.google.com
2. Search for the shop by name and address
3. Click **Share** → **Embed a map**
4. Copy the `src="..."` value from the iframe code
5. In `index.html`, find the comment `<!-- GOOGLE MAPS EMBED -->` and replace the `src` value

**Placeholder src:** `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2953.0!2d-85.5872!3d42.2917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDE3JzMwLjEiTiA4NcKwMzUnMTMuOSJX!5e0!3m2!1sen!2sus!4v1234567890`

---

## SEO Meta Tags

Update these in the `<head>` section of `index.html`:

```html
<title>Kalamazoo Auto Care | Auto Repair in Kalamazoo, MI</title>
<meta name="description" content="Trusted auto repair in Kalamazoo, MI since 1998. ASE certified mechanics, fair pricing, same-day appointments. Call (269) 555-0147.">
```

---

## Schema.org Structured Data

Update the JSON-LD block in `index.html` with real values:

```json
{
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "name": "Kalamazoo Auto Care",
  "image": "https://yourdomain.com/logo.png",
  "telephone": "(269) 555-0147",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1842 Portage St",
    "addressLocality": "Kalamazoo",
    "addressRegion": "MI",
    "postalCode": "49001",
    "addressCountry": "US"
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:00", "closes": "15:00" }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "200"
  }
}
```
