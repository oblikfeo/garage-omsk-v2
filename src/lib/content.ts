import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

import type {
  FaqItem,
  HeroContent,
  LooseTexts,
  SectionHeadingContent,
  SectionKey,
  SeoPageContent,
  SeoPageKey,
  SiteContent,
} from "./content-types";

import {
  addonServices as defaultAddonServices,
  faq as defaultFaq,
  gallery as defaultGallery,
  hero as defaultHero,
  notice as defaultNotice,
  pages as defaultPages,
  priceList as defaultPriceList,
  safetyRules as defaultSafetyRules,
  sections as defaultSections,
  services as defaultServices,
  site as defaultSite,
  steps as defaultSteps,
  testimonials as defaultTestimonials,
  texts as defaultTexts,
} from "./data";

export * from "./content-types";

export const defaultContent: SiteContent = {
  site: defaultSite,
  notice: defaultNotice,
  hero: defaultHero,
  sections: defaultSections,
  pages: defaultPages,
  texts: defaultTexts,
  services: defaultServices,
  gallery: defaultGallery,
  addonServices: defaultAddonServices,
  priceList: defaultPriceList,
  steps: defaultSteps,
  safetyRules: defaultSafetyRules,
  faq: defaultFaq,
  testimonials: defaultTestimonials,
};

/**
 * Where the editable copy of the content lives at runtime.
 * On the VPS this is a writable directory next to the build, e.g.
 * CONTENT_DIR=/var/www/garage/data
 */
export function contentDir(): string {
  return process.env.CONTENT_DIR || path.join(process.cwd(), "data");
}

export function contentFile(): string {
  return path.join(contentDir(), "content.json");
}

/* ------------------------------------------------------------------ */
/* normalisation                                                       */
/* ------------------------------------------------------------------ */

const str = (value: unknown, fallback: string): string =>
  typeof value === "string" ? value : fallback;

const num = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const bool = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const strList = (value: unknown, fallback: string[]): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : fallback;

const obj = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

function list<T>(value: unknown, map: (row: Record<string, unknown>) => T, fallback: T[]): T[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map(map);
}

const faqList = (value: unknown, fallback: FaqItem[]): FaqItem[] =>
  list(value, (row) => ({ q: str(row.q, ""), a: str(row.a, "") }), fallback);

function heading(
  value: unknown,
  fallback: SectionHeadingContent
): SectionHeadingContent {
  const raw = obj(value);
  return {
    eyebrow: str(raw.eyebrow, fallback.eyebrow),
    title: str(raw.title, fallback.title),
    description: str(raw.description, fallback.description),
  };
}

function seoPage(value: unknown, fallback: SeoPageContent): SeoPageContent {
  const raw = obj(value);
  return {
    metaTitle: str(raw.metaTitle, fallback.metaTitle),
    metaDescription: str(raw.metaDescription, fallback.metaDescription),
    eyebrow: str(raw.eyebrow, fallback.eyebrow),
    h1: str(raw.h1, fallback.h1),
    intro: str(raw.intro, fallback.intro),
    bullets: strList(raw.bullets, fallback.bullets),
    faqTitle: str(raw.faqTitle, fallback.faqTitle),
    faq: faqList(raw.faq, fallback.faq),
  };
}

function heroContent(value: unknown): HeroContent {
  const raw = obj(value);
  return {
    titleBefore: str(raw.titleBefore, defaultHero.titleBefore),
    titleAccent: str(raw.titleAccent, defaultHero.titleAccent),
    titleAfter: str(raw.titleAfter, defaultHero.titleAfter),
    text: str(raw.text, defaultHero.text),
    // An emptied field falls back to the stock photo instead of a broken image.
    image: str(raw.image, "").trim() || defaultHero.image,
    imageAlt: str(raw.imageAlt, "").trim() || defaultHero.imageAlt,
    imageCaption: str(raw.imageCaption, defaultHero.imageCaption),
    galleryLink: str(raw.galleryLink, defaultHero.galleryLink),
    stats: list(
      raw.stats,
      (row) => ({ label: str(row.label, ""), sub: str(row.sub, "") }),
      defaultHero.stats
    ),
  };
}

