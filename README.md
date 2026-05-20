# Van's Auto Repair — Professional Website

A modern, responsive website for Van's Auto Repair in Kalamazoo, MI. Built with vanilla HTML/CSS/JavaScript—no frameworks, no build tools, no dependencies.

## 🎯 What's Included

✅ **Single-file design** — `index.html` is the complete website  
✅ **Responsive** — Desktop, tablet, mobile (375px–1440px)  
✅ **Real business info** — Phone, email, address, hours, 4.8★ rating  
✅ **SEO optimized** — Meta tags, structured data (Schema.org)  
✅ **Appointment form** — Validated, ready to connect to backend  
✅ **Zero build step** — Opens directly in any browser  
✅ **Production-ready** — All content verified and finalized  

## 📋 Business Information

| Field | Value |
|-------|-------|
| **Name** | Van's Auto Repair |
| **Phone** | (269) 349-4544 |
| **Email** | vansautorepair@yahoo.com |
| **Address** | 5716 D Ave W, Kalamazoo, MI 49009 |
| **Hours** | Wed–Fri 8am–5pm, Sat 9am–1pm (Closed Sun–Tue) |
| **Rating** | 4.8★ (71 customer reviews) |

## 🚀 Getting Started

### Option 1: Deploy to Netlify (Recommended)
1. Create a [Netlify](https://netlify.com) account
2. Drag `index.html` into Netlify
3. Get a shareable link instantly (or connect custom domain)

### Option 2: Deploy to GitHub Pages
1. Create a GitHub repo
2. Upload `index.html`
3. Enable GitHub Pages in Settings
4. Access via your GitHub Pages URL or custom domain

### Option 3: Upload to Existing Host
Upload `index.html` to any web hosting provider via FTP or file manager.

## 📁 Files

- **`index.html`** — Complete website (do not split into multiple files)
- **`CONTENT.md`** — All editable copy (business info, reviews)
- **`SERVICES.md`** — Service cards, pricing, descriptions
- **`CLAUDE.md`** — Developer guide (CSS architecture, common edits)
- **`PRODUCTION_CHECKLIST.md`** — Pre-launch checklist, hosting options
- **`README.md`** — This file

## 🔧 Making Changes

### Update Business Info
1. Open `CONTENT.md`
2. Update phone, email, address, hours
3. Apply changes to `index.html` (use find-and-replace)

### Update Services
1. Edit service descriptions in `SERVICES.md`
2. Find the matching `<div class="service-card">` in `index.html`
3. Update icon, title, description, price

### Customize Colors
Open `index.html`, scroll to `<style>` section:
```css
:root {
  --color-primary:     #1a1a2e;  /* Dark navy */
  --color-accent:      #e63946;  /* Red */
  /* ... change these to rebrand ... */
}
```

**See `CLAUDE.md` for detailed architecture and modification guide.**

## 📱 Responsive Design

| Breakpoint | Use Case |
|------------|----------|
| **1440px** | Desktop (primary) |
| **900px** | Desktop → Tablet |
| **768px** | Tablet (nav collapses to hamburger menu) |
| **375px** | Mobile (minimum supported width) |

Test in browser DevTools at these widths to verify layout.

## 💻 Features

### Hero Section
- Badge with 4.8★ rating and 71 reviews
- Call-to-action buttons (Book Appointment, Call Now)
- Trust indicators with ASE certified badge

### Services Grid
- 8 service cards with icons, descriptions, pricing
- Hover effects with accent border animation
- Fully editable via SERVICES.md

### Appointment Form
- Client-side validation (name, phone, vehicle, service, date)
- Success message after submission
- Ready to connect to backend (Formspree, Netlify Forms, etc.)

### Reviews Section
- Aggregate rating (4.8★)
- Individual review cards with customer names
- Link to full Google reviews

### Contact & Map
- Google Maps embed (real location)
- Hours table (highlights current day)
- Contact details (phone, email, address)
- All clickable: phone dials, email opens client, address opens Maps

### Navigation
- Sticky header with logo
- Smooth scroll anchors
- Mobile hamburger menu
- Footer with quick links

## 🔐 Security & Performance

- **No external dependencies** — Only Font Awesome icons (from CDN)
- **No form backend embedded** — Connect your own safely
- **No user data stored** — Static HTML only
- **Fast loading** — Images optimized, CSS minimal
- **HTTPS ready** — Works on any modern hosting with SSL

## 📊 SEO

Pre-configured with:
- Meta title and description
- Open Graph tags (social sharing)
- Schema.org JSON-LD (LocalBusiness)
- Semantic HTML5
- Structured data (rating, review count, hours, address)

## 📝 Form Submissions

The appointment form currently shows a success message locally but doesn't send data.

To capture submissions, connect one of these backends:

### Formspree (Easiest)
1. Sign up at [formspree.io](https://formspree.io) (free)
2. Create new form, copy Form ID
3. In `index.html`, change:
```html
<form id="appointment-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
4. Remove JavaScript submit handler (lines ~1361–1400) or keep it for instant feedback

### Netlify Forms (if hosting on Netlify)
1. Add `data-netlify="true"` to form tag
2. Deploy to Netlify
3. Submissions appear in Netlify dashboard

### Custom Backend
Wire form action to your own email service or database.

## 📞 Support & Modifications

**For business info updates:**
Edit `CONTENT.md` and apply changes to `index.html`

**For code changes or new features:**
Refer to `CLAUDE.md` for architecture overview and `PRODUCTION_CHECKLIST.md` for deployment guide

**Contact Van's Auto Repair:**
- Phone: (269) 349-4544
- Email: vansautorepair@yahoo.com

## 📄 License

This website is created for Van's Auto Repair. Modify as needed for business operations.

---

**Website Status:** Production-ready  
**Last Updated:** May 19, 2026  
**Built with:** Vanilla HTML/CSS/JavaScript
# vans-auto-website
