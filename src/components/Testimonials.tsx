import { ExternalLink, Star } from "lucide-react";
import { getContent } from "@/lib/content";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";
import { TWO_GIS_REVIEWS_URL, TwoGisReviews } from "./TwoGisRating";

export default async function Testimonials() {
  const { testimonials, sections } = await getContent();

  return (
    <Section pattern="perf" watermark="5,0">
      <SectionHeading {...sections.testimonials} center />

      <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-[1fr_minmax(0,500px)] lg:items-stretch">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-1">
          {testimonials.map((t, i) => (
            <FadeIn
              key={t.name}
              delay={i * 0.1}
              className="card-metal flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-xl hover:shadow-black/30"
            >
              <div className="flex gap-1 text-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                «{t.text}»
              </blockquote>
              <figcaption className="mt-5 border-t border-white/10 pt-4 text-sm">
                <span className="font-semibold text-offwhite">{t.name}</span>
                <span className="text-muted"> · {t.car}</span>
              </figcaption>
            </FadeIn>
          ))}
        </div>

        <FadeIn
          delay={0.15}
          className="card-metal flex flex-col rounded-2xl border border-white/10 bg-surface p-5 sm:p-6"
        >
          {/* Fixed height on phones; on desktop it stretches to the cards column. */}
          <div className="relative h-[620px] lg:h-auto lg:min-h-[560px] lg:flex-1">
            <TwoGisReviews className="absolute inset-0 h-full" />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface to-transparent"
            />
          </div>
          <a
            href={TWO_GIS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-offwhite transition-all duration-300 hover:border-orange/50 hover:text-orange"
          >
            Все отзывы и оставить свой в 2ГИС
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
        </FadeIn>
      </div>
    </Section>
  );
}
