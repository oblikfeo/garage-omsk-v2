/**
 * Content layer of the SEO templates: reads content/**\/*.md (frontmatter +
 * Markdown body) and the shared JSON files, validates everything and throws a
 * readable error, which fails `next build`. One file = one page.
 *
 * No "@/" imports here: next.config.ts loads this module too.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { landings } from "../landings";

export const CONTENT_DIR = path.join(process.cwd(), "content");

/* ------------------------------------------------------------------ */
/* types                                                              */
/* ------------------------------------------------------------------ */

export type Faq = { q: string; a: string };
export type Step = { title: string; text: string; photo?: string };
export type Station = "post" | "lift" | "machine";

export type Common = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  index: boolean;
  canonical?: string;
  og_image?: string;
  updated_at?: string;
  faq: Faq[];
  /** Markdown body of the file. */
  seo_text: string;
  /** Path relative to content/, for error messages. */
  file: string;
  /** Every frontmatter field as written, for custom fields used by custom templates. */
  data: Record<string, unknown>;
};

export type GeoPage = Common & {
  type: "geo";
  subtitle?: string;
  hero_photo?: string;
  benefits: { icon?: string; title: string; text: string }[];
  comparison?: {
    left: { title: string; price?: string; text?: string };
    right: { title: string; price?: string; text?: string };
  };
  equipment: string[];
  services: string[];
  photo_tag?: string;
  blocks?: string[];
  banner?: { title: string; text?: string; button?: string };
};

export type ServicePage = Common & {
  type: "service";
  name: string;
  category: string;
  hero_photo?: string;
  hours_self: [number, number];
  hours_master?: [number, number];
  station: Station;
  complexity: 1 | 2 | 3;
  market_price?: number;
  market_checked_at?: string;
  equipment: string[];
  bring: string[];
  limitations: string[];
  steps: Step[];
  video?: string;
  related: string[];
  photo_tag?: string;
  blocks?: string[];
};

export type ArticlePage = Common & {
  type: "article";
  author?: string;
  published_at?: string;
  service?: string;
  complexity?: 1 | 2 | 3;
  time?: string;
  tools: string[];
  video?: string;
  steps: Step[];
  related: string[];
  cover?: string;
};

export type TextPage = Common & { type: "text"; intro?: string };

export type HubKey = "uslugi" | "ceny" | "kontakty" | "svoimi-rukami";
export type HubPage = Common & { type: "hub"; key: HubKey; intro?: string };

export type Photo = { id: string; src: string; alt: string; caption?: string; tags: string[] };
export type Author = { id: string; name: string; photo?: string; position?: string };
export type Equipment = { id: string; name: string; description?: string; photo?: string; available: boolean };
export type Redirect = { from: string; to: string };

export type SiteData = {
  name: string;
  city: string;
  address: string;
  address_note?: string;
  geo: { lat: number; lng: number };
  phone: string;
  phone_href: string;
  email?: string;
  hours: string;
  opening_hours: { days: string[]; opens: string; closes: string }[];
  telegram?: string;
  max?: string;
  maps: { yandex: string; yandex_route: string; twogis: string; twogis_route: string };
  legal: { name: string; inn: string; ogrn: string };
  rates: Record<Station | "master" | "day", number>;
  master_mode: "on_top" | "instead";
  price_list: { name: string; hour: number | null; day: number | null }[];
  price_updated_at?: string;
  booking_url: string;
  reviews?: { provider: "2gis"; org_id: string; branch_id: string };
  default_og_image: string;
  footer_links: { href: string; label: string }[];
  templates: Record<"geo" | "service" | "article" | "text" | "page", { title: string; description: string }>;
};

export type Content = {
  site: SiteData;
  photos: Photo[];
  authors: Author[];
  equipment: Equipment[];
  redirects: Redirect[];
  geo: GeoPage[];
  text: TextPage[];
  services: ServicePage[];
  articles: ArticlePage[];
  hubs: Record<HubKey, HubPage>;
  warnings: string[];
};

/* ------------------------------------------------------------------ */
/* rules                                                              */
/* ------------------------------------------------------------------ */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HUB_KEYS: HubKey[] = ["uslugi", "ceny", "kontakty", "svoimi-rukami"];

/** Root-level paths that geo and text pages may not take. */
export const RESERVED_ROOT_SLUGS = new Set<string>([
  ...Object.keys(landings),
  ...HUB_KEYS,
  "admin",
  "politika-konfidentsialnosti",
  "api",
  "uploads",
  "gallery",
  "plan",
]);

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

