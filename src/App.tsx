import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  AnimatePresence,
  motion,
  MotionConfig,
} from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { StoreProvider, useStore } from "./context/store";
import { storeConfig } from "./config/storeConfig";
import { isWhatsAppReady } from "./utils/helpers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import SearchOverlay from "./components/SearchOverlay";
import Loader from "./components/Loader";
import Home from "./pages/Home";

const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Lookbook = lazy(() => import("./pages/Lookbook"));
const Visit = lazy(() => import("./pages/Visit"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Info = lazy(() => import("./pages/Info"));
const Admin = lazy(() => import("./pages/Admin"));

const DEFAULT_BRAND = "NOORVI";
const BRAND_PATTERNS = [
  /NOORVI FASHION/g,
  /Noorvi Ladies Wear/g,
  /Noorvi Fashion/g,
  /\bNOORVI\b/g,
  /\bNoorvi\b/g,
];

function escapeRegExp(value: string) {
  const special = "\\^$.*+?()[]{}|";
  return value
    .split("")
    .map((char) => (special.includes(char) ? "\\" + char : char))
    .join("");
}

/** Keep the existing design untouched while swapping Noorvi branding for the saved shop name. */
function BrandingSync() {
  const { site } = useStore();
  const previousName = useRef(DEFAULT_BRAND);

  useEffect(() => {
    const name = site.shopName.trim() || DEFAULT_BRAND;
    const previous = previousName.current;
    const token = "__DYNAMIC_SHOP_NAME__";

    const brandify = (value: string) => {
      let next = value;

      if (previous && previous !== DEFAULT_BRAND && previous !== name) {
        next = next.replace(new RegExp(escapeRegExp(previous), "g"), name);
      }

      if (name === DEFAULT_BRAND) return next;

      next = next.split(name).join(token);
      for (const pattern of BRAND_PATTERNS) next = next.replace(pattern, name);
      return next.split(token).join(name);
    };

    const syncNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) return;
        const value = node.nodeValue;
        if (!value) return;
        const next = brandify(value);
        if (next !== value) node.nodeValue = next;
        return;
      }

      if (!(node instanceof Element)) return;
      if (["SCRIPT", "STYLE", "TEXTAREA"].includes(node.tagName)) return;

      const attrs = ["aria-label", "title", "alt"];
      if (node.tagName === "META") attrs.push("content");
      for (const attr of attrs) {
        const value = node.getAttribute(attr);
        if (!value) continue;
        const next = brandify(value);
        if (next !== value) node.setAttribute(attr, next);
      }

      node.childNodes.forEach(syncNode);
    };

    syncNode(document.documentElement);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" || mutation.type === "attributes") {
          syncNode(mutation.target);
        } else {
          mutation.addedNodes.forEach(syncNode);
        }
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "title", "alt", "content"],
    });

    previousName.current = name;
    return () => observer.disconnect();
  }, [site.shopName]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function StickyMobileCTA() {
  const { pathname } = useStoreLocation();
  const [show, setShow] = useState(false);
  const { pushToast } = useStore();
  // Product pages render their own sticky ORDER ON WHATSAPP bar on mobile.
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/product/");

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 550);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-[110] flex items-center gap-3 pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <Link
            to="/shop?flag=new"
            className="flex flex-1 items-center justify-center gap-2 bg-espresso py-4 text-[11px] font-semibold tracking-[0.3em] text-ivory uppercase shadow-xl shadow-espresso/30"
          >
            Shop now <ArrowUpRight className="h-4 w-4 text-gold" />
          </Link>
          <button
            type="button"
            aria-label="Chat on WhatsApp"
            onClick={() => {
              if (isWhatsAppReady()) window.open(`https://wa.me/${storeConfig.whatsappNumber}`, "_blank");
              else pushToast("WhatsApp connects soon — DM us on Instagram!");
            }}
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gold text-espresso shadow-xl shadow-gold/30"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useStoreLocation() {
  return useLocation();
}

function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-[350] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.p
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="border border-gold/60 bg-espresso px-6 py-3 text-center text-xs tracking-[0.12em] text-ivory shadow-2xl"
          >
            <span className="mr-2 text-gold">✦</span>
            {t.msg}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Shell() {
  const [booting, setBooting] = useState(true);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 1950);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{booting && <Loader />}</AnimatePresence>
      <CustomCursor />
      {!isAdmin && <Navbar />}
      <ScrollToTop />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, clipPath: "inset(0 0 5% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<div className="min-h-[100svh] bg-ivory" />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/lookbook" element={<Lookbook />} />
                <Route path="/visit" element={<Visit />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/terms" element={<Info type="terms" />} />
                <Route path="/privacy" element={<Info type="privacy" />} />
                <Route path="/exchange" element={<Info type="exchange" />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
      <StickyMobileCTA />
      <SearchOverlay />
      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrandingSync />
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <Shell />
        </MotionConfig>
      </BrowserRouter>
    </StoreProvider>
  );
}
