"use client";

import { useEffect, useState } from "react";

/**
 * Category filter of the articles hub (?cat=…). The page itself is static and
 * self-canonical; ?cat is excluded via Clean-param in robots.txt and gets
 * X-Robots-Tag: noindex from proxy.ts. Cards carry data-cat.
 */
export default function ArticleFilter({ categories }: { categories: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState<string>("");

  useEffect(() => {
    setCurrent(new URLSearchParams(window.location.search).get("cat") ?? "");
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-cat]").forEach((card) => {
      card.hidden = Boolean(current) && card.dataset.cat !== current;
    });
  }, [current]);

  const choose = (id: string) => {
    setCurrent(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("cat", id);
    else url.searchParams.delete("cat");
    window.history.replaceState(null, "", url);
  };

  if (categories.length < 2) return null;

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active ? "border-orange bg-orange text-graphite-deep" : "border-white/15 text-muted hover:border-white/30 hover:text-offwhite"
    }`;

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={chip(!current)} onClick={() => choose("")}>
        Все
      </button>
      {categories.map((c) => (
        <button key={c.id} type="button" className={chip(current === c.id)} onClick={() => choose(c.id)}>
          {c.label}
        </button>
      ))}
    </div>
  );
}
