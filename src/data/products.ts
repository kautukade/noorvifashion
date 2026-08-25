import { MEDIA } from "../config/media";

/* ───────────────────────── Types ───────────────────────── */

export type Size = "XS" | "S" | "M" | "L" | "XL";
export const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

export type CategorySlug =
  | "tops"
  | "tshirts"
  | "shirts"
  | "corsets"
  | "party"
  | "casual";

export type ColorOption = { name: string; hex: string };

export type Product = {
  id: number;
  slug: string;
  name: string;
  code: string;
  category: CategorySlug;
  price: number;
  originalPrice: number;
  colors: ColorOption[];
  sizes: Size[];
  stock: Record<string, number>;
  isNew: boolean;
  isTrending: boolean;
  isSale: boolean;
  isFeatured: boolean;
  image: string;
  hoverImage: string;
  description: string;
  fabric: string;
  fit: string;
  care: string;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  image: string;
  blurb: string;
};

export type Reel = {
  id: string;
  title: string;
  caption: string;
  image: string;
  price: number;
  slug: string;
};

export type Look = {
  id: string;
  image: string;
  title: string;
  tag: string;
  tall: boolean;
};

export type PriceBand = {
  id: string;
  kicker: string;
  big: string;
  note: string;
  to: string;
};

export type Testimonial = { quote: string; name: string; detail: string };

/* ─────────────────── Colour presets (admin) ─────────────────── */

