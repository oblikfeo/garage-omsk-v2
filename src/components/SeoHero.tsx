import Link from "next/link";
import { CalendarCheck, MapPin } from "lucide-react";
import { site } from "@/lib/data";

export default function SeoHero({
  eyebrow,
  h1,
  intro,
  bullets,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  bullets: string[];
}) {
  return (
    <section className="relative overflow-hidden bg-diagonal-grid">
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-orange/10 blur-3xl" />
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange">
          {eyebrow}
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-offwhite sm:text-5xl">
          {h1}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          {intro}
        </p>

        <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
          {bullets.map((b) => (
            <li
              key={b}
              className="rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs text-muted"
            >
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/#booking"
            className="flex items-center justify-center gap-2 rounded-xl bg-orange px-7 py-4 text-base font-semibold text-graphite-deep shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarCheck className="h-5 w-5" />
            Записаться онлайн
          </Link>
          <a
            href={`tel:${site.phoneHref}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-4 text-base font-semibold text-offwhite transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Позвонить: {site.phone}
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
          <MapPin className="h-4 w-4 shrink-0 text-orange" />
          {site.address}
        </div>
      </div>
    </section>
  );
}
