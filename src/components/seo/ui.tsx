import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplet,
  Gauge,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Timer,
  Warehouse,
  Wrench,
  X,
} from "lucide-react";
import type { ArticlePage, Content, Equipment, Faq as FaqItem, Photo, ServicePage, SiteData } from "@/lib/seo/content";
import { markdownToHtml } from "@/lib/seo/markdown";
import { COMPLEXITY_LABEL, hoursLabel, rub, servicePrices } from "@/lib/seo/prices";
import { photoById } from "@/lib/seo/meta";
import BookingButton from "./BookingButton";

/* ------------------------------------------------------------------ */
/* layout pieces                                                      */
/* ------------------------------------------------------------------ */

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/** A page block with an optional H2. Renders nothing when empty. */
export function Block({
  title,
  id,
  tone = "panel",
  children,
  narrow = false,
}: {
  title?: string;
  id?: string;
  tone?: "panel" | "deep";
  children: React.ReactNode;
  narrow?: boolean;
}) {
  if (!children || (Array.isArray(children) && children.every((c) => !c))) return null;
  return (
    <section id={id} className={`relative border-t border-white/5 py-12 sm:py-16 ${tone === "deep" ? "panel-deep" : "panel-graphite"}`}>
      <Container className={narrow ? "max-w-4xl" : ""}>
        {title && <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-offwhite sm:mb-8 sm:text-3xl">{title}</h2>}
        {children}
      </Container>
    </section>
  );
}

/** Page marker for Metrika goals: page_type and slug. */
export function PageMarker({ type, slug }: { type: string; slug: string }) {
  return <span hidden data-page-type={type} data-slug={slug} />;
}

export function JsonLd({ json }: { json: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="border-b border-white/5 bg-graphite">
      <Container>
        <ol className="flex flex-wrap items-center gap-1 py-3 text-xs text-muted">
          {items.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-steel-light" />}
              {i < items.length - 1 ? (
                <Link href={item.path} className="hover:text-offwhite">
                  {item.name}
                </Link>
              ) : (
                <span className="text-offwhite/80" aria-current="page">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}

/** First screen: H1, subtitle, price line, photo, booking and call buttons. */
export function SeoHero({
  site,
  h1,
  subtitle,
  price,
  photo,
  meta,
}: {
  site: SiteData;
  h1: string;
  subtitle?: string;
  price?: React.ReactNode;
  photo?: Photo;
  meta?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#16191c]">
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.25]" />
      <Container className={`relative grid items-center gap-8 py-10 sm:py-14 ${photo ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-16" : "lg:py-16"}`}>
        <div>
          <h1 className="text-balance font-display text-[2rem] font-semibold leading-[1.12] tracking-tight text-offwhite sm:text-5xl">{h1}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>}
          {meta && <div className="mt-5">{meta}</div>}
          {price && <div className="mt-6">{price}</div>}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <BookingButton url={site.booking_url} />
            <a
              href={`tel:${site.phone_href}`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-offwhite hover:border-white/30 hover:bg-white/5"
            >
              <Phone className="h-4 w-4 text-orange" />
              {site.phone}
            </a>
          </div>
        </div>
        {photo && (
          <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10">
            <Image src={photo.src} alt={photo.alt} fill priority sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
          </figure>
        )}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* content blocks                                                     */
/* ------------------------------------------------------------------ */

export function Prose({ markdown, className = "" }: { markdown?: string; className?: string }) {
  const html = markdownToHtml(markdown);
  if (!html) return null;
  return <div className={`seo-prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** FAQ accordion; the answers are in the HTML (native <details>). */
export function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface">
      {items.map((item, i) => (
        <details key={item.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-sm font-semibold text-offwhite sm:px-6 sm:text-base [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-orange transition-transform group-open:rotate-180" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function PriceTable({ site }: { site: SiteData }) {
  if (!site.price_list.length) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-steel-light">
          <tr>
            <th className="px-5 py-3 font-semibold">Что арендуете</th>
            <th className="px-5 py-3 text-right font-semibold">Час</th>
            <th className="px-5 py-3 text-right font-semibold">Сутки</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {site.price_list.map((row) => (
            <tr key={row.name}>
              <td className="px-5 py-3 text-offwhite">{row.name}</td>
              <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-orange">{row.hour ? rub(row.hour) : "—"}</td>
              <td className="whitespace-nowrap px-5 py-3 text-right text-muted">{row.day ? rub(row.day) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((p) => (
        <figure key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <div className="relative aspect-[4/3]">
            <Image src={p.src} alt={p.alt} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
          </div>
          {p.caption && <figcaption className="px-4 py-3 text-xs text-muted">{p.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

export function photosByTag(content: Content, tag?: string): Photo[] {
  return tag ? content.photos.filter((p) => p.tags.includes(tag)) : [];
}

const ICONS: Record<string, typeof Check> = {
  clock: Clock,
  timer: Timer,
  wrench: Wrench,
  shield: ShieldCheck,
  car: Car,
  oil: Droplet,
  calendar: Calendar,
  gauge: Gauge,
  box: Warehouse,
};

export function Benefits({ items }: { items: { icon?: string; title: string; text: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => {
        const Icon = ICONS[b.icon ?? ""] ?? Check;
        return (
          <div key={b.title} className="card-metal rounded-2xl border border-white/10 bg-surface p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/15 text-orange">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-offwhite">{b.title}</h3>
            {b.text && <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function EquipmentGrid({ items, content }: { items: Equipment[]; content: Content }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => {
        const photo = photoById(content, e.photo);
        return (
          <div key={e.id} className="flex gap-4 rounded-2xl border border-white/10 bg-surface p-4">
            {photo && (
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image src={photo.src} alt={photo.alt} fill loading="lazy" sizes="80px" className="object-cover" />
              </div>
            )}
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-offwhite">
                {e.available ? <Check className="h-4 w-4 text-green" /> : <X className="h-4 w-4 text-steel-light" />}
                {e.name}
              </p>
              {e.description && <p className="mt-1 text-xs leading-relaxed text-muted">{e.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ServiceCard({ service, site }: { service: ServicePage; site: SiteData }) {
  const { self } = servicePrices(service, site);
  return (
    <Link
      href={`/uslugi/${service.slug}`}
      className="card-metal group flex flex-col rounded-2xl border border-white/10 bg-surface p-5 transition-colors hover:border-orange/40"
    >
      <span className="font-display text-lg font-semibold text-offwhite group-hover:text-orange">{service.name}</span>
      <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span>{hoursLabel(service.hours_self)}</span>
        <span>{COMPLEXITY_LABEL[service.complexity]}</span>
      </span>
      <span className="mt-4 text-sm text-offwhite">
        Сами от <b className="text-orange">{rub(self)}</b>
      </span>
    </Link>
  );
}

export function ArticleCard({ article, content, category }: { article: ArticlePage; content: Content; category?: string }) {
  const cover = photoById(content, article.cover);
  return (
    <Link
      href={`/svoimi-rukami/${article.slug}`}
      data-cat={category}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-orange/40"
    >
      {cover && (
        <div className="relative aspect-[16/9]">
          <Image src={cover.src} alt={cover.alt} fill loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
        </div>
      )}
      <span className="flex flex-1 flex-col p-5">
        <span className="font-display text-lg font-semibold leading-snug text-offwhite group-hover:text-orange">{article.h1}</span>
        <span className="mt-auto flex gap-4 pt-4 text-xs text-muted">
          {article.complexity && <span>{COMPLEXITY_LABEL[article.complexity]}</span>}
          {article.time && <span>{article.time}</span>}
        </span>
      </span>
    </Link>
  );
}

/** «Как добраться»: address, hours and route links (click_route goal). */
export function HowToGet({ site }: { site: SiteData }) {
  return (
    <div className="grid gap-6 rounded-2xl border border-white/10 bg-surface p-6 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="space-y-2 text-sm text-muted">
        <p className="flex items-start gap-2 text-base font-semibold text-offwhite">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
          {site.address}
          {site.address_note ? ` (${site.address_note})` : ""}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange" />
          {site.hours}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-orange" />
          <a href={`tel:${site.phone_href}`} className="text-offwhite hover:text-orange">
            {site.phone}
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:items-end">
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
  );
}

/** Booking call-to-action band. */
export function BookingBand({ site, title = "Запишитесь на пост онлайн", text }: { site: SiteData; title?: string; text?: string }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-orange/30 bg-orange/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-xl font-semibold text-offwhite">{title}</p>
        <p className="mt-1 text-sm text-muted">{text ?? `Выберите время и пост — ${site.hours.toLowerCase()}.`}</p>
      </div>
      <BookingButton url={site.booking_url} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* footer and mobile bar                                              */
/* ------------------------------------------------------------------ */

export function SeoFooter({ site }: { site: SiteData }) {
  return (
    <footer className="panel-deep border-t border-white/10 pb-24 lg:pb-0">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" aria-label="На главную">
            <Image src="/logo.svg" alt={`${site.name} — логотип`} width={200} height={42} className="h-9 w-auto" unoptimized />
          </Link>
          <div className="mt-4 space-y-1 text-sm text-muted">
            <p className="font-semibold text-offwhite">{site.legal.name}</p>
            <p>ИНН: {site.legal.inn}</p>
            <p>ОГРН: {site.legal.ogrn}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-muted">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-offwhite">Контакты</p>
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{site.address}</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange" /><a href={`tel:${site.phone_href}`} className="hover:text-offwhite">{site.phone}</a></p>
          <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-orange" />{site.hours}</p>
          <p className="flex gap-4">
            <a href={site.maps.yandex} target="_blank" rel="noopener noreferrer" className="hover:text-offwhite">Яндекс Карты</a>
            <a href={site.maps.twogis} target="_blank" rel="noopener noreferrer" className="hover:text-offwhite">2ГИС</a>
          </p>
        </div>
        <nav className="space-y-3 text-sm text-muted" aria-label="Разделы">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-offwhite">Разделы</p>
          {site.footer_links.map((l) => (
            <Link key={l.href} href={l.href} className="block hover:text-offwhite">
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
      <div className="border-t border-white/5">
        <Container className="py-5 text-xs text-muted/70">© {new Date().getFullYear()} {site.name}, {site.city}</Container>
      </div>
    </footer>
  );
}

/** Sticky phone + booking bar on phones. */
export function MobileBar({ site }: { site: SiteData }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-graphite/95 p-3 backdrop-blur lg:hidden">
      <a href={`tel:${site.phone_href}`} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-sm font-semibold text-offwhite">
        <Phone className="h-4 w-4 text-orange" />
        Позвонить
      </a>
      <BookingButton url={site.booking_url} label="Записаться" className="flex items-center justify-center gap-2 rounded-xl bg-orange py-3 text-sm font-semibold text-graphite-deep" />
    </div>
  );
}
