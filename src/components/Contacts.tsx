import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { getContent } from "@/lib/content";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

export default async function Contacts() {
  const { site } = await getContent();

  return (
    <Section id="contacts" variant="light" pattern="perf">
      <SectionHeading
        light
        eyebrow="Контакты"
        title="Как нас найти"
        description="Заезд со стороны Заводской улицы, парковка перед боксом. Позвоните заранее, если приезжаете впервые."
      />

      <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 sm:space-y-4">
            <FadeIn className="card-paper flex items-start gap-4 rounded-2xl border border-graphite/10 bg-offwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-dark/30 hover:shadow-lg">
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

            <FadeIn delay={0.05} className="card-paper flex items-start gap-4 rounded-2xl border border-graphite/10 bg-offwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-dark/30 hover:shadow-lg">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange-dark" />
              <div>
                <p className="font-semibold">Режим работы</p>
                <p className="text-sm text-steel">{site.hours}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="card-paper flex items-start gap-4 rounded-2xl border border-graphite/10 bg-offwhite p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-dark/30 hover:shadow-lg">
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
                href={site.max}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-graphite-deep px-4 py-3 text-sm font-semibold text-offwhite transition-all duration-300 hover:-translate-y-0.5 hover:bg-graphite active:translate-y-0"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-orange" />
                MAX
              </a>
              <a
                href={site.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-graphite-deep px-4 py-3 text-sm font-semibold text-offwhite transition-all duration-300 hover:-translate-y-0.5 hover:bg-graphite active:translate-y-0"
              >
                <Send className="h-4 w-4 shrink-0 text-blue" />
                Telegram
              </a>
            </FadeIn>
          </div>

          <FadeIn delay={0.1} className="panel-deep relative min-h-[240px] overflow-hidden rounded-2xl border border-graphite/10 sm:min-h-[320px]">
            <div className="absolute inset-0 bg-blueprint" />
            <div className="absolute inset-0 bg-spotlight" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-graphite-deep shadow-glow">
                <MapPin className="h-7 w-7" />
              </div>
              <p className="font-display text-base font-semibold text-offwhite sm:text-lg">
                {site.address}
              </p>
              <a
                href={site.mapsRouteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-offwhite transition-colors duration-200 hover:bg-white/10"
              >
                Построить маршрут
              </a>
            </div>
          </FadeIn>
        </div>
    </Section>
  );
}
