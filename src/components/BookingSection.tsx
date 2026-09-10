import { ExternalLink } from "lucide-react";
import { getContent } from "@/lib/content";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

export default async function BookingSection() {
  const { site, sections, texts } = await getContent();

  return (
    <Section
      id="booking"
      variant="deep"
      pattern="hatch"
      band
      containerClassName="max-w-5xl"
    >
      <SectionHeading {...sections.booking} center />

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
          {texts.bookingFallback}{" "}
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
