import Link from "next/link";
import ArticleFilter from "./ArticleFilter";
import { ArticleCard, Block, Breadcrumbs, Faq, JsonLd, PageMarker, Prose } from "./ui";
import { ARTICLES_PER_PAGE, getSeoContent } from "@/lib/seo/content";
import { breadcrumbs, faqPage, graph } from "@/lib/seo/jsonld";
import { headingId } from "@/lib/seo/markdown";
import { getSiteUrl } from "@/lib/site-url";

export function articlePageCount(): number {
  return Math.max(1, Math.ceil(getSeoContent().articles.length / ARTICLES_PER_PAGE));
}

/** Articles hub, page `n` (1-based). Intro and FAQ only on the first page. */
export default function ArticlesHub({ n }: { n: number }) {
  const content = getSeoContent();
  const page = content.hubs["svoimi-rukami"];
  const pages = articlePageCount();
  const path = n === 1 ? "/svoimi-rukami" : `/svoimi-rukami/page/${n}`;
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: page.h1, path: "/svoimi-rukami" },
    ...(n > 1 ? [{ name: `Страница ${n}`, path }] : []),
  ];

  const sorted = [...content.articles].sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  const slice = sorted.slice((n - 1) * ARTICLES_PER_PAGE, n * ARTICLES_PER_PAGE);
  const categoryOf = (serviceSlug?: string) => content.services.find((s) => s.slug === serviceSlug)?.category;
  const categories = [...new Set(slice.map((a) => categoryOf(a.service)).filter((c): c is string => !!c))].map((label) => ({
    id: headingId(label),
    label,
  }));

  return (
    <>
      <PageMarker type="articles" slug={n === 1 ? "svoimi-rukami" : `svoimi-rukami/page/${n}`} />
      <JsonLd json={graph(breadcrumbs(getSiteUrl(), crumbs), n === 1 ? faqPage(page.faq) : null)} />
      <Breadcrumbs items={crumbs} />
      <Block>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-offwhite sm:text-5xl">
          {page.h1}
          {n > 1 && <span className="text-muted"> — страница {n}</span>}
        </h1>
        {n === 1 && page.intro && <Prose markdown={page.intro} className="mt-5" />}
        <div className="mt-8">
          <ArticleFilter categories={categories} />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((a) => {
            const cat = categoryOf(a.service);
            return <ArticleCard key={a.slug} article={a} content={content} category={cat ? headingId(cat) : undefined} />;
          })}
        </div>
        {pages > 1 && (
          <nav aria-label="Страницы" className="mt-10 flex flex-wrap gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? "/svoimi-rukami" : `/svoimi-rukami/page/${p}`}
                aria-current={p === n ? "page" : undefined}
                className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm ${
                  p === n ? "border-orange bg-orange text-graphite-deep" : "border-white/15 text-muted hover:text-offwhite"
                }`}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </Block>
      {n === 1 && page.faq.length > 0 && (
        <Block title="Частые вопросы" narrow tone="deep">
          <Faq items={page.faq} />
        </Block>
      )}
      {n === 1 && page.seo_text && (
        <Block narrow>
          <Prose markdown={page.seo_text} />
        </Block>
      )}
    </>
  );
}
