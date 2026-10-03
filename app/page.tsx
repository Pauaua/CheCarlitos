import { Business } from "@/components/Business";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Products } from "@/components/Products";
import { QuoteForm } from "@/components/QuoteForm";
import { ServiceLines } from "@/components/ServiceLines";
import { Services } from "@/components/Services";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WhyUs } from "@/components/WhyUs";
import { SITE } from "@/lib/site";

// Datos estructurados para buscadores (negocio local)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phones,
  areaServed: SITE.serviceArea,
  description:
    "Aire acondicionado domiciliario y vehicular: venta, instalación, mantención, reparación, carga de gas y repuestos de calefacción automotriz.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="contenido">
        <Hero />
        <Services />
        <Products />
        <ServiceLines />
        <Business />
        <WhyUs />
        <Process />
        <QuoteForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
