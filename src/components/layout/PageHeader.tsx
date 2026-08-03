import { Container } from "@/components/ui/Container";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-gold/10 bg-plum-dark py-16">
      <Container className="flex flex-col items-center gap-3 text-center">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {eyebrow}
          </span>
        )}
        <h1 className="font-serif text-3xl font-semibold text-cream sm:text-5xl">{title}</h1>
        {description && (
          <p className="max-w-2xl text-sm text-cream/60 sm:text-base">{description}</p>
        )}
      </Container>
    </div>
  );
}
