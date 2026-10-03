import { ArrowRight, Building2 } from "lucide-react";
import { QuoteLink } from "@/components/ui/QuoteLink";
import { Reveal } from "@/components/ui/Reveal";
import { buttonStyles } from "@/components/ui/button";
import { BUSINESS } from "@/lib/content";

export function Business() {
  return (
    <section id="empresas" aria-labelledby="empresas-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-brand-navy-dark px-6 py-14 text-white shadow-lift sm:px-12 lg:px-16 lg:py-20">
          {/* Decoración: degradado frío → calor en la esquina */}
          <div aria-hidden="true" className="bg-cold-warm absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl" />
          <Building2 aria-hidden="true" className="absolute -bottom-10 -right-6 h-64 w-64 text-white/5" strokeWidth={1} />

          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange-light">
                {BUSINESS.eyebrow}
              </p>
              <h2 id="empresas-title" className="mt-3 text-3xl font-semibold uppercase text-white sm:text-4xl lg:text-5xl">
                {BUSINESS.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg text-white/80">{BUSINESS.description}</p>
              <QuoteLink
                preset={{ clientType: "empresa" }}
                className={buttonStyles({ size: "lg", className: "group mt-8" })}
              >
                {BUSINESS.cta.label}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </QuoteLink>
            </div>

            <ul className="grid gap-4">
              {BUSINESS.items.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange-dark text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-lg font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
