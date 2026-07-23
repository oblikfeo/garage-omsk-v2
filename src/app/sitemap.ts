import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/sto-samoobsluzhivaniya-omsk",
    "/garazh-na-chas-omsk",
    "/arenda-podyomnika-omsk",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
