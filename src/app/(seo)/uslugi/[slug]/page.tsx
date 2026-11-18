import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, Gauge, TriangleAlert } from "lucide-react";
import LazyEmbed, { videoEmbedUrl } from "@/components/seo/LazyEmbed";
import {
  ArticleCard,
  Block,
  Breadcrumbs,
  Faq,
  HowToGet,
  JsonLd,
  PageMarker,
  PhotoGrid,
  Prose,
  SeoHero,
  ServiceCard,
  photosByTag,
} from "@/components/seo/ui";
import { getSeoContent, type ServicePage } from "@/lib/seo/content";
import { autoRepair, breadcrumbs, faqPage, graph, serviceOffer } from "@/lib/seo/jsonld";
import { pageMetadata, photoById } from "@/lib/seo/meta";
import { COMPLEXITY_LABEL, STATION_LABEL, hoursLabel, rub, servicePrices } from "@/lib/seo/prices";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => getSeoContent().services.find((s) => s.slug === slug);

export function generateStaticParams() {
  return getSeoContent().services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = find((await params).slug);
  if (!service) return {};
  const content = getSeoContent();
  const { self } = servicePrices(service, content.site);
  return pageMetadata(content, service, "service", `/uslugi/${service.slug}`, { name: service.name, price_self: self });
}

const SERVICE_BLOCKS = [
  "price_compare",
  "what_to_bring",
  "conditions",
  "steps",
  "photos",
  "faq",
  "articles",
  "related",
  "seo_text",
  "how_to_get",
] as const;

export default async function ServiceRoute({ params }: Props) {
  const service = find((await params).slug);
  if (!service) notFound();
  return <Service service={service} />;
}