export const COLOR_PRESETS: ColorOption[] = [
  { name: "Blush Pink", hex: "#E8C6C4" },
  { name: "Baby Pink", hex: "#F2D3D3" },
  { name: "Ivory", hex: "#FAF7F2" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Beige", hex: "#D9C3AB" },
  { name: "Chocolate", hex: "#4A3026" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "Espresso", hex: "#261C18" },
  { name: "Red", hex: "#B3362E" },
  { name: "Denim Blue", hex: "#7B8EA0" },
  { name: "Gold", hex: "#B9945B" },
];

/* ─────────────────────── Categories ─────────────────────── */

export const CATEGORIES: Category[] = [
  { slug: "corsets", name: "Corsets", image: MEDIA.look1, blurb: "Structured. Sculpted. Statement." },
  { slug: "tops", name: "Tops", image: MEDIA.look2, blurb: "Everyday heroes with a twist." },
  { slug: "tshirts", name: "T-Shirts", image: MEDIA.look7, blurb: "Soft tees, loud personality." },
  { slug: "party", name: "Party", image: MEDIA.look8, blurb: "Main-character energy only." },
  { slug: "casual", name: "Casual", image: MEDIA.look4, blurb: "Off-duty looks, on-point." },
  { slug: "shirts", name: "Shirts", image: MEDIA.look6, blurb: "Crisp lines, easy days." },
];

/* ─────────────────────── Products ─────────────────────── */

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "pink-corset-top",
    name: "Pink Corset Top",
    code: "NF-001",
    category: "corsets",
    price: 349,
    originalPrice: 499,
    colors: [COLOR_PRESETS[0], COLOR_PRESETS[2]],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { XS: 2, S: 4, M: 7, L: 0, XL: 2 },
    isNew: true,
    isTrending: true,
    isSale: true,
    isFeatured: true,
    image: MEDIA.look1,
    hoverImage: MEDIA.look5,
    description:
      "Our best-selling blush corset with boned structure and a sweetheart neckline. Pairs with jeans for brunch or a skirt for date night.",
    fabric: "Stretch crepe with satin lining",
    fit: "Fitted, true to size — size up for a relaxed feel",
    care: "Gentle hand wash cold · Dry in shade · Warm iron inside out",
  },
  {
    id: 2,
    slug: "black-ribbed-crop-top",
    name: "Black Ribbed Crop Top",
    code: "NF-002",
    category: "tops",
    price: 249,
    originalPrice: 349,
    colors: [COLOR_PRESETS[6], COLOR_PRESETS[7]],
    sizes: ["S", "M", "L"],
    stock: { S: 6, M: 8, L: 3 },
    isNew: false,
    isTrending: true,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look3,
    hoverImage: MEDIA.look4,
    description:
      "The ribbed crop that goes with literally everything. Square neck, thick straps, zero see-through.",
    fabric: "Cotton rib knit with 4-way stretch",
    fit: "Body-hugging, cropped at the waist",
    care: "Machine wash cold · Do not bleach · Flat dry",
  },
  {
    id: 3,
    slug: "white-halter-top",
    name: "White Halter Top",
    code: "NF-003",
    category: "tops",
    price: 299,
    originalPrice: 449,
    colors: [COLOR_PRESETS[3], COLOR_PRESETS[4]],
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 1, S: 2, M: 4, L: 2 },
    isNew: true,
    isTrending: false,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look2,
    hoverImage: MEDIA.look6,
    description:
      "A clean ivory halter with a keyhole back. Summer mornings, college fests, rooftop evenings — sorted.",
    fabric: "Airy viscose blend",
    fit: "Regular fit, tie neck adjustable",
    care: "Gentle machine wash · Shade dry · Cool iron",
  },
  {
    id: 4,
    slug: "oversized-graphic-tee",
    name: "Oversized Graphic Tee",
    code: "NF-004",
    category: "tshirts",
    price: 399,
    originalPrice: 599,
    colors: [COLOR_PRESETS[8], COLOR_PRESETS[2]],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 5, M: 9, L: 6, XL: 4 },
    isNew: true,
    isTrending: true,
    isSale: true,
    isFeatured: true,
    image: MEDIA.look7,
    hoverImage: MEDIA.look3,
    description:
      "Drop-shoulder oversized tee with a bold back print. Style it with cargos, jeans or biker shorts.",
    fabric: "220 GSM heavyweight cotton",
    fit: "Oversized — size down for a regular fit",
    care: "Machine wash cold inside out · Do not iron on print",
  },
  {
    id: 5,
    slug: "classic-casual-shirt",
    name: "Classic Casual Shirt",
    code: "NF-005",
    category: "shirts",
    price: 449,
    originalPrice: 649,
    colors: [COLOR_PRESETS[4], COLOR_PRESETS[1]],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 3, M: 5, L: 5, XL: 2 },
    isNew: false,
    isTrending: false,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look6,
    hoverImage: MEDIA.look2,
    description:
      "A soft beige shirt that works as a top, a light layer, or tucked into skirts. One shirt, five outfits.",
    fabric: "Brushed cotton voile",
    fit: "Relaxed, slightly curved hem",
    care: "Machine wash warm · Hang dry · Iron while damp",
  },
  {
    id: 6,
    slug: "baby-pink-party-top",
    name: "Baby Pink Party Top",
    code: "NF-006",
    category: "party",
    price: 499,
    originalPrice: 699,
    colors: [COLOR_PRESETS[1], COLOR_PRESETS[10]],
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 2, S: 3, M: 6, L: 3 },
    isNew: true,
    isTrending: true,
    isSale: true,
    isFeatured: true,
    image: MEDIA.look8,
    hoverImage: MEDIA.look1,
    description:
      "Shimmery baby-pink top made for birthdays, receptions and every night you want the spotlight.",
    fabric: "Sequin mesh over soft lining",
    fit: "Fitted bodice, stretch back",
    care: "Dry clean recommended · Store flat",
  },
  {
    id: 7,
    slug: "chocolate-brown-corset",
    name: "Chocolate Brown Corset",
    code: "NF-007",
    category: "corsets",
    price: 549,
    originalPrice: 799,
    colors: [COLOR_PRESETS[5], COLOR_PRESETS[7]],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { XS: 1, S: 2, M: 3, L: 2, XL: 1 },
    isNew: false,
    isTrending: true,
    isSale: true,
    isFeatured: true,
    image: MEDIA.look5,
    hoverImage: MEDIA.look1,
    description:
      "Rich chocolate satin corset with adjustable lace-up back. The most photographed piece in the store.",
    fabric: "Satin with flexible boning",
    fit: "Structured — adjustable lace-up back",
    care: "Dry clean only · Do not wring",
  },
  {
    id: 8,
    slug: "minimal-white-tee",
    name: "Minimal White Tee",
    code: "NF-008",
    category: "tshirts",
    price: 199,
    originalPrice: 299,
    colors: [COLOR_PRESETS[3], COLOR_PRESETS[2]],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 10, M: 12, L: 8, XL: 5 },
    isNew: false,
    isTrending: false,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look2,
    hoverImage: MEDIA.look7,
    description:
      "The perfect white tee — not too thin, not too boxy. Buy one, then come back for two more.",
    fabric: "Combed cotton jersey",
    fit: "Regular, mid-length",
    care: "Machine wash cold · Tumble dry low",
  },
  {
    id: 9,
    slug: "denim-style-top",
    name: "Denim Style Top",
    code: "NF-009",
    category: "casual",
    price: 449,
    originalPrice: 599,
    colors: [COLOR_PRESETS[9], COLOR_PRESETS[4]],
    sizes: ["S", "M", "L"],
    stock: { S: 4, M: 6, L: 2 },
    isNew: true,
    isTrending: true,
    isSale: false,
    isFeatured: false,
    image: MEDIA.look4,
    hoverImage: MEDIA.look3,
    description:
      "Soft-wash denim top with vintage buttons. Throw it over dresses or wear it solo with white jeans.",
    fabric: "Light-wash cotton denim",
    fit: "Relaxed boxy cut",
    care: "Wash separately first wash · Cold wash · Shade dry",
  },
  {
    id: 10,
    slug: "red-sporty-tee",
    name: "Red Sporty Tee",
    code: "NF-010",
    category: "tshirts",
    price: 259,
    originalPrice: 399,
    colors: [COLOR_PRESETS[8], COLOR_PRESETS[3]],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 7, M: 5, L: 4, XL: 0 },
    isNew: false,
    isTrending: true,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look7,
    hoverImage: MEDIA.look4,
    description:
      "Race-day red with contrast tipping. Breathable enough for the gym, cute enough for chai after.",
    fabric: "Poly-cotton pique knit",
    fit: "Athletic regular fit",
    care: "Machine wash cold · Do not bleach",
  },
  {
    id: 11,
    slug: "beige-everyday-top",
    name: "Beige Everyday Top",
    code: "NF-011",
    category: "casual",
    price: 279,
    originalPrice: 399,
    colors: [COLOR_PRESETS[4], COLOR_PRESETS[2]],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { XS: 3, S: 6, M: 8, L: 5, XL: 3 },
    isNew: true,
    isTrending: false,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look6,
    hoverImage: MEDIA.look2,
    description:
      "A warm beige ribbed knit you will reach for daily. Soft against skin, endless to style.",
    fabric: "Modal rib knit",
    fit: "Slim regular, hip length",
    care: "Hand wash or gentle cycle · Dry flat",
  },
  {
    id: 12,
    slug: "black-party-top",
    name: "Black Party Top",
    code: "NF-012",
    category: "party",
    price: 459,
    originalPrice: 649,
    colors: [COLOR_PRESETS[6], COLOR_PRESETS[7]],
    sizes: ["S", "M", "L"],
    stock: { S: 2, M: 2, L: 1 },
    isNew: false,
    isTrending: true,
    isSale: true,
    isFeatured: true,
    image: MEDIA.look3,
    hoverImage: MEDIA.look8,
    description:
      "Midnight-black with sheer sleeves and a subtle shine. Dinner plans just got an upgrade.",
    fabric: "Stretch mesh with shimmer knit",
    fit: "Fitted, sheer sleeves",
    care: "Gentle hand wash · Shade dry · Cool iron on reverse",
  },
  {
    id: 13,
    slug: "ivory-satin-halter",
    name: "Ivory Satin Halter",
    code: "NF-013",
    category: "party",
    price: 329,
    originalPrice: 479,
    colors: [COLOR_PRESETS[2], COLOR_PRESETS[10]],
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 2, S: 4, M: 5, L: 2 },
    isNew: true,
    isTrending: false,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look2,
    hoverImage: MEDIA.look8,
    description:
      "Liquid ivory satin with a draped cowl neck. Minimal effort, maximum glow.",
    fabric: "Satin with lining",
    fit: "Bias cut, adjustable tie",
    care: "Hand wash cold · Do not wring · Shade dry",
  },
  {
    id: 14,
    slug: "blush-ruched-corset",
    name: "Blush Ruched Corset",
    code: "NF-014",
    category: "corsets",
    price: 399,
    originalPrice: 549,
    colors: [COLOR_PRESETS[0], COLOR_PRESETS[1]],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 3, M: 4, L: 3, XL: 2 },
    isNew: true,
    isTrending: true,
    isSale: true,
    isFeatured: false,
    image: MEDIA.look8,
    hoverImage: MEDIA.look5,
    description:
      "Softly ruched blush corset — structured where it counts, comfy everywhere else.",
    fabric: "Scuba knit with light boning",
    fit: "Fitted with stretch",
    care: "Hand wash cold · Dry flat · Do not iron boning",
  },
];

