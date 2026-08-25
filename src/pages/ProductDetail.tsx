import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Copy,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { CATEGORIES } from "../data/products";
import { storeConfig } from "../config/storeConfig";
import { useStore } from "../context/store";
import {
  buildOrderMessage,
  cn,
  copyText,
  discountPct,
  inr,
  isWhatsAppReady,
  stockInfo,
  waLink,
} from "../utils/helpers";
import ProductCard from "../components/ProductCard";
import { Eyebrow, Reveal } from "../components/ui";

function Accordion({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-espresso/12">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[11px] font-semibold tracking-[0.3em] text-espresso uppercase">{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-gold transition-transform duration-500", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-relaxed text-choco/80">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, toggleWishlist, isWished, addEnquiry, pushToast, site } = useStore();
  const product = products.find((p) => p.slug === slug);

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [mediaIdx, setMediaIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState("");

  const related = useMemo(
    () =>
      product
        ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
        : [],
    [products, product]
  );

  if (!product) return <Navigate to="/shop" replace />;

  const pct = discountPct(product.price, product.originalPrice);
  const stock = stockInfo(product);
  const wished = isWished(product.id);
  const media = [
    { src: product.image, kind: "photo" as const, label: "Front" },
    { src: product.hoverImage, kind: "photo" as const, label: "Alt view" },
    { src: product.image, kind: "reel" as const, label: "Reel" },
  ];
  const active = media[mediaIdx];
  const selectedColor = product.colors[Math.min(colorIdx, product.colors.length - 1)];

  const handleOrder = () => {
    if (product.colors.length > 1 && colorIdx >= product.colors.length) return;
    const msg = buildOrderMessage({
      name: product.name,
      code: product.code,
      size: size ?? "Any",
      color: selectedColor?.name,
      price: product.price,
    });
    addEnquiry({
      productName: product.name,
      code: product.code,
      size: size ?? "Any",
      color: selectedColor?.name ?? "—",
      price: product.price,
    });
    if (isWhatsAppReady()) {
      window.open(waLink(msg), "_blank");
      pushToast("Opening WhatsApp with your order ✦");
    } else {
      setDraft(msg);
      setModal(true);
    }
  };

  const soldOut = stock.tone === "out";

  return (
    <div className="bg-ivory pt-28 md:pt-36">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-choco/55 uppercase" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span aria-hidden>✦</span>
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          <span aria-hidden>✦</span>
          <Link to={`/shop?cat=${product.category}`} className="hover:text-gold">{product.category}</Link>
          <span aria-hidden>✦</span>
          <span className="text-espresso">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1500px] gap-12 px-6 md:px-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div
            className="group relative aspect-[3/4] overflow-hidden bg-nude"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={mediaIdx}
                src={active.src}
                alt={`${product.name} — ${active.label}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="h-full w-full object-cover transition-transform duration-300"
                style={{
                  transformOrigin: origin,
                  transform: zoom && active.kind === "photo" ? "scale(1.65)" : "scale(1)",
                }}
              />
            </AnimatePresence>
            {active.kind === "reel" && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-espresso/25">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-ivory/70 bg-espresso/40 backdrop-blur">
                  <Play className="ml-1 h-8 w-8 text-ivory" fill="currentColor" />
                </span>
                <p className="mt-4 text-[10px] tracking-[0.35em] text-ivory uppercase">Reel preview · demo</p>
              </div>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isNew && <span className="bg-gold px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-espresso">NEW</span>}
              {product.isTrending && <span className="bg-espresso px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-ivory">TRENDING</span>}
              {pct > 0 && <span className="bg-ivory/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-choco">−{pct}%</span>}
            </div>
            <span className="absolute bottom-4 left-4 hidden bg-espresso/70 px-3 py-1.5 text-[9px] tracking-[0.25em] text-ivory uppercase backdrop-blur md:block">
              Hover to zoom
            </span>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3">
            {media.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMediaIdx(i)}
                aria-label={`View ${m.label}`}
                className={cn(
                  "relative w-20 overflow-hidden border-2 transition-all md:w-24",
                  mediaIdx === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <img src={m.src} alt="" className="aspect-[3/4] w-full object-cover" />
                {m.kind === "reel" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-espresso/30">
                    <Play className="h-5 w-5 text-ivory" fill="currentColor" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{CATEGORIES.find((c) => c.slug === product.category)?.name ?? product.category}</Eyebrow>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold text-espresso md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-[10px] tracking-[0.3em] text-choco/50 uppercase">
            {product.code} · ✦ Be the first to review this look
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-display text-4xl font-semibold text-espresso">{inr(product.price)}</span>
            {pct > 0 && (
              <>
                <span className="text-lg text-choco/45 line-through">{inr(product.originalPrice)}</span>
                <span className="bg-gold px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-espresso">
                  SAVE {pct}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-choco/80">{product.description}</p>

          {/* Colour */}
          <div className="mt-8">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-espresso uppercase">
              Colour — <span className="text-gold">{selectedColor?.name}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  aria-label={`Colour ${c.name}`}
                  aria-pressed={i === colorIdx}
                  onClick={() => setColorIdx(i)}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-all",
                    i === colorIdx ? "scale-110 border-gold ring-2 ring-gold/40" : "border-espresso/20 hover:scale-105"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-[0.3em] text-espresso uppercase">Size</p>
              <p className="text-[10px] tracking-[0.2em] text-choco/50 uppercase">XS – XL · true to size</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.sizes.map((s) => {
                const qty = product.stock[s] ?? 0;
                const off = qty <= 0;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={off}
                    title={off ? `${s} — sold out` : `${s} — ${qty} in stock`}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-13 border px-4 py-3 text-xs font-medium tracking-[0.15em] transition-all",
                      off
                        ? "cursor-not-allowed border-espresso/10 text-choco/30 line-through"
                        : size === s
                          ? "border-espresso bg-espresso text-ivory"
                          : "border-espresso/25 text-espresso hover:border-gold"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {size && (product.stock[size] ?? 0) > 0 && (product.stock[size] ?? 0) <= 3 && (
              <p className="mt-2.5 text-xs font-medium text-[#b3552e]">
                Hurry — only {product.stock[size]} left in {size}!
              </p>
            )}
          </div>

          {/* Stock */}
          <p className="mt-6 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.25em] uppercase">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                stock.tone === "ok" && "bg-[#7c8b57]",
                stock.tone === "low" && "bg-[#c0785a]",
                stock.tone === "out" && "bg-choco"
              )}
            />
            <span className={cn(stock.tone === "ok" && "text-[#6d7a4c]", stock.tone === "low" && "text-[#b3552e]", stock.tone === "out" && "text-choco/60")}>
              {stock.label}
            </span>
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleOrder}
              disabled={soldOut}
              className={cn(
                "group relative flex flex-1 items-center justify-center gap-3 overflow-hidden px-8 py-4.5 text-[11px] font-semibold tracking-[0.25em] uppercase",
                soldOut ? "cursor-not-allowed bg-choco/20 text-choco/50" : "bg-espresso text-ivory"
              )}
            >
              {!soldOut && (
                <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" aria-hidden />
              )}
              <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-espresso">
                <MessageCircle className="h-4 w-4" />
                {soldOut ? "Sold out — ask for restock" : "Order on WhatsApp"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wished}
              className={cn(
                "flex items-center justify-center gap-3 border px-8 py-4.5 text-[11px] font-semibold tracking-[0.25em] uppercase transition-all",
                wished
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-espresso/30 text-espresso hover:border-gold hover:text-gold"
              )}
            >
              <motion.span key={wished ? "y" : "n"} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 16 }}>
                <Heart className="h-4 w-4" fill={wished ? "currentColor" : "none"} />
              </motion.span>
              {wished ? "Wishlisted" : "Save to wishlist"}
            </button>
          </div>

          {/* Trust row */}
          <div className="mt-7 grid gap-3 border-y border-espresso/12 py-5 text-[11px] tracking-[0.12em] text-choco/70 uppercase sm:grid-cols-3">
            <p className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-gold" /> Pickup at Gold Plaza</p>
            <p className="flex items-center gap-2.5"><MessageCircle className="h-4 w-4 text-gold" /> Order via WhatsApp</p>
            <p className="flex items-center gap-2.5"><Sparkles className="h-4 w-4 text-gold" /> New stock weekly</p>
          </div>

          {/* Accordions */}
          <div className="mt-2">
            <Accordion title="Description" defaultOpen>
              {product.description}
            </Accordion>
            <Accordion title="Fabric & Fit">
              <p><span className="font-semibold text-espresso">Fabric:</span> {product.fabric}</p>
              <p className="mt-2"><span className="font-semibold text-espresso">Fit:</span> {product.fit}</p>
            </Accordion>
            <Accordion title="Care">
              <p>{product.care}</p>
            </Accordion>
            <Accordion title="Product code & pickup">
              <p>Product code: <span className="font-semibold text-espresso">{product.code}</span></p>
              <p className="mt-2">
                Reserve on WhatsApp and pick up the same day at {site.addressLine2},{" "}
                {site.addressLine3}. Demo flow — payments happen at the store.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-semibold text-espresso md:text-5xl">
              Complete the <em className="text-gold">look ✦</em>
            </h2>
            <Link to={`/shop?cat=${product.category}`} className="group flex items-center gap-2 text-[11px] tracking-[0.25em] text-espresso uppercase hover:text-gold">
              More {product.category} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-7 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp draft modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[220] flex items-center justify-center bg-espresso/75 p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(false)}
            role="dialog"
            aria-modal="true"
            aria-label="WhatsApp order preview"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg bg-ivory p-8 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Eyebrow>Demo checkout</Eyebrow>
                  <h3 className="mt-3 font-display text-3xl font-semibold text-espresso">
                    Your order is drafted ✦
                  </h3>
                </div>
                <button type="button" onClick={() => setModal(false)} aria-label="Close" className="rounded-full border border-espresso/20 p-2.5 hover:border-gold hover:text-gold">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-choco/75">
                WhatsApp ordering is wired and ready — the store's number just hasn't been
                connected yet. Meanwhile, copy your message and DM us on Instagram.
              </p>
              <pre className="mt-5 max-h-56 overflow-y-auto border border-espresso/15 bg-cream p-4 font-sans text-xs leading-relaxed whitespace-pre-wrap text-espresso">
                {draft}
              </pre>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copyText(draft);
                    pushToast(ok ? "Message copied ✦" : "Copy failed — select the text manually");
                  }}
                  className="flex flex-1 items-center justify-center gap-2 bg-espresso py-4 text-[11px] font-semibold tracking-[0.25em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso"
                >
                  <Copy className="h-4 w-4" /> Copy message
                </button>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 border border-espresso/30 py-4 text-[11px] font-semibold tracking-[0.25em] text-espresso uppercase transition-colors hover:border-gold hover:text-gold"
                >
                  <Instagram className="h-4 w-4" /> DM on Instagram
                </a>
              </div>
              <p className="mt-4 text-center text-[10px] tracking-wide text-choco/55">
                Enquiry logged — the boutique sees it in the admin dashboard.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
