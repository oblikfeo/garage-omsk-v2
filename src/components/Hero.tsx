"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, MapPin, ShieldCheck, Timer } from "lucide-react";
import { site } from "@/lib/data";

const stats = [
  { icon: Timer, label: "от 1 часа", sub: "почасовая аренда" },
  { icon: ShieldCheck, label: "4 поста", sub: "и подъёмника в боксе" },
  { icon: CalendarCheck, label: "08:00–23:00", sub: "без выходных" },
];

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

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-diagonal-grid">
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-orange/10 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-72 w-72 rounded-full bg-blue/10 blur-3xl sm:h-96 sm:w-96" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:py-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange"
          >
            СТО самообслуживания в {site.city}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-balance font-display text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-offwhite sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]"
          >
            Ремонтируйте машину сами —{" "}
            <span className="text-orange">пост и подъёмник</span> в аренду
            почасово
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg"
          >
            Профессиональный бокс с ямой, двумя типами подъёмников и
            шиномонтажным станком. Платите только за время работы — от часа
            до суток, без абонементов и переплат за сервис.
          </motion.p>

          <motion.div variants={item} className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              href="#booking"
              className="flex items-center justify-center gap-2 rounded-xl bg-orange px-7 py-4 text-base font-semibold text-graphite-deep shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgb(255_106_0_/_0.25),0_12px_36px_-8px_rgb(255_106_0_/_0.5)] active:scale-[0.98]"
            >
              <CalendarCheck className="h-5 w-5" />
              Записаться онлайн
            </Link>
            <a
              href={`tel:${site.phoneHref}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-4 text-base font-semibold text-offwhite transition-all duration-300 hover:border-white/30 hover:bg-white/5 active:scale-[0.98]"
            >
              Позвонить: {site.phone}
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-6 flex items-center gap-2 text-sm text-muted">
            <MapPin className="h-4 w-4 shrink-0 text-orange" />
            {site.address}
          </motion.div>

          <motion.dl variants={item} className="mt-9 grid grid-cols-3 gap-3 border-t border-white/10 pt-7 sm:mt-10 sm:gap-4 sm:pt-8">
            {stats.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-start gap-1.5 min-w-0">
                <Icon className="h-4 w-4 shrink-0 text-blue" />
                <dt className="font-display text-sm font-semibold leading-tight text-offwhite sm:text-lg">
                  {label}
                </dt>
                <dd className="text-[11px] leading-snug text-muted sm:text-xs">{sub}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-[80%] w-[80%] rounded-full bg-orange/15 blur-[80px]" />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square w-full max-w-md overflow-hidden rounded-full ring-1 ring-white/10 shadow-2xl"
          >
            <Image
              src="/logo.jpg"
              alt="Гараж самообслуживания — эмблема"
              fill
              priority
              sizes="(max-width: 1024px) 320px, 480px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
