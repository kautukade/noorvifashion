import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgePercent,
  BookOpen,
  ClipboardList,
  ExternalLink,
  Film,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  Lock,
  LogOut,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import {
  ALL_SIZES,
  CATEGORIES,
  COLOR_PRESETS,
  LOOKS,
  REELS,
  type CategorySlug,
  type Product,
  type Size,
} from "../data/products";
import { MEDIA_OPTIONS } from "../config/media";
import { storeConfig } from "../config/storeConfig";
import { isSupabaseReady, supaHasSession, supaSignIn, supaSignOut } from "../config/supabase";
import BlogManager from "../components/admin/BlogManager";
import { useStore, type EnquiryStatus, type SiteData } from "../context/store";
import { cn, inr, stockInfo, timeAgo, totalStock } from "../utils/helpers";

/* ───────────────────────── helpers ───────────────────────── */

const INPUT =
  "w-full border border-espresso/20 bg-ivory px-4 py-3 text-sm text-espresso outline-none transition-colors focus:border-gold placeholder:text-choco/35";
const LABEL = "mb-1.5 block text-[10px] font-semibold tracking-[0.25em] text-choco/60 uppercase";

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className="flex items-center gap-2.5">
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors duration-300",
          on ? "bg-gold" : "bg-espresso/20"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-ivory shadow transition-transform duration-300",
            on && "translate-x-4"
          )}
        />
      </span>
      <span className={cn("text-xs", on ? "font-semibold text-espresso" : "text-choco/60")}>{label}</span>
    </button>
  );
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  );
}

