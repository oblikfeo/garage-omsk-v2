import { ExternalLink } from "lucide-react";
import { site } from "@/lib/data";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

export default function BookingSection() {
  return (
    <Section
      id="booking"
      variant="deep"
      pattern="hatch"
      band
      containerClassName="max-w-5xl"
    >
      <SectionHeading
        eyebrow="Онлайн-запись"
        title="Забронируйте пост за 2 минуты"
        description="Выберите услугу, дату и время прямо на сайте — запись сразу попадает в систему."
        center
      />

      <FadeIn delay={0.1} className="mt-8 sm:mt-10">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-xl shadow-black/20">
          <iframe
            src={site.yclientsUrl}
            title="Онлайн-запись YCLIENTS"
            className="h-[720px] w-full border-0 sm:h-[820px]"
            loading="lazy"
            allow="payment *"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          Если виджет не загрузился,{" "}
          <a
            href={site.yclientsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-orange underline-offset-2 hover:underline"
          >
            откройте запись в новой вкладке
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>
      </FadeIn>
    </Section>
  );
}
