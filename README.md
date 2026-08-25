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
  components/   Navbar, Footer, ProductCard, ReelCard, SearchOverlay, CustomCursor, Loader, UI kit
  config/       storeConfig.ts (business details) · media.ts (all photos)
  context/      store.tsx (products, wishlist, enquiries, site content, toasts)
  data/         products.ts (products, categories, reels, lookbook, offers, testimonials)
  pages/        Home, Shop, ProductDetail, Lookbook, Visit, Info, Admin
  sections/     Hero + homepage section groups
  utils/        helpers.ts (WhatsApp builder, formatting, stock logic)
public/         _redirects, place videos in public/videos/, photos in public/images/
```

## Deployment to Netlify

1. Push this folder to GitHub.
2. Netlify → **Add new site → Import from Git**.
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. SPA redirects are already configured (`netlify.toml` + `public/_redirects`), so `/shop`, `/product/...`, `/admin` all work on refresh.

## Demo Notes

- Admin login: any email + password **`noorvi`**.
- Testimonials, opening hours and policy pages are clearly-labelled placeholders until real content is provided.
- No fake phone numbers or reviews are invented anywhere — placeholders are centralised and easy to replace.
