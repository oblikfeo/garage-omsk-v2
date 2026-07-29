"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faq as defaultFaq } from "@/lib/data";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import FadeIn from "./FadeIn";

type FaqItem = { q: string; a: string };

export default function Faq({
  items = defaultFaq,
  id = "faq",
  title = "Частые вопросы",
}: {
  items?: FaqItem[];
  id?: string;
  title?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id={id} pattern="blueprint" containerClassName="max-w-3xl">
      <SectionHeading eyebrow="FAQ" title={title} center />

      <FadeIn
        delay={0.1}
        className="card-metal mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface sm:mt-10"
      >
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/5 sm:px-6 sm:py-5"
                aria-expanded={isOpen}
              >
                <span className="font-display text-sm font-semibold text-offwhite sm:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-orange transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted sm:px-6 sm:pb-5">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </FadeIn>
    </Section>
  );
}
