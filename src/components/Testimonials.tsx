import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

export default function Testimonials() {
  return (
    <Section pattern="perf" watermark="5,0">
      <SectionHeading eyebrow="Отзывы" title="Что говорят клиенты" center />

      <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
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
    </Section>
  );
}
