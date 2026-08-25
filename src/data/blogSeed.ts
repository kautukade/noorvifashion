import { MEDIA } from "../config/media";

export const DEMO_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

export const BLOG_CATEGORIES_SEED = [
  { id: "bc-new", name: "New Arrivals", slug: "new-arrivals", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-trend", name: "Trending", slug: "trending", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-offers", name: "Offers", slug: "offers", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-style", name: "Styling", slug: "styling", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-reels", name: "Noorvi Reels", slug: "noorvi-reels", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-bts", name: "Behind the Scenes", slug: "behind-the-scenes", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-store", name: "Store Updates", slug: "store-updates", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-events", name: "Events", slug: "events", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "bc-festive", name: "Festive Collection", slug: "festive-collection", createdAt: "2026-01-02T10:00:00.000Z" },
];

const CORSET_CONTENT = `The new corset edit is about **confidence you can wear** — boned panels, satin finishes and stretch linings that move with you from college to café to celebration.

## Three pieces leading the drop

- **Blush Structured Corset** — the shade that started it all, back in XS–XL
- **Cocoa Satin Corset** — rich chocolate with gold-tone hardware
- **Ivory Corset Shirt** — corset tailoring in an everyday silhouette

## How the girls are styling it

Layer it over a white tee for daytime, or wear it solo with gold hoops after dark. Pair with wide-leg denim or a flowy skirt — the rack at [Gold Plaza](/visit) is styled both ways this week.

### Fit notes from the trial room

Corsets run snug by design. If you are between sizes, **size up** — the panels are meant to hug, not squeeze.

> Walk in, try on, turn heads. Fresh sizes land every Friday — follow [Instagram](https://instagram.com/noorvi__fashion_) for the drop alert.`;

const HALTER_CONTENT = `One white halter, three completely different moods. This is the piece our regulars keep coming back for — here is how we style it on the shop floor.

## Look one — college casual

Knot the hem, throw on light-wash denim and white sneakers. Add a tote and you are done before the 9 AM lecture.

## Look two — café date

Tuck it into a beige knit skirt, gold hoops, soft blush lips. The halter neckline does all the talking.

## Look three — evening out

Black corset belt over the top, sleek trousers, heels. Same piece, completely different energy.

- Piece: **White Halter Top** — ₹299
- Available in XS, S, M, L
- Trial room open all day at [Gold Plaza](/visit)

> Styling it your way? Tag us — the best looks get reposted on our feed.`;

const BTS_CONTENT = `Before the racks are full and the lights come on, Gold Plaza has a quiet hour — and it is our favourite part of the day.

## 9:30 AM — the unboxing

New cartons from the wholesalers land twice a week. Every single piece is opened, checked for stitching, steamed and priced by hand.

## 10:15 AM — the rack logic

We style the racks the way you scroll a feed — **strongest looks at eye level**, colours grouped so the whole wall feels like one outfit idea.

## The rule we never break

If we would not wear it ourselves, it does not make the rack. That is how a small-town boutique keeps a big-city edit.

- Drop days: **Tuesday and Friday**
- Full tour of the store: [Visit Noorvi](/visit)`;

const PICKING_CONTENT = `People ask how a boutique in Pusad stays ahead of trends. The answer is simple and slightly obsessive — we watch everything, then buy almost nothing.

## Where we look

- Runway recaps and global fashion weeks, distilled to street level
- Instagram and Reels, daily — what real girls actually save and share
- What sells out fastest on our own rack — the honest data

## The 1-in-10 rule

For every ten pieces we consider, **one** makes it to the shop. Fabric first, then fit, then that instant "she will love this" feeling.

## Why affordable is non-negotiable

Trending should not mean expensive. Most of the rack sits under ₹499 because great style in Pusad should be an everyday thing — [browse the budget rails](/shop?max=499).

> Fashion forward, Pusad priced. That is the whole business plan.`;

export const BLOG_POSTS_SEED = [
  {
    id: "bp-01",
    title: "The New Corset Edit Has Arrived",
    slug: "new-corset-edit-pusad",
    excerpt:
      "Structured, satin and made to be noticed — the corset rack everyone is DMing about is finally back in store.",
    content: CORSET_CONTENT,
    category: "new-arrivals",
    postType: "IMAGE",
    featuredImageUrl: MEDIA.look1,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [
      { id: "gm-1", url: MEDIA.look1, alt: "Blush pink structured corset top", sortOrder: 0 },
      { id: "gm-2", url: MEDIA.look5, alt: "Chocolate brown satin corset", sortOrder: 1 },
    ],
    status: "published",
    isFeatured: true,
    views: 486,
    publishedAt: "2026-02-06T09:30:00.000Z",
    createdAt: "2026-02-05T18:00:00.000Z",
    updatedAt: "2026-02-06T09:30:00.000Z",
  },
  {
    id: "bp-02",
    title: "Style It 3 Ways: The White Halter",
    slug: "style-white-halter-3-ways",
    excerpt:
      "One ₹299 top, three completely different moods — college, café date and evening out. Steal our floor styling.",
    content: HALTER_CONTENT,
    category: "styling",
    postType: "IMAGE_GALLERY",
    featuredImageUrl: MEDIA.look2,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [
      { id: "gm-3", url: MEDIA.look2, alt: "White halter top styled casual", sortOrder: 0 },
      { id: "gm-4", url: MEDIA.look6, alt: "Beige knit pairing for café day", sortOrder: 1 },
      { id: "gm-5", url: MEDIA.look8, alt: "Evening look with party accessories", sortOrder: 2 },
      { id: "gm-6", url: MEDIA.hero, alt: "Campaign still from the Noorvi shoot", sortOrder: 3 },
    ],
    status: "published",
    isFeatured: false,
    views: 342,
    publishedAt: "2026-02-02T10:00:00.000Z",
    createdAt: "2026-02-01T20:00:00.000Z",
    updatedAt: "2026-02-02T10:00:00.000Z",
  },
  {
    id: "bp-03",
    title: "Friday Fit Check — Reel",
    slug: "friday-fit-check-reel",
    excerpt:
      "60 seconds, three outfits, zero repeats. The Friday fit check that broke our DMs last week.",
    content: `The outfits from this reel, in order:

- **Black Ribbed Crop** with wide-leg denim — ₹349
- **Red Sporty Tee** half-tucked — ₹249
- **Baby Pink Party Top** with gold hoops — ₹449

All three are on the rack right now. Tap the product link below before sizes run out — last Friday's drop sold out by Sunday.

> Reels like this drop every Friday on [Instagram](https://instagram.com/noorvi__fashion_). Demo video placeholder — swap in the real reel from admin.`,
    category: "noorvi-reels",
    postType: "REEL",
    featuredImageUrl: MEDIA.look3,
    videoUrl: DEMO_VIDEO,
    videoPosterUrl: MEDIA.look3,
    videoRatio: "9/16",
    gallery: [],
    status: "published",
    isFeatured: false,
    views: 918,
    publishedAt: "2026-01-30T15:00:00.000Z",
    createdAt: "2026-01-30T14:00:00.000Z",
    updatedAt: "2026-01-30T15:00:00.000Z",
  },
  {
    id: "bp-04",
    title: "Party Tops Under ₹499 — Festive Sparkle Guide",
    slug: "party-tops-under-499",
    excerpt:
      "Shimmer, satin and statement sleeves — everything that glitters on our rack, none of it over ₹499.",
    content: `Festive season is a contact sport and the rack is ready. Here is the under-₹499 shortlist we keep restocking:

- **Baby Pink Party Top** — subtle shimmer, ₹449
- **Red Sporty Tee** — for the daytime functions, ₹249
- **Blush Corset** — the dinner-party classic, ₹349

## The Noorvi party rule

One statement piece, everything else soft. Let the top do the work — neutral bottoms, gold jewellery, done.

Browse the full [offers rail](/shop?flag=sale) or walk in — the festive wall is right by the entrance at [Gold Plaza](/visit).`,
    category: "festive-collection",
    postType: "IMAGE",
    featuredImageUrl: MEDIA.look8,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [{ id: "gm-7", url: MEDIA.look7, alt: "Red sporty tee styled for daytime events", sortOrder: 0 }],
    status: "published",
    isFeatured: false,
    views: 264,
    publishedAt: "2026-01-24T11:00:00.000Z",
    createdAt: "2026-01-23T19:00:00.000Z",
    updatedAt: "2026-01-24T11:00:00.000Z",
  },
  {
    id: "bp-05",
    title: "Behind the Racks: A Morning at Gold Plaza",
    slug: "morning-at-gold-plaza",
    excerpt:
      "Steaming, pricing, rack logic and the 9:30 AM unboxing — a look behind the boutique before the shutters go up.",
    content: BTS_CONTENT,
    category: "behind-the-scenes",
    postType: "IMAGE_GALLERY",
    featuredImageUrl: MEDIA.store,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [
      { id: "gm-8", url: MEDIA.store, alt: "Inside the Noorvi boutique at opening", sortOrder: 0 },
      { id: "gm-9", url: MEDIA.hero, alt: "Campaign backdrop setup", sortOrder: 1 },
      { id: "gm-10", url: MEDIA.look4, alt: "Fresh denim arrivals being steamed", sortOrder: 2 },
    ],
    status: "published",
    isFeatured: false,
    views: 198,
    publishedAt: "2026-01-18T08:30:00.000Z",
    createdAt: "2026-01-17T21:00:00.000Z",
    updatedAt: "2026-01-18T08:30:00.000Z",
  },
  {
    id: "bp-06",
    title: "Denim Days Are Back",
    slug: "denim-days-are-back",
    excerpt:
      "The oversized denim shirt is the most regrammed piece on our feed this month. Here is why it works.",
    content: `There is a reason the denim wall is always half-empty — the oversized denim shirt is the most forgiving, most re-wearable piece we stock.

## Why it works for every body

- Dropped shoulders soften the silhouette
- The wash is light enough for day, dark enough for evening
- Knot it, belt it, or wear it open over a crop

## The honest numbers

- **Denim Style Top** — ₹399, sizes S to XL
- Restocked twice already this month
- Pairs with everything beige on the [casual rail](/shop?cat=casual)

> Denim is not a trend. It is a Tuesday.`,
    category: "trending",
    postType: "IMAGE",
    featuredImageUrl: MEDIA.look4,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [],
    status: "published",
    isFeatured: false,
    views: 305,
    publishedAt: "2026-01-12T12:00:00.000Z",
    createdAt: "2026-01-11T18:00:00.000Z",
    updatedAt: "2026-01-12T12:00:00.000Z",
  },
  {
    id: "bp-07",
    title: "How We Pick Every Single Piece",
    slug: "how-we-pick-every-piece",
    excerpt:
      "Runway recaps, Reels research and the 1-in-10 rule — the buying process behind the Noorvi edit.",
    content: PICKING_CONTENT,
    category: "store-updates",
    postType: "TEXT",
    featuredImageUrl: MEDIA.hero,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [],
    status: "published",
    isFeatured: false,
    views: 421,
    publishedAt: "2026-01-08T10:00:00.000Z",
    createdAt: "2026-01-07T22:00:00.000Z",
    updatedAt: "2026-01-08T10:00:00.000Z",
  },
  {
    id: "bp-08",
    title: "Beige Knits: The Quiet Trend",
    slug: "beige-knits-quiet-trend",
    excerpt:
      "Soft, minimal and endlessly layerable — why the beige knit rail keeps disappearing.",
    content: `Sometimes the loudest trend is the quietest one. The beige ribbed knit has become the piece girls buy in two colours.

- **Beige Everyday Top** — ₹249
- Layers under corsets, over shirts, alone with jeans
- The neutral that makes gold jewellery pop

Find it on the [casual rail](/shop?cat=casual) — while this batch lasts.`,
    category: "trending",
    postType: "IMAGE",
    featuredImageUrl: MEDIA.look6,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [],
    status: "hidden",
    isFeatured: false,
    views: 87,
    publishedAt: "2026-01-05T10:00:00.000Z",
    createdAt: "2026-01-04T19:00:00.000Z",
    updatedAt: "2026-01-05T10:00:00.000Z",
  },
  {
    id: "bp-09",
    title: "The Diwali Edit Is Coming",
    slug: "diwali-edit-coming-soon",
    excerpt:
      "A first look at the festive wall we are building — shimmer tops, corset shirts and gold everything.",
    content: `Still on the styling table, but we could not keep it secret. The Diwali edit is being photographed this week.

## Sneak peek

- Shimmer halter tops in three shades
- Corset shirts with gold-tone buttons
- A festive wall styled head-to-toe under ₹799

> This story is a draft — publish it from admin when the shoot is done.`,
    category: "events",
    postType: "IMAGE",
    featuredImageUrl: MEDIA.look8,
    videoUrl: "",
    videoPosterUrl: "",
    videoRatio: "16/9",
    gallery: [],
    status: "draft",
    isFeatured: false,
    views: 0,
    publishedAt: "",
    createdAt: "2026-02-07T16:00:00.000Z",
    updatedAt: "2026-02-07T16:00:00.000Z",
  },
];
