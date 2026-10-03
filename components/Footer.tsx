import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { EmailText } from "@/components/ui/EmailText";
import { FOOTER, NAV_LINKS } from "@/lib/content";
import { SITE, phoneHref, whatsappUrl } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy-dark text-white/80">
      <div aria-hidden="true" className="bg-cold-warm h-1" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:px-8">
        <div>
          <a href="#inicio" className="inline-flex items-center gap-3">
            <Image src="/logo.png" alt="" width={536} height={465} className="h-16 w-16 rounded-full bg-white object-contain p-1" />
            <span className="font-display text-2xl font-semibold uppercase tracking-wide text-white">
              {SITE.name}
            </span>
          </a>
          <p className="mt-4 max-w-sm leading-relaxed">{FOOTER.description}</p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white">Enlaces</h2>
          <ul className="mt-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-block py-1.5 transition-colors hover:text-brand-orange-light">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white">Contacto</h2>
          <ul className="mt-3 space-y-1.5">
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 py-1 transition-colors hover:text-brand-orange-light">
                <Mail className="h-5 w-5 shrink-0 text-brand-orange-light" aria-hidden="true" />
                <span className="min-w-0">
                  <EmailText email={SITE.email} />
                </span>
              </a>
            </li>
            {SITE.phones.map((phone) => (
              <li key={phone}>
                <a href={phoneHref(phone)} className="flex items-center gap-3 py-1 transition-colors hover:text-brand-orange-light">
                  <Phone className="h-5 w-5 shrink-0 text-brand-orange-light" aria-hidden="true" />
                  {phone}
                </a>
              </li>
            ))}
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-1 transition-colors hover:text-brand-orange-light"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-brand-orange-light" />
                WhatsApp {SITE.phones[0]}
              </a>
            </li>
            <li className="flex items-center gap-3 py-1">
              <MapPin className="h-5 w-5 shrink-0 text-brand-orange-light" aria-hidden="true" />
              {SITE.serviceArea}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-white/60 sm:px-6 lg:px-8">
          © {year} {SITE.legalName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
