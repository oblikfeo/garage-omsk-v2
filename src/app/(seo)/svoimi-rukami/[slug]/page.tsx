import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Gauge, Wrench } from "lucide-react";
import BookingButton from "@/components/seo/BookingButton";
import LazyEmbed, { videoEmbedUrl } from "@/components/seo/LazyEmbed";
import { ArticleCard, Block, Breadcrumbs, Faq, JsonLd, PageMarker, Prose } from "@/components/seo/ui";
import { getSeoContent, type ArticlePage } from "@/lib/seo/content";
import { articleLd, breadcrumbs, faqPage, graph } from "@/lib/seo/jsonld";
import { markdownToc } from "@/lib/seo/markdown";
import { pageMetadata, photoById } from "@/lib/seo/meta";
import { COMPLEXITY_LABEL, hoursLabel, rub, servicePrices } from "@/lib/seo/prices";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => getSeoContent().articles.find((a) => a.slug === slug);

export function generateStaticParams() {
  return getSeoContent().articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = find((await params).slug);
  if (!article) return {};
  return pageMetadata(getSeoContent(), article, "article", `/svoimi-rukami/${article.slug}`);
}

const dateRu = (iso?: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "";

export default async function ArticleRoute({ params }: Props) {
  const article = find((await params).slug);
  if (!article) notFound();
  return <Article article={article} />;
}

function Article({ article }: { article: ArticlePage }) {
  const content = getSeoContent();
  const { site } = content;
  const base = getSiteUrl();
  const author = content.authors.find((a) => a.id === article.author);
  const service = content.services.find((s) => s.slug === article.service);
  const prices = service ? servicePrices(service, site) : undefined;
  const cover = photoById(content, article.cover);
  const toc = markdownToc(article.seo_text);
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: "Своими руками", path: "/svoimi-rukami" },
    { name: article.h1, path: `/svoimi-rukami/${article.slug}` },
  ];
  const related = (
    article.related.length
      ? article.related.map((r) => content.articles.find((a) => a.slug === r)!)
      : content.articles.filter((a) => a.service && a.service === article.service && a.slug !== article.slug).slice(0, 3)
  ).filter(Boolean);

  return (
    <>
      <PageMarker type="article" slug={article.slug} />
      <JsonLd json={graph(breadcrumbs(base, crumbs), articleLd(content, base, article), faqPage(article.faq))} />
      <Breadcrumbs items={crumbs} />

      <article>
        <Block narrow>
          <h1 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-offwhite sm:text-5xl">{article.h1}</h1>
          <p className="mt-4 text-sm text-muted">
            {author && <span className="text-offwhite">{author.name}</span>}
            {author?.position && <span> · {author.position}</span>}
            {article.published_at && <span> · опубликовано {dateRu(article.published_at)}</span>}
            {article.updated_at && article.updated_at !== article.published_at && <span> · обновлено {dateRu(article.updated_at)}</span>}
          </p>

          {/* plate: complexity, time, tools */}
          <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-surface p-5 sm:grid-cols-3">
            {article.complexity && (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Gauge className="h-4 w-4 text-orange" /> Сложность: <b className="text-offwhite">{COMPLEXITY_LABEL[article.complexity]}</b>
              </p>
            )}
            {article.time && (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Clock className="h-4 w-4 text-orange" /> Время: <b className="text-offwhite">{article.time}</b>
              </p>
            )}
            {article.tools.length > 0 && (
              <p className="flex items-start gap-2 text-sm text-muted sm:col-span-3">
                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-orange" /> Инструмент: <span className="text-offwhite">{article.tools.join(", ")}</span>
              </p>
            )}
          </div>

          {/* short CTA */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
            Сделайте это на нашем подъёмнике —{" "}
            <BookingButton url={site.booking_url} label="записаться" icon={false} className="font-semibold text-orange underline underline-offset-4" />
          </div>

          {cover && (
            <figure className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src={cover.src} alt={cover.alt} fill priority sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
            </figure>
          )}

          {toc.length > 1 && (
            <nav aria-label="Содержание" className="mt-8 rounded-2xl border border-white/10 bg-surface p-5">
              <p className="font-display text-lg font-semibold text-offwhite">Содержание</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm marker:text-orange">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-muted hover:text-offwhite">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {article.video && (
            <div className="mt-8">
              <LazyEmbed src={videoEmbedUrl(article.video)} title={`${article.h1} — видео`} />
            </div>
          )}

          {article.steps.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-offwhite">Пошагово</h2>
              <ol className="mt-5 space-y-5">
                {article.steps.map((step, i) => {
                  const photo = photoById(content, step.photo);
                  return (
                    <li key={step.title} className="rounded-2xl border border-white/10 bg-surface p-5">
                      <p className="flex items-center gap-3 font-semibold text-offwhite">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange font-display text-graphite-deep">{i + 1}</span>
                        {step.title}
                      </p>
                      {step.text && <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>}
                      {photo && (
                        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl">
                          <Image src={photo.src} alt={photo.alt} fill loading="lazy" sizes="(max-width: 896px) 100vw, 800px" className="object-cover" />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          <Prose markdown={article.seo_text} className="mt-10" />

          {/* full CTA from the service data; scrolling to it fires read_article */}
          <div data-goal-view="read_article" className="mt-12 rounded-2xl border border-orange/30 bg-orange/[0.07] p-6">
            <p className="font-display text-2xl font-semibold text-offwhite">Сделайте сами в «Гараже»</p>
            {service && prices ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {service.name}: {hoursLabel(service.hours_self)} на подъёмнике — сами от <b className="text-orange">{rub(prices.self)}</b>
                {prices.master !== undefined && (
                  <>
                    , с мастером от <b className="text-offwhite">{rub(prices.master)}</b>
                  </>
                )}
                . Инструмент включён.
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">Пост от {rub(site.rates.post)}/час, подъёмник от {rub(site.rates.lift)}/час, инструмент включён.</p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <BookingButton url={site.booking_url} />
              {service && (
                <Link href={`/uslugi/${service.slug}`} className="inline-flex items-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-offwhite hover:bg-white/5">
                  {service.name}
                </Link>
              )}
            </div>
          </div>
        </Block>
      </article>

      {article.faq.length > 0 && (
        <Block title="Частые вопросы" narrow tone="deep">
          <Faq items={article.faq} />
        </Block>
      )}
      {related.length > 0 && (
        <Block title="По теме">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} content={content} />
            ))}
          </div>
        </Block>
      )}
    </>
  );
}
