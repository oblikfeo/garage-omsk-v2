import { AlertTriangle, Camera, ShieldCheck, UserCheck } from "lucide-react";
import { safetyRules } from "@/lib/data";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

const icons = [UserCheck, Camera, ShieldCheck, AlertTriangle];

export default function Safety() {
  return (
    <Section id="safety" variant="deep" pattern="tread">
      <SectionHeading
        eyebrow="Безопасность"
        title="Порядок и ответственность на каждом посту"
        description="Индустриальная площадка — это прежде всего дисциплина. Мы следим за оборудованием, вы отвечаете за аккуратную работу."
      />

      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
        {safetyRules.map((rule, i) => {
          const Icon = icons[i % icons.length];
          return (
            <FadeIn
              key={rule.title}
              delay={i * 0.08}
              className="card-metal group flex gap-4 rounded-2xl border border-white/10 bg-graphite p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue/30 sm:p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue transition-all duration-300 group-hover:scale-110 group-hover:bg-blue group-hover:text-offwhite">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-offwhite">
                  {rule.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {rule.text}
                </p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </Section>
  );
}
