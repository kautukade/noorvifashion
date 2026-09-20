import Hero from "../sections/Hero";
import HomeJournal from "../sections/HomeJournal";
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
import { useStore } from "../context/store";

export default function Home() {
  const { site } = useStore();
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
      <HomeJournal />
      <WhyNoorvi />
      <Testimonials />
      <InstagramGrid />
      <VisitStore />
      <Marquee
        items={[`${site.storeName} Era`, "Style It Your Way", "Sonar Line", "Fresh Drops", "Shop Local"]}
        tone="gold"
        reverse
        slow
      />
      <Newsletter />
    </>
  );
}
