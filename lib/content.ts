import {
  AirVent,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Car,
  ClipboardList,
  Droplets,
  Fan,
  Flame,
  House,
  type LucideIcon,
  Package,
  Smile,
  Snowflake,
  Sparkles,
  Stethoscope,
  Truck,
  Wrench,
} from "lucide-react";
import type { CategoryValue, ServiceOption } from "@/lib/quote-schema";

// ─────────────────────────────────────────────────────────────────────────────
// Todos los textos de la página están aquí. Edítalos sin tocar los componentes.
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#productos", label: "Productos" },
  { href: "#empresas", label: "Empresas" },
  { href: "#cotizar", label: "Cotizar" },
] as const;

export const HERO = {
  eyebrow: "Aire acondicionado y calefacción automotriz",
  title: "Clima perfecto en tu casa, tu empresa y tu vehículo",
  subtitle:
    "Venta, instalación, mantención y reparación de aire acondicionado domiciliario y automotriz. Además, repuestos especializados para la calefacción de tu auto.",
  primaryCta: { label: "Cotizar ahora", href: "#cotizar" },
  secondaryCta: { label: "Ver servicios", href: "#servicios" },
  badges: [
    { icon: House, label: "Servicio a domicilio" },
    { icon: Building2, label: "Atención a empresas" },
    { icon: Car, label: "Aire automotriz" },
  ],
};

type Card = { icon: LucideIcon; title: string; description: string };

export const SERVICES_SECTION = {
  eyebrow: "Servicios",
  title: "Todo lo que necesitas para tu climatización",
  subtitle: "Desde la elección del equipo hasta su mantención, con técnicos especializados.",
};

export const SERVICES: Card[] = [
  {
    icon: AirVent,
    title: "Venta de equipos de aire acondicionado",
    description:
      "Te asesoramos para elegir el equipo ideal según el espacio, el uso y tu presupuesto.",
  },
  {
    icon: Wrench,
    title: "Instalación de aire acondicionado",
    description:
      "Instalación profesional, limpia y segura, cumpliendo las recomendaciones del fabricante.",
  },
  {
    icon: CalendarCheck,
    title: "Mantención preventiva",
    description:
      "Limpieza, revisión y ajustes periódicos para que tu equipo rinda más y dure más.",
  },
  {
    icon: Stethoscope,
    title: "Reparación y diagnóstico",
    description:
      "Detectamos la falla y la solucionamos: fugas, ruidos, falta de frío o de calor.",
  },
  {
    icon: Car,
    title: "Aire acondicionado automotriz",
    description:
      "Instalación, mantención y reparación del sistema de aire de autos, camionetas y flotas.",
  },
  {
    icon: House,
    title: "Servicio a domicilio",
    description: "Vamos a tu casa, oficina o empresa. Coordinamos la visita según tu horario.",
  },
];

type Product = Card & {
  /** Opción que queda preseleccionada en el formulario al presionar "Cotizar" */
  quoteService: ServiceOption;
  quoteCategory?: CategoryValue;
  /** Mensaje sugerido que se precarga en el formulario (opcional) */
  quoteMessage?: string;
  items: string[];
};

export const PRODUCTS_SECTION = {
  eyebrow: "Productos",
  title: "Equipos, gas y repuestos especializados",
  subtitle: "Trabajamos con productos de calidad y te ayudamos a elegir lo que realmente necesitas.",
};

export const PRODUCTS: Product[] = [
  {
    icon: AirVent,
    title: "Equipos de aire acondicionado",
    description: "Equipos para el hogar, oficinas y locales comerciales.",
    items: ["Split muro", "Portátiles", "Inverter de alta eficiencia", "Equipos para oficinas"],
    quoteService: "Venta de equipo",
    quoteCategory: "domiciliario",
  },
  {
    icon: Droplets,
    title: "Carga de gas refrigerante",
    description: "Recarga y control de fugas para equipos domiciliarios y vehículos.",
    items: ["Aire domiciliario", "Aire automotriz", "Detección de fugas", "Control de presiones"],
    quoteService: "Carga de gas",
  },
  {
    icon: Flame,
    title: "Repuestos para calefacción automotriz",
    description: "Repuestos especializados para que la calefacción de tu vehículo funcione bien.",
    items: ["Radiadores de calefacción", "Motores de ventilador", "Resistencias", "Válvulas"],
    quoteService: "Repuestos calefacción automotriz",
    quoteCategory: "vehicular",
  },
  {
    icon: Package,
    title: "Repuestos y accesorios de aire acondicionado",
    description: "Componentes y accesorios para mantener tus equipos operativos.",
    items: ["Compresores", "Filtros", "Controles remotos", "Accesorios de instalación"],
    quoteService: "Otro",
    quoteMessage: "Me interesan repuestos o accesorios de aire acondicionado: ",
  },
];

