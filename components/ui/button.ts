// Estilos de botón reutilizables (para <a>, <button> o <Link>).

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-orange-dark text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-orange hover:shadow-lift active:translate-y-0",
  secondary:
    "border border-brand-navy/15 bg-white text-brand-navy shadow-soft hover:-translate-y-0.5 hover:border-brand-navy/30 hover:shadow-lift",
  ghost: "text-brand-navy hover:bg-brand-navy/5",
  light: "bg-white text-brand-navy shadow-soft hover:-translate-y-0.5 hover:bg-brand-cream hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}
