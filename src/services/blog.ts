import { getSupabase } from "../config/supabase";
import { BLOG_CATEGORIES_SEED, BLOG_POSTS_SEED } from "../data/blogSeed";

/* ───────────────────────── Types ───────────────────────── */

export type PostStatus = "draft" | "published" | "hidden";
export type PostType = "IMAGE" | "VIDEO" | "IMAGE_GALLERY" | "TEXT" | "REEL";
export type VideoRatio = "16/9" | "9/16";

export type GalleryItem = { id: string; url: string; alt: string; sortOrder: number };

export type BlogCategory = { id: string; name: string; slug: string; createdAt: string };

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string; // category slug
  postType: PostType;
  featuredImageUrl: string;
  videoUrl: string;
  videoPosterUrl: string;
  videoRatio: VideoRatio;
  gallery: GalleryItem[];
  status: PostStatus;
  isFeatured: boolean;
  views: number;
  publishedAt: string; // ISO string, "" when never published
  createdAt: string;
  updatedAt: string;
};

type SupaPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  post_type: PostType;
  featured_image_url: string | null;
  video_url: string | null;
  video_poster_url: string | null;
  video_ratio: VideoRatio | null;
  status: PostStatus;
  is_featured: boolean;
  views: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type SupaMediaRow = {
  id: string;
  post_id: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  sort_order: number;
};

/* ─────────────────────── Demo (localStorage) mode ─────────────────────── */

const POSTS_KEY = "noorvi_blog_posts_v1";
const CATS_KEY = "noorvi_blog_cats_v1";

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / unavailable */
  }
}

function localPosts(): BlogPost[] {
  const existing = readLS<BlogPost[] | null>(POSTS_KEY, null);
  if (existing) return existing;
  const seeded = BLOG_POSTS_SEED as unknown as BlogPost[];
  writeLS(POSTS_KEY, seeded);
  return seeded;
}

function localCats(): BlogCategory[] {
  const existing = readLS<BlogCategory[] | null>(CATS_KEY, null);
  if (existing) return existing;
  const seeded = BLOG_CATEGORIES_SEED as BlogCategory[];
  writeLS(CATS_KEY, seeded);
  return seeded;
}