function Service({ service }: { service: ServicePage }) {
  const content = getSeoContent();
  const { site } = content;
  const base = getSiteUrl();
  const prices = servicePrices(service, site);
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: "Услуги", path: "/uslugi" },
    { name: service.name, path: `/uslugi/${service.slug}` },
  ];
  const equipment = service.equipment.map((id) => content.equipment.find((e) => e.id === id)!).filter(Boolean);
  const articles = content.articles.filter((a) => a.service === service.slug);
  const related = service.related.map((r) => content.services.find((s) => s.slug === r)!).filter(Boolean);
  const photos = photosByTag(content, service.photo_tag);

  const blocks: Record<(typeof SERVICE_BLOCKS)[number], React.ReactNode> = {
    price_compare: (
      <Block key="price_compare" title="Сколько стоит" tone="deep">
        <div className={`grid gap-4 ${service.market_price ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <div className="rounded-2xl border border-orange/40 bg-orange/[0.06] p-6">
            <p className="text-sm text-muted">Сами, {STATION_LABEL[service.station]}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-orange">от {rub(prices.self)}</p>
            <p className="mt-2 text-xs text-muted">
              {hoursLabel(service.hours_self)} × {rub(prices.rate)}/час
            </p>
          </div>
          {prices.master !== undefined && service.hours_master && (
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="text-sm text-muted">С мастером «Гаража»</p>
              <p className="mt-2 font-display text-3xl font-semibold text-offwhite">от {rub(prices.master)}</p>
              <p className="mt-2 text-xs text-muted">{hoursLabel(service.hours_master)}</p>
            </div>
          )}
          {service.market_price && (
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="text-sm text-muted">В автосервисе</p>
              <p className="mt-2 font-display text-3xl font-semibold text-muted line-through decoration-orange/60">{rub(service.market_price)}</p>
              {service.market_checked_at && <p className="mt-2 text-xs text-muted">Средняя цена по Омску на {service.market_checked_at}</p>}
            </div>
          )}
        </div>
      </Block>
    ),
    what_to_bring: (equipment.length > 0 || service.bring.length > 0) && (
      <Block key="what_to_bring" title="Что есть у нас и что взять с собой">
        <div className="grid gap-4 md:grid-cols-2">
          {equipment.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="font-display text-lg font-semibold text-offwhite">Есть в боксе</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {equipment.map((e) => (
                  <li key={e.id} className="flex gap-2">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${e.available ? "text-green" : "text-steel-light"}`} />
                    {e.name}
                    {!e.available && " — нет"}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {service.bring.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="font-display text-lg font-semibold text-offwhite">Взять с собой</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {service.bring.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Block>
    ),
    conditions: (
      <Block key="conditions" title="Сложность, время, ограничения" tone="deep">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-surface p-5">
            <Gauge className="h-5 w-5 text-orange" />
            <p className="mt-3 text-sm text-muted">Сложность</p>
            <p className="font-display text-xl font-semibold text-offwhite">
              {COMPLEXITY_LABEL[service.complexity]} ({service.complexity} из 3)
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-surface p-5">
            <Clock className="h-5 w-5 text-orange" />
            <p className="mt-3 text-sm text-muted">Время самому</p>
            <p className="font-display text-xl font-semibold text-offwhite">{hoursLabel(service.hours_self)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-surface p-5">
            <TriangleAlert className="h-5 w-5 text-orange" />
            <p className="mt-3 text-sm text-muted">Ограничения</p>
            {service.limitations.length ? (
              <ul className="mt-1 space-y-1 text-sm text-offwhite">
                {service.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            ) : (
              <p className="font-display text-xl font-semibold text-offwhite">Нет</p>
            )}
          </div>
        </div>
      </Block>
    ),
    steps: (service.steps.length > 0 || service.video) && (
      <Block key="steps" title="Как проходит работа">
        {service.steps.length > 0 && (
          <ol className="grid gap-4 md:grid-cols-2">
            {service.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-surface p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange font-display font-semibold text-graphite-deep">{i + 1}</span>
                <span>
                  <span className="block font-semibold text-offwhite">{step.title}</span>
                  {step.text && <span className="mt-1 block text-sm leading-relaxed text-muted">{step.text}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
        {service.video && (
          <div className="mt-6 max-w-3xl">
            <LazyEmbed src={videoEmbedUrl(service.video)} title={`${service.name} — видео`} />
          </div>
        )}
      </Block>
    ),
    photos: photos.length > 0 && (
      <Block key="photos" title="Фото" tone="deep">
        <PhotoGrid photos={photos} />
      </Block>
    ),
    faq: service.faq.length > 0 && (
      <Block key="faq" title="Частые вопросы" narrow>
        <Faq items={service.faq} />
      </Block>
    ),
    articles: articles.length > 0 && (
      <Block key="articles" title="Инструкции своими руками" tone="deep">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} content={content} />
          ))}
        </div>
      </Block>
    ),
    related: related.length > 0 && (
      <Block key="related" title="Похожие услуги">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s) => (
            <ServiceCard key={s.slug} service={s} site={site} />
          ))}
        </div>
      </Block>
    ),
    seo_text: service.seo_text && (
      <Block key="seo_text" narrow tone="deep">
        <Prose markdown={service.seo_text} />
      </Block>
    ),
    how_to_get: (
      <Block key="how_to_get" title="Как добраться">
        <HowToGet site={site} />
      </Block>
    ),
  };

  const order = (service.blocks?.length ? service.blocks : SERVICE_BLOCKS).filter((b): b is (typeof SERVICE_BLOCKS)[number] =>
    (SERVICE_BLOCKS as readonly string[]).includes(b)
  );

  return (
    <>
      <PageMarker type="service" slug={service.slug} />
      <JsonLd json={graph(breadcrumbs(base, crumbs), autoRepair(content, base), serviceOffer(content, base, service), faqPage(service.faq))} />
      <Breadcrumbs items={crumbs} />
      <SeoHero
        site={site}
        h1={service.h1}
        photo={photoById(content, service.hero_photo)}
        price={
          <div className="flex flex-wrap gap-3">
            <span className="rounded-xl border border-orange/40 bg-orange/10 px-4 py-2 text-sm text-offwhite">
              Сами от <b className="text-lg text-orange">{rub(prices.self)}</b>
            </span>
            {prices.master !== undefined && (
              <span className="rounded-xl border border-white/15 px-4 py-2 text-sm text-offwhite">
                С мастером от <b className="text-lg">{rub(prices.master)}</b>
              </span>
            )}
          </div>
        }
        meta={
          <p className="text-sm text-muted">
            <Link href="/uslugi" className="hover:text-offwhite">
              {service.category}
            </Link>{" "}
            · {hoursLabel(service.hours_self)} · {COMPLEXITY_LABEL[service.complexity].toLowerCase()}
          </p>
        }
      />
      {order.map((key) => blocks[key])}
    </>
  );
}