/* ─────────────────────── Reels ─────────────────────── */

export const REELS: Reel[] = [
  { id: "r1", title: "Corset Season", caption: "The top that broke our DMs", image: MEDIA.look1, price: 349, slug: "pink-corset-top" },
  { id: "r2", title: "Little Black Top", caption: "Every wardrobe needs one", image: MEDIA.look3, price: 249, slug: "black-ribbed-crop-top" },
  { id: "r3", title: "Party Ready", caption: "Shine szn is always on", image: MEDIA.look8, price: 499, slug: "baby-pink-party-top" },
  { id: "r4", title: "Chocolate Fit", caption: "Brown is the new black", image: MEDIA.look5, price: 549, slug: "chocolate-brown-corset" },
  { id: "r5", title: "Tee Time", caption: "Oversized & unbothered", image: MEDIA.look7, price: 259, slug: "red-sporty-tee" },
  { id: "r6", title: "Denim Days", caption: "Off-duty uniform sorted", image: MEDIA.look4, price: 449, slug: "denim-style-top" },
];

/* ─────────────────────── Lookbook ─────────────────────── */

export const LOOKS: Look[] = [
  { id: "l1", image: MEDIA.look1, title: "Rose Hour", tag: "Corsets", tall: true },
  { id: "l2", image: MEDIA.look3, title: "Noir Rib", tag: "Tops", tall: false },
  { id: "l3", image: MEDIA.look2, title: "Ivory Line", tag: "Tops", tall: false },
  { id: "l4", image: MEDIA.look4, title: "Off Duty", tag: "Casual", tall: true },
  { id: "l5", image: MEDIA.look5, title: "Cocoa Satin", tag: "Corsets", tall: false },
  { id: "l6", image: MEDIA.look6, title: "Soft Serve", tag: "Casual", tall: true },
  { id: "l7", image: MEDIA.look7, title: "Crimson Pop", tag: "T-Shirts", tall: false },
  { id: "l8", image: MEDIA.look8, title: "First Blush", tag: "Party", tall: true },
];

