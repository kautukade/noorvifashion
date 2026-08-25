import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "../utils/helpers";

/* ─────────────────────── Hooks ─────────────────────── */

export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const fn = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return fine;
}

/* ─────────────────────── SmartImg ─────────────────────── */

export function SmartImg({
  src,
  alt,
  className,
  imgClass,
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClass?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-nude via-cream to-blush",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-6xl italic text-choco/40">N✦</span>
      </div>
    );
  }
  return (
    <div className={cn("overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", imgClass)}
      />
    </div>
  );
}

/* ─────────────────────── Reveal ─────────────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 34,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────── Lines (mask reveal) ─────────────────────── */

export function Lines({
  lines,
  className,
  lineClass,
  delay = 0,
  stagger = 0.1,
}: {
  lines: ReactNode[];
  className?: string;
  lineClass?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={cn("block overflow-hidden pb-[0.08em]", className)}>
          <motion.span
            className={cn("block will-change-transform", lineClass)}
            initial={{ y: "112%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.95, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/* ─────────────────────── Eyebrow / SectionHead ─────────────────────── */

export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.4em] md:text-[11px]",
        tone === "dark" ? "text-choco/70" : "text-ivory/70",
        className
      )}
    >
      <span className="h-px w-10 bg-gold" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  copy,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode[];
  copy?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Eyebrow tone={tone} className={cn(align === "center" && "justify-center")}>
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "mt-5 font-display text-5xl leading-[0.95] font-semibold md:text-7xl",
          tone === "dark" ? "text-espresso" : "text-ivory"
        )}
      >
        <Lines lines={title} />
      </h2>
      {copy && (
        <Reveal delay={0.25}>
          <p
            className={cn(
              "mt-5 max-w-md text-sm leading-relaxed md:text-base",
              tone === "dark" ? "text-choco/80" : "text-ivory/70",
              align === "center" && "mx-auto"
            )}
          >
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ─────────────────────── Marquee ─────────────────────── */

export function Marquee({
  items,
  tone = "dark",
  slow,
  reverse,
  className,
}: {
  items: string[];
  tone?: "dark" | "gold";
  slow?: boolean;
  reverse?: boolean;
  className?: string;
}) {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span
            className={cn(
              "px-6 font-display text-2xl font-medium tracking-wide italic md:px-10 md:text-4xl",
              tone === "dark" ? "text-ivory" : "text-espresso"
            )}
          >
            {it}
          </span>
          <span className={cn("text-xl", tone === "dark" ? "text-gold" : "text-espresso")}>✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div
      className={cn(
        "overflow-hidden border-y py-4 md:py-5",
        tone === "dark"
          ? "border-espresso/10 bg-espresso"
          : "border-gold/25 bg-gold/90",
        className
      )}
    >
      <div
        className={cn("flex w-max", slow ? "animate-marquee-slow" : "animate-marquee")}
        style={{ animationDirection: reverse ? "reverse" : undefined }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ─────────────────────── Btn ─────────────────────── */

type BtnTone = "dark" | "ivory" | "gold" | "outline-dark" | "outline-light";

const toneStyles: Record<BtnTone, string> = {
  dark: "bg-espresso text-ivory",
  ivory: "bg-ivory text-espresso",
  gold: "bg-gold text-espresso",
  "outline-dark": "border border-espresso/40 text-espresso",
  "outline-light": "border border-ivory/50 text-ivory",
};

const fillStyles: Record<BtnTone, string> = {
  dark: "bg-gold",
  ivory: "bg-espresso",
  gold: "bg-espresso",
  "outline-dark": "bg-espresso",
  "outline-light": "bg-ivory",
};

const hoverText: Record<BtnTone, string> = {
  dark: "group-hover:text-espresso",
  ivory: "group-hover:text-ivory",
  gold: "group-hover:text-ivory",
  "outline-dark": "group-hover:text-ivory",
  "outline-light": "group-hover:text-espresso",
};

export function Btn({
  to,
  href,
  onClick,
  children,
  tone = "dark",
  className,
  external,
}: {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  tone?: BtnTone;
  className?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-[103%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0",
          fillStyles[tone]
        )}
      />
      <span
        className={cn(
          "relative z-10 flex items-center gap-3 transition-colors duration-500",
          hoverText[tone]
        )}
      >
        {children}
      </span>
    </>
  );
  const base = cn(
    "group relative inline-flex items-center justify-center overflow-hidden px-8 py-4 text-[11px] font-medium tracking-[0.25em] uppercase",
    toneStyles[tone],
    className
  );
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={base}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={base}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {inner}
    </button>
  );
}

/* ─────────────────────── Magnetic ─────────────────────── */

export function Magnetic({
  children,
  className,
  strength = 16,
  style,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 160, damping: 16, mass: 0.4 });

  if (!fine || reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
        y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
