import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, type Category } from "../data/products";
import { MEDIA } from "../config/media";
import { useStore } from "../context/store";
import { cn } from "../utils/helpers";
import ProductCard from "../components/ProductCard";
import { Btn, Eyebrow, Lines, Reveal, SectionHead } from "../components/ui";

/* ═══════════════════ JUST DROPPED ═══════════════════ */

export function JustDropped() {
  const { products } = useStore();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-14%"]);

  const items = [...products]
    .sort((a, b) => Number(b.isNew) - Number(a.isNew) || Number(b.isTrending) - Number(a.isTrending))
    .slice(0, 8);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-24 md:py-32">
      {/* Drifting outline headline */}
      <motion.div
        style={{ x }}
        aria-hidden
        className="pointer-events-none absolute top-6 left-0 font-display text-[15vw] leading-none font-semibold whitespace-nowrap text-stroke-espresso opacity-30 select-none"
      >
        JUST DROPPED ✦ JUST DROPPED ✦
      </motion.div>

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            eyebrow="The fresh rack"
            title={[<>Just</>, <>dropped ✦</>]}
            copy="Fresh styles you'll want before they're gone. New pieces land every week — once they're out, they're out."
            className="max-w-xl"
          />
          <Reveal delay={0.3}>
            <Btn to="/shop?flag=new" tone="outline-dark">
              View all new arrivals <ArrowUpRight className="h-4 w-4" />
            </Btn>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 md:gap-x-7">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ SHOP YOUR VIBE ═══════════════════ */

function CategoryTile({ cat, count, className }: { cat: Category; count: number; className?: string }) {
  const { site } = useStore();
  return (
    <Link
      to={`/shop?cat=${cat.slug}`}
      data-cursor="explore"
      className={cn("group relative block overflow-hidden bg-espresso", className)}
      aria-label={`Shop ${cat.name}`}
    >
      <img
        src={cat.image}
        alt={`${cat.name} at ${site.storeName}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/15 to-transparent transition-opacity duration-700 group-hover:from-espresso/90" />
      <div className="absolute top-5 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-ivory/40 text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:border-gold group-hover:text-gold">
        <ArrowUpRight className="h-4 w-4" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[10px] tracking-[0.3em] text-ivory/65 uppercase transition-colors group-hover:text-gold">
          {count} styles · {cat.blurb}
        </p>
        <p className="mt-2 font-display text-3xl font-medium text-ivory transition-transform duration-500 group-hover:-translate-y-1 md:text-4xl">
          {cat.name}
        </p>
      </div>
    </Link>
  );
}

export function ShopVibe() {
  const { products } = useStore();
  const countFor = (slug: string) => products.filter((p) => p.category === slug).length;

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHead
          align="center"
          eyebrow="Six moods, one rack"
          title={[<>Shop your</>, <em key="v" className="text-gold">vibe ✦</em>]}
          copy="From structured corsets to off-duty denim — find the aisle that matches today's main-character energy."
        />

        {/* Mobile — horizontal swipe */}
        <div className="-mx-6 mt-14 flex snap-x gap-4 overflow-x-auto px-6 pb-4 no-scrollbar lg:hidden">
          {CATEGORIES.map((c) => (
            <CategoryTile
              key={c.slug}
              cat={c}
              count={countFor(c.slug)}
              className="h-[380px] w-[270px] shrink-0 snap-center"
            />
          ))}
        </div>

        {/* Desktop — editorial mosaic */}
        <div className="mt-16 hidden grid-cols-3 gap-4 lg:grid" style={{ gridAutoRows: "250px" }}>
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06} className={cn(i === 0 || i === 3 ? "row-span-2" : "")}>
              <CategoryTile cat={c} count={countFor(c.slug)} className="h-full min-h-[250px]" />
            </Reveal>
          ))}
          <Reveal delay={0.4}>
            <Link
              to="/shop"
              className="group flex h-full min-h-[250px] flex-col items-start justify-between bg-espresso p-8 text-ivory transition-colors duration-500 hover:bg-gold hover:text-espresso"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <span>
                <span className="block font-display text-3xl font-medium">View everything</span>
                <span className="mt-1 block text-[10px] tracking-[0.3em] uppercase opacity-70">
                  The full rack →
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ 3D SHOWCASE ═══════════════════ */

const SHOWCASE_IMGS = [
  { src: MEDIA.look2, cls: "top-[10%] left-[4%] w-60 -rotate-6", from: 90, to: -90 },
  { src: MEDIA.look8, cls: "top-[6%] right-[5%] w-52 rotate-[5deg]", from: -60, to: 100 },
  { src: MEDIA.look4, cls: "bottom-[8%] left-[12%] w-44 rotate-[7deg]", from: 50, to: -110 },
  { src: MEDIA.look3, cls: "bottom-[12%] right-[9%] w-56 -rotate-[4deg]", from: -40, to: 70 },
];

export function Showcase() {
  const { site } = useStore();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-espresso py-28 text-ivory md:py-44">
      {/* Parallax floating fashion cards (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        {SHOWCASE_IMGS.map((img, i) => {
          const y = useTransform(scrollYProgress, [0, 1], [img.from, img.to]);
          return (
            <motion.div key={i} style={{ y }} className={cn("absolute", img.cls)}>
              <div className="overflow-hidden rounded-t-full border border-ivory/20 opacity-90 shadow-2xl shadow-black/50">
                <img src={img.src} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
              </div>
            </motion.div>
          );
        })}
        <motion.span
          style={{ y: useTransform(scrollYProgress, [0, 1], [30, -60]) }}
          className="absolute top-[30%] left-[30%] font-display text-4xl text-gold"
        >
          ✦
        </motion.span>
        <motion.span
          style={{ y: useTransform(scrollYProgress, [0, 1], [-40, 50]) }}
          className="absolute right-[28%] bottom-[26%] text-[10px] tracking-[0.4em] text-gold/80 uppercase"
        >
          New drop Fridays
        </motion.span>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <Eyebrow tone="light" className="justify-center">
          The {site.storeName} effect
        </Eyebrow>
        <h2 className="mt-6 font-display text-6xl leading-[0.92] font-semibold md:text-8xl">
          <Lines
            lines={[
              <>Made to be</>,
              <em key="n" className="text-gold">
                noticed.
              </em>,
            ]}
          />
        </h2>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-ivory/65 md:text-base">
            Trending looks. Fresh drops. {site.storeName} attitude. Every piece on the rack
            was picked to turn heads on Sonar Line — and your feed.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="mt-10 flex justify-center">
            <Btn to="/shop" tone="gold">
              Explore the collection <ArrowUpRight className="h-4 w-4" />
            </Btn>
          </div>
        </Reveal>

        {/* Mobile gallery */}
        <div className="-mx-6 mt-16 flex snap-x gap-4 overflow-x-auto px-6 pb-2 no-scrollbar lg:hidden">
          {SHOWCASE_IMGS.map((img, i) => (
            <div key={i} className="w-52 shrink-0 snap-center overflow-hidden rounded-t-full border border-ivory/20">
              <img src={img.src} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
