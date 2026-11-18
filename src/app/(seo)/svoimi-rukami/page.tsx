import type { Metadata } from "next";
import ArticlesHub from "@/components/seo/ArticlesHub";
import { getSeoContent } from "@/lib/seo/content";
import { pageMetadata } from "@/lib/seo/meta";

export function generateMetadata(): Metadata {
  const content = getSeoContent();
  return pageMetadata(content, content.hubs["svoimi-rukami"], "page", "/svoimi-rukami");
}

export default function ArticlesHubFirst() {
  return <ArticlesHub n={1} />;
}
