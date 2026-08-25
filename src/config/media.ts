/**
 * ─────────────────────────────────────────────────────────────
 *  CENTRAL MEDIA LIBRARY
 *  Every photo used across the site lives here, so swapping in
 *  Noorvi's real photos / reels later means editing ONE file.
 *
 *  To use local files instead: place them in public/images/ and
 *  change a value to "/images/your-file.jpg".
 * ─────────────────────────────────────────────────────────────
 */
export const MEDIA = {
  hero: "https://image.qwenlm.ai/generated-images/d53dda52-f36b-473b-8459-778637d1e5ea/_result.png",
  look1: "https://image.qwenlm.ai/generated-images/6bf64711-713a-4b24-94eb-117e9cc00bad/_result.png", // blush pink corset
  look2: "https://image.qwenlm.ai/generated-images/2df833e7-4515-4986-b622-9cc81ae39329/_result.png", // white halter
  look3: "https://image.qwenlm.ai/generated-images/07d1b8bd-99ef-416c-91ad-a89ba9e6317a/_result.png", // black ribbed
  look4: "https://image.qwenlm.ai/generated-images/b7201d81-5e8d-4eee-869e-c8b1b5171660/_result.png", // denim
  look5: "https://image.qwenlm.ai/generated-images/eed450e5-ee84-4819-8174-40764f45c618/_result.png", // chocolate corset
  look6: "https://image.qwenlm.ai/generated-images/34b204db-0bde-4aef-a26e-7b821eb1337a/_result.png", // beige knit
  look7: "https://image.qwenlm.ai/generated-images/7e1276bb-1f4f-4083-82de-c0ab284710d3/_result.png", // red sporty tee
  look8: "https://image.qwenlm.ai/generated-images/dfe901d3-42f0-4068-b6cb-3deb9de99226/_result.png", // baby pink party
  store: "https://image.qwenlm.ai/generated-images/4825bc44-afff-46a0-86e8-527ddd3b0500/_result.png",
} as const;

export type MediaKey = keyof typeof MEDIA;

/** Options shown in the admin panel media pickers. */
export const MEDIA_OPTIONS: { value: string; label: string }[] = [
  { value: MEDIA.hero, label: "Campaign — Hero" },
  { value: MEDIA.look1, label: "Look 1 — Blush Corset" },
  { value: MEDIA.look2, label: "Look 2 — White Halter" },
  { value: MEDIA.look3, label: "Look 3 — Black Ribbed" },
  { value: MEDIA.look4, label: "Look 4 — Denim" },
  { value: MEDIA.look5, label: "Look 5 — Chocolate Corset" },
  { value: MEDIA.look6, label: "Look 6 — Beige Knit" },
  { value: MEDIA.look7, label: "Look 7 — Red Tee" },
  { value: MEDIA.look8, label: "Look 8 — Baby Pink Party" },
  { value: MEDIA.store, label: "Boutique Interior" },
];
