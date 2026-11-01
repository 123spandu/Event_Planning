# Momentra Events — Website & Admin Dashboard

**We Plan. You Celebrate.** The website for Momentra Events, an event planning studio in Bengaluru.

```
momentra-events/
├── frontend/   React 18 + Vite + React Router + Lucide icons (public site + admin UI)
└── backend/    Node.js + Express + MySQL + JWT (enquiries, content management, admin auth)
```

## What's included

| Area | Details |
|---|---|
| Pages | Home, About Us, Services (10 services), Packages & Pricing, Gallery (filters + lightbox), Contact / Book an Event, 404 |
| Enquiry form | All 9 fields, client- and server-side validation, pre-fill from service/package buttons, honeypot spam check |
| WhatsApp | Floating button on every page with your pre-filled message; number comes from `.env` |
| Admin (`/admin`) | JWT login; enquiries with status workflow (New → Contacted → Quoted → Confirmed → Completed / Cancelled), quoted/final amounts, notes; revenue & pipeline overview; manage services, packages/prices, gallery uploads |
| SEO | Per-page titles & descriptions, Open Graph, canonical URLs, LocalBusiness JSON-LD, `robots.txt` (blocks `/admin`) |
| Performance | Self-hosted fonts, lazy-loaded images, admin code split from the public bundle |

### How we kept it honest
- **No made-up details.** Phone, email and Instagram come from environment variables. Anything you haven't set says "coming soon". It never shows a fake value.
- **No made-up reviews.** `frontend/src/data/testimonials.js` starts empty. Until you add real reviews, the site shows an honest "our story is just beginning" message.
- **Sample images are labelled.** Every placeholder photo has a **"Sample"** tag, and the gallery explains what that means.
- **Clear pricing.** Every price says "Starting from". The Packages page states that catering, venue and photography are *not included* unless your written quotation says so.
- **No false "booking confirmed" messages:**
  - **With the backend:** the success message (with a reference number) appears only after the enquiry is saved in MySQL. If saving fails, the customer sees an error and a "send via WhatsApp instead" option.
  - **Without the backend:** the form opens WhatsApp with the enquiry filled in. It tells the customer to tap *Send*, because the enquiry doesn't reach you until they do.

---

## 1. Run the frontend only (quickest)

You need Node.js 18 or later.

```bash
cd frontend
cp .env.example .env      # then set VITE_WHATSAPP_NUMBER etc.
npm install
npm run dev               # http://localhost:5173
```

If `VITE_API_URL` is empty, the site runs on its own. Enquiries go through WhatsApp, and the admin page explains that it needs the backend.

### Frontend environment variables (`frontend/.env`)
| Variable | Example | Purpose |
|---|---|---|
| `VITE_WHATSAPP_NUMBER` | `91XXXXXXXXXX` | Your WhatsApp Business number, digits only, with country code |
| `VITE_CONTACT_EMAIL` | `hello@yourdomain.in` | Shown on Contact page/footer |
| `VITE_INSTAGRAM_URL` | `https://www.instagram.com/yourhandle` | Instagram link |
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API; leave empty for WhatsApp-only mode |
| `VITE_SITE_URL` | `https://www.yourdomain.in` | Canonical / Open Graph URLs |

## 2. Run the full stack (backend + admin)

### a) Create the database (MySQL 8+ or MariaDB 10.5+)
```bash
mysql -u root -p < backend/database/schema.sql
```
```sql
-- then, in the MySQL shell, create an app user:
CREATE USER 'momentra'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT ALL PRIVILEGES ON momentra_events.* TO 'momentra'@'localhost';
FLUSH PRIVILEGES;
```

### b) Configure and start the API
```bash
cd backend
cp .env.example .env      # set DB_PASSWORD, JWT_SECRET, CORS_ORIGINS
npm install
npm run db:seed           # loads services, packages & sample gallery (skips non-empty tables)
npm run create-admin -- --email you@yourdomain.in --password "AtLeast10Chars" --name "Your Name"
npm run dev               # http://localhost:5000  (health check: /api/health)
```
Generate a JWT secret with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### c) Point the frontend at the API
Set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env`, then restart `npm run dev`. Sign in at **http://localhost:5173/admin/login**.

### Backend environment variables (`backend/.env`)
`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN` (default `8h`), `CORS_ORIGINS` (comma-separated frontend URLs). In production, the server refuses to start with a weak `JWT_SECRET`.

### API overview
| Method | Path | Auth |
|---|---|---|
| GET | `/api/services`, `/api/packages`, `/api/gallery` | public (active items only) |
| POST | `/api/enquiries` | public (validated; limited to 10 per 15 min per IP) |
| POST | `/api/auth/login` · GET `/api/auth/me` | login is rate-limited |
| GET | `/api/admin/stats` | admin JWT |
| GET/PATCH/DELETE | `/api/admin/enquiries[/:id]` | admin JWT |
| GET/POST/PUT/DELETE | `/api/admin/services[/:id]`, `/api/admin/packages[/:id]` | admin JWT |
| GET/POST/PATCH/DELETE | `/api/admin/gallery[/:id]` (multipart upload, JPG/PNG/WebP ≤ 5 MB) | admin JWT |

How customer data is protected: every `/api/admin/*` route needs a valid JWT. The admin UI is a separate code-split bundle, is set to `noindex`, and is blocked in `robots.txt`. The token is kept in `sessionStorage`, so it's cleared when the browser tab closes.

---

## Editing content

| What | Where |
|---|---|
| Business name, tagline, pricing disclaimer | `frontend/src/config/siteConfig.js` |
| Prices & package features | `frontend/src/data/packages.js` (or Admin → Packages once the backend is running) |
| Services text, inclusions, images | `frontend/src/data/services.js` (or Admin → Services) |
| Gallery | `frontend/src/data/gallery.js` (or Admin → Gallery uploads) |
| Photos | `frontend/src/data/images.js`: swap the sample Unsplash URLs for your own photos |
| Testimonials | `frontend/src/data/testimonials.js`: add genuine reviews only |
| Colours & fonts | design tokens at the top of `frontend/src/styles/global.css` |

When the backend is connected, the site loads services, packages and gallery from the database. If the API can't be reached, it falls back to the data files, so the public site keeps working.

If an image fails to load, the site shows a branded placeholder instead of a broken-image icon.

## Deployment

- **Frontend:** run `npm run build` in `frontend/` and deploy `dist/` to Netlify, Vercel, Cloudflare Pages or any static host. SPA routing rewrites are already included (`public/_redirects` and `vercel.json`). Set the `VITE_*` variables in the host's build settings.
- **Backend:** any Node host (Render, Railway, a VPS with PM2) plus a managed MySQL database. Run `npm start` with the `.env` values set as environment variables. Uploaded images are stored in `backend/uploads/`, so use a persistent disk (or swap the multer storage for S3 or Cloudinary later). Add your live frontend domain to `CORS_ORIGINS`.
- Serve both over HTTPS.
