import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs before the SEO pages are rendered:
 * - 301 redirects from content/redirects.json (Next's own redirects are 308);
 * - Last-Modified from the page's updated_at and 304 on If-Modified-Since;
 * - X-Robots-Tag: noindex for the articles hub filtered by ?cat.
 *
 * The maps are built from content/ by next.config.ts at build time.
 */
const REDIRECTS: Record<string, string> = JSON.parse(process.env.SEO_REDIRECTS || "{}");
const LAST_MODIFIED: Record<string, string> = JSON.parse(process.env.SEO_LASTMOD || "{}");

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const target = REDIRECTS[pathname];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  const updatedAt = LAST_MODIFIED[pathname];
  let response: NextResponse | undefined;

  if (updatedAt && (request.method === "GET" || request.method === "HEAD")) {
    const lastModified = new Date(`${updatedAt}T00:00:00Z`);
    const since = request.headers.get("if-modified-since");
    if (since && !Number.isNaN(Date.parse(since)) && Date.parse(since) >= lastModified.getTime()) {
      return new NextResponse(null, { status: 304, headers: { "Last-Modified": lastModified.toUTCString() } });
    }
    response = NextResponse.next();
    response.headers.set("Last-Modified", lastModified.toUTCString());
  }

  if (pathname.startsWith("/svoimi-rukami") && searchParams.has("cat")) {
    response ??= NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response ?? NextResponse.next();
}

export const config = {
  // Pages only: skip Next internals, images, uploads and files with an extension.
  // /admin is excluded on purpose: proxy buffers request bodies (10 MB cap),
  // which would interfere with photo uploads in the admin panel.
  matcher: ["/((?!_next/|api/|admin|uploads/|gallery/|plan/|.*\\.[a-zA-Z0-9]+$).*)"],
};
