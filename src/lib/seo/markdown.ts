import { Marked } from "marked";

/** Anchor id for a heading: lower case, letters (incl. Cyrillic) and digits joined by "-". */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      return `<h${depth} id="${headingId(inner)}">${inner}</h${depth}>\n`;
    },
    image({ href, title, text }) {
      const t = title ? ` title="${title}"` : "";
      return `<img src="${href}" alt="${text}"${t} loading="lazy" decoding="async" />`;
    },
  },
});

/** Markdown → HTML. Content is written by our own team (SEO specialist, Claude Code). */
export function markdownToHtml(source?: string): string {
  return source ? (marked.parse(source, { async: false }) as string) : "";
}

/** H2 headings of a Markdown text, for the article table of contents. */
export function markdownToc(source?: string): { id: string; text: string }[] {
  if (!source) return [];
  return marked
    .lexer(source)
    .filter((t): t is Extract<typeof t, { type: "heading" }> => t.type === "heading" && t.depth === 2)
    .map((t) => ({ id: headingId(t.text), text: t.text.replace(/[*_`]/g, "") }));
}
