"use client";

import { useEffect } from "react";

/**
 * A link to a section of the current page (#gallery, /#booking …) does nothing
 * when the address already ends with that hash: after "Все фото" was pressed
 * once and the visitor scrolled back up, pressing it again kept them at the top.
 * This listener scrolls to the section anyway in that case. Other clicks are
 * left to the browser and Next.js.
 */
export default function SameHashScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

      const url = new URL(link.href, window.location.href);
      if (
        !url.hash ||
        url.pathname !== window.location.pathname ||
        url.hash !== window.location.hash
      ) {
        return;
      }

      const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!section) return;

      event.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
