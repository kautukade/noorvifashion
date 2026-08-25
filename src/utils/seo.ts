/** Dynamic per-page SEO metadata (title, description, Open Graph). */
export function setPageMeta(opts: { title: string; description?: string; image?: string }): void {
  document.title = opts.title;

  const ensure = (attr: "name" | "property", key: string): HTMLMetaElement => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    return el;
  };

  ensure("property", "og:title").content = opts.title;
  ensure("property", "og:type").content = "article";
  ensure("property", "og:url").content = window.location.href;
  if (opts.description) {
    ensure("name", "description").content = opts.description;
    ensure("property", "og:description").content = opts.description;
  }
  if (opts.image) {
    ensure("property", "og:image").content = opts.image;
  }
}
