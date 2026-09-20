import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { useStore } from "../context/store";
import { storeConfig } from "../config/storeConfig";
import { isWhatsAppReady } from "../utils/helpers";
import { Reveal } from "./ui";

const EXPLORE = [
  { label: "Shop All", to: "/shop" },
  { label: "New Arrivals", to: "/shop?flag=new" },
  { label: "Trending", to: "/shop?flag=trending" },
  { label: "Offers", to: "/shop?flag=sale" },
  { label: "Journal", to: "/blog" },
];

const BOUTIQUE = [
  { label: "Lookbook", to: "/lookbook" },
  { label: "Visit Store", to: "/visit" },
  { label: "Instagram", href: storeConfig.instagramUrl },
];

const HELP = [
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
  { label: "Exchange Policy", to: "/exchange" },
];

export default function Footer() {
  const { site, pushToast } = useStore();
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden bg-espresso text-ivory">
      {/* Giant wordmark */}
      <div className="px-4 pt-16 md:pt-24">
        <Reveal y={60}>
          <Link
            to="/"
            aria-label={`Back to top — ${site.storeName}`}
            className="block text-center font-display text-[21vw] leading-[0.85] font-semibold tracking-[0.04em] text-stroke-ivory transition-colors duration-700 select-none hover:text-ivory md:text-[17vw]"
          >
            {site.storeName}
          </Link>
        </Reveal>
        <p className="mt-2 text-center text-[10px] tracking-[0.5em] text-gold uppercase md:text-[11px]">
          Fashion ✦ Pusad ✦ Est. with love
        </p>
      </div>

      {/* Columns */}
      <div className="mx-auto mt-16 grid max-w-[1500px] gap-12 border-t border-ivory/10 px-6 py-14 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <p className="font-display text-3xl font-semibold">
            {site.storeName}<span className="text-gold">✦</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
            Trend-led girls wear at honest prices — corsets, tees, party looks and
            everything your feed is obsessed with, right here in Pusad.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 transition-all hover:border-gold hover:bg-gold hover:text-espresso"
            >
              <Instagram className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </a>
            <button
              type="button"
              aria-label="WhatsApp"
              onClick={() => {
                if (isWhatsAppReady()) window.open(`https://wa.me/${storeConfig.whatsappNumber}`, "_blank");
                else pushToast("WhatsApp number connects soon — set it in src/config/storeConfig.ts");
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 transition-all hover:border-gold hover:bg-gold hover:text-espresso"
            >
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>
            <a
              href="mailto:hello@noorvi.demo"
              aria-label="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 transition-all hover:border-gold hover:bg-gold hover:text-espresso"
            >
              <Mail className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[10px] tracking-[0.35em] text-gold uppercase">Explore</p>
          <ul className="mt-5 space-y-3">
            {EXPLORE.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="group inline-flex items-center gap-1.5 text-sm text-ivory/70 transition-colors hover:text-gold"
                >
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[10px] tracking-[0.35em] text-gold uppercase">Boutique</p>
          <ul className="mt-5 space-y-3">
            {BOUTIQUE.map((l) => (
              <li key={l.label}>
                {"to" in l && l.to ? (
                  <Link to={l.to} className="text-sm text-ivory/70 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ivory/70 transition-colors hover:text-gold"
                  >
                    {l.label} ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[10px] tracking-[0.35em] text-gold uppercase">Help</p>
          <ul className="mt-5 space-y-3">
            {HELP.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ivory/70 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[10px] tracking-[0.35em] text-gold uppercase">Find us</p>
          <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-ivory/70">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
            <span>
              {site.storeName}
              <br />
              {site.addressLine2}
              <br />
              {site.addressLine3}
            </span>
          </p>
          <p className="mt-3 text-xs text-ivory/50">{site.hours}</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 text-[10px] tracking-[0.28em] text-ivory/45 uppercase md:flex-row">
          <p>© {year} {site.storeName} — Pusad, Maharashtra</p>
          <p className="text-gold/80">Crafted with ✦ for the girls of Pusad</p>
          <Link to="/admin" className="transition-colors hover:text-gold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
