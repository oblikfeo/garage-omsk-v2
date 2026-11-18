"use client";

import { CalendarCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * "Записаться": the YCLIENTS booking widget opens in a dialog on click, so the
 * third-party iframe never loads with the page. Fires the open_booking goal
 * (see Goals.tsx) through data-goal.
 */
export default function BookingButton({
  url,
  label = "Записаться онлайн",
  className,
  icon = true,
}: {
  url: string;
  label?: string;
  className?: string;
  icon?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        data-goal="open_booking"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange px-6 py-3.5 text-sm font-semibold text-graphite-deep shadow-glow transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        }
      >
        {icon && <CalendarCheck className="h-4 w-4 shrink-0" />}
        {label}
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Онлайн-запись"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-graphite-deep/90 p-3 backdrop-blur-sm sm:p-6"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative flex h-full max-h-[760px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-graphite-deep/80 text-offwhite"
              >
                <X className="h-5 w-5" />
              </button>
              <iframe title="Онлайн-запись" src={url} className="h-full w-full border-0" />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
