# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Van's Auto Repair — Website Project

## Project Overview

This is a production-ready website for Van's Auto Repair, a trusted local mechanic shop in Kalamazoo, MI. The site establishes an online presence designed to drive phone calls, appointment requests, and showcase the shop's 4.8★ Google rating and 71 customer reviews. Built with vanilla HTML/CSS/JS as a single-file site for easy handoff and deployment.

**Current Status:** Near production-ready. Update phone, email, address, and Google Maps embed before going live.

---

## File Structure

```
/
├── CLAUDE.md          ← You are here. Project documentation and AI guidance.
├── CONTENT.md         ← All editable text copy (name, phone, hours, taglines, reviews)
├── SERVICES.md        ← Services list with pricing placeholders
└── index.html         ← The entire website (single-file, self-contained)
```

---

## Tech Stack

| Layer      | Choice                          | Why                                      |
|------------|---------------------------------|------------------------------------------|
| HTML/CSS/JS | Vanilla, single file           | Zero build step, easy to hand off        |
| Styling    | Custom CSS with CSS variables   | Lightweight, no framework dependency     |
| Icons      | Font Awesome 6 (CDN)            | Free, widely recognized icon set        |
| Fonts      | Google Fonts — Inter + Oswald   | Clean, professional, fast loading        |
| Forms      | HTML5 native + JS validation    | Works without a backend; easy to wire up |

No frameworks, no build tools, no npm. The file opens directly in any browser.

---

## Development Workflow

### Quick Start

1. Open `index.html` directly in a browser — no build step required
2. Edit `CONTENT.md` for copy changes, then apply to `index.html`
3. Edit `SERVICES.md` for service/pricing changes, then sync to the services grid
4. Test in browser: reload the page to see changes immediately

### Updating Copy

**Always edit `CONTENT.md` first**, then apply changes to `index.html`:
- Business name, phone, address, hours
- Hero section headline and taglines
- Google reviews (replace with real reviews)
- SEO meta tags and schema.org JSON-LD

Use find-and-replace in `index.html` to batch-update repeated values (e.g., shop name appears ~8 times).

### Updating Services

1. Modify the table in `SERVICES.md` (description, price, icon)
2. Find the corresponding service card in the `#services` grid in `index.html`
3. Update the `<i>` icon class, `<h3>` title, `<p>` description, and price span
4. Font Awesome icon classes: https://fontawesome.com/icons (search and copy the `fa-xxx` class)

### Testing

- **Desktop:** Test at 1440px width (primary breakpoint)
- **Tablet:** Test at 768px width (secondary breakpoint, nav collapses to mobile menu)
- **Mobile:** Test at 375px width (minimum supported width)
- **Forms:** Test appointment form validation and success state
- **Navigation:** Click all links; verify smooth scroll anchors work
- **Maps:** After adding real Google Maps embed, verify iframe loads and is interactive

### When Deploying

Before handing off to the client or going live:
1. Replace all `PLACEHOLDER` values in `index.html` with real business data
2. Update Google Maps embed (instructions in `CONTENT.md`)
3. Connect the form backend (Formspree, Netlify Forms, or custom; see "Going Live" section)
4. Update SEO meta tags and schema.org JSON-LD with real NAP (Name, Address, Phone)
5. Test form submission end-to-end

---

## Sections

### 1. Hero
- Full-width banner with shop name, tagline, and two CTAs: **Call Now** and **Book Appointment**
- Background uses a dark overlay on an auto-shop themed gradient
- Immediately communicates credibility (years in business, review count)

### 2. Services
- Grid of service cards with icons, short descriptions, and pricing ranges
- Edit services in [`SERVICES.md`](./SERVICES.md), then update `index.html` to match
- Designed to be scannable on mobile in under 5 seconds

### 3. Scheduling Form
- Fields: Name, Phone, Email, Vehicle (Year/Make/Model), Service needed, Preferred date/time, Notes
- Client-side validation with friendly error messages
- On submit: shows a confirmation message (no backend required for demo; see "Going Live" below)

### 4. Reviews / Testimonials
- 5-star Google-style review cards with reviewer name, date, and quote
- Review content pulled from [`CONTENT.md`](./CONTENT.md) — replace with real reviews before launch
- "Read all reviews on Google" CTA button

