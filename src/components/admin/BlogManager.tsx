import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Eye,
  ExternalLink,
  GripVertical,
  Pencil,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { MEDIA_OPTIONS } from "../../config/media";
import { isSupabaseReady } from "../../config/supabase";
import {
  addBlogCategory,
  deleteBlogCategory,
  deleteBlogPost,
  fetchBlogCategories,
  fetchBlogPosts,
  fmtDate,
  newId,
  saveBlogPost,
  uploadBlogImage,
  uploadBlogVideo,
  type BlogCategory,
  type BlogPost,
  type GalleryItem,
  type PostStatus,
  type PostType,
} from "../../services/blog";
import { useStore } from "../../context/store";
import { cn, uid } from "../../utils/helpers";

const INPUT =
  "w-full border border-espresso/20 bg-ivory px-4 py-3 text-sm text-espresso outline-none transition-colors focus:border-gold placeholder:text-choco/35";
const LABEL = "mb-1.5 block text-[10px] font-semibold tracking-[0.25em] text-choco/60 uppercase";

const EMPTY_POST = (category: string): BlogPost => ({
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category,
  postType: "IMAGE",
  featuredImageUrl: "",
  videoUrl: "",
  videoPosterUrl: "",
  videoRatio: "16/9",
  gallery: [],
  status: "draft",
  isFeatured: false,
  views: 0,
  publishedAt: "",
  createdAt: "",
  updatedAt: "",
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "";

const STATUS_STYLE: Record<PostStatus, string> = {
  published: "border-[#7c8b57] bg-[#7c8b57]/15 text-[#5f6c42]",
  draft: "border-gold bg-gold/15 text-choco",
  hidden: "border-espresso/25 bg-espresso/5 text-choco/55",
};

/* ─────────────────────── Upload box ─────────────────────── */

function UploadBox({
  label,
  kind,
  value,
  onChange,
  hint,
}: {
  label: string;
  kind: "image" | "video";
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setFileName(file.name);
    try {
      setProgress(0);
      const url =
        kind === "image"
          ? await uploadBlogImage(file, setProgress)
          : await uploadBlogVideo(file, setProgress);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed — try another file.");
    } finally {
      setProgress(null);
    }
  };

  return (
    <div>
      <p className={LABEL}>{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"}
        className="hidden"
        onChange={(e) => {
          void handle(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="flex flex-col gap-3 border border-espresso/15 bg-cream p-4 sm:flex-row sm:items-center">
          {kind === "image" ? (
            <img src={value} alt="Preview" className="h-24 w-20 shrink-0 object-cover" />
          ) : (
            <video src={value} controls className="h-28 w-44 shrink-0 bg-espresso object-contain" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-espresso">{fileName || "Uploaded file"}</p>
            <p className="mt-1 text-[10px] tracking-wide text-choco/50">
              {kind === "image" ? "JPG · PNG · WebP · max 6 MB" : "MP4 · WebM · max 80 MB"}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="border border-espresso/25 px-3.5 py-2 text-[9px] font-semibold tracking-[0.2em] uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="border border-espresso/25 px-3.5 py-2 text-[9px] font-semibold tracking-[0.2em] uppercase transition-colors hover:border-[#b3552e] hover:text-[#b3552e]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-28 w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-espresso/25 bg-ivory px-4 py-6 text-center transition-colors hover:border-gold hover:bg-gold/5"
        >
          <Upload className="h-5 w-5 text-gold" strokeWidth={1.5} />
          <span className="text-[10px] font-semibold tracking-[0.25em] text-choco/70 uppercase">
            Upload {kind === "image" ? "image" : "video"}
          </span>
          <span className="text-[10px] text-choco/45">
            {kind === "image" ? "JPG, PNG or WebP · up to 6 MB" : "MP4 or WebM · up to 80 MB"}
          </span>
        </button>
      )}

      {progress !== null && (
        <div className="mt-2.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-espresso/10">
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] tracking-wide text-choco/55">
            Uploading… {progress}% {progress >= 100 && "✦"}
          </p>
        </div>
      )}
      {error && <p className="mt-2 text-xs font-medium text-[#b3552e]">{error}</p>}
      {hint && <p className="mt-1.5 text-[10px] leading-relaxed text-choco/50">{hint}</p>}
    </div>
  );
}

/* ─────────────────────── Gallery editor ─────────────────────── */

function GalleryEditor({ items, onChange }: { items: GalleryItem[]; onChange: (g: GalleryItem[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIdx = useRef<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    const added: GalleryItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const url = await uploadBlogImage(file);
        added.push({ id: uid(), url, alt: file.name.replace(/\.[a-z]+$/i, ""), sortOrder: 0 });
      } catch (err) {
        setError(err instanceof Error ? `${file.name}: ${err.message}` : "One file failed to upload.");
      }
    }
    onChange([...items, ...added].map((g, i) => ({ ...g, sortOrder: i })));
    setBusy(false);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next.map((g, i) => ({ ...g, sortOrder: i })));
  };

  return (
    <div>
      <p className={LABEL}>Gallery images · drag to reorder</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="space-y-2.5">
        {items.map((g, i) => (
          <div
            key={g.id}
            draggable
            onDragStart={() => (dragIdx.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIdx.current !== null) move(dragIdx.current, i);
              dragIdx.current = null;
            }}
            className="flex items-center gap-3 border border-espresso/15 bg-cream p-2.5"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-choco/40" />
            <img src={g.url} alt={g.alt || `Gallery ${i + 1}`} className="h-14 w-12 shrink-0 object-cover" />
            <input
              value={g.alt}
              onChange={(e) =>
                onChange(items.map((x) => (x.id === g.id ? { ...x, alt: e.target.value } : x)))
              }
              placeholder="Alt text / caption"
              className="min-w-0 flex-1 border border-transparent bg-transparent px-2 py-1.5 text-xs text-espresso outline-none focus:border-gold"
            />
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => move(i, i - 1)} aria-label="Move up" className="p-1.5 text-choco/50 hover:text-gold disabled:opacity-30" disabled={i === 0}>
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(i, i + 1)} aria-label="Move down" className="p-1.5 text-choco/50 hover:text-gold disabled:opacity-30" disabled={i === items.length - 1}>
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((x) => x.id !== g.id).map((x, j) => ({ ...x, sortOrder: j })))}
                aria-label="Remove image"
                className="p-1.5 text-choco/50 hover:text-[#b3552e]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 border-2 border-dashed border-espresso/25 bg-ivory py-3 text-[10px] font-semibold tracking-[0.25em] uppercase transition-colors hover:border-gold hover:bg-gold/5 disabled:opacity-50"
      >
        <Plus className="h-4 w-4 text-gold" /> {busy ? "Uploading…" : "Add gallery images"}
      </button>
      {error && <p className="mt-2 text-xs font-medium text-[#b3552e]">{error}</p>}
    </div>
  );
}

/* ─────────────────────── Post form ─────────────────────── */

function PostForm({
  initial,
  cats,
  onDone,
}: {
  initial: BlogPost;
  cats: BlogCategory[];
  onDone: () => void;
}) {
  const { pushToast } = useStore();
  const [form, setForm] = useState<BlogPost>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [saving, setSaving] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) => setForm((f) => ({ ...f, [k]: v }));

  const insertMd = (before: string, after = "", placeholder = "text") => {
    const ta = taRef.current;
    const value = form.content;
    if (!ta) {
      set("content", value ? `${value}\n${before}${placeholder}${after}` : `${before}${placeholder}${after}`);
      return;
    }
    const s = ta.selectionStart ?? value.length;
    const e = ta.selectionEnd ?? value.length;
    const sel = value.slice(s, e) || placeholder;
    set("content", value.slice(0, s) + before + sel + after + value.slice(e));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };

  const showVideo = form.postType === "VIDEO" || form.postType === "REEL";

  const submit = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      pushToast("A title and a slug are required ✦");
      return;
    }
    const now = new Date().toISOString();
    const next: BlogPost = {
      ...form,
      id: form.id || newId(),
      createdAt: form.createdAt || now,
      publishedAt: form.status === "published" ? form.publishedAt || now : form.publishedAt,
    };
    setSaving(true);
    try {
      await saveBlogPost(next);
      pushToast(form.id ? "Story updated ✦" : "Story created ✦");
      onDone();
    } catch (err) {
      pushToast(`Save failed — ${err instanceof Error ? err.message : "connection error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDone}
          className="text-[10px] font-semibold tracking-[0.3em] text-choco/60 uppercase transition-colors hover:text-gold"
        >
          ← Back to all stories
        </button>
        <span className={cn("border px-3.5 py-1.5 text-[9px] font-bold tracking-[0.25em] uppercase", STATUS_STYLE[form.status])}>
          {form.status}
        </span>
      </div>

      {/* Basics */}
      <div className="grid gap-5 border border-espresso/12 bg-ivory p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={LABEL}>Post title</label>
          <input
            value={form.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            placeholder="The New Pink Collection Is Here"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Slug · noorvi.fashion/blog/…</label>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            placeholder="new-pink-collection"
            className={cn(INPUT, "font-mono text-xs")}
          />
        </div>
        <div>
          <label className={LABEL}>Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={INPUT}>
            {cats.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Post type</label>
          <select value={form.postType} onChange={(e) => set("postType", e.target.value as PostType)} className={INPUT}>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video (16:9)</option>
            <option value="REEL">Reel (9:16 vertical)</option>
            <option value="IMAGE_GALLERY">Image gallery</option>
            <option value="TEXT">Text story</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Status</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value as PostStatus)} className={INPUT}>
            <option value="draft">Draft — only you see it</option>
            <option value="published">Published — live on the site</option>
            <option value="hidden">Hidden — unpublished, kept for later</option>
          </select>
        </div>
        <div className="flex items-end gap-6 pb-1">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set("isFeatured", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <span className="text-xs text-choco/75">Featured story (top of /blog)</span>
          </label>
        </div>
        <div className="md:col-span-2">
          <label className={LABEL}>Short description</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            placeholder="One or two tempting lines for cards, search and shares."
            className={cn(INPUT, "resize-y")}
          />
        </div>
      </div>

      {/* Media */}
      <div className="grid gap-6 border border-espresso/12 bg-ivory p-6 lg:grid-cols-2">
        <div className="space-y-5">
          <UploadBox label="Featured image" kind="image" value={form.featuredImageUrl} onChange={(url) => set("featuredImageUrl", url)} />
          <div>
            <label className={LABEL}>…or pick from the Noorvi library</label>
            <select value="" onChange={(e) => e.target.value && set("featuredImageUrl", e.target.value)} className={INPUT}>
              <option value="">Choose a brand photo…</option>
              {MEDIA_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          {showVideo && (
            <>
              <UploadBox label="Post video" kind="video" value={form.videoUrl} onChange={(url) => set("videoUrl", url)} />
              <UploadBox
                label="Video poster (thumbnail)"
                kind="image"
                value={form.videoPosterUrl}
                onChange={(url) => set("videoPosterUrl", url)}
                hint="Shown before playback — keeps the page fast."
              />
              <div>
                <label className={LABEL}>Video shape</label>
                <select value={form.videoRatio} onChange={(e) => set("videoRatio", e.target.value as BlogPost["videoRatio"])} className={INPUT}>
                  <option value="16/9">16:9 — landscape</option>
                  <option value="9/16">9:16 — vertical reel</option>
                </select>
              </div>
            </>
          )}
        </div>
        <GalleryEditor items={form.gallery} onChange={(g) => set("gallery", g)} />
        {!isSupabaseReady && (
          <p className="border border-gold/40 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-choco/75 lg:col-span-2">
            <span className="font-semibold text-espresso">Demo storage:</span> uploaded files stay in this
            browser session. Add Supabase keys (see README) and media uploads to the{" "}
            <span className="font-mono">blog-images</span> / <span className="font-mono">blog-videos</span> buckets permanently.
          </p>
        )}
      </div>

      {/* Content */}
      <div className="border border-espresso/12 bg-ivory p-6">
        <label className={LABEL}>Story content</label>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {[
            { t: "H2", fn: () => insertMd("\n## ", "\n", "Heading") },
            { t: "H3", fn: () => insertMd("\n### ", "\n", "Subheading") },
            { t: "B", fn: () => insertMd("**", "**", "bold") },
            { t: "I", fn: () => insertMd("*", "*", "italic") },
            { t: "• List", fn: () => insertMd("\n- ", "", "list item") },
            { t: "❝ Quote", fn: () => insertMd("\n> ", "\n", "a quotable line") },
            { t: "🔗 Link", fn: () => insertMd("[", "](/shop)", "shop the looks") },
          ].map((b) => (
            <button
              key={b.t}
              type="button"
              onClick={b.fn}
              className="border border-espresso/20 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-choco/70 uppercase transition-colors hover:border-gold hover:text-gold"
            >
              {b.t}
            </button>
          ))}
        </div>
        <textarea
          ref={taRef}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          rows={12}
          placeholder={"Write the story…\n\n## Use headings\n- bullet lists\n**bold lines** and [links](/shop)"}
          className={cn(INPUT, "min-h-64 resize-y font-mono text-[13px] leading-relaxed")}
        />
        <p className="mt-2 text-[10px] text-choco/50">
          Simple formatting: ## heading · **bold** · *italic* · - list · &gt; quote · [text](link)
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={saving}
          className="bg-espresso px-9 py-4 text-[10px] font-semibold tracking-[0.3em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso disabled:opacity-50"
        >
          {saving ? "Saving…" : form.id ? "Save changes ✦" : "Create story ✦"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border border-espresso/25 px-9 py-4 text-[10px] font-semibold tracking-[0.3em] text-choco/70 uppercase transition-colors hover:border-gold hover:text-gold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── Manager ─────────────────────── */

export default function BlogManager() {
  const { pushToast } = useStore();
  const [tab, setTab] = useState<"posts" | "cats">("posts");
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [editing, setEditing] = useState<BlogPost | null | "new">(null);
  const [failed, setFailed] = useState(false);
  const [armedDelete, setArmedDelete] = useState("");
  const [newCat, setNewCat] = useState("");

  const load = () => {
    setFailed(false);
    Promise.all([fetchBlogPosts({}), fetchBlogCategories()])
      .then(([p, c]) => {
        setPosts(p);
        setCats(c);
      })
      .catch(() => setFailed(true));
  };

  useEffect(load, []);

  const quick = async (p: BlogPost, patch: Partial<BlogPost>, msg: string) => {
    try {
      await saveBlogPost({ ...p, ...patch });
      pushToast(msg);
      load();
    } catch {
      pushToast("Update failed — connection error");
    }
  };

  const remove = async (p: BlogPost) => {
    if (armedDelete !== p.id) {
      setArmedDelete(p.id);
      window.setTimeout(() => setArmedDelete(""), 3000);
      return;
    }
    setArmedDelete("");
    try {
      await deleteBlogPost(p.id);
      pushToast("Story deleted");
      load();
    } catch {
      pushToast("Delete failed — connection error");
    }
  };

  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug;

  if (editing) {
    return (
      <PostForm
        initial={editing === "new" ? EMPTY_POST(cats[0]?.slug ?? "new-arrivals") : editing}
        cats={cats}
        onDone={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-7">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("posts")}
            className={cn(
              "border px-5 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase transition-all",
              tab === "posts" ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 text-choco/70 hover:border-gold"
            )}
          >
            Stories {posts ? `(${posts.length})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setTab("cats")}
            className={cn(
              "border px-5 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase transition-all",
              tab === "cats" ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 text-choco/70 hover:border-gold"
            )}
          >
            Categories ({cats.length})
          </button>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 bg-gold px-6 py-3 text-[10px] font-bold tracking-[0.25em] text-espresso uppercase transition-colors hover:bg-espresso hover:text-ivory"
        >
          <Plus className="h-4 w-4" /> New story
        </button>
      </div>

      {failed && (
        <div className="border border-[#b3552e]/40 bg-[#b3552e]/10 px-5 py-4 text-sm text-[#8a3f20]">
          Couldn't reach the story database.{" "}
          <button type="button" onClick={load} className="font-semibold underline underline-offset-4">
            Retry
          </button>
        </div>
      )}

      {tab === "posts" && (
        <>
          {!posts && !failed && (
            <div className="space-y-3" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse border border-espresso/10 bg-cream" />
              ))}
            </div>
          )}

          {posts && posts.length === 0 && (
            <div className="border border-espresso/12 bg-ivory px-6 py-16 text-center">
              <p className="font-display text-3xl font-semibold text-espresso">No stories yet</p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-choco/65">
                Publish your first drop announcement, styling guide or store update — it appears on the site instantly.
              </p>
            </div>
          )}

          {posts && posts.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto border border-espresso/12 bg-ivory md:block">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-espresso/12 text-[9px] tracking-[0.25em] text-choco/50 uppercase">
                      <th className="px-5 py-4">Story</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Type</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Published</th>
                      <th className="px-4 py-4">Views</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-espresso/8">
                    {posts.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-cream/50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3.5">
                            {p.featuredImageUrl ? (
                              <img src={p.featuredImageUrl} alt="" className="h-14 w-11 shrink-0 object-cover" />
                            ) : (
                              <span className="flex h-14 w-11 shrink-0 items-center justify-center bg-nude font-display text-lg text-choco/40">✦</span>
                            )}
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 font-display text-base leading-tight font-semibold text-espresso">
                                {p.isFeatured && <Star className="h-3.5 w-3.5 shrink-0 text-gold" fill="currentColor" />}
                                <span className="truncate">{p.title}</span>
                              </p>
                              <p className="mt-0.5 truncate font-mono text-[10px] text-choco/45">/blog/{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-choco/70">{catName(p.category)}</td>
                        <td className="px-4 py-3.5 text-[10px] font-semibold tracking-[0.15em] text-choco/60 uppercase">{p.postType.replace("_", " ")}</td>
                        <td className="px-4 py-3.5">
                          <span className={cn("border px-2.5 py-1 text-[9px] font-bold tracking-[0.18em] uppercase", STATUS_STYLE[p.status])}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-choco/60">{fmtDate(p.publishedAt)}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gold">{p.views}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            {p.status === "published" ? (
                              <button type="button" onClick={() => void quick(p, { status: "draft" }, "Unpublished — moved to drafts")} title="Unpublish" className="p-2 text-choco/50 transition-colors hover:text-choco">
                                <Eye className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => void quick(p, { status: "published", publishedAt: p.publishedAt || new Date().toISOString() }, "Published ✦")}
                                title="Publish"
                                className="p-2 text-[#7c8b57] transition-colors hover:text-[#5f6c42]"
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => void quick(p, { isFeatured: !p.isFeatured }, p.isFeatured ? "Removed from featured" : "Now the featured story ✦")}
                              title="Toggle featured"
                              className={cn("p-2 transition-colors", p.isFeatured ? "text-gold" : "text-choco/40 hover:text-gold")}
                            >
                              <Star className="h-4 w-4" fill={p.isFeatured ? "currentColor" : "none"} />
                            </button>
                            <Link to={`/blog/${p.slug}`} title="Preview" className="p-2 text-choco/50 transition-colors hover:text-gold">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <button type="button" onClick={() => setEditing(p)} title="Edit" className="p-2 text-choco/50 transition-colors hover:text-espresso">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void remove(p)}
                              title="Delete"
                              className={cn("p-2 transition-colors", armedDelete === p.id ? "bg-[#b3552e] text-ivory" : "text-choco/50 hover:text-[#b3552e]")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {posts.map((p) => (
                  <div key={p.id} className="border border-espresso/12 bg-ivory p-4">
                    <div className="flex gap-3.5">
                      {p.featuredImageUrl ? (
                        <img src={p.featuredImageUrl} alt="" className="h-16 w-14 shrink-0 object-cover" />
                      ) : (
                        <span className="flex h-16 w-14 shrink-0 items-center justify-center bg-nude font-display text-choco/40">✦</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg leading-tight font-semibold text-espresso">{p.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className={cn("border px-2 py-0.5 text-[8px] font-bold tracking-[0.18em] uppercase", STATUS_STYLE[p.status])}>{p.status}</span>
                          <span className="text-[9px] tracking-[0.15em] text-choco/50 uppercase">{catName(p.category)} · {p.postType.replace("_", " ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-espresso/8 pt-3">
                      <span className="text-[10px] text-choco/50">{fmtDate(p.publishedAt)} · {p.views} views</span>
                      <div className="flex gap-1">
                        {p.status !== "published" && (
                          <button
                            type="button"
                            onClick={() => void quick(p, { status: "published", publishedAt: p.publishedAt || new Date().toISOString() }, "Published ✦")}
                            className="border border-[#7c8b57] px-3 py-2 text-[9px] font-bold tracking-[0.15em] text-[#5f6c42] uppercase"
                          >
                            Publish
                          </button>
                        )}
                        {p.status === "published" && (
                          <button type="button" onClick={() => void quick(p, { status: "draft" }, "Unpublished")} className="border border-espresso/25 px-3 py-2 text-[9px] font-bold tracking-[0.15em] text-choco/60 uppercase">
                            Unpublish
                          </button>
                        )}
                        <button type="button" onClick={() => setEditing(p)} className="border border-espresso/25 p-2 text-choco/60">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void remove(p)}
                          className={cn("border p-2", armedDelete === p.id ? "border-[#b3552e] bg-[#b3552e] text-ivory" : "border-espresso/25 text-choco/60")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {tab === "cats" && (
        <div className="max-w-xl space-y-5">
          <div className="flex gap-2">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="New category — e.g. Wedding Season"
              className={INPUT}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newCat.trim()) {
                  void addBlogCategory(newCat)
                    .then(() => {
                      setNewCat("");
                      pushToast("Category added ✦");
                      load();
                    })
                    .catch(() => pushToast("Couldn't add category"));
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (!newCat.trim()) return;
                void addBlogCategory(newCat)
                  .then(() => {
                    setNewCat("");
                    pushToast("Category added ✦");
                    load();
                  })
                  .catch(() => pushToast("Couldn't add category"));
              }}
              className="shrink-0 bg-espresso px-6 text-[10px] font-semibold tracking-[0.25em] text-ivory uppercase transition-colors hover:bg-gold hover:text-espresso"
            >
              Add
            </button>
          </div>
          <ul className="divide-y divide-espresso/10 border border-espresso/12 bg-ivory">
            {cats.map((c) => {
              const count = posts?.filter((p) => p.category === c.slug).length ?? 0;
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-display text-lg font-semibold text-espresso">{c.name}</p>
                    <p className="font-mono text-[10px] text-choco/45">/blog · {c.slug} · {count} stories</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      void deleteBlogCategory(c.id)
                        .then(() => {
                          pushToast("Category removed");
                          load();
                        })
                        .catch(() => pushToast("Couldn't remove category"));
                    }}
                    aria-label={`Delete ${c.name}`}
                    className="p-2 text-choco/40 transition-colors hover:text-[#b3552e]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