class Problems {
  errors: string[] = [];
  warnings: string[] = [];
  error(file: string, message: string) {
    this.errors.push(`content/${file}: ${message}`);
  }
  warn(file: string, message: string) {
    this.warnings.push(`content/${file}: ${message}`);
  }
}

const asStr = (v: unknown): string | undefined =>
  typeof v === "string" ? v.trim() : v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === "number" ? String(v) : undefined;
const asNum = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const asList = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const asStrList = (v: unknown): string[] => asList(v).map(asStr).filter((s): s is string => !!s);
const asDate = (v: unknown): string | undefined => {
  const s = asStr(v);
  return s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : undefined;
};
const asRange = (v: unknown): [number, number] | undefined => {
  const list = asList(v).map(asNum);
  return list.length === 2 && list[0] !== undefined && list[1] !== undefined ? [list[0], list[1]] : undefined;
};
const asFaq = (v: unknown): Faq[] =>
  asList<Record<string, unknown>>(v)
    .map((row) => ({ q: asStr(row?.q) ?? "", a: asStr(row?.a) ?? "" }))
    .filter((row) => row.q && row.a);
const asSteps = (v: unknown): Step[] =>
  asList<Record<string, unknown>>(v)
    .map((row) => ({ title: asStr(row?.title) ?? "", text: asStr(row?.text) ?? "", photo: asStr(row?.photo) }))
    .filter((row) => row.title);

function readJson<T>(name: string): T {
  const file = path.join(CONTENT_DIR, name);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch (error) {
    throw new Error(`content/${name}: не удалось прочитать JSON — ${(error as Error).message}`);
  }
}

function readMarkdownDir(dir: string): { file: string; data: Record<string, unknown>; body: string }[] {
  const abs = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .sort()
    .map((name) => {
      const parsed = matter(fs.readFileSync(path.join(abs, name), "utf8"));
      return { file: `${dir}/${name}`, data: parsed.data, body: parsed.content.trim() };
    });
}

function common(problems: Problems, file: string, data: Record<string, unknown>, body: string): Common {
  const slug = asStr(data.slug) ?? "";
  const h1 = asStr(data.h1) ?? "";
  if (!slug) problems.error(file, "нет slug");
  else if (!SLUG_RE.test(slug)) problems.error(file, `slug "${slug}" — только латиница в нижнем регистре, цифры и дефисы`);
  if (!h1) problems.error(file, "нет h1");

  const title = asStr(data.title) ?? "";
  const description = asStr(data.description) ?? "";
  if (!title) problems.warn(file, "пустой title — будет автошаблон из site.json");
  if (!description) problems.warn(file, "пустой description — будет автошаблон из site.json");

  return {
    slug,
    h1,
    title,
    description,
    index: data.index !== false,
    canonical: asStr(data.canonical),
    og_image: asStr(data.og_image),
    updated_at: asDate(data.updated_at),
    faq: asFaq(data.faq),
    seo_text: body,
    file,
    data,
  };
}

/* ------------------------------------------------------------------ */
/* loading                                                            */
/* ------------------------------------------------------------------ */

