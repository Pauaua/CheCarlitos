import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES, SERVICES_SECTION } from "@/lib/content";

export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="bg-white/55 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="servicios-title" {...SERVICES_SECTION} />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal as="li" key={service.title} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-brand-navy/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/30 hover:shadow-lift">
                <IconBadge icon={service.icon} />
                <h3 className="mt-5 font-sans text-lg font-semibold tracking-normal">{service.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
