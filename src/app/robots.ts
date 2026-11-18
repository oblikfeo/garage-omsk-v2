import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { landings } from "@/lib/landings";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/politika-konfidentsialnosti",
        // Ad copies of the home page (/zamena-masla …) stay out of search.
        ...Object.keys(landings).map((slug) => `/${slug}`),
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
