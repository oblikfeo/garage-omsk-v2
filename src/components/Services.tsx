import {
  ArrowUpDown,
  CircleDot,
  Droplets,
  MessageCircle,
  Wrench,
  Check,
  Wind,
} from "lucide-react";
import { addonServices, services } from "@/lib/data";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

const icons = {
  post: Wrench,
  lift2: ArrowUpDown,
  liftX: ArrowUpDown,
  tire: CircleDot,
};

const addonIcons = [Wrench, Wind, Droplets, MessageCircle];

export default function Services() {
  return (
    <Section id="services" pattern="perf">
      <SectionHeading
        eyebrow="Услуги"
        title="Аренда постов, подъёмников и оборудования"
        description="Выбирайте рабочее место под задачу — от простой ямы до шиномонтажного станка. Всё оборудование обслуживается и проверяется ежедневно."
      />

      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {services.map((service, i) => {
          const Icon = icons[service.id];
          return (
            <FadeIn
              key={service.id}
              delay={i * 0.08}
              className="card-metal group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-xl hover:shadow-black/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-orange transition-all duration-300 group-hover:scale-110 group-hover:bg-orange group-hover:text-graphite-deep">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-offwhite">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue" />
                    {b}
                  </li>
                ))}
              </ul>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2} className="mt-8 sm:mt-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <h3 className="shrink-0 font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Дополнительные услуги
          </h3>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {addonServices.map((addon, i) => {
            const Icon = addonIcons[i % addonIcons.length];
            return (
              <div
                key={addon}
                className="card-metal group flex items-start gap-3.5 rounded-2xl border border-white/10 bg-surface/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue/35 hover:bg-surface"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue transition-colors duration-300 group-hover:bg-blue group-hover:text-offwhite">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <p className="pt-1.5 text-sm leading-snug text-muted transition-colors duration-200 group-hover:text-offwhite">
                  {addon}
                </p>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </Section>
  );
}
