"use client";

import { useEffect } from "react";
import { METRIKA_COUNTER_ID } from "@/lib/counters";

/**
 * Yandex.Metrika goals on the SEO pages, all with { page_type, slug } taken
 * from the [data-page-type] marker each page renders:
 * click_phone, click_telegram, click_max, open_booking, click_route (clicks)
 * and read_article (the article's full CTA scrolled into view).
 */
function pageParams() {
  const marker = document.querySelector<HTMLElement>("[data-page-type]");
  return { page_type: marker?.dataset.pageType ?? "", slug: marker?.dataset.slug ?? "" };
}

function reach(goal: string) {
  window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal, pageParams());
}

export default function Goals() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest?.("a, button, [data-goal]");
      if (!el) return;
      const explicit = (el as HTMLElement).dataset?.goal;
      if (explicit) return reach(explicit);
      const href = el instanceof HTMLAnchorElement ? el.getAttribute("href") ?? "" : "";
      if (href.startsWith("tel:")) reach("click_phone");
      else if (/^https?:\/\/(www\.)?t\.me\//.test(href)) reach("click_telegram");
      else if (/^https?:\/\/(www\.)?max\.ru\//.test(href)) reach("click_max");
    };
    document.addEventListener("click", onClick);

    let observer: IntersectionObserver | undefined;
    const target = document.querySelector("[data-goal-view='read_article']");
    if (target && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reach("read_article");
          observer?.disconnect();
        }
      });
      observer.observe(target);
    }

    return () => {
      document.removeEventListener("click", onClick);
      observer?.disconnect();
    };
  }, []);

  return null;
}
