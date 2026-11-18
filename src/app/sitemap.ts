import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { contentRoutes } from "@/lib/seo/content";

/**
 * Home page + every SEO content file with index: true (lastmod = updated_at).
 * Direct landings and noindex pages are left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const pages = contentRoutes().filter((r) => r.index);

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...pages.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: r.updated_at ? new Date(`${r.updated_at}T00:00:00Z`) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
