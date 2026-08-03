interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className = "",
}: SectionHeadingProps) {
  const alignClasses = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClasses} max-w-2xl ${className}`}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold uppercase tracking-[0.3em] ${
            light ? "text-gold" : "text-bordeaux"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-balance ${
          light ? "text-cream" : "text-plum-dark"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-sm sm:text-base ${light ? "text-cream/70" : "text-plum/70"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
