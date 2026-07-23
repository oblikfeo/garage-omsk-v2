import { ArrowUpDown, CircleDot, PlusCircle, Wrench, Check } from "lucide-react";
import { addonServices, services } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

const icons = {
  post: Wrench,
  lift2: ArrowUpDown,
  liftX: ArrowUpDown,
  tire: CircleDot,
};

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
              className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-xl hover:shadow-black/20"
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

      <FadeIn
        delay={0.2}
        className="mt-6 flex flex-col gap-5 rounded-2xl border border-white/10 bg-surface p-6 transition-colors duration-300 hover:border-blue/30 sm:flex-row sm:items-center"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
          <PlusCircle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-semibold text-offwhite">
            Дополнительные услуги
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {addonServices.map((a) => (
              <span
                key={a}
                className="rounded-full border border-white/10 bg-graphite px-3.5 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-blue/30 hover:text-offwhite"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
