import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { SiteContent } from "./content-types";

import {
  addonServices as defaultAddonServices,
  faq as defaultFaq,
  gallery as defaultGallery,
  priceList as defaultPriceList,
  safetyRules as defaultSafetyRules,
  services as defaultServices,
  notice as defaultNotice,
  site as defaultSite,
  steps as defaultSteps,
  testimonials as defaultTestimonials,
} from "./data";

export * from "./content-types";

export const defaultContent: SiteContent = {
  site: defaultSite,
  notice: defaultNotice,
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

const str = (value: unknown, fallback: string): string =>
  typeof value === "string" ? value : fallback;

const num = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const bool = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const strList = (value: unknown, fallback: string[]): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : fallback;

function list<T>(value: unknown, map: (row: Record<string, unknown>) => T, fallback: T[]): T[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map(map);
}

/**
 * Merges a stored overlay onto the defaults so a partial or hand-edited
 * content.json can never take the public site down.
 */
export function normalizeContent(stored: unknown): SiteContent {
  const raw = (typeof stored === "object" && stored !== null ? stored : {}) as Record<string, unknown>;
  const storedSite = (typeof raw.site === "object" && raw.site !== null ? raw.site : {}) as Record<string, unknown>;

  return {
    site: {
      name: str(storedSite.name, defaultSite.name),
      fullName: str(storedSite.fullName, defaultSite.fullName),
      city: str(storedSite.city, defaultSite.city),
      legalName: str(storedSite.legalName, defaultSite.legalName),
      inn: str(storedSite.inn, defaultSite.inn),
      ogrn: str(storedSite.ogrn, defaultSite.ogrn),
      posts: num(storedSite.posts, defaultSite.posts),
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

    notice: (() => {
      const storedNotice = (typeof raw.notice === "object" && raw.notice !== null
        ? raw.notice
        : {}) as Record<string, unknown>;

      const message = (key: "work" | "live") => {
        const stored = (typeof storedNotice[key] === "object" && storedNotice[key] !== null
          ? storedNotice[key]
          : {}) as Record<string, unknown>;

        return {
          title: str(stored.title, defaultNotice[key].title),
          text: str(stored.text, defaultNotice[key].text),
        };
      };

      return {
        enabled: bool(storedNotice.enabled, defaultNotice.enabled),
        tone: storedNotice.tone === "live" || storedNotice.tone === "work"
          ? storedNotice.tone
          : defaultNotice.tone,
        work: message("work"),
        live: message("live"),
      };
    })(),
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
    faq: list(
      raw.faq,
      (row) => ({ q: str(row.q, ""), a: str(row.a, "") }),
      defaultContent.faq
    ),
    testimonials: list(
      raw.testimonials,
      (row) => ({ name: str(row.name, ""), car: str(row.car, ""), text: str(row.text, "") }),
      defaultContent.testimonials
    ),
  };
}

/** Cached per request so a page can call it from several components. */
export const getContent = cache(async (): Promise<SiteContent> => {
  try {
    const raw = await fs.readFile(contentFile(), "utf8");
    return normalizeContent(JSON.parse(raw));
  } catch {
    return defaultContent;
  }
});

/** Atomic write — a crash mid-save must not leave a truncated content.json. */
export async function saveContent(next: SiteContent): Promise<void> {
  const dir = contentDir();
  await fs.mkdir(dir, { recursive: true });
  const target = contentFile();
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, target);
}
