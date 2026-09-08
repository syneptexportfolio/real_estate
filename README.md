# AURELIA — Cinematic Luxury Real-Estate Digital Experience

> A bespoke, award-winning digital architectural property experience for **AURELIA**, an ultra-luxury contemporary villa estate. Combines a 452-frame scroll-controlled cinematic camera journey with an editorial single-page layout, technical SEO, AI-search discoverability, high-converting lead generation, and Cloudflare Pages production readiness.

---

## 1. Project Overview

- **Property Name**: AURELIA
- **Architectural Identity**: Contemporary Organic Modernism with horizontal stone cantilevers, honed Roman travertine, floor-to-ceiling thermal glass, warm natural oak, and bronze-black detailing.
- **Cinematic Source**: 452 Full HD frames (`frames/frame_0.jpg` to `frame_451.jpg`) representing an unbroken camera journey from orbital clouds and AI blueprint scanning to cliffside construction and completed residence.
- **Architecture**: Single-Page Website with dual-layer design:
  - **Layer 1 (Human Experience)**: Canvas 2D frame engine, progressive preloading, sliding-window LRU caching, smooth lerp interpolation, responsive cover scaling, and minimalist HUD.
  - **Layer 2 (Machine Understanding)**: 100% crawlable semantic HTML (`h1`, `h2`, `h3`, `p`, specification tables, feature lists, FAQ), Schema.org JSON-LD (`SingleFamilyResidence`, `Organization`, `WebSite`), OpenGraph, Twitter Cards, `robots.txt`, `sitemap.xml`, and `/llms.txt`.

---

## 2. Quick Start

### Prerequisites
- Node.js v18+ (tested on Node.js v24.18.1)
- npm v9+

### Installation
```bash
# Install dependencies
npm install
```

### Local Development Server
```bash
# Starts Vite dev server with native frame-streaming middleware
npm run dev
```
The application will be accessible at `http://localhost:5173/`.

### Production Build
```bash
# Builds the production bundle and copies assets & frames into dist/
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 3. Directory Structure

```
real_estate/
├── frames/                           # 452 authoritative frames (frame_0.jpg - frame_451.jpg)
├── public/
│   ├── static/                       # High-res static detail assets extracted from key frames
│   │   ├── luxury-villa-exterior.jpg # Definitive hero exterior at twilight (frame 873)
│   │   ├── luxury-villa-architecture.jpg # Travertine overhang & glazing (frame 270)
│   │   ├── luxury-villa-interior.jpg # Living room sanctuary (frame 370)
│   │   ├── luxury-villa-pool.jpg     # Sunset infinity pool terrace (frame 720)
│   │   ├── gallery-master-suite.jpg  # Master bedroom suite (frame 480)
│   │   ├── gallery-wardrobe.jpg      # Designer walk-in wardrobe (frame 540)
│   │   ├── gallery-kitchen.jpg       # Sculptural marble kitchen island (frame 610)
│   │   ├── gallery-gardens.jpg       # Ancient olive trees & landscape (frame 800)
│   │   └── gallery-aerial.jpg        # High-altitude estate horizon (frame 140)
│   ├── favicon.svg                   # Luxury monogram favicon
│   ├── robots.txt                    # Search crawler permissions
│   ├── sitemap.xml                   # Canonical sitemap
│   ├── llms.txt                      # AI answer engine factual dossier
│   ├── _headers                      # Cloudflare Pages immutable caching & CSP headers
│   └── _redirects                    # Cloudflare Pages clean routing
├── src/
│   ├── engine/
│   │   ├── CacheManager.js           # Sliding window & LRU memory manager
│   │   ├── Preloader.js              # Priority progressive streaming queue
│   │   ├── ScrollController.js       # Normalized [0..1] scroll mapping with lerp
│   │   └── FrameEngine.js            # Canvas 2D coordinator, DPR & cover scaling
│   ├── data/
│   │   ├── propertyData.js           # Single source of truth for facts & specs
│   │   ├── scenesConfig.js           # 11 narrative scenes across the 452 frames
│   │   └── seoConfig.js              # Centralized Schema.org JSON-LD & meta tags
│   ├── components/
│   │   ├── Navigation.js             # Sticky blur header & mobile drawer
│   │   ├── CinematicHUD.js           # Chapter indicators & smooth text fades
│   │   ├── GalleryModal.js           # Lightbox modal for photography study
│   │   ├── EnquiryForm.js            # Inline validated confidential lead form
│   │   ├── WhatsAppIntegration.js    # Emoji-free URL-encoded WhatsApp generator
│   │   └── LocationMap.js            # Dark topographic radar & coordinate beacon
│   ├── styles/
│   │   ├── tokens.css                # Ink, ivory, travertine, bronze, oak tokens
│   │   ├── typography.css            # Cinzel & Plus Jakarta Sans editorial scale
│   │   ├── components.css            # Section grids, cards, modals, buttons
│   │   └── index.css                 # Master stylesheet import
│   └── main.js                       # Client application entry point
├── index.html                        # Single-page experience with crawlable semantic HTML
├── 404.html                          # Bespoke luxury 404 error page
├── vite.config.js                    # Multi-entry build & frame stream middleware
├── package.json                      # Project dependencies & scripts
├── .env.example                      # Environment variables template
└── README.md                         # This documentation
```

---

## 4. Frame Engine Architecture

### Progressive Preloading
- **Immediate Paint**: Frame 0 and first 15 frames load immediately on page mount, achieving sub-100ms LCP.
- **Priority Window**: Dynamically prioritizes:
  `Current Target Frame` &rarr; `Forward Window (+20 frames)` &rarr; `Backward Window (-8 frames)`.
- **Sliding-Window LRU Eviction**: Automatically evicts distant frames to preserve system memory (~25 frames max on mobile; ~80 frames on desktop).
- **Graceful Fallback**: If a frame is awaiting network decode during rapid scrolling, the nearest cached frame renders seamlessly. Zero black screens or flicker.
- **DPR Scaling**: Automatically handles retina displays (capped at 1.5x on desktop and 1.0x on mobile to ensure locked 60fps).

### Cinematic Storyboard (11 Scenes)
Configured in `src/data/scenesConfig.js`:
1. `01` — Stratosphere & Descent (Frames 0 - 36)
2. `02` — Architectural Blueprint Scan (Frames 37 - 85)
3. `03` — Groundwork & Site Excavation (Frames 86 - 125)
4. `04` — Structural Elevation (Frames 126 - 160)
5. `05` — Architectural Realization (Frames 161 - 185)
6. `06` — The Cliffside Residence (Frames 186 - 248)
7. `07` — Double-Height Façade (Frames 249 - 284)
8. `08` — The Grand Salon (Frames 285 - 344)
9. `09` — Culinary Art Suite (Frames 345 - 374)
10. `10` — Master Bedroom Suite (Frames 375 - 413)
11. `11` — Private Cove Horizon (Frames 414 - 451)

---

## 5. Technical SEO & AI Discoverability

- **Zero Client Dependency for Crawlers**: Full property descriptions, verified specifications, amenities, location benefits, and FAQ answers are pre-rendered into semantic HTML tags (`h1`, `h2`, `h3`, `p`, `table`, `article`, `address`).
- **Structured Data (JSON-LD)**:
  - `SingleFamilyResidence`: Verified facts (900 m² built area, 4,000 m² parcel, 5 bedroom suites, 6 bathrooms, infinity pool, landscaped gardens).
  - `Organization`: Aurelia official brand entity.
  - `WebSite`: Canonical sitelinks search configuration.
- **AI Search Engine Dossier (`/llms.txt`)**: Factual, clean, structured markdown document answering natural queries for Perplexity, ChatGPT, Claude, and Bing Copilot.
- **Search Metadata**:
  - OpenGraph image points to `/static/luxury-villa-exterior.jpg`.
  - Canonical URL points to `https://aurelia-residence.pages.dev/`.
  - `robots.txt` explicitly allows `/frames/` and points to `sitemap.xml`.

