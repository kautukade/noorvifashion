import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Eyebrow, Lines, Reveal } from "../components/ui";

const CONTENT: Record<
  string,
  { title: string; italic: string; body: string[] }
> = {
  terms: {
    title: "Terms",
    italic: "of shopping ✦",
    body: [
      "Noorvi Fashion is a local ladies wear boutique at Gold Plaza Complex, Sonar Line, Pusad. All products shown on this website reflect in-store stock and may sell out without notice.",
      "Prices displayed are indicative demo prices until the live catalogue is connected. Final billing happens at the store or over an confirmed WhatsApp order.",
      "Orders placed via WhatsApp are reservations, not prepaid purchases — payment is collected at pickup or delivery as agreed with the store.",
      "This page is a demo document. The store owner will replace it with official terms before launch.",
    ],
  },
  privacy: {
    title: "Privacy",
    italic: "& your data ✦",
    body: [
      "This demo website stores your wishlist and order drafts only in your own browser (local storage). Nothing is sent to any server.",
      "When you tap 'Order on WhatsApp', the message is prepared for you and opens in WhatsApp — Noorvi never sees your number unless you send it.",
      "No tracking pixels, no data selling, no nonsense. Full privacy policy will be published by the store before launch.",
      "This page is a demo document and will be replaced with the official privacy policy.",
    ],
  },
  exchange: {
    title: "Exchange",
    italic: "policy ✦",
    body: [
      "We want you to love what you wear. Unused items with tags can be exchanged at the store within the window the boutique announces.",
      "Party wear, bodysuits and sale items may carry special conditions — always confirm on WhatsApp before purchasing.",
      "Bring your bill or the WhatsApp order confirmation for a smooth exchange at Gold Plaza Complex, Sonar Line.",
      "This page is a demo document. The final exchange policy will be set and published by the store owner.",
    ],
  },
};

export default function Info({ type }: { type: string }) {
  const c = CONTENT[type];
  if (!c) return <Navigate to="/" replace />;

  return (
    <div className="bg-ivory pt-36 pb-28 md:pt-44">
      <div className="mx-auto max-w-3xl px-6">
        <Eyebrow>The fine print</Eyebrow>
        <h1 className="mt-5 font-display text-6xl leading-[0.92] font-semibold text-espresso md:text-7xl">
          <Lines
            lines={[
              <>{c.title}</>,
              <em key="i" className="text-gold">
                {c.italic}
              </em>,
            ]}
          />
        </h1>
        <div className="mt-10 space-y-6">
          {c.body.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="border-l-2 border-gold/40 pl-5 text-sm leading-relaxed text-choco/80 md:text-base">{p}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <Link
            to="/"
            className="group mt-14 inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-espresso uppercase hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Noorvi
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
