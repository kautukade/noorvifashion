import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Play } from "lucide-react";
import { fetchBlogCategories, fetchBlogPosts, fmtDate, type BlogCategory, type BlogPost } from "../services/blog";
import { brandText, cn } from "../utils/helpers";
import { useStore } from "../context/store";
import { Eyebrow, Reveal, SectionHead } from "../components/ui";

function StoryCard({ post, catName, big }: { post: BlogPost; catName: string; big?: boolean }) {
  const { site } = useStore();
  const isVideo = post.postType === "VIDEO" || post.postType === "REEL";
  return (
    <Link
      to={`/blog/${post.slug}`}
      data-cursor="view"
      className={cn(
        "group block h-full border border-espresso/10 bg-ivory transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl hover:shadow-espresso/10",
        big ? "flex flex-col" : ""
      )}
    >
      <div className={cn("relative overflow-hidden bg-nude", big ? "aspect-[16/10] flex-1 lg:aspect-auto lg:min-h-[320px]" : "aspect-[16/10]")}>
        <img
          src={post.featuredImageUrl}
          alt={brandText(post.title, site.storeName)}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        {isVideo && (
          <span className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 bg-espresso/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold/90">
            <Play className="ml-0.5 h-5 w-5 text-ivory group-hover:text-espresso" fill="currentColor" />
          </span>
        )}
        <span className="absolute top-3 left-3 bg-gold px-3 py-1.5 text-[9px] font-bold tracking-[0.24em] text-espresso uppercase">
          {catName}
        </span>
      </div>
      <div className={cn("p-6", big && "md:p-8")}>
        <p className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.28em] text-choco/50 uppercase">
          <CalendarDays className="h-3 w-3 text-gold" /> {fmtDate(post.publishedAt)}
        </p>
        <h3
          className={cn(
            "mt-2.5 font-display leading-snug font-semibold text-espresso transition-colors group-hover:text-gold",
            big ? "text-3xl md:text-4xl" : "text-xl"
          )}
        >
          {brandText(post.title, site.storeName)}
        </h3>
        <p className={cn("mt-2 text-sm leading-relaxed text-choco/65", big ? "line-clamp-2" : "line-clamp-2")}>
          {brandText(post.excerpt, site.storeName)}
        </p>
      </div>
    </Link>
  );
}

/** FROM THE NOORVI JOURNAL — latest 3 published stories. */
export default function HomeJournal() {
  const { site } = useStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchBlogPosts({ publishedOnly: true }), fetchBlogCategories()])
      .then(([p, c]) => {
        if (!alive) return;
        setPosts(p.slice(0, 3));
        setCats(c);
        setLoaded(true);
      })
      .catch(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  if (!loaded) return null;
  if (posts.length === 0) return null;

  const catName = (slug: string) => brandText(cats.find((c) => c.slug === slug)?.name ?? "Journal", site.storeName);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            eyebrow="The journal"
            title={[<>From {site.storeName}</>, <em key="j" className="text-gold">journal ✦</em>]}
            copy="Fresh from the rack, the store and our feed — drops, styling notes and behind-the-scenes."
            className="max-w-xl"
          />
          <Reveal delay={0.3}>
            <Link
              to="/blog"
              className="group inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-espresso uppercase transition-colors hover:text-gold"
            >
              View all stories
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>

        {/* Mobile — horizontal swipe */}
        <div className="-mx-6 mt-12 flex snap-x gap-5 overflow-x-auto px-6 pb-3 no-scrollbar lg:hidden">
          {posts.map((p) => (
            <div key={p.id} className="w-[82%] max-w-[340px] shrink-0 snap-center">
              <StoryCard post={p} catName={catName(p.category)} />
            </div>
          ))}
        </div>

        {/* Desktop — editorial 6/3/3 */}
        <div className="mt-14 hidden grid-cols-12 gap-6 lg:grid">
          <Reveal className="col-span-6" y={44}>
            <StoryCard post={posts[0]} catName={catName(posts[0].category)} big />
          </Reveal>
          {posts.slice(1, 3).map((p, i) => (
            <Reveal key={p.id} className="col-span-3" delay={0.12 + i * 0.1} y={44}>
              <StoryCard post={p} catName={catName(p.category)} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10 text-center lg:hidden">
          <Eyebrow className="justify-center">Swipe for more ✦ or visit the journal</Eyebrow>
        </Reveal>
      </div>
    </section>
  );
}
