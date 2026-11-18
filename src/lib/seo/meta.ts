import type { Metadata } from "next";
import type { Common, Content, Photo } from "./content";

type TemplateKind = keyof Content["site"]["templates"];

export function photoById(content: Content, id?: string): Photo | undefined {
  return id ? content.photos.find((p) => p.id === id) : undefined;
}

export function fillTemplate(template: string, vars: Record<string, string | number | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined || value === "" ? match : String(value);
  });
}

/**
 * Metadata of any SEO page: title/description from the file or the type's
 * template in site.json, self-canonical without GET parameters, noindex for
 * index: false, Open Graph with og_image or the default box photo.
 */
export function pageMetadata(
  content: Content,
  page: Common,
  kind: TemplateKind,
  path: string,
  vars: Record<string, string | number | undefined> = {}
): Metadata {
  const allVars = { h1: page.h1, price_post: content.site.rates.post, ...vars };
  const template = content.site.templates[kind];
  const title = page.title || fillTemplate(template.title, allVars);
  const description = page.description || fillTemplate(template.description, allVars);
  const canonical = page.canonical || path;
  const og = photoById(content, page.og_image) ?? photoById(content, content.site.default_og_image);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: page.index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: kind === "article" ? "article" : "website",
      locale: "ru_RU",
      images: og ? [{ url: og.src, alt: og.alt }] : undefined,
    },
  };
}
