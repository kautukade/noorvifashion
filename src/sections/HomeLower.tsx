import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  BadgePercent,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Shirt,
  Sparkles,
} from "lucide-react";
import { LOOKS, PRICE_BANDS, REELS, TESTIMONIALS } from "../data/products";
import { MEDIA } from "../config/media";
import { storeConfig } from "../config/storeConfig";
import { useStore } from "../context/store";
import { cn, isWhatsAppReady } from "../utils/helpers";
import ReelCard from "../components/ReelCard";
import { Btn, Eyebrow, Lines, Reveal, SectionHead, SmartImg } from "../components/ui";

/* ═══════════════════ TRENDING REELS ═══════════════════ */

export function TrendingReels() {
  const { site } = useStore();
  const reels = REELS.filter((r) => !site.hiddenReels.includes(r.id)).slice(0, 4);

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Straight from our feed"
            title={[<>Trending at</>, <>{site.storeName} ✦</>]}
            copy="The looks Pusad is double-tapping. Watch, pick a vibe, and it's yours before the weekend."
          />
          <Reveal delay={0.3}>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.28em] text-espresso uppercase"
            >
              <Instagram className="h-4 w-4 text-gold" />
              {site.instagramHandle}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1500px] px-6 md:px-10">
        <div className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {reels.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.1}>
              <ReelCard reel={r} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ CAMPAIGN — pinned scale reveal ═══════════════════ */

