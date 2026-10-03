import { ArrowRight, Check } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";
import { QuoteLink } from "@/components/ui/QuoteLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/button";
import { PRODUCTS, PRODUCTS_SECTION } from "@/lib/content";

export function Products() {
  return (
    <section id="productos" aria-labelledby="productos-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="productos-title" {...PRODUCTS_SECTION} />

        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <Reveal as="li" key={product.title} delay={(i % 2) * 0.08}>
              <article className="group flex h-full flex-col rounded-2xl border border-brand-navy/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-8">
                {/* FOTO: aquí se puede agregar una imagen real del producto sobre el ícono */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <IconBadge icon={product.icon} tone="navy" size="lg" />
                  <div>
                    <h3 className="font-sans text-xl font-semibold tracking-normal">{product.title}</h3>
                    <p className="mt-1 text-muted">{product.description}</p>
                  </div>
                </div>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {product.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ink">
                      <Check className="h-4 w-4 shrink-0 text-brand-orange-dark" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <QuoteLink
                    preset={{
                      service: product.quoteService,
                      category: product.quoteCategory,
                      message: product.quoteMessage,
                    }}
                    className={buttonStyles({ className: "group/btn" })}
                    aria-label={`Cotizar ${product.title}`}
                  >
                    Cotizar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                  </QuoteLink>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
