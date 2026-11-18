import Link from "next/link";
import { getSeoContent } from "@/lib/seo/content";

/** 404 for any unknown address: status 404, links to services, prices and booking. */
export default function NotFound() {
  const { site } = getSeoContent();
  return (
    <main className="flex flex-1 items-center bg-graphite">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-7xl font-bold text-orange">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-offwhite">Такой страницы нет</h1>
        <p className="mt-3 text-muted">Возможно, адрес изменился. Вот куда можно перейти:</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link href="/uslugi" className="rounded-xl border border-white/15 px-5 py-3 text-offwhite hover:bg-white/5">
            Услуги
          </Link>
          <Link href="/ceny" className="rounded-xl border border-white/15 px-5 py-3 text-offwhite hover:bg-white/5">
            Цены
          </Link>
          <a href={site.booking_url} target="_blank" rel="noopener noreferrer" data-goal="open_booking" className="rounded-xl bg-orange px-5 py-3 text-graphite-deep">
            Записаться онлайн
          </a>
          <Link href="/" className="rounded-xl border border-white/15 px-5 py-3 text-offwhite hover:bg-white/5">
            На главную
          </Link>
        </nav>
      </div>
    </main>
  );
}
