import { ArrowRight, Check } from "lucide-react";
import { QuoteLink } from "@/components/ui/QuoteLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/button";
import { LINES, LINES_SECTION } from "@/lib/content";

/** Sección "Domiciliario vs. Vehicular": lado azul (hogar) y lado naranjo (vehículos). */
export function ServiceLines() {
  const lines = [
    { ...LINES.home, panel: "bg-brand-navy", iconBox: "bg-white/10", check: "text-brand-orange-light" },
    { ...LINES.vehicle, panel: "bg-brand-orange-dark", iconBox: "bg-white/15", check: "text-white" },
  ];

  return (
    <section aria-labelledby="lineas-title" className="bg-white/55 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="lineas-title" {...LINES_SECTION} />

        <div className="mt-14 grid overflow-hidden rounded-[2rem] shadow-lift lg:grid-cols-2">
          {lines.map(({ icon: Icon, title, description, items, cta, panel, iconBox, check }, i) => (
            <Reveal key={title} delay={i * 0.1} className={`${panel} relative p-8 text-white sm:p-12`}>
              {/* FOTO: se puede agregar de fondo una foto (hogar / vehículo) con overlay del mismo color */}
              <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBox}`}>
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-3xl font-semibold uppercase text-white sm:text-4xl">{title}</h3>
              <p className="mt-3 max-w-md text-white/85">{description}</p>

              <ul className="mt-8 space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className={`mt-0.5 h-5 w-5 shrink-0 ${check}`} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <QuoteLink
                preset={{ category: cta.category }}
                className={buttonStyles({ variant: "light", className: "group mt-10" })}
              >
                {cta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </QuoteLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