/* ───────────────────────── Login ───────────────────────── */

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!password.trim() || (!isSupabaseReady && !email.trim())) {
      setError("Enter an email and password to sign in.");
      return;
    }
    if (isSupabaseReady) {
      // Production path — real Supabase Auth (no hardcoded passwords).
      setBusy(true);
      const err = await supaSignIn(email.trim(), password);
      setBusy(false);
      if (err) {
        setError(err);
        return;
      }
      onSuccess();
      return;
    }
    // Demo path — clearly labelled, only active when Supabase keys are absent.
    if (password !== storeConfig.adminDemoPassword) {
      setError(`Demo password is “${storeConfig.adminDemoPassword}”.`);
      return;
    }
    sessionStorage.setItem("noorvi_admin", "1");
    onSuccess();
  };

  return (
    <div className="flex min-h-[100svh] flex-col lg:flex-row">
      <div className="grain flex flex-1 flex-col justify-between bg-espresso p-10 text-ivory">
        <p className="font-display text-2xl font-semibold tracking-[0.14em]">
          NOORVI<span className="text-gold">✦</span>
        </p>
        <div>
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase">Back office</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] font-semibold md:text-7xl">
            Run the <em className="text-gold">boutique.</em>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/60">
            Products, inventory, offers, homepage and reels — everything the store
            needs, in one calm dashboard. Demo mode until a backend is connected.
          </p>
        </div>
        <p className="text-[10px] tracking-[0.3em] text-ivory/40 uppercase">Gold Plaza ✦ Sonar Line ✦ Pusad</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-ivory p-8">
        <div className="w-full max-w-sm">
          <p className="flex items-center gap-2 text-[10px] tracking-[0.4em] text-choco/55 uppercase">
            <Lock className="h-3.5 w-3.5 text-gold" /> Admin sign in
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-espresso">Welcome back ✦</h2>
          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <div>
              <label className={LABEL} htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@noorvi.fashion"
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="admin-pass">Password</label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className={INPUT}
              />
            </div>
            {error && <p className="text-xs font-medium text-[#b3552e]">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="group relative w-full overflow-hidden bg-espresso py-4 text-[11px] font-semibold tracking-[0.3em] text-ivory uppercase disabled:opacity-60"
            >
              <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 group-hover:translate-y-0" aria-hidden />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-espresso">
                {busy ? "Signing in…" : "Enter dashboard"}
              </span>
            </button>
          </form>
          {isSupabaseReady ? (
            <p className="mt-6 border border-[#7c8b57]/40 bg-[#7c8b57]/10 px-4 py-3 text-xs leading-relaxed text-choco/75">
              <span className="font-semibold text-espresso">Supabase connected ✦</span> Sign in with the
              store owner account created in Supabase Auth. Stories save to the live database.
            </p>
          ) : (
            <p className="mt-6 border border-gold/40 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-choco/75">
              <span className="font-semibold text-espresso">Demo access:</span> any email · password{" "}
              <span className="font-mono font-semibold text-gold">noorvi</span>
              <span className="mt-1 block text-[10px] text-choco/55">
                Add Supabase keys to switch to real authentication — see README.
              </span>
            </p>
          )}
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-choco/60 uppercase hover:text-gold">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Product form ───────────────────────── */

const EMPTY: Product = {
  id: 0,
  slug: "",
  name: "",
  code: "NF-NEW",
  category: "tops",
  price: 299,
  originalPrice: 399,
  colors: [COLOR_PRESETS[0]],
  sizes: ["S", "M", "L"],
  stock: { S: 5, M: 5, L: 5 },
  isNew: true,
  isTrending: false,
  isSale: true,
  isFeatured: false,
  image: MEDIA_OPTIONS[1].value,
  hoverImage: MEDIA_OPTIONS[2].value,
  description: "",
  fabric: "",
  fit: "",
  care: "",
};

function ProductForm({
  initial,
  onSave,
  onClose,
}: {
  initial: Product;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const { products } = useStore();
  const [form, setForm] = useState<Product>(initial);
  const isNewProduct = initial.id === 0;

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSize = (s: Size) => {
    setForm((f) => {
      const has = f.sizes.includes(s);
      const sizes = has ? f.sizes.filter((x) => x !== s) : [...f.sizes, s];
      const stock = { ...f.stock };
      if (!has && !(s in stock)) stock[s] = 5;
      return { ...f, sizes, stock };
    });
  };

  const toggleColor = (name: string) => {
    setForm((f) => {
      const c = COLOR_PRESETS.find((x) => x.name === name);
      if (!c) return f;
      const has = f.colors.some((x) => x.name === name);
      return { ...f, colors: has ? f.colors.filter((x) => x.name !== name) : [...f.colors, c] };
    });
  };

  const save = () => {
    if (!form.name.trim()) return;
    let slug = slugify(form.name);
    if (products.some((p) => p.slug === slug && p.id !== form.id)) slug = `${slug}-${form.id || "new"}`;
    onSave({
      ...form,
      id: form.id || Math.max(0, ...products.map((p) => p.id)) + 1,
      slug,
      name: form.name.trim(),
      isSale: form.isSale || form.price < form.originalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-start justify-center overflow-y-auto bg-espresso/75 p-4 backdrop-blur-sm md:p-8" onClick={onClose} role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="my-4 w-full max-w-2xl bg-ivory p-7 md:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-gold uppercase">{isNewProduct ? "New product" : "Edit product"}</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-espresso">
              {isNewProduct ? "Add to the rack ✦" : form.name}
            </h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="rounded-full border border-espresso/20 p-2.5 hover:border-gold hover:text-gold">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={LABEL}>Product name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Pink Corset Top" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Product code</label>
            <input value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="NF-015" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value as CategorySlug)} className={INPUT}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Current price (₹)</label>
            <input type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value) || 0)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Original price (₹)</label>
            <input type="number" min={0} value={form.originalPrice} onChange={(e) => set("originalPrice", Number(e.target.value) || 0)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Main image</label>
            <select value={form.image} onChange={(e) => set("image", e.target.value)} className={INPUT}>
              {MEDIA_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Hover / alt image</label>
            <select value={form.hoverImage} onChange={(e) => set("hoverImage", e.target.value)} className={INPUT}>
              {MEDIA_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Why she'll love it…" className={cn(INPUT, "resize-none")} />
          </div>
          <div>
            <label className={LABEL}>Fabric</label>
            <input value={form.fabric} onChange={(e) => set("fabric", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Fit</label>
            <input value={form.fit} onChange={(e) => set("fit", e.target.value)} className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Care</label>
            <input value={form.care} onChange={(e) => set("care", e.target.value)} className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Sizes</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => (
                <button key={s} type="button" onClick={() => toggleSize(s)} className={cn("min-w-10 border px-3 py-2 text-xs transition-all", form.sizes.includes(s) ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 text-choco/60 hover:border-gold")}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={LABEL}>Colours</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => {
                const on = form.colors.some((x) => x.name === c.name);
                return (
                  <button key={c.name} type="button" title={c.name} aria-pressed={on} onClick={() => toggleColor(c.name)} className={cn("h-8 w-8 rounded-full border-2 transition-all", on ? "scale-110 border-gold ring-2 ring-gold/40" : "border-espresso/20")} style={{ backgroundColor: c.hex }} />
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={LABEL}>Stock per size</label>
            <div className="flex flex-wrap gap-3">
              {ALL_SIZES.filter((s) => form.sizes.includes(s)).map((s) => (
                <div key={s} className="w-24">
                  <span className="text-[10px] tracking-[0.2em] text-choco/50 uppercase">{s}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.stock[s] ?? 0}
                    onChange={(e) => set("stock", { ...form.stock, [s]: Math.max(0, Number(e.target.value) || 0) })}
                    className={INPUT}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-espresso/12 pt-5 sm:col-span-2">
            <Toggle on={form.isNew} onClick={() => set("isNew", !form.isNew)} label="New arrival" />
            <Toggle on={form.isTrending} onClick={() => set("isTrending", !form.isTrending)} label="Trending" />
            <Toggle on={form.isSale} onClick={() => set("isSale", !form.isSale)} label="On sale" />
            <Toggle on={form.isFeatured} onClick={() => set("isFeatured", !form.isFeatured)} label="Featured" />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button type="button" onClick={save} disabled={!form.name.trim()} className="flex-1 bg-espresso py-4 text-[11px] font-semibold tracking-[0.3em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40">
            {isNewProduct ? "Add product" : "Save changes"}
          </button>
          <button type="button" onClick={onClose} className="border border-espresso/25 px-8 text-[11px] font-semibold tracking-[0.3em] text-espresso uppercase hover:border-gold hover:text-gold">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Panels ───────────────────────── */

function Dashboard({ goTo }: { goTo: (m: string) => void }) {
  const { products, enquiries } = useStore();
  const low = products.filter((p) => {
    const s = stockInfo(p);
    return s.tone === "low";
  }).length;
  const out = products.filter((p) => totalStock(p) === 0).length;
  const stats = [
    { label: "Live products", value: products.length, icon: ShoppingBag },
    { label: "WhatsApp enquiries", value: enquiries.length, icon: ClipboardList },
    { label: "Low stock", value: low, icon: BadgePercent },
    { label: "Sold out", value: out, icon: Package },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="border border-espresso/12 bg-ivory p-6">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-gold">
                <s.icon className="h-4 w-4" strokeWidth={1.6} />
              </span>
            </div>
            <p className="mt-4 font-display text-5xl font-semibold text-espresso">{s.value}</p>
            <p className="mt-1 text-[10px] tracking-[0.25em] text-choco/55 uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="border border-espresso/12 bg-ivory xl:col-span-2">
          <div className="flex items-center justify-between border-b border-espresso/12 px-6 py-4">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-choco/60 uppercase">Recent enquiries</p>
            <button type="button" onClick={() => goTo("orders")} className="text-[10px] tracking-[0.25em] text-gold uppercase hover:text-espresso">View all →</button>
          </div>
          {enquiries.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-choco/55">
              No enquiries yet — they appear here the moment a customer taps
              <span className="font-semibold text-espresso"> “Order on WhatsApp”</span> on the site. ✦
            </p>
          ) : (
            <ul className="divide-y divide-espresso/8">
              {enquiries.slice(0, 5).map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div>
                    <p className="font-display text-lg font-semibold text-espresso">{e.productName}</p>
                    <p className="text-[10px] tracking-[0.2em] text-choco/50 uppercase">{e.code} · {e.size} · {e.color}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gold">{inr(e.price)}</p>
                    <p className="text-[10px] text-choco/50">{timeAgo(e.createdAt)} · {e.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-4">
          <div className="border border-espresso/12 bg-espresso p-6 text-ivory">
            <p className="font-display text-2xl font-semibold">Quick actions ✦</p>
            <div className="mt-4 space-y-3">
              <button type="button" onClick={() => goTo("products")} className="flex w-full items-center justify-between border border-ivory/20 px-4 py-3 text-[10px] tracking-[0.25em] uppercase transition-colors hover:border-gold hover:text-gold">
                Add a product <Plus className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => goTo("inventory")} className="flex w-full items-center justify-between border border-ivory/20 px-4 py-3 text-[10px] tracking-[0.25em] uppercase transition-colors hover:border-gold hover:text-gold">
                Update stock <Package className="h-4 w-4" />
              </button>
              <Link to="/" className="flex w-full items-center justify-between border border-gold bg-gold px-4 py-3 text-[10px] font-semibold tracking-[0.25em] text-espresso uppercase transition-colors hover:bg-ivory">
                View live site <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="border border-gold/40 bg-gold/10 p-6">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-choco/60 uppercase">Demo mode</p>
            <p className="mt-2 text-xs leading-relaxed text-choco/75">
              All changes save to this browser. Connect a backend (or Supabase) later —
              the data shape is already production-ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPanel() {
  const { products, upsertProduct, deleteProduct, pushToast } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [armed, setArmed] = useState<number | null>(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? products.filter((p) => `${p.name} ${p.code} ${p.category}`.toLowerCase().includes(t)) : products;
  }, [products, q]);

  const flagChips: { key: keyof Product; label: string }[] = [
    { key: "isNew", label: "N" },
    { key: "isTrending", label: "T" },
    { key: "isSale", label: "S" },
    { key: "isFeatured", label: "F" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className={cn(INPUT, "max-w-xs")} />
        <button type="button" onClick={() => setEditing(EMPTY)} className="ml-auto flex items-center gap-2 bg-espresso px-6 py-3 text-[10px] font-semibold tracking-[0.25em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="mt-6 overflow-x-auto border border-espresso/12 bg-ivory">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-espresso/12 text-[9px] tracking-[0.25em] text-choco/50 uppercase">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Flags</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/8">
            {list.map((p) => {
              const st = stockInfo(p);
              return (
                <tr key={p.id} className="transition-colors hover:bg-cream/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3.5">
                      <img src={p.image} alt="" className="h-14 w-11 shrink-0 object-cover" />
                      <div>
                        <p className="font-display text-base font-semibold text-espresso">{p.name}</p>
                        <p className="text-[9px] tracking-[0.2em] text-choco/45 uppercase">{p.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs tracking-[0.15em] text-choco/70 uppercase">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-espresso">{inr(p.price)}</span>
                    <span className="ml-2 text-xs text-choco/40 line-through">{inr(p.originalPrice)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      {flagChips.map((f) => (
                        <button
                          key={f.key as string}
                          type="button"
                          title={`Toggle ${f.key}`}
                          onClick={() => upsertProduct({ ...p, [f.key]: !p[f.key as keyof Product] })}
                          className={cn("h-6 w-6 text-[10px] font-bold transition-all", p[f.key as keyof Product] ? "bg-gold text-espresso" : "bg-espresso/10 text-choco/40 hover:bg-espresso/20")}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("px-2.5 py-1 text-[9px] font-bold tracking-[0.15em]", st.tone === "ok" && "bg-[#7c8b57]/15 text-[#5f6c42]", st.tone === "low" && "bg-[#c0785a]/15 text-[#a0522d]", st.tone === "out" && "bg-espresso/10 text-choco/50")}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button type="button" aria-label={`Edit ${p.name}`} onClick={() => setEditing(p)} className="rounded-full border border-espresso/20 p-2 text-choco/70 transition-colors hover:border-gold hover:text-gold">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${p.name}`}
                        onClick={() => {
                          if (armed === p.id) {
                            deleteProduct(p.id);
                            pushToast(`${p.name} removed from the rack`);
                            setArmed(null);
                          } else {
                            setArmed(p.id);
                            window.setTimeout(() => setArmed((a) => (a === p.id ? null : a)), 2500);
                          }
                        }}
                        className={cn("rounded-full border p-2 transition-colors", armed === p.id ? "border-[#b3552e] bg-[#b3552e] text-ivory" : "border-espresso/20 text-choco/70 hover:border-[#b3552e] hover:text-[#b3552e]")}
                      >
                        {armed === p.id ? <span className="px-1 text-[9px] font-bold tracking-wider">SURE?</span> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-6 py-12 text-center text-sm text-choco/55">No products match “{q}”.</p>}
      </div>

      {editing && (
        <ProductForm
          initial={editing}
          onSave={(p) => {
            upsertProduct(p);
            pushToast(editing.id === 0 ? `${p.name} added to the rack ✦` : `${p.name} updated ✦`);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function InventoryPanel() {
  const { products, upsertProduct } = useStore();
  return (
    <div className="space-y-4">
      <p className="text-sm text-choco/65">Edit numbers inline — sizes at zero are automatically marked <span className="font-semibold text-[#a0522d]">SOLD OUT</span> on the site.</p>
      {products.map((p) => {
        const st = stockInfo(p);
        return (
          <div key={p.id} className="border border-espresso/12 bg-ivory p-5">
            <div className="flex flex-wrap items-center gap-3">
              <img src={p.image} alt="" className="h-12 w-10 object-cover" />
              <p className="font-display text-lg font-semibold text-espresso">{p.name}</p>
              <span className={cn("ml-auto px-2.5 py-1 text-[9px] font-bold tracking-[0.15em]", st.tone === "ok" && "bg-[#7c8b57]/15 text-[#5f6c42]", st.tone === "low" && "bg-[#c0785a]/15 text-[#a0522d]", st.tone === "out" && "bg-espresso/10 text-choco/50")}>{st.label}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {ALL_SIZES.map((s) => {
                const qty = p.stock[s] ?? 0;
                const off = qty === 0;
                return (
                  <div key={s} className="w-20">
                    <span className={cn("text-[10px] tracking-[0.2em] uppercase", off ? "font-bold text-[#a0522d]" : "text-choco/50")}>
                      {s} {off && "· out"}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={(e) => upsertProduct({ ...p, stock: { ...p.stock, [s]: Math.max(0, Number(e.target.value) || 0) } })}
                      className={INPUT}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrdersPanel() {
  const { enquiries, setEnquiryStatus } = useStore();
  if (enquiries.length === 0) {
    return (
      <div className="border border-espresso/12 bg-ivory px-6 py-16 text-center">
        <ClipboardList className="mx-auto h-10 w-10 text-gold" strokeWidth={1.2} />
        <p className="mt-5 font-display text-3xl font-semibold text-espresso">No enquiries yet</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-choco/65">
          When a visitor taps <span className="font-semibold text-espresso">Order on WhatsApp</span> on any
          product page, the order draft lands here instantly. Try it from the live site ✦
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto border border-espresso/12 bg-ivory">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-espresso/12 text-[9px] tracking-[0.25em] text-choco/50 uppercase">
            <th className="px-5 py-4">Product</th>
            <th className="px-5 py-4">Size / Colour</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">When</th>
            <th className="px-5 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-espresso/8">
          {enquiries.map((e) => (
            <tr key={e.id}>
              <td className="px-5 py-4">
                <p className="font-display text-base font-semibold text-espresso">{e.productName}</p>
                <p className="text-[9px] tracking-[0.2em] text-choco/45 uppercase">{e.code}</p>
              </td>
              <td className="px-5 py-4 text-xs text-choco/75">{e.size} · {e.color}</td>
              <td className="px-5 py-4 font-semibold text-gold">{inr(e.price)}</td>
              <td className="px-5 py-4 text-xs text-choco/55">{timeAgo(e.createdAt)}</td>
              <td className="px-5 py-4">
                <select
                  value={e.status}
                  onChange={(ev) => setEnquiryStatus(e.id, ev.target.value as EnquiryStatus)}
                  className={cn("border px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase outline-none", e.status === "New" && "border-gold bg-gold/15 text-choco", e.status === "Confirmed" && "border-[#7c8b57] bg-[#7c8b57]/15 text-[#5f6c42]", e.status === "Delivered" && "border-espresso/25 bg-espresso/5 text-choco/60")}
                >
                  <option>New</option>
                  <option>Confirmed</option>
                  <option>Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleFormPanel({
  fields,
  values,
  onSave,
  note,
}: {
  fields: { key: keyof SiteData; label: string; hint?: string }[];
  values: SiteData;
  onSave: (patch: Partial<SiteData>) => void;
  note?: string;
}) {
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, String(values[f.key] ?? "")]))
  );
  useEffect(() => {
    setDraft(Object.fromEntries(fields.map((f) => [f.key, String(values[f.key] ?? "")])));
  }, [values, fields]);
  return (
    <div className="max-w-xl space-y-5">
      {note && <p className="border border-gold/40 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-choco/75">{note}</p>}
      {fields.map((f) => (
        <div key={f.key}>
          <label className={LABEL}>{f.label}</label>
          <input value={draft[f.key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} className={INPUT} />
          {f.hint && <p className="mt-1.5 text-[10px] tracking-wide text-choco/50">{f.hint}</p>}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const patch: Record<string, string> = {};
          fields.forEach((f) => (patch[f.key] = draft[f.key] ?? ""));
          onSave(patch as Partial<SiteData>);
        }}
        className="bg-espresso px-8 py-3.5 text-[10px] font-semibold tracking-[0.3em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso"
      >
        Save changes ✦
      </button>
    </div>
  );
}

/* ───────────────────────── Admin root ───────────────────────── */

const MODULES = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: ShoppingBag },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "orders", label: "Orders / Enquiries", icon: ClipboardList },
  { key: "blog", label: "Blog / Stories", icon: BookOpen },
  { key: "offers", label: "Offers", icon: BadgePercent },
  { key: "homepage", label: "Homepage", icon: Home },
  { key: "reels", label: "Reels", icon: Film },
  { key: "lookbook", label: "Lookbook", icon: ImageIcon },
  { key: "store", label: "Store Information", icon: Store },
  { key: "social", label: "Social Links", icon: Link2 },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("noorvi_admin") === "1");
  const [module, setModule] = useState("dashboard");
  const store = useStore();
  const { site, saveSite, pushToast, resetDemo, products } = store;

  // Restore a real Supabase session on load (live mode only).
  useEffect(() => {
    if (isSupabaseReady) {
      void supaHasSession().then((ok) => {
        if (ok) setAuthed(true);
      });
    }
  }, []);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const toggleIn = (key: "hiddenReels" | "hiddenLooks", id: string) => {
    const cur = site[key];
    saveSite({ [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } as Partial<SiteData>);
  };

  const active = MODULES.find((m) => m.key === module);

  return (
    <div className="flex min-h-[100svh] flex-col bg-cream lg:flex-row">
      {/* Sidebar */}
      <aside className="flex gap-1 overflow-x-auto bg-espresso p-3 text-ivory no-scrollbar lg:min-h-[100svh] lg:w-64 lg:shrink-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:p-5 lg:sticky lg:top-0 lg:self-start">
        <p className="hidden px-3 pb-5 font-display text-xl font-semibold tracking-[0.14em] lg:block">
          NOORVI<span className="text-gold">✦</span> <span className="text-[10px] tracking-[0.3em] text-ivory/50 uppercase">Admin</span>
        </p>
        {MODULES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setModule(m.key)}
            className={cn(
              "flex shrink-0 items-center gap-3 px-3 py-2.5 text-[10px] font-medium tracking-[0.2em] whitespace-nowrap uppercase transition-all lg:w-full lg:text-[11px]",
              module === m.key ? "bg-gold text-espresso" : "text-ivory/65 hover:bg-ivory/10 hover:text-ivory"
            )}
          >
            <m.icon className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            {m.label}
          </button>
        ))}
        <div className="mt-auto hidden gap-2 lg:mt-8 lg:flex lg:flex-col">
          <Link to="/" className="flex items-center gap-3 border border-ivory/20 px-3 py-2.5 text-[10px] tracking-[0.2em] text-ivory/70 uppercase transition-colors hover:border-gold hover:text-gold">
            <ExternalLink className="h-4 w-4" /> View live site
          </Link>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("noorvi_admin");
              if (isSupabaseReady) void supaSignOut();
              setAuthed(false);
            }}
            className="flex items-center gap-3 border border-ivory/20 px-3 py-2.5 text-[10px] tracking-[0.2em] text-ivory/70 uppercase transition-colors hover:border-[#b3552e] hover:text-[#e0937a]"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1 p-5 md:p-9">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-gold uppercase">Noorvi back office</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-espresso md:text-5xl">{active?.label}</h1>
          </div>
          <p className={cn("px-3.5 py-1.5 text-[9px] font-bold tracking-[0.25em] uppercase", isSupabaseReady ? "bg-[#7c8b57] text-ivory" : "bg-espresso text-gold")}>
            {isSupabaseReady ? "Supabase live" : "Demo mode"}
          </p>
        </div>

        {module === "dashboard" && <Dashboard goTo={setModule} />}
        {module === "products" && <ProductsPanel />}
        {module === "inventory" && <InventoryPanel />}
        {module === "orders" && <OrdersPanel />}
        {module === "blog" && <BlogManager />}

        {module === "categories" && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {CATEGORIES.map((c) => {
              const count = products.filter((p) => p.category === c.slug).length;
              return (
                <div key={c.slug} className="group overflow-hidden border border-espresso/12 bg-ivory">
                  <div className="relative h-44 overflow-hidden">
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 bg-espresso/85 px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-gold uppercase backdrop-blur">
                      {count} styles
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-display text-2xl font-semibold text-espresso">{c.name}</p>
                    <p className="mt-1 text-sm text-choco/65 italic">{c.blurb}</p>
                    <Link to={`/shop?cat=${c.slug}`} className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-gold uppercase hover:text-espresso">
                      View in shop <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
            <p className="text-xs leading-relaxed text-choco/55 sm:col-span-2 xl:col-span-3">
              The six category rails are curated by Noorvi. Product counts update live as you edit the catalogue.
            </p>
          </div>
        )}

        {module === "offers" && (
          <div className="space-y-6">
            <p className="max-w-xl text-sm leading-relaxed text-choco/65">
              These are the four price-discovery cards on the homepage. Edit the big number,
              the label or where each card links — changes go live instantly.
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {site.bands.map((b, i) => (
                <div key={b.id} className="border border-espresso/12 bg-ivory p-6">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase">Card {i + 1}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>Label</label>
                      <input value={b.note} onChange={(e) => saveSite({ bands: site.bands.map((x) => (x.id === b.id ? { ...x, note: e.target.value } : x)) })} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Big text</label>
                      <input value={b.big} onChange={(e) => saveSite({ bands: site.bands.map((x) => (x.id === b.id ? { ...x, big: e.target.value } : x)) })} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Kicker</label>
                      <input value={b.kicker} onChange={(e) => saveSite({ bands: site.bands.map((x) => (x.id === b.id ? { ...x, kicker: e.target.value } : x)) })} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Link</label>
                      <input value={b.to} onChange={(e) => saveSite({ bands: site.bands.map((x) => (x.id === b.id ? { ...x, to: e.target.value } : x)) })} className={INPUT} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-espresso/12 pt-6">
              <p className="mb-4 text-[10px] font-bold tracking-[0.3em] text-choco/55 uppercase">Promo banner headline</p>
              <SimpleFormPanel
                fields={[
                  { key: "offerTitle", label: "Banner line 1" },
                  { key: "offerBig", label: "Banner big price" },
                  { key: "offerNote", label: "Small disclaimer" },
                ]}
                values={site}
                onSave={(p) => {
                  saveSite(p);
                  pushToast("Offer banner updated ✦");
                }}
              />
            </div>
          </div>
        )}

        {module === "homepage" && (
          <SimpleFormPanel
            note="Changes appear on the live homepage the moment you save. Hero video and photos are swapped in src/config/media.ts — see the README."
            fields={[
              { key: "heroTitle", label: "Hero title", hint: "The giant word on the first screen" },
              { key: "heroSubtitle", label: "Hero subtitle", hint: "The italic line under the title" },
              { key: "heroSupport", label: "Hero supporting text" },
              { key: "offerTitle", label: "Offer banner line 1" },
              { key: "offerBig", label: "Offer banner price" },
              { key: "offerNote", label: "Offer disclaimer" },
            ]}
            values={site}
            onSave={(p) => {
              saveSite(p);
              pushToast("Homepage content saved ✦");
            }}
          />
        )}

        {module === "reels" && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {REELS.map((r) => {
              const hidden = site.hiddenReels.includes(r.id);
              return (
                <div key={r.id} className={cn("flex gap-4 border bg-ivory p-4 transition-opacity", hidden ? "border-espresso/12 opacity-50" : "border-espresso/12")}>
                  <img src={r.image} alt={r.title} className="h-28 w-20 rounded-t-full object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-display text-lg leading-tight font-semibold text-espresso">{r.title}</p>
                    <p className="mt-0.5 truncate text-xs text-choco/55">{r.caption}</p>
                    <p className="mt-1 text-sm font-semibold text-gold">{inr(r.price)}</p>
                    <div className="mt-auto pt-3">
                      <Toggle on={!hidden} onClick={() => toggleIn("hiddenReels", r.id)} label={hidden ? "Hidden from site" : "Visible on site"} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {module === "lookbook" && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {LOOKS.map((l, i) => {
              const hidden = site.hiddenLooks.includes(l.id);
              return (
                <div key={l.id} className={cn("border bg-ivory transition-opacity", hidden ? "border-espresso/12 opacity-50" : "border-espresso/12")}>
                  <img src={l.image} alt={l.title} className="aspect-[3/4] w-full object-cover" />
                  <div className="p-4">
                    <p className="font-display text-lg font-semibold text-espresso">
                      {String(i + 1).padStart(2, "0")} · {l.title}
                    </p>
                    <p className="text-[10px] tracking-[0.25em] text-choco/50 uppercase">{l.tag}</p>
                    <div className="mt-3">
                      <Toggle on={!hidden} onClick={() => toggleIn("hiddenLooks", l.id)} label={hidden ? "Hidden" : "Visible"} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {module === "store" && (
          <SimpleFormPanel
            note="The WhatsApp number is set in one central file: src/config/storeConfig.ts — see README. Everything below edits live."
            fields={[
              { key: "addressLine2", label: "Address line 2", hint: "Complex / street" },
              { key: "addressLine3", label: "Address line 3", hint: "City, state, PIN" },
              { key: "hours", label: "Opening hours", hint: "Shown on Visit Store + footer" },
              { key: "phone", label: "Store phone", hint: "Digits only, e.g. 919876543210 — leave empty to hide" },
            ]}
            values={site}
            onSave={(p) => {
              saveSite(p);
              pushToast("Store information saved ✦");
            }}
          />
        )}

        {module === "social" && (
          <div className="max-w-xl space-y-8">
            <SimpleFormPanel
              fields={[
                { key: "instagramUrl", label: "Instagram URL" },
                { key: "instagramHandle", label: "Instagram handle" },
              ]}
              values={site}
              onSave={(p) => {
                saveSite(p);
                pushToast("Social links saved ✦");
              }}
            />
            <div className="border border-espresso/12 bg-ivory p-6">
              <p className={LABEL}>WhatsApp number (central config)</p>
              <p className="font-mono text-sm text-choco/80">
                {/^\d{10,15}$/.test(storeConfig.whatsappNumber)
                  ? `+${storeConfig.whatsappNumber} · connected ✦`
                  : `"${storeConfig.whatsappNumber}" · not connected yet`}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-choco/60">
                Edit <span className="font-mono text-gold">whatsappNumber</span> in{" "}
                <span className="font-mono">src/config/storeConfig.ts</span> to switch the whole
                site (navbar, product pages, footer) to live WhatsApp ordering.
              </p>
            </div>
          </div>
        )}

        {module === "settings" && (
          <div className="max-w-xl space-y-6">
            <div className="border border-espresso/12 bg-ivory p-6">
              <p className="font-display text-2xl font-semibold text-espresso">Demo workspace</p>
              <p className="mt-2 text-sm leading-relaxed text-choco/70">
                This admin runs entirely in the browser (localStorage) so you can explore every
                control safely. Data shape matches a real backend for a painless upgrade.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-choco/65">
                <li className="flex gap-2"><span className="text-gold">✦</span> Stack: React + Vite + TypeScript + Tailwind CSS + Framer Motion</li>
                <li className="flex gap-2"><span className="text-gold">✦</span> Changes persist per browser until reset</li>
                <li className="flex gap-2"><span className="text-gold">✦</span> Reset restores the original 14 demo products and copy</li>
              </ul>
            </div>
            <ResetButton onReset={() => {
              resetDemo();
            }} />
          </div>
        )}
      </main>
    </div>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          onReset();
          setArmed(false);
        } else {
          setArmed(true);
          window.setTimeout(() => setArmed(false), 3000);
        }
      }}
      className={cn(
        "flex items-center gap-3 border px-6 py-3.5 text-[10px] font-semibold tracking-[0.25em] uppercase transition-all",
        armed ? "border-[#b3552e] bg-[#b3552e] text-ivory" : "border-espresso/25 text-choco/70 hover:border-[#b3552e] hover:text-[#b3552e]"
      )}
    >
      <RefreshCw className="h-4 w-4" />
      {armed ? "Click again to confirm reset" : "Reset demo data"}
    </button>
  );
}
