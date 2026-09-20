import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, ImagePlus, Play, Type } from "lucide-react";
import {
  fetchBlogCategories,
  fetchBlogPosts,
  fmtDate,
  type BlogCategory,
  type BlogPost,
} from "../services/blog";
import { brandText, cn } from "../utils/helpers";
import { useStore } from "../context/store";
import { setPageMeta } from "../utils/seo";
import { usePointerFine, Eyebrow, Lines, Reveal } from "../components/ui";

/* ─────────────────────── Card media (with hover video preview) ─────────────────────── */

function CardMedia({ post, aspect }: { post: BlogPost; aspect: string }) {
  const { site } = useStore();
  const fine = usePointerFine();
  const [preview, setPreview] = useState(false);
  const hasVideo = Boolean(post.videoUrl);

  return (
    <div
      className={cn("relative overflow-hidden bg-nude", aspect)}
      onMouseEnter={fine && hasVideo ? () => setPreview(true) : undefined}
      onMouseLeave={fine && hasVideo ? () => setPreview(false) : undefined}
    >
      <img
        src={post.featuredImageUrl}
        alt={brandText(post.title, site.storeName)}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]",
          preview && "opacity-0"
        )}
      />
      {hasVideo && preview && (
        <video
          src={post.videoUrl}
          poster={post.videoPosterUrl || post.featuredImageUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {(post.postType === "VIDEO" || post.postType === "REEL") && (
        <span
          className={cn(
            "absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 bg-espresso/40 backdrop-blur-sm transition-all duration-500",
            preview ? "scale-0 opacity-0" : "group-hover:scale-110 group-hover:border-gold group-hover:bg-gold/90"
          )}
        >
          <Play className="ml-0.5 h-5 w-5 text-ivory group-hover:text-espresso" fill="currentColor" />
        </span>
      )}
      {post.postType === "IMAGE_GALLERY" && post.gallery.length > 0 && (
        <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-espresso/80 px-3 py-1.5 text-[9px] font-semibold tracking-[0.2em] text-ivory uppercase backdrop-blur">
          <ImagePlus className="h-3.5 w-3.5 text-gold" /> +{post.gallery.length} photos
        </span>
      )}
      {post.postType === "TEXT" && (
        <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-espresso/80 px-3 py-1.5 text-[9px] font-semibold tracking-[0.2em] text-ivory uppercase backdrop-blur">
          <Type className="h-3.5 w-3.5 text-gold" /> Story
        </span>
      )}
    </div>
  );
}

function BlogCard({ post, catName, index }: { post: BlogPost; catName: string; index: number }) {
  const { site } = useStore();
  const aspects = ["aspect-[4/5]", "aspect-[3/4]", "aspect-square"];
  const aspect = post.postType === "REEL" ? "aspect-[4/5]" : aspects[index % aspects.length];

  return (
    <Link
      to={`/blog/${post.slug}`}
      data-cursor="view"
      className="group mb-6 block break-inside-avoid border border-espresso/10 bg-ivory transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl hover:shadow-espresso/10"
    >
      <CardMedia post={post} aspect={aspect} />
      <div className="p-6">
        <div className="flex items-center gap-3 text-[9px] font-semibold tracking-[0.28em] uppercase">
          <span className="text-gold">{catName}</span>
          <span className="h-px flex-1 bg-espresso/10" aria-hidden />
          <span className="flex items-center gap-1.5 text-choco/50">
            <CalendarDays className="h-3 w-3" /> {fmtDate(post.publishedAt)}
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl leading-snug font-semibold text-espresso transition-colors group-hover:text-gold">
          {brandText(post.title, site.storeName)}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-choco/65">{brandText(post.excerpt, site.storeName)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-espresso uppercase transition-all group-hover:gap-3 group-hover:text-gold">
          Read more <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────── Skeletons ─────────────────────── */

function JournalSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="aspect-[4/3] bg-cream lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <div className="h-4 w-24 bg-cream" />
          <div className="h-12 w-full bg-cream" />
          <div className="h-12 w-2/3 bg-cream" />
          <div className="h-20 w-full bg-cream" />
        </div>
      </div>
      <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mb-6 break-inside-avoid border border-espresso/10">
            <div className={cn("bg-cream", ["aspect-[4/5]", "aspect-[3/4]", "aspect-square"][i % 3])} />
            <div className="space-y-3 p-6">
              <div className="h-3 w-20 bg-cream" />
              <div className="h-6 w-full bg-cream" />
              <div className="h-4 w-4/5 bg-cream" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── Page ─────────────────────── */

export default function Blog() {
  const { site } = useStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [cat, setCat] = useState("all");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    setPageMeta({
      title: `${site.storeName} Journal | Stories from the Rack`,
      description:
        `New drops, styling inspiration, behind the scenes and everything happening at ${site.storeName}, Pusad.`,
    });
  }, [site.storeName]);

  const load = () => {
    setState("loading");
    Promise.all([fetchBlogPosts({ publishedOnly: true }), fetchBlogCategories()])
      .then(([p, c]) => {
        setPosts(p);
        setCats(c);
        setState("ready");
      })
      .catch(() => setState("error"));
  };

  useEffect(load, []);

  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? "Journal";

  const filtered = useMemo(
    () => (cat === "all" ? posts : posts.filter((p) => p.category === cat)),
    [posts, cat]
  );
  const featured = useMemo(
    () => filtered.find((p) => p.isFeatured) ?? filtered[0],
    [filtered]
  );
  const rest = filtered.filter((p) => p !== featured);

  return (
    <div className="bg-ivory pt-32 md:pt-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        {/* Header */}
        <Eyebrow>{site.storeName} Journal</Eyebrow>
        <h1 className="mt-5 font-display text-6xl leading-[0.9] font-semibold text-espresso md:text-[7.5rem]">
          <Lines lines={[<>Stories from</>, <em key="r" className="text-gold">the rack. ✦</em>]} />
        </h1>
        <Reveal delay={0.25}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-choco/75 md:text-base">
            New drops, styling inspiration, behind the scenes and everything happening at
            {site.storeName} — fresh from the store and our feed.
          </p>
        </Reveal>

        {/* Category filter */}
        <Reveal delay={0.35}>
          <div className="-mx-6 mt-10 flex gap-2 overflow-x-auto px-6 pb-2 no-scrollbar md:mx-0 md:flex-wrap md:px-0">
            {[{ slug: "all", name: "Everything" }, ...cats].map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCat(c.slug)}
                className={cn(
                  "shrink-0 border px-5 py-2.5 text-[10px] font-medium tracking-[0.22em] uppercase transition-all",
                  cat === c.slug
                    ? "border-espresso bg-espresso text-ivory"
                    : "border-espresso/20 bg-transparent text-choco/70 hover:border-gold hover:text-espresso"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 pb-24">
          {state === "loading" && <JournalSkeleton />}

          {state === "error" && (
            <div className="border border-espresso/12 bg-cream px-8 py-20 text-center">
              <p className="font-display text-4xl font-semibold text-espresso italic">
                The journal took a coffee break.
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-choco/65">
                We couldn't load the stories. Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={load}
                className="mt-8 bg-espresso px-8 py-3.5 text-[10px] font-semibold tracking-[0.3em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso"
              >
                Try again ✦
              </button>
            </div>
          )}

          {state === "ready" && filtered.length === 0 && (
            <div className="border border-espresso/12 bg-cream px-8 py-24 text-center">
              <span className="font-display text-5xl text-gold">✦</span>
              <h2 className="mt-6 font-display text-4xl leading-tight font-semibold text-espresso md:text-5xl">
                The next {site.storeName} story <em className="text-gold">is being styled.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-choco/65">
                Nothing in this rail yet — but the racks are filling fast. Meanwhile, the
                newest pieces are waiting in the shop.
              </p>
              <Link
                to="/shop?flag=new"
                className="group mt-9 inline-flex items-center gap-3 bg-espresso px-9 py-4 text-[11px] font-semibold tracking-[0.28em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso"
              >
                Explore new arrivals <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}

          {state === "ready" && filtered.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Featured story */}
                {featured && (
                  <Link
                    to={`/blog/${featured.slug}`}
                    data-cursor="view"
                    className="group grid overflow-hidden border border-espresso/10 bg-cream transition-colors duration-500 hover:border-gold/60 lg:grid-cols-12"
                  >
                    <div className="relative overflow-hidden lg:col-span-7">
                      <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[480px]">
                        <img
                          src={featured.featuredImageUrl}
                          alt={brandText(featured.title, site.storeName)}
                          loading="eager"
                          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                        />
                      </div>
                      <span className="absolute top-5 left-5 bg-gold px-4 py-2 text-[9px] font-bold tracking-[0.3em] text-espresso uppercase shadow-lg">
                        Featured ✦ {catName(featured.category)}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-5">
                      <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-choco/55 uppercase">
                        <CalendarDays className="h-3.5 w-3.5 text-gold" /> {fmtDate(featured.publishedAt)}
                      </p>
                      <h2 className="mt-5 font-display text-4xl leading-[1.02] font-semibold text-espresso transition-colors group-hover:text-gold md:text-5xl">
                        {brandText(featured.title, site.storeName)}
                      </h2>
                      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-choco/70 md:text-base">
                        {brandText(featured.excerpt, site.storeName)}
                      </p>
                      <span className="mt-8 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-espresso uppercase transition-all group-hover:gap-4 group-hover:text-gold">
                        Discover the story <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                )}

                {/* Masonry grid */}
                {rest.length > 0 && (
                  <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
                    {rest.map((p, i) => (
                      <BlogCard key={p.id} post={p} catName={catName(p.category)} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
