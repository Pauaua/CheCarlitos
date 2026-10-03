"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Clock, LoaderCircle, Mail, Phone, Send } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { QUOTE_SECTION } from "@/lib/content";
import { QUOTE_PRESET_EVENT, type QuotePreset } from "@/lib/quote-preset";
import {
  CATEGORIES,
  CLIENT_TYPES,
  HONEYPOT_FIELD,
  type QuoteFieldErrors,
  type QuoteInput,
  SERVICE_OPTIONS,
  quoteSchema,
  toFieldErrors,
} from "@/lib/quote-schema";
import { SITE, phoneHref, whatsappUrl } from "@/lib/site";

type FormValues = {
  [K in keyof QuoteInput]-?: string;
};

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  clientType: "particular",
  companyName: "",
  city: "",
  service: "",
  category: "domiciliario",
  message: "",
};

type Status = "idle" | "loading" | "success" | "error";

export function QuoteForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Preselección desde los botones "Cotizar" de otras secciones
  useEffect(() => {
    const onPreset = (event: Event) => {
      const preset = (event as CustomEvent<QuotePreset>).detail;
      setValues((prev) => ({
        ...prev,
        ...(preset.service && { service: preset.service }),
        ...(preset.category && { category: preset.category }),
        ...(preset.clientType && { clientType: preset.clientType }),
        ...(preset.message && !prev.message && { message: preset.message }),
      }));
      setStatus((s) => (s === "success" ? "idle" : s));
    };
    window.addEventListener(QUOTE_PRESET_EVENT, onPreset);
    return () => window.removeEventListener(QUOTE_PRESET_EVENT, onPreset);
  }, []);

  const update = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const payload = {
      ...values,
      companyName: values.clientType === "empresa" ? values.companyName : "",
    };

    const parsed = quoteSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      // Lleva el foco al primer campo con error
      const firstField = Object.keys(fieldErrors)[0];
      if (firstField) document.getElementById(`quote-${firstField}`)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, [HONEYPOT_FIELD]: honeypot }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok: boolean; error?: string; fieldErrors?: QuoteFieldErrors }
        | null;

      if (!response.ok || !data?.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setErrorMessage(data?.error ?? "No pudimos enviar tu solicitud. Inténtalo nuevamente.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(INITIAL_VALUES);
      setErrors({});
    } catch {
      setErrorMessage("No pudimos conectarnos. Revisa tu conexión a internet e inténtalo nuevamente.");
      setStatus("error");
    }
  }

  return (
    <section id="cotizar" aria-labelledby="cotizar-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="cotizar-title" {...QUOTE_SECTION} />

        <Reveal className="mt-14 grid overflow-hidden rounded-[2rem] bg-white shadow-lift lg:grid-cols-[1fr_1.7fr]">
          <ContactPanel />

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CircleCheck className="h-9 w-9" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-3xl font-semibold uppercase">{QUOTE_SECTION.successTitle}</h3>
                  <p className="mt-3 max-w-md text-muted">{QUOTE_SECTION.successMessage}</p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className={buttonStyles({ variant: "secondary", className: "mt-8" })}
                  >
                    Enviar otra solicitud
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="grid gap-5 sm:grid-cols-2"
                  aria-describedby="quote-required-hint"
                >
                  <p id="quote-required-hint" className="text-sm text-muted sm:col-span-2">
                    Los campos marcados con <span className="text-brand-orange-dark">*</span> son obligatorios.
                  </p>

                  <Field label="Nombre" name="name" required error={errors.name}>
                    <input
                      {...inputProps("name", errors.name)}
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </Field>

                  <Field label="Correo" name="email" required error={errors.email}>
                    <input
                      {...inputProps("email", errors.email)}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </Field>

                  <Field label="Teléfono" name="phone" required error={errors.phone}>
                    <input
                      {...inputProps("phone", errors.phone)}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+56 9 1234 5678"
                      value={values.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </Field>

                  <Field label="Comuna o ciudad" name="city" error={errors.city}>
                    <input
                      {...inputProps("city", errors.city)}
                      type="text"
                      autoComplete="address-level2"
                      value={values.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </Field>

                  <RadioGroup
                    legend="Tipo de cliente"
                    name="clientType"
                    options={CLIENT_TYPES}
                    value={values.clientType}
                    onChange={(v) => update("clientType", v)}
                    error={errors.clientType}
                  />

                  <RadioGroup
                    legend="Tipo"
                    name="category"
                    options={CATEGORIES}
                    value={values.category}
                    onChange={(v) => update("category", v)}
                    error={errors.category}
                  />

                  {values.clientType === "empresa" && (
                    <Field label="Nombre de empresa" name="companyName" error={errors.companyName} optional>
                      <input
                        {...inputProps("companyName", errors.companyName)}
                        type="text"
                        autoComplete="organization"
                        value={values.companyName}
                        onChange={(e) => update("companyName", e.target.value)}
                      />
                    </Field>
                  )}

                  <Field
                    label="Servicio o producto de interés"
                    name="service"
                    required
                    error={errors.service}
                    className={values.clientType === "empresa" ? "" : "sm:col-span-2"}
                  >
                    <select
                      {...inputProps("service", errors.service)}
                      value={values.service}
                      onChange={(e) => update("service", e.target.value)}
                    >
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Mensaje" name="message" error={errors.message} className="sm:col-span-2" optional>
                    <textarea
                      {...inputProps("message", errors.message)}
                      rows={4}
                      placeholder="Cuéntanos qué necesitas: tipo de equipo, modelo del vehículo, etc."
                      value={values.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </Field>

                  {/* Honeypot anti-spam: oculto para personas, visible para bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor={`quote-${HONEYPOT_FIELD}`}>No completar este campo</label>
                    <input
                      id={`quote-${HONEYPOT_FIELD}`}
                      name={HONEYPOT_FIELD}
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {status === "error" && errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:col-span-2"
                    >
                      <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                      {errorMessage}
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}
                    >
                      {status === "loading" ? (
                        <>
                          <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" aria-hidden="true" />
                          Solicitar cotización
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-xs text-muted">
                      Usaremos tus datos solo para responder tu solicitud.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Subcomponentes ───────────────────────── */

const fieldClasses =
  "w-full rounded-xl border bg-white px-4 py-3 text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10";

function inputProps(name: keyof FormValues, error?: string) {
  return {
    id: `quote-${name}`,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `quote-${name}-error` : undefined,
    className: `${fieldClasses} ${error ? "border-red-400" : "border-brand-navy/15"}`,
  };
}

function Field({
  label,
  name,
  required,
  optional,
  error,
  className = "",
  children,
}: {
  label: string;
  name: keyof FormValues;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={`quote-${name}`} className="mb-1.5 block text-sm font-medium text-brand-navy">
        {label}
        {required && (
          <span className="text-brand-orange-dark" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {optional && <span className="font-normal text-muted"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`quote-${name}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
}: {
  legend: string;
  name: keyof FormValues;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <fieldset id={`quote-${name}`} tabIndex={-1} className="outline-none">
      <legend className="mb-1.5 block text-sm font-medium text-brand-navy">
        {legend}
        <span className="text-brand-orange-dark" aria-hidden="true">
          {" "}
          *
        </span>
      </legend>
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-brand-ice p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-lg px-3 py-2.5 text-center text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-orange ${
              value === option.value ? "bg-white text-brand-navy shadow-soft" : "text-muted hover:text-brand-navy"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-700">{error}</p>}
    </fieldset>
  );
}

/** Panel lateral con datos de contacto directo. */
function ContactPanel() {
  const items: { icon: ReactNode; label: string; value: string; href: string; external?: boolean }[] = [
    { icon: <Mail className="h-5 w-5" aria-hidden="true" />, label: "Correo", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: <Phone className="h-5 w-5" aria-hidden="true" />, label: "Teléfono", value: SITE.phone, href: phoneHref() },
    {
      icon: <WhatsAppIcon className="h-5 w-5" />,
      label: "WhatsApp",
      value: "Escríbenos directo",
      href: whatsappUrl(),
      external: true,
    },
  ];

  return (
    <aside className="relative overflow-hidden bg-brand-navy p-8 text-white sm:p-10">
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-brand-orange/40 blur-3xl"
      />
      <div aria-hidden="true" className="bg-cold-warm absolute inset-x-0 top-0 h-1" />
      <div className="relative">
        <h3 className="text-2xl font-semibold uppercase text-white">¿Prefieres hablar directo?</h3>
        <p className="mt-3 text-white/85">
          También puedes contactarnos por estos medios. Respondemos lo antes posible.
        </p>

        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                className="group flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-navy">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-white/80">{item.label}</span>
                  <span className="block break-all text-sm font-medium sm:text-base">{item.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex items-center gap-2 text-sm text-white/85">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {/* PLACEHOLDER: horario de atención */}
          Lunes a viernes de 9:00 a 18:00 hrs.
        </p>
      </div>
    </aside>
  );
}
