import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Instagram } from "lucide-react";
import { MEDIA } from "../config/media";
import { storeConfig } from "../config/storeConfig";
import { useStore } from "../context/store";
import { Btn, Lines, Magnetic, usePointerFine } from "../components/ui";

export default function Hero() {
  const { site } = useStore();
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 55, damping: 16, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 55, damping: 16, mass: 0.6 });

  const c1x = useTransform(sx, (v) => v * -52);
  const c1y = useTransform(sy, (v) => v * -34);
  const c2x = useTransform(sx, (v) => v * 40);
  const c2y = useTransform(sy, (v) => v * 28);

  const onMove = (e: React.MouseEvent) => {
    if (!fine || reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-espresso"
      aria-label={`${site.storeName} — new season`}
    >
      {/* Backdrop: video if configured, else cinematic slow-zoom image */}
      <div className="absolute inset-0">
        {storeConfig.media.heroVideo ? (
          <video
            className="h-full w-full object-cover"
            src={storeConfig.media.heroVideo}
            poster={MEDIA.hero}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={MEDIA.hero}
            alt={`${site.storeName} campaign — model in ivory outfit`}
            className="h-full w-full object-cover motion-safe:animate-kenburns"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/25 to-espresso/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/20 to-transparent" />

      {/* Floating editorial cards (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <motion.div
          style={{ x: c1x, y: c1y }}
          className="absolute top-[16%] right-[7%] w-56 rotate-[4deg]"
        >
          <div className="overflow-hidden rounded-t-full border border-ivory/25 shadow-2xl shadow-black/40 motion-safe:animate-floaty">
            <img src={MEDIA.look1} alt="" className="aspect-[3/4] w-full object-cover" />
            <p className="bg-espresso/70 py-2 text-center text-[9px] tracking-[0.28em] text-ivory/85 uppercase backdrop-blur">
              Corset Season ✦ ₹349
            </p>
          </div>
        </motion.div>
        <motion.div
          style={{ x: c2x, y: c2y }}
          className="absolute bottom-[13%] left-[55%] w-44 -rotate-[7deg]"
        >
          <div className="overflow-hidden rounded-t-full border border-ivory/25 shadow-2xl shadow-black/40 motion-safe:animate-floaty-late">
            <img src={MEDIA.look5} alt="" className="aspect-[3/4] w-full object-cover" />
            <p className="bg-espresso/70 py-2 text-center text-[9px] tracking-[0.28em] text-ivory/85 uppercase backdrop-blur">
              Cocoa Satin ✦ ₹549
            </p>
          </div>
        </motion.div>
        {/* Rotating monogram badge */}
        <div className="absolute right-[30%] top-[12%] h-28 w-28">
          <svg viewBox="0 0 120 120" className="h-full w-full motion-safe:animate-spin-slow">
            <defs>
              <path id="nv-circle" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
            </defs>
            <text fill="#B9945B" fontSize="10.5" letterSpacing="3.4" fontFamily="Jost, sans-serif">
              <textPath href="#nv-circle">{site.storeName.toUpperCase()} • PUSAD • NEW SEASON •</textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-gold">✦</span>
        </div>
        <span className="absolute right-[16%] bottom-[30%] font-display text-3xl text-gold/80 motion-safe:animate-floaty">✦</span>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pt-32 pb-28 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="flex items-center gap-3 text-[10px] font-medium tracking-[0.42em] text-gold uppercase md:text-[11px]"
        >
          <span className="h-px w-12 bg-gold" aria-hidden />
          Gold Plaza ✦ Sonar Line ✦ Pusad
        </motion.p>

        <h1
          aria-label={site.heroTitle}
          className="mt-6 font-display text-[clamp(4.6rem,15vw,14.5rem)] leading-[0.84] font-semibold tracking-[0.015em] text-ivory"
        >
          <Lines lines={[site.heroTitle]} delay={0.35} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-3xl text-blush italic md:text-5xl"
        >
          {site.heroSubtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.9 }}
          className="mt-4 max-w-md text-sm tracking-[0.06em] text-ivory/70 md:text-base"
        >
          {site.heroSupport}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Btn to="/shop?flag=new" tone="ivory">
              Shop New Arrivals <ArrowUpRight className="h-4 w-4" />
            </Btn>
          </Magnetic>
          <Magnetic>
            <Btn to="/visit" tone="outline-light">
              Visit Store
            </Btn>
          </Magnetic>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          href={site.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2.5 text-[11px] tracking-[0.3em] text-ivory/60 uppercase transition-colors hover:text-gold"
        >
          <Instagram className="h-4 w-4 text-gold" /> {site.instagramHandle}
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="text-[9px] tracking-[0.5em] text-ivory/60 uppercase">Scroll to explore</span>
        <span className="block h-12 w-px overflow-hidden bg-ivory/20">
          <span className="block h-full w-full bg-gold motion-safe:animate-pulse-line" />
        </span>
      </motion.div>
    </section>
  );
}
