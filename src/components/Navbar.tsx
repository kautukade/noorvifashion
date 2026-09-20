import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import { NAV_LINKS } from "../data/products";
import { useStore } from "../context/store";
import { cn, isWhatsAppReady } from "../utils/helpers";
import { storeConfig } from "../config/storeConfig";

export default function Navbar() {
  const { pathname } = useLocation();
  const { wishlist, setSearchOpen, pushToast, site } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";
  const dark = isHome && !scrolled && !open;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 36);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onWhatsApp = () => {
    if (isWhatsAppReady()) {
      window.open(`https://wa.me/${storeConfig.whatsappNumber}`, "_blank");
    } else {
      pushToast("WhatsApp number connects soon — set it in src/config/storeConfig.ts");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-all duration-500",
          dark
            ? "bg-transparent py-4"
            : "border-b border-espresso/10 bg-ivory/85 py-2.5 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 md:px-10">
          {/* Editable client shop name — plain text, no fixed logo/symbol */}
          <Link
            to="/"
            className={cn(
              "max-w-[55vw] break-words font-display text-[clamp(1.05rem,2.2vw,1.625rem)] leading-tight font-semibold tracking-[0.08em]",
              dark ? "text-ivory" : "text-espresso"
            )}
            aria-label={`${site.storeName} — home`}
          >
            {site.storeName}
          </Link>

          {/* Desktop links */}
          <nav
            className={cn(
              "hidden items-center gap-8 lg:flex",
              dark ? "text-ivory/90" : "text-espresso"
            )}
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) => {
              const active =
                pathname === l.to ||
                (l.to.startsWith("/shop") && pathname === "/shop" && l.to === "/shop");
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className={cn(
                    "group relative text-[11px] font-medium tracking-[0.22em] uppercase transition-colors",
                    active ? "text-gold" : "hover:text-gold"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right icons */}
          <div className={cn("flex items-center gap-1.5 md:gap-2", dark ? "text-ivory" : "text-espresso")}>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-full p-2.5 transition-colors hover:bg-gold/15 hover:text-gold"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>
            <Link
              to="/shop?wish=1"
              aria-label={`Wishlist, ${wishlist.length} items`}
              className="relative rounded-full p-2.5 transition-colors hover:bg-gold/15 hover:text-gold"
            >
              <Heart
                className="h-[18px] w-[18px]"
                strokeWidth={1.6}
                fill={wishlist.length ? "currentColor" : "none"}
              />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-espresso">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <a
              href={storeConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${site.storeName} on Instagram`}
              className="hidden rounded-full p-2.5 transition-colors hover:bg-gold/15 hover:text-gold sm:block"
            >
              <Instagram className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </a>
            <button
              type="button"
              onClick={onWhatsApp}
              aria-label="Chat on WhatsApp"
              className="hidden rounded-full bg-espresso p-2.5 text-ivory transition-all hover:bg-gold hover:text-espresso md:block"
            >
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2.5 transition-colors hover:bg-gold/15 hover:text-gold lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-6 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[130] flex flex-col bg-espresso px-7 pt-6 pb-10 text-ivory"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="max-w-[70vw] break-words font-display text-2xl leading-tight font-semibold tracking-[0.08em]">
                {site.storeName}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-full border border-ivory/25 p-3 transition-colors hover:border-gold hover:text-gold"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="mt-12 flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={l.to}
                    className="group flex items-center justify-between border-b border-ivory/10 py-3.5"
                  >
                    <span className="font-display text-4xl font-medium text-ivory transition-colors group-hover:text-gold">
                      {l.label}
                    </span>
                    <ArrowUpRight className="h-6 w-6 text-gold opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mt-auto space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex flex-wrap gap-x-6 gap-y-2.5 border-b border-ivory/10 pb-5">
                <Link to="/shop?flag=trending" className="text-[11px] font-medium tracking-[0.25em] text-ivory/60 uppercase transition-colors hover:text-gold">
                  Trending
                </Link>
                <Link to="/shop?flag=sale" className="text-[11px] font-medium tracking-[0.25em] text-ivory/60 uppercase transition-colors hover:text-gold">
                  Offers
                </Link>
                <Link to="/shop?wish=1" className="text-[11px] font-medium tracking-[0.25em] text-ivory/60 uppercase transition-colors hover:text-gold">
                  Wishlist
                </Link>
              </div>
              <p className="flex items-center gap-2 text-xs tracking-[0.18em] text-ivory/60 uppercase">
                <MapPin className="h-4 w-4 text-gold" /> Gold Plaza Complex, Sonar Line, Pusad
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={storeConfig.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-ivory/25 px-5 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:border-gold hover:text-gold"
                >
                  <Instagram className="h-4 w-4" /> {storeConfig.instagramHandle}
                </a>
                <button
                  type="button"
                  onClick={onWhatsApp}
                  className="flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-[11px] tracking-[0.22em] text-espresso uppercase transition-colors hover:bg-ivory"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
