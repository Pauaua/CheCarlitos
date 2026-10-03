import { ArrowRight, Flame, Snowflake } from "lucide-react";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { Reveal } from "@/components/ui/Reveal";
import { buttonStyles } from "@/components/ui/button";
import { HERO } from "@/lib/content";

export function Hero() {
  return (
    <section id="inicio" tabIndex={-1} aria-labelledby="hero-title" className="relative overflow-hidden outline-none pt-32 pb-20 sm:pt-40 lg:pb-28">
      {/* Fondo decorativo: halo frío (azul) a la izquierda y cálido (naranjo) a la derecha */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand-ice blur-3xl" />
        <div className="absolute -right-32 top-40 h-[24rem] w-[24rem] rounded-full bg-brand-orange-light/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white px-4 py-1.5 text-sm font-medium text-brand-navy shadow-soft">
            <Snowflake className="h-4 w-4 text-brand-navy" aria-hidden="true" />
            {HERO.eyebrow}
            <Flame className="h-4 w-4 text-brand-orange-dark" aria-hidden="true" />
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[2.75rem] font-semibold uppercase leading-[1.05] sm:text-6xl xl:text-7xl"
          >
            {HERO.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{HERO.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={HERO.primaryCta.href} className={buttonStyles({ size: "lg", className: "group" })}>
              {HERO.primaryCta.label}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={HERO.secondaryCta.href} className={buttonStyles({ variant: "secondary", size: "lg" })}>
              {HERO.secondaryCta.label}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3" aria-label="Lo que ofrecemos">
            {HERO.badges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-brand-navy">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange-dark">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Visual del hero: marco con degradado frío → calor, imágenes que van cambiando
 * (HeroSlideshow) y dos tarjetas flotantes fijas.
 * FOTO: las imágenes se cambian en lib/content.ts → HERO.slides.
 */
function HeroVisual() {
  return (
    <div className="relative mx-auto mb-12 aspect-[4/5] w-full max-w-md sm:aspect-square lg:max-w-none">
      <div className="bg-cold-warm absolute inset-0 rounded-[2.5rem] shadow-lift" />

      {/* Patrón sutil de líneas de aire */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full rounded-[2.5rem] opacity-20" viewBox="0 0 400 400" preserveAspectRatio="none">
        {[80, 140, 200, 260, 320].map((y) => (
          <path key={y} d={`M-20 ${y} C 80 ${y - 30}, 160 ${y + 30}, 260 ${y} S 420 ${y - 20}, 440 ${y}`} fill="none" stroke="white" strokeWidth="1.5" />
        ))}
      </svg>

      {/* Imágenes que van cambiando */}
      <HeroSlideshow />

      {/* Tarjetas flotantes */}
      <div className="absolute left-4 top-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift sm:left-6 sm:top-8">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-ice text-brand-navy">
          <Snowflake className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs text-muted">Aire acondicionado</p>
          <p className="font-semibold text-brand-navy">Frío eficiente</p>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift sm:bottom-8 sm:right-6">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange-dark">
          <Flame className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs text-muted">Calefacción automotriz</p>
          <p className="font-semibold text-brand-navy">Repuestos especializados</p>
        </div>
      </div>
    </div>
  );
}