### 5. About + Contact
- Shop story paragraph, trust badges (ASE certified, etc.)
- Hours of operation table
- Address, phone, email
- Embedded Google Maps iframe placeholder (see "Going Live" below)

---

## Design System

### Colors (defined as CSS variables in `index.html`)
| Variable              | Value     | Usage                        |
|-----------------------|-----------|------------------------------|
| `--color-primary`     | `#1a1a2e` | Dark navy — headers, footer  |
| `--color-accent`      | `#e63946` | Red — CTAs, highlights       |
| `--color-accent-dark` | `#c1121f` | Hover state for red elements |
| `--color-surface`     | `#f8f9fa` | Light gray — card backgrounds |
| `--color-text`        | `#212529` | Body text                    |
| `--color-muted`       | `#6c757d` | Secondary text               |

To rebrand, change only the CSS variable values at the top of `index.html`.

### Typography
- **Headings**: Oswald (bold, all-caps feel — strong auto-shop identity)
- **Body**: Inter (clean, readable at small sizes)

---

## Replacing Placeholder Content

All business-specific content is documented in [`CONTENT.md`](./CONTENT.md). Before handing off to the client:

1. Replace every instance of **"Kalamazoo Auto Care"** with the real shop name
2. Update phone number (currently `(269) 555-0147`)
3. Update address (currently `1842 Portage St, Kalamazoo, MI 49001`)
4. Update hours of operation
5. Replace placeholder reviews with real Google reviews
6. Replace services/pricing with actual offerings from [`SERVICES.md`](./SERVICES.md)
7. Add real Google Maps embed URL (instructions in [`CONTENT.md`](./CONTENT.md))

Run a find-and-replace for `PLACEHOLDER` in `index.html` to catch anything missed.

---

## Going Live Checklist

### Scheduling Form Backend
The demo form shows a success message on submit but does not send data anywhere. To make it functional:

