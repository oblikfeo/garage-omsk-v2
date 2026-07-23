"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { site } from "@/lib/data";

const navLinks = [
  { href: "/#services", label: "Услуги" },
  { href: "/#prices", label: "Цены" },
  { href: "/#how", label: "Как это работает" },
  { href: "/#safety", label: "Безопасность" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contacts", label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-graphite/90 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "border-white/10 shadow-lg shadow-black/20" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 sm:h-[72px] lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo.jpg"
            alt={`${site.fullName} — логотип`}
            width={48}
            height={48}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10 sm:h-12 sm:w-12"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-wide text-offwhite sm:text-xl">
              ГАРАЖ
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[11px] sm:tracking-[0.18em]">
              самообслуживания
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-1 text-sm font-medium text-muted transition-colors duration-200 hover:text-offwhite"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-orange transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${site.phoneHref}`}
            className="flex items-center gap-2 text-sm font-medium text-offwhite transition-colors duration-200 hover:text-orange"
          >
            <Phone className="h-4 w-4 text-orange" />
            {site.phone}
          </a>
          <Link
            href="/#booking"
            className="rounded-lg bg-orange px-4 py-2.5 text-sm font-semibold text-graphite-deep shadow-glow transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            Записаться онлайн
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-offwhite transition-colors duration-200 hover:bg-white/5 lg:hidden"
        >
          <motion.span
            key={open ? "close" : "menu"}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-graphite lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:bg-white/5 hover:text-offwhite"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={`tel:${site.phoneHref}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-offwhite"
              >
                <Phone className="h-4 w-4 text-orange" />
                {site.phone}
              </a>
              <Link
                href="/#booking"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-orange px-4 py-3 text-center text-sm font-semibold text-graphite-deep transition-transform duration-200 active:scale-[0.98]"
              >
                Записаться онлайн
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