/* ─────────────────────── Price bands ─────────────────────── */

export const PRICE_BANDS: PriceBand[] = [
  { id: "b1", kicker: "Pocket-friendly picks", big: "₹299", note: "Under", to: "/shop?max=299" },
  { id: "b2", kicker: "The sweet spot", big: "₹499", note: "Under", to: "/shop?max=499" },
  { id: "b3", kicker: "What Pusad is wearing", big: "HOT", note: "Trending deals", to: "/shop?flag=trending" },
  { id: "b4", kicker: "Staff favourites", big: "PICKS", note: "Weekend", to: "/shop?flag=featured" },
];

/* ─────────────────────── Testimonials (demo) ─────────────────────── */

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Walked in for one top, walked out with three. The corset fits like it was stitched for me.",
    name: "Aarti D.",
    detail: "College student · Pusad",
  },
  {
    quote:
      "Finally a store in Pusad that gets what we actually see on Instagram. Prices are honest too.",
    name: "Sneha K.",
    detail: "Regular customer",
  },
  {
    quote:
      "Ordered on WhatsApp at noon, picked it up from Gold Plaza by evening. Smoothest experience.",
    name: "Prachi M.",
    detail: "First-time visitor",
  },
];

/* ─────────────────────── Nav ─────────────────────── */

export const NAV_LINKS: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "New Arrivals", to: "/shop?flag=new" },
  { label: "Journal", to: "/blog" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Visit Store", to: "/visit" },
];
