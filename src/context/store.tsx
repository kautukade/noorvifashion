import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRICE_BANDS, PRODUCTS, type PriceBand, type Product } from "../data/products";
import { storeConfig } from "../config/storeConfig";
import { uid } from "../utils/helpers";

/* ───────────────────────── Types ───────────────────────── */

export type EnquiryStatus = "New" | "Confirmed" | "Delivered";

export type Enquiry = {
  id: string;
  productName: string;
  code: string;
  size: string;
  color: string;
  price: number;
  status: EnquiryStatus;
  createdAt: number;
};

export type SiteData = {
  heroTitle: string;
  heroSubtitle: string;
  heroSupport: string;
  offerTitle: string;
  offerBig: string;
  offerNote: string;
  hours: string;
  phone: string;
  instagramUrl: string;
  instagramHandle: string;
  addressLine2: string;
  addressLine3: string;
  hiddenReels: string[];
  hiddenLooks: string[];
  bands: PriceBand[];
};

type Toast = { id: string; msg: string };

type StoreCtx = {
  products: Product[];
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  isWished: (id: number) => boolean;
  enquiries: Enquiry[];
  addEnquiry: (e: Omit<Enquiry, "id" | "status" | "createdAt">) => void;
  setEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
  site: SiteData;
  saveSite: (patch: Partial<SiteData>) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  toasts: Toast[];
  pushToast: (msg: string) => void;
  resetDemo: () => void;
};

const DEFAULT_SITE: SiteData = {
  heroTitle: "NOORVI",
  heroSubtitle: "New looks. New you.",
  heroSupport: "Trending girls wear — now in Pusad.",
  offerTitle: "FASHION FROM",
  offerBig: "₹150*",
  offerNote: "*Demo promotional content. Update with current store offers.",
  hours: storeConfig.hours,
  phone: storeConfig.phone,
  instagramUrl: storeConfig.instagramUrl,
  instagramHandle: storeConfig.instagramHandle,
  addressLine2: storeConfig.address.line2,
  addressLine3: storeConfig.address.line3,
  hiddenReels: [],
  hiddenLooks: [],
  bands: PRICE_BANDS,
};

/* ─────────────────────── Persistence ─────────────────────── */

const KEYS = {
  products: "noorvi_products_v1",
  wishlist: "noorvi_wishlist_v1",
  enquiries: "noorvi_enquiries_v1",
  site: "noorvi_site_v1",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

/* ─────────────────────── Provider ─────────────────────── */

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    load(KEYS.products, PRODUCTS)
  );
  const [wishlist, setWishlist] = useState<number[]>(() =>
    load(KEYS.wishlist, [])
  );
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() =>
    load(KEYS.enquiries, [])
  );
  const [site, setSite] = useState<SiteData>(() => ({
    ...DEFAULT_SITE,
    ...load<Partial<SiteData>>(KEYS.site, {}),
  }));
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => save(KEYS.products, products), [products]);
  useEffect(() => save(KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => save(KEYS.enquiries, enquiries), [enquiries]);
  useEffect(() => save(KEYS.site, site), [site]);

  const pushToast = useCallback((msg: string) => {
    const id = uid();
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  const toggleWishlist = useCallback(
    (id: number) => {
      setWishlist((w) => {
        const has = w.includes(id);
        pushToast(has ? "Removed from wishlist" : "Saved to wishlist ♡");
        return has ? w.filter((x) => x !== id) : [...w, id];
      });
    },
    [pushToast]
  );

  const isWished = useCallback((id: number) => wishlist.includes(id), [wishlist]);

  const addEnquiry = useCallback(
    (e: Omit<Enquiry, "id" | "status" | "createdAt">) => {
      setEnquiries((list) => [
        { ...e, id: uid(), status: "New", createdAt: Date.now() },
        ...list,
      ]);
    },
    []
  );

  const setEnquiryStatus = useCallback((id: string, status: EnquiryStatus) => {
    setEnquiries((list) =>
      list.map((e) => (e.id === id ? { ...e, status } : e))
    );
  }, []);

  const upsertProduct = useCallback((p: Product) => {
    setProducts((list) => {
      const i = list.findIndex((x) => x.id === p.id);
      if (i === -1) return [p, ...list];
      const next = [...list];
      next[i] = p;
      return next;
    });
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((list) => list.filter((p) => p.id !== id));
  }, []);

  const saveSite = useCallback((patch: Partial<SiteData>) => {
    setSite((s) => ({ ...s, ...patch }));
  }, []);

  const resetDemo = useCallback(() => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    setProducts(PRODUCTS);
    setWishlist([]);
    setEnquiries([]);
    setSite(DEFAULT_SITE);
    pushToast("Demo data reset to defaults");
  }, [pushToast]);

  const value = useMemo<StoreCtx>(
    () => ({
      products,
      wishlist,
      toggleWishlist,
      isWished,
      enquiries,
      addEnquiry,
      setEnquiryStatus,
      upsertProduct,
      deleteProduct,
      site,
      saveSite,
      searchOpen,
      setSearchOpen,
      toasts,
      pushToast,
      resetDemo,
    }),
    [
      products,
      wishlist,
      toggleWishlist,
      isWished,
      enquiries,
      addEnquiry,
      setEnquiryStatus,
      upsertProduct,
      deleteProduct,
      site,
      saveSite,
      searchOpen,
      toasts,
      pushToast,
      resetDemo,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
