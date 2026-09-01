"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Wrench, X } from "lucide-react";

import type { SiteNotice } from "@/lib/content-types";

const STORAGE_KEY = "garage-notice-collapsed";

const TONES = {
  work: {
    Icon: Wrench,
    pillLabel: "Идут работы",
    bar: "bg-orange",
    dot: "bg-orange",
    badge: "bg-orange/12 text-orange ring-orange/25",
    edge: "ring-orange/25",
    cta: "bg-orange text-graphite-deep hover:bg-orange/90",
  },
  live: {
    Icon: CheckCircle2,
    pillLabel: "Всё работает",
    bar: "bg-green",
    dot: "bg-green",
    badge: "bg-green/12 text-green ring-green/25",
    edge: "ring-green/25",
    cta: "bg-green text-graphite-deep hover:bg-green/90",
  },
} as const;

export default function SiteNoticeWidget({ notice }: { notice: SiteNotice }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  // Collapsing is remembered per message, so editing the text in the admin
  // panel re-opens the widget for people who had already closed the old one.
  const signature = `${notice.tone}|${notice[notice.tone]?.title ?? ""}`;

  useEffect(() => {
    setMounted(true);
    try {
      setOpen(window.localStorage.getItem(STORAGE_KEY) !== signature);
    } catch {
      setOpen(true);
    }
  }, [signature]);

  if (!notice.enabled || !mounted) return null;

  const tone = TONES[notice.tone] ?? TONES.work;
  const message = notice[notice.tone] ?? notice.work;
  const { Icon } = tone;

  function collapse() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, signature);
    } catch {
      /* private mode — the widget simply reopens next visit */
    }
  }

  function expand() {
    setOpen(true);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clear */
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.aside
            key="card"
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`card-metal pointer-events-auto w-[calc(100vw-2rem)] max-w-[400px] overflow-hidden rounded-2xl bg-surface shadow-2xl shadow-black/50 ring-1 ${tone.edge}`}
          >
            <span aria-hidden className={`block h-1 w-full ${tone.bar}`} />

            <div className="p-5">
              <div className="flex items-center gap-3.5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tone.badge}`}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </span>

                <h2 className="min-w-0 flex-1 font-display text-xl font-semibold leading-snug text-offwhite">
                  {message.title}
                </h2>

                <button
                  type="button"
                  onClick={collapse}
                  aria-label="Свернуть сообщение"
                  className="-mr-2 shrink-0 self-start rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-white/5 hover:text-offwhite"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3.5 text-[15px] leading-relaxed text-light">
                {message.text}
              </p>

              {notice.tone === "live" && (
                <a
                  href="/#booking"
                  className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${tone.cta}`}
                >
                  <CalendarCheck className="h-4 w-4 shrink-0" />
                  Записаться онлайн
                </a>
              )}
            </div>
          </motion.aside>
        ) : (
          <motion.button
            key="pill"
            type="button"
            onClick={expand}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`card-metal pointer-events-auto flex items-center gap-2.5 rounded-full bg-surface py-3.5 pl-4.5 pr-5 shadow-xl shadow-black/40 ring-1 transition-transform duration-200 hover:scale-[1.03] ${tone.edge}`}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                aria-hidden
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${tone.dot}`}
              />
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${tone.dot}`} />
            </span>
            <span className="whitespace-nowrap text-[15px] font-semibold text-offwhite">
              {tone.pillLabel}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
