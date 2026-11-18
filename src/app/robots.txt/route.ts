import { getSiteUrl } from "@/lib/site-url";
import { landings } from "@/lib/landings";

/**
 * robots.txt as a route handler (the metadata robots.ts cannot emit Yandex's
 * Clean-param directive). Disallows are the ones that were live before:
 * admin, privacy policy and the Yandex Direct landings.
 */
export const dynamic = "force-static";

export function GET() {
  const disallow = ["/admin", "/politika-konfidentsialnosti", ...Object.keys(landings).map((slug) => `/${slug}`)];
  const body = [
    "User-Agent: *",
    "Allow: /",
    ...disallow.map((path) => `Disallow: ${path}`),
    "Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&_openstat&cat",
    "",
    `Sitemap: ${getSiteUrl()}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