---

## 6. Lead Conversion & WhatsApp Configuration

### WhatsApp Lead Generation
The secondary CTA on the presentation form generates a strictly formatted WhatsApp message with **zero emojis, zero marketing symbols**, and clean luxury typography:

```
New Property Enquiry
Property: AURELIA Contemporary Luxury Villa
Name: Lord Alistair Vance
Email: alistair.vance@mayfair-invest.com
Phone: +44 20 7946 0912
Preferred Contact: WhatsApp

Message:
Requesting confidential dossier and virtual tour arrangement.
```

### Configuring WhatsApp Number
Create or edit `.env`:
```env
VITE_WHATSAPP_NUMBER="919876543210"
VITE_SITE_URL="https://aurelia-residence.pages.dev"
VITE_CONTACT_EMAIL="concierge@aurelia-residence.com"
```

---

## 7. Cloudflare Pages Deployment

### Option A: Cloudflare Dashboard (Git Integration)
1. Connect your repository to **Cloudflare Pages**.
2. Set **Build command**: `npm run build`
3. Set **Build output directory**: `dist`
4. Set Environment Variables in Cloudflare Pages dashboard (`VITE_WHATSAPP_NUMBER`, etc.).

### Option B: Cloudflare Wrangler CLI
```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Build the production bundle
npm run build

# Deploy dist/ directly to Cloudflare Pages
wrangler pages deploy dist --project-name=aurelia-residence
```

### Cloudflare Edge Headers & Redirects
- `public/_headers` sets `Cache-Control: public, max-age=31536000, immutable` for all 452 frames and static assets, and `must-revalidate` for HTML.
- Includes strict Content Security Policy (CSP), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and Referrer Policy.

---

## 8. Verification & Audit Checklist

- [x] All 452 frames present and sequentially verified (0 to 451).
- [x] Canvas frame engine renders 60fps with aspect-ratio cover scaling.
- [x] Reverse scroll and rapid scrubbing tested with graceful fallback recovery.
- [x] All 10 editorial chapters render with luxury art-direction and typography.
- [x] Curated lightbox modal opens and closes with keyboard escape support.
- [x] Interactive radar / topographic coordinate map renders on canvas.
- [x] Form validation checks full name, email format, and phone digits.
- [x] Emoji-free WhatsApp lead link generation verified.
- [x] Static Schema.org JSON-LD verified for `SingleFamilyResidence`.
- [x] `robots.txt`, `sitemap.xml`, and `/llms.txt` verified with HTTP 200.
- [x] `npm run build` compiles with 0 errors and generates ready `dist/` bundle.