export function Campaign() {
  const { site } = useStore();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [0.74, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [44, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.42, 0.66], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.42, 0.66], [46, 0]);

  if (reduced) {
    return (
      <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-espresso">
        <img src={MEDIA.look8} alt={`${site.storeName} campaign film still`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-espresso/55" />
        <div className="relative z-10 px-6 text-center text-ivory">
          <h2 className="font-display text-5xl font-semibold md:text-7xl">
            This is your <em className="text-gold">{site.storeName} era.</em>
          </h2>
          <div className="mt-8 flex justify-center">
            <Btn to="/shop" tone="gold">Explore the collection</Btn>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[230vh] bg-ivory">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative h-[80svh] w-[92vw] overflow-hidden"
          data-cursor="play"
        >
          <img
            src={MEDIA.look8}
            alt={`${site.storeName} campaign — party wear film`}
            loading="lazy"
            className="h-full w-full object-cover motion-safe:animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-espresso/40" />
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.45em] text-ivory/80 uppercase">
            ✦ Season film · {site.storeName}
          </span>

          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <h2 className="font-display text-5xl leading-[0.95] font-semibold text-ivory md:text-8xl">
              This is your
              <em className="mt-1 block text-gold">{site.storeName} era.</em>
            </h2>
            <div className="mt-9">
              <Btn to="/shop" tone="gold">
                Explore the collection <ArrowUpRight className="h-4 w-4" />
              </Btn>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════ OFFER BANNER ═══════════════════ */

export function OfferBanner() {
  const { site } = useStore();
  return (
    <section className="relative overflow-hidden bg-nude py-24 md:py-32">
      {/* floating price tags */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute top-14 left-[8%] -rotate-6 border border-espresso/25 bg-ivory px-5 py-2.5 text-[11px] tracking-[0.3em] text-espresso uppercase shadow-sm motion-safe:animate-floaty">
          Under ₹499
        </span>
        <span className="absolute top-24 right-[9%] rotate-[7deg] bg-espresso px-5 py-2.5 text-[11px] tracking-[0.3em] text-ivory uppercase shadow-lg motion-safe:animate-floaty-late">
          New drops weekly
        </span>
        <span className="absolute bottom-16 left-[14%] rotate-[5deg] border border-gold bg-gold/15 px-5 py-2.5 text-[11px] tracking-[0.3em] text-choco uppercase motion-safe:animate-floaty-late">
          Trending under ₹299
        </span>
        <span className="absolute right-[16%] bottom-24 -rotate-3 font-display text-5xl text-gold motion-safe:animate-floaty">✦</span>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6 text-center md:px-10">
        <Eyebrow className="justify-center">This week at {site.storeName}</Eyebrow>
        <Reveal>
          <h2 className="mt-8">
            <span className="block font-display text-[clamp(2.6rem,8vw,7rem)] leading-none font-semibold tracking-wide text-espresso">
              {site.offerTitle}
            </span>
            <span className="mt-2 block font-display text-[clamp(4.5rem,15vw,13rem)] leading-[0.9] font-semibold text-gold italic">
              {site.offerBig}
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-choco/70">{site.offerNote}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-9 flex justify-center">
            <Btn to="/shop?flag=sale" tone="dark">
              Shop the offers <ArrowUpRight className="h-4 w-4" />
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════ PRICE BANDS ═══════════════════ */

export function PriceBands() {
  const { site } = useStore();
  const bands = site.bands?.length ? site.bands : PRICE_BANDS;
  return (
    <section className="bg-ivory py-24 md:py-28">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHead
          eyebrow="Price-first shopping"
          title={[<>Looks for every</>, <>pocket ✦</>]}
          copy="Set your budget, we'll set the fits. Honest prices, zero compromise on style."
        />
        <div className="mt-14 grid grid-cols-1 gap-px border border-espresso/12 bg-espresso/12 sm:grid-cols-2 xl:grid-cols-4">
          {bands.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.08} className="h-full">
              <Link
                to={b.to}
                className="group flex h-full min-h-[240px] flex-col justify-between bg-ivory p-8 transition-colors duration-500 hover:bg-espresso md:p-10"
              >
                <p className="text-[10px] tracking-[0.3em] text-choco/55 uppercase transition-colors duration-500 group-hover:text-gold">
                  {b.kicker}
                </p>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">{b.note}</p>
                  <p className="mt-1 font-display text-6xl font-semibold text-espresso transition-colors duration-500 group-hover:text-ivory md:text-7xl">
                    {b.big}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-espresso uppercase">
                    Shop now
                    <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ WHY NOORVI ═══════════════════ */

const WHY = [
  {
    icon: Shirt,
    title: "Trend-led styles",
    copy: "Every rack mirrors what's moving on your feed — corsets, crops, oversized tees and more.",
  },
  {
    icon: Sparkles,
    title: "New drops weekly",
    copy: "Fresh pieces land every week. Follow the gram so you never hear 'sold out' first.",
  },
  {
    icon: BadgePercent,
    title: "Honest prices",
    copy: "Premium looks without premium bills. Most styles sit comfortably under ₹499.",
  },
  {
    icon: MapPin,
    title: "Shop local in Pusad",
    copy: "Try before you buy at Gold Plaza, Sonar Line — or order on WhatsApp and pick up same day.",
  },
];

export function WhyNoorvi() {
  const { site } = useStore();
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHead
          eyebrow="Why the girls choose us"
          title={[<>The {site.storeName}</>, <>promise ✦</>]}
        />
        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.1}>
              <div className="group border-t border-espresso/20 pt-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-espresso/20 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-espresso">
                    <w.icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="font-display text-2xl text-espresso/25 italic">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-espresso md:text-3xl">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-choco/75">{w.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ TESTIMONIALS ═══════════════════ */

export function Testimonials() {
  const { site } = useStore();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = TESTIMONIALS[idx];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="bg-ivory py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <SectionHead align="center" eyebrow="Love notes" title={[<>{site.storeName} girls</>, <>say ✦</>]} />
        <p className="mx-auto mt-4 inline-block bg-blush/60 px-4 py-1.5 text-[10px] tracking-[0.22em] text-choco uppercase">
          Demo layout — real reviews will appear here
        </p>

        <div className="relative mt-12 min-h-[220px] md:min-h-[200px]">
          <span aria-hidden className="absolute -top-10 left-1/2 -translate-x-1/2 font-display text-8xl text-gold/30 select-none">
            “
          </span>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={idx}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-2xl leading-snug text-espresso italic md:text-4xl">{t.quote}</p>
              <footer className="mt-7">
                <p className="text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">{t.name}</p>
                <p className="mt-1 text-xs text-choco/60">{t.detail} · demo</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/25 transition-colors hover:border-gold hover:bg-gold hover:text-espresso"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIdx(i)}
                className={cn("h-1.5 rounded-full transition-all duration-500", i === idx ? "w-8 bg-gold" : "w-2.5 bg-espresso/20 hover:bg-espresso/40")}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/25 transition-colors hover:border-gold hover:bg-gold hover:text-espresso"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ INSTAGRAM GRID ═══════════════════ */

export function InstagramGrid() {
  const { site } = useStore();
  const tiles = LOOKS.filter((l) => !site.hiddenLooks.includes(l.id)).slice(0, 6);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <SectionHead
          align="center"
          eyebrow="The gram never sleeps"
          title={[<>Follow</>, <em key="h" className="text-gold">{site.instagramHandle}</em>]}
          copy="Daily fits, drop teasers and restock alerts — the boutique lives on Instagram between visits."
        />
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {tiles.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.06}>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[4/5] overflow-hidden bg-espresso"
                aria-label={`${l.title} — view on Instagram`}
              >
                <img
                  src={l.image}
                  alt={l.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-espresso/0 transition-colors duration-500 group-hover:bg-espresso/60">
                  <span className="flex h-12 w-12 translate-y-2 items-center justify-center rounded-full border border-ivory/70 text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Instagram className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="translate-y-2 text-[10px] tracking-[0.3em] text-ivory uppercase opacity-0 transition-all delay-75 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    View on Instagram
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 bg-ivory/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.25em] text-espresso uppercase">
                  {l.tag}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-12 text-center">
          <Btn href={site.instagramUrl} external tone="outline-dark">
            Follow on Instagram <ArrowUpRight className="h-4 w-4" />
          </Btn>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════ VISIT STORE ═══════════════════ */

export function VisitStore() {
  const { site, pushToast } = useStore();

  const onWhatsApp = () => {
    if (isWhatsAppReady()) window.open(`https://wa.me/${storeConfig.whatsappNumber}`, "_blank");
    else pushToast("WhatsApp number connects soon — set it in src/config/storeConfig.ts");
  };
  const onCall = () => {
    if (site.phone) window.location.href = `tel:${site.phone}`;
    else pushToast("Store phone number updates soon — visit us at Gold Plaza!");
  };

  return (
    <section className="grain relative overflow-hidden bg-espresso py-24 text-ivory md:py-32">
      <div className="mx-auto grid max-w-[1500px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
        <div>
          <Eyebrow tone="light">Local love</Eyebrow>
          <h2 className="mt-6 font-display text-6xl leading-[0.92] font-semibold md:text-8xl">
            <Lines lines={[<>Visit</>, <em key="n" className="text-gold">{site.storeName} ✦</em>]} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/65 md:text-base">
              Some fits need a mirror, a best friend and a twirl. Come try the rack
              in person — we're right on Sonar Line.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <dl className="mt-10 max-w-md divide-y divide-ivory/10 border-y border-ivory/10">
              {[
                ["Boutique", site.storeName],
                ["Address", `${site.addressLine2}, ${site.addressLine3}`],
                ["Hours", site.hours],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-6 py-4">
                  <dt className="flex items-center gap-2.5 text-[10px] tracking-[0.35em] text-gold uppercase">
                    {k === "Hours" ? <Clock className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                    {k}
                  </dt>
                  <dd className="text-right text-sm text-ivory/85">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Btn href={storeConfig.mapsUrl} external tone="gold">
                Get directions <ArrowUpRight className="h-4 w-4" />
              </Btn>
              <Btn onClick={onWhatsApp} tone="outline-light">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Btn>
              <Btn onClick={onCall} tone="outline-light">
                <Phone className="h-4 w-4" /> Call store
              </Btn>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} y={50}>
          <div className="relative">
            <div className="absolute -inset-3 translate-x-4 translate-y-4 border border-gold/50" aria-hidden />
            <SmartImg src={MEDIA.store} alt={`Inside the ${site.storeName} boutique`} className="relative aspect-[5/4] w-full" />
            <span className="absolute -top-5 -left-3 bg-gold px-4 py-2 text-[10px] font-semibold tracking-[0.3em] text-espresso uppercase shadow-lg motion-safe:animate-floaty md:-left-6">
              Gold Plaza ✦ Sonar Line
            </span>
            <Link
              to="/visit"
              className="absolute right-5 bottom-5 flex items-center gap-2 border border-ivory/40 bg-espresso/70 px-5 py-3 text-[10px] tracking-[0.3em] text-ivory uppercase backdrop-blur transition-colors hover:border-gold hover:text-gold"
            >
              Plan your visit <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════ NEWSLETTER / CLUB ═══════════════════ */

export function Newsletter() {
  const { site } = useStore();
  const [mode, setMode] = useState<"wa" | "email">("wa");
  const [value, setValue] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section className="relative overflow-hidden bg-blush py-24 md:py-28">
      <span aria-hidden className="absolute -top-10 right-[6%] font-display text-[16rem] leading-none text-ivory/40 select-none">✦</span>
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-6 md:px-10 lg:grid-cols-2">
        <div>
          <Eyebrow>First dibs, always</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[0.95] font-semibold text-espresso md:text-7xl">
            <Lines lines={[<>Join the</>, <>{site.storeName} club ✦</>]} />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-choco/80 md:text-base">
              Be the first to know about new drops, offers and trending styles —
              before they hit the rack.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="border border-espresso/15 bg-ivory/70 p-8 backdrop-blur-sm md:p-10">
            {joined ? (
              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-espresso">
                  <Check className="h-6 w-6" strokeWidth={2} />
                </span>
                <p className="mt-5 font-display text-3xl font-semibold text-espresso">You're on the list!</p>
                <p className="mt-2 text-sm text-choco/70">
                  UI demo — connect your WhatsApp broadcast or email service to go live.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setJoined(false);
                    setValue("");
                  }}
                  className="mt-6 text-[10px] tracking-[0.3em] text-gold uppercase underline underline-offset-4 hover:text-espresso"
                >
                  Sign up another
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex border border-espresso/20 p-1">
                  {(
                    [
                      ["wa", "WhatsApp updates"],
                      ["email", "Email updates"],
                    ] as const
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "flex-1 py-3 text-[10px] font-medium tracking-[0.22em] uppercase transition-colors duration-300",
                        mode === m ? "bg-espresso text-ivory" : "text-choco/70 hover:text-espresso"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="mt-6 block">
                  <span className="text-[10px] tracking-[0.3em] text-choco/60 uppercase">
                    {mode === "wa" ? "WhatsApp number" : "Email address"}
                  </span>
                  <input
                    type={mode === "wa" ? "tel" : "email"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={mode === "wa" ? "98XXXXXXXX" : "you@example.com"}
                    className="mt-2 w-full border-b-2 border-espresso/25 bg-transparent py-3 font-display text-xl text-espresso outline-none transition-colors placeholder:text-choco/30 focus:border-gold"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => value.trim() && setJoined(true)}
                  className="group relative mt-7 w-full overflow-hidden bg-espresso py-4 text-[11px] font-medium tracking-[0.3em] text-ivory uppercase transition-colors"
                >
                  <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" aria-hidden />
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-espresso">Count me in</span>
                </button>
                <p className="mt-4 text-center text-[10px] tracking-wide text-choco/55">
                  UI demo for now — no messages are sent yet.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
