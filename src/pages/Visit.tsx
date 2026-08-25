import {
  ArrowUpRight,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { MEDIA } from "../config/media";
import { storeConfig } from "../config/storeConfig";
import { useStore } from "../context/store";
import { isWhatsAppReady } from "../utils/helpers";
import { Btn, Eyebrow, Lines, Reveal, SmartImg } from "../components/ui";

const GOOD_TO_KNOW = [
  { icon: ShoppingBag, text: "Trial room available — bring your best friend for opinions" },
  { icon: Sparkles, text: "New stock lands weekly, follow Instagram for drop alerts" },
  { icon: MapPin, text: "Right on Sonar Line — easy to find, easier to justify" },
];

export default function Visit() {
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
    <div className="bg-ivory pt-32 md:pt-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Eyebrow>Find us</Eyebrow>
        <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.9] font-semibold text-espresso md:text-[8rem]">
          <Lines lines={[<>Visit</>, <em key="n" className="text-gold">Noorvi ✦</em>]} />
        </h1>
        <Reveal delay={0.25}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-choco/75 md:text-base">
            Noorvi Ladies Wear lives inside Gold Plaza Complex on Sonar Line — the heart of
            Pusad's shopping stretch. Walk in for the rack, stay for the styling advice.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-5">
          {/* Info card */}
          <Reveal className="lg:col-span-2">
            <div className="border border-espresso/12 bg-cream">
              <div className="border-b border-espresso/12 bg-espresso px-8 py-6">
                <p className="font-display text-3xl font-semibold text-ivory">
                  Noorvi<span className="text-gold">✦</span> Fashion
                </p>
                <p className="mt-1 text-[10px] tracking-[0.3em] text-gold uppercase">Ladies wear boutique</p>
              </div>
              <dl className="divide-y divide-espresso/10 px-8">
                <div className="flex items-start gap-4 py-5">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="text-[10px] tracking-[0.3em] text-choco/55 uppercase">Address</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-espresso">
                      {storeConfig.address.line1}
                      <br />
                      {site.addressLine2}
                      <br />
                      {site.addressLine3}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4 py-5">
                  <Clock className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="text-[10px] tracking-[0.3em] text-choco/55 uppercase">Hours</dt>
                    <dd className="mt-1 text-sm text-espresso">{site.hours}</dd>
                    <dd className="mt-1 text-[10px] tracking-wide text-choco/50 uppercase">Sample timing — update in admin</dd>
                  </div>
                </div>
                <div className="flex items-start gap-4 py-5">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="text-[10px] tracking-[0.3em] text-choco/55 uppercase">Phone</dt>
                    <dd className="mt-1 text-sm text-espresso">
                      {site.phone ? site.phone : "Connects soon — WhatsApp meanwhile"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4 py-5">
                  <Instagram className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="text-[10px] tracking-[0.3em] text-choco/55 uppercase">Instagram</dt>
                    <dd className="mt-1">
                      <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="text-sm text-espresso underline decoration-gold underline-offset-4 hover:text-gold">
                        {site.instagramHandle}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
              <div className="flex flex-col gap-3 border-t border-espresso/12 px-8 py-7">
                <Btn href={storeConfig.mapsUrl} external tone="gold">
                  Get directions <ArrowUpRight className="h-4 w-4" />
                </Btn>
                <div className="flex gap-3">
                  <Btn onClick={onWhatsApp} tone="dark" className="flex-1">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Btn>
                  <Btn onClick={onCall} tone="outline-dark" className="flex-1">
                    <Phone className="h-4 w-4" /> Call
                  </Btn>
                </div>
              </div>
            </div>

            {/* Good to know */}
            <ul className="mt-8 space-y-4">
              {GOOD_TO_KNOW.map((g, i) => (
                <Reveal key={g.text} delay={i * 0.08}>
                  <li className="flex items-center gap-4 border border-espresso/12 bg-ivory px-6 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
                      <g.icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <p className="text-sm text-choco/80">{g.text}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Reveal>

          {/* Media + map */}
          <div className="space-y-8 lg:col-span-3">
            <Reveal delay={0.15} y={46}>
              <div className="relative">
                <div className="absolute -inset-3 -translate-x-3 translate-y-3 border border-gold/50" aria-hidden />
                <SmartImg src={MEDIA.store} alt="Inside the Noorvi boutique" className="relative aspect-[4/3] w-full" />
                <span className="absolute top-5 left-5 bg-gold px-4 py-2 text-[10px] font-semibold tracking-[0.3em] text-espresso uppercase shadow-lg motion-safe:animate-floaty">
                  Gold Plaza ✦ Sonar Line
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="border border-espresso/12">
                <div className="flex items-center justify-between border-b border-espresso/12 bg-cream px-6 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-choco/60 uppercase">Map · Pusad 445204</p>
                  <a
                    href={storeConfig.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-gold uppercase hover:text-espresso"
                  >
                    Open in Maps <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
                <iframe
                  title="Noorvi Fashion on the map — Gold Plaza Complex, Sonar Line, Pusad"
                  src="https://maps.google.com/maps?q=Gold%20Plaza%20Complex%20Sonar%20Line%20Pusad%20Maharashtra&t=&z=15&ieUTF8&iwloc=&output=embed"
                  className="h-[340px] w-full border-0 grayscale-[35%] sepia-[18%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom strip */}
        <Reveal className="mt-20">
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-espresso/12 py-10">
            <p className="font-display text-3xl leading-tight text-espresso italic md:text-4xl">
              Can't make it today? <span className="text-choco/60">The rack comes to your DMs.</span>
            </p>
            <div className="flex gap-4">
              <Btn to="/shop" tone="dark">
                Browse the shop <ArrowUpRight className="h-4 w-4" />
              </Btn>
              <Btn href={storeConfig.instagramUrl} external tone="outline-dark">
                Follow the drops
              </Btn>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="h-24" />
    </div>
  );
}
