export type SiteInfo = {
  name: string;
  fullName: string;
  city: string;
  legalName: string;
  inn: string;
  ogrn: string;
  posts: number;
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

export type SiteContent = {
  site: SiteInfo;
  notice: SiteNotice;
  services: Service[];
  gallery: GalleryItem[];
  addonServices: string[];
  priceList: PriceRow[];
  steps: TitleText[];
  safetyRules: TitleText[];
  faq: FaqItem[];
  testimonials: Testimonial[];
};

/** Section keys the admin panel can edit, in the order they appear on the site. */
export const CONTENT_SECTIONS = [
  "site",
  "services",
  "priceList",
  "gallery",
  "steps",
  "safetyRules",
  "testimonials",
  "faq",
  "addonServices",
] as const;
