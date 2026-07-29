import clsx from "clsx";

type Variant = "panel" | "deep" | "light";
type Pattern = "blueprint" | "perf" | "hatch" | "tread" | "none";

const backgrounds: Record<Variant, string> = {
  panel: "panel-graphite",
  deep: "panel-deep",
  light: "bg-light text-graphite-deep",
};

const patterns: Record<Pattern, string> = {
  blueprint: "bg-blueprint",
  perf: "bg-perf",
  hatch: "bg-hatch",
  tread: "bg-tread",
  none: "",
};

const lightPatterns: Partial<Record<Pattern, string>> = {
  blueprint: "bg-blueprint-light",
  perf: "bg-perf-light",
};

export default function Section({
  id,
  variant = "panel",
  pattern = "blueprint",
  band = false,
  frame = false,
  watermark,
  spotlight = true,
  grain = true,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  variant?: Variant;
  pattern?: Pattern;
  band?: boolean;
  frame?: boolean;
  watermark?: string;
  spotlight?: boolean;
  grain?: boolean;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  const isLight = variant === "light";
  const patternClass = isLight
    ? lightPatterns[pattern] ?? ""
    : patterns[pattern];

  return (
    <section
      id={id}
      className={clsx(
        "relative overflow-hidden py-16 sm:py-20",
        backgrounds[variant],
        className
      )}
    >
      {patternClass && (
        <span
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-0 [mask-image:radial-gradient(130%_100%_at_50%_0%,#000_0%,transparent_78%)]",
            patternClass
          )}
        />
      )}

      {spotlight && !isLight && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-spotlight"
        />
      )}

      {grain && !isLight && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-noise opacity-[0.06]"
        />
      )}

      {band ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[5px] bg-hazard opacity-70"
        />
      ) : (
        <span
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-x-0 top-0 h-px",
            isLight ? "bg-hairline-dark" : "bg-hairline"
          )}
        />
      )}

      {watermark && (
        <span
          aria-hidden
          className={clsx(
            "pointer-events-none absolute -top-4 right-4 select-none font-display text-[9rem] font-bold leading-none sm:right-10 sm:text-[13rem]",
            isLight ? "text-graphite/[0.05]" : "text-white/[0.035]"
          )}
        >
          {watermark}
        </span>
      )}

      <div
        className={clsx(
          "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          containerClassName
        )}
      >
        {frame && (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-0 h-7 w-7 border-l-2 border-t-2 border-orange/45 sm:left-6 lg:left-8"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-0 h-7 w-7 border-r-2 border-t-2 border-orange/45 sm:right-6 lg:right-8"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-4 h-7 w-7 border-b-2 border-l-2 border-orange/45 sm:left-6 lg:left-8"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-4 h-7 w-7 border-b-2 border-r-2 border-orange/45 sm:right-6 lg:right-8"
            />
          </>
        )}
        {children}
      </div>
    </section>
  );
}
