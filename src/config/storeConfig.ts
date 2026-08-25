/**
 * ─────────────────────────────────────────────────────────────
 *  NOORVI FASHION — CENTRAL BUSINESS CONFIGURATION
 *  Edit this ONE file to connect the store's real details.
 * ─────────────────────────────────────────────────────────────
 */
export const storeConfig = {
  name: "Noorvi Fashion",
  altName: "Noorvi Ladies Wear",
  tagline: "Trending Girls Wear in Pusad",

  // Instagram — already real for Noorvi
  instagramUrl: "https://instagram.com/noorvi__fashion_",
  instagramHandle: "@noorvi__fashion_",

  /**
   * WhatsApp number in international format, digits only (no +, no spaces).
   * Example for India: "919876543210"
   * Until it is replaced, the site shows a message preview instead of opening WhatsApp.
   */
  whatsappNumber: "REPLACE_WITH_NOORVI_NUMBER",

  /** Store phone number, e.g. "919876543210" — leave "" until available. */
  phone: "",

  address: {
    line1: "Noorvi Fashion",
    line2: "Gold Plaza Complex, Sonar Line",
    line3: "Pusad, Maharashtra 445204",
  },

  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Gold+Plaza+Complex+Sonar+Line+Pusad+Maharashtra+445204",

  /** Sample hours — replace with real timing (also editable in /admin). */
  hours: "Open daily · 10:30 AM – 9:00 PM (sample)",

  media: {
    /**
     * Optional cinematic hero video.
     * Drop a file at  public/videos/hero.mp4  and set this to "/videos/hero.mp4".
     * While empty, the site uses the editorial image with a cinematic slow zoom.
     */
    heroVideo: "",
    campaignVideo: "",
  },

  currency: "₹",
  adminDemoPassword: "noorvi",
};

export type StoreConfig = typeof storeConfig;
