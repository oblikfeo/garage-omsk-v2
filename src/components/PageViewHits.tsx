"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { METRIKA_COUNTER_ID, VK_PIXEL_ID } from "@/lib/counters";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    _tmr?: unknown[];
  }
}

/**
 * The first page view is counted by the counters themselves (Yandex.Metrika,
 * VK pixel). Next.js switches pages without a full reload, so every later page
 * view is reported to both explicitly.
 */
export default function PageViewHits() {
  const pathname = usePathname();
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    const url = window.location.href;
    const referer = previousUrl.current;
    previousUrl.current = url;
    if (referer === null || referer === url) return;

    window.ym?.(METRIKA_COUNTER_ID, "hit", url, { referer });
    (window._tmr = window._tmr || []).push({
      id: VK_PIXEL_ID,
      type: "pageView",
      start: Date.now(),
      url,
    });
  }, [pathname]);

  return null;
}
