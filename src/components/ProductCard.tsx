import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Heart } from "lucide-react";
import type { Product } from "../data/products";
import { useStore } from "../context/store";
import { cn, discountPct, inr, stockInfo } from "../utils/helpers";
import { SmartImg } from "./ui";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWished } = useStore();
  const wished = isWished(product.id);
  const pct = discountPct(product.price, product.originalPrice);
  const stock = stockInfo(product);
  const soldOut = stock.tone === "out";

  return (
    <div className="group relative">
      <Link
        to={`/product/${product.slug}`}
        data-cursor="view"
        className="block focus-visible:outline-2 focus-visible:outline-gold"
        aria-label={`View ${product.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-nude">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-0",
              soldOut && "opacity-60 grayscale"
            )}
          />
          <img
            src={product.hoverImage}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full scale-[1.06] object-cover opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100",
              soldOut && "opacity-0 grayscale"
            )}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-gold px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-espresso">
                NEW
              </span>
            )}
            {product.isTrending && (
              <span className="bg-espresso px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-ivory">
                TRENDING
              </span>
            )}
            {pct > 0 && (
              <span className="bg-ivory/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-choco">
                −{pct}%
              </span>
            )}
            {soldOut && (
              <span className="bg-blush px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-espresso">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Quick view bar (desktop) */}
          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-center gap-2 bg-ivory/95 py-3.5 text-[10px] font-medium tracking-[0.3em] text-espresso uppercase backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 md:flex">
            <Eye className="h-3.5 w-3.5 text-gold" /> Quick view
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Wishlist */}
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        aria-pressed={wished}
        className={cn(
          "absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-all duration-300",
          wished
            ? "border-gold bg-gold text-espresso"
            : "border-espresso/15 bg-ivory/85 text-espresso hover:border-gold hover:text-gold"
        )}
      >
        <motion.span
          key={wished ? "on" : "off"}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
        >
          <Heart className="h-4 w-4" strokeWidth={1.8} fill={wished ? "currentColor" : "none"} />
        </motion.span>
      </button>

      {/* Info */}
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${product.slug}`} className="min-w-0">
            <h3 className="truncate font-display text-lg leading-snug font-semibold text-espresso transition-colors group-hover:text-gold md:text-xl">
              {product.name}
            </h3>
          </Link>
          <div className="flex shrink-0 gap-1 pt-1.5" aria-label="Available colours">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-espresso/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
        <p className="mt-0.5 text-[10px] tracking-[0.22em] text-choco/50 uppercase">{product.code}</p>
        <div className="mt-1.5 flex items-baseline gap-2.5">
          <span className="font-display text-xl font-semibold text-espresso">{inr(product.price)}</span>
          {pct > 0 && (
            <>
              <span className="text-sm text-choco/45 line-through">{inr(product.originalPrice)}</span>
              <span className="text-xs font-medium tracking-wide text-gold">save {pct}%</span>
            </>
          )}
        </div>
        <p className="mt-1 text-[10px] tracking-[0.18em] text-choco/45 uppercase">
          {product.sizes.join(" · ")}
        </p>
      </div>
    </div>
  );
}
