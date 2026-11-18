import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TwoGisReviews } from "@/components/TwoGisRating";
import {
  Benefits,
  Block,
  BookingBand,
  Breadcrumbs,
  EquipmentGrid,
  Faq,
  HowToGet,
  JsonLd,
  PageMarker,
  PhotoGrid,
  PriceTable,
  Prose,
  SeoHero,
  ServiceCard,
  photosByTag,
} from "@/components/seo/ui";
import { getSeoContent, type GeoPage, type TextPage } from "@/lib/seo/content";
import { autoRepair, breadcrumbs, faqPage, graph, serviceLd } from "@/lib/seo/jsonld";
import { pageMetadata, photoById } from "@/lib/seo/meta";
import { rub } from "@/lib/seo/prices";
import { getSiteUrl } from "@/lib/site-url";

/**
 * /{slug}: geo pages (content/geo) and text pages (content/text).
 * Unknown slugs render the 404 page (dynamicParams stays true so that random
 * bot URLs give a clean 404 instead of an internal "no fallback" error).
 */
type Props = { params: Promise<{ slug: string }> };

function findPage(slug: string): GeoPage | TextPage | undefined {
  const content = getSeoContent();
  return content.geo.find((p) => p.slug === slug) ?? content.text.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  const content = getSeoContent();
  return [...content.geo, ...content.text].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPage((await params).slug);
  if (!page) return {};
  return pageMetadata(getSeoContent(), page, page.type, `/${page.slug}`);
}

export default async function SlugPage({ params }: Props) {
  const page = findPage((await params).slug);
  if (!page) notFound();
  return page.type === "geo" ? <Geo page={page} /> : <Text page={page} />;
}

/* ------------------------------------------------------------------ */

const GEO_BLOCKS = [
  "benefits",
  "comparison",
  "equipment",
  "prices",
  "services",
  "banner",
  "photos",
  "reviews",
  "faq",
  "seo_text",
  "how_to_get",
] as const;

function Geo({ page }: { page: GeoPage }) {
  const content = getSeoContent();
  const { site } = content;
  const base = getSiteUrl();
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: page.h1, path: `/${page.slug}` },
  ];
  const services = page.services.map((s) => content.services.find((x) => x.slug === s)!).filter(Boolean);
  const equipment = page.equipment.map((id) => content.equipment.find((e) => e.id === id)!).filter(Boolean);

  const blocks: Record<(typeof GEO_BLOCKS)[number], React.ReactNode> = {
    benefits: page.benefits.length > 0 && (
      <Block key="benefits" title="Почему у нас удобно">
        <Benefits items={page.benefits} />
      </Block>
    ),
    comparison: page.comparison && (
      <Block key="comparison" title="Сравните" tone="deep">
        <div className="grid gap-4 md:grid-cols-2">
          {[page.comparison.left, page.comparison.right].map((side, i) => (
            <div key={side.title} className={`rounded-2xl border p-6 ${i === 0 ? "border-orange/40 bg-orange/[0.06]" : "border-white/10 bg-surface"}`}>
              <p className="font-display text-xl font-semibold text-offwhite">{side.title}</p>
              {side.price && <p className={`mt-2 text-2xl font-semibold ${i === 0 ? "text-orange" : "text-muted"}`}>{side.price}</p>}
              {side.text && <p className="mt-3 text-sm leading-relaxed text-muted">{side.text}</p>}
            </div>
          ))}
        </div>
      </Block>
    ),
    equipment: equipment.length > 0 && (
      <Block key="equipment" title="Оборудование">
        <EquipmentGrid items={equipment} content={content} />
      </Block>
    ),
    prices: (
      <Block key="prices" title="Цены на аренду" tone="deep">
        <PriceTable site={site} />
      </Block>
    ),
    services: services.length > 0 && (
      <Block key="services" title="Что можно сделать самому">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} site={site} />
          ))}
        </div>
      </Block>
    ),
    banner: page.banner && (
      <Block key="banner">
        <BookingBand site={site} title={page.banner.title} text={page.banner.text} />
      </Block>
    ),
    photos: photosByTag(content, page.photo_tag).length > 0 && (
      <Block key="photos" title="Фото бокса" tone="deep">
        <PhotoGrid photos={photosByTag(content, page.photo_tag)} />
      </Block>
    ),
    reviews: site.reviews && (
      <Block key="reviews" title="Отзывы в 2ГИС">
        <div className="relative h-[620px] max-w-[560px] rounded-2xl border border-white/10 bg-surface p-4">
          <TwoGisReviews className="h-full" />
        </div>
      </Block>
    ),
    faq: page.faq.length > 0 && (
      <Block key="faq" title="Частые вопросы" tone="deep" narrow>
        <Faq items={page.faq} />
      </Block>
    ),
    seo_text: page.seo_text && (
      <Block key="seo_text" narrow>
        <Prose markdown={page.seo_text} />
      </Block>
    ),
    how_to_get: (
      <Block key="how_to_get" title="Как добраться" tone="deep">
        <HowToGet site={site} />
      </Block>
    ),
  };

  const order = (page.blocks?.length ? page.blocks : GEO_BLOCKS).filter((b): b is (typeof GEO_BLOCKS)[number] =>
    (GEO_BLOCKS as readonly string[]).includes(b)
  );

  return (
    <>
      <PageMarker type="geo" slug={page.slug} />
      <JsonLd
        json={graph(
          breadcrumbs(base, crumbs),
          autoRepair(content, base),
          serviceLd(content, base, `/${page.slug}`, page.h1, page.description || page.subtitle || page.h1, site.rates.post),
          faqPage(page.faq)
        )}
      />
      <Breadcrumbs items={crumbs} />
      <SeoHero
        site={site}
        h1={page.h1}
        subtitle={page.subtitle}
        photo={photoById(content, page.hero_photo)}
        price={
          <p className="text-sm text-muted">
            Пост от <b className="text-xl text-orange">{rub(site.rates.post)}/час</b> · подъёмник от{" "}
            <b className="text-xl text-orange">{rub(site.rates.lift)}/час</b>
          </p>
        }
      />
      {order.map((key) => blocks[key])}
    </>
  );
}

function Text({ page }: { page: TextPage }) {
  const content = getSeoContent();
  const { site } = content;
  const base = getSiteUrl();
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: page.h1, path: `/${page.slug}` },
  ];

  return (
    <>
      <PageMarker type="text" slug={page.slug} />
      <JsonLd json={graph(breadcrumbs(base, crumbs), faqPage(page.faq))} />
      <Breadcrumbs items={crumbs} />
      <Block narrow>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-offwhite sm:text-5xl">{page.h1}</h1>
        {page.intro && <Prose markdown={page.intro} className="mt-5 text-lg" />}
        <Prose markdown={page.seo_text} className="mt-8" />
      </Block>
      {page.faq.length > 0 && (
        <Block title="Частые вопросы" tone="deep" narrow>
          <Faq items={page.faq} />
        </Block>
      )}
      <Block>
        <BookingBand site={site} />
      </Block>
      <Block title="Как добраться" tone="deep">
        <HowToGet site={site} />
      </Block>
    </>
  );
}