function load(): Content {
  const problems = new Problems();

  const site = readJson<SiteData>("site.json");
  const photos = readJson<Photo[]>("photos.json");
  const authors = readJson<Author[]>("authors.json");
  const equipment = readJson<Equipment[]>("equipment.json");
  const redirects = readJson<Redirect[]>("redirects.json");

  const geo: GeoPage[] = readMarkdownDir("geo").map(({ file, data, body }) => ({
    ...common(problems, file, data, body),
    type: "geo",
    subtitle: asStr(data.subtitle),
    hero_photo: asStr(data.hero_photo),
    benefits: asList<Record<string, unknown>>(data.benefits)
      .map((b) => ({ icon: asStr(b?.icon), title: asStr(b?.title) ?? "", text: asStr(b?.text) ?? "" }))
      .filter((b) => b.title),
    comparison: (() => {
      const c = data.comparison as Record<string, Record<string, unknown>> | undefined;
      if (!c?.left || !c?.right) return undefined;
      const side = (s: Record<string, unknown>) => ({ title: asStr(s.title) ?? "", price: asStr(s.price), text: asStr(s.text) });
      return { left: side(c.left), right: side(c.right) };
    })(),
    equipment: asStrList(data.equipment),
    services: asStrList(data.services),
    photo_tag: asStr(data.photo_tag),
    blocks: data.blocks ? asStrList(data.blocks) : undefined,
    banner: (() => {
      const b = data.banner as Record<string, unknown> | undefined;
      const title = asStr(b?.title);
      return title ? { title, text: asStr(b?.text), button: asStr(b?.button) } : undefined;
    })(),
  }));

  const text: TextPage[] = readMarkdownDir("text").map(({ file, data, body }) => ({
    ...common(problems, file, data, body),
    type: "text",
    intro: asStr(data.intro),
  }));

  const services: ServicePage[] = readMarkdownDir("services").map(({ file, data, body }) => {
    const base = common(problems, file, data, body);
    const station = asStr(data.station) as Station | undefined;
    const hoursSelf = asRange(data.hours_self);
    const complexity = asNum(data.complexity);
    if (!asStr(data.name)) problems.error(file, "нет name");
    if (!station || !["post", "lift", "machine"].includes(station)) problems.error(file, "station должен быть post, lift или machine");
    if (!hoursSelf) problems.error(file, "hours_self должен быть [min, max]");
    if (complexity !== undefined && ![1, 2, 3].includes(complexity)) problems.error(file, "complexity должен быть 1, 2 или 3");
    return {
      ...base,
      type: "service",
      name: asStr(data.name) ?? base.h1,
      category: asStr(data.category) ?? "Другое",
      hero_photo: asStr(data.hero_photo),
      hours_self: hoursSelf ?? [1, 1],
      hours_master: asRange(data.hours_master),
      station: station ?? "lift",
      complexity: ((complexity ?? 1) as 1 | 2 | 3),
      market_price: asNum(data.market_price),
      market_checked_at: asDate(data.market_checked_at),
      equipment: asStrList(data.equipment),
      bring: asStrList(data.bring),
      limitations: asStrList(data.limitations),
      steps: asSteps(data.steps),
      video: asStr(data.video),
      related: asStrList(data.related),
      photo_tag: asStr(data.photo_tag),
      blocks: data.blocks ? asStrList(data.blocks) : undefined,
    };
  });

  const articles: ArticlePage[] = readMarkdownDir("articles").map(({ file, data, body }) => {
    const complexity = asNum(data.complexity);
    if (complexity !== undefined && ![1, 2, 3].includes(complexity)) problems.error(file, "complexity должен быть 1, 2 или 3");
    return {
      ...common(problems, file, data, body),
      type: "article",
      author: asStr(data.author),
      published_at: asDate(data.published_at),
      service: asStr(data.service),
      complexity: complexity as 1 | 2 | 3 | undefined,
      time: asStr(data.time),
      tools: asStrList(data.tools),
      video: asStr(data.video),
      steps: asSteps(data.steps),
      related: asStrList(data.related),
      cover: asStr(data.cover),
    };
  });

  const hubs = Object.fromEntries(
    HUB_KEYS.map((key) => {
      const file = `pages/${key}.md`;
      const abs = path.join(CONTENT_DIR, file);
      if (!fs.existsSync(abs)) {
        problems.error(file, "нет файла страницы-хаба");
        return [key, { slug: key, h1: key, title: "", description: "", index: false, faq: [], seo_text: "", file, data: {}, type: "hub", key } as HubPage];
      }
      const parsed = matter(fs.readFileSync(abs, "utf8"));
      const base = common(problems, file, parsed.data, parsed.content.trim());
      if (base.slug && base.slug !== key) problems.error(file, `slug должен быть "${key}"`);
      return [key, { ...base, slug: key, type: "hub", key, intro: asStr(parsed.data.intro) } as HubPage];
    })
  ) as Record<HubKey, HubPage>;

  /* ---------------- cross-checks ---------------- */

  const photoIds = new Set(photos.map((p) => p.id));
  const equipmentIds = new Set(equipment.map((e) => e.id));
  const authorIds = new Set(authors.map((a) => a.id));
  const serviceSlugs = new Set(services.map((s) => s.slug));
  const articleSlugs = new Set(articles.map((a) => a.slug));

  const checkPhoto = (file: string, field: string, id?: string) => {
    if (id && !photoIds.has(id)) problems.error(file, `${field}: фото "${id}" нет в photos.json`);
  };
  const checkUnique = (pages: Common[], scope: string) => {
    const seen = new Map<string, string>();
    for (const page of pages) {
      if (!page.slug) continue;
      const other = seen.get(page.slug);
      if (other) problems.error(page.file, `slug "${page.slug}" уже занят файлом content/${other} (${scope})`);
      else seen.set(page.slug, page.file);
    }
  };

  // geo and text pages share the site root
  checkUnique([...geo, ...text], "адреса /{slug}");
  for (const page of [...geo, ...text]) {
    if (RESERVED_ROOT_SLUGS.has(page.slug)) problems.error(page.file, `slug "${page.slug}" занят (посадочная Директа, раздел сайта или служебный адрес)`);
  }
  checkUnique(services, "/uslugi/{slug}");
  checkUnique(articles, "/svoimi-rukami/{slug}");
  for (const a of articles) if (a.slug === "page") problems.error(a.file, 'slug "page" занят пагинацией /svoimi-rukami/page/{n}');

  for (const g of geo) {
    checkPhoto(g.file, "hero_photo", g.hero_photo);
    checkPhoto(g.file, "og_image", g.og_image);
    for (const id of g.equipment) if (!equipmentIds.has(id)) problems.error(g.file, `equipment: "${id}" нет в equipment.json`);
    for (const s of g.services) if (!serviceSlugs.has(s)) problems.error(g.file, `services: услуги "${s}" нет в content/services/`);
  }
  for (const s of services) {
    checkPhoto(s.file, "hero_photo", s.hero_photo);
    checkPhoto(s.file, "og_image", s.og_image);
    for (const id of s.equipment) if (!equipmentIds.has(id)) problems.error(s.file, `equipment: "${id}" нет в equipment.json`);
    for (const r of s.related) if (!serviceSlugs.has(r)) problems.error(s.file, `related: услуги "${r}" нет в content/services/`);
  }
  for (const a of articles) {
    checkPhoto(a.file, "cover", a.cover);
    checkPhoto(a.file, "og_image", a.og_image);
    for (const step of a.steps) checkPhoto(a.file, `steps "${step.title}" photo`, step.photo);
    if (a.author && !authorIds.has(a.author)) problems.error(a.file, `author: "${a.author}" нет в authors.json`);
    if (a.service && !serviceSlugs.has(a.service)) problems.error(a.file, `service: услуги "${a.service}" нет в content/services/`);
    for (const r of a.related) if (!articleSlugs.has(r)) problems.error(a.file, `related: статьи "${r}" нет в content/articles/`);
  }
  for (const t of text) checkPhoto(t.file, "og_image", t.og_image);
  checkPhoto("site.json", "default_og_image", site.default_og_image);

  for (const r of redirects) {
    if (!r.from?.startsWith("/") || !r.to?.startsWith("/")) problems.error("redirects.json", `правило ${JSON.stringify(r)}: from и to должны начинаться с /`);
  }

  if (problems.errors.length) {
    throw new Error(
      `\n\nОшибки в контенте SEO-страниц (${problems.errors.length}):\n  - ${problems.errors.join("\n  - ")}\n\nОписание полей: content/README.md\n`
    );
  }

  return { site, photos, authors, equipment, redirects, geo, text, services, articles, hubs, warnings: problems.warnings };
}

