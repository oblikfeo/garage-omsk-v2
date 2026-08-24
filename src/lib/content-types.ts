export type SiteInfo = {
  name: string;
  fullName: string;
  city: string;
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