function looseTexts(value: unknown): LooseTexts {
  const raw = obj(value);
  return {
    addonsTitle: str(raw.addonsTitle, defaultTexts.addonsTitle),
    priceNote: str(raw.priceNote, defaultTexts.priceNote),
    priceCta: str(raw.priceCta, defaultTexts.priceCta),
    planTitle: str(raw.planTitle, defaultTexts.planTitle),
    planText: str(raw.planText, defaultTexts.planText),
    planViewerCaption: str(raw.planViewerCaption, defaultTexts.planViewerCaption),
    bookingFallback: str(raw.bookingFallback, defaultTexts.bookingFallback),
  };
}

/**
 * Merges a stored overlay onto the defaults so a partial or hand-edited
 * content.json can never take the public site down.
 */
export function normalizeContent(stored: unknown): SiteContent {
  const raw = obj(stored);
  const storedSite = obj(raw.site);
  const storedNotice = obj(raw.notice);
  const storedSections = obj(raw.sections);
  const storedPages = obj(raw.pages);

  const noticeMessage = (key: "work" | "live") => {
    const message = obj(storedNotice[key]);
    return {
      title: str(message.title, defaultNotice[key].title),
      text: str(message.text, defaultNotice[key].text),
    };
  };

  const sectionKeys = Object.keys(defaultSections) as SectionKey[];
  const pageKeys = Object.keys(defaultPages) as SeoPageKey[];

  return {
    site: {
      name: str(storedSite.name, defaultSite.name),
      fullName: str(storedSite.fullName, defaultSite.fullName),
      city: str(storedSite.city, defaultSite.city),
      legalName: str(storedSite.legalName, defaultSite.legalName),
      inn: str(storedSite.inn, defaultSite.inn),
      ogrn: str(storedSite.ogrn, defaultSite.ogrn),
      posts: num(storedSite.posts, defaultSite.posts),
      lifts: num(storedSite.lifts, defaultSite.lifts),
      address: str(storedSite.address, defaultSite.address),
      phone: str(storedSite.phone, defaultSite.phone),
      phoneHref: str(storedSite.phoneHref, defaultSite.phoneHref),
      email: str(storedSite.email, defaultSite.email),
      hours: str(storedSite.hours, defaultSite.hours),
      hoursSchema: str(storedSite.hoursSchema, defaultSite.hoursSchema),
      telegram: str(storedSite.telegram, defaultSite.telegram),
      max: str(storedSite.max, defaultSite.max),
      mapsUrl: str(storedSite.mapsUrl, defaultSite.mapsUrl),
      mapsRouteUrl: str(storedSite.mapsRouteUrl, defaultSite.mapsRouteUrl),
      yclientsUrl: str(storedSite.yclientsUrl, defaultSite.yclientsUrl),
    },

    notice: {
      enabled: bool(storedNotice.enabled, defaultNotice.enabled),
      tone:
        storedNotice.tone === "live" || storedNotice.tone === "work"
          ? storedNotice.tone
          : defaultNotice.tone,
      work: noticeMessage("work"),
      live: noticeMessage("live"),
    },

    hero: heroContent(raw.hero),

    sections: Object.fromEntries(
      sectionKeys.map((key) => [key, heading(storedSections[key], defaultSections[key])])
    ) as SiteContent["sections"],

    pages: Object.fromEntries(
      pageKeys.map((key) => [key, seoPage(storedPages[key], defaultPages[key])])
    ) as SiteContent["pages"],

    texts: looseTexts(raw.texts),

    services: list(
      raw.services,
      (row) => ({
        id: str(row.id, "post"),
        title: str(row.title, ""),
        description: str(row.description, ""),
        bullets: strList(row.bullets, []),
      }),
      defaultContent.services
    ),
    gallery: list(
      raw.gallery,
      (row) => ({
        src: str(row.src, ""),
        alt: str(row.alt, ""),
        title: str(row.title, ""),
        caption: str(row.caption, ""),
      }),
      defaultContent.gallery
    ),
    addonServices: strList(raw.addonServices, defaultContent.addonServices),
    priceList: list(
      raw.priceList,
      (row) => ({
        ...(typeof row.id === "string" && row.id ? { id: row.id } : {}),
        service: str(row.service, ""),
        hour: num(row.hour, 0),
        day: num(row.day, 0),
      }),
      defaultContent.priceList
    ),
    steps: list(
      raw.steps,
      (row) => ({ title: str(row.title, ""), text: str(row.text, "") }),
      defaultContent.steps
    ),
    safetyRules: list(
      raw.safetyRules,
      (row) => ({ title: str(row.title, ""), text: str(row.text, "") }),
      defaultContent.safetyRules
    ),
    faq: faqList(raw.faq, defaultContent.faq),
    testimonials: list(
      raw.testimonials,
      (row) => ({ name: str(row.name, ""), car: str(row.car, ""), text: str(row.text, "") }),
      defaultContent.testimonials
    ),
  };
}

