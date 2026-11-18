export type SiteInfo = {
  name: string;
  fullName: string;
  city: string;
  legalName: string;
  inn: string;
  ogrn: string;
  posts: number;
  lifts: number;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  hours: string;
  hoursSchema: string;
  telegram: string;
  max: string;
  mapsUrl: string;
  mapsRouteUrl: string;
  yclientsUrl: string;
};

/** One of the two messages the corner banner can show. */
export type NoticeMessage = { title: string; text: string };

/** Live-chat style banner in the corner of the site. */
export type SiteNotice = {
  enabled: boolean;
  /** work = оранжевая "идут работы", live = зелёная "всё работает" */
  tone: "work" | "live";
  /** Each tone keeps its own wording, so flipping the switch flips the text. */
  work: NoticeMessage;
  live: NoticeMessage;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export type PriceRow = {
  id?: string;
  service: string;
  hour: number;
  day: number;
};

export type TitleText = { title: string; text: string };
export type FaqItem = { q: string; a: string };
export type Testimonial = { name: string; car: string; text: string };

/** Eyebrow + heading + lead paragraph above a section. */
export type SectionHeadingContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type HeroStat = { label: string; sub: string };

export type HeroContent = {
  /** The headline is split so the middle part can be highlighted. */
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  text: string;
  /** Main photo on the first screen: a path under /public, e.g. /uploads/... */
  image: string;
  /** Alt text of the main photo (read by search engines and screen readers). */
  imageAlt: string;
  imageCaption: string;
  galleryLink: string;
  stats: HeroStat[];
};

/** One of the three keyword landing pages. */
export type SeoPageContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  bullets: string[];
  faqTitle: string;
  faq: FaqItem[];
};

export type SectionKey =
  | "services"
  | "prices"
  | "gallery"
  | "how"
  | "safety"
  | "testimonials"
  | "booking"
  | "faq"
  | "contacts";

export type SeoPageKey = "sto" | "garazh" | "podyomnik";

/** Loose labels that do not belong to any section heading. */
export type LooseTexts = {
  addonsTitle: string;
  priceNote: string;
  priceCta: string;
  planTitle: string;
  planText: string;
  planViewerCaption: string;
  bookingFallback: string;
};

export type SiteContent = {
  site: SiteInfo;
  notice: SiteNotice;
  hero: HeroContent;
  sections: Record<SectionKey, SectionHeadingContent>;
  pages: Record<SeoPageKey, SeoPageContent>;
  texts: LooseTexts;
  services: Service[];
  gallery: GalleryItem[];
  addonServices: string[];
  priceList: PriceRow[];
  steps: TitleText[];
  safetyRules: TitleText[];
  faq: FaqItem[];
  testimonials: Testimonial[];
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  services: "Услуги",
  prices: "Прайс-лист",
  gallery: "Галерея",
  how: "Как это работает",
  safety: "Безопасность",
  testimonials: "Отзывы",
  booking: "Онлайн-запись",
  faq: "FAQ",
  contacts: "Контакты",
};

export const SEO_PAGE_LABELS: Record<SeoPageKey, string> = {
  sto: "СТО самообслуживания",
  garazh: "Гараж на час",
  podyomnik: "Аренда подъёмника",
};

export const SEO_PAGE_PATHS: Record<SeoPageKey, string> = {
  sto: "/sto-samoobsluzhivaniya-omsk",
  garazh: "/garazh-na-chas-omsk",
  podyomnik: "/arenda-podyomnika-omsk",
};

/**
 * Placeholders usable inside any editable text. They are replaced when the
 * public site renders, so a number like the post count lives in exactly one
 * place and cannot drift out of sync again.
 */
export const TEXT_TOKENS = [
  "posts",
  "lifts",
  "hours",
  "hoursTime",
  "hoursDays",
  "address",
  "city",
  "phone",
  "email",
  "name",
  "fullName",
] as const;
