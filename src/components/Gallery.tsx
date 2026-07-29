"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Map,
  X,
} from "lucide-react";
import { gallery } from "@/lib/data";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";
import PlanViewer from "./PlanViewer";

const tileSpans = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const shift = useCallback(
    (step: number) =>
      setOpenIndex((current) =>
        current === null
          ? current
          : (current + step + gallery.length) % gallery.length
      ),
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") shift(1);
      if (e.key === "ArrowLeft") shift(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, shift]);

  const active = openIndex === null ? null : gallery[openIndex];

  return (
    <Section id="gallery" variant="deep" pattern="hatch" band>
      <SectionHeading
        eyebrow="Фотографии"
        title="Наш бокс и оборудование"
        description="Реальные фото постов, подъёмников и инструмента — смотрите, где будете работать, ещё до записи."
      />

      <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:h-[560px]">
        {gallery.map((photo, i) => (
          <FadeIn
            key={photo.src}
            delay={i * 0.07}
            className={`${tileSpans[i]} min-h-0`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Открыть фото: ${photo.title}`}
              className="group relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-300 hover:ring-orange/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              <div className="relative aspect-[4/3] h-full w-full lg:aspect-auto">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
              </div>

              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-deep/90 via-graphite-deep/25 to-transparent" />

              <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-graphite-deep/70 text-offwhite opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                <Expand className="h-4 w-4" />
              </span>

              <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
                <span className="block font-display text-base font-semibold text-offwhite sm:text-lg">
                  {photo.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted sm:text-sm">
                  {photo.caption}
                </span>
              </span>
            </button>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.25} className="mt-3 sm:mt-4">
        <button
          type="button"
          onClick={() => setPlanOpen(true)}
          className="group relative flex w-full overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-300 hover:ring-orange/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          <span className="absolute inset-0">
            <Image
              src="/plan/schema-thumb.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-graphite-deep via-graphite-deep/92 to-graphite-deep/75" />
            <span className="absolute inset-0 bg-blueprint opacity-30" />
          </span>

          <span className="relative flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 lg:px-8 lg:py-7">
            <span className="flex items-start gap-4 text-left sm:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange/15 text-orange ring-1 ring-orange/25 transition-colors duration-300 group-hover:bg-orange group-hover:text-graphite-deep">
                <Map className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold text-offwhite sm:text-xl">
                  Схема бокса и расстановка постов
                </span>
                <span className="mt-1 block max-w-xl text-sm leading-relaxed text-muted">
                  Чертёж с размерами: 8 постов, подъёмники, шиномонтаж, верстаки
                  и зоны оборудования. Откройте просмотр и увеличьте нужный
                  участок.
                </span>
              </span>
            </span>

            <span className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-graphite-deep shadow-glow transition-transform duration-200 group-hover:scale-[1.03]">
              <Expand className="h-4 w-4" />
              Открыть схему
            </span>
          </span>
        </button>
      </FadeIn>

      <PlanViewer open={planOpen} onClose={() => setPlanOpen(false)} />

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-graphite-deep/92 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-offwhite transition-colors duration-200 hover:bg-white/10 sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                shift(-1);
              }}
              aria-label="Предыдущее фото"
              className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-offwhite transition-colors duration-200 hover:bg-white/10 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                shift(1);
              }}
              aria-label="Следующее фото"
              className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-offwhite transition-colors duration-200 hover:bg-white/10 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.figure
              key={active.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/15">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-center">
                <span className="block font-display text-lg font-semibold text-offwhite">
                  {active.title}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {active.caption}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