/* ------------------------------------------------------------------ */
/* placeholders                                                        */
/* ------------------------------------------------------------------ */

/**
 * Replaces {posts}, {hours} and friends inside every editable string, so a
 * number or a phone lives in one field only and cannot drift out of sync with
 * the copy that mentions it.
 */
export function applyTokens(content: SiteContent): SiteContent {
  const { site } = content;
  // "Ежедневно, 09:00–19:00" → дни и время по отдельности, чтобы вёрстка
  // с короткой строкой не ломалась, а значение оставалось одним полем.
  const commaAt = site.hours.indexOf(",");
  const hoursDays = commaAt === -1 ? "режим работы" : site.hours.slice(0, commaAt).trim();
  const hoursTime = commaAt === -1 ? site.hours : site.hours.slice(commaAt + 1).trim();

  const values: Record<string, string> = {
    hoursDays,
    hoursTime,
    posts: String(site.posts),
    lifts: String(site.lifts),
    hours: site.hours,
    address: site.address,
    city: site.city,
    phone: site.phone,
    email: site.email,
    name: site.name,
    fullName: site.fullName,
  };

  const substitute = (text: string): string =>
    text.replace(/\{(\w+)\}/g, (match, token: string) =>
      Object.prototype.hasOwnProperty.call(values, token) ? values[token] : match
    );

  const walk = (value: unknown): unknown => {
    if (typeof value === "string") return substitute(value);
    if (Array.isArray(value)) return value.map(walk);
    if (typeof value === "object" && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, walk(item)])
      );
    }
    return value;
  };

  // site itself is the source of the values, so it stays untouched
  const { site: _site, ...rest } = content;
  return { site, ...(walk(rest) as Omit<SiteContent, "site">) };
}

/* ------------------------------------------------------------------ */
/* reading and writing                                                 */
/* ------------------------------------------------------------------ */

async function readContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(contentFile(), "utf8");
    return normalizeContent(JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

/**
 * Content as stored, placeholders left intact. The admin panel edits this —
 * substituting first would bake the numbers into the saved text.
 */
export const getRawContent = cache(readContent);

/** Content ready for the public site, with placeholders resolved. */
export const getContent = cache(async (): Promise<SiteContent> =>
  applyTokens(await readContent())
);

/** Atomic write — a crash mid-save must not leave a truncated content.json. */
export async function saveContent(next: SiteContent): Promise<void> {
  const dir = contentDir();
  await fs.mkdir(dir, { recursive: true });
  const target = contentFile();
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, target);
}
