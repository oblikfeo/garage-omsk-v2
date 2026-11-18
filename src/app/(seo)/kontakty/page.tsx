import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Navigation, Phone, Send } from "lucide-react";
import LazyEmbed from "@/components/seo/LazyEmbed";
import { Block, Breadcrumbs, Faq, JsonLd, PageMarker, PhotoGrid, Prose, photosByTag } from "@/components/seo/ui";
import { getSeoContent } from "@/lib/seo/content";
import { autoRepair, breadcrumbs, faqPage, graph } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/meta";
import { getSiteUrl } from "@/lib/site-url";

export function generateMetadata(): Metadata {
  const content = getSeoContent();
  return pageMetadata(content, content.hubs.kontakty, "page", "/kontakty");
}

/** Contacts: plain-text contacts, map on click, routes, entrance photos, legal details. */
export default function ContactsPage() {
  const content = getSeoContent();
  const { site } = content;
  const page = content.hubs.kontakty;
  const base = getSiteUrl();
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: page.h1, path: "/kontakty" },
  ];
  const { lat, lng } = site.geo;
  const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2orl`;

  return (
    <>
      <PageMarker type="contacts" slug="kontakty" />
      <JsonLd json={graph(breadcrumbs(base, crumbs), autoRepair(content, base), faqPage(page.faq))} />
      <Breadcrumbs items={crumbs} />
      <Block>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-offwhite sm:text-5xl">{page.h1}</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <address className="space-y-4 not-italic text-muted">
            <p className="flex items-start gap-3 text-lg text-offwhite">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-orange" />
              {site.address}
              {site.address_note ? ` (${site.address_note})` : ""}
            </p>
            <p className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange" />
              {site.hours}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-orange" />
              <a href={`tel:${site.phone_href}`} className="text-lg text-offwhite hover:text-orange">
                {site.phone}
              </a>
            </p>
            {site.telegram && (
              <p className="flex items-center gap-3">
                <Send className="h-5 w-5 text-orange" />
                Telegram:{" "}
                <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="text-offwhite hover:text-orange">
                  {site.telegram.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}
            {site.max && (
              <p className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-orange" />
                MAX:{" "}
                <a href={site.max} target="_blank" rel="noopener noreferrer" className="text-offwhite hover:text-orange">
                  написать в MAX
                </a>
              </p>
            )}
            {site.email && (
              <p className="pl-8">
                E-mail:{" "}
                <a href={`mailto:${site.email}`} className="text-offwhite hover:text-orange">
                  {site.email}
                </a>
              </p>
            )}
          </address>
          <div>
            <LazyEmbed kind="map" src={mapSrc} title="Гараж самообслуживания на Яндекс Картах" className="aspect-[4/3]" />
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={site.maps.yandex_route} target="_blank" rel="noopener noreferrer" data-goal="click_route" className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-graphite-deep">
                <Navigation className="h-4 w-4" />
                Построить маршрут — Яндекс Карты
              </a>
              <a href={site.maps.twogis_route} target="_blank" rel="noopener noreferrer" data-goal="click_route" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-offwhite hover:bg-white/5">
                <Navigation className="h-4 w-4" />
                Маршрут в 2ГИС
              </a>
            </div>
          </div>
        </div>
      </Block>
      {page.intro && (
        <Block title="Как доехать" narrow tone="deep">
          <Prose markdown={page.intro} />
        </Block>
      )}
      {photosByTag(content, "entrance").length > 0 && (
        <Block title="Въезд">
          <PhotoGrid photos={photosByTag(content, "entrance")} />
        </Block>
      )}
      <Block title="Реквизиты" tone="deep" narrow>
        <dl className="grid gap-x-6 gap-y-2 text-sm text-muted sm:grid-cols-[auto_1fr]">
          <dt>Организация</dt>
          <dd className="text-offwhite">{site.legal.name}</dd>
          <dt>ИНН</dt>
          <dd className="text-offwhite">{site.legal.inn}</dd>
          <dt>ОГРН</dt>
          <dd className="text-offwhite">{site.legal.ogrn}</dd>
        </dl>
      </Block>
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
