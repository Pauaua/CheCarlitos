import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
};

export function SectionHeading({ eyebrow, title, subtitle, id, align = "center", tone = "dark" }: Props) {
  const isCenter = align === "center";
  const isLight = tone === "light";

  return (
    <Reveal className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}>
      <p
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${
          isLight ? "text-brand-orange-light" : "text-brand-orange-dark"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-3 text-3xl font-semibold uppercase sm:text-4xl lg:text-5xl ${
          isLight ? "text-white" : ""
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg ${isLight ? "text-white/80" : "text-muted"}`}>{subtitle}</p>
      )}
    </Reveal>
  );
}
