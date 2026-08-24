import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { site } from "@/lib/data";

const seoLinks = [
  { href: "/sto-samoobsluzhivaniya-omsk", label: "СТО самообслуживания в Омске" },
  { href: "/garazh-na-chas-omsk", label: "Гараж на час в Омске" },
  { href: "/arenda-podyomnika-omsk", label: "Аренда подъёмника в Омске" },
];

export default function Footer() {
  return (
    <footer className="panel-deep relative overflow-hidden border-t border-white/10">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-perf [mask-image:radial-gradient(120%_100%_at_50%_0%,#000_0%,transparent_75%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-spotlight"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.svg"
              alt={`${site.fullName} — логотип`}
              width={200}
              height={42}
              className="h-9 w-auto"
              unoptimized
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Почасовая и посуточная аренда постов, подъёмников и шиномонтажного
            оборудования в {site.city}. Ремонтируйте автомобиль сами — быстро,
            безопасно и по понятным ценам.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.max}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-orange/40 hover:text-orange"
              aria-label="Написать в MAX"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
            </a>
            <a
              href={site.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-blue/50 hover:text-blue"
              aria-label="Написать в Telegram"
            >
              <Send className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-offwhite">
            Контакты
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-offwhite">
                {site.address}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-orange" />
              <a href={`tel:${site.phoneHref}`} className="transition-colors duration-200 hover:text-offwhite">
                {site.phone}
              </a>
            </li>
            <li className="pl-[26px] text-muted/80">{site.hours}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-offwhite">
            Разделы
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {seoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors duration-200 hover:text-offwhite">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/politika-konfidentsialnosti" className="transition-colors duration-200 hover:text-offwhite">
                Обработка персональных данных
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.fullName}, {site.city}. Все права защищены.</p>
          <p>Сайт не является публичной офертой.</p>
        </div>
      </div>
    </footer>
  );
}
