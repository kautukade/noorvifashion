import Hero from "../sections/Hero";
import { JustDropped, ShopVibe, Showcase } from "../sections/HomeUpper";
import {
  Campaign,
  InstagramGrid,
  Newsletter,
  OfferBanner,
  PriceBands,
  Testimonials,
  TrendingReels,
  VisitStore,
  WhyNoorvi,
} from "../sections/HomeLower";
import { Marquee } from "../components/ui";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee
        items={["New Arrivals", "Trending Now", "Pusad", "Girls Wear", "Corset Season", "Under ₹499"]}
        tone="dark"
      />
      <JustDropped />
      <ShopVibe />
      <Showcase />
      <TrendingReels />
      <Campaign />
      <OfferBanner />
      <PriceBands />
      <WhyNoorvi />
      <Testimonials />
      <InstagramGrid />
      <VisitStore />
      <Marquee
        items={["Noorvi Era", "Style It Your Way", "Sonar Line", "Fresh Drops", "Shop Local"]}
        tone="gold"
        reverse
        slow
      />
      <Newsletter />
    </>
  );
}
