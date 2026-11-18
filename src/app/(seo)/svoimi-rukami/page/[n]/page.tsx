import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlesHub, { articlePageCount } from "@/components/seo/ArticlesHub";
import { getSeoContent } from "@/lib/seo/content";
import { pageMetadata } from "@/lib/seo/meta";

/** /svoimi-rukami/page/{n}, n ≥ 2; each page is self-canonical. */
type Props = { params: Promise<{ n: string }> };

const parse = (raw: string) => (/^\d+$/.test(raw) ? Number(raw) : NaN);

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, articlePageCount() - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parse((await params).n);
  const content = getSeoContent();
  const hub = content.hubs["svoimi-rukami"];
  const page = { ...hub, title: hub.title ? `${hub.title} — страница ${n}` : "", h1: `${hub.h1} — страница ${n}` };
  return pageMetadata(content, page, "page", `/svoimi-rukami/page/${n}`);
}

export default async function ArticlesHubPage({ params }: Props) {
  const n = parse((await params).n);
  if (!(n >= 2 && n <= articlePageCount())) notFound();
  return <ArticlesHub n={n} />;
}
