"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { steps } from "@/lib/data";
import SectionHeading from "./SectionHeading";

const TRAVEL_DURATION = 9;
const PAUSE_AT_END = 0.9;

function StepTile({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const stepPct = (index / (total - 1)) * 100;
  const reached = useTransform(progress, [Math.max(0, stepPct - 3), stepPct], [0, 1], {
    clamp: true,
  });

  const circleBg = useTransform(reached, [0, 1], ["#1F2328", "#FF6A00"]);
  const circleBorder = useTransform(reached, [0, 1], ["rgba(255,255,255,0.15)", "#FF6A00"]);
  const circleColor = useTransform(reached, [0, 1], ["#B8C0C7", "#16191C"]);
  const circleScale = useTransform(reached, [0, 1], [1, 1.1]);

  const cardBg = useTransform(reached, [0, 1], ["#262b31", "#332619"]);
  const cardBorder = useTransform(reached, [0, 1], ["rgba(255,255,255,0.1)", "rgba(255,106,0,0.55)"]);
  const cardShadow = useTransform(
    reached,
    [0, 1],
    ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 1px rgba(255,106,0,0.22), 0 0 30px 4px rgba(255,106,0,0.22)"]
  );
  const numberColor = useTransform(reached, [0, 1], ["rgba(255,255,255,0.1)", "rgba(255,106,0,0.45)"]);

  return (
    <li className="relative flex gap-4 lg:flex-1 lg:flex-col lg:items-center lg:gap-3 lg:text-center">
      <motion.span
        style={{
          backgroundColor: circleBg,
          borderColor: circleBorder,
          color: circleColor,
          scale: circleScale,
        }}
        className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold"
      >
        {index + 1}
      </motion.span>

      <motion.div
        style={{ backgroundColor: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
        className="z-10 h-full flex-1 rounded-2xl border p-5"
      >
        <motion.span
          style={{ color: numberColor }}
          className="font-display text-3xl font-bold"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        <h3 className="mt-2 font-display text-base font-semibold text-offwhite">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
      </motion.div>
    </li>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, 100, {
      duration: TRAVEL_DURATION,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: PAUSE_AT_END,
    });
    return () => controls.stop();
  }, [inView, progress]);

  const dotLeft = useTransform(progress, (v) => `${v}%`);

  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Как это работает"
        title="От онлайн-записи до завершения работ"
        description="Пять простых шагов — без очередей и лишних формальностей."
        center
      />

      <div ref={sectionRef} className="relative mt-14 sm:mt-16">
        {/* static track */}
        <div className="pointer-events-none absolute left-[21px] top-2 bottom-2 w-px bg-white/10 lg:left-6 lg:right-6 lg:top-6 lg:bottom-auto lg:h-px lg:w-auto" />

        {/* animated trail + glowing dot — rendered behind the tiles (no elevated z-index, DOM order keeps it under the <ol>) */}
        <div className="pointer-events-none absolute left-[21px] top-2 bottom-2 w-px lg:left-6 lg:right-6 lg:top-6 lg:bottom-auto lg:h-px lg:w-auto">
          <motion.div
            className="absolute inset-0 origin-top bg-gradient-to-b from-orange/15 to-orange lg:origin-left lg:bg-gradient-to-r"
            style={{ scaleY: useTransform(progress, (v) => v / 100), scaleX: useTransform(progress, (v) => v / 100) }}
          />
          <motion.div
            className="absolute"
            style={{ left: dotLeft, top: dotLeft, translateX: "-50%", translateY: "-50%" }}
          >
            <motion.span
              className="block h-3.5 w-3.5 rounded-full bg-orange"
              animate={{
                scale: [1, 1.35, 1],
                boxShadow: [
                  "0 0 10px 2px rgba(255,106,0,0.55)",
                  "0 0 20px 6px rgba(255,106,0,0.75)",
                  "0 0 10px 2px rgba(255,106,0,0.55)",
                ],
              }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        <ol className="relative flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-4">
          {steps.map((step, i) => (
            <StepTile key={step.title} step={step} index={i} total={steps.length} progress={progress} />
          ))}
        </ol>
      </div>
    </section>
  );
}
