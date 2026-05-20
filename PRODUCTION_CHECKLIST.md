# Van's Auto Repair — Production Checklist

## ✅ Completed (Production-Ready)

- [x] Business branding (Van's Auto Repair)
- [x] Real phone number: **(269) 349-4544**
- [x] Real email: **vansautorepair@yahoo.com**
- [x] Real address: **5716 D Ave W, Kalamazoo, MI 49009**
- [x] Real hours: **Wed–Fri 8am–5pm, Sat 9am–1pm (Closed Sun–Tue)**
- [x] Google rating & reviews: **4.8★ · 71 reviews**
- [x] Google Maps embed (localized to real address)
- [x] All internal links tested (nav, buttons, CTA)
- [x] SEO meta tags updated
- [x] Schema.org JSON-LD structured data (correct rating & review count)
- [x] Responsive design verified (desktop, tablet, mobile)

---

## 📋 Before Going Live

### 1. **Deploy**
Choose one hosting option:
- **Netlify** (recommended): Drag-and-drop deploy, auto-HTTPS, form support
  - 1. Create account at netlify.com
  - 2. Drag `index.html` into Netlify
  - 3. Connect to custom domain in Netlify settings
  
- **GitHub Pages**: Free, simple
  - 1. Create repo, push `index.html`
  - 2. Enable GitHub Pages in Settings
  - 3. Connect custom domain

- **GoDaddy / Bluehost**: If client already has hosting

### 2. **Form Submission Backend** (Optional)
The appointment form currently shows a success message but doesn't save data.

To make it functional:

**Option A: Formspree (Easiest)**
```html
<!-- In the <form> tag, change from: -->
<form id="appointment-form" novalidate>

<!-- To: -->
<form id="appointment-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
```
- 1. Sign up at formspree.io (free tier: 50 submissions/month)
- 2. Create form, copy your Form ID
- 3. Paste into the `action` attribute above
- 4. Remove the JavaScript submit handler (lines 1361–1400) or keep it for instant feedback

**Option B: Netlify Forms (if using Netlify)**
- 1. Add `netlify` attribute to the form tag
- 2. Deploy to Netlify
- 3. Submissions appear in Netlify dashboard automatically

**Option C: Keep as-is**
- Form shows success message but doesn't send data
- Customer must call to actually book (which many prefer)

### 3. **Google Business Profile**
- If not already claimed, claim the Google Business Profile for Van's Auto Repair
- Verify the address and phone match the website
- Keep Google reviews link current (currently links to Google search results)

### 4. **Domain Setup**
- Register domain (if not done): vansautorepair.com or similar
- Point DNS to hosting provider
- Set up SSL/HTTPS (automatic with Netlify/GitHub Pages)

### 5. **Final Testing**

**Desktop (1440px)**
- [ ] All sections render correctly
- [ ] Navigation works (sticky header, all links)
- [ ] Forms validate (test with invalid data)
- [ ] Google Maps loads and is interactive

**Tablet (768px)**
- [ ] Hamburger menu appears
- [ ] Layout responsive
- [ ] Form elements readable

**Mobile (375px)**
- [ ] No horizontal overflow
- [ ] Touch targets are adequate (buttons 44px+)
- [ ] Images load correctly

**Cross-browser**
- [ ] Chrome ✓
- [ ] Safari ✓
- [ ] Firefox ✓
- [ ] Edge ✓

### 6. **Analytics (Optional)**
Add Google Analytics to track visits:
```html
<!-- Add before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR_ID');
</script>
```

---

## 🚀 Go-Live Checklist

- [ ] Domain registered and DNS updated
- [ ] Hosting deployed (Netlify/GitHub Pages/other)
- [ ] SSL/HTTPS working
- [ ] All contact info verified in person with Van
- [ ] Form backend connected (or decision made to not connect)
- [ ] Mobile-responsive testing complete
- [ ] Google Maps loading from real location
- [ ] Google Business Profile claimed and verified
- [ ] Internal team trained on form submission workflow (if forms are enabled)

---

## 📊 Future Enhancements (Not Critical)

- Real customer reviews from Google (instead of placeholder reviews)
- Before/after gallery with shop photos
- Instagram feed integration
- Live appointment scheduling (Calendar or Acuity Scheduling)
- Blog/FAQ section
- Mobile app push notifications

---

## 📞 Contact & Support

**Website Questions:**
- Email: vansautorepair@yahoo.com
- Phone: (269) 349-4544
- Address: 5716 D Ave W, Kalamazoo, MI 49009

**For code changes or updates:**
Refer to CLAUDE.md for developer guidance on common modifications.
