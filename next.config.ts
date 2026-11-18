import type { NextConfig } from "next";
import { contentRoutes, getSeoContent } from "./src/lib/seo/content";

/**
 * SEO content (content/*.md) is loaded and validated here, before anything is
 * compiled: a missing slug/h1, a taken slug or a broken related link stops the
 * build with a readable list of errors. The redirect and Last-Modified maps go
 * to src/proxy.ts through env.
 */
const content = getSeoContent();
const routes = contentRoutes(content);

const SEO_REDIRECTS = JSON.stringify(Object.fromEntries(content.redirects.map((r) => [r.from, r.to])));
const SEO_LASTMOD = JSON.stringify(
  Object.fromEntries(routes.filter((r) => r.updated_at).map((r) => [r.path, r.updated_at]))
);

const nextConfig: NextConfig = {
  env: { SEO_REDIRECTS, SEO_LASTMOD },
  experimental: {
    serverActions: {
      // Admin photo uploads go through a Server Action; the default 1 MB limit
      // rejects ordinary phone photos. The action itself caps files at 8 MB.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
