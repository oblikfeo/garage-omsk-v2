import FadeIn from "./FadeIn";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  light,
  center,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <FadeIn className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          light ? "text-orange-dark" : "text-orange"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl ${
          light ? "text-graphite-deep" : "text-offwhite"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-steel" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
    </FadeIn>
  );
}
