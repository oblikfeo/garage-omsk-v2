import type { ArticlePage, Content, Faq, ServicePage } from "./content";
import { servicePrices } from "./prices";
import { photoById } from "./meta";

type Json = Record<string, unknown>;

export const abs = (base: string, path: string) => new URL(path, base).toString();

export function autoRepair(content: Content, base: string): Json {
  const { site } = content;
  return {
    "@type": "AutoRepair",
    "@id": abs(base, "/#business"),
    name: site.name,
    url: abs(base, "/"),
    image: abs(base, photoById(content, site.default_og_image)?.src ?? "/logo.svg"),
    telephone: site.phone_href,
    email: site.email,
    priceRange: "₽₽",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.replace(/^г\.\s*[^,]+,\s*/, ""),
      addressLocality: site.city,
      addressCountry: "RU",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: site.opening_hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [site.maps.yandex, site.maps.twogis, site.telegram, site.max].filter(Boolean),
  };
}

export function breadcrumbs(base: string, items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(base, item.path),
    })),
  };
}

export function faqPage(faq: Faq[]): Json | null {
  if (!faq.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceLd(
  content: Content,
  base: string,
  path: string,
  name: string,
  description: string,
  price: number
): Json {
  return {
    "@type": "Service",
    name,
    description,
    url: abs(base, path),
    areaServed: content.site.city,
    provider: { "@id": abs(base, "/#business") },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "RUB",
      url: abs(base, path),
      availability: "https://schema.org/InStock",
    },
  };
}

export function serviceOffer(content: Content, base: string, service: ServicePage): Json {
  const { self } = servicePrices(service, content.site);
  return serviceLd(content, base, `/uslugi/${service.slug}`, service.name, service.description || service.h1, self);
}

export function offerCatalog(content: Content, base: string): Json {
  const items: Json[] = [];
  for (const row of content.site.price_list) {
    if (row.hour) items.push({ "@type": "Offer", name: `${row.name} — час`, price: row.hour, priceCurrency: "RUB" });
    if (row.day) items.push({ "@type": "Offer", name: `${row.name} — сутки`, price: row.day, priceCurrency: "RUB" });
  }
  for (const s of content.services) {
    items.push({
      "@type": "Offer",
      name: s.name,
      price: servicePrices(s, content.site).self,
      priceCurrency: "RUB",
      url: abs(base, `/uslugi/${s.slug}`),
    });
  }
  return { "@type": "OfferCatalog", name: "Цены", url: abs(base, "/ceny"), itemListElement: items };
}

export function articleLd(content: Content, base: string, article: ArticlePage): Json {
  const author = content.authors.find((a) => a.id === article.author);
  const image = photoById(content, article.cover) ?? photoById(content, content.site.default_og_image);
  return {
    "@type": "Article",
    headline: article.h1,
    description: article.description || undefined,
    url: abs(base, `/svoimi-rukami/${article.slug}`),
    datePublished: article.published_at,
    dateModified: article.updated_at ?? article.published_at,
    image: image ? abs(base, image.src) : undefined,
    author: author ? { "@type": "Person", name: author.name, jobTitle: author.position } : { "@type": "Organization", name: content.site.name },
    publisher: { "@id": abs(base, "/#business") },
  };
}

/** One <script type="application/ld+json"> with a @graph. */
export function graph(...nodes: (Json | null | undefined)[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes.filter(Boolean) }).replace(/</g, "\\u003c");
}
