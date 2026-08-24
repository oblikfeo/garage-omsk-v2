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
  { href: "/#gallery", label: "Фото" },
  { href: "/#how", label: "Как работает" },
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
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.svg"
            alt={`${site.fullName} — логотип`}
            width={220}
            height={46}
            className="h-9 w-auto sm:h-10"
            priority
            unoptimized
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative whitespace-nowrap py-1 text-center text-sm font-medium leading-tight text-muted transition-colors duration-200 hover:text-offwhite"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-orange transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 xl:flex">
          <a
            href={`tel:${site.phoneHref}`}
            className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-offwhite transition-colors duration-200 hover:text-orange"
          >
            <Phone className="h-4 w-4 shrink-0 text-orange" />
            {site.phone}
          </a>
          <Link
            href="/#booking"
            className="whitespace-nowrap rounded-lg bg-orange px-4 py-2.5 text-sm font-semibold text-graphite-deep shadow-glow transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            Записаться онлайн
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-offwhite transition-colors duration-200 hover:bg-white/5 xl:hidden"
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
            className="overflow-hidden border-t border-white/10 bg-graphite xl:hidden"
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
                className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-offwhite"
              >
                <Phone className="h-4 w-4 shrink-0 text-orange" />
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
