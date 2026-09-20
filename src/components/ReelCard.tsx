import { Link } from "react-router-dom";
import { Instagram, Play } from "lucide-react";
import type { Reel } from "../data/products";
import { storeConfig } from "../config/storeConfig";
import { useStore } from "../context/store";
import { inr } from "../utils/helpers";

export default function ReelCard({ reel }: { reel: Reel }) {
  const { site } = useStore();
  return (
    <div className="group relative w-[240px] shrink-0 snap-center sm:w-[260px] md:w-auto md:shrink">
      <Link
        to={`/product/${reel.slug}`}
        data-cursor="play"
        className="relative block aspect-[9/16] overflow-hidden rounded-t-full bg-espresso"
        aria-label={`Watch reel: ${reel.title}`}
      >
        <img
          src={reel.image}
          alt={reel.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110 motion-safe:group-hover:animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-espresso/30" />

        {/* Reel chrome */}
        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-medium tracking-[0.3em] text-ivory/85 uppercase">
          ✦ {site.storeName} Reel
        </span>

        {/* Play button */}
        <span className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/60 bg-espresso/30 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold/90">
          <Play className="ml-1 h-6 w-6 text-ivory transition-colors group-hover:text-espresso" fill="currentColor" />
        </span>

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-2xl leading-none font-medium text-ivory italic">{reel.title}</p>
          <p className="mt-1.5 text-[11px] tracking-wide text-ivory/70">{reel.caption}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="bg-ivory px-2.5 py-1 font-display text-sm font-semibold text-espresso">
              {inr(reel.price)}
            </span>
            <span className="flex items-center gap-1 text-[9px] font-semibold tracking-[0.24em] text-gold uppercase">
              View look →
            </span>
          </div>
        </div>
      </Link>

      <a
        href={storeConfig.instagramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Open this reel on Instagram"
        className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ivory/40 bg-espresso/40 text-ivory backdrop-blur transition-all hover:border-gold hover:bg-gold hover:text-espresso"
      >
        <Instagram className="h-4 w-4" strokeWidth={1.7} />
      </a>
    </div>
  );
}
