import type { Metadata } from "next";
import { Block, BookingBand, Breadcrumbs, Faq, JsonLd, PageMarker, Prose, ServiceCard } from "@/components/seo/ui";
import { getSeoContent, type ServicePage } from "@/lib/seo/content";
import { breadcrumbs, faqPage, graph } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { getSiteUrl } from "@/lib/site-url";

export function generateMetadata(): Metadata {
  const content = getSeoContent();
  return pageMetadata(content, content.hubs.uslugi, "page", "/uslugi");
}

/** Services hub: every file of content/services as a card, grouped by category. */
export default function ServicesHub() {
  const content = getSeoContent();
  const page = content.hubs.uslugi;
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: page.h1, path: "/uslugi" },
  ];

  const groups = new Map<string, ServicePage[]>();
  for (const s of content.services) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);

  return (
    <>
      <PageMarker type="services" slug="uslugi" />
      <JsonLd json={graph(breadcrumbs(getSiteUrl(), crumbs), faqPage(page.faq))} />
      <Breadcrumbs items={crumbs} />
      <Block>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-offwhite sm:text-5xl">{page.h1}</h1>
        {page.intro && <Prose markdown={page.intro} className="mt-5" />}
      </Block>
      {[...groups].map(([category, services], i) => (
        <Block key={category} title={category} tone={i % 2 ? "panel" : "deep"}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} site={content.site} />
            ))}
          </div>
        </Block>
      ))}
      {page.faq.length > 0 && (
        <Block title="Частые вопросы" narrow>
          <Faq items={page.faq} />
        </Block>
      )}
      {page.seo_text && (
        <Block narrow>
          <Prose markdown={page.seo_text} />
        </Block>
      )}
      <Block tone="deep">
        <BookingBand site={content.site} />
      </Block>
    </>
  );
}