let cached: Content | null = null;

/** All SEO content, validated. Throws (and fails the build) on any error. */
export function getSeoContent(): Content {
  if (!cached) {
    cached = load();
    for (const warning of cached.warnings) console.warn(`[content] ${warning}`);
  }
  return cached;
}

/* ------------------------------------------------------------------ */
/* routes, used by sitemap, robots, proxy                              */
/* ------------------------------------------------------------------ */

export type ContentRoute = { path: string; index: boolean; updated_at?: string };

export const ARTICLES_PER_PAGE = 12;

export function contentRoutes(content = getSeoContent()): ContentRoute[] {
  const routes: ContentRoute[] = [];
  const push = (p: string, page: Common) => routes.push({ path: p, index: page.index, updated_at: page.updated_at });

  for (const g of content.geo) push(`/${g.slug}`, g);
  for (const t of content.text) push(`/${t.slug}`, t);
  push("/uslugi", content.hubs.uslugi);
  for (const s of content.services) push(`/uslugi/${s.slug}`, s);
  push("/ceny", content.hubs.ceny);
  push("/kontakty", content.hubs.kontakty);
  push("/svoimi-rukami", content.hubs["svoimi-rukami"]);
  const pages = Math.max(1, Math.ceil(content.articles.length / ARTICLES_PER_PAGE));
  for (let n = 2; n <= pages; n++) routes.push({ path: `/svoimi-rukami/page/${n}`, index: content.hubs["svoimi-rukami"].index, updated_at: content.hubs["svoimi-rukami"].updated_at });
  for (const a of content.articles) push(`/svoimi-rukami/${a.slug}`, a);
  return routes;
}
