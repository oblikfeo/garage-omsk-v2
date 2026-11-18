import type { Metadata } from "next";
import Link from "next/link";
import { Block, Breadcrumbs, Faq, JsonLd, PageMarker, PriceTable, Prose } from "@/components/seo/ui";
import { getSeoContent } from "@/lib/seo/content";
import { breadcrumbs, faqPage, graph, offerCatalog } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { COMPLEXITY_LABEL, hoursLabel, rub, servicePrices } from "@/lib/seo/prices";
import { getSiteUrl } from "@/lib/site-url";

export function generateMetadata(): Metadata {
  const content = getSeoContent();
  return pageMetadata(content, content.hubs.ceny, "page", "/ceny");
}

const dateRu = (iso?: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "";

/** Prices: rental price list and every service with its computed price. */
export default function PricesPage() {
  const content = getSeoContent();
  const { site } = content;
  const page = content.hubs.ceny;
  const base = getSiteUrl();
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: page.h1, path: "/ceny" },
  ];

  return (
    <>
      <PageMarker type="prices" slug="ceny" />
      <JsonLd json={graph(breadcrumbs(base, crumbs), offerCatalog(content, base), faqPage(page.faq))} />
      <Breadcrumbs items={crumbs} />
      <Block>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-offwhite sm:text-5xl">{page.h1}</h1>
        {site.price_updated_at && <p className="mt-3 text-sm text-muted">Прайс обновлён {dateRu(site.price_updated_at)}</p>}
      </Block>
      <Block title="Аренда поста и оборудования" tone="deep">
        <PriceTable site={site} />
      </Block>
      {content.services.length > 0 && (
        <Block title="Сколько стоит сделать самому">
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-steel-light">
                <tr>
                  <th className="px-5 py-3 font-semibold">Работа</th>
                  <th className="px-5 py-3 font-semibold">Время</th>
                  <th className="px-5 py-3 font-semibold">Сложность</th>
                  <th className="px-5 py-3 text-right font-semibold">Сами от</th>
                  <th className="px-5 py-3 text-right font-semibold">С мастером от</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {content.services.map((s) => {
                  const p = servicePrices(s, site);
                  return (
                    <tr key={s.slug}>
                      <td className="px-5 py-3">
                        <Link href={`/uslugi/${s.slug}`} className="text-offwhite hover:text-orange">
                          {s.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-muted">{hoursLabel(s.hours_self)}</td>
                      <td className="px-5 py-3 text-muted">{COMPLEXITY_LABEL[s.complexity]}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-orange">{rub(p.self)}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right text-muted">{p.master !== undefined ? rub(p.master) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Block>
      )}
      {page.intro && (
        <Block narrow tone="deep">
          <Prose markdown={page.intro} />
        </Block>
      )}
      {page.faq.length > 0 && (
        <Block title="Частые вопросы" narrow>
          <Faq items={page.faq} />
        </Block>
      )}
      {page.seo_text && (
        <Block narrow tone="deep">
          <Prose markdown={page.seo_text} />
        </Block>
      )}
    </>
  );
}
