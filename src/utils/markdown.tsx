import type { ReactNode } from "react";

/**
 * Tiny, safe markdown renderer for Noorvi Journal posts.
 * Supports: ## / ### headings, **bold**, *italic*, [links](url),
 * - bullet lists, > quotes, and paragraphs. No HTML injection.
 */

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={k++} className="font-semibold text-espresso">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith("[")) {
      const mm = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(tok);
      if (mm) {
        const external = mm[2].startsWith("http");
        nodes.push(
          <a
            key={k++}
            href={mm[2]}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="text-gold underline decoration-gold/50 underline-offset-4 transition-colors hover:text-espresso"
          >
            {mm[1]}
          </a>
        );
      }
    } else {
      nodes.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function renderMarkdown(md: string): ReactNode {
  const lines = md.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(
        <h4 key={key++} className="mt-8 font-display text-2xl font-semibold text-espresso">
          {inline(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h3 key={key++} className="mt-10 font-display text-3xl font-semibold text-espresso md:text-4xl">
          {inline(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={key++}
          className="mt-6 border-l-2 border-gold pl-5 font-display text-xl text-choco italic md:text-2xl"
        >
          {inline(line.slice(2))}
        </blockquote>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="mt-5 space-y-2.5">
          {items.map((it, j) => (
            <li key={j} className="flex gap-3 text-[16.5px] leading-relaxed text-choco/85">
              <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
              <span>{inline(it)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else {
      blocks.push(
        <p key={key++} className="mt-5 text-[16.5px] leading-[1.8] text-choco/85">
          {inline(line)}
        </p>
      );
    }
    i++;
  }
  return blocks;
}
