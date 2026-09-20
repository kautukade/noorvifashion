import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  Eye,
  Instagram,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import {
  fetchBlogCategories,
  fetchBlogPostBySlug,
  fetchBlogPosts,
  fmtDate,
  incrementPostViews,
  readingTime,
  type BlogCategory,
  type BlogPost as Post,
} from "../services/blog";
import { renderMarkdown } from "../utils/markdown";
import { setPageMeta } from "../utils/seo";
import { brandText, cn, copyText, isWhatsAppReady } from "../utils/helpers";
import { storeConfig } from "../config/storeConfig";
import { useStore } from "../context/store";
import VideoPlayer from "../components/VideoPlayer";
import Lightbox from "../components/Lightbox";
import { Eyebrow, Lines, Reveal, SmartImg } from "../components/ui";

const GALLERY_SPANS = [
  "col-span-6 sm:col-span-4 aspect-[4/5]",
  "col-span-3 sm:col-span-2 aspect-[3/4]",
  "col-span-3 sm:col-span-2 aspect-[3/4]",
  "col-span-3 sm:col-span-2 aspect-square",
  "col-span-6 sm:col-span-4 aspect-[16/10]",
];

export default function BlogPostPage() {
  const { slug } = useParams();
  const { pushToast, site } = useStore();
  const [post, setPost] = useState<Post | null>(null);
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [related, setRelated] = useState<Post[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "notfound" | "error">("loading");
  const [lightbox, setLightbox] = useState(-1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setState("loading");
    Promise.all([fetchBlogPostBySlug(slug), fetchBlogCategories(), fetchBlogPosts({ publishedOnly: true })])
      .then(([p, c, all]) => {
        if (!alive) return;
        setCats(c);
        if (!p) {
          setState("notfound");
          setPageMeta({ title: `Story not found | ${site.storeName} Journal` });
          return;
        }
        setPost(p);
        setRelated(all.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 3));
        setPageMeta({
          title: `${brandText(p.title, site.storeName)} | ${site.storeName} Journal`,
          description: brandText(p.excerpt, site.storeName) || `A story from the ${site.storeName} journal — ${brandText(p.title, site.storeName)}`,
          image: p.featuredImageUrl || undefined,
        });
        void incrementPostViews(p.id);
        setState("ready");
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [slug, site.storeName]);

  const catName = useMemo(
    () => cats.find((c) => c.slug === post?.category)?.name ?? "Journal",
    [cats, post]
  );

  if (state === "loading") {
    return (
      <div className="bg-ivory pt-36 md:pt-44" aria-busy="true">
        <div className="mx-auto max-w-[1500px] animate-pulse px-6 md:px-10">
          <div className="h-3 w-40 bg-cream" />
          <div className="mt-6 h-16 w-full max-w-3xl bg-cream" />
          <div className="mt-3 h-16 w-2/3 max-w-xl bg-cream" />
          <div className="mt-12 aspect-[16/9] w-full max-w-4xl bg-cream" />
          <div className="mt-12 max-w-2xl space-y-4">
            <div className="h-4 w-full bg-cream" />
            <div className="h-4 w-5/6 bg-cream" />
            <div className="h-4 w-4/6 bg-cream" />
          </div>
        </div>
        <div className="h-32" />
      </div>
    );
  }

  if (state === "notfound" || state === "error") {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center bg-ivory px-6 text-center">
        <span className="font-display text-6xl text-gold">✦</span>
        <h1 className="mt-6 max-w-xl font-display text-5xl leading-[0.95] font-semibold text-espresso md:text-6xl">
          {state === "error" ? (
            <>Something snagged <em className="text-gold">on the rack.</em></>
          ) : (
            <>The next {site.storeName} story <em className="text-gold">is being styled.</em></>
          )}
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-choco/65">
          {state === "error"
            ? "We couldn't load this story. Check your connection and try again."
            : "This story doesn't exist yet — it may be a draft, or the link has changed. The newest drops, however, are very much real."}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            to="/shop?flag=new"
            className="group inline-flex items-center gap-3 bg-espresso px-9 py-4 text-[11px] font-semibold tracking-[0.28em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso"
          >
            Explore new arrivals <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 border border-espresso/30 px-9 py-4 text-[11px] font-semibold tracking-[0.28em] text-espresso uppercase transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> All stories
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isVideoPost = post.postType === "VIDEO" || post.postType === "REEL";
  const shareText = `${brandText(post.title, site.storeName)} — ${site.storeName}, Pusad`;
  const shareUrl = window.location.href;

  const onCopy = async () => {
    const ok = await copyText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    pushToast(ok ? "Link copied ✦" : "Copy this page's link from the address bar");
  };

  return (
    <div className="bg-ivory pt-32 pb-24 md:pt-40">
      <article className="mx-auto max-w-[1500px] px-6 md:px-10">
        {/* Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-choco/60 uppercase transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {site.storeName} Journal
          </Link>
          <p className="flex items-center gap-4 text-[10px] font-semibold tracking-[0.25em] text-choco/55 uppercase">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-gold" /> {fmtDate(post.publishedAt)}</span>
            <span className="hidden sm:inline">✦</span>
            <span className="hidden sm:inline">{readingTime(post.content)}</span>
            <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-gold" /> {post.views}</span>
          </p>
        </div>

        {/* Title */}
        <div className="mt-8 max-w-4xl">
          <Eyebrow>{catName}</Eyebrow>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] font-semibold text-espresso md:text-7xl lg:text-8xl">
            <Lines lines={[brandText(post.title, site.storeName)]} />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl font-display text-xl leading-relaxed text-choco/75 italic md:text-2xl">
              {brandText(post.excerpt, site.storeName)}
            </p>
          </Reveal>
        </div>

        {/* Share bar */}
        <Reveal delay={0.3}>
          <div className="mt-9 flex flex-wrap items-center gap-2.5">
            <span className="mr-1 text-[10px] font-semibold tracking-[0.3em] text-choco/50 uppercase">Share</span>
            <button
              type="button"
              onClick={onCopy}
              className="flex min-h-11 items-center gap-2 border border-espresso/20 px-4 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase transition-all hover:border-gold hover:text-gold"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-2 border border-espresso/20 px-4 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase transition-all hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a
              href={storeConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-2 border border-espresso/20 px-4 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase transition-all hover:border-gold hover:text-gold"
            >
              <Instagram className="h-3.5 w-3.5" /> Instagram
            </a>
          </div>
        </Reveal>

        {/* Hero media */}
        <Reveal delay={0.2} y={40} className="mt-12">
          {isVideoPost && post.videoUrl ? (
            <VideoPlayer
              src={post.videoUrl}
              poster={post.videoPosterUrl || post.featuredImageUrl}
              ratio={post.videoRatio}
              title={brandText(post.title, site.storeName)}
              className={cn("mx-auto w-full", post.videoRatio === "9/16" ? "max-w-sm md:max-w-md" : "max-w-4xl")}
            />
          ) : post.featuredImageUrl ? (
            <div className="relative mx-auto max-w-5xl overflow-hidden">
              <SmartImg src={post.featuredImageUrl} alt={brandText(post.title, site.storeName)} className="aspect-[4/3] w-full sm:aspect-[16/10]" />
              <span className="absolute bottom-4 left-4 bg-espresso/80 px-4 py-2 text-[9px] font-semibold tracking-[0.3em] text-gold uppercase backdrop-blur">
                {catName} ✦ {site.storeName}
              </span>
            </div>
          ) : null}
        </Reveal>

        {/* Body */}
        <div className="mx-auto mt-12 max-w-2xl">{renderMarkdown(brandText(post.content, site.storeName))}</div>

        {/* Gallery */}
        {post.gallery.length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl" aria-label="Photo gallery">
            <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold tracking-[0.35em] text-choco/55 uppercase">
              <span className="h-px w-10 bg-gold" aria-hidden /> The gallery ✦ tap to zoom
            </p>
            <div className="grid grid-cols-6 gap-3 md:gap-4">
              {post.gallery.map((g, i) => (
                <motion.button
                  key={g.id}
                  type="button"
                  onClick={() => setLightbox(i)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                  className={cn(
                    "group relative overflow-hidden bg-nude focus-visible:outline-2 focus-visible:outline-gold",
                    GALLERY_SPANS[i % GALLERY_SPANS.length]
                  )}
                  aria-label={`Open photo: ${brandText(g.alt || post.title, site.storeName)}`}
                >
                  <img
                    src={g.url}
                    alt={brandText(g.alt || post.title, site.storeName)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-end bg-gradient-to-t from-espresso/60 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-[9px] font-semibold tracking-[0.3em] text-ivory uppercase">View ✦</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* CTA band */}
        <Reveal className="mx-auto mt-20 max-w-5xl">
          <div className="grain relative overflow-hidden bg-espresso px-8 py-12 text-center text-ivory md:px-16 md:py-16">
            <p className="text-[10px] font-semibold tracking-[0.4em] text-gold uppercase">Loved this story?</p>
            <h2 className="mt-4 font-display text-4xl leading-tight font-semibold md:text-5xl">
              The looks are <em className="text-gold">on the rack.</em>
            </h2>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                to="/shop?flag=new"
                className="flex min-h-12 items-center gap-3 bg-gold px-8 py-4 text-[11px] font-semibold tracking-[0.25em] text-espresso uppercase transition-colors hover:bg-ivory"
              >
                <ShoppingBag className="h-4 w-4" /> Shop the looks
              </Link>
              <a
                href={storeConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center gap-3 border border-ivory/40 px-8 py-4 text-[11px] font-semibold tracking-[0.25em] text-ivory uppercase transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram className="h-4 w-4" /> Follow the feed
              </a>
              <button
                type="button"
                onClick={() => {
                  if (isWhatsAppReady()) window.open(`https://wa.me/${storeConfig.whatsappNumber}`, "_blank");
                  else pushToast("WhatsApp connects soon — DM us on Instagram!");
                }}
                className="flex min-h-12 items-center gap-3 border border-ivory/40 px-8 py-4 text-[11px] font-semibold tracking-[0.25em] text-ivory uppercase transition-colors hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </button>
            </div>
          </div>
        </Reveal>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20" aria-label="Related stories">
            <p className="mb-7 flex items-center gap-3 text-[10px] font-semibold tracking-[0.35em] text-choco/55 uppercase">
              <span className="h-px w-10 bg-gold" aria-hidden /> More {catName} stories
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <Link
                    to={`/blog/${r.slug}`}
                    data-cursor="view"
                    className="group block border border-espresso/10 bg-ivory transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl hover:shadow-espresso/10"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-nude">
                      <img
                        src={r.featuredImageUrl}
                        alt={brandText(r.title, site.storeName)}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-[9px] font-semibold tracking-[0.28em] text-gold uppercase">{fmtDate(r.publishedAt)}</p>
                      <h3 className="mt-2 font-display text-xl leading-snug font-semibold text-espresso transition-colors group-hover:text-gold">
                        {brandText(r.title, site.storeName)}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </article>

      <Lightbox
        items={post.gallery.map((g) => ({ url: g.url, alt: brandText(g.alt, site.storeName) }))}
        index={lightbox}
        onIndex={setLightbox}
        onClose={() => setLightbox(-1)}
      />
    </div>
  );
}
