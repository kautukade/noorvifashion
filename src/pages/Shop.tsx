import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Heart, Search, X } from "lucide-react";
import { ALL_SIZES, CATEGORIES, COLOR_PRESETS } from "../data/products";
import { useStore } from "../context/store";
import { cn, inr } from "../utils/helpers";
import ProductCard from "../components/ProductCard";
import { Btn, Eyebrow, Reveal } from "../components/ui";

type SortKey = "rec" | "newest" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "rec", label: "Recommended" },
  { key: "newest", label: "Newest first" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
];

const PRICE_BUCKETS = [
  { key: "", label: "Any price" },
  { key: "299", label: "Under ₹299" },
  { key: "499", label: "Under ₹499" },
  { key: "499+", label: "₹499 & above" },
];

const FLAGS = [
  { key: "new", label: "New Arrivals" },
  { key: "trending", label: "Trending" },
  { key: "sale", label: "On Sale" },
  { key: "featured", label: "Staff Picks" },
];

export default function Shop() {
  const { products, wishlist } = useStore();
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const q = params.get("q") ?? "";
  const cat = params.get("cat") ?? "all";
  const flag = params.get("flag") ?? "";
  const price = params.get("max") ?? "";
  const sort = (params.get("sort") as SortKey) ?? "rec";
  const wishOnly = params.get("wish") === "1";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const results = useMemo(() => {
    let list = [...products];
    if (wishOnly) list = list.filter((p) => wishlist.includes(p.id));
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (flag) {
      list = list.filter((p) => {
        if (flag === "new") return p.isNew;
        if (flag === "trending") return p.isTrending;
        if (flag === "sale") return p.isSale;
        if (flag === "featured") return p.isFeatured;
        return true;
      });
    }
    if (price === "299") list = list.filter((p) => p.price < 299);
    if (price === "499") list = list.filter((p) => p.price < 499);
    if (price === "499+") list = list.filter((p) => p.price >= 499);
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter((p) =>
        [p.name, p.code, p.category, ...p.colors.map((c) => c.name)].join(" ").toLowerCase().includes(t)
      );
    }
    switch (sort) {
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.id - a.id);
    }
    return list;
  }, [products, wishlist, wishOnly, cat, flag, price, sizes, colors, q, sort]);

  const activeCat = CATEGORIES.find((c) => c.slug === cat);
  const clearAll = () => {
    setSizes([]);
    setColors([]);
    setParams(new URLSearchParams(), { replace: true });
  };
  const activeFilterCount =
    (cat !== "all" ? 1 : 0) + (flag ? 1 : 0) + (price ? 1 : 0) + sizes.length + colors.length;

  const filterUI = (
    <div className="space-y-9">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.35em] text-choco/55 uppercase">Category</p>
        <ul className="mt-4 space-y-2.5">
          {[{ slug: "all", name: "Everything" }, ...CATEGORIES].map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => setParam("cat", c.slug === "all" ? "" : c.slug)}
                className={cn(
                  "group flex items-center gap-3 text-sm transition-colors",
                  cat === c.slug ? "font-semibold text-gold" : "text-choco/80 hover:text-espresso"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    cat === c.slug ? "w-5 bg-gold" : "bg-choco/25 group-hover:bg-choco/60"
                  )}
                />
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.35em] text-choco/55 uppercase">Collection</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setParam("flag", flag === f.key ? "" : f.key)}
              className={cn(
                "border px-3.5 py-2 text-[10px] tracking-[0.18em] uppercase transition-all",
                flag === f.key
                  ? "border-espresso bg-espresso text-ivory"
                  : "border-espresso/20 text-choco/75 hover:border-gold hover:text-espresso"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.35em] text-choco/55 uppercase">Size</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                setSizes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))
              }
              className={cn(
                "min-w-11 border px-3 py-2.5 text-xs transition-all",
                sizes.includes(s)
                  ? "border-espresso bg-espresso text-ivory"
                  : "border-espresso/20 text-choco/75 hover:border-gold"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.35em] text-choco/55 uppercase">Colour</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {COLOR_PRESETS.map((c) => {
            const on = colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={`Filter colour ${c.name}`}
                aria-pressed={on}
                onClick={() =>
                  setColors((cur) => (on ? cur.filter((x) => x !== c.name) : [...cur, c.name]))
                }
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  on ? "scale-110 border-gold ring-2 ring-gold/40" : "border-espresso/20 hover:scale-105"
                )}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.35em] text-choco/55 uppercase">Price</p>
        <ul className="mt-4 space-y-2.5">
          {PRICE_BUCKETS.map((b) => (
            <li key={b.key}>
              <button
                type="button"
                onClick={() => setParam("max", b.key)}
                className={cn(
                  "group flex items-center gap-3 text-sm transition-colors",
                  price === b.key ? "font-semibold text-gold" : "text-choco/80 hover:text-espresso"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                    price === b.key ? "border-gold" : "border-choco/30"
                  )}
                >
                  {price === b.key && <span className="h-2 w-2 rounded-full bg-gold" />}
                </span>
                {b.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-gold uppercase underline underline-offset-4 hover:text-espresso"
        >
          <X className="h-3.5 w-3.5" /> Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-ivory">
      {/* Header */}
      <header className="border-b border-espresso/10 bg-cream pt-32 pb-12 md:pt-40 md:pb-14">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <Eyebrow>{wishOnly ? "Your shortlist" : "The rack"}</Eyebrow>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-6xl leading-[0.9] font-semibold text-espresso md:text-8xl">
              {wishOnly ? (
                <>
                  Wishlist<em className="text-gold"> ✦</em>
                </>
              ) : activeCat ? (
                activeCat.name
              ) : flag ? (
                FLAGS.find((f) => f.key === flag)?.label ?? "Shop"
              ) : (
                <>
                  The shop<em className="text-gold"> ✦</em>
                </>
              )}
            </h1>
            <p className="text-xs tracking-[0.25em] text-choco/60 uppercase">
              {results.length} {results.length === 1 ? "style" : "styles"}
            </p>
          </div>
          {activeCat && <p className="mt-3 font-display text-xl text-choco/70 italic">{activeCat.blurb}</p>}

          {/* Controls */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3 border border-espresso/20 bg-ivory px-4 py-3 sm:max-w-xs">
              <Search className="h-4 w-4 shrink-0 text-gold" />
              <input
                value={q}
                onChange={(e) => setParam("q", e.target.value)}
                placeholder="Search styles…"
                className="w-full bg-transparent text-sm text-espresso outline-none placeholder:text-choco/40"
                aria-label="Search products"
              />
            </div>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="flex items-center gap-2 border border-espresso/20 bg-ivory px-5 py-3 text-[10px] tracking-[0.25em] uppercase transition-colors hover:border-gold lg:hidden"
            >
              <Filter className="h-4 w-4" /> Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-espresso">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <label className="ml-auto flex items-center gap-3">
              <span className="hidden text-[10px] tracking-[0.25em] text-choco/55 uppercase sm:block">Sort</span>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value === "rec" ? "" : e.target.value)}
                className="border border-espresso/20 bg-ivory px-4 py-3 text-[11px] tracking-[0.12em] text-espresso uppercase outline-none focus:border-gold"
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto flex max-w-[1500px] gap-12 px-6 py-14 md:px-10">
        <aside className="hidden w-60 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-28">{filterUI}</div>
        </aside>

        <div className="min-w-0 flex-1">
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <Heart className="h-10 w-10 text-gold" strokeWidth={1.2} />
              <p className="mt-6 font-display text-4xl font-semibold text-espresso">
                {wishOnly ? "Your wishlist is empty" : "Nothing matches (yet)"}
              </p>
              <p className="mt-3 max-w-sm text-sm text-choco/65">
                {wishOnly
                  ? "Tap the heart on any product to build your dream shortlist."
                  : "Try clearing a filter or two — new stock lands every week."}
              </p>
              <div className="mt-8">
                <Btn onClick={clearAll} tone="dark">
                  Browse everything
                </Btn>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Budget strip */}
          <Reveal className="mt-20">
            <div className="flex flex-wrap items-center justify-between gap-4 border border-espresso/12 bg-cream px-7 py-6">
              <p className="font-display text-2xl text-espresso italic md:text-3xl">
                Budget shopping? <span className="text-choco/60">Most styles sit under {inr(499)}.</span>
              </p>
              <div className="flex gap-3">
                <Btn to="/shop?max=299" tone="outline-dark" className="px-6 py-3">
                  Under ₹299
                </Btn>
                <Btn to="/shop?max=499" tone="dark" className="px-6 py-3">
                  Under ₹499
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-[140] bg-espresso/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-[150] w-[86%] max-w-sm overflow-y-auto bg-ivory p-7 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="font-display text-2xl font-semibold text-espresso">Filters</p>
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label="Close filters"
                  className="rounded-full border border-espresso/20 p-2.5 hover:border-gold hover:text-gold"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {filterUI}
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="mt-10 w-full bg-espresso py-4 text-[11px] font-medium tracking-[0.3em] text-ivory uppercase"
              >
                Show {results.length} styles
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
