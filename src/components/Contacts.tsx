import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { site } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

export default function Contacts() {
  return (
    <section id="contacts" className="bg-light py-16 text-graphite-deep sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Контакты"
          title="Как нас найти"
          description="Заезд со стороны Заводской улицы, парковка перед боксом. Позвоните заранее, если приезжаете впервые."
        />

        <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 sm:space-y-4">
            <FadeIn className="flex items-start gap-4 rounded-2xl border border-graphite/10 bg-offwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-dark/30 hover:shadow-lg">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-dark" />
              <div>
                <p className="font-semibold">{site.address}</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue underline underline-offset-2"
                >
                  Открыть на карте
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.05} className="flex items-start gap-4 rounded-2xl border border-graphite/10 bg-offwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-dark/30 hover:shadow-lg">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange-dark" />
              <div>
                <p className="font-semibold">Режим работы</p>
                <p className="text-sm text-steel">{site.hours}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="flex items-start gap-4 rounded-2xl border border-graphite/10 bg-offwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-dark/30 hover:shadow-lg">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange-dark" />
              <div>
                <p className="font-semibold">Телефон администратора</p>
                <a href={`tel:${site.phoneHref}`} className="text-sm text-blue">
                  {site.phone}
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="flex gap-3">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-graphite-deep px-4 py-3 text-sm font-semibold text-offwhite transition-all duration-300 hover:-translate-y-0.5 hover:bg-graphite active:translate-y-0"
              >
                <MessageCircle className="h-4 w-4 text-orange" />
                WhatsApp
              </a>
              <a
                href={site.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-graphite-deep px-4 py-3 text-sm font-semibold text-offwhite transition-all duration-300 hover:-translate-y-0.5 hover:bg-graphite active:translate-y-0"
              >
                <Send className="h-4 w-4 text-blue" />
                Telegram
              </a>
            </FadeIn>
          </div>

          <FadeIn delay={0.1} className="relative min-h-[240px] overflow-hidden rounded-2xl border border-graphite/10 bg-graphite-deep sm:min-h-[320px]">
            <div className="absolute inset-0 bg-diagonal-grid opacity-70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-graphite-deep shadow-glow">
                <MapPin className="h-7 w-7" />
              </div>
              <p className="font-display text-base font-semibold text-offwhite sm:text-lg">
                {site.city}, ул. Заводская, 12А
              </p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-offwhite transition-colors duration-200 hover:bg-white/10"
              >
                Построить маршрут
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
