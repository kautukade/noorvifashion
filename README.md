# ✦ NOORVI FASHION — Trending Girls Wear in Pusad

A cinematic, production-quality fashion website for **Noorvi Fashion / Noorvi Ladies Wear**,
Gold Plaza Complex, Sonar Line, Pusad, Maharashtra.

Built to feel like a premium national fashion brand — with a WhatsApp-first ordering flow,
an editorial lookbook, Instagram reels section, and a demo admin panel.

---

## Project Overview

- **Cinematic hero** with slow-zoom campaign imagery, floating parallax look cards, rotating monogram badge and mouse depth.
- **Just Dropped** product grid with hover image-swap, quick view, wishlist hearts and badges.
- **Shop Your Vibe** editorial category mosaic.
- **Made To Be Noticed** — a scroll-driven 3D parallax showcase.
- **Trending at Noorvi** — 9:16 reel-style cards.
- **Season film** section — a pinned, scroll-scaling cinematic reveal.
- **Offer banner** ("Fashion from ₹150*") + Under ₹299 / ₹499 price discovery cards.
- **Product detail pages** with gallery + zoom, colour/size selectors, live stock, accordions and **Order on WhatsApp**.
- **Shop page** with search, category/size/colour/price filters and sorting.
- **Full-screen search overlay**, **Lookbook**, **Visit Store** page with embedded map, wishlist, toasts.
- **Demo admin panel** at `/admin` (products CRUD, inventory, enquiries, offers, homepage, reels, lookbook, store info, social, settings).

## Technologies

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion (all animation, incl. scroll-linked "3D" parallax — chosen over Three.js for mobile performance)
- React Router (SPA)
- Lucide React icons

## How to Install

```bash
npm install
```

## How to Start

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## How to Build

```bash
npm run build
```

Output lands in `dist/`.

## How to Replace the Logo

The wordmark is typographic (the serif "NOORVI ✦"). It appears in:

- `src/components/Navbar.tsx` (top bar + mobile menu)
- `src/components/Footer.tsx` (giant footer wordmark)
- `index.html` (the `<link rel="icon">` favicon — replace the data-URI with `/favicon.png`)

To use an image logo instead, drop it in `public/images/logo.png` and swap the `<Link>` text in Navbar/Footer for an `<img>`.

## How to Replace the Hero Video

1. Put your video at `public/videos/hero.mp4` (10–20 s, muted-friendly, ~1080p).
2. In `src/config/storeConfig.ts` set:

```ts
media: { heroVideo: "/videos/hero.mp4", ... }
```

The site automatically uses the video; while the value is empty it shows the editorial image with a cinematic slow zoom.

## How to Replace Photos

**Every photo on the site is listed in one file:** `src/config/media.ts`.
Drop real Noorvi photos into `public/images/` and change the URLs there — nothing else needs editing.

## How to Add Products

Two ways:

1. **Visually** — open `/admin` (demo password: `noorvi`) → *Products* → *Add product*.
2. **In code** — edit the `PRODUCTS` array in `src/data/products.ts`.

Admin changes are stored in the browser (localStorage) for the demo; `src/data/products.ts` is the source of truth for a fresh deploy.

## How to Change the WhatsApp Number

Edit **one line** in `src/config/storeConfig.ts`:

```ts
whatsappNumber: "919876543210", // country code + number, digits only
```

Every Order-on-WhatsApp button, the navbar chat button and the sticky mobile CTA go live instantly. Until it's set, the site shows a drafted order message (and logs the enquiry to the admin dashboard).

## How to Change the Instagram URL

Same file — `instagramUrl` and `instagramHandle` in `src/config/storeConfig.ts`.

## How to Change Store Details

- Address, hours, phone, social links → `/admin` → *Store Information* / *Social Links* (live on the site).
- Homepage headline, hero copy, offer banner → `/admin` → *Homepage* / *Offers*.
- Permanent defaults → `src/config/storeConfig.ts`.

## Project Folder Structure

```
src/
  components/   Navbar, Footer, ProductCard, ReelCard, SearchOverlay, CustomCursor,
                Loader, UI kit, VideoPlayer, Lightbox, admin/BlogManager
  config/       storeConfig.ts (business details) · media.ts (photos) · supabase.ts
  context/      store.tsx (products, wishlist, enquiries, site content, toasts)
  data/         products.ts (catalogue) · blogSeed.ts (journal demo stories)
  pages/        Home, Shop, ProductDetail, Lookbook, Visit, Info, Admin, Blog, BlogPost
  sections/     Hero + homepage section groups (incl. HomeJournal)
  services/     blog.ts — Journal API (Supabase when configured, demo otherwise)
  utils/        helpers.ts · markdown.tsx · seo.ts
public/         _redirects, place videos in public/videos/, photos in public/images/
supabase/       schema.sql — run in the Supabase SQL editor to go live
```

## Deployment to Netlify

1. Push this folder to GitHub.
2. Netlify → **Add new site → Import from Git**.
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. SPA redirects are already configured (`netlify.toml` + `public/_redirects`), so `/shop`, `/product/...`, `/admin` all work on refresh.

## The Noorvi Journal (Blog)

- Public pages: `/blog` and `/blog/:slug` — stories support **image, video, 9:16 reel, gallery and text** posts.
- Homepage section **From the Noorvi Journal** shows the latest 3 published stories.
- Manage everything in `/admin` → **Blog / Stories**: create, edit, delete, draft/publish/hide, feature, categories, photo + video uploads with progress, gallery drag-reorder.
- Story content uses simple formatting: `## heading`, `**bold**`, `*italic*`, `- lists`, `> quotes`, `[links](/shop)`.

## Connecting Supabase (live blog storage + real auth)

The Journal runs in **demo mode** by default (data in the browser). To go live:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/schema.sql` — it creates the
   `blog_posts`, `blog_media`, `blog_categories` tables, RLS policies
   (visitors can only read published posts) and the `blog-images` /
   `blog-videos` public storage buckets.
3. In **Authentication → Users**, add the store owner's email + password.
4. Add the environment variables (in `.env` locally, or Netlify → Site
   settings → Environment variables):

```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Rebuild (`npm run build`). The admin login now uses **Supabase Auth**
   (the hardcoded demo password is ignored), stories save to the database
   and uploads go to the storage buckets.

## Demo Notes

- Admin login (demo mode only): any email + password **`noorvi`**.
- Testimonials, opening hours and policy pages are clearly-labelled placeholders until real content is provided.
- No fake phone numbers or reviews are invented anywhere — placeholders are centralised and easy to replace.
