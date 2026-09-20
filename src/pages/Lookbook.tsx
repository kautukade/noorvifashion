import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { LOOKS } from "../data/products";
import { useStore } from "../context/store";
import { cn } from "../utils/helpers";
import { Btn, Eyebrow, Lines, Reveal } from "../components/ui";

export default function Lookbook() {
  const { site } = useStore();
  const looks = LOOKS.filter((l) => !site.hiddenLooks.includes(l.id));

  return (
    <div className="bg-ivory">
      {/* Editorial header */}
      <header className="grain relative overflow-hidden bg-espresso px-6 pt-36 pb-20 text-ivory md:px-10 md:pt-44 md:pb-28">
        <span aria-hidden className="absolute -right-8 top-10 font-display text-[22vw] leading-none text-stroke-ivory opacity-20 select-none">
          01
        </span>
        <div className="relative mx-auto max-w-[1500px]">
          <Eyebrow tone="light">Editorial · Issue 01</Eyebrow>
          <h1 className="mt-6 font-display text-6xl leading-[0.9] font-semibold md:text-[9rem]">
            <Lines lines={[<>{site.storeName}</>, <em key="l" className="text-gold">looks ✦</em>]} />
          </h1>
          <p className="mt-6 font-display text-2xl text-blush italic md:text-4xl">Style it your way.</p>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-ivory/65 md:text-base">
            Eight moods from the rack — shot warm, styled honest, priced for real life.
            Every look below is in store at Gold Plaza right now.
          </p>
        </div>
      </header>

      {/* Masonry editorial */}
      <section className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24">
        <div className="columns-1 gap-7 sm:columns-2 lg:columns-3 [&>*]:mb-7">
          {looks.map((look, i) => (
            <Reveal key={look.id} delay={(i % 3) * 0.08} className="break-inside-avoid">
              {i === 3 && (
                <blockquote className="mb-7 border-l-2 border-gold bg-cream p-8">
                  <p className="font-display text-3xl leading-snug text-espresso italic md:text-4xl">
                    “Dress like the main character — because you are.”
                  </p>
                  <footer className="mt-4 text-[10px] tracking-[0.35em] text-gold uppercase">— {site.storeName}</footer>
                </blockquote>
              )}
              <figure className="group relative overflow-hidden bg-espresso" data-cursor="view">
                <Link to="/shop" aria-label={`Look ${String(i + 1).padStart(2, "0")} — ${look.title}`}>
                  <img
                    src={look.image}
                    alt={`${look.title} — ${site.storeName} lookbook`}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]",
                      look.tall ? "aspect-[3/4]" : "aspect-[4/5]"
                    )}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                    <span>
                      <span className="block font-display text-3xl text-gold italic">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block font-display text-2xl font-medium text-ivory">{look.title}</span>
                      <span className="mt-1 block text-[9px] tracking-[0.35em] text-ivory/65 uppercase">{look.tag}</span>
                    </span>
                    <span className="flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border border-ivory/50 text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:border-gold group-hover:text-gold">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </figcaption>
                </Link>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-espresso/10 bg-cream px-6 py-20 text-center md:py-24">
        <Reveal>
          <p className="font-display text-4xl leading-tight font-semibold text-espresso md:text-6xl">
            Love a look? <em className="text-gold">It's on the rack.</em>
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-choco/70">
            Everything in this editorial is live in store — come try it, or claim it on WhatsApp.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Btn to="/shop" tone="dark">
              Shop the looks <ArrowUpRight className="h-4 w-4" />
            </Btn>
            <Btn to="/visit" tone="outline-dark">
              Visit the boutique
            </Btn>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