export const LINES_SECTION = {
  eyebrow: "Dos líneas de servicio",
  title: "Frío y calor, en casa y en ruta",
};

export const LINES = {
  home: {
    icon: Snowflake,
    title: "Hogar y empresa",
    description: "Climatización domiciliaria y comercial con instalación y soporte técnico.",
    items: [
      "Venta e instalación de equipos split y portátiles",
      "Mantención preventiva y limpieza",
      "Reparación, diagnóstico y carga de gas",
      "Contratos de mantención para oficinas",
    ],
    cta: { label: "Cotizar para mi hogar", category: "domiciliario" as const },
  },
  vehicle: {
    icon: Flame,
    title: "Vehículos",
    description: "Aire acondicionado y calefacción para autos, camionetas y flotas.",
    items: [
      "Instalación y reparación de aire automotriz",
      "Carga de gas refrigerante automotriz",
      "Repuestos de calefacción: radiadores, motores, resistencias y válvulas",
      "Atención a flotas de vehículos",
    ],
    cta: { label: "Cotizar para mi vehículo", category: "vehicular" as const },
  },
};

export const BUSINESS = {
  eyebrow: "Empresas",
  title: "Servicio disponible para empresas",
  description:
    "Acompañamos a empresas con planes a la medida para mantener sus equipos y vehículos siempre operativos.",
  items: [
    { icon: ClipboardList, label: "Contratos de mantención" },
    { icon: Truck, label: "Flotas de vehículos" },
    { icon: Building2, label: "Oficinas y locales comerciales" },
  ],
  cta: { label: "Cotizar para mi empresa" },
};

export const WHY_US_SECTION = {
  eyebrow: "¿Por qué elegirnos?",
  title: "Calidad que se nota, detalles que se cuidan",
  subtitle:
    "Hacemos cada trabajo como si fuera para nuestra propia casa, para que tú solo te preocupes de disfrutar el clima ideal.",
};

export const WHY_US: Card[] = [
  {
    icon: BadgeCheck,
    title: "Calidad en cada trabajo",
    description:
      "Equipos, repuestos e insumos de calidad, instalados por técnicos especializados para que el resultado dure.",
  },
  {
    icon: Sparkles,
    title: "Dedicación al detalle",
    description:
      "Cuidamos cada etapa: desde la evaluación y la instalación hasta dejar tu espacio limpio y ordenado.",
  },
  {
    icon: Smile,
    title: "Disfruta sin preocupaciones",
    description:
      "Te entregamos todo funcionando y te explicamos cómo sacarle el máximo provecho. Sin complicaciones.",
  },
  {
    icon: Truck,
    title: "Cobertura en todo Chile",
    description: "Atendemos en toda la Región Metropolitana y enviamos repuestos a todo Chile.",
  },
];

export const PROCESS_SECTION = {
  eyebrow: "Así trabajamos",
  title: "Simple, en 3 pasos",
};

export const PROCESS_STEPS: Card[] = [
  {
    icon: ClipboardList,
    title: "Cotizas",
    description: "Completa el formulario o escríbenos por WhatsApp con lo que necesitas.",
  },
  {
    icon: CalendarCheck,
    title: "Coordinamos visita",
    description: "Te contactamos para confirmar detalles y agendar el día y la hora.",
  },
  {
    icon: Fan,
    title: "Solucionamos",
    description: "Realizamos el trabajo y te dejamos tu equipo funcionando como corresponde.",
  },
];

export const QUOTE_SECTION = {
  eyebrow: "Cotizar",
  title: "Solicita tu cotización",
  subtitle: "Cuéntanos qué necesitas y te responderemos a la brevedad. Sin compromiso.",
  successTitle: "¡Gracias por escribirnos!",
  successMessage:
    "Recibimos tu solicitud de cotización. Te contactaremos a la brevedad por correo o teléfono.",
};

export const FOOTER = {
  description:
    "Aire acondicionado domiciliario y vehicular, y repuestos especializados para calefacción automotriz.",
};