- **Option A (easiest):** Use [Formspree](https://formspree.io) — add `action="https://formspree.io/f/YOUR_ID"` to the `<form>` tag, free tier handles 50 submissions/month
- **Option B:** Use [Netlify Forms](https://www.netlify.com/products/forms/) if hosting on Netlify — add `data-netlify="true"` to the `<form>` tag
- **Option C:** Wire up a simple email-sending backend (Node/Express or serverless function)

### Google Maps Embed
Replace the map placeholder in the About section:
1. Go to [Google Maps](https://maps.google.com), search the shop address
2. Click Share → Embed a map → Copy the iframe `src` URL
3. Paste it into `index.html` where noted with the comment `<!-- GOOGLE MAPS EMBED -->`

### Hosting Options
| Option     | Cost   | Complexity | Best for                         |
|------------|--------|------------|----------------------------------|
| Netlify    | Free   | Low        | Static sites, easy drag-and-drop |
| GitHub Pages | Free | Low        | If client is comfortable with Git |
| GoDaddy    | ~$10/mo | Low       | If client already has a domain there |
| Bluehost   | ~$5/mo | Low        | Full hosting + email             |

### Domain
Register `kalamazooautocare.com` (or the real shop name equivalent) via Namecheap or GoDaddy. Expect ~$12/year.

---

## SEO

The following meta tags are pre-configured in `index.html`:
- `<title>` — includes shop name + "Kalamazoo MI"
- `<meta name="description">` — 155-character summary with local keywords
- Open Graph tags for social sharing
- Schema.org `LocalBusiness` JSON-LD structured data block — update with real NAP (Name, Address, Phone)

---

## Accessibility

- All images have `alt` attributes
- Color contrast meets WCAG AA for body text
- Form fields have associated `<label>` elements
- Focus states are visible on all interactive elements
- Mobile-first responsive layout (tested down to 375px)

---

## CSS Architecture

The stylesheet is organized into logical sections (marked by `/* ============ */` comments):

1. **CSS Variables** (line ~44) — Edit here to rebrand (colors, fonts, spacing, shadows)
2. **Reset & Base** (line ~64) — Global resets and typography baseline
3. **Utility** (line ~79) — `.container`, `.btn`, `.section-title`, `.accent-line`
4. **Sticky Header / Nav** (line ~145) — Navigation bar with mobile toggle
5. **Top Bar** (line ~230) — Info strip above header (hours, phone, address)
6. **Hero** (line ~253) — Hero section with stats and trust cards
7. **Services** (line ~378) — Service cards grid
8. **Why Us** (line ~443) — Benefit strip with 4 columns
9. **Scheduling Form** (line ~471) — Appointment booking form
10. **Reviews** (line ~595) — Review cards and aggregate rating
11. **About** (line ~675) — Shop bio, trust badges, contact details, map
12. **Footer** (line ~761) — Footer with links and contact info
13. **Scroll to Top** (line ~807) — Fixed button that appears on scroll

**Spacing convention:** Sections use consistent `padding: 80px 0` (except thin strips like "Why Us" which use `56px 0`).

## JavaScript Behavior

Small inline `<script>` block (line ~1334) handles:
- Mobile nav toggle (hamburger menu)
- Date picker min-date constraint (today onwards)
- Hours table highlighting (bolds current day)
- Form validation with live error states
- Form success message display
- Scroll-to-top button visibility

All JS is vanilla (no jQuery, no frameworks). Form validation uses regex patterns for phone and email.

## Common Modification Patterns

### Rebrand (Colors, Fonts, Shop Name)

1. Edit CSS variables at top of `<style>` block for colors
2. Use find-and-replace for shop name across `index.html` (~8 instances)
3. Update `CONTENT.md` with new identity

**Don't edit individual CSS rules** for color — always change the variable (`--color-accent`, `--color-primary`, etc.) so changes propagate everywhere.

### Add or Modify a Section

Example: Add a "Gallery" section:
1. Insert a new `<section id="gallery">` after the services section
2. Follow the existing pattern: `.container` → section header → content grid
3. Use the same spacing (`padding: 80px 0`), colors, and typography classes
4. Add a nav link in the sticky header pointing to `#gallery`

### Update the Contact Details

The contact card in `#about` has three places to update simultaneously:
- Address link (line ~1247): `href="https://maps.google.com/?q=..."`
- Phone link: `href="tel:+1..."`
- Email link: `href="mailto:..."`
- Hours table rows: `id="hour-mon"` through `id="hour-sun"`

Use find-and-replace carefully to catch all instances.

### Connect the Appointment Form

The form currently shows a success message but doesn't send data. To make it live:

**Option A (Simplest): Formspree**
```html
<form id="appointment-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```
Then remove the JavaScript form handler (lines ~1361–1400) or leave it for local demo testing.

**Option B: Netlify Forms (if hosting on Netlify)**
Add `data-netlify="true"` to the `<form>` tag. Keep the JS handler for instant success feedback.

**Option C: Custom backend**
Wire up the form `action` to your own endpoint (Node, serverless, etc.) and handle validation server-side.

## AI Guidance (for Claude)

When asked to modify this project:

- **Adding a service:** Add a card to the `#services` grid in `index.html`, and add the entry to `SERVICES.md`
- **Changing copy:** Edit `CONTENT.md` first, then apply changes to `index.html`
- **Restyling:** Modify only the CSS variables block at the top of `<style>` before touching individual rules
- **Adding a page:** This is a single-page site with anchor navigation. If multi-page is needed, split into `index.html`, `services.html`, `contact.html` and update the nav links
- **Adding a gallery:** Add a `#gallery` section after `#services`, using a CSS grid of `<img>` tags. Source images from Unsplash using `/auto+mechanic` as the search path
- **Backend integration:** See "Connect the Appointment Form" above

Keep the single-file constraint unless explicitly asked to split it. The client should be able to email this file to someone and have it work.

## Code Conventions

- **No minification:** Keep HTML/CSS/JS readable for client handoff
- **Semantic HTML:** Use `<section>`, `<header>`, `<footer>`, `<article>` tags; avoid generic `<div>` wrappers
- **Accessibility:** All images have `alt` text; form labels are associated with inputs; color contrast meets WCAG AA
- **Mobile-first:** Use `@media (max-width: 768px)` and `@media (max-width: 900px)` for responsive adjustments
- **Icons:** Font Awesome 6 via CDN — don't add inline SVGs unless unavoidable
