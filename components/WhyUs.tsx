import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_US, WHY_US_SECTION } from "@/lib/content";

export function WhyUs() {
  return (
    <section aria-labelledby="por-que-title" className="bg-brand-ice py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="por-que-title" {...WHY_US_SECTION} />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {WHY_US.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl bg-white p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <IconBadge icon={item.icon} className="mx-auto" />
                <h3 className="mt-5 font-sans text-lg font-semibold tracking-normal">{item.title}</h3>
                <p className="mt-2 text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