const wait = (ms = 380) => new Promise<void>((r) => window.setTimeout(r, ms));
export const newId = () => `bp-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ─────────────────────── Supabase mapping ─────────────────────── */

function rowToPost(row: SupaPostRow, media: SupaMediaRow[]): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    category: row.category,
    postType: row.post_type,
    featuredImageUrl: row.featured_image_url ?? "",
    videoUrl: row.video_url ?? "",
    videoPosterUrl: row.video_poster_url ?? "",
    videoRatio: row.video_ratio ?? "16/9",
    gallery: media.map((m) => ({
      id: m.id,
      url: m.media_url,
      alt: m.alt_text ?? "",
      sortOrder: m.sort_order ?? 0,
    })),
    status: row.status,
    isFeatured: row.is_featured,
    views: row.views ?? 0,
    publishedAt: row.published_at ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ─────────────────────── Public API ─────────────────────── */

export async function fetchBlogPosts(opts: { publishedOnly?: boolean } = {}): Promise<BlogPost[]> {
  const supabase = await getSupabase();
  if (supabase) {
    let query = supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
    if (opts.publishedOnly) query = query.eq("status", "published");
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as SupaPostRow[];
    let media: SupaMediaRow[] = [];
    if (rows.length) {
      const res = await supabase
        .from("blog_media")
        .select("*")
        .in("post_id", rows.map((r) => r.id))
        .order("sort_order");
      if (!res.error) media = (res.data ?? []) as SupaMediaRow[];
    }
    return rows.map((r) => rowToPost(r, media.filter((m) => m.post_id === r.id)));
  }
  await wait();
  const all = localPosts();
  const filtered = opts.publishedOnly ? all.filter((p) => p.status === "published") : all;
  return [...filtered].sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt));
}

export async function fetchBlogPostBySlug(
  slug: string,
  opts: { publishedOnly?: boolean } = { publishedOnly: true }
): Promise<BlogPost | null> {
  const posts = await fetchBlogPosts(opts);
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function saveBlogPost(post: BlogPost): Promise<BlogPost> {
  const supabase = await getSupabase();
  if (supabase) {
    const row: SupaPostRow = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      post_type: post.postType,
      featured_image_url: post.featuredImageUrl,
      video_url: post.videoUrl,
      video_poster_url: post.videoPosterUrl,
      video_ratio: post.videoRatio,
      status: post.status,
      is_featured: post.isFeatured,
      views: post.views,
      published_at: post.publishedAt || null,
      created_at: post.createdAt,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("blog_posts").upsert(row);
    if (error) throw new Error(error.message);
    await supabase.from("blog_media").delete().eq("post_id", post.id);
    if (post.gallery.length) {
      const mediaRows = post.gallery.map((g, i) => ({
        post_id: post.id,
        media_type: "image",
        media_url: g.url,
        thumbnail_url: null,
        alt_text: g.alt,
        sort_order: g.sortOrder ?? i,
      }));
      const { error: mErr } = await supabase.from("blog_media").insert(mediaRows);
      if (mErr) throw new Error(mErr.message);
    }
    return { ...post, updatedAt: new Date().toISOString() };
  }
  await wait(250);
  const all = localPosts();
  const next = { ...post, updatedAt: new Date().toISOString() };
  const i = all.findIndex((p) => p.id === post.id);
  if (i === -1) all.unshift(next);
  else all[i] = next;
  writeLS(POSTS_KEY, all);
  return next;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await getSupabase();
  if (supabase) {
    await supabase.from("blog_media").delete().eq("post_id", id);
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await wait(200);
  writeLS(POSTS_KEY, localPosts().filter((p) => p.id !== id));
}

export async function incrementPostViews(id: string): Promise<void> {
  const supabase = await getSupabase();
  if (supabase) {
    const { data } = await supabase.from("blog_posts").select("views").eq("id", id).single();
    if (data) {
      await supabase.from("blog_posts").update({ views: (data.views ?? 0) + 1 }).eq("id", id);
    }
    return;
  }
  const all = localPosts();
  const p = all.find((x) => x.id === id);
  if (p) {
    p.views += 1;
    writeLS(POSTS_KEY, all);
  }
}

/* ─────────────────────── Categories ─────────────────────── */

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from("blog_categories").select("*").order("name");
    if (error) throw new Error(error.message);
    return (data ?? []) as BlogCategory[];
  }
  await wait(200);
  return localCats();
}

export async function addBlogCategory(name: string): Promise<BlogCategory> {
  const cat: BlogCategory = {
    id: `bc-${Date.now().toString(36)}`,
    name: name.trim(),
    slug:
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "category",
    createdAt: new Date().toISOString(),
  };
  const supabase = await getSupabase();
  if (supabase) {
    const { error } = await supabase.from("blog_categories").insert(cat);
    if (error) throw new Error(error.message);
    return cat;
  }
  await wait(200);
  const cats = [...localCats(), cat];
  writeLS(CATS_KEY, cats);
  return cat;
}

export async function deleteBlogCategory(id: string): Promise<void> {
  const supabase = await getSupabase();
  if (supabase) {
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await wait(150);
  writeLS(CATS_KEY, localCats().filter((c) => c.id !== id));
}

/* ─────────────────────── Uploads ─────────────────────── */

export const IMAGE_LIMIT_MB = 6;
export const VIDEO_LIMIT_MB = 80;

export function validateImageFile(file: File): string | null {
  const ok = ["image/jpeg", "image/png", "image/webp"];
  if (!ok.includes(file.type)) return "Images must be JPG, PNG or WebP.";
  if (file.size > IMAGE_LIMIT_MB * 1024 * 1024)
    return `Keep images under ${IMAGE_LIMIT_MB} MB so the site stays fast on mobile.`;
  return null;
}

export function validateVideoFile(file: File): string | null {
  const ok = ["video/mp4", "video/webm"];
  if (!ok.includes(file.type)) return "Videos must be MP4 or WebM.";
  if (file.size > VIDEO_LIMIT_MB * 1024 * 1024)
    return `Keep videos under ${VIDEO_LIMIT_MB} MB — compress first for mobile viewers.`;
  return null;
}

async function staged<T>(work: () => Promise<T>, onProgress?: (pct: number) => void): Promise<T> {
  let pct = 8;
  onProgress?.(pct);
  const iv = window.setInterval(() => {
    pct = Math.min(92, pct + 6 + Math.random() * 12);
    onProgress?.(Math.round(pct));
  }, 240);
  try {
    const result = await work();
    onProgress?.(100);
    return result;
  } finally {
    window.clearInterval(iv);
  }
}

/** Upload an image. Supabase → blog-images bucket. Demo → session object URL. */
export async function uploadBlogImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const err = validateImageFile(file);
  if (err) throw new Error(err);
  return staged(async () => {
    const supabase = await getSupabase();
    if (supabase) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
      const { error } = await supabase.storage
        .from("blog-images")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw new Error(`Image upload failed: ${error.message}`);
      return supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
    }
    return URL.createObjectURL(file);
  }, onProgress);
}

/** Upload a video. Supabase → blog-videos bucket. Demo → session object URL. */
export async function uploadBlogVideo(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const err = validateVideoFile(file);
  if (err) throw new Error(err);
  return staged(async () => {
    const supabase = await getSupabase();
    if (supabase) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
      const { error } = await supabase.storage
        .from("blog-videos")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw new Error(`Video upload failed: ${error.message}`);
      return supabase.storage.from("blog-videos").getPublicUrl(path).data.publicUrl;
    }
    return URL.createObjectURL(file);
  }, onProgress);
}

/* ─────────────────────── Formatting helpers ─────────────────────── */

export function fmtDate(iso: string): string {
  if (!iso) return "Draft";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Draft";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function readingTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))} min read`;
}
