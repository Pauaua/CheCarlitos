import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_SECTION, PROCESS_STEPS } from "@/lib/content";

export function Process() {
  return (
    <section aria-labelledby="proceso-title" className="bg-white/55 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="proceso-title" {...PROCESS_SECTION} />

        <div className="relative mt-16">
          {/* Línea frío → calor que une los pasos (solo escritorio) */}
          <div
            aria-hidden="true"
            className="bg-cold-warm absolute left-[16.66%] right-[16.66%] top-8 hidden h-1 rounded-full md:block"
          />

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {PROCESS_STEPS.map(({ icon: Icon, title, description }, i) => (
              <Reveal as="li" key={title} delay={i * 0.12} className="text-center">
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand-navy text-white shadow-lift">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange-dark text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-6 text-2xl font-semibold uppercase">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-muted">{description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
