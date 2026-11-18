"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Clock, MapPin, Menu, MessageCircle, Phone, Send, X } from "lucide-react";
import BookingButton from "./BookingButton";

export type HeaderData = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  phoneHref: string;
  telegram?: string;
  max?: string;
  bookingUrl: string;
  services: { slug: string; name: string }[];
};

/** Shared header of the SEO pages (the home page keeps its own header). */
export default function SeoHeader({ data }: { data: HeaderData }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!servicesOpen) return;
    const close = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [servicesOpen]);

  const nav = [
    { href: "/ceny", label: "Цены" },
    { href: "/svoimi-rukami", label: "Своими руками" },
    { href: "/kontakty", label: "Контакты" },
  ];
  const linkClass = "whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-offwhite";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-graphite/95 backdrop-blur">
      {/* contact strip */}
      <div className="hidden border-b border-white/5 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-8 py-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-orange" />
            {data.address}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-orange" />
            {data.hours}
          </span>
          <span className="ml-auto flex items-center gap-4">
            {data.telegram && (
              <a href={data.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-offwhite">
                <Send className="h-3.5 w-3.5" /> Telegram
              </a>
            )}
            {data.max && (
              <a href={data.max} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-offwhite">
                <MessageCircle className="h-3.5 w-3.5" /> MAX
              </a>
            )}
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[68px] lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${data.name} — на главную`}>
          <Image src="/logo.svg" alt={`${data.name} — логотип`} width={220} height={46} className="h-9 w-auto sm:h-10" priority unoptimized />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Основное меню">
          <div ref={servicesRef} className="relative">
            <div className="flex items-center gap-1">
              <Link href="/uslugi" className={linkClass}>
                Услуги
              </Link>
              <button
                type="button"
                aria-label="Список услуг"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
                className="rounded p-0.5 text-muted hover:text-offwhite"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            {servicesOpen && data.services.length > 0 && (
              <div className="absolute left-0 top-full mt-3 w-72 rounded-xl border border-white/10 bg-surface p-2 shadow-2xl shadow-black/40">
                {data.services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/uslugi/${s.slug}`}
                    onClick={() => setServicesOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-offwhite"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={`tel:${data.phoneHref}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-offwhite hover:text-orange">
            <Phone className="h-4 w-4 text-orange" />
            {data.phone}
          </a>
          <BookingButton
            url={data.bookingUrl}
            label="Записаться"
            icon={false}
            className="whitespace-nowrap rounded-lg bg-orange px-4 py-2.5 text-sm font-semibold text-graphite-deep shadow-glow transition-transform hover:scale-[1.03]"
          />
        </div>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-offwhite lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-graphite px-4 py-4 lg:hidden" aria-label="Мобильное меню">
          <Link href="/uslugi" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-offwhite">
            Услуги
          </Link>
          {data.services.map((s) => (
            <Link key={s.slug} href={`/uslugi/${s.slug}`} onClick={() => setOpen(false)} className="block rounded-lg py-2 pl-6 pr-3 text-sm text-muted">
              {s.name}
            </Link>
          ))}
          {nav.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-offwhite">
              {l.label}
            </Link>
          ))}
          <div className="mt-3 space-y-2 border-t border-white/10 px-3 pt-3 text-sm text-muted">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-orange" />{data.address}</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-orange" />{data.hours}</p>
            <div className="flex gap-4 pt-1">
              {data.telegram && <a href={data.telegram} target="_blank" rel="noopener noreferrer" className="text-offwhite">Telegram</a>}
              {data.max && <a href={data.max} target="_blank" rel="noopener noreferrer" className="text-offwhite">MAX</a>}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
