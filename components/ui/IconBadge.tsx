import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  tone?: "orange" | "navy" | "ice" | "white";
  size?: "md" | "lg";
  className?: string;
};

const tones = {
  orange: "bg-brand-orange/10 text-brand-orange-dark group-hover:bg-brand-orange group-hover:text-white",
  navy: "bg-brand-ice text-brand-navy group-hover:bg-brand-navy group-hover:text-white",
  ice: "bg-white/10 text-white",
  white: "bg-white text-brand-navy",
};

const sizes = {
  md: "h-12 w-12 rounded-xl [&>svg]:h-6 [&>svg]:w-6",
  lg: "h-14 w-14 rounded-2xl [&>svg]:h-7 [&>svg]:w-7",
};

/** Ícono con fondo de color. Se anima cuando el contenedor padre tiene la clase `group`. */
export function IconBadge({ icon: Icon, tone = "orange", size = "md", className = "" }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center transition-colors duration-300 ${tones[tone]} ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      <Icon strokeWidth={1.75} />
    </span>
  );
}
