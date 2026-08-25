import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useStore } from "../context/store";
import { inr } from "../utils/helpers";
import { SmartImg } from "./ui";

const SUGGESTIONS = [
  { label: "Tops", to: "/shop?cat=tops" },
  { label: "Corsets", to: "/shop?cat=corsets" },
  { label: "T-Shirts", to: "/shop?cat=tshirts" },
  { label: "New Arrivals", to: "/shop?flag=new" },
  { label: "Under ₹499", to: "/shop?max=499" },
];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen, products } = useStore();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) =>
        [p.name, p.code, p.category, ...p.colors.map((c) => c.name)]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
      .slice(0, 6);
  }, [q, products]);

  const go = (to: string) => {
    setSearchOpen(false);
    navigate(to);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-y-auto bg-ivory"
          initial={{ clipPath: "circle(0% at calc(100% - 60px) 40px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 60px) 40px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 60px) 40px)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div className="mx-auto max-w-4xl px-6 py-10 md:py-16">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-3 text-[10px] tracking-[0.4em] text-choco/60 uppercase">
                <span className="h-px w-10 bg-gold" /> Search the rack
              </p>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="rounded-full border border-espresso/20 p-3 transition-colors hover:border-gold hover:text-gold"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <h2 className="mt-8 font-display text-4xl leading-tight font-semibold text-espresso md:text-6xl">
              What are you <em className="text-gold">looking for?</em>
            </h2>

            <div className="mt-10 flex items-center gap-4 border-b-2 border-espresso pb-4">
              <Search className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.5} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") go(`/shop?q=${encodeURIComponent(q)}`);
                }}
                placeholder="Corsets, tees, party tops…"
                className="w-full bg-transparent font-display text-2xl text-espresso outline-none placeholder:text-choco/35 md:text-4xl"
                aria-label="Search products"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="text-[10px] tracking-[0.3em] text-choco/50 uppercase hover:text-gold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Suggestions */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] tracking-[0.3em] text-choco/50 uppercase">Try:</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => go(s.to)}
                  className="rounded-full border border-espresso/20 px-4 py-2 text-xs tracking-wide text-choco transition-all hover:border-gold hover:bg-gold hover:text-espresso"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Live results */}
            {q.trim() && (
              <div className="mt-10">
                {results.length === 0 ? (
                  <p className="font-display text-2xl text-choco/60 italic">
                    Nothing matched “{q}” — try “corset” or “tee”.
                  </p>
                ) : (
                  <ul className="divide-y divide-espresso/10">
                    {results.map((p, i) => (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={`/product/${p.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex items-center gap-5 py-4 transition-colors hover:bg-cream/60"
                        >
                          <SmartImg
                            src={p.image}
                            alt={p.name}
                            className="h-20 w-16 shrink-0 rounded-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-xl text-espresso md:text-2xl">
                              {p.name}
                            </p>
                            <p className="text-xs tracking-[0.2em] text-choco/55 uppercase">
                              {p.code} · {p.category}
                            </p>
                          </div>
                          <span className="font-display text-xl text-gold">{inr(p.price)}</span>
                          <ArrowRight className="h-5 w-5 text-gold opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => go(`/shop?q=${encodeURIComponent(q)}`)}
                  className="mt-6 text-[11px] tracking-[0.3em] text-espresso uppercase underline decoration-gold underline-offset-8 transition-colors hover:text-gold"
                >
                  View all results →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
