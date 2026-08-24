"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Image as ImageIcon,
  MapPin,
  Phone,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { site as defaultSite } from "@/lib/data";
import type { SiteInfo } from "@/lib/content-types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero({ site = defaultSite }: { site?: SiteInfo }) {
  const stats = [
    { icon: Timer, label: "от 1 часа", sub: "почасовая аренда" },
    {
      icon: ShieldCheck,
      label: `${site.posts} постов`,
      sub: "и подъёмников в боксе",
    },
    { icon: CalendarCheck, label: "09:00–19:00", sub: "без выходных" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#16191c]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.28]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-hairline"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:py-24">
        <motion.div initial="hidden" animate="show" variants={container}>
          <motion.h1
            variants={item}
            className="text-balance font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-offwhite sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]"
          >
            Ремонтируйте машину сами —{" "}
            <span className="text-orange">пост и подъёмник</span> в аренду
            почасово
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg"
          >
            Профессиональный бокс с двумя типами подъёмников и шиномонтажным
            станком. Платите только за время работы — от часа до суток, без
            абонементов и переплат за сервис.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
          >
            <Link
              href="#booking"
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange px-7 py-4 text-base font-semibold text-graphite-deep shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgb(255_106_0_/_0.25),0_12px_36px_-8px_rgb(255_106_0_/_0.5)] active:scale-[0.98]"
            >
              <CalendarCheck className="h-5 w-5 shrink-0" />
              Записаться онлайн
            </Link>
            <a
              href={`tel:${site.phoneHref}`}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/15 px-7 py-4 text-base font-semibold text-offwhite transition-all duration-300 hover:border-white/30 hover:bg-white/5 active:scale-[0.98]"
            >
              <Phone className="h-5 w-5 shrink-0 text-orange" />
              {site.phone}
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex items-center gap-2 text-sm text-muted"
          >
            <MapPin className="h-4 w-4 shrink-0 text-orange" />
            {site.address}
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-9 grid grid-cols-3 gap-3 border-t border-white/10 pt-7 sm:mt-10 sm:gap-4 sm:pt-8"
          >
            {stats.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex min-w-0 flex-col items-start gap-1.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-blue" />
                <dt className="whitespace-nowrap font-display text-sm font-semibold leading-tight text-offwhite sm:text-lg">
                  {label}
                </dt>
                <dd className="text-[11px] leading-snug text-muted sm:text-xs">
                  {sub}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure className="group relative overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <div className="relative aspect-[4/3]">
              <Image
                src="/gallery/hall-lifts.jpg"
                alt="Бокс СТО самообслуживания в Омске с двухстоечными подъёмниками"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
            </div>

            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-deep via-graphite-deep/25 to-transparent" />
            <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

            <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
              <span className="font-display text-sm font-semibold text-offwhite sm:text-base">
                6 постов, 5 подъёмников, шиномонтаж
                <span className="mt-0.5 block text-xs font-normal text-muted">
                  {site.address}
                </span>
              </span>
              <Link
                href="#gallery"
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/20 bg-graphite-deep/60 px-3 py-2 text-xs font-semibold text-offwhite backdrop-blur transition-colors duration-200 hover:border-orange/50 hover:text-orange"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Все фото
              </Link>
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  );
}
